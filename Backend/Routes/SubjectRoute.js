import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import { Addsubject,GetSubject,getTeacher,updateUserD,getAssignment,uploadAssignment,createOrOpenWhiteboard,getAllstu,AddNoticeOrAssignment,GetNotice,deleteAssignment,deleteNotice,deleteSubject,addstudent,GetAssignment } from "../Controllers/SubjectController.js";

const router = express.Router();

router.post('/subject',protectRoute,Addsubject)
router.get('/:Uid',protectRoute,GetSubject)
router.post('/subject/:Sid',protectRoute,AddNoticeOrAssignment)
router.get('/subject/:Sid',protectRoute,GetNotice)
router.get('/getassignment/:subjectId',protectRoute,GetAssignment)
router.delete('/assignment/:subjectId/:assignmentId',protectRoute,deleteAssignment)
router.delete('/notice/:subjectId/:noticeId',protectRoute,deleteNotice)
router.delete('/:subjectId',protectRoute,deleteSubject)
router.post('/join/:subjectId',protectRoute,addstudent);
router.get('/getpartsubject/:subId',protectRoute,getAllstu);
router.put('/updateUserDetails/:stuId', updateUserD);  
router.get('/:subjectId/whiteboard',protectRoute,createOrOpenWhiteboard);
router.post('/:assignmentId/:subjectId/upload',protectRoute,uploadAssignment);
router.get('/:assignmentId/:subjectId', protectRoute, getAssignment);
router.get('/Teacher/:subjectId/Teach',getTeacher);

export default router;