---
applyTo: "**"
---

# Code Review Guidelines

## Code Review Principles

When reviewing code, focus on these key areas to ensure high-quality, maintainable, and secure code:

## 1. Readability and Maintainability

### Variable and Function Naming

- **Meaningful Names:** Variables and functions should clearly express their purpose
  - ✅ `getUserProfile(userId)`
  - ❌ `getData(id)`
- **Consistent Naming:** Follow established naming conventions
  - Use `camelCase` for variables and functions
  - Use `PascalCase` for classes and components
  - Use `SCREAMING_SNAKE_CASE` for constants
- **Avoid Abbreviations:** Unless they're well-known (e.g., `url`, `id`, `api`)
  - ✅ `userAuthentication`
  - ❌ `usrAuth`

### Code Structure

- **Function Length:** Functions should be focused and typically under 50 lines
- **Single Responsibility:** Each function should do one thing well
- **Clear Logic Flow:** Code should read like a story from top to bottom
- **Proper Indentation:** Consistent spacing and indentation (project uses 2 spaces)
- **Comments:** Explain "why" not "what" - the code should be self-explanatory for "what"

```typescript
// ❌ Poor: explains what
// Increment counter by 1
counter++;

// ✅ Good: explains why
// Increment counter to track failed login attempts for rate limiting
counter++;
```

## 2. Performance Considerations

### Algorithm Efficiency

- **Time Complexity:** Flag O(n²) or worse algorithms where better solutions exist
- **Space Complexity:** Identify unnecessary memory allocations
- **Nested Loops:** Review nested iterations, especially with large datasets

```typescript
// ❌ Inefficient O(n²)
const findDuplicates = (arr: number[]) => {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) duplicates.push(arr[i]);
    }
  }
  return duplicates;
};

// ✅ Efficient O(n)
const findDuplicates = (arr: number[]) => {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of arr) {
    if (seen.has(item)) duplicates.add(item);
    seen.add(item);
  }
  return Array.from(duplicates);
};
```

### React Performance

- **Unnecessary Re-renders:** Check for missing `useCallback`, `useMemo`, or `React.memo`
- **Large Component Trees:** Suggest component splitting for better performance
- **State Management:** Ensure state is placed at appropriate levels

### Memory Management

- **Memory Leaks:** Look for uncleared intervals, event listeners, or subscriptions
- **Unbounded Data Structures:** Arrays or objects that grow without limits
- **Large Object Creation:** Frequent creation of large objects in loops

## 3. Security Best Practices

### Input Validation

- **User Input Sanitization:** All user inputs must be validated and sanitized
- **SQL Injection Prevention:** Use parameterized queries, never string concatenation
- **XSS Prevention:** Escape output, validate input formats

```typescript
// ❌ Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Safe parameterized query
const query = "SELECT * FROM users WHERE id = ?";
const result = db.query(query, [userId]);
```

### Authentication and Authorization

- **Password Security:** Check for proper hashing, never plain text storage
- **Session Management:** Verify secure session handling
- **Access Controls:** Ensure proper authorization checks for sensitive operations

### Data Protection

- **Sensitive Data Logging:** Never log passwords, tokens, or personal information
- **Environment Variables:** Sensitive configs should use environment variables
- **Data Transmission:** Ensure HTTPS usage in production

```typescript
// ❌ Exposing sensitive data
console.log("User login:", { username, password, creditCard });

// ✅ Safe logging
console.log("User login attempt:", { username, timestamp: Date.now() });
```

## 4. Error Handling

### Comprehensive Error Handling

- **Try-Catch Blocks:** All async operations should have proper error handling
- **Error Boundaries:** React components should have error boundary protection
- **Graceful Degradation:** Application should handle failures gracefully

```typescript
// ❌ No error handling
const fetchUserData = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// ✅ Proper error handling
const fetchUserData = async (id: string): Promise<User | null> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    logger.error("Failed to fetch user data:", { id, error });
    return null;
  }
};
```

### Error Information

- **Meaningful Error Messages:** Users should understand what went wrong
- **Error Logging:** Sufficient information for debugging
- **Error Recovery:** Provide ways to recover from errors when possible

## 5. Code Quality Standards

### TypeScript Best Practices

- **Type Safety:** Avoid `any` types, use proper type definitions
- **Interface Definitions:** Complex objects should have interface definitions
- **Generic Types:** Use generics for reusable components and functions
- **Null Checking:** Handle null/undefined cases explicitly

```typescript
// ❌ Weak typing
const processData = (data: any) => {
  return data.map((item: any) => item.value);
};

// ✅ Strong typing
interface DataItem {
  id: string;
  value: number;
  label: string;
}

const processData = (data: DataItem[]): number[] => {
  return data.map((item) => item.value);
};
```

