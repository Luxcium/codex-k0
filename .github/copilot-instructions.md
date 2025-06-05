# GitHub Copilot Instructions

## Project Context

This is the **Codex-K0 Memory Bank System** - a comprehensive documentation framework for AI agent continuity. The project
implements a hierarchical memory structure that enables perfect context persistence across sessions.

## Code Style & Patterns

### General Guidelines

- Follow existing patterns established in the Memory Bank structure
- Maintain cross-references between files to avoid duplication
- Use `[TO BE DEFINED]` placeholders for incomplete information
- Always update relevant Memory Bank files when making changes

### Documentation Standards

- Use clear, descriptive headers with purpose statements
- Include "Instructions for AI Agents" sections in templates
- Maintain consistency with existing markdown formatting
- Follow the established file naming conventions

### Script Development

- Use bash for cross-platform compatibility
- Include comprehensive error handling and logging
- Auto-detect and install dependencies when possible
- Support both interactive and headless execution modes

## Memory Bank Workflow

When working on this project:

1. **ALWAYS** read all Memory Bank files before starting work
2. **UPDATE** `activeContext.md` before beginning new tasks
3. **DOCUMENT** changes in `progress.md` as work progresses
4. **MAINTAIN** cross-references between related files
5. **USE** the `.clinerules` patterns for project intelligence

## File Structure Awareness

- `memory-bank/` - Core documentation system (read-only unless updating templates)
- `scripts/` - Automation tools (enhancement and maintenance)
- Configuration files (`.markdownlint.*`, `.gitignore`) support the development workflow

## Key Principles

- **Memory Persistence**: Every session starts fresh - Memory Bank provides continuity
- **Self-Instruction**: All documentation must be complete and actionable
- **Quality Enforcement**: Lint and validate all changes
- **Evolution Tracking**: Document learnings and patterns in Memory Bank

## Common Patterns

### For Script Enhancement

```bash
# Standard script structure
set -euo pipefail
readonly SCRIPT_NAME="script-name"
readonly PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}
```

### For Documentation

```markdown
# Title

> **PURPOSE STATEMENT** - Clear description of what this document covers

## Instructions for AI Agents

[Clear instructions for how AI agents should use this file]

## Content sections...
```

### For Memory Bank Updates

- Read existing content before making changes
- Maintain established cross-reference patterns
- Update modification timestamps where relevant
- Preserve placeholder structure for future completion
