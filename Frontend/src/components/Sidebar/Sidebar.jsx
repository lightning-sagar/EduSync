import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import subjectAtom from '../../atom/SubjectAtom.js';
import './Sidebar.css'; 
import userAtom from '../../atom/UserAtom.js';
import Loader from '../Loader/Loader.jsx';

const Sidebar = () => { 
  const { id:SubjectIdP} = useParams();
  
  const navigate = useNavigate();
  const [Subjects, setSubjects] = useRecoilState(subjectAtom);
  const user = useRecoilValue(userAtom);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    const getSubject = async () => {
      setLoadingSubjects(true);  
      try {
        const response = await fetch(`/api/s/${user._id}`);
        const data = await response.json();
        console.log(data,"sidebar")
        setSubjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSubjects(false);  
      }
    };
    getSubject();
  }, [user._id]);
  return (
      <aside className="sidebar">
        <div className="classes-section">
          <h3>Classes</h3>
          {loadingSubjects ? (
            <>
            </>
          ) : (
            Subjects.map((subject) => (
              <ul key={subject._id}>
                <li onClick={() => navigate(`/subject/${subject._id}`)}
                 style={{ backgroundColor: SubjectIdP === subject._id ? 'blue' : '#6b6bff63' }}>
                  {subject.sname}
                </li>
              </ul>
            ))
          )}
        </div>
        
      </aside>
  );
};

export default Sidebar;
