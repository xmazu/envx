package proxy

import (
	"fmt"
	"net"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"syscall"
)

func FindFreePort() (int, error) {
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return 0, err
	}
	port := listener.Addr().(*net.TCPAddr).Port
	_ = listener.Close()
	return port, nil
}

func Run(name string, command []string, workdir string, force bool) (port int, cmd *exec.Cmd, err error) {
	port, err = FindFreePort()
	if err != nil {
		return 0, nil, err
	}

	cmd = exec.Command(command[0], command[1:]...)
	cmd.Env = append(os.Environ(), "PORT="+strconv.Itoa(port), "HOST=0.0.0.0")
	if workdir != "" {
		cmd.Dir = workdir
	}
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	if err := cmd.Start(); err != nil {
		return 0, nil, err
	}

	state, err := NewState(DefaultPort)
	if err != nil {
		_ = cmd.Process.Kill()
		return 0, nil, err
	}
	if err := state.AddRoute(name, port, cmd.Process.Pid, force); err != nil {
		_ = cmd.Process.Kill()
		return 0, nil, err
	}

	fmt.Printf("→ https://%s.localhost:%d\n", name, DefaultPort)
	return port, cmd, nil
}

func RemoveRoute(name string) {
	state, err := NewState(DefaultPort)
	if err != nil {
		return
	}
	state.RemoveRoute(name)
}

func KillProcess(pid int) error {
	pgid, err := syscall.Getpgid(pid)
	if err != nil {
		return syscall.Kill(pid, syscall.SIGTERM)
	}
	return syscall.Kill(-pgid, syscall.SIGTERM)
}

// KillProcessOnPort finds the process listening on the given port (via lsof) and kills it.
// Used when there is no PID file (e.g. proxy was started in-process by proxy run).
func KillProcessOnPort(port int) (killed bool, err error) {
	cmd := exec.Command("lsof", "-ti", fmt.Sprintf("tcp:%d", port))
	out, err := cmd.Output()
	if err != nil {
		return false, nil // no process or lsof failed
	}
	pids := strings.Fields(strings.TrimSpace(string(out)))
	for _, s := range pids {
		pid, err := strconv.Atoi(s)
		if err != nil {
			continue
		}
		_ = KillProcess(pid)
		killed = true
	}
	return killed, nil
}
