const express = require("express");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 8080;

// Single source of truth for build assets. `gulp generic` writes to the repo
// root build/generic; docker-install.sh copies that into docker/build for the
// container image. Prefer the canonical root build when present (local dev) so
// a rebuild is served immediately without a manual copy step, which previously
// caused API/Worker version skew. Fall back to the local copy (in-container).
const rootBuild = path.join(__dirname, "..", "build", "generic");
const localBuild = path.join(__dirname, "build", "generic");
const buildDir = fs.existsSync(rootBuild) ? rootBuild : localBuild;

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

// Serve static files. Build filenames (e.g. pdf.worker.mjs) are not
// content-hashed, so long-lived caching would serve stale assets across
// version bumps. Use ETag/Last-Modified revalidation instead: the browser
// always re-checks and gets a fast 304 when nothing changed.
app.use(
  express.static(buildDir, {
    etag: true,
    lastModified: true,
    setHeaders(res) {
      res.setHeader("Cache-Control", "no-cache");
    },
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
  console.log(`Serving build assets from: ${buildDir}`);
  console.log("Helmet security headers configured for iframe embedding");
});
