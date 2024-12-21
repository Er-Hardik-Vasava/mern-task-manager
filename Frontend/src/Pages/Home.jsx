import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);
  const navigateTo = useNavigate();

  const getAllTasks = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/task/all",
        { withCredentials: true }
      );
      if (data.tasks) {
        setTasks(data.tasks);
      } else {
        toast.error("No tasks found.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks.");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/login");
    } else {
      getAllTasks();
    }
  }, [isAuthenticated, navigateTo]);

  const getStatusColor = (status) => {
    const normalizedStatus = status?.trim().toLowerCase();
    switch (normalizedStatus) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "in progress":
        return "text-blue-600";
      default:
        return "text-gray-500";
    }
  };

  if (loading) return <div className="text-center">Loading...</div>; 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">All Tasks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-gray-500">
                Due Date: {new Intl.DateTimeFormat('en-GB').format(new Date(task.dueDate))}
              </p>
              <p className="text-gray-600">Name: {task.name}</p>
              <p className={`text-sm font-medium ${getStatusColor(task.status)}`}>Status: {task.status}</p>
            </div>
          ))
        ) : (
          <h2 className="text-xl text-gray-500 text-center col-span-full">No Tasks Created</h2>
        )}
      </div>
    </div>
  );
};

export default Home;
