const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

// Security headers for iframe embedding
app.use((req, res, next) => {
  // Allow embedding in iframes from any origin
  // For better security, replace '*' with specific domains
  res.setHeader("X-Frame-Options", "ALLOWALL");
  
  // Modern Content-Security-Policy approach
  // This allows iframe embedding while maintaining security
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors *; " +
    "object-src 'none'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "worker-src 'self' blob:; " +
    "connect-src 'self' blob: data:; " +
    "img-src 'self' blob: data:; " +
    "font-src 'self' data:; " +
    "style-src 'self' 'unsafe-inline';"
  );
  
  // Additional security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // CORS headers to allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  next();
});

// Serve static files from the build/generic directory
app.use(express.static(path.join(__dirname, "build", "generic"), {
  setHeaders: (res, filePath) => {
    // Set specific headers for PDF files
    if (filePath.endsWith(".pdf")) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
    }
    // Set headers for JavaScript modules
    if (filePath.endsWith(".mjs")) {
      res.setHeader("Content-Type", "application/javascript");
    }
    // Set headers for source maps
    if (filePath.endsWith(".map")) {
      res.setHeader("Content-Type", "application/json");
    }
  }
}));

// Handle root route - redirect to viewer
app.get("/", (req, res) => {
  res.redirect("/web/viewer.html");
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`PDF.js server running at http://localhost:${port}`);
  console.log(`Viewer available at http://localhost:${port}/web/viewer.html`);
  console.log("Security headers configured for iframe embedding");
});