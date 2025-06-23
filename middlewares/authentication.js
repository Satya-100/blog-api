const { validateToken } = require("../service/authentication");

function checkForAuth(cookieName) {
  return (req, res, next) => {
    const token = req.cookies[cookieName];
    if (!token) {
      return next();
    }
    try {
      const payload = validateToken(token);
      req.user = payload;
    } catch (error) {
      console.error("Token validation failed:", error);
      return res.status(401).send("Unauthorized");
    }
    return next();
  };
}

module.exports = {
  checkForAuth,
};
