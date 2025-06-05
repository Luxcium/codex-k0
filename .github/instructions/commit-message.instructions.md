---
applyTo: "**"
---

# Commit Message Generation Guidelines

**Use [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) with emojis for each type:**

## Emoji → Type Mapping

| Emoji | Type      | Description                                                                                            |
| ----- | --------- | ------------------------------------------------------------------------------------------------------ |
| 🎉    | feat      | A new feature                                                                                          |
| 🐛    | fix       | A bug fix                                                                                              |
| 📝    | docs      | Documentation only changes                                                                             |
| 💄    | style     | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| 🎨    | refactor  | A code change that neither fixes a bug nor adds a feature                                              |
| 🚀    | perf      | A code change that improves performance                                                                |
| ✅    | test      | Adding missing tests or correcting existing tests                                                      |
| 🔧    | chore     | Changes to the build process or auxiliary tools and libraries                                          |
| 📦    | build     | Changes that affect the build system or external dependencies                                          |
| 🧹    | clean     | Removing code or files no longer used                                                                  |
| 🔥    | remove    | Remove code or files                                                                                   |
| 🚨    | security  | Fix security issues                                                                                    |
| ⚡️   | zap       | Improve performance                                                                                    |
| 🔀    | merge     | Merge branches                                                                                         |
| 🎯    | target    | Update configuration or settings                                                                       |
| 🏗️    | construct | Make architectural changes                                                                             |

## Commit Message Structure

```
<emoji><type>(<scope>): <short description>

<body>     # optional - explain "why" and "what" beyond the title
<footer>   # optional - breaking changes, issues closed, etc.
```

## Format Rules

1. **Title line (required):**

   - Start with appropriate emoji + type
   - Include scope in parentheses (optional but recommended)
   - Use imperative mood: "add feature" not "added feature"
   - Keep under 72 characters
   - No period at the end

2. **Body (optional):**

   - Separated by blank line from title
   - Wrap at 72 characters
   - Explain motivation and contrast with previous behavior

3. **Footer (optional):**
   - Separated by blank line from body
   - Reference issues: "Closes #123"
   - Note breaking changes: "BREAKING CHANGE: ..."

## Examples

### Simple commit

```
🎉feat(ui): add modal component for user confirmation
```

### With body

```
🐛fix(auth): handle edge case in token validation

Users were experiencing intermittent login failures when tokens
contained special characters. This fix properly encodes tokens
before validation.
```

### With breaking change

```
🎨refactor(api): restructure user endpoint responses

BREAKING CHANGE: User API now returns `user_id` instead of `id`.
All clients must update their integration code.

Closes #456
```

### Multiple scopes

```
🧹clean(ui,api): remove deprecated helper functions

- Deleted unused utility functions in src/utils/
- Updated imports in consuming modules
- Removed corresponding tests
```

## Scope Guidelines

Common scopes to use:

- `ui` - User interface changes
- `api` - Backend API changes
- `auth` - Authentication/authorization
- `db` - Database changes
- `config` - Configuration updates
- `deps` - Dependency updates
- `ci` - Continuous integration
- `docs` - Documentation
- `test` - Testing code
- `build` - Build system
- `deploy` - Deployment scripts

## Additional Rules

- Use lowercase for type and scope
- If no scope applies, omit the parentheses: `🎉feat: add new feature`
- For multiple files/areas, choose the most significant scope
- Breaking changes must include "BREAKING CHANGE:" in footer
- Reference issues with "Closes #123", "Fixes #456", or "Refs #789"
