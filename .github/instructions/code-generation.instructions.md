---
applyTo: "**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.md, **/*.json"
---

# Code Generation Guidelines

## General Principles

1. **Project Conventions:**

   - Always include a top-level comment `// Generated with Copilot assistance` in new files
   - Follow consistent naming conventions throughout the project
   - Maintain code readability and self-documenting practices

2. **File Organization:**
   - Use clear, descriptive file and directory names
   - Group related functionality together
   - Follow established project structure patterns

## TypeScript/JavaScript Conventions

### Naming Conventions

- **PascalCase:** Components, Classes, Types, Interfaces, Enums

  ```typescript
  interface UserProfile {}
  class DatabaseManager {}
  type ApiResponse = {};
  ```

- **camelCase:** Functions, variables, methods, properties

  ```typescript
  const getUserData = () => {};
  const isAuthenticated = true;
  ```

- **SCREAMING_SNAKE_CASE:** Constants, environment variables

  ```typescript
  const MAX_RETRY_ATTEMPTS = 3;
  const API_BASE_URL = process.env.API_BASE_URL;
  ```

- **Private fields:** Prefix with underscore

  ```typescript
  class Service {
    private _config: Config;
    private _handleError() {}
  }
  ```

### TypeScript Best Practices

1. **Type Definitions:**

   - Always define interfaces or type aliases for complex objects
   - Use generic types where appropriate
   - Prefer `interface` over `type` for object shapes
   - Use `type` for unions, primitives, and computed types

   ```typescript
   interface ComponentProps {
     title: string;
     children: React.ReactNode;
     onSubmit?: (data: FormData) => void;
   }

   type Status = "loading" | "success" | "error";
   ```

2. **Function Signatures:**

   - Always specify return types for public functions
   - Use proper parameter typing
   - Leverage union types for flexible APIs

   ```typescript
   function processUserData(user: User): Promise<ProcessedUser> {
     // implementation
   }
   ```

3. **Import/Export Patterns:**

   - Use named exports for utilities and components
   - Use default exports sparingly (mainly for main components)
   - Organize imports: external libraries first, then internal modules

   ```typescript
   import React, { useState, useEffect } from "react";
   import { Router } from "express";

   import { UserService } from "../services/UserService";
   import { validateInput } from "../utils/validation";
   ```

## React Conventions

### Component Structure

1. **Functional Components:**

   - Use functional components with hooks
   - Use `React.FC<Props>` when component accepts children
   - Define props interface above component

   ```typescript
   interface ButtonProps {
     variant: "primary" | "secondary";
     onClick: () => void;
     children: React.ReactNode;
   }

   const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
     return (
       <button className={`btn btn-${variant}`} onClick={onClick}>
         {children}
       </button>
     );
   };
   ```

2. **Hook Usage:**

   - Group related state with custom hooks
   - Use `useCallback` for event handlers passed to child components
   - Use `useMemo` for expensive calculations
   - Use `useEffect` cleanup functions when needed

   ```typescript
   const useUserData = (userId: string) => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       let mounted = true;

       const fetchUser = async () => {
         try {
           const userData = await userService.getUser(userId);
           if (mounted) {
             setUser(userData);
             setLoading(false);
           }
         } catch (error) {
           if (mounted) {
             setLoading(false);
           }
         }
       };

       fetchUser();

       return () => {
         mounted = false;
       };
     }, [userId]);

     return { user, loading };
   };
   ```

## Error Handling

### Async/Await Patterns

1. **Always wrap async/await in try/catch:**

   ```typescript
   const fetchData = async (id: string): Promise<Data | null> => {
     try {
       const response = await api.get(`/data/${id}`);
       return response.data;
     } catch (error) {
       console.error("Failed to fetch data:", error);
       return null;
     }
   };
   ```

2. **Error Boundaries for React:**

   ```typescript
   class ErrorBoundary extends React.Component<Props, State> {
     constructor(props: Props) {
       super(props);
       this.state = { hasError: false };
     }

     static getDerivedStateFromError(error: Error): State {
       return { hasError: true };
     }

     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
       console.error("Error caught by boundary:", error, errorInfo);
     }

     render() {
       if (this.state.hasError) {
         return <h1>Something went wrong.</h1>;
       }

       return this.props.children;
     }
   }
   ```

## Dependency Management

1. **Import Rules:**

   - Only import from public npm packages
   - Avoid relative paths outside of `src/`
   - Use path aliases for deep imports when configured

2. **Dependency Types:**
   - Use exact versions for critical dependencies
   - Keep devDependencies separate from runtime dependencies
   - Regularly audit and update dependencies

## Code Quality Standards

### Documentation

1. **JSDoc Comments:**

   ```typescript
   /**
    * Calculates the total price including tax
    * @param basePrice - The base price before tax
    * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
    * @returns The total price including tax
    */
   function calculateTotal(basePrice: number, taxRate: number): number {
     return basePrice * (1 + taxRate);
   }
   ```

2. **README Documentation:**
   - Include setup instructions
   - Document available scripts
   - Explain project structure
   - Provide usage examples

### Performance Considerations

1. **Bundle Size:**

   - Use tree-shaking compatible imports
   - Lazy load components when appropriate
   - Optimize images and assets

2. **React Performance:**
   - Memoize expensive calculations
   - Use React.memo for pure components
   - Avoid creating objects in render methods

## Testing Patterns

### Unit Tests

1. **Test Structure:**

   ```typescript
   describe("UserService", () => {
     describe("getUser", () => {
       it("should return user data when user exists", async () => {
         // Arrange
         const userId = "123";
         const expectedUser = { id: "123", name: "John Doe" };

         // Act
         const result = await userService.getUser(userId);

         // Assert
         expect(result).toEqual(expectedUser);
       });

       it("should handle user not found error", async () => {
         // Test error case
       });
     });
   });
   ```

2. **Mocking:**

   ```typescript
   jest.mock("../services/apiService", () => ({
     get: jest.fn(),
     post: jest.fn(),
   }));
   ```

## Security Best Practices

1. **Input Validation:**

   - Validate all user inputs
   - Sanitize data before database operations
   - Use parameterized queries

2. **Authentication:**

   - Store tokens securely
   - Implement proper session management
   - Use HTTPS in production

3. **Data Protection:**
   - Never log sensitive information
   - Implement proper access controls
   - Follow GDPR/privacy regulations

## Environment-Specific Guidelines

### Development

- Use descriptive variable names
- Include helpful console.log statements for debugging
- Write comprehensive tests

### Production

- Remove debug statements
- Optimize for performance
- Implement proper error monitoring

## Memory Bank Integration

When working with this project:

- Always check `memory-bank/` files for project-specific patterns
- Update `memory-bank/techContext.md` when introducing new technologies
- Document architectural decisions in `memory-bank/systemPatterns.md`
- Track progress and learnings in respective memory bank files
