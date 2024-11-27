import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import placeholderImage from "./../assets/user.png";

import { AuthContext } from "../context/auth.context";

interface UserProfile {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  data: { id: string; username: string; email: string };
}

const API_URL = import.meta.env.VITE_API_URL;

function UserProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useContext(AuthContext);
  const { userid } = useParams();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const getUser = async () => {
      if (!user) {
        setErrorMessage("User not logged in");
        return;
      }

      const storedToken = localStorage.getItem("authToken");

      console.log(user);

      if (!storedToken) {
        setErrorMessage("No token found");
        return;
      }

      //const userId = user.data._id;

      try {
        const response = await axios.get<UserProfile>(
          `${API_URL}/api/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        setUserProfile(response.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [user]);

  return (
    <>
      <div className="bg-base-200 py-6 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          {userProfile && (
            <>
              {/* <img className="w-32 h-32 rounded-full object-cover mb-4" src={student.image} alt="profile-photo" /> */}
              <img
                src={placeholderImage}
                alt="profile-photo"
                className="rounded-full w-32 h-32 object-cover border-2 border-gray-300"
              />
              <h1 className="text-2xl mt-4 font-bold absolute">
                Username: {userProfile.username}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-24 mb-4 border-b pb-4">
                <p className="text-left mb-2 border-b pb-2">
                  <strong>Email:</strong> {userProfile.email}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfilePage;
