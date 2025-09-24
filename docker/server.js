const express = require("express");
const path = require("path");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 8080;

// Helmet base config
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["*"],
        "connect-src": ["*", "'unsafe-inline'", "'unsafe-eval'", "data:", "blob:", "https:"],
      },
    },
    frameguard: false, // disable X-Frame-Options (since we use frame-ancestors in CSP)
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: "no-referrer" },
  })
);

// CORS setup (helmet doesn’t handle CORS, so keep express headers/middleware)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Serve static files
app.use(
  express.static(path.join(__dirname, "build", "generic"), {
    maxAge: "1y",
  })
);

// Root redirect
app.get("/", (req, res) => {
  res.redirect("/web/viewer.html");
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`PDF.js server running at http://localhost:${port}`);
  console.log(`Viewer available at http://localhost:${port}/web/viewer.html`);
  console.log("Helmet security headers configured for iframe embedding");
});
