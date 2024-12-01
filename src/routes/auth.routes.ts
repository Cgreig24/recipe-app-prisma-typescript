import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
//import { PrismaClient, User as PrismaUser } from "@prisma/client";
const prisma = require("../db/index");
//const prisma = new PrismaClient();

import isAuthenticated from "../middleware/jwt.middleware";

declare global {
  namespace Express {
    interface Request {
      payload?: JwtPayload | string;
    }
  }
}

interface SignUpRequestBody {
  email: string;
  password: string;
  username: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

const router = express.Router();
const saltRounds = 10;

// POST  /auth/signup
//Add new user
router.post(
  "/signup",
  async (
    req: Request<{}, {}, SignUpRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password, username } = req.body;

    if (email === "" || password === "" || username === "") {
      res.status(400).json({ message: "provide email, password and username" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    try {
      const foundUser = await prisma.user.findUnique({ where: { email } });

      if (foundUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      // If the email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new user in the database
      // We return a pending promise, which allows us to chain another `then`

      const createdUser = await prisma.user.create({
        data: { email, password: hashedPassword, username },
      });

      const {
        email: createdEmail,
        username: createdUsername,
        id,
      } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email: createdEmail, username: createdUsername, id: id };

      // Send a json response containing the user object
      res.status(201).json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// POST  /auth/login
router.post(
  "/login",
  async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Login route hit!");
    console.log(req.body);
    const { email, password } = req.body;

    if (email === "" || password === "") {
      res.status(400).json({ message: "Provide email and password" });
      return;
    }

    // Check the users collection if a user with the same email exists
    try {
      const foundUser = await prisma.user.findUnique({ where: { email } });

      if (!foundUser) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { id, email: userEmail, username } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { id: id, email: userEmail, username };

        // Create and sign the token
        const authToken = jwt.sign(
          payload,
          process.env.TOKEN_SECRET as string,
          {
            algorithm: "HS256",
            expiresIn: "6h",
          }
        );

        // Send the token as the response
        res.status(200).json({ authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server error" });
    }
  }
);

// GET  /auth/verify
router.get(
  "/verify",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    // <== CREATE NEW ROUTE

    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log(`req.payload`, req.payload);

    // Send back the object with user data
    // previously set as the token payload
    res.status(200).json(req.payload);
  }
);

export default router;
