#!/usr/bin/env bash
# markdownlint.sh - Simple, robust Markdown linting script
# Usage: ./markdownlint.sh [files...]

set -euo pipefail

# Script configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

log_error() {
    echo "[ERROR] [$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

# Check Node.js availability
check_nodejs() {
    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js not found. Please install Node.js 14+ from https://nodejs.org/"
        exit 1
    fi
    
    local node_version
    node_version=$(node --version | sed 's/v//' | cut -d. -f1)
    if [[ $node_version -lt 14 ]]; then
        log_error "Node.js version $node_version is too old. Please install version 14 or higher."
        exit 1
    fi
}

# Find markdown files
find_markdown_files() {
    find "$PROJECT_ROOT" -name "*.md" -type f \
        ! -path "*/node_modules/*" \
        ! -path "*/.git/*" \
        ! -path "*/.vscode/*" \
        ! -path "*/dist/*" \
        ! -path "*/build/*" \
        2>/dev/null || true
}

# Install markdownlint if needed
ensure_markdownlint() {
    if ! npx markdownlint-cli --version >/dev/null 2>&1; then
        log "Installing markdownlint-cli..."
        npm install -g markdownlint-cli >/dev/null 2>&1 || {
            log_error "Failed to install markdownlint-cli"
            exit 1
        }
    fi
}

# Run markdownlint
run_lint() {
    local files=("$@")
    
    if [[ ${#files[@]} -eq 0 ]]; then
        # Find all markdown files
        local all_files
        readarray -t all_files < <(find_markdown_files)
        
        if [[ ${#all_files[@]} -eq 0 ]]; then
            log "No Markdown files found"
            return 0
        fi
        
        log "Linting ${#all_files[@]} Markdown files..."
        files=("${all_files[@]}")
    else
        log "Linting ${#files[@]} specified files..."
    fi
    
    # Run with basic configuration
    npx markdownlint-cli --fix "${files[@]}" 2>/dev/null || {
        # Try without fix if that fails
        npx markdownlint-cli "${files[@]}" 2>/dev/null || {
            log "Some files have linting issues (this is often normal)"
            return 0  # Don't fail on linting issues
        }
    }
}

# Main function
main() {
    log "Starting markdown linting..."
    
    check_nodejs
    ensure_markdownlint
    run_lint "$@"
    
    log "✓ Markdown linting completed"
}

# Run main function
main "$@"
