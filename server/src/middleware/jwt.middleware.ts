import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  payload?: JwtPayload | string;
}

// Instantiate the JWT token validation middleware
const isAuthenticated = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Token not provided" });
  }
  console.log(token);

  try {
    const tokenString = token.split(" ")[1];
    if (!tokenString) {
      res.status(401).json({ message: "Token is malformed" });
    }

    const payload = jwt.verify(
      tokenString,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    // Add payload to the request object as req.payload for use in next middleware or route
    req.payload = payload;
    console.log("AuthenticatedPayload:", req.payload);
    // Call next() to pass the request to the next middleware function or route
    next();
  } catch (error) {
    // We catch the error here and return a 401 status code and an error message
    // The middleware throws an error if unable to validate the token. It throws an error if:
    // 1. There is no token
    // 2. Token is invalid
    // 3. There is no headers or authorization in req (no token)
    res.status(401).json({ messsage: "token not provided or not valid" });
  }
};

// Export the middleware so that we can use it to create protected routes
export default isAuthenticated;
