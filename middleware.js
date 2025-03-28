import { NextResponse } from 'next/server';
import { initSocketServer } from './app/lib/socket-server';

// Socket.io server instance
let socketIOinitialized = false;

export default function middleware(request) {
  // Socket.io API route
  if (request.nextUrl.pathname.startsWith('/api/socket')) {
    if (!socketIOinitialized && typeof process.env.SOCKET_IO_SERVER === 'undefined') {
      // Initialize Socket.io server on first request to socket route
      const server = require('http').createServer();
      initSocketServer(server);

      // Start the Socket.io server
      const port = process.env.SOCKET_IO_PORT || 3001;
      server.listen(port, () => {
        console.log(`Socket.io server listening on port ${port}`);
      });

      // Set flag to avoid reinitializing
      socketIOinitialized = true;
      process.env.SOCKET_IO_SERVER = 'initialized';
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/socket(.*)'],
};
