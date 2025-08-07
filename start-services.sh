#!/bin/bash

echo "🚀 Starting Social Media Platform Services..."

# Auto-detect and update IP addresses
echo "🔄 Auto-detecting IP address..."
./update-ip.sh

# Get current IP
CURRENT_IP=$(./get-ip.sh)

# Start backend on all interfaces
echo "📡 Starting Backend API..."
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!

# Start frontend on all interfaces  
echo "🌐 Starting Frontend..."
cd ../frontend
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

echo "✅ Services Started Successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   Local:    http://localhost:3000"
echo "   Network:  http://$CURRENT_IP:3000"
echo "   Mobile:   http://$CURRENT_IP:3000"
echo ""
echo "📡 API Endpoints:"
echo "   Local:    http://localhost:8001"
echo "   Network:  http://$CURRENT_IP:8001"
echo ""
echo "🔧 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "⏹️  To stop services: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📱 Any device on your network can now access the site!"
echo "🔄 IP will auto-update on next restart if network changes"

# Keep script running
wait