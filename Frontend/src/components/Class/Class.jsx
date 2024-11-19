import { BsThreeDotsVertical } from "react-icons/bs";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Class.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import noticeAtom from '../../atom/NoticeAtom.js';
import userAtom from '../../atom/UserAtom.js';
import subjectAtom from '../../atom/SubjectAtom.js';
import assignmentAtom from '../../atom/AssignmentAtom.js';
import { LuDelete } from "react-icons/lu";
import Loader from '../../components/Loader/Loader';  
import Sidebar from '../Sidebar/Sidebar.jsx';
import Navbar2 from '../Navbar2/Navbar2.jsx';

const ImageModal = ({ imageSrc, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {imageSrc && <img src={imageSrc} alt="Notice" className="modal-image" />}
      </div>
    </div>
  );
};

const SubmissionsModal = ({ assignmentData, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      {console.log(assignmentData)}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Assignment Submissions</h3>
        <div className="submissions-list">
 
          { assignmentData &&
            assignmentData.map((submission) => (
              <div key={submission.userId} className="submission-item">
                <p>Submitted by: {submission.username}</p>
                <p>Submission Link: <a href={submission.ansLink} target="_blank" rel="noopener noreferrer">View Link</a></p>
              </div>
            ))
          }
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Class = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [assignments, setAssignments] = useRecoilState(assignmentAtom);
  const [shareableLink, setShareableLink] = useState('');
  const navigate = useNavigate();
  const { id: subjectId } = useParams();
  const [Notice, SetNotice] = useRecoilState(noticeAtom);
  const user = useRecoilValue(userAtom);
  const [Subjects, setSubjects] = useRecoilState(subjectAtom);
  const [teacher, setTeacher] = useState('');
  const [file, setFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [isSubmissionsModalVisible, setIsSubmissionsModalVisible] = useState(false);
  const [assignmentData, setAssignmentData] = useState([]);
  const [submitlink, setsubmitlink] = useState('');

  useEffect(() => {
    if (!subjectId) {
      navigate('/');
    }
    const getNotice = async () => {
      setLoadingNotices(true); 
      try {
        const response = await fetch(`/api/s/subject/${subjectId}`);
        const data = await response.json();
        SetNotice(data.notice);
        setTeacher(data.teacher);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingNotices(false);  
      }
    };
    getNotice();
  }, [subjectId, SetNotice]);

  useEffect(() => {
    const getAssignments = async () => {
      setLoadingAssignments(true);   
      try {
        const response = await fetch(`/api/s/getassignment/${subjectId}`);
        const data = await response.json();
        setAssignments(data.assignment);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAssignments(false); 
      }
    };
    getAssignments();
  }, [subjectId, setAssignments]);

  const handleDeleteNotice = async (noticeId) => {
    try {
      const response = await fetch(`/api/s/notice/${subjectId}/${noticeId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' 
      });
      if (response.ok) {
        SetNotice(Notice.filter((notice) => notice._id !== noticeId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`/api/s/assignment/${subjectId}/${assignmentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' 
      });
      if (response.ok) {
        setAssignments(assignments.filter((assignment) => assignment._id !== assignmentId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNoticeClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleLinkUpload = async (assignmentId) => {
    try {
      console.log(shareableLink,"shareableLink")
      const res = await fetch(`/api/s/${assignmentId}/${subjectId}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentLink: shareableLink }),
        credentials: 'include'   
      });

      if (res.ok) {
        alert('Link submitted successfully!');
      }
      console.log(res);
    } catch (error) {
      console.error(error);
    }    
    setShowDropdown(null);
  };

  const handleViewSubmissions = async (assignmentId) => {
    try {
      const response = await fetch(`/api/s/${assignmentId}/${subjectId}`);
      const data = await response.json();
      console.log(data.returnAss);
      setAssignmentData(data.returnAss);
      setIsSubmissionsModalVisible(true);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  return (
    <div className="class-container">
      <Sidebar />
      <main className="content">
        {console.log(teacher)}
        <Navbar2 className="navbar2-class" subtecher={teacher} userId={user.username} />

        <section className="notices-section">
        <h2 style={{textAlign: 'center'}}> Notice  </h2>

          {loadingNotices ? <Loader /> : (
            Notice.map((notice) => (
              
              <section key={notice._id} className="notice">
                {notice.img && (
                  <img
                    className='noticeimage'
                    src={notice.img}
                    alt="Notice"
                    onClick={() => handleNoticeClick(notice.img)}
                  />
                )}
                <h4>{notice.NoticeText}</h4>
                
                {teacher === user.username && (
                  <button className="notice-delete-button" onClick={() => handleDeleteNotice(notice._id)}>
                    <LuDelete /> 
                  </button>
                )}
              </section>
            ))
          )}
        </section>

        <section className="assignments-section">
        <h2 style={{textAlign: 'center'}}> Assign</h2>
          {loadingAssignments ? <Loader /> : (
            assignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                  {assignment.img && (
                    <img 
                      src={assignment.img}  
                      alt="Assignment"
                      className="assignment-image"
                      onClick={() => handleNoticeClick(assignment.img)}
                    />
                  )}
                <h2>{assignment.AssignmentText} &nbsp;&nbsp;
                  <BsThreeDotsVertical
                  className="three-dot-icon"
                  onClick={() => setShowDropdown(showDropdown === assignment._id ? null : assignment._id)}
                /></h2>
                {console.log(assignment,"ass")}
                {teacher === user.username && (
                  <button className="notice-delete-button" onClick={() => handleDeleteAssignment(assignment._id)}>
                    <LuDelete /> 
                  </button>
                )}
                <p className='assignment-description'>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                <div className="three-dot-menu">
                  {showDropdown === assignment._id && (
                    <div className="dropdown-menu">
                      {teacher === user.username ? (
                        <>
                          <button onClick={() => handleViewSubmissions(assignment._id)}>
                            View Submissions
                          </button>
                        </>
                      ) : (
                          
                        <div className="link-upload-field">
                          <input
                            type="text"
                            value={shareableLink}
                            onChange={(e) => setShareableLink(e.target.value)}
                          />
                          <button onClick={() => handleLinkUpload(assignment._id)}>
                            Submit Link
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </section>

        {isModalVisible && <ImageModal imageSrc={selectedImage} onClose={handleCloseModal} />}
        {isSubmissionsModalVisible && <SubmissionsModal assignmentData={assignmentData} onClose={() => setIsSubmissionsModalVisible(false)} />}
      </main>
    </div>
  );
};

export default Class;
