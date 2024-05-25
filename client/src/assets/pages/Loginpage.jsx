import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import {UserContext} from "../../UserContext";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [redirect, setredirect] = useState(false);
  const {setUser,user} = useContext(UserContext);




  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const {data} = await axios.post(
        "http://localhost:8080/login",
        { email, password },
        { withCredentials: true }
      );
    
      setUser(data);
      toast.success("login succesfull")
      setredirect(true);
    } catch (e) {
      setError("Login failed");
      toast.error("Login failed. Please check your credentials and try again.");
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
           
          />
          <button type="submit" className="primary">
            Login
          </button>
          {error && <div className="text-red-500">{error}</div>}
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black font-bold" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Loginpage;
