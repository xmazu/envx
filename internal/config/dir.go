package config

import (
	"os"
	"path/filepath"
)

const (
	ConfigDirEnv = "ENVX_CONFIG_DIR"
	ConfigSubdir = "envx"
)

func ConfigDir() string {
	if d := os.Getenv(ConfigDirEnv); d != "" {
		return d
	}
	home, _ := os.UserHomeDir()
	if home == "" {
		return filepath.Join(".", ConfigSubdir)
	}
	return filepath.Join(home, ".config", ConfigSubdir)
}
