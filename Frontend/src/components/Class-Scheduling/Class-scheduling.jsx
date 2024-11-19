import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import usePreviewImg from '../../hooks/usePrevImg.jsx';
import './Class-scheduling.css';
import add_icon from '../../assets/add_icon_white.png';
import userAtom from '../../atom/UserAtom.js';
import subjectAtom from '../../atom/SubjectAtom.js';
import { useRecoilValue, useRecoilState } from 'recoil';
import upload_area from '../../assets/upload_area.png';
import Loader from '../Loader/Loader.jsx';
import uselogout from '../../hooks/logout.jsx';

const Class = ({ onNextClassTime }) => {
    const [expanded, setExpanded] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const navigate = useNavigate();
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const user = useRecoilValue(userAtom);
    const [subject, setSubject] = useRecoilState(subjectAtom);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getSubjects = async () => {
            if (!user) return;
            try {
                const response = await fetch(`/api/s/${user._id}`);
                const data = await response.json();
                setSubject(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getSubjects();
    }, [setSubject, user]);

    const handleToggleDescription = (id) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [id]: !prevExpanded[id]
        }));
    };
    const handleSubjectChange = (e) => {
        setNewSubject(e.target.value);
    };
    const handleDescriptionChange = (e) => {
        setNewDescription(e.target.value);
    };
    const handleAddClick = () => {
        setShowPopup(true);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        setNewSubject('');
        setNewDescription('');
        setImgUrl(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                subjectname: newSubject,
                coverImg: imgUrl,
                description: newDescription,
            };

            const response = await fetch('/api/s/subject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setSubject((prevSubjects) => [...prevSubjects, data.subject]);
                handlePopupClose();
            } else {
                console.error("Failed to add subject:", data.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error:", error);
        }
        handlePopupClose();
    };

    const deleteClass = async (id) => {
        try {
            const res = await fetch(`/api/s/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await res.json();
            if (data.err) {
                console.log(data.err);
            } else {
                setSubject(subject.filter((classItem) => classItem._id !== id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCardClick = (id) => {
        navigate(`/subject/${id}`);
    };

    const handleProfileClick = () => {
        setShowDropdown((prev) => !prev);
    };

    return (
        <>
            <div className="class-container1">
                {loading && <Loader />}
                <div className="class-cards">
                {subject && subject.length > 0 && subject.map((classItem) => {
                    const isExpanded = expanded[classItem._id];
                    const isTeacher = user.username === classItem.teacher; // Check if the user is the teacher

                    return (
                        <div
                            key={classItem._id}
                            className="class-card"
                            style={{
                                border: isTeacher ? '2px solid #2c00e6' : 'none', // Apply border if user is the teacher
                            }}
                        >
                            <div className="subject-header">
                                <h3 onClick={() => handleCardClick(classItem._id)}>{classItem.sname}</h3>
                                {isTeacher && (
                                    <MdDelete
                                        className="delete-icon"
                                        onClick={() => deleteClass(classItem._id)}
                                    />
                                )}
                            </div>
                            <div className="class-info">
                                {
                                    console.log(classItem,"classItem")
                                }
                                <div className="profile-icon" onClick={handleProfileClick}>
                                    {classItem.coverImg ? (
                                        <img src={classItem.coverImg} style={{ borderRadius: '50%' }}  width={50} height={50} alt="User Profile" />
                                    ) : (
                                        <span>{classItem.teacher[0].toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="teacher-name">{classItem.teacher}</p>
                                    <p
                                        className="subject-description"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleDescription(classItem._id);
                                        }}
                                    >
                                        {/* {isExpanded ? classItem.desc : `${classItem.desc?.slice(0, 7)}... `}
                                        {classItem.desc?.length > 7 && (
                                            <span className="show-more">
                                                {isExpanded ? ' Show less' : ' Show more'}
                                            </span>
                                        )} */}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                </div>

                <div className="add-icon" onClick={handleAddClick}>
                    <img src={add_icon} alt="Add Icon" />
                </div>

                {showDropdown && (
                    <div className="dropdown-menu">
                        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                    </div>
                )}

                {showPopup && (
                    <div className="popup">
                        <div className="popup-content-class">
                            <span className="close-popup" onClick={handlePopupClose}>&times;</span>
                            <h3>Add New Subject</h3>
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-row">
                                    <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                                        <img src={upload_area} alt="Upload Area" className="upload-placeholder" />
                                    </div>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        required
                                    />
                                    {imgUrl && <img src={imgUrl} alt="Cover Preview" className="cover-preview" />}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter subject name"
                                    value={newSubject}
                                    onChange={(handleSubjectChange)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Add the description here"
                                    value={newDescription}
                                    onChange={(handleDescriptionChange)}
                                    required
                                />
                                <button className="add-subject-btn" type="submit">Add Subject</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Class;
