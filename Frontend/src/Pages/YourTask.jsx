import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const YourTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [tasks, setTasks] = useState([]);

  const { isAuthenticated, user } = useContext(AuthContext);
  const navigateTo = useNavigate();

  const getMyTask = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/v1/task/my", {
        withCredentials: true,
      });
      setTasks(data.tasks || []);
    } catch (error) {
      console.error(error);
    }
  };

  const addTasks = async () => {
    if (!title || !description || !dueDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/task/add",
        { title, description, name: user?.name, dueDate, status },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      resetForm();
      getMyTask();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  const deleteTasks = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/api/v1/task/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      getMyTask();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const updateTasks = async (id) => {
    const updatedTask = tasks.find((task) => task._id === id);
    if (!updatedTask) return;

    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/v1/task/update/${id}`,
        {
          title: updatedTask.title,
          description: updatedTask.description,
          dueDate: updatedTask.dueDate,
          status: updatedTask.status,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      getMyTask();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const toggleTaskStatus = async (id) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/api/v1/task/toggle-status/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, status: data.task.status } : task
        )
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleInputChange = (taskId, field, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, [field]: value } : task
      )
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("pending");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/login");
    } else {
      getMyTask();
    }
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto p-6 m-10 bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Create Your Task</h1>
        <input
          type="text"
          placeholder="Your Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Your Task Description"
          value={description}
          rows={5}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
          onClick={addTasks}
        >
          Create Task
        </button>
      </div>

      <div className="p-4 mx-auto w-full max-w-2xl">
        {tasks.length > 0 ? (
          tasks.map((element) => (
            <div
              key={element._id}
              className="mb-4 p-4 border border-gray-300 rounded-lg shadow-lg"
            >
              <input
                type="text"
                value={element.title}
                onChange={(e) =>
                  handleInputChange(element._id, "title", e.target.value)
                }
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task Title"
              />
              <textarea
                value={element.description}
                onChange={(e) =>
                  handleInputChange(element._id, "description", e.target.value)
                }
                className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task Description"
              />
              <input
                type="date"
                value={element.dueDate.split("T")[0]} 
                onChange={(e) =>
                  handleInputChange(element._id, "dueDate", e.target.value)
                }
                className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={element.status}
                onChange={(e) => handleInputChange(element._id, "status", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <div className="flex flex-col sm:flex-row justify-between">
                <button
                  onClick={() => deleteTasks(element._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mb-2 sm:mb-0"
                >
                  Delete
                </button>
                <button
                  onClick={() => updateTasks(element._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-2 sm:mb-0"
                >
                  Update
                </button>
                <button
                  onClick={() => toggleTaskStatus(element._id)}
                  className={`px-4 py-2 rounded transition mb-2 sm:mb-0 ${
                    element.status === "completed"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  {element.status === "completed" ? "Mark as Pending" : "Mark as Completed"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-xl text-gray-500 text-center">No Tasks Created</h1>
        )}
      </div>
    </div>
  );
};

export default YourTask;
