import { Task } from "../models/task.model.js";

export const createTask = async (req, res, next) => {
    const { title, description, dueDate,status } = req.body;
    const createdBy = req.user._id;
    const name = req.user.name;

    if (!title || !description || !dueDate) {
        return res.status(400).json({
            success: false,
            message: "Title, Description, and Due Date are required!"
        });
    }

    const task = await Task.create({
        title,
        description,
        dueDate,
        name,
        status, 
        user: req.user.id,
        createdBy
    });

    res.status(201).json({ 
        success: true,
        message: "Task Created!",
        task 
    });
}

export const getMyTask = async (req, res, next) => {
    const tasks = await Task.find({ createdBy: req.user._id });

    if (!tasks || tasks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No task found."
        });
    }

    res.status(200).json({
        success: true,
        tasks
    });
}

export const getAllTask = async (req, res) => {
    const tasks = await Task.find();

    if (!tasks || tasks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No tasks found."
        });
    }

    res.status(200).json({
        success: true,
        tasks
    });
}

export const deleteTask = async (req, res, next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ 
            success: false,
            message: "Task not found."
        });
    }

    await task.deleteOne();
    res.status(200).json({
        success: true,
        message: "Task Deleted!"
    });
}

export const updateTask = async (req, res, next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found."
        });
    }

    const { title, description, dueDate, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        {
            title,
            description,
            dueDate,
            status 
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
        message: "Task Updated",
        task: updatedTask
    });
}

export const toggleTaskStatus = async (req, res, next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found."
        });
    }

  
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    res.status(200).json({
        success: true,
        message: "Task status updated",
        task
    });
}
