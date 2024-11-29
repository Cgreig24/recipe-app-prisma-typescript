import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "./pages/UserProfilePage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetails from "./pages/RecipeDetails";
import YourRecipes from "./pages/YourRecipes";

function App() {
  // const [count, setCount] = useState(0);
  let message: string = "hello, typescript setup is working";

  return (
    <>
      <div>
        <Navbar />
        <p>{message}</p>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/user" element={<UserProfilePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:recipeid" element={<RecipeDetails />} />
          <Route path="/your-recipes" element={<YourRecipes />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
