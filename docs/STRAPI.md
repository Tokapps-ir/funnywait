# Strapi 5

## Overview

Strapi is the leading open-source headless CMS that lets developers build headless and self-hosted content APIs. Strapi is completely customizable and developer-first designed, making content management easy for non-technical users by allowing content teams to easily manage content through the interface.

**Version:** ^5.49.0  
**Homepage:** [https://strapi.io/](https://strapi.io/)  
**Repository:** [https://github.com/strapi/strapi](https://github.com/strapi/strapi)  
**License:** MIT

## Installation

### From NPM

```bash
npm create strapi-app quickstart
```

### With npm

```bash
npm create strapi-app my-app
```

### With Yarn

```bash
yarn create strapi-app my-app
```

## Key Features

### 1. Content Management

Strapi allows you to define content types, media attachments, and custom plugins through an intuitive admin interface:

```typescript
// content-types/config/posts
export default {
  collectionName: 'posts',
  info: {
    name: 'posts',
    displayName: 'Blog Posts',
    description: 'Your blog posts'
  },
  pluginOptions: {},
  schema: {
    permalink: ('https://strapi.io/resources/blog')
    displayName: 'Blog Post',
    timestamps: true,
    createdAt: () => ({
      name: 'createdAt',
      type: 'datetime',
    }),
    updatedAt: () => ({
      name: 'updatedAt',
      type: 'datetime',
      settings: {
        editable: false
      }
    }),
    id: () => ({
      type: 'uid',
    }),
    title: () => ({
      type: 'string',
      contentTypeLocalizations: true
    }),
    cover: () => ({
      type: 'component',
      name: 'post',
      localizedComponents: false
    }),
    slug: () => ({
      type: 'uid',
      localized: true
    }),
    published: () => ({
      type: 'boolean',
      defaultValue: false,
      settings: {
        visibleFor: ['users', 'roles']
      }
    }),
    content: () => ({
      type: 'component',
      name: 'post',
      localizedComponents: false
    }),
    authors: () => ({
      type: 'relation',
      relation: 'manyToMany',
      target: {
        model: 'author',
      }
    }),
    categories: () => ({
      type: 'relation',
      relation: 'oneToMany',
      targets: ['categories'],
      targetModel: 'categories'
    }),
    tags: () => ({
      type: 'relation',
      relation: 'manyToMany',
    }),
    publishedAt: () => ({
      type: 'datetime',
      localized: true
    }),
    settings: () => ({
      type: 'component',
      name: 'post',
      localizedComponents: false
    }),
    meta: () => ({
      type: 'component',
      name: 'post',
      localizedComponents: false
    })
  }
};
```

### 2. Dynamic Media Library

```typescript
// Configure image upload settings
export default {
  displayName: 'images',
  plugin: 'upload',
  config: {
    useUploadedFiles: false,
    defaultMeta: { format: 'jpeg' },
    fileSizes: {
      jpeg: 5242880
    },
    folder: 'images'
  }
};
```

### 3. Users & Permissions

```typescript
// Configure user roles and permissions
const defaultRole = {
  id: 1,
  name: 'Administrator',
  description: 'Administrator',
  type: 'admin',
  password: undefined,
  localization: {
    en: {
      name: 'Administrator',
      description: 'Administrator'
    }
  }
};
```

### 4. Content-Type Builder

Strapi's content-type builder allows you to:

- Select fields from a catalog
- Customize the layout of your content types
- Configure UI components
- Define validation rules

```typescript
// Example content type with multiple fields
export default {
  pluginOptions: {
    "content-manager": {
      collectionName: "your-collection-name",
      displayName: "Your collection name label",
      label: "Your label"
    }
  }
};
```

## API Reference

### REST API

#### Get Entries

```javascript
GET /api/content-type-name?page[page]=0&page[pageSize]=10
```

#### Filter

```javascript
// Query content
GET /api/posts?populate[author][fields]=[]
```

#### Sort

```javascript
// Sort by date desc
GET /api/posts?sort=createdAt:desc
```

#### Pagination

```javascript
// Paginate results
GET /api/posts?pagination[start]=10
```

### GraphQL

```graphql
query {
  post {
    id
    title
    description
    cover {
      id
      url
    }
  }
}
```

### Webhooks

```javascript
// Create webhook
POST /api/webhooks
{
  "data": {
    "url": "https://example.com",
    "events": [
      { "model": "api::post", "action": "create" },
      { "model": "api::category", "action": "update" }
    ]
  }
}
```

### Policies

```javascript
// Example policy - custom middleware for API requests
export default {
  name: 'CustomPolicy',
  extend({ strapi }) {
    beforeAction({ config, context }) {
      // Custom logic before action
    }
    
    afterAction({ config, result, context }) {
      // Custom logic after action
    }
  }
};
```

## Installation and Configuration

### 1. Initialize Strapi

```bash
# Create a new Strapi application
npm create strapi-app@latest my-app
cd my-app

# Install dependencies
npm run install

# Start the server
npm run develop
```

### 2. Configure Environment Variables

```bash
# .env file
DATABASE_CLIENT=sqlite
DATABASE_URI=./
JWT_SECRET=your_jwt_secret

# Strapi Cloud configuration
STRAPI_CLOUD_API_KEY=your_api_key
STRAPI_CLOUD_SECRET=your_secret_key
```

### 3. Database Connection

```javascript
// .env files
# SQLite
DATABASE_CLIENT=sqlite
DATABASE_URI=./

# PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_URI=postgres://localhost:5432/default/_

# MongoDB
DATABASE_CLIENT=mongodb
DATABASE_URI=mongodb://localhost:27017/_

# MySQL
DATABASE_CLIENT=mysql
DATABASE_URI=mysql://localhost:3306/_

# MariaDB
DATABASE_CLIENT=mariadb
DATABASE_URI=mariadb://localhost:3306/_

# Oracle
DATABASE_CLIENT=oracledb
DATABASE_URI=oracledb://localhost:1521/_

# SQL Server
DATABASE_CLIENT=sqlserver
DATABASE_URI=mssql://localhost:1433/_
```

## Deployment

### Local Development

```bash
# Start strapi in development mode
npm run develop

# Start strapi in production mode
npm run build
npm run start
```

### Strapi Cloud

1. Login to Strapi Cloud
2. Create a new project
3. Clone your local project
4. Apply the project to deploy

```bash
npm run deploy:cloud
```

### Docker

```bash
# Build and run with Docker
docker build . -t strapi-docker
docker run --rm -p 1337:1337 -v /path/to/content:/app/content strapi-docker
```

### Deploy Commands

```bash
# Deploy with npx
npx strapi deploy

# Deploy with CLI tool
npx strapi deploy
```

### Cloud Deployment

```bash
# Connect to Strapi Cloud
npx strapi-cloud connect

# Deploy to cloud
npx strapi-cloud deploy
```

## Plugin Management

### Core Plugins

Strapi 5 comes with built-in plugins:

- `strapi-plugin-documentation` - API documentation
- `strapi-plugin-graphql` - GraphQL endpoint
- `strapi-plugin-email` - Email sending
- `strapi-plugin-cloud` - Cloud deployment
- `strapi-plugin-users-permissions` - Authentication

```bash
# View installed plugins
npx strapi plugin list

# Install a plugin
npx strapi plugin create <plugin-name> <path-to-plugin>

# Deploy a plugin
npx strapi deploy plugin <plugin-name>
```

### Plugin Configuration

```javascript
// plugins.json
{
  "strapi-plugin-users-permissions": {
    "enabled": true,
    "displayName": "Users Perms Plugin",
    "description": "Authentication and authorization",
    "icon": "fas fa-user-circle",
    "config": {
      "tokens": {
        "maxAged": 0,
        "maxAgeDuration": 864000,
        "maxUsage": 0
      }
    }
  }
}
```

### Custom Plugin Development

```javascript
// plugins/custom-plugin/src/index.js
module.exports = ({ strapi }) => {
  return {
    name: 'custom-plugin',
    
    config: {
      default: {
        custom: 'options'
      }
    },
    
    bootstrap() {
      if (!this.config('custom')) {
        return;
      }
      
      // Bootstrap logic
    },
    
    controllers() {
      return {
        CustomController: {
          find({ ctx, query }) {
            return strapi.query('custom-query').find(query);
          },
        };
      };
    },
    
    contentTypes({ config }) {
      return {
        customContentType: {
          name: 'custom-content-type',
          plugin: 'custom-plugin',
          displayName: 'Custom Content Type',
          schema: {
            attributes: {
              title: {
                type: 'string'
              },
              custom_field: {
                type: 'string',
                plugin: 'custom-plugin'
              },
              content_type_id: {
                type: 'relation',
                relation: 'oneToOne',
                target: 'api::custom-content-type.custom-content-type',
                configurable: true
              }
            },
            pluginOptions: {
              'custom-plugin': {
                custom: 'options'
              }
            }
          }
        }
      };
    },
    
    policies() {
      return {
        beforeAuthenticate: {
          name: 'BeforeAuthenticate',
          extend({ controller, ctx, config }) {
            // Custom authentication logic
          }
        }
      };
    }
  };
};
```

## Best Practices

### 1. Content-Type Design

- Use a flat structure for simple content
- Use relations for complex relationships
- Use components for reusable content blocks

```typescript
// Example content type
export default {
  displayName: 'Article',
  schema: {
    timestamps: true,
    attributes: {
      title: {
        type: 'string',
        required: true
      },
      slug: {
        type: 'uid',
        targetField: 'title',
        required: true
      },
      body: {
        type: 'component',
        name: 'Article'
      },
      author: {
        type: 'relation',
        relation: 'oneToOne',
        target: 'api::user.user',
        configurable: false
      },
      category: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::category.category',
        configurable: true
      }
    }
  }
};
```

### 2. Media Library Configuration

```typescript
// Configure media upload
config = {
  folders: [
    {
      name: 'images',
      upload: {
        cloud: {
          name: 'AWS S3'
        }
      }
    }
  ]
};
```

### 3. Performance Optimization

- Enable caching
- Configure image optimization
- Use CDN for static assets

```javascript
// Enable caching in Strapi
config: {
  "plugins": {
    "cache": {
      "enabled": true
    }
  }
}
```

### 4. Security Best Practices

- Use HTTPS in production
- Configure rate limiting
- Enable CORS with specific origins

```javascript
// CORS configuration
strapi.plugin('strapi-plugin').config = {
  cors: [
    {
      origin: 'https://your-frontend.com',
      headers: [
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Content-Type'
      ]
    }
  ]
};
```

## Related Packages

- **Strapi Cloud**: [https://www.npmjs.com/package/@strapi/plugin-cloud](https://www.npmjs.com/package/@strapi/plugin-cloud)
- **Users & Permissions**: [https://www.npmjs.com/package/@strapi/plugin-users-permissions](https://www.npmjs.com/package/@strapi/plugin-users-permissions)
- **Client SDK**: [https://www.npmjs.com/package/@strapi/client](https://www.npmjs.com/package/@strapi/client)
- **React Admin**: [https://www.npmjs.com/package/@strapi/types](https://www.npmjs.com/package/@strapi/types)

## Documentation

- [Official Documentation](https://docs.strapi.io/)
- [Strapi Cloud Documentation](https://docs.strapi.io/cloud/)
- [GraphQL Documentation](https://strapi.io/integrations/graphql)
- [Plugin Marketplace](https://strapi.io/plugins)
- [GitHub Repository](https://github.com/strapi/strapi)

## Breaking Changes from v4 to v5

The main breaking changes in Strapi 5:

1. **TypeScript Support**: Strapi 5 is written in TypeScript by default
2. **Node.js Version**: Requires Node.js 20.x
3. **API Changes**: Some breaking changes from v4
4. **Migration Guide**: [v4 to v5 migration guide](https://docs-strapi.io/migration/v4-to-v5/)