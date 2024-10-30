import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    sname: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
        required: true,
    },
    notice: [{
        NoticeText: {
            type: String,
        },
        img: {
            type: String, 
        }
    }],
    assignment: [{
        AssignmentText: {
            type: String,
        },
        
        img: {
            type: String, 
        },
        dueDate: {
            type: Date
        },
        submittedBy: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            username: {
                type: String
            },
            ansLink: {
                type: String
            },
        }]
    }],
    coverImg: {
        type: String,
        default: null
    },
    desc: {
        type: String,
        default: ''
    },
    students: [{
        stuId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            default: null
        }
    }],
    groupChat: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",   
    }],
    whiteboard: {
        url: {
            type: String,  
            default: null
        },
        scene: {
            type: Object,  
            default: {}
        }
    }
}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);
