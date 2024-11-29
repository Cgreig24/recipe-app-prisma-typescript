"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
//const router = require("express").Router();
const express_1 = __importStar(require("express"));
const prisma = require("./db/index");
const router = (0, express_1.Router)();
//const cors = require("cors");
//const app = require("./app");
const cors_1 = __importDefault(require("cors"));
//const dotenv = require("dotenv");
//dotenv.config();
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_middleware_1 = __importDefault(require("./middleware/jwt.middleware"));
//import prisma from "./db/index"
//import connectDB from "./db/index";
dotenv_1.default.config();
//const connectDB = require("./db/index");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
//import Recipe, { RecipeSchema } from "./models/Recipe.model.js";
//import connectDB from "./db/index.js";
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5545;
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
app.use("/auth", auth_routes_1.default);
//UserProfile
const user_routes_1 = __importDefault(require("./routes/user.routes"));
app.use("/api/user", jwt_middleware_1.default, user_routes_1.default);
//searchbar api
app.get("/recipes/:query", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${req.params.query}&app_id=${process.env.VITE_APP_ID}&app_key=${process.env.VITE_APP_KEY}`);
        res.json(response.data.hits);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching recipes" });
    }
}));
//Fetch and store recipe
app.post("/recipes/:recipeid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipeid } = req.params;
    const recipeUrl = `${process.env.VITE_BASE_URL}/api/recipes/v2/${recipeid}?type=public&app_id=${process.env.VITE_APP_ID}&app_key=${process.env.VITE_APP_KEY}`;
    try {
        const response = yield axios_1.default.get(recipeUrl);
        // console.log(response);
        const recipeData = response.data; // Assuming response contains an array of recipes
        if (!recipeData) {
            return res.status(400).json({ error: "No recipe data found" });
        }
        const newRecipe = yield prisma.recipe.create({
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
    }
    catch (error) {
        console.error("Error fetching and saving recipe", error);
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
}));
//Add to your-recipes
app.post("/your-recipes/:recipeid", jwt_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("req.headers.authorization", req.headers.authorization);
    const { recipeid } = req.params;
    console.log("payload:::", req.payload);
    //console.log(recipeid);
    //const payload = req.payload as JwtPayload;
    const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
    // const { id } = req.payload;
    //const userId = await prisma.user.findUnique({ where: { id } });
    // if (req.payload._id !== userId) {
    //   return res.status(403).json({ error: "User not authorized" });
    // }
    if (!userId) {
        return res.status(403).json({ message: "User ID not found in payload" });
    }
    try {
        const recipe = yield prisma.recipe.findFirst({
            where: { recipeId: recipeid },
        });
        if (!recipe) {
            return res.status(400).json({ error: "Recipe not found" });
        }
        const newYourRecipe = yield prisma.yourRecipes.create({
            data: {
                title: recipe.title,
                image: recipe.image,
                uri: recipe.uri,
                recipeId: recipe.recipeId, // Reference the recipe's ID
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
        {
            /*
        const { _id, ...newRecipe } = recipe.toObject();
        const newYourRecipe = await prisma.yourRecipes.create({
          ...newRecipe,
          userId: req.payload.id,
        });
        await newYourRecipe.save();
    */
        }
        res
            .status(200)
            .json({ message: "Recipe saved successfully", data: newYourRecipe });
    }
    catch (error) {
        console.error("Error fetching and saving recipe", error);
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
}));
//fetch recipes for /your-recipes list
app.get("/your-recipes", jwt_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        const recipes = yield prisma.yourRecipes.findMany({
            where: { userId },
            include: { Recipe: true },
        });
        if (!recipes || recipes.length === 0) {
            return res
                .status(404)
                .json({ message: "No recipes found for this user" });
        }
        res.status(200).json({ data: recipes });
    }
    catch (error) {
        console.error("Error fetching users recipes", error);
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
