import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth.context";
import cartoonFood from "../assets/cartoon-food.png";
import allNormaImage from "../assets/alla-norma.jpg";

interface YourRecipe {
  id: string;
  title: string;
  image: string;
  recipeid: string;
  servings: number;
  dishType: string[];
  cuisineType: string[];
  totalTime: number;
  ingredients: string[];
  source: string;
  url: string;
}

function YourRecipes() {
  const { user } = useContext(AuthContext);
  const [yourRecipeFetch, setYourRecipeFetch] = useState<YourRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  //const { recipeid } = useParams();

  const fetchYourRecipe = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/your-recipes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setYourRecipeFetch(response.data.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setError("Failed to load your recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchYourRecipe();
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [user]);

  const handleYourRecipeClick = (recipeid: YourRecipe) => {
    // const recipeid = recipe._id;
    navigate(`/your-recipes/${recipeid}`);
  };

  return (
    <>
      {yourRecipeFetch.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 pt-20 p-6 bg-base-200">
          {yourRecipeFetch.map((recipe) => (
            <div className="card bg-base-100 w-full shadow-xl">
              <div
                className="prose"
                key={recipe.id}
                onClick={() => handleYourRecipeClick(recipe.id)}
              >
                <h2 className="text-primary text-transform: capitalize text-center text-ellipsis overflow-hidden h-16 pt-2 px-1">
                  {recipe.title}
                </h2>
                <div className="px-4 pt-1 mt-1">
                  <img
                    className="w-full h-53 object-cover border-4 border-neutral rounded-xl"
                    src={recipe.image}
                    onError={(e) => {
                      e.target.src = cartoonFood;
                    }}
                    alt="image not found"
                  />
                </div>
                <div>
                  <p
                    className={`text-center text-transform: capitalize my-2 text-secondary p-2 rounded-md`}
                  >
                    {recipe.dishType}
                  </p>
                  <p className="text-transform: capitalize text-center my-2">
                    {recipe.cuisineType}
                  </p>
                </div>
                <button className="btn justify-center my-2">
                  Remove from Recipe Book
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-10">
          <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row pt-10">
              <img
                src={allNormaImage}
                className="max-w-sm rounded-lg shadow-2xl"
              />
              <div>
                <h1 className="text-5xl font-bold text-primary">
                  Recipe Book App
                </h1>
                <p className="py-6">
                  <Link to={"/login"}>
                    <span className="text-secondary underline font-bold">
                      {" "}
                      Log in
                    </span>{" "}
                  </Link>
                  to view your recipe book.
                  <br /> Don't have an account yet?{" "}
                  <Link to={"/signup"}>
                    <span className="text-secondary underline font-bold">
                      Sign up here
                    </span>{" "}
                  </Link>{" "}
                  to create
                  <br /> your personalized recipe book.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default YourRecipes;
