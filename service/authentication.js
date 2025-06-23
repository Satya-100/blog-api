const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    profileImgUrl: user.profileImgUrl,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
}

module.exports = {
  generateToken,
  validateToken,
};
