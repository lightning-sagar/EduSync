import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import userAtom from '../../atom/UserAtom';
import subjectAtom from "../../atom/SubjectAtom";
import Loader from '../Loader/Loader';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { 
  CallingState,
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  useCallStateHooks, 
  ParticipantView, 
  CallControls, 
  StreamTheme, 
  SpeakerLayout 
} from '@stream-io/video-react-sdk';
import './stram.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';


const apiKey =import.meta.env.VITE_STREAM_API;
console.log(apiKey)
function Stream() { 

  const { callId } = useParams(); 
  const user = useRecoilValue(userAtom);
  const [videoClient, setVideoClient] = useState(null);
  const [token, setToken] = useState('');
  const [call, setCall] = useState(null);
  const navigate = useNavigate();
  const {sId} = useParams();
  const [subject, setSubject ] = useState({});

  useEffect(()=>{
    const getTeacher = async () => {
      try {
        console.log(sId);
        const res = await fetch(`/api/s/Teacher/${sId}/Teach`);
        const data = await res.json();
        console.log(data);
        setSubject(data.subject);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }
    getTeacher();
  },[sId]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch('/api/c/stream/token');
        const data = await res.json();
        setToken(data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    getToken();
  }, [user]);

  useEffect(() => {
    if (token) {
      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: user?._id,
          name: user?.username,
          image: user?.image,
        },
        tokenProvider: () => Promise.resolve(token),
      });
      setVideoClient(client);

      return () => {
        if (client) client.disconnectUser();
      };
    }
  }, [token, user]);

  useEffect(() => {
    if (videoClient && !call) {
      const callInstance = videoClient.call('default', callId);
      
      callInstance.join({ create: true })
        .then(() => {
          setCall(callInstance);
        })
        .catch((error) => {
          console.error('Error joining call:', error);
        });

      return () => {
        if (callInstance) callInstance.leave();
      };
    }
  }, [videoClient, callId, call]);

  if (!videoClient || !call) return <Loader />;

  return (
    <StreamVideo client={videoClient}>
      <StreamCall className="str-video" call={call}>
        <MyUILayout subject={subject} call={call} />
      </StreamCall>
    </StreamVideo>
  );
}

export const MyUILayout = ({ call, subject }) => {
  const { useCallCallingState, useLocalParticipant, useParticipants } = useCallStateHooks();
  const navigate = useNavigate();
  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const participants = useParticipants();

  if (callingState !== CallingState.JOINED) {
    return <Loader />;
  }

  const handleCallEnded = () => {
    call.leave();
    navigate('/');
  };

  return (
    <StreamTheme style={{ position: 'relative' }}>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls onLeave={handleCallEnded} />
      <MyFloatingLocalParticipant participant={localParticipant} />
      <ShareLink callId={call.cid.split(':')[1]} call={call} subject={subject} participants={participants} user={localParticipant.user} />
    </StreamTheme>
  );
};

export const MyFloatingLocalParticipant = ({ participant }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
        borderRadius: '12px',
        zIndex: 1000,
        color: 'black',
      }}
    >
      {participant ? <ParticipantView muteAudio participant={participant} /> : null}
    </div>
  );
};

export const ShareLink = ({ callId, subject, participants }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const shareLink = `${window.location.origin}/${subject._id}/stream/${callId}`;
  const user = useRecoilValue(userAtom);
  console.log(user,"username")
  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleTakeAttendance = () => {
    setShowAttendance(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: isPanelOpen ? '0' : '-200px',
        bottom: '20px',
        width: '200px',
        transition: 'right 0.3s ease',
        zIndex: 1000,
        backgroundColor: '#fff',
        padding: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px 0 0 8px',
      }}
    >
      <button
        onClick={togglePanel}
        style={{
          position: 'absolute',
          left: '-30px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '30px',
          height: '30px',
          backgroundColor: '#4CAF50',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          color: 'white',
        }}  
      >
        {!isPanelOpen ? <AiOutlineArrowLeft className='arrow' /> : <AiOutlineArrowRight className='arrow'  />}
      </button>

      {isPanelOpen && (
        <div>
          {subject.teacher === user.username && (
            <button
              onClick={handleTakeAttendance}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                marginBottom: '10px',
              }}
            >
              Take Attendance
            </button>
          )}
          
          <button
            onClick={copyLink}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '10px',
            }}
          >
            Share Join Link
          </button>
          <input
            type="text"
            readOnly
            value={shareLink}
            style={{
              marginTop: '10px',
              border: '1px solid #ddd',
              padding: '5px',
              borderRadius: '4px',
              width: '100%',
            }}
          />
          {showAttendance && <AttendanceList participants={participants} />}
        </div>
      )}
    </div>
  );
};

export const AttendanceList = ({ participants }) => {
  return (
    <div style={{
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      backgroundColor: '#fff', 
      padding: '10px', 
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
      borderRadius: '8px',
      zIndex: 1000,
    }}>
      <h3>Participants Joined</h3>
      <ul>
        {participants.map((participant) => (
          <li key={participant.id} style={{color: 'black'}}>
            {participant.name} ({participant.id})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stream;
