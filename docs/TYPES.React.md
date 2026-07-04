# TypeScript Types for React

## Overview

TypeScript types that augment React DOM elements and components. Provides strict type checking for React applications.

**Version:** ^18 (backend), ^19 (frontend)  
**Homepage:** [https://www.typescriptlang.org/](https://www.typescriptlang.org/)  
**Repository:** [https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react](https://github.com/DefinitelyTyped/DefiniteTyped/tree/master/types/react)  
**License:** MIT

## Installation

```bash
npm install typescript react @types/react react-dom @types/react-dom
```

## Installation and Configuration

### Setup TypeScript

```bash
npm install -D typescript @types/react @types/react-dom
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": false,
    "experimentalDecorators": true,
    "downlevelIteration": true,
    "moduleResolution": "node",
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "forceConsistentReturnTypes": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

## API Reference

### DOM Elements

```typescript
interface HTMLDivElement extends ElementAttributes {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
  onclick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onmouseover?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  ref?: RefObject<HTMLDivElement | null>;
}
```

```typescript
// Example usage
function MyComponent({ id, className, children, onClick }) {
  return (
    <div id={id} className={className} onClick={onClick}>
      {children}
    </div>
  );
}
```

### React Components

```typescript
// Functional component with props interface
interface Props {
  title: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const Component: React.FC<Props> = ({ title, children, disabled, onClick }) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
      <button onClick={onClick} disabled={disabled}>
        Click me
      </button>
    </div>
  );
};

// Export with 'React' type
export default Component as React.FC<Props>;
```

### useState Hook

```typescript
// Basic useState with correct type
const [count, setCount] = useState<number>(0);

// useState with string
const [name, setName] = useState<string>('John');

// useState with complex type
interface User {
  name: string;
  age: number;
}

const [user, setUser] = useState<User | null>(null);

// useState with undefined default
const [status, setStatus] = useState<undefined | string>(undefined);
```

### useEffect Hook

```typescript
// Cleanup with return function
useEffect(() => {
  let interval;
  
  // Set up effect
  interval = setInterval(() => {
    console.log('tick');
  }, 1000);
  
  // Cleanup
  return () => {
    clearInterval(interval);
  };
}, []);
```

### useRef Hook

```typescript
// Basic useRef
const inputRef = useRef<HTMLInputElement>(null);

// Access element by ref
const handleClick = () => {
  inputRef.current?.focus();
};

// useRef with initial value
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);
```

### useCallback Hook

```typescript
// Memoize callback function
const memoizedCallback = useCallback(() => {
  console.log('memoized callback');
}, [dependency1, dependency2]);

// Conditional callback memoization
const conditionalCallback = useCallback(
  (userId) => getPost(userProfile, userId)
);
```

### useMemo Hook

```typescript
// Cache calculation result
const filteredItems = useMemo(() => {
  return items.filter(item => item.status === 'active');
}, [items]);

// Cache derived values
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);
```

### useLayoutEffect Hook

```typescript
// Access DOM synchronously during render
useLayoutEffect(() => {
  const { ref } = myRef;
  const rect = ref.current?.getBoundingClientRect();
  // Use rect synchronously
}, [deps]);
```

### useReducer Hook

```typescript
// Use reducer for state management
type State = {
  count: number;
  name: string;
};

type Action = { type: 'increment'; value: number } | { type: 'incrementName' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + action.value };
    case 'incrementName':
      return { ...state, name: state.name + ' updated' };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

### useImperativeHandle Hook

```typescript
export interface MyInputHandle {
  focus: (arg?: string) => void;
  setPlaceholder: (arg: string) => void;
  clear: () => void;
}

function MyInput(props: MyInputProps) {
  const inputRef = useImperativeHandle<MyInputHandle)(
    ref,
    () => ({
      focus: () => {
        document.getElementById('my-input')?.focus();
      },
      setPlaceholder: (arg) => {
        props.setPlaceholder(arg);
      },
      clear: () => {
        props.clear();
      }
    })
  );
}
```

### Context Hook

```typescript
// Create Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provide context
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme('dark') }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Use context
const theme = useThemeContext();
```

### useRef for Component Ref

```typescript
function Parent() {
  const childRef = useRef<ChildComponent>(null);
  
  const handleClick = () => {
    childRef.current?.focus();
    childRef.current?.updateData(newData);
  };
  
  return <ChildComponent />;
}

// Usage in child
const refObject = useRef();
```

