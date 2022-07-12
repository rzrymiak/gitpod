// Copyright (c) 2022 Gitpod GmbH. All rights reserved.
// Licensed under the MIT License. See License-MIT.txt in the project root for license information.

package cmd

import (
	"io/ioutil"
	"testing"

	"github.com/stretchr/testify/require"
)

func init() {
	// Ensure that the randomisation always returns the same values
	rootOpts.DisableRandom = true
	disableRandom(false)()
}

func TestRender(t *testing.T) {
	testCases := []struct {
		Name string
	}{
		{
			Name: "simple",
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.Name, func(t *testing.T) {
			rootOpts.VersionMF = "testdata/render/versions.golden"
			renderOpts.ConfigFN = "testdata/render/" + testCase.Name + "/config.golden"

			content, err := ioutil.ReadFile("testdata/render/" + testCase.Name + "/output.golden")
			if err != nil {
				require.NoError(t, err)
			}

			yaml, err := renderFn()
			require.NoError(t, err)

			got := ""
			for _, item := range yaml {
				got += item + "\n"
			}

			require.Equal(t, string(content), got)
		})
	}
}
