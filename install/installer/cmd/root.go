// Copyright (c) 2021 Gitpod GmbH. All rights reserved.
// Licensed under the GNU Affero General Public License (AGPL).
// See License-AGPL.txt in the project root for license information.

package cmd

import (
	cryptoRand "crypto/rand"
	"fmt"
	"math/rand"
	"os"
	"os/user"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "gitpod-installer",
	Short: "Installs Gitpod",
}

func Execute() {
	cobra.CheckErr(rootCmd.Execute())
}

var rootOpts struct {
	VersionMF         string
	StrictConfigParse bool
	DisableRandom     bool
}

func init() {
	cobra.OnInitialize(disableRandom(true))
	rootCmd.PersistentFlags().StringVar(&rootOpts.VersionMF, "debug-version-file", "", "path to a version manifest - not intended for production use")
	rootCmd.PersistentFlags().BoolVar(&rootOpts.DisableRandom, "disable-random", false, "disable creation of random values - not intended for production use")
	rootCmd.PersistentFlags().BoolVar(&rootOpts.StrictConfigParse, "strict-parse", true, "toggle strict configuration parsing")
}

func disableRandom(displayMsg bool) func() {
	return func() {
		if rootOpts.DisableRandom {
			if displayMsg {
				fmt.Fprintf(os.Stderr, "Warning: random values will not be generated. This should not be used in production.\n")
			}

			rand.Seed(42)
			str := ""
			for i := 0; i < 64; i++ {
				str += strconv.Itoa(i % 10)
			}
			cryptoRand.Reader = strings.NewReader(str)
		}
	}
}

type kubeConfig struct {
	Config string
}

// checkKubeConfig performs validation on the Kubernetes struct and fills in default values if necessary
func checkKubeConfig(kube *kubeConfig) error {
	if kube.Config == "" {
		kube.Config = os.Getenv("KUBECONFIG")
	}
	if kube.Config == "" {
		u, err := user.Current()
		if err != nil {
			return err
		}
		kube.Config = filepath.Join(u.HomeDir, ".kube", "config")
	}

	return nil
}
