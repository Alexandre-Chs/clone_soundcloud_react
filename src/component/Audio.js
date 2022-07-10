import React, { useState, useEffect, useRef } from "react";
import album1 from "../images/walks.jpg";
import album2 from "../images/DJ.jpg";
import album3 from "../images/piano.jpg";
import AudioControls from "./AudioControls";
import Backdrop from "./Backdrop";

const tracks = [
  {
    title: "Royalty",
    artist: "Egzod & Maestro Chives",
    audioSrc:
      "https://www.mboxdrive.com/Egzod%20&%20Maestro%20Chives%20-%20Royalty%20(ft.%20Neoni)%20[NCS%20Release].mp3",
    image: album1,
  },
  {
    title: "When I'm Gone",
    artist: "Tetrix Bass & ROY KNOX",
    audioSrc:
      "https://www.mboxdrive.com/Koven%20&%20ROY%20KNOX%20-%20About%20Me%20[NCS%20Official%20Video].mp3",
    image: album2,
  },
  {
    title: "About Me",
    artist: "Koven & ROY KNOX",
    audioSrc:
      "https://www.mboxdrive.com/Tetrix%20Bass%20&%20ROY%20KNOX%20-%20When%20Im%20Gone%20(feat.%20Ellen%20Louise)%20[NCS%20Release].mp3",
    image: album3,
  },
];

const AudioPlayer = () => {
  //State
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  //Destructur for conciseness
  const { title, artist, audioSrc, image, color } = tracks[trackIndex];
  // Refs
  const audioRef = useRef(new Audio(audioSrc));
  const intervalRef = useRef();
  const isReady = useRef(false);

  //Destructure for conciseness
  const { duration } = audioRef.current;

  const toPrevTrack = () => {
    if (trackIndex - 1 < 0) {
      setTrackIndex(tracks.length - 1);
      isReady.current = true;
    } else {
      setTrackIndex(trackIndex - 1);
    }
  };

  const toNextTrack = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(trackIndex + 1);
      isReady.current = true;
    } else {
      setTrackIndex(0);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  // Handle setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    }
  }, [trackIndex]);

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const currentPercentage = duration
    ? `${(trackProgress / duration) * 100}%`
    : "0%";
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;
  return (
      <div className="audio-player">
        <div className="track-info">
          <img
            className="artwork"
            src={image}
            alt={`track artwork for ${title} by ${artist}`}
            style={{ transform: [{ rotate: "90deg" }] }}
          />
          <h2 className="title">{title}</h2>
          <h3 className="artist">{artist}</h3>
          <AudioControls
            isPlaying={isPlaying}
            onPrevClick={toPrevTrack}
            onNextClick={toNextTrack}
            onPlayPauseClick={setIsPlaying}
          />
          <input
            type="range"
            value={trackProgress}
            step="1"
            min="0"
            max={duration ? duration : `${duration}`}
            className="progress"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
            style={{ background: trackStyling }}
          />
        </div>
        <Backdrop
          backgroundImage={image}
          trackIndex={trackIndex}
          isPlaying={isPlaying}
        />
      </div>
  );
};

export default AudioPlayer;
