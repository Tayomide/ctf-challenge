import { handler } from './dist/server/entry.mjs'; // Import the Astro server handler
import http from 'http';

const port = process.env.PORT || 3000; // Render provides PORT environment variable

// Create an HTTP server to handle requests
http.createServer(handler);