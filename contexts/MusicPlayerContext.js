'use client';
import React, { createContext, useState, useEffect, useRef } from 'react';

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [albums, setAlbums] = useState({});
  const [album, setAlbum] = useState('blood-on-timber');
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDetachablePlayer, setShowDetachablePlayer] = useState(true);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const [timberRes, scarsRes] = await Promise.all([
          fetch('/api/music/blood-on-timber'),
          fetch('/api/music/scars-upon-stone'),
        ]);

        const [timberData, scarsData] = await Promise.all([
          timberRes.json(),
          scarsRes.json(),
        ]);

        const structured = {
          'blood-on-timber': {
            ...timberData,
            tracks: timberData.tracks.map(t => ({ ...t, album: 'blood-on-timber', enabled: t.enabled !== false })),
          },
          'scars-upon-stone': {
            ...scarsData,
            tracks: scarsData.tracks.map(t => ({ ...t, album: 'scars-upon-stone', enabled: t.enabled !== false })),
          },
        };

        setAlbums(structured);
        setTracks(structured['blood-on-timber'].tracks);
        console.log('ALBUMS LOADED', structured);
      } catch (err) {
        console.error('Error loading albums:', err);
      }
    };

    fetchAlbums();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (!tracks.length || !audioRef.current) return;
    const currentTrack = tracks[currentTrackIndex];
    if (!currentTrack) return;

    audioRef.current.src = currentTrack.source || currentTrack.url;
    if (isPlaying) audioRef.current.play();
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
    audioRef.current.volume = volume;
  }, [muted, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleNextTrack);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleNextTrack);
    };
  }, [currentTrackIndex, tracks]);

  const play = async () => {
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn('Playback failed:', err);
    }
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    isPlaying ? pause() : play();
  };

  const toggleMute = () => {
    setMuted(!muted);
    audioRef.current.muted = !muted;
  };

  const setAudioVolume = (vol) => {
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  const handleNextTrack = () => {
    const enabledTracks = tracks.filter(t => t.enabled);
    if (shuffle) {
      const randomTrack = enabledTracks[Math.floor(Math.random() * enabledTracks.length)];
      const index = tracks.findIndex(t => t.source === randomTrack.source);
      setCurrentTrackIndex(index);
    } else {
      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= enabledTracks.length) nextIndex = 0;
      const actualIndex = tracks.findIndex(t => t.source === enabledTracks[nextIndex].source);
      setCurrentTrackIndex(actualIndex);
    }
  };

  const handlePreviousTrack = () => {
    const enabledTracks = tracks.filter(t => t.enabled);
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = enabledTracks.length - 1;
    const actualIndex = tracks.findIndex(t => t.source === enabledTracks[prevIndex].source);
    setCurrentTrackIndex(actualIndex);
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleTrackEnabled = (index) => {
    const updatedTracks = [...tracks];
    updatedTracks[index].enabled = !updatedTracks[index].enabled;
    setTracks(updatedTracks);
  };

  const switchAlbum = (albumKey) => {
    if (albums[albumKey]) {
      setAlbum(albumKey);
      setTracks(albums[albumKey].tracks);
      setCurrentTrackIndex(0);
      setIsPlaying(false);
    }
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        tracks,
        currentTrackIndex,
        setCurrentTrackIndex,
        isPlaying,
        setIsPlaying,
        play,
        pause,
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
        setAlbum: switchAlbum,
        albums,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
