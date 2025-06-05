#!/usr/bin/env bash
# markdownlint.sh - Production-ready Markdown linting script
# 
# DESCRIPTION:
#   Automated, headless Markdown linting with auto-installation and configuration
#   Supports both individual files and project-wide linting
#   Battle-tested for CI/CD environments and headless operations
#
# USAGE:
#   ./markdownlint.sh                    # Lint all .md files in project
#   ./markdownlint.sh file1.md file2.md # Lint specific files
#   ./markdownlint.sh --fix             # Auto-fix issues where possible
#   ./markdownlint.sh --check           # Check-only mode (no fixes)
#   ./markdownlint.sh --silent          # Silent mode (minimal output)
#   ./markdownlint.sh --help            # Show help
#
# REQUIREMENTS:
#   - Bash 4.0+
#   - Node.js 14+ (auto-installed if missing on supported systems)
#   - Internet connection (for initial setup)

set -euo pipefail

# Script metadata
readonly SCRIPT_NAME="markdownlint.sh"
readonly SCRIPT_VERSION="2.0.0"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Configuration
readonly CONFIG_FILE="${PROJECT_ROOT}/.markdownlint.json"
readonly IGNORE_FILE="${PROJECT_ROOT}/.markdownlintignore"
readonly LOG_FILE="${PROJECT_ROOT}/.markdownlint.log"

# Global flags
AUTO_FIX=0
CHECK_ONLY=0
SILENT_MODE=0

# Logging functions
log() {
    if [[ "$SILENT_MODE" != "1" ]]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
    fi
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE" 2>/dev/null || true
}

log_error() {
    echo "[ERROR] [$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
    echo "[ERROR] [$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE" 2>/dev/null || true
}

log_success() {
    if [[ "$SILENT_MODE" != "1" ]]; then
        echo "✓ $*" >&2
    fi
    echo "[SUCCESS] [$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE" 2>/dev/null || true
}

# Help function
show_help() {
    cat << EOF
$SCRIPT_NAME v$SCRIPT_VERSION - Production Markdown Linter

USAGE:
    $SCRIPT_NAME [OPTIONS] [FILES...]

OPTIONS:
    --fix               Auto-fix issues where possible
    --check             Check-only mode (no fixes, exit non-zero on issues)
    --silent            Silent mode (minimal console output)
    --help              Show this help message
    --version           Show version information

EXAMPLES:
    $SCRIPT_NAME                           # Lint all .md files
    $SCRIPT_NAME README.md CHANGELOG.md    # Lint specific files
    $SCRIPT_NAME --fix                     # Lint and auto-fix all files
    $SCRIPT_NAME --check --silent          # CI/CD friendly check

CONFIGURATION:
    .markdownlint.json      Configuration file (auto-created)
    .markdownlintignore     Ignore patterns file (auto-created)
    .markdownlint.log       Operation log file

REQUIREMENTS:
    - Bash 4.0+
    - Node.js 14+ (auto-installed on supported systems)
    - Internet connection (initial setup)

EOF
}

# Parse command line arguments
parse_args() {
    local files=()
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --version|-v)
                echo "$SCRIPT_NAME v$SCRIPT_VERSION"
                exit 0
                ;;
            --fix)
                AUTO_FIX=1
                shift
                ;;
            --check)
                CHECK_ONLY=1
                shift
                ;;
            --silent)
                SILENT_MODE=1
                shift
                ;;
            -*)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
            *)
                files+=("$1")
                shift
                ;;
        esac
    done
    
    # Set global files array
    LINT_FILES=("${files[@]}")
}

# System detection
detect_system() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get >/dev/null 2>&1; then
            echo "debian"
        elif command -v yum >/dev/null 2>&1; then
            echo "rhel"
        elif command -v pacman >/dev/null 2>&1; then
            echo "arch"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

# Auto-install Node.js based on system
install_nodejs() {
    local system
    system=$(detect_system)
    
    log "Auto-installing Node.js for $system..."
    
    case $system in
        debian)
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - >/dev/null 2>&1 &&
            sudo apt-get install -y nodejs >/dev/null 2>&1
            ;;
        rhel)
            curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash - >/dev/null 2>&1 &&
            sudo yum install -y nodejs npm >/dev/null 2>&1
            ;;
        arch)
            sudo pacman -S --noconfirm nodejs npm >/dev/null 2>&1
            ;;
        macos)
            if command -v brew >/dev/null 2>&1; then
                brew install node >/dev/null 2>&1
            else
                log_error "Homebrew not found. Install Node.js manually: https://nodejs.org/"
                return 1
            fi
            ;;
        *)
            log_error "Cannot auto-install Node.js on this system ($system)"
            log_error "Please install Node.js 14+ manually: https://nodejs.org/"
            return 1
            ;;
    esac
}

