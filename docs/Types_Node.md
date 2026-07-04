# @types/node

## Overview

TypeScript definitions for Node.js. Provides type checking for the Node.js runtime, including the core module `node:*,*` and Node.js' standard library.

**Version:** ^22.14.0 (frontend), ^20 (backend)  
**Homepage:** [https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node)  
**License:** MIT

## Installation

```bash
npm install @types/node --save-dev
```

## API Reference

### Core Types

```typescript
/// <reference types="node" />
node:module;
node:process;
declare namespace node {
  module {
    // Node.js module namespace
  }
  process {
    // Node.js process namespace
  }
}
```

### Node.js Modules

#### http

```typescript
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.end('Hello World');
});

// Example: GET request
http.get('http://localhost:8080', (res: http.IncomingMessage) => {
  let data = '';
  res.on('data', (chunk: string) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
});
```

#### fs

```typescript
import fs from 'node:fs';

// Read file
async function readFile() {
  const fileContent = await fs.promises.readFile('example.txt', 'utf8');
  console.log(fileContent);
}

// Write file
async function writeFile() {
  await fs.promises.writeFile('output.txt', 'Hello World', 'utf8');
}

// Directory operations
async function createDir() {
  await fs.promises.mkdir('new-folder');
}
```

#### path

```typescript
import * as path from 'node:path';

const dir = path.dirname('./foo/bar/baz.js');
// \bar\baz

const sep = path.sep;
// \
```

#### os

```typescript
import os from 'node:os';

const hostname = os.hostname();
const platform = os.platform();
const tmpdir = os.tmpdir();
const homedir = os.homedir();
const userInfo = os.userInfo();
```

#### util

```typescript
import util from 'node:util';

const log = util.log;
const format = util.format();
const inspect = util.inspect();
```

#### stream

```typescript
import { Readable, Writable, Stream, Transform, Duplex } from 'node:stream';

interface Readable extends Stream {
  // Readable stream
}

interface Writable extends Stream {
  // Writable stream
}
```

### Network

#### net

```typescript
import net from 'node:net';

const server = net.createServer((socket: net.Socket) => {
  socket.write(string?: string);
});

server.listen(port, [callback]);
server.on('connection', (socket) => {
  console.log('User connected');
});
```

#### dns

```typescript
import dns from 'node:dns';

// Resolve hostname to IP
const address = await dns.promises.resolve('www.google.com');
console.log(address.address);
```

#### https

```typescript
import https from 'node:https';

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Hello World');
});
```

### File System

#### crypto

```typescript
import crypto from 'node:crypto';

// Hashing and encryption
const hash = await crypto.createHash('sha256');
hash.update('Hello World');

// Random bytes
const randomBytes = await crypto.randomBytes(16);

// Private keys
const privateKey = await crypto.generateKeyPair('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});
```

## Process Environment

```typescript
import * as process from 'node:process';

console.log(process.env.NODE_ENV);
console.log(process.env.PORT);

process.on('SIGINT', () => {
  // Handle Ctrl+C
  process.exit();
});
```

## Events

```typescript
import { EventEmitter } from 'node:events';

class MyClass extends EventEmitter {
  trigger(event: string) {
    this.emit(event, new Date());
  }
}

const myclass = new MyClass();
myclass.on('myEvent', (data) => {
  console.log('Event received:', data);
});
```

## Buffer

```typescript
import { Buffer } from 'node:buffer';

const buffer = Buffer.from('Hello World');
console.log(buffer.toString('hex')); // 48656c6c6f20576f726c64
```

## Debugging

```typescript
// Enable debug logging
import debug from { path/to/debug-package } as unknown as { debug: typeof debug };

debug(`Debug message`);
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "types": ["node"],
    "module": "node",
    "target": "ESNext",
    "lib": ["ESNext"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

## Resources

- [TypeScript Definition Repository](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Node.js Type Definitions](https://www.npmjs.com/package/@types/node)

## Notes

- Type definitions are maintained by the [DefinitelyTyped](https://definitelytyped.org/) community
- Use `--save-dev` when installing as it's only needed for development
- The `@types/node` package includes type definitions for all Node.js core modules

## Compatibility

- Node.js `types` directory: https://github.com/nodejs/node/tree/main/types
- TypeScript version compatibility check:
  - Node.js 18.x+: TypeScript 4.0+ supports all types
  - Node.js 16.x: TypeScript 3.7+ supports all types
  - Node.js 14.x: TypeScript 3.5+ supports all types