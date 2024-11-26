import React, { useState, useEffect } from "react";
import axios from "axios";
//import RecipeList from "../components/RecipeList";
import { useNavigate } from "react-router-dom";

interface Recipe {
  label: string;
  image: string;
  dishType: string[];
  ingredients: string[];
  cuisineType: string[];
  uri: string;
}

interface RecipeResponse {
  recipe: Recipe;
}

function RecipeDeets() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const navigate = useNavigate();

  const getRecipes = async () => {
    const response = await axios.get<RecipeResponse[]>(
      `${import.meta.env.VITE_API_URL}/recipes/${query}`
    );
    console.log(response.data);
    console.log(response);
    //setRecipes(response.data);
    const recipeData = response.data.map((r) => r.recipe);
    setRecipes(recipeData);
  };

  useEffect(() => {
    if (query) {
      getRecipes();
    }
  }, [query]);

  const getSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    setSearch("");
  };

  const handleRecipeClick = (recipe: Recipe) => {
    const recipeid = recipe.uri.split("#recipe_")[1];
    navigate(`/recipes/${recipeid}`);
  };
  return (
    <>
      <div className="bg-base-200 p-6">
        <form
          className="flex justify-center items-center space-x-2 mt-8 mb-8 bg-base-200"
          onSubmit={getSearch}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered input-primary w-4/5 sm:w-1/3 h-12 text-xl shadow-lg rounded-full"
          />
          <button
            className="btn btn-secondary text-white h-12 px-6 rounded-full"
            type="submit"
          >
            Search
          </button>
        </form>
        {/* 
        <p onClick={nextClick}>Next</p>
        */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 bg-base-200 pt-4">
          {recipes.map((recipe) => (
            <div
              className="card bg-base-100 w-full shadow-xl prose"
              key={recipe.uri}
              onClick={() => handleRecipeClick(recipe)}
            >
              <h2 className="text-primary text-transform: capitalize text-center text-ellipsis overflow-hidden h-16 pt-2 px-1">
                {recipe.label}
              </h2>
              <div className="px-4 pt-1">
                <img
                  className="rounded-xl w-full h-48 object-cover border-4 border-neutral"
                  src={recipe.image}
                  alt={recipe.label}
                />
              </div>
              <div className="card-body">
                <p
                  className={`text-center text-transform: capitalize my-2 text-white p-2 rounded-md`}
                >
                  {recipe.dishType}
                </p>
                <p className="text-center my-2">
                  {recipe.ingredients.length} Ingredients
                </p>

                <p className="text-center text-transform: capitalize my-2">
                  {recipe.cuisineType}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/*
        <RecipeList recipes={recipes} />
         */}
      </div>
    </>
  );
}

export default RecipeDeets;
