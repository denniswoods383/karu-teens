#!/bin/bash

# Get current IP
CURRENT_IP=$(./get-ip.sh)

echo "🔄 Updating IP addresses to: $CURRENT_IP"

# Update all TypeScript/TSX files
find frontend/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s|http://[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+:800[01]|http://$CURRENT_IP:8001|g" {} \;
find frontend/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s|ws://[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+:800[01]|ws://$CURRENT_IP:8001|g" {} \;

# Update API config
sed -i "s|http://[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+:8001|http://$CURRENT_IP:8001|g" frontend/src/config/api.ts

echo "✅ IP addresses updated successfully!"
echo "📡 Backend API: http://$CURRENT_IP:8001"
echo "🌐 Frontend: http://$CURRENT_IP:3000"