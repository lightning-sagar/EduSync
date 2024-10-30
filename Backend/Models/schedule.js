import mongoose from "mongoose";

const assignmentScheduleSchema = mongoose.Schema({
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    dueDate: {
        type: Date
    },
    assignmentText: {
        type: String
    },
    img: {
        type: String
    }
})