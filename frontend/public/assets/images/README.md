# Image Assets Directory

## 📂 Quick Reference

### Avatar Images (400x400px)
```
avatars/
├── default_avatar.png          # Default profile picture
├── avatar_placeholder.svg      # Loading placeholder
└── [user uploads go here]
```

### Cover Photos (1200x400px)
```
covers/
├── default_cover.jpg           # Default cover photo
├── cover_placeholder.svg       # Loading placeholder
└── [user uploads go here]
```

### Post Images (Variable sizes)
```
posts/
├── image_placeholder.svg       # Loading placeholder
├── video_thumbnail.png         # Video preview
└── [user uploads go here]
```

### UI Icons (32x32px standard)
```
icons/
├── like.svg                    # Like button
├── comment.svg                 # Comment button
├── share.svg                   # Share button
├── notification.svg            # Notification bell
├── message.svg                 # Message icon
├── menu.svg                    # Hamburger menu
├── search.svg                  # Search icon
├── settings.svg                # Settings gear
├── logout.svg                  # Logout icon
└── upload.svg                  # File upload
```

## 🎯 Usage Examples

### In React Components
```jsx
// Avatar
<img src="/assets/images/avatars/avatar_123.jpg" alt="User Avatar" />

// Cover Photo
<img src="/assets/images/covers/cover_123.jpg" alt="Cover Photo" />

// Post Image
<img src="/assets/images/posts/post_456.jpg" alt="Post Image" />

// Icon
<img src="/assets/images/icons/like.svg" alt="Like" />
```

### CSS Background Images
```css
.avatar {
  background-image: url('/assets/images/avatars/default_avatar.png');
}

.cover-photo {
  background-image: url('/assets/images/covers/default_cover.jpg');
}
```

## 📏 Size Guidelines

| Type | Dimensions | Max Size | Format |
|------|------------|----------|---------|
| Avatar | 400x400px | 2MB | JPG/PNG/WebP |
| Cover | 1200x400px | 5MB | JPG/PNG/WebP |
| Post | 1920x1080px | 10MB | JPG/PNG/WebP/GIF |
| Icon | 32x32px | 100KB | SVG/PNG |

## 🔄 Responsive Variants

### Avatar Sizes
- **xs**: 24x24px (inline mentions)
- **sm**: 32x32px (comments)
- **md**: 48x48px (post headers)
- **lg**: 80x80px (profile cards)
- **xl**: 160x160px (profile pages)

### Cover Photo Breakpoints
- **Mobile**: 375x125px
- **Tablet**: 768x256px  
- **Desktop**: 1200x400px

## 🎨 Placeholder Images

Create these default images for better UX:

1. **default_avatar.png** - Generic user silhouette
2. **default_cover.jpg** - Gradient or pattern background
3. **image_placeholder.svg** - Loading skeleton
4. **broken_image.svg** - Error state icon

## 📱 Mobile Considerations

- Use WebP format when supported
- Provide fallback images for older browsers
- Implement lazy loading for better performance
- Consider data usage on mobile networks