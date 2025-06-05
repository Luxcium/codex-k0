# Scripts Directory

This folder contains utility scripts that help manage the project
environment and code quality. Each script is designed to be lightweight
and self-contained so it can be executed directly without additional
dependencies beyond what is already expected for the project. Keeping
these scripts small and well-documented ensures that any AI agent or human
contributor can understand and run them with minimal setup.

## env-info.sh

`env-info.sh` gathers information about the current execution environment. It
checks whether the project is running inside a container and extracts
details such as the kernel version, base operating system, user, and
working directory. This helps validate the runtime context during each
lifecycle phase and is useful for troubleshooting or for CI/CD pipelines
that need to capture environment metadata.

## markdownlint.sh

`markdownlint.sh` runs
[markdownlint](https://github.com/DavidAnson/markdownlint) across specified
Markdown files to enforce consistent style. The script invokes `markdownlint`
via `npx` so it does not require a global installation. It is intended to
be executed before commits or as part of automated quality checks to ensure
all Markdown files in the repository adhere to project formatting rules.
