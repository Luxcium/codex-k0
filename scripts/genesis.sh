#!/usr/bin/env bash
# genesis.sh - Minimal genesis boot-phase script
# Usage: ./genesis.sh

set -euo pipefail

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

# Step 1: Check node_modules folder
if [ ! -d node_modules ]; then
  log "node_modules missing"

  # Step 2a: Detect package manager
  detect_package_manager() {
    if [ -f pnpm-lock.yaml ]; then
      echo pnpm
    elif [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
      echo npm
    elif [ -f yarn.lock ]; then
      echo yarn
    else
      echo npm
    fi
  }

  PACKAGE_MANAGER=$(detect_package_manager)
  log "Detected package manager: $PACKAGE_MANAGER"

  # Step 2b: pnpm workspace check
  if [ "$PACKAGE_MANAGER" = pnpm ] && [ -f pnpm-workspace.yaml ]; then
    log "pnpm workspace detected"
  fi

  # Step 2c: Install dependencies
  case "$PACKAGE_MANAGER" in
    pnpm)
      pnpm install ;;
    npm)
      npm install ;;
    yarn)
      yarn install ;;
  esac
else
  log "node_modules already present"
fi

# Step 3: Verify node_modules exists
if [ -d node_modules ]; then
  log "Dependencies installed"
else
  log "Dependency installation failed"
fi

# Step 4: Detect container environment
CONTAINER="host"
if [ -f /.dockerenv ] || [ "${CI:-}" = "true" ]; then
  CONTAINER="container"
fi
log "Running inside $CONTAINER"

# Step 5: Validate Git repo
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  log "Git status on branch $BRANCH"
  git status --short
else
  log "Not a git repository"
fi

log "Genesis phase complete"
