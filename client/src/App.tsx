import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import RecipesPage from "./pages/RecipesPage";

function App() {
  // const [count, setCount] = useState(0);
  let message: string = "hello, typescript setup is working";

  return (
    <>
      <div>
        <p>{message}</p>
        <Routes>
          <Route path="/recipes" element={<RecipesPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
