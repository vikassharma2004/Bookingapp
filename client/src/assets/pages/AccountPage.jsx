import { useContext, useState } from "react";
import {  Navigate, useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "./AccountNav";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { user, ready, setUser } = useContext(UserContext);
  const { subpage } = useParams();

  // Default to 'profile' if subpage is undefined
  const currentPage = subpage || 'profile';

  // logout function
  async function logout() {
    try {
      await axios.post("http://localhost:8080/logout");
      setUser(null);
      setRedirect("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, you can display an error message to the user
    }
  }

  

  

  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav/>
     
      {currentPage === 'profile' && (
        <div className="text-center max-w-lg mx-auto mb-2">
          Logged in as {user.name}
          <br />
          <button onClick={logout} className="bg-primary primary max-w-sm mt-4">Logout</button>
        </div>
      )}
      {currentPage === 'places' && (
        <PlacesPage/>
      )}
    </div>
  );
}
