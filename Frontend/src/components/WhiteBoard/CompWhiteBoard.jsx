import React, { useEffect, useState, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import axios from "axios";
import { useParams } from "react-router-dom";

const CompWhiteBoard = () => {
  const { subjectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [whiteboardUrl, setWhiteboardUrl] = useState(null);
  const excalidrawRef = useRef(null);

  useEffect(() => {
    const fetchWhiteboardData = async () => {
      try {
        const response = await axios.get(`/api/s/${subjectId}/whiteboard`,{
          withCredentials: true, // Include credentials
        });
        const url = response.data.whiteboardUrl;
        console.log("Whiteboard URL:", url);   
        setWhiteboardUrl(url);
        setLoading(false);
      } catch (err) {
        setError("Failed to load whiteboard");
        setLoading(false);
      }
    };
  
    fetchWhiteboardData();
  }, [subjectId]);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const [roomId, encryptionKey] = whiteboardUrl
    .split("#room=")[1]
    .split(",");
  return (
    <>
      <div style={{ height: "615px" }}>
      <Excalidraw
        ref={excalidrawRef}
        initialData={{ appState: { viewBackgroundColor: "#ffffff" } }}
        room={{
          id: roomId,  
          key: encryptionKey,  
        }}
        UIOptions={{
          canvasActions: {
            loadScene: true,   
            saveFileToDisk: true,
          },
        }}
      />
      </div>
    </>
  );
};

export default CompWhiteBoard;
