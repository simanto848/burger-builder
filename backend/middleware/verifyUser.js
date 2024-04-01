import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.burger_token;
  if (!token) {
    return res.status(401).json({ message: "You need to login first" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "You need to login first" });
    }
    req.user = user;
    next();
  });
};
