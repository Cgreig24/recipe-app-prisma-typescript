"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { PrismaClient } from "@prisma/client";
const router = express_1.default.Router();
const prisma = require("../db/index");
//const prisma = new PrismaClient();
const jwt_middleware_1 = __importDefault(require("../middleware/jwt.middleware"));
const yourRecipesRouter = express_1.default.Router({ mergeParams: true });
//UserProfile
router.get("/:userid", jwt_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params);
    //const { userId } = req.payload._id;
    // console.log(id);
    try {
        //const user = await User.findById(userId);
        const { id } = req.payload;
        const user = yield prisma.user.findUnique({ where: { id } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.default = router;
