import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    
    dueDate: {
        type: Date
    },
    name: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed'],  
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
    }
}, {
    timestamps: true
})


export const Task = mongoose.model("Task", taskSchema)