### Modern JavaScript/TypeScript Features

- **Async/Await:** Prefer over Promise chains for readability
- **Destructuring:** Use for cleaner variable assignment
- **Optional Chaining:** Use `?.` for safe property access
- **Nullish Coalescing:** Use `??` instead of `||` when appropriate

### Testing Requirements

- **Test Coverage:** Critical functions should have tests
- **Edge Cases:** Tests should cover boundary conditions and error scenarios
- **Mocking:** External dependencies should be properly mocked

## 6. Architecture and Design Patterns

### Component Design

- **Single Responsibility:** Each component should have one clear purpose
- **Proper Abstraction:** Don't over-engineer, but allow for future extension
- **Dependency Injection:** Avoid tight coupling between modules

### API Design

- **RESTful Conventions:** Follow REST principles for API endpoints
- **Consistent Response Format:** APIs should return consistent data structures
- **Proper HTTP Status Codes:** Use appropriate status codes for different scenarios

### State Management

- **State Placement:** State should be as close to where it's used as possible
- **Immutability:** State updates should be immutable
- **Side Effects:** Manage side effects properly with useEffect or middleware

## 7. Documentation and Comments

### Code Documentation

- **JSDoc Comments:** Public APIs should have JSDoc documentation
- **README Updates:** Significant changes should update relevant documentation
- **Code Comments:** Complex business logic should be explained

### Commit and PR Standards

- **Descriptive Commits:** Follow Conventional Commits with emojis
- **PR Descriptions:** Clear description of what changed and why
- **Breaking Changes:** Clearly document any breaking changes

## 8. Dependencies and Security

### Dependency Management

- **Security Vulnerabilities:** Check for known vulnerabilities in dependencies
- **Bundle Size Impact:** Consider the impact of new dependencies on bundle size
- **Maintenance Status:** Prefer actively maintained packages

### Version Management

- **Exact Versions:** Critical dependencies should use exact versions
- **Update Strategy:** Regular dependency updates with proper testing
- **Deprecation Warnings:** Address deprecated API usage

## 9. Browser and Environment Compatibility

### Cross-Browser Support

- **Browser Compatibility:** Ensure code works across supported browsers
- **Polyfills:** Include necessary polyfills for older browsers
- **Progressive Enhancement:** Basic functionality should work without advanced features

### Performance Optimization

- **Bundle Splitting:** Large applications should use code splitting
- **Lazy Loading:** Non-critical components should be lazy loaded
- **Asset Optimization:** Images and other assets should be optimized

## 10. Specific Review Checklist

### Before Approving, Verify

**Functionality:**

- [ ] Code accomplishes the intended purpose
- [ ] Edge cases are handled appropriately
- [ ] No obvious bugs or logical errors

**Security:**

- [ ] No hard-coded secrets or sensitive data
- [ ] Input validation is present where needed
- [ ] Authentication/authorization is properly implemented

**Performance:**

- [ ] No obvious performance bottlenecks
- [ ] Appropriate use of caching where beneficial
- [ ] Database queries are optimized

**Maintainability:**

- [ ] Code is readable and well-structured
- [ ] Functions are appropriately sized and focused
- [ ] Naming conventions are followed

**Testing:**

- [ ] Adequate test coverage for new code
- [ ] Tests are meaningful and test the right things
- [ ] Tests are maintainable and not brittle

**Documentation:**

- [ ] Code changes are reflected in documentation
- [ ] Complex logic is explained with comments
- [ ] API changes are documented

## Review Communication Guidelines

### Providing Feedback

- **Be Constructive:** Focus on the code, not the person
- **Explain Reasoning:** Help the author understand why changes are needed
- **Suggest Solutions:** Don't just point out problems, offer alternatives
- **Prioritize Issues:** Distinguish between critical issues and suggestions

### Example Feedback Formats

**Critical Issue:**

```
🚨 Security Issue: This code is vulnerable to SQL injection. Please use parameterized queries instead of string concatenation.

Current: `SELECT * FROM users WHERE id = ${userId}`
Suggested: `db.query('SELECT * FROM users WHERE id = ?', [userId])`
```

**Performance Suggestion:**

```
⚡ Performance: This nested loop creates O(n²) complexity. Consider using a Set for O(n) lookup time.
```

**Style/Readability:**

```
📝 Readability: Consider extracting this complex calculation into a named function to improve readability.
```

## Memory Bank Integration

When reviewing code in this project:

- Check alignment with patterns documented in `memory-bank/systemPatterns.md`
- Ensure new technologies align with `memory-bank/techContext.md`
- Verify implementation matches architectural decisions
- Update memory bank files if new patterns are established
