import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    setIsLoading(true); 

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        { email: trimmedEmail, password: trimmedPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  return (
    <div className="max-w-md mx-auto mt-28 p-10 mb-10 border bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl text-center mb-5 font-bold">Task Manager</h1>
      <h2 className="text-xl font-bold mb-6 text-center">LOGIN</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-6"> 
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6"> 
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Your Password
          </label>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading} 
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
        <div className="flex flex-col items-center m-5">
          <p className="text-gray-700 mb-4">Don't have an account?</p>
          <Link className="text-blue-500 hover:text-blue-600" to={"/register"}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
