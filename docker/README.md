# PDF.js Docker Setup with Iframe Support

This Docker setup provides a PDF.js viewer that can be embedded in iframes with proper security headers configured.

## Features

- ✅ Configured security headers for iframe embedding
- ✅ CORS support for cross-origin requests
- ✅ Content Security Policy optimized for PDF.js
- ✅ Express.js server for better control
- ✅ Support for both local and remote PDF files

## Quick Start

### 1. Build the Docker image
```bash
docker build -t pdf-viewer .
```

### 2. Run the container
```bash
docker run -p 8080:8080 pdf-viewer
```

### 3. Access the viewer
- Direct access: http://localhost:8080/web/viewer.html
- Root redirect: http://localhost:8080/

## Iframe Usage

### Basic Iframe Embedding
```html
<iframe 
  src="http://localhost:8080/web/viewer.html"
  width="100%" 
  height="600px"
  frameborder="0">
</iframe>
```

### Load Specific PDF File
```html
<iframe 
  src="http://localhost:8080/web/viewer.html?file=your-document.pdf"
  width="100%" 
  height="600px"
  frameborder="0">
</iframe>
```

### Load PDF from URL
```html
<iframe 
  src="http://localhost:8080/web/viewer.html?file=https://example.com/document.pdf"
  width="100%" 
  height="600px"
  frameborder="0">
</iframe>
```

## Security Configuration

The server is configured with the following security headers:

### X-Frame-Options
- Set to `ALLOWALL` to allow embedding from any domain
- Can be modified to specific domains for better security

### Content Security Policy
```
frame-ancestors *; 
object-src 'none'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
worker-src 'self' blob:; 
connect-src 'self' blob: data:; 
img-src 'self' blob: data:; 
font-src 'self' data:; 
style-src 'self' 'unsafe-inline';
```

### CORS Headers
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- Full cross-origin support for loading PDFs

## Customization

### Restrict to Specific Domains
To allow iframe embedding only from specific domains, modify `server.js`:

```javascript
// Replace this line:
res.setHeader("X-Frame-Options", "ALLOWALL");

// With:
res.setHeader("X-Frame-Options", "ALLOW-FROM https://yourdomain.com");

// Or update CSP:
res.setHeader(
  "Content-Security-Policy",
  "frame-ancestors 'self' https://yourdomain.com https://anotherdomain.com;"
);
```

### Alternative Server Options
If you prefer the simple http-server without custom headers:
```bash
npm run server-simple
```

## File Structure
```
docker/
├── Dockerfile              # Docker configuration
├── package.json            # Dependencies and scripts
├── server.js               # Express server with security headers
└── build/generic/          # PDF.js build files
    └── web/
        └── viewer.html     # Main PDF viewer
```

## Environment Variables
- `PORT`: Server port (default: 8080)

## Troubleshooting

### PDF Not Loading in Iframe
1. Check browser console for CSP violations
2. Verify CORS headers are present
3. Ensure PDF file is accessible

### Browser Compatibility
- Modern browsers support all features
- IE11 and older may have limited support

## Production Considerations

1. **Security**: Restrict `frame-ancestors` to known domains
2. **SSL**: Use HTTPS in production
3. **Content**: Validate PDF sources
4. **Performance**: Consider CDN for static assets