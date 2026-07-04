# @vitest

## Overview

Vitest is a fast, built-from-source test runner built for testing Vue, React and vanilla JS. It works as a unit and end-to-end (e2e testing) and is perfectly compatible with the vitest and vitest npm packages.

**Version:** ^1.6.0  
**Homepage:** [https://vitest.dev/](https://vitest.dev/)  
**Repository:** [https://github.com/vitest-dev/vitest](https://github.com/vitest-dev/vitest)  
**License:** MIT

## Installation

```bash
npm install -D vitest
```

```bash
pnpm add -D vitest
```

```bash
yarn add -D vitest
```

## Config File

Create a `vitest.config.js` or `vitest.config.ts` file in your project root:

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['./init-vitest-setup.ts'],
    deps: {
      inline: ['nanoid', 'magic-string', 'magicast'],
    },
    testTimeout: 5000,
    hookTimeout: 10000,
    testTransformMode: {
      ssr: ['**/*', '@/*', '*.css'],
    },
    sequence: {
      shuffle: true,
      concurrent: true,
    },
    hookOptions: {
      retry: 2,
      retries: {
        slow: 2,
        fast: {
          timeout: 1000,
        },
      },
    },
    hookTimeout: 5000,
  },
});
```

## Core Features

### 1. Test Files

Create a test file for your component:

```typescript
// src/App.spec.ts
import { describe, it, expect, test } from 'vitest';
import { mount } from 'vue-test-utils';

describe('App', () => {
  it('renders the app', () => {
    expect(App).toBeTruthy();
  });
});
```

### 2. Test Runner

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests with watch
npm run test:watch
```

### 3. Test Configuration

```json
{
  "test": {
    "include": ["packages/*"],
    "exclude": ["node_modules", "docs"],
    "typecheck": {
      "include": ["e2e/e2e.d.ts"]
    },
    "globals": true,
    "passWithNoTests": true,
    "testTimeout": 30000,
    "setupFiles": ["./e2e/e2e-setup.ts"],
    "environment": "jsdom"
  }
}
```

### 4. Test Utilities

```typescript
describe.name('Component Name', () => {
  test('description', () => {
    // Test code
  });
});

test('description', () => {
  // Test code
});

it('description', () => {
  // Test code
});

it.only('description', () => {
  // Run only this test
});

it.skip('description', () => {
  // Skip this test
});

// Helper functions
const createTest = (name: string) => {
  describe(name, () => {
    const component = createComponent();
    return component;
  });
};
```

### 5. Mocking

```typescript
// Mock module
vi.mock('foo', () => ({
  default: {
    value: 42
  },
  __esModule: true
}));

// Mock function
vi.fn(() => 'mock');

// Stub a function
vi.spyOn(console, 'log').mockImplementation(() => console.log('stub'));
```

### 6. Async Testing

```typescript
test('async test', async ({ expect }) => {
  await myAsyncFunction();
  expect(result).toBe('expected');
});

it('handles multiple timeouts', async ({ expect }) => {
  const result = await testMultipleTimeouts('timeout');
  expect(result.count).toBe(5);
});

it('handles race conditions', async ({ expect }) => {
  const promise = new Promise((resolve, reject) => {
    raceCondition();
    setTimeout(() => resolve('resolved'), 1000);
  });
  try {
    const result = await Promise.race([
      promise,
      Promise.reject(new Error('timed out')),
    ]);
    expect(result).toBe('resolved');
  } catch (e) {
    expect(e.message).toBe('timed out');
  }
});
```

### 7. Test Coverage

```bash
# Generate coverage report
npm run test:coverage

# Generate coverage with specific format
npm run test:coverage -- --coverage.reporter=html
```

```typescript
// Coverage with source maps
// src/index.ts
describe('coverage', () => {
  // Test code with coverage
  await myFunction('test');
});
```

## API Reference

### Commands

