import express, { Request, Response, NextFunction } from "express";
//import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = require("../db/index");
//const prisma = new PrismaClient();
import isAuthenticated from "../middleware/jwt.middleware";
import axios from "axios";
const yourRecipesRouter = express.Router({ mergeParams: true });

interface AuthenticatedRequest extends Request {
  payload: { id: number };
}

router.post(
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

export default router;
