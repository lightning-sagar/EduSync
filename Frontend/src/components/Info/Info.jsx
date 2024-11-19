import { AiFillFileImage } from "react-icons/ai";
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import './Info.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import subjectAtom from '../../atom/SubjectAtom';
import Navbar2 from '../Navbar2/Navbar2.jsx';
import { useParams } from 'react-router-dom';
import usePreviewImg from '../../hooks/usePrevImg.jsx';
import userAtom from '../../atom/UserAtom.js';

const Info = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const subject = useRecoilValue(subjectAtom);
  const [subjectstudent, setSubjectStudent] = useState([]);
  const [subtecher, setSubtecher] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newDetails, setNewDetails] = useState({
    stuId: '',
    username: '',
    image: '',
  });
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const { id: subjectId } = useParams();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(newDetails.image);

  const handleEditClick = (stu) => {
    setNewDetails({
      stuId: stu._id,
      username: stu.username,
      image: stu.image || '',
    });
    setImgUrl(stu.image || '');
    setIsPopupVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetails({ ...newDetails, [name]: value });
  };

  const handleSave = async () => {
    try {
      const updatedDetails = {
        ...newDetails,
        username: newDetails.username,
        image: imgUrl,
      };
  
      const res = await fetch(`/api/s/updateUserDetails/${newDetails.stuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedDetails),
      });
  
      const data = await res.json();
  
      setUser((prev) => ({
        ...prev,
        username: newDetails.username,
        image: imgUrl,
      }));
  
      if (newDetails.stuId === subtecher[0]?._id) {
        setSubtecher([{ ...subtecher[0], ...data.updatedUser }]);
      } else {
        setSubjectStudent((prev) =>
          prev.map((stu) =>
            stu._id === newDetails.stuId ? { ...stu, ...data.updatedUser } : stu
          )
        );
      }
      setIsPopupVisible(false);
    } catch (error) {
      console.error('Error updating details:', error);
    }
  };

  useEffect(() => {
    const getSubjectStudent = async () => {
      try {
        const res = await fetch(`/api/s/getpartsubject/${subjectId}`);
        const data = await res.json();
        setSubtecher(data.teacher || {});
        setSubjectStudent(data.students || []);
      } catch (error) {
        console.error(error);
      }
    };
    getSubjectStudent();
  }, [subjectId]);

  const handleDelete = () => {
    // TODO: Implement delete functionality here and make the controller
  };

  return (
    <div className="info-container">
      <Sidebar id="sidebar" />
      <div className="secondary-navbar-container">
        <Navbar2 subtecher={subtecher[0]?.username} userId={user?.username} />
        
        <div className="cards-container">
          {subtecher[0] && (
            <div className="card teacher-card">
              <div className="info-card-image">
                {subtecher[0]?.image ? (
                  <img
                    className="info-card-image"
                    src={subtecher[0].image}
                    alt="profile"
                  />
                ) : (
                  <div className="image-placeholder">
                    {subtecher[0]?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="info-card-title">
                <h3 style={{ color: 'black' }}>{subtecher[0]?.username}👑</h3>
              </div>
            </div>
          )}

          {subjectstudent.length > 0 ? (
            subjectstudent.map((stu) => (
              <div className="card student-card" key={stu._id}>
                <div className="info-card-image">
                  {stu.image ? (
                    <img
                      className="info-card-image"
                      src={stu.image}
                      alt="profile"
                    />
                  ) : (
                    <div className="image-placeholder">
                      {stu.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="info-card-title">
                  <h3 className="username">{stu.username}</h3>
                </div>
                <div className="info-items">
                  {user?._id === stu?._id  || user?._id === subtecher[0]?._id && (
                    <button className="infobtn-edit" onClick={() => handleEditClick(stu)}>
                      <FaEdit />
                    </button>
                  )}
                  {(user?._id === stu?._id || user?._id === subtecher[0]?._id) && (
                    <button className="infobtn-delete" onClick={handleDelete}>
                      <FaTrashAlt />
                    </button>
                  )}  
                </div>
              </div>
            ))
          ) : (
            <p>No students available</p>
          )}
        </div>
      </div>

      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <FaTimes className="popup-close" onClick={() => setIsPopupVisible(false)} />
            <div className="image-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <img
                src={imgUrl || 'https://via.placeholder.com/150'}
                alt="preview"
                className="image-preview"
              />
              <button onClick={handleButtonClick}><AiFillFileImage /></button>
            </div>
            <div className="form-section">
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={newDetails.username}
                  onChange={handleInputChange}
                />
              </label>
              <div className="popup-buttons">
                <button onClick={handleSave} style={{ backgroundColor: '#4CAF50', color: 'white' }}>Save</button>
                <button onClick={() => setIsPopupVisible(false)} style={{ backgroundColor: '#f44336', color: 'white' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Info;
