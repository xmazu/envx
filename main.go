package main

import (
	"github.com/xmazu/envx/cmd"
)

var (
	Version   string
	BuildTime string
)

func main() {
	cmd.SetVersion(Version)
	cmd.Execute()
}