# Check Node.js availability
check_nodejs() {
    if command -v node >/dev/null 2>&1; then
        local node_version
        node_version=$(node --version | sed 's/v//' | cut -d. -f1)
        if [[ $node_version -ge 14 ]]; then
            return 0
        else
            log "Node.js version $node_version is too old (requires 14+)"
        fi
    fi
    
    log "Node.js not found or outdated. Attempting auto-install..."
    if install_nodejs; then
        log_success "Node.js installed successfully"
    else
        log_error "Failed to install Node.js. Please install manually."
        exit 1
    fi
}

# Install markdownlint-cli
install_markdownlint() {
    log "Installing markdownlint-cli..."
    
    if npm install -g markdownlint-cli >/dev/null 2>&1; then
        log_success "markdownlint-cli installed globally"
    elif npx markdownlint-cli@latest --version >/dev/null 2>&1; then
        log_success "markdownlint-cli available via npx"
    else
        log_error "Failed to install markdownlint-cli"
        return 1
    fi
}

# Ensure markdownlint is available
ensure_markdownlint() {
    if npx markdownlint-cli --version >/dev/null 2>&1; then
        return 0
    fi
    
    log "markdownlint-cli not found. Installing..."
    install_markdownlint || {
        log_error "Cannot install markdownlint-cli"
        exit 1
    }
}

# Create default configuration if missing
create_default_config() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        log "Creating default configuration file..."
        cat > "$CONFIG_FILE" << 'EOF'
{
  "default": true,
  "MD001": true,
  "MD003": { "style": "atx" },
  "MD004": { "style": "dash" },
  "MD007": { "indent": 2 },
  "MD009": { "br_spaces": 2 },
  "MD010": false,
  "MD013": { "line_length": 120, "tables": false },
  "MD024": { "allow_different_nesting": true },
  "MD025": { "front_matter_title": "^\\s*title\\s*[:=]" },
  "MD026": { "punctuation": ".,;:!" },
  "MD029": { "style": "ordered" },
  "MD033": { "allowed_elements": ["br", "sub", "sup", "kbd", "details", "summary"] },
  "MD034": false,
  "MD036": false,
  "MD041": false,
  "MD046": { "style": "fenced" },
  "MD049": { "style": "underscore" },
  "MD050": { "style": "asterisk" }
}
EOF
    fi
    
    if [[ ! -f "$IGNORE_FILE" ]]; then
        log "Creating default ignore file..."
        cat > "$IGNORE_FILE" << 'EOF'
node_modules/
.git/
.vscode/
dist/
build/
.cache/
*.min.md
**/CHANGELOG.md
**/LICENSE.md
EOF
    fi
}

# Find all markdown files in project
find_markdown_files() {
    find "$PROJECT_ROOT" -name "*.md" -type f \
        ! -path "*/node_modules/*" \
        ! -path "*/.git/*" \
        ! -path "*/.vscode/*" \
        ! -path "*/dist/*" \
        ! -path "*/build/*" \
        ! -path "*/.cache/*" \
        2>/dev/null || true
}

# Run markdownlint
run_markdownlint() {
    local files=("$@")
    local cmd="npx markdownlint-cli"
    
    # Add configuration
    if [[ -f "$CONFIG_FILE" ]]; then
        cmd="$cmd --config $CONFIG_FILE"
    fi
    
    # Add ignore file
    if [[ -f "$IGNORE_FILE" ]]; then
        cmd="$cmd --ignore-path $IGNORE_FILE"
    fi
    
    # Add fix flag
    if [[ $AUTO_FIX -eq 1 && $CHECK_ONLY -eq 0 ]]; then
        cmd="$cmd --fix"
    fi
    
    if [[ ${#files[@]} -eq 0 ]]; then
        # Find all files
        local all_files
        readarray -t all_files < <(find_markdown_files)
        
        if [[ ${#all_files[@]} -eq 0 ]]; then
            log "No Markdown files found in project"
            return 0
        fi
        
        log "Found ${#all_files[@]} Markdown files to lint"
        files=("${all_files[@]}")
    else
        log "Linting ${#files[@]} specified files"
    fi
    
    # Run the command
    if $cmd "${files[@]}" 2>/dev/null; then
        return 0
    elif [[ $CHECK_ONLY -eq 1 ]]; then
        return 1  # Exit with error code for CI/CD
    else
        return 0  # Don't fail in normal mode
    fi
}

# Main function
main() {
    log "Starting $SCRIPT_NAME v$SCRIPT_VERSION"
    
    # Parse arguments
    parse_args "$@"
    
    # Setup
    check_nodejs
    ensure_markdownlint
    create_default_config
    
    # Run linting
    if run_markdownlint "${LINT_FILES[@]}"; then
        log_success "Markdown linting completed successfully"
        exit 0
    else
        log_error "Markdown linting found issues"
        exit 1
    fi
}

# Global variables for parsed arguments
declare -a LINT_FILES

# Run main function with all arguments
main "$@"

