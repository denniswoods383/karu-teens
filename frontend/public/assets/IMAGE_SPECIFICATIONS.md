# Image Specifications & Guidelines

## 📁 Directory Structure
```
public/assets/images/
├── avatars/          # Profile pictures
├── covers/           # Cover photos
├── posts/            # Post images
└── icons/            # App icons & UI elements
```

## 🖼️ Image Specifications

### Profile Avatars (`/avatars/`)
- **Dimensions**: 400x400px (1:1 ratio)
- **Format**: JPG, PNG, WebP
- **Max Size**: 2MB
- **Naming**: `avatar_[user_id]_[timestamp].jpg`
- **Examples**: 
  - `avatar_123_1640995200.jpg`
  - `avatar_456_1640995300.png`

### Cover Photos (`/covers/`)
- **Dimensions**: 1200x400px (3:1 ratio)
- **Format**: JPG, PNG, WebP
- **Max Size**: 5MB
- **Naming**: `cover_[user_id]_[timestamp].jpg`
- **Examples**:
  - `cover_123_1640995200.jpg`
  - `cover_456_1640995300.png`

### Post Images (`/posts/`)
- **Dimensions**: Max 1920x1080px (maintain aspect ratio)
- **Format**: JPG, PNG, WebP, GIF
- **Max Size**: 10MB
- **Naming**: `post_[post_id]_[index]_[timestamp].jpg`
- **Examples**:
  - `post_789_1_1640995200.jpg`
  - `post_789_2_1640995201.jpg` (multiple images)

### App Icons (`/icons/`)
- **Dimensions**: Various (16x16, 32x32, 64x64, 128x128)
- **Format**: PNG, SVG
- **Max Size**: 1MB
- **Naming**: `icon_[name]_[size].png`
- **Examples**:
  - `icon_like_32.png`
  - `icon_comment_32.png`
  - `icon_share_32.png`

## 🎨 Design Guidelines

### Profile Pictures
- **Style**: Clean, professional headshots
- **Background**: Solid colors or subtle patterns
- **Face Coverage**: Face should occupy 60-80% of frame
- **Quality**: High resolution, well-lit

### Cover Photos
- **Style**: Landscape orientation, visually appealing
- **Content**: Personal interests, hobbies, or abstract designs
- **Text**: Minimal text overlay (if any)
- **Safe Zone**: Keep important content in center 1000x300px area

### Post Images
- **Quality**: High resolution, good lighting
- **Orientation**: Any (portrait, landscape, square)
- **Content**: Relevant to post content
- **Compression**: Optimized for web without quality loss

## 📱 Responsive Considerations

### Mobile Breakpoints
- **Small**: 320px - 768px
- **Medium**: 768px - 1024px
- **Large**: 1024px+

### Avatar Sizes
- **Thumbnail**: 32x32px (comments, notifications)
- **Small**: 48x48px (post headers)
- **Medium**: 80x80px (profile cards)
- **Large**: 160x160px (profile pages)

### Cover Photo Responsive
- **Mobile**: 375x125px (3:1 ratio maintained)
- **Tablet**: 768x256px
- **Desktop**: 1200x400px

## 🔧 Technical Requirements

### File Formats
- **Preferred**: WebP (best compression)
- **Fallback**: JPG (photos), PNG (graphics with transparency)
- **Animated**: GIF (limited to 5MB)

### Optimization
- **Compression**: 80-90% quality for JPG
- **Progressive**: Enable progressive loading
- **Metadata**: Strip EXIF data for privacy

### Naming Convention
```
[type]_[id]_[variant]_[timestamp].[ext]

Examples:
- avatar_user123_thumb_1640995200.webp
- cover_user456_mobile_1640995300.jpg
- post_789_original_1640995400.png
```

## 🛡️ Security & Privacy

### Content Moderation
- **AI Scanning**: Automatic inappropriate content detection
- **Manual Review**: Flagged content reviewed by moderators
- **User Reports**: Community-driven content reporting

### Privacy Protection
- **EXIF Stripping**: Remove location and device data
- **Face Detection**: Optional face blurring for privacy
- **Watermarking**: Optional watermarks for original content

## 📊 Storage Structure

### Database Fields
```sql
images:
- id (primary key)
- user_id (foreign key)
- type (avatar/cover/post)
- original_filename
- stored_filename
- dimensions (width x height)
- file_size
- mime_type
- upload_date
- is_active
```

### File System
```
/uploads/
├── 2024/
│   ├── 01/
│   │   ├── avatars/
│   │   ├── covers/
│   │   └── posts/
│   └── 02/
└── thumbnails/
    ├── small/
    ├── medium/
    └── large/
```

## 🚀 Performance Tips

### Loading Strategy
- **Lazy Loading**: Load images as they enter viewport
- **Progressive**: Show low-quality placeholder first
- **CDN**: Use Content Delivery Network for faster loading

### Caching
- **Browser Cache**: 30 days for static images
- **CDN Cache**: 7 days for user-generated content
- **Service Worker**: Cache frequently accessed images

### Optimization Tools
- **ImageOptim**: Lossless compression
- **TinyPNG**: PNG compression
- **Squoosh**: Web-based image optimization