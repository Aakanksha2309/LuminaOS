// iframe-proxy.js
const express = require("express");
const request = require("request");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

// 🔒 Secure headers
app.use(helmet());

// 🌍 CORS allow only your frontend domain
app.use(cors({
  origin: "https://your-frontend-domain.com", // ✅ change this
  methods: ["GET"]
}));

// 🚫 Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 20 // 20 requests/min per IP
});
app.use(limiter);

app.get("/proxy", (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) return res.status(400).send("Missing ?url param");

  // Block suspicious sites (you can allowlist instead if needed)
  const banned = ["localhost", "127.0.0.1"];
  if (banned.some(b => targetUrl.includes(b))) {
    return res.status(403).send("URL blocked for security.");
  }

  // 🔄 Proxy request with header removal
  request({
    url: targetUrl,
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  }, (err, response, body) => {
    if (err) return res.status(500).send("Proxy failed");

    const headers = response.headers;
    delete headers["x-frame-options"];
    delete headers["content-security-policy"];
    delete headers["content-security-policy-report-only"];

    res.set(headers).send(body);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("✅ Production proxy live at port " + PORT);
});
