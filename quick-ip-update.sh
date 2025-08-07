#!/bin/bash

# Quick IP update without restarting services
echo "🔄 Quick IP Update (without restart)..."
./update-ip.sh

CURRENT_IP=$(./get-ip.sh)
echo ""
echo "✅ Updated! New access URLs:"
echo "🌐 Frontend: http://$CURRENT_IP:3000"
echo "📡 Backend:  http://$CURRENT_IP:8001"
echo ""
echo "ℹ️  Note: You may need to refresh your browser"