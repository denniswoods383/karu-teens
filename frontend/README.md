# 🎓 Karu Teens Social Platform

A modern social media platform built for university students with real-time messaging, profile management, and AI-powered features.

## ✨ Features

### 🔐 **Authentication**
- User registration and login
- Secure JWT authentication
- Protected routes

### 👤 **Profile Management**
- Complete profile system with photo uploads
- Edit profile with detailed information
- View other users' profiles
- Follow/unfollow functionality

### 📝 **Posts & Social**
- Create posts with text and media
- Real-time post feed
- Like and comment system
- Delete your own posts

### 💬 **Real-time Messaging**
- Direct messages between users
- File and photo sharing
- Real-time message delivery
- Typing indicators

### 🔔 **Notifications**
- Real-time notifications for:
  - New posts
  - New messages
  - New followers
  - New users joining

### 📱 **Feedback System**
- Floating feedback button
- Anonymous or identified feedback
- Complaints and suggestions

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (Database, Auth, Real-time)
- **File Storage:** Cloudinary
- **Deployment:** Vercel
- **Forms:** Formspree

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📱 Features Overview

### **For Students:**
- ✅ Create and manage profiles
- ✅ Share posts with photos/videos
- ✅ Real-time messaging
- ✅ Follow other students
- ✅ Get notifications
- ✅ Submit feedback anonymously

### **Mobile Responsive:**
- ✅ Works on all devices
- ✅ Touch-friendly interface
- ✅ Optimized for mobile use

## 🌐 Deployment

Deploy to Vercel:
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

## 📄 License

Built by Karu Teens Productions with ❤️