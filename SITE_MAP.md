# Karu Teens Productions - Social Platform Site Map & Features

## 🌐 Current Site Structure

### **Authentication Pages**
- `/auth/login` - User login with JWT authentication
- `/auth/register` - New user registration
- `/auth/forgot-password` - Password recovery

### **Main Application Pages**
- `/feed` - Main social feed with posts and interactions
- `/messages` - Real-time messaging system with conversations
- `/profile/[id]` - User profile pages (dynamic routing)
- `/comrades` - Friends/followers management
- `/notifications` - User notifications center
- `/menu` - Navigation menu and settings

### **AI Features**
- `/ai` - Scarlet Witch image generation engine
- `/analytics` - User analytics and insights

### **Additional Features**
- Advanced AI-powered content creation
- Multi-style image synthesis

## 🔧 Technical Implementation

### **Dynamic IP Detection**
- Automatic IP detection on startup
- Network change adaptation
- Cross-device compatibility

### **Real-time Features**
- WebSocket connections for messaging
- Live typing indicators
- Online/offline status
- Message delivery receipts

### **Database Structure**
- **Users Table**: Authentication and profile data
- **Messages Table**: 68+ stored conversations
- **Posts Table**: Social media content
- **Notifications Table**: User alerts and updates

## 📱 User Flow

### **Login Process**
1. User accesses `/auth/login`
2. JWT token generated and stored
3. Automatic redirect to `/feed`
4. Protected routes validate token

### **Messaging System**
1. Access `/messages` page
2. View conversation list
3. Select user to chat with
4. Real-time message exchange
5. Typing indicators and read receipts

### **Profile Management**
1. Visit `/profile/[id]` for any user
2. View comprehensive profile information
3. Follow/unfollow functionality
4. Profile customization options

## 🌍 Network Access

### **Current URLs**
- **Frontend**: `http://[AUTO_DETECTED_IP]:3000`
- **Backend API**: `http://[AUTO_DETECTED_IP]:8001`
- **WebSocket**: `ws://[AUTO_DETECTED_IP]:8001/ws/[user_id]`

### **API Endpoints**
- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/messages/*` - Messaging system
- `/api/v1/users/*` - User management
- `/api/v1/posts/*` - Social media posts
- `/api/v1/notifications/*` - User notifications

## 🔄 Auto-Update System

### **IP Management Scripts**
- `get-ip.sh` - Detects current network IP
- `update-ip.sh` - Updates all API endpoints
- `quick-ip-update.sh` - Quick refresh without restart
- `start-services.sh` - Auto-start with IP detection

### **Dynamic Configuration**
- Frontend automatically detects IP from browser URL
- All API calls use dynamic IP detection
- No manual configuration needed for network changes

## 📊 Current Status

### **Active Features**
✅ User authentication and JWT tokens
✅ Real-time messaging (68+ messages stored)
✅ User profiles and social features
✅ Dynamic IP detection and network adaptation
✅ Cross-platform responsive design
✅ WebSocket real-time communication
✅ Template literal syntax fixes completed
✅ Server-side rendering issues resolved
✅ API endpoint corrections implemented

### **Database Health**
- SQLite database: `socialdb.db`
- Active conversations preserved
- Message history maintained
- User data secure and accessible

### **Recent Fixes**
- Fixed all template literal syntax errors
- Resolved localStorage SSR issues
- Corrected API endpoint paths
- Updated import paths for components
- Fixed WebSocket connection issues
- Implemented proper error handling

### **Network Status**
- Auto IP detection: ✅ Working
- Backend API: ✅ Running on port 8001
- Frontend: ✅ Running on port 3000
- WebSocket: ✅ Connected
- Cross-device access: ✅ Available