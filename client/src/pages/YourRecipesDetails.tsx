import React, { useState, useEffect, useContext, SyntheticEvent } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import cartoonFood from "../assets/cartoon-food.png";

interface YourRecipeDetails {
  id: number;
  title: string;
  image: string;
  ingredients: string[];
  servings: number;
  source: string;
  url: string;
  dishType: string[];
  cuisineType: string[];
  healthLabels: string[];
  totalTime: number;
  notes: string[];
}

const YourRecipeDetails: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { recipeid } = useParams<{ recipeid: string }>();
  const [yourRecipeFetchDetails, setYourRecipeFetchDetails] =
    useState<YourRecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [ingredientToEdit, setIngredientToEdit] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchYourRecipeDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/your-recipes/${recipeid}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setYourRecipeFetchDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setError("Failed to load your recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchYourRecipeDetails();
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [recipeid, user]);

  const handleSaveNotes = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/your-recipes/${recipeid}`,
        { notes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status === 200) {
        fetchYourRecipeDetails();
        setNotes("");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      setError("Failed to save notes");
    }
  };

  const handleAddIngredient = async () => {
    if (!newIngredient || !yourRecipeFetchDetails) return;

    const updatedIngredients = [
      ...yourRecipeFetchDetails.ingredients,
      newIngredient,
    ];

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/your-recipes/${recipeid}`,
        { ingredients: updatedIngredients },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status === 200) {
        fetchYourRecipeDetails();
        setNewIngredient("");
      }
    } catch (error) {
      console.error("Error adding ingredient:", error);
      setError("Failed to add ingredient");
    }
  };

  const handleEditIngredient = async (index: number) => {
    if (!ingredientToEdit || !yourRecipeFetchDetails) return;
    const updatedIngredients = [...yourRecipeFetchDetails.ingredients];
    updatedIngredients[index] = ingredientToEdit;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/your-recipes/${recipeid}`,
        { ingredients: updatedIngredients },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status === 200) {
        fetchYourRecipeDetails();
        setIngredientToEdit(null);
      }
    } catch (error) {
      console.error("Error editing ingredient:", error);
      setError("Failed to edit ingredient");
    }
  };

  const handleRemoveIngredient = async (index: number) => {
    if (!yourRecipeFetchDetails) return;

    const confirmRemove = window.confirm(
      "Are you sure you want to remove this ingredient?"
    );
    if (confirmRemove) {
      const updatedIngredients = yourRecipeFetchDetails.ingredients.filter(
        (_, i) => i !== index
      );

      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/your-recipes/${recipeid}`,
          { ingredients: updatedIngredients },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.status === 200) {
          fetchYourRecipeDetails();
        }
      } catch (error) {
        console.error("Error removing ingredient:", error);
        setError("Failed to remove ingredient");
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/your-recipes/${recipeid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status == 204) {
        console.log("Recipe deleted successfully, navigating back.");
        navigate("/your-recipes");
      } else {
        console.error("Unexpected response from delete request:", response);
        setError("Failed to delete the recipe, try again.");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setError("Failed to remove recipe from your book");
    }
  };

  return (
    <>
      {yourRecipeFetchDetails ? (
        <div className="prose p-6 bg-base-200 w-full">
          <h2 className="text-4xl text-primary font-bold text-transform: capitalize">
            {yourRecipeFetchDetails.title}
          </h2>
          <img
            src={yourRecipeFetchDetails.image}
            onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.src = cartoonFood;
            }}
            className="w-64 h-64 border-4 border-neutral rounded-xl"
          />
          <div className="flex gap-4 my-4">
            {yourRecipeFetchDetails.dishType && (
              <span className="badge badge-primary capitalize p-3">
                {yourRecipeFetchDetails.dishType}
              </span>
            )}
            {yourRecipeFetchDetails.cuisineType && (
              <span className="badge badge-accent capitalize p-3">
                {yourRecipeFetchDetails.cuisineType}
              </span>
            )}
            {yourRecipeFetchDetails.servings && (
              <span className="badge badge-success capitalize p-3">
                {" "}
                Serves {yourRecipeFetchDetails.servings}
              </span>
            )}
            {yourRecipeFetchDetails.totalTime && (
              <span className="badge badge-warning capitalize p-3">
                {yourRecipeFetchDetails.totalTime}
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">Ingredients</h3>
            <button className="btn btn-link text-sm">Edit Ingredients</button>
            <ul className="list-inside">
              {yourRecipeFetchDetails.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  {ingredientToEdit === index.toString() ? (
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={ingredientToEdit}
                      onChange={(e) => setIngredientToEdit(e.target.value)}
                    />
                  ) : (
                    <>
                      {ingredient}
                      <div className="space-x-2">
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => setIngredientToEdit(index.toString())}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-xs btn-outline btn-error p-1"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                  {ingredientToEdit === index.toString() && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEditIngredient(index)}
                    >
                      Save
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <input
                className="input input-bordered input-secondary w-full max-w-xs"
                type="text"
                id="new-ingredient"
                placeholder="Add extra ingredient..."
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
              />
              <button
                className="btn btn-outline btn-success mt-2"
                onClick={handleAddIngredient}
              >
                Add
              </button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-xl font-semibold">Instructions</h3>
            <p>Instructions provided by {yourRecipeFetchDetails.source}</p>
            <a
              href={yourRecipeFetchDetails.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:bg-primary hover:text-white p-2 rounded"
            >
              View Instructions
            </a>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">Notes or Suggestions</h3>
            <ul className="list-disc pl-5">
              {yourRecipeFetchDetails.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
            <div className="mt-4">
              <textarea
                className="textarea textarea-bordered w-full max-w-xs"
                id="notes"
                placeholder="Add additional notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                //rows="3"
              />
              <button
                className="btn btn-outline btn-sm mt-2"
                onClick={handleSaveNotes}
              >
                Save
              </button>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button className="btn btn-primary" onClick={handleDelete}>
              Remove from Recipe Book
            </button>
            <button
              className="btn btn-neutral"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Nothing loaded</h2>
          <button className="btn btn-warning">Remove from Recipe Book</button>
        </div>
      )}
    </>
  );
};

export default YourRecipeDetails;
