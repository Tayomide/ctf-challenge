import { handler } from './dist/server/entry.mjs'; // Import the Astro server handler
import http from 'http';

const port = 8080; // Render provides PORT environment variable

// Create an HTTP server to handle requests
const server = http.createServer(handler);

// Start listening on the specified port
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});