### useDebug Hook (Debugging)

```typescript
function Component() {
  const [count] = useState(0);
  const [state] = useDebug();
  
  return (
    <div>
      <p>Count: {count}</p>
      {/* Debug output */}
    </div>
  );
}
```

### useTransition Hook

```typescript
const [isPending, startTransition] = useTransition();
startTransition(() => {
  // Perform transition
});

function App() {
  const [count, setCount] = useState(0);
  
  const onClick = () => {
    setCount((count) => count + 1);
 
    const promise = startTransition(() => {
        // Perform transition
    });
  };
  
  return (
    <button onClick={onClick}>Button</button>
  );
}
```

### useEffect for Side Effects

```typescript
// Fetch data on mount
useEffect(() => {
  const fetchData = async () => {
    const data = await fetchData();
    setUsers(data);
  };
  
  fetchData();
}, []);

// Cleanup on unmount
useEffect(() => {
  unsubscribe = channel.subscribe(updateCallback);
  const timer = setInterval(() => console.log('tick'), 1000);
  
  return () => {
    unsubscribe?.unsubscribe();
    clearInterval(timer);
  };
}, []);
```

### StrictMode and other components

```typescript
import { StrictMode } from 'react';
import { Suspense, lazy } from 'react';

function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <LazyComponent />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>
  );
}
```

### Error Boundary

```typescript
// Functional component with error boundary
class ErrorBoundary extends React.Component<
  React.ErrorBoundaryProps,
  React.ErrorBoundaryState
> {
  state = { hasError: false };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong:</h1>;
    }
    return this.props.children;
  }
}
```

## Best Practices

### 1. Define Proper Interface Types

```typescript
// Define interface for props
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

type ClassValue = string | number;
interface ClassNameProps {
  className: string | undefined;
}
```

### 2. Use Type Guards

```typescript
// Type guard for checking if value is null or undefined
function getValueOrDefault<T>(obj: Record<string, T | null | undefined>, key: string): T {
  const value = obj[key];
  return value ?? defaultValue;
}
```

### 3. Use Generic Components

```typescript
// Generic component with constraints
interface BaseProps {
  id?: string;
  className?: string;
}

interface HTMLButtonElementProps extends BaseProps {
  onClick: () => void;
}

export interface ButtonProps {
  onClick?: () => void;
  className?: string;
}

function Button({ className, onClick }: ButtonProps) {
  return (
    <button className={cn(className)} onClick={onClick}>
      Click me
    </button>
  );
}
```

### 4. Use React.forwardRef (when needed)

```typescript
const MyCustomElement = React.forwardRef<HTMLDivElement, MyCustomElementProps>(
  ({ className, customProp, ...props }, ref) => {
    return (
      <div
        className={cn('base', className)}
        {customProp}
        {...props}
        ref={ref}
      />
    );
  }
);
```

### 5. Use useMemo for Expensive Calculations

```typescript
// Cache expensive calculations
const useMemoized = useMemo(() => {
  // Expensive calculation
}, [changedValue]);
```

### 6. Use useCallback for Event Handlers

```typescript
// Cache callback function
const memoizedCallback = useCallback(() => {
  doSomething();
}, [deps]);
```

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

## Breaking Changes from React v18 to v19

### Strict Mode Behavior

```bash
# React 18
ReactDOM.render(
  <StrictMode><Component /></StrictMode>,
  root
);

# React 19
const root = ReactDOM.createRoot(document);
root.render(
  <StrictMode><Component /></StrictMode>
);
```

### useEffect Dependency Array

```bash
# React 18
useEffect(() => {
  // Effect runs on mount and unmount (dependencies: [])
}, []);

useEffect(() => {
  // Effect runs on every re-render (no dependencies)
});

# React 19
useEffect(() => {
  // Effect runs once on mount
}, []);

// No dependency array - runs on every render
useEffect(() => {
  // Effect runs only when dependencies change
}, [dep1, dep2]);
```

## Related Packages

- **react-dom**: DOM renderer for browser
- **react-test-renderer**: React DOM renderer for unit tests
- **@types/react**: TypeScript type definitions for React
- **@strapi/client**: Strapi Client
- **@google/genai**: Generative AI integration