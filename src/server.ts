import express, { Router, Request, Response, NextFunction } from "express";
const prisma = require("./db/index");
const router = Router();
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import axios from "axios";
import dotenv from "dotenv";
import isAuthenticated from "./middleware/jwt.middleware";

dotenv.config();

const app: express.Application = express();
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [FRONTEND_URL],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

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
      const recipeData = response.data;

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
          source: recipeData.recipe.source,
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

interface AuthenticatedRequest extends Request {
  payload: { id: number };
}

//Add to your-recipes
app.post(
  "/your-recipes/:recipeid",
  isAuthenticated,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("req.headers.authorization", req.headers.authorization);
    const { recipeid } = req.params;
    console.log("payload:::", req.payload);

    const userId = req.payload?.id;

    if (!userId) {
      return res.status(403).json({ message: "User ID not found in payload" });
    }

    try {
      const recipe = await prisma.recipe.findFirst({
        where: { recipeId: recipeid },
      });
      if (!recipe) {
        return res.status(400).json({ error: "Recipe not found" });
      }

      const newYourRecipe = await prisma.yourRecipes.create({
        data: {
          title: recipe.title,
          image: recipe.image,
          uri: recipe.uri,
          recipeId: recipe.recipeId,
          ingredients: recipe.ingredients,
          servings: recipe.servings,
          source: recipe.source,
          url: recipe.url,
          dishType: recipe.dishType,
          cuisineType: recipe.cuisineType,
          healthLabels: recipe.healthLabels,
          totalTime: recipe.totalTime,
          apiLink: recipe.apiLink,
          userId,
        },
      });

      res
        .status(200)
        .json({ message: "Recipe saved successfully", data: newYourRecipe });
    } catch (error) {
      console.error("Error fetching and saving recipe", error);
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  }
);

//fetch recipes for /your-recipes list
app.get(
  "/your-recipes",
  isAuthenticated,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.payload?.id;
      const recipes = await prisma.yourRecipes.findMany({
        where: { userId },
      });
      if (!recipes || recipes.length === 0) {
        return res
          .status(404)
          .json({ message: "No recipes found for this user" });
      }
      res.status(200).json({ data: recipes });
    } catch (error) {
      console.error("Error fetching users recipes", error);
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  }
);

//fetch recipes for your-recipes details page
app.get(
  "/your-recipes/:recipeid",
  isAuthenticated,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { recipeid } = req.params;

      const recipe = await prisma.yourRecipes.findUnique({
        where: {
          id: +recipeid,
        },
      });
      if (!recipe) {
        return res.status(404).json({ error: "recipe not found" });
      }
      res.status(200).json({ data: recipe });
    } catch (error) {
      console.error("Error fetching recipe", error);
      res.status(500).json({ error: "Failed to fetch recipe" });
    }
  }
);

app.delete(
  "/your-recipes/:recipeid",
  isAuthenticated,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { recipeid } = req.params;
      const userId = req.payload.id;
      const recipe = await prisma.yourRecipes.delete({
        where: {
          id: +recipeid,
        },
      });

      if (!recipe) {
        return res
          .status(404)
          .json({ error: "Recipe not found or not authorized" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error while retrieving recipe", error);
      res.status(500).json({ error: "Failed to delete recipe" });
    }
  }
);

//add additional notes
app.patch(
  "/your-recipes/:recipeid",
  isAuthenticated,
  async (req: AuthenticatedRequest, res: Response) => {
    const { recipeid } = req.params;
    const { ingredients, notes } = req.body;

    try {
      const updateData: any = {};

      if (ingredients) {
        updateData.ingredients = ingredients;
      }

      if (notes) {
        updateData.notes = {
          push: notes,
        };
      }

      const updatedRecipe = await prisma.yourRecipes.update({
        where: { id: +recipeid },
        data: updateData,
      });

      res.status(200).json({
        message: "Notes updated successfully",
        data: updatedRecipe,
      });
    } catch (error) {
      console.error("Error updating notes:", error);
      res.status(500).json({ error: "Failed to update notes" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
