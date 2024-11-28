//const router = require("express").Router();
import express, { Router, Request, Response, NextFunction } from "express";
const prisma = require("./db/index");
const router = Router();
//const cors = require("cors");
//const app = require("./app");
import cors from "cors";

//const dotenv = require("dotenv");
//dotenv.config();
import morgan from "morgan";
import cookieParser from "cookie-parser";
import axios from "axios";
import dotenv from "dotenv";
import isAuthenticated from "./middleware/jwt.middleware";
//import prisma from "./db/index"
//import connectDB from "./db/index";

dotenv.config();
//const connectDB = require("./db/index");

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//import Recipe, { RecipeSchema } from "./models/Recipe.model.js";
//import connectDB from "./db/index.js";

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5545;

import authRouter from "./routes/auth.routes";
app.use("/auth", authRouter);

//UserProfile
import userRouter from "./routes/user.routes";
app.use("/api/user", isAuthenticated, userRouter);

//searchbar api
app.get("/recipes/:query", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${req.params.query}&app_id=${process.env.VITE_APP_ID}&app_key=${process.env.VITE_APP_KEY}`
    );
    res.json(response.data.hits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

//Fetch and store recipe
app.post(
  "/recipes/:recipeid",
  async (req: Request<{ recipeid: string }>, res: Response) => {
    const { recipeid } = req.params;
    const recipeUrl = `${process.env.VITE_BASE_URL}/api/recipes/v2/${recipeid}?type=public&app_id=${process.env.VITE_APP_ID}&app_key=${process.env.VITE_APP_KEY}`;
    try {
      const response = await axios.get(recipeUrl);
      // console.log(response);
      const recipeData = response.data; // Assuming response contains an array of recipes

      if (!recipeData) {
        return res.status(400).json({ error: "No recipe data found" });
      }

      const newRecipe = await prisma.recipe.create({
        data: {
          title: recipeData.recipe.label,
          image: recipeData.recipe.image,
          uri: recipeData.recipe.uri,
          recipeId: recipeData.recipe.uri.split("#recipe_")[1],
          ingredients: recipeData.recipe.ingredientLines,
          servings: recipeData.recipe.yield,
          source: recipeData.recipe.source, // Or any other field containing instructions
          url: recipeData.recipe.url,
          dishType: recipeData.recipe.dishType,
          cuisineType: recipeData.recipe.cuisineType,
          healthLabels: recipeData.recipe.healthLabels,
          totalTime: recipeData.recipe.totalTime,
          apiLink: recipeData._links.self.href,
        },
      });

      res
        .status(200)
        .json({ message: "Recipe saved successfully", data: newRecipe });
    } catch (error) {
      console.error("Error fetching and saving recipe", error);
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
