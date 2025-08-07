# Karu Teens Productions - Social Platform

A modern social media platform with real-time messaging, user profiles, and dynamic networking features.
Powered by Karu Teens Productions with Scarlet Witch AI integration.

## 🚀 Quick Start

### Automatic Setup (Recommended)
```bash
# Auto-detects IP and starts both services
./start-services.sh
```

### Manual Setup
```bash
# Backend
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

# Frontend (new terminal)
cd frontend
npm run dev
```

### IP Address Management
```bash
# Update IP without restart
./quick-ip-update.sh

# Manual IP update
./update-ip.sh
```

## 📋 Current Features

✅ **Authentication & Security:**
- User registration/login with JWT
- Protected routes and token validation
- Automatic IP detection for network changes

✅ **Real-time Messaging:**
- Direct messages with WebSocket support
- Online/offline status indicators
- Typing indicators and read receipts
- Message delivery status
- Conversation management

✅ **User Profiles:**
- Comprehensive profile system
- Profile photos and customization
- User search and discovery
- Following/followers system

✅ **Posts & Social Features:**
- Create and view posts
- Comments system
- User interactions
- Feed with real-time updates

✅ **AI Features:**
- Scarlet Witch image generation engine
- Multiple art style presets
- Batch image processing
- Stability AI integration

✅ **Technical Features:**
- Dynamic IP detection
- Cross-platform compatibility
- Mobile-responsive design
- Real-time notifications

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python)
- SQLite Database
- WebSocket support
- JWT Authentication
- SQLAlchemy ORM

**Frontend:**
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Dynamic API configuration

## 🌐 Network Access

**Current Setup:**
- Backend: `http://[YOUR_IP]:8001`
- Frontend: `http://[YOUR_IP]:3000`
- Auto-detects IP changes
- Works on any device on your network

## 📊 Database Status

**Current Data:**
- 68+ messages stored
- Multiple user conversations
- All data preserved in SQLite

## 🔧 Development

### Project Structure
```
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   ├── socialdb.db      # SQLite database
│   └── requirements.txt # Dependencies
├── frontend/            # Next.js frontend
│   ├── src/            # Source code
│   └── package.json    # Dependencies
├── get-ip.sh           # IP detection
├── update-ip.sh        # IP update utility
├── quick-ip-update.sh  # Quick IP refresh
└── start-services.sh   # Auto-start script
```

### Key Features Flow

1. **Login Flow:**
   - User enters credentials
   - JWT token generated
   - Auto-redirect to feed

2. **Messaging Flow:**
   - Real-time WebSocket connection
   - Message delivery confirmation
   - Read receipts and typing indicators

3. **Network Flow:**
   - Auto-detect current IP
   - Update all API endpoints
   - Seamless network switching

## 🚀 Access URLs

Once running:
- **Local:** http://localhost:3000
- **Network:** http://[YOUR_IP]:3000
- **API Docs:** http://[YOUR_IP]:8001/docs
- **Health Check:** http://[YOUR_IP]:8001/health

## 📱 Mobile & Cross-Platform

- Responsive design works on all devices
- Any device on your network can access
- Real-time sync across all connected devices