```bash
# Available vitest commands
vitest --version
vitest --help
vitest run
vitest run [tests]
vitest run --update
vitest run --coverage
vitest watch
```

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    __APP_ID__: JSON.stringify(Date.now())
  },
  env: {
    NODE_ENV: 'test'
  },
  environments: {
    happy: {
      name: 'happy'
    }
  },
  testNamePattern: 'e2e',
  test: {
    include: '**/[!node_modules]/**/?(*.)+(spec|test).[jt]s?(x)',
    exclude: ['**/dist/**', '**/lib/**']
  }
});
```

### Test API

```typescript
// Define test suite
describe.name('Test Name', (suite) => {
  // Test code
}, options);

// Test functions
test('Test Function', (suite) => { ... });
it('Test Function', (suite) => { ... });

// Hooks
hook.beforeAll(() => { ... });
hook.afterAll(() => { ... });
hook.beforeEach(() => { ... });
hook.afterEach(() => { ... });

// Assertions
assert.ok(value);
assert.equal(a, b);
assert.notEqual(a, b);
assert.deepStrictEqual(a, b);
assert.notDeepStrictEqual(a, b);
assert.strictEqual(a, b);
assert.notStrictEqual(a, b);
```

### Mock API

```typescript
// Mock module
vi.mock('../utils', async (importOriginal) => ({
  helper: await importOriginal(),
  customHelper: () => 'mocked helper'
}));

// Restore mock
vi.restoreAllMocks();

// Manual mock
vi.mock('./Foo', (): any => ({
  __esModule: true,
  default: Foo
}));
```

### Snapshot API

```typescript
test('snapshot test', () => {
  const result = renderToString(
    <div>A string</div>
  );
  expect(result).toMatchInlineSnapshot('"A string"');
});
```

## Best Practices

### 1. Organize Tests

```typescript
// src/
  /components/
    - App.tsx
    - App.spec.ts
  /hooks/
    - useAuth.ts
    - useAuth.spec.ts
  /utils/
    - validation.ts
    - validation.spec.ts
```

### 2. Test Separation

```typescript
// Test file
import { describe, test } from 'vitest';

describe('Name', () => {
  test('Test 1', () => {
    // assertions
  });
});
```

### 3. Common Patterns

```typescript
// Mock API responses
vi.mock('../api', () => ({
  fetchAPI: vi.fn(() => Promise.resolve({
    posts: [{ title: 'Hello' }],
    meta: { page: 1, per_page: 5 }
  }))
}));

// Test hooks
test('Hook Test', async ({ expect, use, onCleanup }) => {
  const myHook = createHook();
  
  use(() => ({ hook: myHook }));
  
  await vi.waitFor(() => myHook.value === 'expected');
  
  onCleanup(() => {
    myHook.destroy();
  });
});
```

### 4. Test Isolation

```typescript
// Ensure test isolation
beforeEach(() => {
  // Setup test environment
});

afterEach(() => {
  // Cleanup after each test
  // Reset mocks
  Object.keys(localStorage).forEach(key => {
    localStorage.removeItem(key);
  });
});
```

## Resources

- [Official Documentation](https://vitest.dev/)
- [GitHub Repository](https://github.com/vitest-dev/vitest)
- [Test Cases Examples](https://vitest.dev/guide/tests.html)

## Related Frameworks

- **Vitest React**: React component testing
- **Vitest Vue**: Vue component testing
- **Testing Library**: UI testing utilities
- **React Testing Library**: React UI testing

## Example Test

```typescript
// Test file
import { describe, it, expect } from 'vitest';
import { myFunction } from './utils';

describe('myFunction', () => {
  test('returns expected value', () => {
    expect(myFunction('test')).toBe('result');
  });

  test('handles edge case', () => {
    expect(myFunction('undefined')).toBeUndefined();
  });

  test('returns error for invalid input', () => {
    const error = new Error('Invalid input');
    expect(myFunction('invalid')).rejects.toEqual(error);
  });
});
```

## Related Packages

- **vitest-dom**: DOM testing utilities for vitest
- **vitest-browser**: Browser-based testing for vitest
- **jest**: JavaScript testing framework (alternative)
- **ava**: Another alternative (async testing)