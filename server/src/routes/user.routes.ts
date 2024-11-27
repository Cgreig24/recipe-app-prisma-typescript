import express, { Request, Response, NextFunction } from "express";
//import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = require("../db/index");
//const prisma = new PrismaClient();
import isAuthenticated from "../middleware/jwt.middleware";
const yourRecipesRouter = express.Router({ mergeParams: true });

interface AuthenticatedRequest extends Request {
  payload: { id: number };
}

router.get(
  "/:userid",
  isAuthenticated,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // console.log(req.params);
    //const { userId } = req.payload._id;
    // console.log(id);

    try {
      //const user = await User.findById(userId);
      const { id } = req.payload;
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
