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
const router = require("express").Router();
const cors = require("cors");
const app = require("./app");
app.use(cors());
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
//import Recipe, { RecipeSchema } from "./models/Recipe.model.js";
//import connectDB from "./db/index.js";
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5545;
app.get("/recipes/:query", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${req.params.query}&app_id=${process.env.VITE_APP_ID}&app_key=${process.env.VITE_APP_KEY}`);
    res.json(response.data.hits.recipe);
}));
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
