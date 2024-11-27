import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

interface Recipe {
  title: string;
  image: string;
  servings: number;
  dishType: string[];
  cuisineType: string[];
  totalTime: number;
  ingredients: string[];
  source: string;
  url: string;
}

const RecipeFetcher: React.FC = () => {
  const { recipeid } = useParams<{ recipeid: string }>();
  const [recipeFetch, setRecipeFetch] = useState<Recipe | null>(null);
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const navigate = useNavigate();

  const fetchRecipe = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/recipes/${recipeid}`
      );
      setRecipeFetch(response.data.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  const addToYourRecipes = async () => {
    console.log("user", user);
    if (!user) {
      console.log("User is not logged in");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/your-recipes/${recipeid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Recipe added:", response.data);
      alert("Recipe added to your collection");
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe");
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [recipeid]);

  return (
    <div className="p-6">
      {recipeFetch ? (
        <div className="prose">
          {/* Recipe Title */}
          <h2 className="text-4xl text-primary font-bold mb-4 text-transform: capitalize">
            {recipeFetch.title}
          </h2>

          {/* Recipe Image */}
          <img
            src={recipeFetch.image}
            alt={recipeFetch.title}
            className="w-64 h-64 border-4 border-neutral rounded-xl mb-4"
          />

          {/* Recipe Info */}
          <div className="flex gap-4 mb-4">
            {recipeFetch.servings && (
              <span className="badge badge-success p-3">
                Serves: {recipeFetch.servings}
              </span>
            )}
            {recipeFetch.dishType && (
              <span className="badge badge-primary p-3">
                Course: {recipeFetch.dishType}
              </span>
            )}
            {recipeFetch.cuisineType && (
              <span className="badge badge-accent p-3">
                Cuisine: {recipeFetch.cuisineType}
              </span>
            )}
            {recipeFetch.totalTime && (
              <span className="badge badge-warning p-3">
                Time: {recipeFetch.totalTime}
              </span>
            )}
          </div>

          {/* Ingredients */}
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
            <ul className="list-inside">
              {recipeFetch.ingredients.map((ingredient, index) => (
                <li key={index} className="py-1">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">Instructions</h3>
            <p className="mb-2">
              Instructions provided by {recipeFetch.source}
            </p>
            <p>
              <a
                href={recipeFetch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:bg-primary hover:text-white p-2 rounded"
              >
                View Instructions
              </a>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="btn btn-neutral"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                addToYourRecipes();
              }}
            >
              Add to Your Recipes
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Loading recipe...</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeFetcher;
