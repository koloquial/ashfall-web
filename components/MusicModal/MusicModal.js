'use client';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { MusicPlayerContext } from '@/contexts/MusicPlayerContext';
import {
  FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaVolumeMute, FaVolumeUp, FaRandom, FaExternalLinkAlt,
  FaChevronDown, FaChevronUp, FaDownload
} from 'react-icons/fa';

export default function MusicModal() {
  const {
    tracks,
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    togglePlayPause,
    toggleMute,
    muted,
    volume,
    setAudioVolume,
    progress,
    handleNextTrack,
    handlePreviousTrack,
    shuffle,
    toggleShuffle,
    toggleTrackEnabled,
    showModal,
    setShowModal,
    showDetachablePlayer,
    setShowDetachablePlayer,
    album,
    setAlbum,
    albums: albumMap
  } = useContext(MusicPlayerContext);

  const progressRef = useRef(null);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showAccordion, setShowAccordion] = useState(false);
  const [albumList, setAlbumList] = useState([]);

  useEffect(() => {
    const entries = Object.entries(albumMap).map(([key, value]) => ({
      album: key,
      image: value.image,
      download: value.download
    }));
    setAlbumList(entries);
  }, [albumMap]);

  const currentTrack = tracks[currentTrackIndex];
  const albumMeta = albumList.find((a) => a.album === album);

  const handleScrub = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const audio = document.querySelector('audio');
    if (audio && audio.duration) {
      audio.currentTime = ratio * audio.duration;
    }
  };

  const handleHover = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const audio = document.querySelector('audio');
    if (audio && audio.duration) {
      setHoverTime(formatTime(ratio * audio.duration));
      setHoverX(x);
    }
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSelectTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleAlbumSelect = (selectedAlbumKey) => {
    setAlbum(selectedAlbumKey);
    setShowAccordion(false);
  };

  const formatAlbumName = (str) =>
    str.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  useEffect(() => {
    const handleMouseUp = () => setIsScrubbing(false);
    const handleMouseMove = (e) => {
      if (isScrubbing) handleScrub(e);
    };
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isScrubbing]);

  if (!showModal) return null;
  if (!tracks || tracks.length === 0 || currentTrackIndex < 0 || currentTrackIndex >= tracks.length) {
    return <div>Loading tracks...</div>;
  }

  return (
    <div className="modalBackdrop">
      <div className="modalContent musicModal">
        <button className="closeButton" onClick={() => setShowModal(false)} title="Close" aria-label="Close">X</button>

        <div className="musicHeader">
          <div style={{ textAlign: 'center' }}>
            <img
              src={albumMeta?.image || '/assets/music/default-cover.png'}
              alt="Cover Art"
              className="coverArt"
            />
          </div>

          <div className="trackInfo">
            <h3>{currentTrack.title}</h3>
            <h4>{formatAlbumName(album)}</h4>
            <div
              className="progressBarContainer"
              ref={progressRef}
              onMouseDown={(e) => {
                setIsScrubbing(true);
                handleScrub(e);
              }}
              onMouseMove={handleHover}
              onMouseLeave={() => {
                setHoverTime(null);
                setIsScrubbing(false);
              }}
            >
              <div className="progressBar" style={{ width: `${progress}%` }} />
              {hoverTime && (
                <div className="progressTooltip" style={{ left: hoverX }}>
                  {hoverTime}
                </div>
              )}
            </div>

            <div className="controls">
              <button onClick={handlePreviousTrack} title="Previous Track" aria-label="Previous Track">
                <FaStepBackward />
              </button>
              <button onClick={togglePlayPause} title={isPlaying ? "Pause" : "Play"} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={handleNextTrack} title="Next Track" aria-label="Next Track">
                <FaStepForward />
              </button>
              <button onClick={toggleMute} title={muted ? "Unmute" : "Mute"} aria-label={muted ? "Unmute" : "Mute"}>
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <button onClick={toggleShuffle} title="Toggle Shuffle" aria-label="Toggle Shuffle">
                <FaRandom style={{ color: shuffle ? 'orange' : 'inherit' }} />
              </button>
              <button
                onClick={() => setShowDetachablePlayer(true)}
                title="Pop-Out Player"
                aria-label="Pop-Out Player"
              >
                <FaExternalLinkAlt />
              </button>
            </div>

            {albumMeta?.download && (
              <a
                href={albumMeta.download}
                target="_blank"
                rel="noopener noreferrer"
                className="downloadAlbumBtn"
                title="Download Album"
                aria-label="Download Album"
              >
                <FaDownload style={{ marginRight: 6 }} />
                Download Album
              </a>
            )}

            <label>
              Volume:
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setAudioVolume(Number(e.target.value))}
                aria-label="Volume Control"
              />
            </label>
          </div>
        </div>

        <button
          className="discographyBtn"
          onClick={() => setShowAccordion(!showAccordion)}
          title="Toggle Discography"
          aria-label="Toggle Discography"
        >
          {showAccordion ? (
            <><FaChevronUp /> Hide Discography</>
          ) : (
            <><FaChevronDown /> Show Discography</>
          )}
        </button>

        {showAccordion && (
          <div className="albumSelector">
            {albumList.map((a, idx) => (
              <div key={idx} className="albumOption" onClick={() => handleAlbumSelect(a.album)}>
                <img src={a.image} alt={a.album} className="albumThumb" />
                <p>{formatAlbumName(a.album)}</p>
              </div>
            ))}
          </div>
        )}

        <div className="trackList">
          <div className="trackListHeader">
            <span>#</span>
            <span>Title</span>
            <span>Skip</span>
          </div>
          <div className="trackListScroll">
            {tracks.map((track, index) => {
              const isActive = index === currentTrackIndex;
              return (
                <div
                  key={index}
                  className={`trackItem ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectTrack(index)}
                >
                  <span>{track.track || index + 1}</span>
                  <span>{track.title}</span>
                  <input
                    type="checkbox"
                    checked={!track.enabled}
                    onChange={() => toggleTrackEnabled(index)}
                    aria-label={`Skip ${track.title}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
