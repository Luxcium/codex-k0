---
applyTo: "**/*.spec.ts, **/*.test.ts, **/*.spec.js, **/*.test.js, **/*.spec.tsx, **/*.test.tsx"
---

# Test Generation Guidelines

## Testing Framework Standards

### Primary Framework

- **Jest** for unit and integration tests
- **React Testing Library** for React component testing
- **Supertest** for API endpoint testing (if applicable)

### File Naming Conventions

- `<ComponentName>.test.tsx` for React components
- `<ModuleName>.spec.ts` for utility functions and services
- `<FeatureName>.integration.test.ts` for integration tests
- `<APIEndpoint>.api.test.ts` for API tests

## Test Structure Patterns

### Basic Test Organization

```typescript
describe("ComponentName or ModuleName", () => {
  // Setup and teardown
  beforeEach(() => {
    // Common setup for all tests
  });

  afterEach(() => {
    // Cleanup after each test
    jest.clearAllMocks();
  });

  describe("method or functionality group", () => {
    it("should describe expected behavior in specific scenario", () => {
      // Arrange - set up test data and conditions
      // Act - execute the functionality being tested
      // Assert - verify the expected outcome
    });
  });
});
```

### AAA Pattern (Arrange, Act, Assert)

Always structure test cases using the AAA pattern for clarity:

```typescript
it("should calculate total price with tax correctly", () => {
  // Arrange
  const basePrice = 100;
  const taxRate = 0.08;
  const expected = 108;

  // Act
  const result = calculateTotal(basePrice, taxRate);

  // Assert
  expect(result).toBe(expected);
});
```

## React Component Testing

### Component Setup

```typescript
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button Component", () => {
  const defaultProps = {
    onClick: jest.fn(),
    children: "Click me",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with correct text", () => {
    render(<Button {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    render(<Button {...defaultProps} />);

    await user.click(screen.getByRole("button"));

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Hooks

```typescript
import { renderHook, act } from "@testing-library/react";
import { useUserData } from "./useUserData";
import { userService } from "../services/userService";

jest.mock("../services/userService");
const mockUserService = userService as jest.Mocked<typeof userService>;

describe("useUserData Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch user data successfully", async () => {
    const mockUser = { id: "1", name: "John Doe" };
    mockUserService.getUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUserData("1"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });
});
```

## Service and Utility Testing

### Service Layer Testing

```typescript
import { UserService } from "./UserService";
import { apiClient } from "../api/apiClient";

jest.mock("../api/apiClient");
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should return user data when API call succeeds", async () => {
      const mockUser = { id: "1", name: "John Doe", email: "john@example.com" };
      mockApiClient.get.mockResolvedValue({ data: mockUser });

      const result = await userService.getUser("1");

      expect(mockApiClient.get).toHaveBeenCalledWith("/users/1");
      expect(result).toEqual(mockUser);
    });

    it("should throw error when user not found", async () => {
      mockApiClient.get.mockRejectedValue(new Error("User not found"));

      await expect(userService.getUser("999")).rejects.toThrow(
        "User not found"
      );
    });
  });
});
```

### Utility Function Testing

```typescript
import { validateEmail, formatCurrency, debounce } from "./utils";

