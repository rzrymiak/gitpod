# Testdata/Render

This contains the test data for building the render tests

## Versions

The values in the `versions.golden` are not important. The important thing is that the key/value pairs exist. This represents the container images and the tags used by the Installer. This will only need to be updated when a new image is added and used by the Installer.

As a convention, the values are all set to `test`.

> This `yq` syntax is [v3](https://mikefarah.gitbook.io/yq/v/v3.x/), which is the version in use by Gitpod workspaces.

```shell
# Get the VERSION from werft.gitpod-dev.com
VERSION=main.3859 make getRenderVersionManifest
```

## Generating a new test file

To generate a new test, the following process must be followed - in this example, the name of the test will be `testname`, but this should be substituted for whatever you want to call it. This becomes the unit test name and is how the files are stored in the codebase, so it should be descriptive.

First, create your folder:

```shell
mkdir -p ./cmd/testdata/render/testname
```

Second, create your config file and amend it as required:

```shell
go run . init > ./cmd/testdata/render/testname/config.golden
```

Third, generate your output:

```shell
TESTNAME=testname make generateRenderTest
```
