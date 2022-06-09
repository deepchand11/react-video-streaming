import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Player = () => {
  let { id } = useParams();
  //   const [videoId, setVideoId] = useState(null);
  const [videoData, setVideoData] = useState({});
  const [stopped, setStopped] = useState(false);

  const handleStopped = useCallback(
    (event) => {
      console.log("playing stopped");
      setStopped(true);
    },
    [setStopped]
  );

  const fetchVideoData = async () => {
    try {
      const res = await fetch(`http://localhost:4000/video/${id}/data`);
      const data = await res.json();
      setVideoData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // setVideoId(id);
    fetchVideoData();
    const video = document.querySelector("video");

    if (!stopped) {
      video.addEventListener("ended", handleStopped);
    } else {
      video.removeEventListener("ended", handleStopped);
    }

    return () => video.removeEventListener("ended", handleStopped);
  }, [stopped, handleStopped]);

  return (
    <div className="App">
      <header className="App-header">
        <video controls muted autoPlay>
          <source
            src={`http://localhost:4000/video/${id}`}
            type="video/mp4"
          ></source>
        </video>
        <h1>{videoData.name}</h1>
        {JSON.stringify(videoData)}
      </header>
    </div>
  );
};

export default Player;