describe("Utility Functions", () => {
  describe("validateEmail", () => {
    it.each([
      ["valid@email.com", true],
      ["user@domain.co.uk", true],
      ["invalid-email", false],
      ["@domain.com", false],
      ["user@", false],
    ])("should validate email %s as %s", (email, expected) => {
      expect(validateEmail(email)).toBe(expected);
    });
  });

  describe("formatCurrency", () => {
    it("should format currency with default options", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("should format currency with custom locale", () => {
      expect(formatCurrency(1234.56, "EUR", "de-DE")).toBe("1.234,56 €");
    });
  });

  describe("debounce", () => {
    jest.useFakeTimers();

    it("should delay function execution", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
```

## Mocking Strategies

### External Dependencies

```typescript
// Mock entire modules
jest.mock("../services/apiService", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock specific exports
jest.mock("../utils/logger", () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

// Mock with implementation
jest.mock("../services/authService", () => ({
  isAuthenticated: jest.fn(() => true),
  getToken: jest.fn(() => "mock-token"),
  logout: jest.fn(),
}));
```

### Environment Variables

```typescript
describe("Environment Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should use production config when NODE_ENV is production", () => {
    process.env.NODE_ENV = "production";
    process.env.API_URL = "https://api.prod.com";

    const config = require("./config");
    expect(config.apiUrl).toBe("https://api.prod.com");
  });
});
```

### Date and Time Mocking

```typescript
describe("Date-dependent functionality", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should create correct timestamp", () => {
    const result = getCurrentTimestamp();
    expect(result).toBe("2024-01-01T00:00:00.000Z");
  });
});
```

## Async Testing Patterns

### Promises and Async/Await

```typescript
describe("Async Operations", () => {
  it("should handle successful API response", async () => {
    const mockData = { id: 1, name: "Test" };
    mockApiClient.get.mockResolvedValue({ data: mockData });

    const result = await fetchUserData(1);

    expect(result).toEqual(mockData);
  });

  it("should handle API errors", async () => {
    mockApiClient.get.mockRejectedValue(new Error("Network error"));

    await expect(fetchUserData(1)).rejects.toThrow("Network error");
  });
});
```

### Testing Loading States

```typescript
it("should show loading state during data fetch", async () => {
  let resolvePromise: (value: any) => void;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });
  mockApiClient.get.mockReturnValue(promise);

  render(<UserProfile userId="1" />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  act(() => {
    resolvePromise({ data: { id: "1", name: "John" } });
  });

  await waitFor(() => {
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
```

## Test Coverage Requirements

### Coverage Targets

- **Statements:** Minimum 80%
- **Branches:** Minimum 75%
- **Functions:** Minimum 85%
- **Lines:** Minimum 80%

### Critical Areas (100% Coverage Required)

- Authentication logic
- Payment processing
- Data validation functions
- Security-related code
- Error handling pathways

### Coverage Exceptions

Document any intentionally uncovered code:

```typescript
/* istanbul ignore next */
if (process.env.NODE_ENV === "development") {
  // Development-only code that doesn't need testing
}
```

## Error Testing

### Error Boundary Testing

```typescript
import { ErrorBoundary } from "./ErrorBoundary";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  it("should catch and display error", () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
```

### Network Error Testing

```typescript
describe("Network Error Handling", () => {
  it("should handle network timeout", async () => {
    mockApiClient.get.mockRejectedValue({
      code: "NETWORK_TIMEOUT",
      message: "Request timeout",
    });

    const result = await dataService.fetchWithRetry("/api/data");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Request timeout");
  });
});
```

## Performance Testing

### Component Performance

```typescript
import { render } from "@testing-library/react";
import { performance } from "perf_hooks";

describe("Component Performance", () => {
  it("should render large list efficiently", () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));

    const start = performance.now();
    render(<ItemList items={items} />);
    const end = performance.now();

    expect(end - start).toBeLessThan(100); // Should render in less than 100ms
  });
});
```

## Integration Testing

### API Integration Tests

```typescript
import request from "supertest";
import { app } from "../app";

describe("User API Integration", () => {
  it("should create and retrieve user", async () => {
    const userData = { name: "John Doe", email: "john@example.com" };

    const createResponse = await request(app)
      .post("/api/users")
      .send(userData)
      .expect(201);

    const userId = createResponse.body.id;

    const getResponse = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200);

    expect(getResponse.body.name).toBe(userData.name);
    expect(getResponse.body.email).toBe(userData.email);
  });
});
```

## Test Maintenance

### Test Helpers and Utilities

```typescript
// test-utils.tsx
export const renderWithProviders = (
  ui: React.ReactElement,
  options: {
    initialState?: Partial<RootState>;
    store?: AppStore;
  } = {}
) => {
  const { initialState, ...renderOptions } = options;

  const store = options.store || setupStore(initialState);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
```

### Common Test Data

```typescript
// test-fixtures.ts
export const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2024-01-01T00:00:00Z",
};

export const mockApiResponse = <T>(data: T) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
});
```

## Best Practices Summary

1. **Write Descriptive Test Names:** Test names should clearly describe what is being tested and expected outcome
2. **One Assertion Per Test:** Keep tests focused on a single behavior
3. **Independent Tests:** Each test should be able to run independently
4. **Fast Execution:** Unit tests should run quickly (< 1ms each)
5. **Maintainable:** Tests should be easy to understand and modify
6. **Realistic Data:** Use realistic test data that represents actual usage
7. **Edge Cases:** Test boundary conditions and error scenarios
8. **Mock External Dependencies:** Isolate code under test from external systems
