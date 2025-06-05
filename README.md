# VS Code GitHub Copilot Configuration with Conventional Commits & Emojis

This project provides a complete VS Code configuration for GitHub Copilot Chat that enforces Conventional Commits v1.0.0 with emoji prefixes and provides comprehensive instruction files for all Copilot agents.

## 🚀 Features

- **🎯 Commit Message Generation**: Automatic generation of Conventional Commits with emoji prefixes
- **💻 Code Generation**: TypeScript/JavaScript best practices and project conventions
- **🧪 Test Generation**: Jest and React Testing Library patterns
- **👀 Code Review**: Comprehensive review guidelines covering security, performance, and maintainability
- **📝 PR Descriptions**: Structured pull request templates with emoji titles

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Configuration Files](#configuration-files)
- [Emoji Convention](#emoji-convention)
- [Usage Examples](#usage-examples)
- [Instruction Files](#instruction-files)
- [VS Code Settings](#vs-code-settings)
- [Memory Bank Integration](#memory-bank-integration)
- [Troubleshooting](#troubleshooting)

## 🏃 Quick Start

1. **Prerequisites**:
   - VS Code 1.99+
   - GitHub Copilot Chat extension installed and configured
   - Git repository initialized

2. **Copy Configuration Files**:
   ```bash
   # Copy the entire .github/instructions/ directory to your project
   cp -r .github/instructions /path/to/your/project/.github/

   # Copy VS Code settings
   cp .vscode/settings.json /path/to/your/project/.vscode/
   ```

3. **Reload VS Code**:
   - Restart VS Code or run "Developer: Reload Window" from Command Palette
   - Verify Copilot Chat is working with `Ctrl+Shift+P` → "Copilot Chat: Open Chat"

4. **Test the Configuration**:
   - Try generating a commit message: Ask Copilot to "Generate a commit message"
   - Try code generation: Ask Copilot to "Create a React component"
   - The responses should follow the defined patterns

## 📁 Configuration Files

```
.github/instructions/
├── commit-message.instructions.md      # Conventional Commits + Emojis
├── code-generation.instructions.md     # TypeScript/React best practices
├── test-generation.instructions.md     # Jest testing patterns
├── code-review.instructions.md         # Review guidelines
└── pr-description.instructions.md      # PR template structure

.vscode/
└── settings.json                       # Complete VS Code configuration
```

## 🎨 Emoji Convention

Our commit message format follows Conventional Commits v1.0.0 with emoji prefixes:

| Emoji | Type      | Description                             | Example                                    |
|-------|-----------|----------------------------------------|-------------------------------------------|
| 🎉    | feat      | A new feature                          | `🎉feat(ui): add modal component`         |
| 🐛    | fix       | A bug fix                              | `🐛fix(auth): handle token expiration`    |
| 📝    | docs      | Documentation only changes            | `📝docs: update API documentation`        |
| 💄    | style     | Code style/formatting (no logic)      | `💄style: fix indentation in utils`       |
| 🎨    | refactor  | Code refactoring                       | `🎨refactor(api): restructure endpoints`   |
| 🚀    | perf      | Performance improvement                | `🚀perf(db): optimize user queries`       |
| ✅    | test      | Adding/updating tests                  | `✅test: add user service unit tests`     |
| 🔧    | chore     | Maintenance tasks                      | `🔧chore: update dependencies`            |
| 📦    | build     | Build system changes                   | `📦build: configure webpack for prod`     |
| 🧹    | clean     | Code cleanup                           | `🧹clean: remove deprecated functions`    |

### Commit Message Structure

```
<emoji><type>(<scope>): <short description>

<body>     # optional - explain "why" and "what" beyond the title
<footer>   # optional - breaking changes, issues closed, etc.
```

## 💡 Usage Examples

### Generating Commit Messages

1. Stage your changes: `git add .`
2. Open Copilot Chat (`Ctrl+Shift+P` → "Copilot Chat: Open Chat")
3. Ask: "Generate a commit message for my staged changes"
4. Copilot will provide a message like: `🎉feat(ui): add user profile modal component`

### Code Generation

Ask Copilot Chat:
```
Create a React component for a user profile card with TypeScript
```

Response will follow the code-generation instructions:
- TypeScript interfaces defined
- Proper naming conventions (PascalCase for components)
- Error handling with try/catch
- JSDoc comments for public APIs

### Test Generation

Ask Copilot Chat:
```
Generate tests for the UserService class
```

Response will follow the test-generation instructions:
- Jest test structure with describe/it blocks
- AAA pattern (Arrange, Act, Assert)
- Proper mocking with jest.mock()
- Both success and error scenarios

### Code Review

Select code and run:
- `Ctrl+Shift+P` → "Copilot: Review Selection"

Review will cover:
- Security vulnerabilities
- Performance issues
- Readability improvements
- Best practice recommendations

### PR Descriptions

Ask Copilot Chat:
```
Generate a pull request description for my changes
```

Response will include:
- Emoji-prefixed title following Conventional Commits
- Structured description with all required sections
- Testing instructions
- Breaking changes documentation

## 📄 Instruction Files

### `.github/instructions/commit-message.instructions.md`
- Emoji → type mappings
- Conventional Commits v1.0.0 format
- Scope guidelines (ui, api, auth, etc.)
- Examples for different commit types

### `.github/instructions/code-generation.instructions.md`
- TypeScript/JavaScript conventions
- React best practices
- Error handling patterns
- Security considerations
- Memory bank integration guidelines

### `.github/instructions/test-generation.instructions.md`
- Jest testing framework setup
- React Testing Library patterns
- Mocking strategies
- Coverage requirements
- Performance testing guidelines

### `.github/instructions/code-review.instructions.md`
- Security best practices
- Performance considerations
- Code quality standards
- Documentation requirements
- Review communication guidelines

### `.github/instructions/pr-description.instructions.md`
- PR title formatting (emoji + Conventional Commits)
- Description template structure
- Review readiness checklist
- Label and communication guidelines

## ⚙️ VS Code Settings

The `.vscode/settings.json` file configures:

### Copilot Chat Integration
```json
{
  "chat.promptFiles": true,
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.instructionsFilesLocations": ["./.github/instructions"],
  "github.copilot.chat.commitMessageGeneration.instructions": [
    { "file": ".github/instructions/commit-message.instructions.md" }
  ]
}
```

### Code Formatting
- 2-space indentation
- Prettier formatting on save
- ESLint integration
- TypeScript configuration

### Development Environment
- File associations
- Git integration
- Terminal configuration
- Performance optimizations

## 🧠 Memory Bank Integration

This configuration integrates with the Memory Bank system:

### Files Referenced
- `memory-bank/systemPatterns.md` - Architecture patterns
- `memory-bank/techContext.md` - Technology decisions
- `memory-bank/activeContext.md` - Current work context

### How It Works
1. **Code Generation**: References memory bank for project-specific patterns
2. **Code Review**: Validates against documented architectural decisions
3. **Documentation**: Updates memory bank files when new patterns are established

### Usage in Instructions
Instructions include Memory Bank references:
```markdown
## Memory Bank Integration

When working with this project:
- Always check `memory-bank/` files for project-specific patterns
- Update `memory-bank/techContext.md` when introducing new technologies
- Document architectural decisions in `memory-bank/systemPatterns.md`
```

## 🔧 Troubleshooting

### Copilot Not Using Instructions

1. **Check VS Code Version**: Ensure VS Code 1.99+
2. **Verify Settings**: Confirm `.vscode/settings.json` is loaded
3. **Restart VS Code**: Reload window after configuration changes
4. **Check File Paths**: Ensure instruction files exist at specified paths

### Emoji Not Appearing in Commits

1. **Terminal Support**: Ensure your terminal supports Unicode
2. **Git Configuration**: Check git config for commit message handling
3. **Manual Override**: You can always copy/paste the suggested format

### Instructions Not Applied

1. **File Location**: Verify instruction files are in `.github/instructions/`
2. **YAML Front Matter**: Check that `applyTo` patterns are correct
3. **Copilot Chat**: Try asking specifically: "Use the commit message instructions"

### Performance Issues

1. **File Exclusions**: Update `files.exclude` in settings.json
2. **Watcher Limits**: Configure `files.watcherExclude` for large projects
3. **Extension Conflicts**: Disable conflicting extensions temporarily

## 🤝 Contributing

To extend or modify this configuration:

1. **Update Instruction Files**: Modify `.github/instructions/*.md` files
2. **Test Changes**: Reload VS Code and test with Copilot Chat
3. **Update Documentation**: Keep this README in sync with changes
4. **Memory Bank**: Document new patterns in appropriate memory bank files

## 📝 License

This configuration is provided as-is for educational and development purposes. Adapt as needed for your projects.

---

## 🎯 Next Steps

1. **Customize Scopes**: Edit the scope list in `commit-message.instructions.md` for your project
2. **Add Custom Rules**: Extend code-generation instructions for project-specific patterns
3. **Team Adoption**: Share this configuration with your team for consistency
4. **Continuous Improvement**: Refine instructions based on usage patterns

Happy coding with GitHub Copilot! 🚀
