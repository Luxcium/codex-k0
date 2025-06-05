---
applyTo: "**"
---

# Pull Request Title & Description Guidelines

## PR Title Format

Use the same emoji + Conventional Commits format as commit messages:

```
<emoji><type>(<scope>): <short description>
```

### Examples:

- `🎉feat(ui): add modal component for user confirmation`
- `🐛fix(auth): handle edge case in token validation`
- `📝docs: update API documentation for user endpoints`
- `🎨refactor(api): restructure user endpoint responses`

## PR Description Template

```markdown
## Description

Brief summary of what this PR accomplishes and why it's needed.

## Changes Made

- List key changes made in this PR
- Include any architectural or design decisions
- Mention any breaking changes clearly

## Related Issues

- Closes #123
- Fixes #456
- Refs #789

## Testing

### How to Test

1. Step-by-step instructions to test the changes
2. Include any special setup requirements
3. Mention test data or configurations needed

### Test Coverage

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Edge cases tested

## Breaking Changes

If applicable, list any breaking changes and migration steps:

- **BREAKING**: Changed API response format for `/users` endpoint
- **Migration**: Update client code to use `user_id` instead of `id`

## Screenshots/Videos

If UI changes are involved, include before/after screenshots or demo videos.

### Before

![Before Screenshot](url-to-before-image)

### After

![After Screenshot](url-to-after-image)

## Performance Impact

- [ ] No performance impact
- [ ] Performance improved
- [ ] Performance impact acceptable (explain why)
- [ ] Performance needs investigation

Details: [Explain any performance considerations]

## Security Considerations

- [ ] No security impact
- [ ] Security review completed
- [ ] New permissions/access controls added
- [ ] Sensitive data handling reviewed

## Documentation Updates

- [ ] README updated
- [ ] API documentation updated
- [ ] Code comments added/updated
- [ ] Memory bank files updated (if applicable)

## Deployment Notes

Any special considerations for deployment:

- Database migrations required
- Environment variable changes
- Feature flag dependencies
- Rollback procedures

## Reviewer Notes

Specific areas where you'd like focused review:

- Security implications of authentication changes
- Performance of new database queries
- UX flow for the new modal component
```

## Title Guidelines

### Emoji Usage

Use the same emoji mapping as commit messages:

| Emoji | Type     | Description             |
| ----- | -------- | ----------------------- |
| 🎉    | feat     | New feature             |
| 🐛    | fix      | Bug fix                 |
| 📝    | docs     | Documentation           |
| 💄    | style    | Code style/formatting   |
| 🎨    | refactor | Code refactoring        |
| 🚀    | perf     | Performance improvement |
| ✅    | test     | Adding/updating tests   |
| 🔧    | chore    | Maintenance tasks       |
| 📦    | build    | Build system changes    |
| 🧹    | clean    | Code cleanup            |

### Scope Guidelines

Choose the most appropriate scope:

- `ui` - User interface changes
- `api` - Backend API changes
- `auth` - Authentication/authorization
- `db` - Database changes
- `config` - Configuration updates
- `deps` - Dependency updates
- `ci` - CI/CD changes
- `docs` - Documentation
- `test` - Testing changes

### Title Best Practices

1. **Keep under 72 characters**
2. **Use imperative mood** ("add feature" not "added feature")
3. **Be specific but concise**
4. **Include scope when applicable**
5. **No period at the end**

## Description Best Practices

### Required Sections

Every PR should include:

1. **Description** - What and why
2. **Changes Made** - Key modifications
3. **Testing** - How to verify the changes
4. **Related Issues** - Issue references

### Optional Sections (use when applicable)

- Breaking Changes
- Screenshots/Videos (for UI changes)
- Performance Impact
- Security Considerations
- Documentation Updates
- Deployment Notes
- Reviewer Notes

## PR Size Guidelines

### Small PRs (Preferred)

- Single feature or bug fix
- Under 400 lines of changes
- Easy to review and understand
- Low risk of conflicts

### Medium PRs (Acceptable)

- 400-800 lines of changes
- Multiple related changes
- Clear separation of concerns
- Well-documented

### Large PRs (Avoid when possible)

- Over 800 lines of changes
- Should be broken into smaller PRs
- Require detailed documentation
- Higher risk of issues

## Review Readiness Checklist

Before marking PR as ready for review:

### Code Quality

- [ ] Code follows project conventions
- [ ] No console.log or debug statements left
- [ ] Error handling implemented
- [ ] TypeScript types properly defined
- [ ] Code is self-documenting with clear names

### Testing

- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed
- [ ] Edge cases considered

### Documentation

- [ ] Code comments added where needed
- [ ] README updated if applicable
- [ ] API docs updated if applicable
- [ ] Breaking changes documented

### Performance

- [ ] No obvious performance regressions
- [ ] Bundle size impact considered
- [ ] Database query efficiency reviewed

### Security

- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization proper

## PR Labels

Use appropriate labels to categorize PRs:

### Type Labels

- `feature` - New functionality
- `bugfix` - Bug fixes
- `docs` - Documentation updates
- `refactor` - Code refactoring
- `performance` - Performance improvements
- `security` - Security-related changes

### Priority Labels

- `critical` - Urgent fixes
- `high` - Important changes
- `medium` - Standard priority
- `low` - Nice to have

### Status Labels

- `ready-for-review` - Ready for team review
- `work-in-progress` - Still being developed
- `needs-testing` - Requires additional testing
- `blocked` - Waiting on dependencies

### Area Labels

- `frontend` - UI/client-side changes
- `backend` - Server-side changes
- `api` - API changes
- `database` - Database modifications
- `ci/cd` - Build/deployment changes

## Communication Guidelines

### When Opening PR

1. **Tag relevant reviewers** based on code areas
2. **Link to related issues** using GitHub keywords
3. **Set appropriate labels** for categorization
4. **Add to project board** if using project management

### During Review

1. **Respond promptly** to reviewer feedback
2. **Explain decisions** when disagreeing with suggestions
3. **Update description** if scope changes significantly
4. **Re-request review** after addressing feedback

### Common Review Responses

**Accepting feedback:**

```
Thanks for catching that! Fixed in [commit hash].
```

**Providing context:**

```
I chose this approach because [reason]. However, I'm open to the suggested alternative if you think it's better.
```

**Asking for clarification:**

```
Could you elaborate on this suggestion? I want to make sure I understand the concern correctly.
```

## Merge Guidelines

### Before Merging

- [ ] All reviews approved
- [ ] All CI checks passing
- [ ] Conflicts resolved
- [ ] Final testing completed

### Merge Commit Message

Use the PR title as the merge commit message, ensuring it follows Conventional Commits format.

### After Merge

1. **Delete feature branch** (if no longer needed)
2. **Update project board** status
3. **Close related issues** if fully resolved
4. **Update deployment tracking** if applicable

## Special PR Types

### Hotfix PRs

- Use `🚨` emoji prefix
- Mark with `critical` label
- Include detailed impact analysis
- Fast-track review process

### Security PRs

- Use `🔒` emoji or `🚨security` prefix
- Mark with `security` label
- Limit reviewer access if needed
- Include security impact assessment

### Documentation-Only PRs

- Use `📝docs` prefix
- Can have relaxed testing requirements
- Focus on accuracy and clarity
- Consider impact on other docs

### Dependency Update PRs

- Use `📦build(deps)` prefix
- Include changelog highlights
- Test for breaking changes
- Consider security implications

## Memory Bank Integration

When creating PRs for this project:

- Reference relevant memory bank patterns
- Update memory bank files if establishing new patterns
- Ensure alignment with architectural decisions
- Document learnings for future reference
