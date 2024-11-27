import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homepageImage from "../assets/recipe-homepage.jpg";
import axios from "axios";

function Homepage() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/recipes");
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row pt-10">
        <img src={homepageImage} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <h1 className="text-5xl font-bold text-primary">Recipe Book App</h1>
          <p className="py-6">
            Welcome to the Recipe Book App! Search through our recipe database
            and curate your own recipe book. Tweak your saved recipes with your
            own ingredients or notes and suggestions.
          </p>
          <button className="btn btn-primary" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
