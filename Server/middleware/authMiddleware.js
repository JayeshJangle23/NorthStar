
// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         message: "Authentication required",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// };

// module.exports = authMiddleware;




const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Prefer the HTTP-only cookie; allow Bearer tokens for Postman.
    const authHeader = req.headers.authorization;

    const token =
      req.cookies?.token ||
      (authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
