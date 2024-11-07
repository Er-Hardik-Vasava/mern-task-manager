import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import Register from "./Pages/Register.jsx";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import axios from "axios"; 
import { AuthContext } from "./context/AuthContext.jsx";
import YourTask from "../src/Pages/YourTask.jsx"

const App = () => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(AuthContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/user/me",
          {
            withCredentials: true,
          }
        );
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsAuthenticated(false);
        setUser({});
      }
    };

    getUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task" element={<YourTask />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
