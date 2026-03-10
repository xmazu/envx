package services

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"
	"time"
)

type PackageManager string

const (
	PackageManagerBun  PackageManager = "bun"
	PackageManagerPnpm PackageManager = "pnpm"
	PackageManagerNpm  PackageManager = "npm"
)

func detectPackageManager(projectDir string) PackageManager {
	if _, err := os.Stat(filepath.Join(projectDir, "bun.lock")); err == nil {
		return PackageManagerBun
	}
	if _, err := os.Stat(filepath.Join(projectDir, "pnpm-lock.yaml")); err == nil {
		return PackageManagerPnpm
	}
	if _, err := os.Stat(filepath.Join(projectDir, "package-lock.json")); err == nil {
		return PackageManagerNpm
	}
	return PackageManagerNpm
}

type App struct {
	Name      string            `json:"name"`
	Cwd       string            `json:"cwd"`
	Command   string            `json:"command"`
	Env       map[string]string `json:"env,omitempty"`
	DependsOn []string          `json:"depends_on,omitempty"`
}

type AppsConfig struct {
	Apps []App `json:"apps"`
}

type AppStatus struct {
	Name   string `json:"name"`
	PID    int    `json:"pid"`
	Status string `json:"status"`
}

type AppRunner struct {
	apps   map[string]*runningApp
	config *AppsConfig
}

type runningApp struct {
	app    App
	cmd    *exec.Cmd
	status AppStatus
}

func NewAppRunner() *AppRunner {
	return &AppRunner{
		apps: make(map[string]*runningApp),
	}
}

func (r *AppRunner) LoadConfig(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}

	var config AppsConfig
	if err := json.Unmarshal(data, &config); err != nil {
		return err
	}

	r.config = &config
	return nil
}

func (r *AppRunner) Start() error {
	if r.config == nil || len(r.config.Apps) == 0 {
		return nil
	}

	var wg sync.WaitGroup
	errors := make(chan error, len(r.config.Apps))

	for _, app := range r.config.Apps {
		wg.Add(1)
		go func(a App) {
			defer wg.Done()
			if err := r.startApp(a); err != nil {
				errors <- err
			}
		}(app)
	}

	wg.Wait()
	close(errors)

	var errs []string
	for err := range errors {
		errs = append(errs, err.Error())
	}

	if len(errs) > 0 {
		return fmt.Errorf("failed to start some apps: %s", strings.Join(errs, "; "))
	}

	return nil
}

func (r *AppRunner) Stop() error {
	var wg sync.WaitGroup
	errors := make(chan error, len(r.apps))

	for name, ra := range r.apps {
		wg.Add(1)
		go func(n string, app *runningApp) {
			defer wg.Done()
			if err := r.stopApp(n, app); err != nil {
				errors <- err
			}
		}(name, ra)
	}

	wg.Wait()
	close(errors)

	var errs []string
	for err := range errors {
		errs = append(errs, err.Error())
	}

	if len(errs) > 0 {
		return fmt.Errorf("failed to stop some apps: %s", strings.Join(errs, "; "))
	}

	return nil
}

func (r *AppRunner) Status() []AppStatus {
	var statuses []AppStatus
	for _, ra := range r.apps {
		if ra.cmd != nil && ra.cmd.Process != nil {
			if err := ra.cmd.Process.Signal(syscall.Signal(0)); err == nil {
				ra.status.Status = "running"
			} else {
				ra.status.Status = "stopped"
			}
		}
		statuses = append(statuses, ra.status)
	}
	return statuses
}

func (r *AppRunner) HasApps() bool {
	return r.config != nil && len(r.config.Apps) > 0
}

func (r *AppRunner) startApp(app App) error {
	parts := strings.Fields(app.Command)
	if len(parts) == 0 {
		return fmt.Errorf("empty command")
	}

	cmd := r.buildCommand(app, parts)
	cmd.Dir = app.Cwd
	cmd.Env = os.Environ()
	for k, v := range app.Env {
		cmd.Env = append(cmd.Env, fmt.Sprintf("%s=%s", k, v))
	}
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Start(); err != nil {
		return err
	}

	r.apps[app.Name] = &runningApp{
		app: app,
		cmd: cmd,
		status: AppStatus{
			Name:   app.Name,
			PID:    cmd.Process.Pid,
			Status: "running",
		},
	}

	return nil
}

func (r *AppRunner) buildCommand(app App, parts []string) *exec.Cmd {
	pm := detectPackageManager(app.Cwd)

	switch pm {
	case PackageManagerBun:
		return exec.Command("bun", append([]string{"run"}, parts...)...)
	case PackageManagerPnpm:
		return exec.Command("pnpm", append([]string{"exec"}, parts...)...)
	default:
		return exec.Command("npx", parts...)
	}
}

func (r *AppRunner) stopApp(name string, ra *runningApp) error {
	if ra.cmd == nil || ra.cmd.Process == nil {
		return nil
	}

	if err := ra.cmd.Process.Signal(syscall.SIGTERM); err != nil {
		if err != syscall.ESRCH {
			ra.cmd.Process.Kill()
		}
	}

	done := make(chan error, 1)
	go func() {
		done <- ra.cmd.Wait()
	}()

	select {
	case <-done:
	case <-time.After(5 * time.Second):
		ra.cmd.Process.Kill()
	}

	ra.status.Status = "stopped"
	return nil
}
