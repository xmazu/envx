package proxy

import (
	"os"
	"path/filepath"
	"strconv"
)

// fixOwnership chowns files to SUDO_UID/SUDO_GID when running as root (e.g. via sudo).
// No-op when not root.
func fixOwnership(dir string, paths ...string) error {
	if os.Geteuid() != 0 {
		return nil
	}
	uidStr := os.Getenv("SUDO_UID")
	gidStr := os.Getenv("SUDO_GID")
	if uidStr == "" || gidStr == "" {
		return nil
	}
	uid, err := strconv.Atoi(uidStr)
	if err != nil {
		return nil
	}
	gid, err := strconv.Atoi(gidStr)
	if err != nil {
		return nil
	}
	for _, p := range paths {
		_ = os.Chown(p, uid, gid)
	}
	// Also chown the lock dir if it exists
	lockPath := filepath.Join(dir, "routes.lock")
	if info, err := os.Stat(lockPath); err == nil && info.IsDir() {
		_ = os.Chown(lockPath, uid, gid)
	}
	return nil
}
