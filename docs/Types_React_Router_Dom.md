# React Router

## Overview

React Router is the standard framework for building and using single-page applications (SPAs). It provides routing for React applications and manages URL-based navigation.

**Version:** ^6.0.0  
**Homepage:** [https://reactrouter.com/](https://reactrouter.com/)  
**Repository:** [https://github.com/remix-run/react-router](https://github.com/remix-run/react-router)  
**License:** MIT

## Installation

```bash
npm install react-router-dom react-router-dom@6
```

```bash
yarn add react-router-dom react-router-dom@6
```

## Installation and Configuration

### Setup React Router

```tsx
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  );
}
```

### Create Routes

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />
        {/* About route */}
        <Route path="/about" element={<About />} />
        {/* Profile route */}
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </Router>
  );
}
```

## Core Features

### 1. Routing

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />
        {/* About route */}
        <Route path="/about" element={<About />} />
        {/* Profile route with param */}
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. Link Component

Navigate between routes using Link:

```tsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
```

### 3. NavLink Component

```tsx
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink to="/" isActive={isActive => isActive.match(/^\/($|\d)/)}>
        {('active' in isActive) ? 'Home' : 'Home'}
      </NavLink>
      <NavLink to="/about" isActive={isActive => isActive === '/about'}>
        {('active' in isActive) ? 'Highlight' : 'About'}
      </NavLink>
    </nav>
  );
}
```

### 4. Outlet

```tsx
function Layout({ children }) {
  return (
    <header className="header">
      <h1>Title</h1>
    </header>
    <main>{children}</main>
  );
}
```

```tsx
function App() {
  return (
    <Outlet />
  );
}
```

### 5. Routes

```tsx
<Routes>
  <Route path="*" element={<DefaultFallback />} />
  <Route path="route" element={<DefaultFallback />} />
</Routes>
```

### 6. Navigation

```tsx
import { NavLink, Link } from 'react-router-dom';

<Link to="/" replace state={{ message: 'updated' }}>Home</Link>
<Link to="/about-end" state={{ message: 'hello' }}>About</Link>
```

## API Reference

### Hooks

#### BrowserRouter Hook

```tsx
import { useNavigate as navigate } from 'react-router-dom';

// Create navigation hook
function useOnNavigate() {
  const navigate = useNavigate();
  
  return () => {
    navigate('/');
  };
}
```

#### useParams Hook

```tsx
import { useParams } from 'react-router-dom';

function Profile() {
  const { user_id } = useParams();
  return <div>User: {user_id}</div>;
}
```

#### useSearchParams Hook

```tsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleChange = (e) => {
    const param = e.target.value;
    setSearchParams({
      'param': param,
      'param2': searchParams['param2']
    });
  };
  
  return (
    <input
      type="text"
      placeholder="Search for:"
      value={searchParams.get('search')}
      onChange={handleChange}
    />
  );
}
```

#### useMatch Hook

```tsx
import { useMatch } from 'react-router-dom';

function ActiveRoutes() {
  const [routes] = useRoutes([
    { path: '/path', element: <About /> },
    { path: '/other', element: <About /> }
  ]);
  
  const match = useMatch('/users/:userId');
  const matchData = useMatches(['user/:userId', 'user/:userId/:postId']);
  
  return (
    <div>{match.end}</div>
  );
}
```

#### useLocation Hook

```tsx
import { useLocation } from 'react-router-dom';

function Component() {
  const { pathname, hash, search, state } = useLocation();
  
  return (
    <div>
      <p>Pathname: {pathname}</p>
      <p>Search: {search}</p>
      <p>Hash: {hash}</p>
    </div>
  );
}
```

#### useOutlet Hook

```tsx
<Outlet />
```

#### useRoutes Hook

```tsx
<Outlet />
```

### API Routes

```tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Define routes
const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Outlet>
        <ChildrenRoute />
      </Outlet>
    ),
    errorElement: <FallbackElement />,
  },
  {
    element: <Route />,
  },
]);

// Use app router
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
  },
]);

// Render application
function App() {
  return <RouterProvider router={router} />;
}
```

### Navigation Component

```tsx
import { Link } from 'react-router-dom';

<Link>
  Link navigation component for the current location
