package services

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
)

type Manager struct {
	runtime Runtime
	root    string
	apps    *AppRunner
}

func NewManager(root string) (*Manager, error) {
	rt := NewDocker()
	if !rt.IsAvailable() {
		return nil, fmt.Errorf("docker compose not available")
	}

	apps := NewAppRunner()
	appsFile := filepath.Join(root, ".openenvx", "apps.json")
	if err := apps.LoadConfig(appsFile); err != nil {
		return nil, err
	}

	return &Manager{runtime: rt, root: root, apps: apps}, nil
}

func (m *Manager) composeFile() string {
	return filepath.Join(m.root, ".openenvx", "services.yaml")
}

func (m *Manager) appsFile() string {
	return filepath.Join(m.root, ".openenvx", "apps.json")
}

func (m *Manager) hasComposeConfig() bool {
	_, err := os.Stat(m.composeFile())
	return err == nil
}

func (m *Manager) hasAppsConfig() bool {
	_, err := os.Stat(m.appsFile())
	return err == nil
}

func (m *Manager) Start(ctx context.Context) error {
	if m.hasComposeConfig() {
		if err := m.runtime.Start(ctx, m.composeFile()); err != nil {
			return err
		}
	}

	if m.hasAppsConfig() {
		if err := m.apps.Start(); err != nil {
			return err
		}
	}

	return nil
}

func (m *Manager) Stop(ctx context.Context) error {
	if m.hasAppsConfig() {
		if err := m.apps.Stop(); err != nil {
			return err
		}
	}

	if m.hasComposeConfig() {
		if err := m.runtime.Stop(ctx, m.composeFile()); err != nil {
			return err
		}
	}

	return nil
}

type CombinedStatus struct {
	Services []Status
	Apps     []AppStatus
}

func (m *Manager) Status(ctx context.Context) (*CombinedStatus, error) {
	result := &CombinedStatus{
		Services: []Status{},
		Apps:     []AppStatus{},
	}

	if m.hasComposeConfig() {
		services, err := m.runtime.Status(ctx, m.composeFile())
		if err != nil {
			return nil, err
		}
		result.Services = services
	}

	if m.hasAppsConfig() {
		result.Apps = m.apps.Status()
	}

	return result, nil
}
