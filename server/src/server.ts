const router = require("express").Router();
import { Request, Response, NextFunction } from "express";

const cors = require("cors");
const app = require("./app");

app.use(cors());
require("dotenv").config();
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import axios from "axios";
//import Recipe, { RecipeSchema } from "./models/Recipe.model.js";
//import connectDB from "./db/index.js";

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5545;

app.get("/recipes/:query", async (req: Request, res: Response) => {
  const response = await axios.get(
    `https://api.edamam.com/api/recipes/v2?type=public&q=${req.params.query}&app_id=${process.env.VITE_APP_ID}&app_key=${process.env.VITE_APP_KEY}`
  );
  res.json(response.data.hits.recipe);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