</Link>

<Link to={path}>
  Link to the provided path
</Link>
```

### ActiveLink Component

```tsx
<NavLink
  to={LinkTo}
  isActive={(location, navigation) => isActive}
>
  {link}
</NavLink>
```

#### Active Parameters

```tsx
<NavLink to="/" isActive={isActive => active === '/'}>
  Active Home
</NavLink>
```

#### Active Route Params

```tsx
<NavLink to="/product/:id" isActive={(location, { pathname }) => 
  pathname === '/product/' + location.params.id
}>
  Active Product
</NavLink>
```

#### Outlet

```tsx
<Route path="users" element={
  <Outlet />
} />
```

#### Outlet with Outlet Route

```tsx
<Outlet route={[
  {
    path: 'user/:id',
    children: <OutletRoutes />
  }
]}>
  {user}
</Outlet>
```

### Default Outlet Route

```tsx
<Router>
  <Routes>
    <Route index element={(<Outlet />)} />
  </Routes>
</Router>
```

### Routes with Layout

```tsx
function Layout() {
  return (
    <Header />
    <Outlet />
  );
}

<Route path="*" element={<DefaultFallback />} />
```

### Layout with Params

```tsx
<Route path="products" element={
  <Layout params={{
    layout: 'product',
    params: [
      {
        name: 'id',
        id: 'prod_123'
      }
    ]
  }} >
    {Outlet}
  </Layout>
} />
```

## API Reference

### Link Component

```tsx
<Link
  to={linkTo}
  replace=false
  state={state}
>
  Link content
</Link>
```

#### Link Props

```tsx
LinkProps: {
  to: string | RoutePath
  replace: boolean
  state: unknown
}
```

### Navigate Function

```tsx
navigate(path: string | Path, options: {
  state: { [key: string]: unknown }
  replace: boolean
}) => void
```

#### Navigation Types

```typescript
type NavigationOptions = {
  state?: object
  replace?: boolean
  scroll?: boolean
};
```

### Outlet Component

```tsx
<Outlet
  name?: string
  route?: RouteMatch[]
>
```

#### Outlet Props

```tsx
OutletProps: {
  name: string | undefined
  route?: Array<{
    key: string
    children?: ReactNode
    index?: boolean
  }>
}
```

### Outlet Routes

```tsx
<Route path="/*" element={<RouteLayout />}>
  <Route path="user/:id" element={<UserLayout />}>
    <Outlet />
  </Route>
</Route>
```

### Layout with Outlet

```tsx
<Layout>
  <Outlet />
</Layout>
```

## Usage Examples

### Simple Navigation

```tsx
function Home() {
  return (
    <h1>Home</h1>
  );
}

function About() {
  return (
    <h1>About</h1>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Dynamic Routes

```tsx
function UserPage({ userId }) {
  return <div>User: {userId}</div>;
}

function UserProfile() {
  // Fetch data based on id
  const user = await fetchUser(params.id);
  
  return (
    <div>
      <h2>{user.name}</h2>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/:id" element={<UserRole />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Related Packages

- **react-router-dom**: React router bindings for router-dom
- **@strapi/client**: Strapi client for frontend integration
- **@tanstack/query**: Data fetching and cache management

## Resources

- [Official Documentation](https://reactrouter.com/)
- [GitHub Repository](https://github.com/remix-run/react-router)
- [Examples](https://reactrouter.com/start/tutorial)

## Breaking Changes

### React Router v4 to v5

```tsx
// Version 4
import { Redirect } from 'react-router';

function App() {
  return (
    <Route>
      <Redirect to='/' />
    </Route>
  );
}
```

### React Router v5 to v6

```tsx
// Version 5
import { Link, BrowserRouter } from 'react-router-dom';

// Version 6 - Changed API
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={
          <>
            <Outlet />
            <ChildrenRoute />
          </>
        }>
        </Route>
        <Route path='route/*' element={
          <>
            <Layout route={[
              {
                path: 'route/one',
                children: <Route1 />
              }
            ]} />
            <Outlet />
          </>
        }>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Resources

- [React Router Documentation](https://reactrouter.com/)
- [GitHub](https://github.com/remix-run/react-router)
- [npm](https://www.npmjs.com/package/react-router)