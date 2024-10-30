import React, { useState } from 'react';
import userAtom from '../../atom/UserAtom';
import { useRecoilState } from 'recoil';
import './Dashboard.css'; // for additional styles

function Dashboard() {
    const [user, setUser] = useRecoilState(userAtom);
    const [profile, setProfile] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        facebookUrl: user.facebookUrl
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value
        });
    };

    const handleSave = () => {
        // Functionality to save changes (to backend or local storage)
        setUser({ ...user, ...profile });
        alert('Profile updated successfully');
    };

    return (
        <div className="profile-form-container">
            <div className="profile-form-card">
                <div className="profile-picture">
                    <img src={user.image || 'default-image-url'} alt="User" className="user-avatar" />
                    <button className="edit-button">Edit</button>
                </div>

                <form className="profile-form">
                    <label htmlFor="name">Username</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={profile.username} 
                        onChange={handleInputChange}
                    />

                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={profile.email} 
                        onChange={handleInputChange}
                    />
                    <button type="button" className="save-button" onClick={handleSave}>SAVE</button>
                </form>
            </div>
        </div>
    );
}

export default Dashboard;
