#!/usr/bin/env bash
# markdownlint.sh - Lint Markdown files using markdownlint
# Usage: ./markdownlint.sh [files]

set -e

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required but not installed" >&2
  exit 1
fi

npx markdownlint "$@"

