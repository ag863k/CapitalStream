#!/bin/bash
# Azure App Service startup script for Node.js

echo "Starting CapitalStream Backend on Azure..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Start the application
node server.js
