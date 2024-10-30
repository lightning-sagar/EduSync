import React, { useState } from 'react';
import './Home.css'; 
import ClassScheduling from '../../components/Class-Scheduling/Class-scheduling';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atom/UserAtom';

const Home = () => {
    const [nextClassTime, setNextClassTime] = useState('');
    const user = useRecoilValue(userAtom)

    const handleNextClassTime = (time) => {
        setNextClassTime(time);
    };
    return (
        <>
            {user ? (
                <div className='home'>
                    
                    <ClassScheduling onNextClassTime={handleNextClassTime} />
                </div>
            ) : (
                <h1 className='login-prompt'>
                    Please log in to see your classes.
                </h1>
            )}
        </>
    );
    
}

export default Home;
