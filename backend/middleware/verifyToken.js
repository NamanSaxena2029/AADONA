const helmet = require("helmet");

// ✅ Security middleware
app.use(helmet());

/* =============================
   VERIFY TOKEN MIDDLEWARE
============================= */

// ✅ In-memory token cache (5 min)
const tokenCache = new Map();

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Cache check
    if (tokenCache.has(token)) {
      req.user = tokenCache.get(token);

      // extra safety
      if (!req.user.admin) {
        return res.status(403).json({ message: "Not authorized as admin" });
      }

      return next();
    }

    // ✅ Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // ❌ Not admin
    if (!decodedToken.admin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    // ✅ Attach user
    req.user = decodedToken;

    // ✅ Cache token (5 min)
    tokenCache.set(token, decodedToken);
    setTimeout(() => tokenCache.delete(token), 5 * 60 * 1000);

    return next();

  } catch (error) {
    console.log("TOKEN ERROR:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};