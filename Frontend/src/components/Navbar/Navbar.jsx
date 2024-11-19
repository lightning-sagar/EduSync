import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import uselogout from '../../hooks/logout.jsx';
import { FaTimes } from 'react-icons/fa';
import { AiFillFileImage } from 'react-icons/ai';
import { useRecoilState } from 'recoil';
import userAtom from '../../atom/UserAtom.js';
import getPreviewImg from '../../hooks/usePrevImg.jsx'; // Import the custom hook

const Navbar = ({ setShowLogin }) => {
    const [userData, setUserData] = useRecoilState(userAtom);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false); // Popup visibility state
    const [newDetails, setNewDetails] = useState({
        username: userData?.username || '',
        image: userData?.image || ''
    });
    const navigate = useNavigate();
    const logout = uselogout();
    const fileInputRef = useRef(null);

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleDashboardClick = (e) => {
        e.preventDefault();  
        setIsPopupVisible(true);
        setShowDropdown(!showDropdown);
          
    };

    const { handleImageChange, imgUrl, setImgUrl } = getPreviewImg(newDetails.image);

    const handleButtonClick = () => {
        fileInputRef.current.click();  
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const updatedDetails = {
                ...newDetails,
                username: newDetails.username,
                image: imgUrl,
            };

            const res = await fetch(`/api/s/updateUserDetails/${userData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedDetails),
            });

            const data = await res.json();
            console.log('Response:', data);

            setUserData((prev) => ({
                ...prev,
                username: updatedDetails.username,
                image: updatedDetails.image,
            }));

            setIsPopupVisible(false);
        } catch (error) {
            console.error('Error updating details:', error);
        }
    };

    return (
        <div className='navbar'>
            <div className="logo">
                <img onClick={()=>navigate("/")} src={logo} alt="EduSync Logo" />
            </div>
            <div className="menu">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/features">Features</Link></li>
                    <li><Link to="/about">About us</Link></li>
                </ul>
            </div>

            {!userData && (
                <div className="authorise">
                    <button onClick={() => setShowLogin(true)}>Login</button>
                </div>
            )}

            {userData && (
                <div className="profile-container">
                    {userData.image ? (
                        <img
                            src={userData.image}
                            alt="User Profile"
                            className="profile-initial"
                            onClick={handleProfileClick}
                        />
                    ) : (
                        <div className="profile-initial" onClick={handleProfileClick}>
                            {userData.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {showDropdown && (
                        <>
                        <div className="dropdown-menu">
                            <button onClick={handleDashboardClick}>Profile</button>
                            <button onClick={logout} setShowDropdown={!showDropdown}>Logout</button>
                        </div>
                        </>
                    )}
                </div>
            )}

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
                                src={imgUrl || userData.image || 'https://via.placeholder.com/150'}
                                alt="preview"
                                className="image-preview"
                            />
                            <button onClick={handleButtonClick}><AiFillFileImage /></button>
                        </div>
                        <div className="form-section">
                            <label className="label-info">
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

export default Navbar;
