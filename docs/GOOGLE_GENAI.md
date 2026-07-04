# @google/genai

## Overview

Google Generative AI SDK (@google/genai) provides a unified interface for accessing Google's generative AI models including Gemini, Vertex AI, Palm, and other Google AI capabilities.

**Version:** ^1.29.0  
**Homepage:** [https://github.com/google/generative-ai-python](https://github.com/google/generative-ai-python)  
**Repository:** [https://github.com/google/generative-ai-python](https://github.com/google/generative-ai-python)  
**License:** Apache License 2.0

## Installation

```bash
npm install @google/genai @google/generative-ai
```

## Installation and Configuration

### Setup

```javascript
import { genAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = genAI({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'ai.google.dev'
});
```

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
```

```bash
# Set API key in environment
export GOOGLE_API_KEY="your_api_key"
```

## Key Features

### 1. Initialize Connection

```javascript
import genAI from '@google/genai';
import '@google/genai/google-cloud';

const client = genAI.client({
  // Configuration
});
```

### 2. Create Chat Session

```javascript
const model = genAI.model({ modelId: 'gemini-1.5-flash' });
const chat = await client.startChat({
  model,
  history: [{ role: 'user', content: 'Hello' }, { role: 'model', content: 'Hi there!' }],
  temperature: 0.5,
  tools: [{ googleSearch: true }]
});
```

```javascript
// Create chat with existing history
const response = await chat.sendMessage(
  'What is quantum computing?'
);
```

```javascript
// Stream response
const stream = await chat.ask('How does AI work? {
  stream: true
});
```

### 3. Generate Content

```javascript
const model = genAI.model({ modelId: 'gemini-1.5-pro' });
const result = await model.generateContent('Explain quantum computing');
const response = await result;

console.log(response.text());
```

```javascript
// Generate text with parameters
const result = await model.generateText({
  content: 'Write a story about a robot'
});
const response = await result;

console.log('Response:', response.text);
```

### 4. Use Multimodal Models

```javascript
const model = genAI.model({
  modelId: 'imagen-0.1',
});

// Generate image
const result = await model.generateContent({
  image: {
    uri: 'gs://google-magazine-101/images/chicken-soup/recipe.jpg',
    mimeType: 'image/jpeg',
  },
  prompt: 'Translate the text from this image into French'
});
```

```javascript
// Process document with model
const result = await model.generateContent({
  // Document data
});
```

### 5. Tool Use

```javascript
const genAI = genAI({ apiKey });

let tools = [
   function() {
      return 'Return the answer'
   }
];

async function main() {
  const response = await tools[0];
  await response.send('What is the capital of Italy?');
  while (response.toolResponseCount > 0) {
    response = await tools[0];
    response = await response.next();
  }

  while (response.toolCodeExecutionCount > 0) {
    const result = await tools[1];
    while (result.toolResponseCount > 0) {
       response = await tools[0];
       // Process the result
    }
    response = await result.send('Calculate factorial of 10');
 }
}
```

### 6. Embedding Models

```javascript
const embeddingModel = genAI.model({
  modelId: 'embedding-001'
});

const result = await embeddingModel.generateContent('Hello world');
const embedding = await result.embedding;
```

### 7. Function Calling

```javascript
function main() {
  async function getFruits() {
     return 'The fruit of my choice';
  }
  
  function getVegetables() {
    return 'The vegetables of my choice';
  }
  
  // Register tools
  const tools = [
      { functionDeclarations: [{
          name: 'fruit_search',
          description: 'Return the answer',
          parameters: [{
            type: 'string',
            description: 'Type of fruit'
          }]
        }]
    },
      getFruits,
      getVegetables,
  ];
  
  const response = await tools[0];
  await response.send('What is my favorite fruit?');
  
  // Handle tool usage
  while (response.toolResponseCount > 0) {
    response = await tools[0];
    response = await response.next();
  }
}

await main();
```

### 8. Image Analysis

```javascript
const genAI = genAI({ apiKey });

async function analyzeImage(imageUri) {
  const result = await genAI.model({
    modelId: 'vision'
  });
  
  const response = await result.generateContent([
    {
      file: {
        uri: imageUri,
        mimeType: 'image/jpeg'
      }
    }
  ]);
  
  return response.responseText();
}
```

### 9. File Processing

```javascript
import {
  File,
  Blob,
} from '@google/genai';

// Create file
const file = await genAI.client().files.create({
  name: 'test-file',
  contentType: 'text/plain',
  mimeType: 'application/pdf',
  url: 'https://example.com/test.pdf'
});

// Upload blob to file
const blob = await genAI.client().file.uploadBlob({
  file,
  mime: 'image/jpeg',
  url: 'gs://bucket/test/file.jpg'
});

// Process file
const result = await genAI.model('text').generateContent([
  { role: 'user', parts: [{ file: { uri: '${blob.uri}' } }] },
  { role: 'assistant', content: 'Summarize this document' }
]);
```

### 10. Batch Operations

```javascript
import {
  generateContent,
  generateText,
  generateTextFromUri,
  generateImage,
} from '@google/genai';

const request = generateContent('Request text');

// Send request
const response = await request();

console.log(response.responseText());
```

## API Reference

### Client API

```javascript
const genAI = genAI({ apiKey, baseUrl });

// Create client
const client = genAI.client({
  apiKey: string,
  baseUrl: string,
  userAgent: string
});

// Start chat
const chat = await client.startChat({
  model: object,
  history: array,
  temperature: number,
  tools: array,
  toolConfig: object,
  streaming: boolean
});

// Send message
const response = await chat.sendMessage(content);

// Ask with streaming
const response = await chat.ask(content, { streaming: true });
```

### Model API

```javascript
const model = genAI.model({
  modelId: string,
  temperature: number,
  topP: number,
  topK: number,
  maxOutputTokens: number,
  stopSequences: array
});

// Generate text
const result = await model.generateContent(content);
response = await result;

// Generate with parameters
const result = await model.generateText({
  content: string,
  generationConfig: object
});

response = await result;

// Generate image
const result = await model.generateImage({
  prompt: string,
  negativePrompt: string,
  imageAspectRatio: string,
  outputMimeType: string
});

response = await result;

response = await result.generateContentFromUri(uri);
```

### File API

```javascript
const client = genAI.client({
  apiKey: string
});

// Create file
const file = await client.files.create(file);

// Update file
const file = await client.files.update(id, file);

// Delete file
await client.files.delete(id);

// Download file
const file = await client.files.download(id);

// Upload file
const file = await client.files.upload({
  mimeType: string,
  bytes: number
});
```

### Blob API

```javascript
const blob = await genAI.blob({
  uri: string,
  name: string
});

// Upload to URI
const blob = await genAI.blob({
  uri: string,
  mimeType: string
});

// Upload with metadata
const blob = await genAI.blob({
  uri: string,
  mimeType: string,
  metadata: {
    key: string
  }
});

// Access blob
const data = await blob.getData();
```

## Configuration

### Environment Variables

```javascript
// Set in environment
process.env.GOOGLE_API_KEY = 'your_api_key';

// Or configure programmatically
const genAI = genAI({ apiKey: 'your_api_key' });
```

### Client Options

```javascript
const genAI = genAI({
  apiKey: string,
  baseUrl?: string | undefined,
  // Other options
});
```

## Usage Examples

### Chat Example

```javascript
async function chat() {
  const genAI = genAI({ apiKey });
  const client = genAI.client({ apiKey });
  const model = genAI.model({ modelId: 'gemini-1.5-pro' });
  
  const chat = await client.startChat({
    model,
    history: [
      { role: 'user', parts: [{ text: 'Hello' }] },
      { role: 'model', parts: [{ text: 'How can I help you?' }] }
    ],
    temperature: 0.9,
    topP: 0.9
  });

  const userMessage = await client.userInput.prompt.prompt();

  // Send message and get response
  const response = await chat.sendMessage(userMessage);
}

await chat();
```

### Code Generation Example

```javascript
async function generateCode(description) {
  const genAI = genAI({ apiKey });
  const client = genAI.client;
  
  const codeResponse = await client.models.generateCode({
    modelId: 'gemini-code',
    prompt: description,
    language: 'python',
    numCodeExamples: 1,
    numCodeCharacters: 1000
  });
  
  return codeResponse.candidates[0].code;
}
```

### Image Captioning Example

```javascript
async function captionImage(imageUri) {
  const genAI = genAI({ apiKey });
  const model = genAI.model({ modelId: 'imagen' });
  
  const caption = await model.generateContent({
    uri: imageUri,
    prompt: 'Describe this image'
  });
  
  return caption.text();
}
```

### File Analysis Example

```javascript
async function analyzeDocument(uri) {
  const genAI = genAI({ apiKey });
  const client = genAI.client;
  
  // Upload and process file
  const docFile = await client.files.create({
    name: uri,
    mimeType: 'application/pdf'
  });
  
  // Process with AI model
  const response = await client.chat.startChat({
    model: 'gemini-1.5-pro',
    contents: [
      {
        role: 'user',
        parts: [{ file: { uri: docFile.uri } }],
        // Prompt text
      }
    ]
  });
}
```

## Best Practices

### 1. Error Handling

```javascript
async function safeGenerate(prompt) {
  try {
    const model = genAI.model({ modelId: 'gemini-1.5-pro' });
    const response = await model.generateContent(prompt);
    return response.text();
  } catch (error) {
    console.error('AI Generation error:', error);
    throw error;
  }
}
```

### 2. Rate Limiting

```javascript
async function limitedCallGenerator(prompts, maxRequests = 100) {
  const model = genAI.model({ modelId: 'gemini-1.5-pro' });
  const usage = new Map();
  
  for (const prompt of prompts) {
    await rateLimit(maxRequests);
    
    await model.generateContent(prompt);
    await new Promise(resolve => setTimeout(5000)); // 5 second delay
  }
}
```

### 3. Prompt Engineering

```javascript
function createSystemPrompt() {
  return `
    You are a helpful assistant.
    Think step by step.
    Provide clear and concise responses.
  `;
}
```

### 4. Context Management

```javascript
const contextSize = 10; // Maximum messages to keep
let history = [];

async function processMessage(message) {
  const userMessage = { role: 'user', content: message };
  
  // Add to history
  history.push(userMessage);
  
  // Trim history if needed
  if (history.length > contextSize) {
    history = history.slice(history.length - contextSize);
  }
  
  // Send to model
  const response = await model.generateContent(history);
}
```

## Resources

- [Official Documentation](https://cloud.google.com/vertex-ai/generative-ai/docs)
- [GitHub Repository](https://github.com/google/generative-ai-python)
- [Google AI Hub](https://ai.google.dev/)