'use client';
import React, { useContext, useRef } from 'react';
import { MusicPlayerContext } from '@/contexts/MusicPlayerContext';
import Draggable from 'react-draggable';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaTimes } from 'react-icons/fa';

function DetachablePlayer() {
  const {
    showDetachablePlayer,
    tracks,
    currentTrackIndex,
    isPlaying,
    togglePlayPause,
    handleNextTrack,
    handlePreviousTrack,
    progress,
    setShowDetachablePlayer,
  } = useContext(MusicPlayerContext);

  const nodeRef = useRef(null);
  const progressRef = useRef(null);

  if (!showDetachablePlayer) return null;
  if (!tracks || tracks.length === 0 || currentTrackIndex < 0 || currentTrackIndex >= tracks.length) {
    return null;
  }

  const currentTrack = tracks[currentTrackIndex];

  const handleScrub = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;

    const audio = document.querySelector('audio');
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = clickRatio * audio.duration;
    }
  };

  return (
    <Draggable nodeRef={nodeRef}>
      <div ref={nodeRef} className="detachable-player">
        <div className="detachable-header">
          <div className="marquee" title={currentTrack.title}>
            <span>{currentTrack.title}</span>
          </div>
          <button
            className="detachable-close"
            onClick={() => setShowDetachablePlayer(false)}
            title="Close Player"
            aria-label="Close Player"
          >
            <FaTimes />
          </button>
        </div>

        <div
          className="detachable-progress-container"
          ref={progressRef}
          onClick={handleScrub}
        >
          <div
            className="detachable-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="detachable-controls">
          <button className="detachable-button" onClick={handlePreviousTrack} title="Previous" aria-label="Previous Track">
            <FaStepBackward />
          </button>
          <button className="detachable-button" onClick={togglePlayPause} title={isPlaying ? "Pause" : "Play"} aria-label="Play/Pause">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="detachable-button" onClick={handleNextTrack} title="Next" aria-label="Next Track">
            <FaStepForward />
          </button>
        </div>
      </div>
    </Draggable>
  );
}

export default DetachablePlayer;
