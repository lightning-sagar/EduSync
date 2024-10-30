import mongoose from "mongoose";
import User from "../Models/User.js";
import Subject from "../Models/Subject.js";
import {v2 as cloudinary} from "cloudinary";
import { v4 as uuidv4 } from 'uuid';
const Addsubject = async (req, res) => {
    try {
        console.log(req.user._id, "req.user._id",req.body);
        const { subjectname, coverImg, description } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!subjectname) {
            return res.status(400).json({ error: "Subject name is required" });
        }

        if (!coverImg) {
            return res.status(400).json({ error: "Cover image is required" });
        }

        const newSubject = new Subject({
            sname: subjectname,
            teacher: user.username, 
            coverImg,
            desc: description
        });

        const savedSubject = await newSubject.save();

        user.class.push({ subject: savedSubject._id });
        await user.save();

        return res.status(201).json({ message: "Subject added successfully", subject: savedSubject });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const GetSubject = async (req, res) => {
    try {
        const userId = req.params.Uid;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const username = user.username;
        const subjects = await Subject.find({
            $or: [
                { teacher: username }, 
                { 'students.stuId': userId }   
            ]
        });

        if (subjects.length === 0) {
            return res.status(404).json({ error: "No subjects found" });
        }
        return res.status(200).json(subjects);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const AddNoticeOrAssignment = async (req, res) => {
    try {
        const { textContent, type, assignmentDate } = req.body;  
        let { imgUrl } = req.body;
        const userId = req.user._id;
        const { Sid } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const subject = await Subject.findById(Sid);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        
        if (user.username !== subject.teacher) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!textContent) {
            return res.status(400).json({ error: `${type === 'assignment' ? 'Assignment' : 'Notice'} text content is required` });
        }

        if (imgUrl) {
            const uploadResponse = await cloudinary.uploader.upload(imgUrl);
            imgUrl = uploadResponse.url;
        }

        if (type === 'notice') {
            const newNotice = {
                _id: new mongoose.Types.ObjectId(), 
                NoticeText: textContent,
                img: imgUrl || null
            };

            subject.notice.push(newNotice);  
            await subject.save();

            return res.status(201).json({ 
                status: 'notice',
                _id: newNotice._id,
                NoticeText: newNotice.NoticeText,
                img: newNotice.img,
                teacher: subject.teacher,
            });

        } else if (type === 'assignment') {
            if (!assignmentDate) {
                return res.status(400).json({ error: "Assignment due date is required" });
            }

            const newAssignment = {
                _id: new mongoose.Types.ObjectId(), 
                AssignmentText: textContent,
                img: imgUrl || null,
                dueDate: new Date(assignmentDate)  
            };

            subject.assignment.push(newAssignment); 
            await subject.save();

            return res.status(201).json({
                status: 'assignment',
                _id: newAssignment._id,
                AssignmentText: newAssignment.AssignmentText,
                img: newAssignment.img,
                dueDate: newAssignment.dueDate,
                teacher: subject.teacher
            });
        } else {
            return res.status(400).json({ error: 'Invalid type, must be either "notice" or "assignment"' });
        }
    } catch (error) {
        console.error('Error adding notice/assignment:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const GetAssignment = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        return res.status(200).json({
            assignment: subject.assignment,
            teacher: subject.teacher
        });
    } catch (error) {
        console.error('Error getting assignments:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const GetNotice = async (req, res) => {
    try {
        const { Sid } = req.params;
        const subject = await Subject.findById(Sid);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        return res.status(200).json({
            notice: subject.notice,
            teacher: subject.teacher,
            subjectName: subject.sname
        });
    } catch (error) {
        console.error('Error getting notices:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteAssignment = async(req,res) => {
    try {
        const nId = req.params.assignmentId;
        const SId = req.params.subjectId;
        const subject = await Subject.findById(SId);
        console.log("working");
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        //check ig=f the user is the teacher
        const user = await User.findById(req.user._id);
        const teacher = user.username;
        if (subject.teacher !== teacher) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const noticecheck = subject.assignment.id(nId);
        if (!noticecheck) {
            return res.status(404).json({ error: "Notice not found" });
        }
        subject.assignment.pull(nId);
        await subject.save();
        return res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
        console.log(error);
    }
}

const deleteNotice = async(req,res) => {
    try {
        const nId = req.params.noticeId;
        const SId = req.params.subjectId;
        const subject = await Subject.findById(SId);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        //check ig=f the user is the teacher
        const user = await User.findById(req.user._id);
        const teacher = user.username;
        if (subject.teacher !== teacher) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const noticecheck = subject.notice.id(nId);
        if (!noticecheck) {
            return res.status(404).json({ error: "Notice not found" });
        }
        subject.notice.pull(nId);
        await subject.save();
        return res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
        console.log(error);
    }
}

const deleteSubject = async(req,res) => {
    try {
        const subjectId = req.params.subjectId;

        const user = await User.findById(req.user._id);
        const teacher = user.username;
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        if (subject.teacher === teacher) {
            await Subject.findByIdAndDelete(subjectId);
        }
        else{
            //remove the userId from student
            await subject.students.pull(user._id);
        }
        if(subject.teacher === teacher){}
        return res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.log(error)
    }
}

const addstudent = async (req, res) => {
    try {
      const userId = req.user._id;  
      const { subjectId } = req.params;
  
      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
  
      const userExists = subject.students.some(student => student.stuId.toString() === userId.toString());
      if (userExists) {
        return res.status(400).json({ error: 'User already joined this subject' });
      }
      subject.students.push({ stuId: userId });
      await subject.save();
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const classExists = user.class.some(c => c.subject.toString() === subjectId.toString());
      if (classExists) {
        return res.status(400).json({ error: 'Subject already added to user classes' });
      }
  
      user.class.push({ subject: subjectId });
      await user.save();
  
      return res.status(200).json({ message: 'User joined the subject and class successfully' });
    } catch (error) {
      console.error('Error joining subject:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

const getAllstu = async(req,res)=>{
    try {
        const subId = req.params.subId;
        const getsub = await Subject.findById(subId);
        let teacher = await User.find({username:getsub.teacher})
        const {students} = getsub;
        const getdetails = await User.find({ _id: { $in: students.map(student => student.stuId)  } });
        let alluser = {
            teacher,
            students:getdetails
        }
        return res.status(200).json(alluser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"error"})
    }
}

const updateUserD = async (req, res) => {

  
    try {
      console.log("working",req.body);
      let { stuId,username, image } = req.body;

      if (!username || !image) {
        return res.status(400).json({ message: 'Name and profile image are required' });
      }
      if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
         
        image = uploadResponse.secure_url;
      }
      const updatedUser = await User.findByIdAndUpdate(
        stuId,
        {
          username,
          image
        },
        { new: true }  
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log(updatedUser);
      res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user' });
    }
  };

const createOrOpenWhiteboard = async (req, res) => {
    try {
      const { subjectId } = req.params;
  
      let subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      if(subject.teacher !== req.user.username){
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!subject.whiteboard.url) {
        const roomId = uuidv4();  
        const encryptionKey = uuidv4().replace(/-/g, '').slice(0, 22);   
        const whiteboardUrl = `https://excalidraw.com/#room=${roomId},${encryptionKey}`;
        
        subject.whiteboard.url = whiteboardUrl;
        await subject.save();
        
        console.log(subject.whiteboard.url, "created by", req.user.username);
  
        return res.status(201).json({ 
          message: "New whiteboard created", 
          whiteboardUrl, 
          roomId, 
          encryptionKey 
        });
      } else {
        const whiteboardUrl = subject.whiteboard.url;
        const urlParts = whiteboardUrl.split("#room=")[1].split(",");
        const roomId = urlParts[0];
        const encryptionKey = urlParts[1];
  
        return res.status(200).json({ 
          whiteboardUrl, 
          roomId, 
          encryptionKey 
        });
      }
    } catch (error) {
      console.error("Error creating or opening whiteboard:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const uploadAssignment = async (req, res) => {
    try {
        const { subjectId, assignmentId } = req.params;  
        const { assignmentLink } = req.body;
        
        let subject = await Subject.findById(subjectId);
        if (!subject) {
            console.log("subject not found");
            return res.status(404).json({ message: "Subject not found" });
        }

        if (subject.teacher === req.user.username) {
            console.log("Unauthorized");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const assignment = subject.assignment.id(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const currentDate = new Date();
        if (currentDate > assignment.dueDate) {
            return res.status(400).json({ message: "Due date has already passed" });
        }

        if (assignment.submittedBy && assignment.submittedBy.userId === (req.user._id)) {
            return res.status(400).json({ message: "You have already submitted the assignment" });
        }

        const newAssSubmitted = {
            userId: req.user._id,
            username: req.user.username,
            ansLink: assignmentLink
        };
        assignment.submittedBy.push(newAssSubmitted);
        console.log(assignment);
        await subject.save();
        return res.status(200).json({ message: "Assignment uploaded successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


const getAssignment = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        if (subject.teacher !== req.user.username) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const assignment = subject.assignment.id(req.params.assignmentId);
        if(assignment.submittedBy){
            const resAss = assignment.submittedBy;
            return res.status(200).json({resAss});
        }
        else{
            return res.status(404).json({ message: "Assignment not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

const getTeacher = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        
        return res.status(200).json({ subject });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}
export {Addsubject,createOrOpenWhiteboard,getTeacher,getAssignment,uploadAssignment,getAllstu,GetSubject,updateUserD,AddNoticeOrAssignment,deleteAssignment,GetNotice,deleteSubject,GetAssignment,deleteNotice,addstudent};