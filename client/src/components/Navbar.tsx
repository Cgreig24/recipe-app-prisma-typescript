import { NavLink, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context.tsx";

export default function Navbar() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  const location = useLocation();

  const navLinks = [
    { id: 1, to: "/", label: "Home" },
    { id: 2, to: "/your-recipes", label: "Your Recipes" },
    { id: 3, to: "/recipes", label: "Recipes" },
    { id: 4, to: "/login", label: "Log In" },
    { id: 5, to: "/signup", label: "Sign Up" },
    { id: 6, to: "/profile", label: "User Profile" },
  ];
  return (
    <>
      <div className="navbar bg-accent fixed top-0 left-0 right-0 z-50">
        <div className="flex-1">
          <h1 className="btn btn-ghost text-xl">
            <a href="/">Recipe Book</a>
          </h1>
        </div>
        <div>
          <a href="/your-recipes" className="ml-6">
            Your Recipes
          </a>
        </div>
        <div>
          <a href="/recipes" className="ml-6">
            Search
          </a>
        </div>
        <div>
          <a href="/user" className="ml-6">
            Profile
          </a>
        </div>
        <div className="w-1/4 flex justify-end mr-4">
          {isLoggedIn && (
            <button
              className="btn-primary px-4 py-1 rounded hover:bg-accent"
              onClick={logOutUser}
            >
              Log Out
            </button>
          )}
          {!isLoggedIn &&
            location.pathname !== "/login" &&
            location.pathname !== "/signup" && (
              <Link to="/login">
                <button className="btn-primary px-4 py-1 rounded hover:bg-accent">
                  Log In
                </button>
              </Link>
            )}
        </div>
      </div>
    </>
  );
}
