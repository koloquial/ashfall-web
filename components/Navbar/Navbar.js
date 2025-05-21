"use client";
import { useState, useContext } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { MdDashboard, MdMusicNote } from 'react-icons/md';
import { FaUserEdit, FaBookOpen, FaThLarge, FaBalanceScale, FaQuestionCircle, FaLandmark, FaNewspaper, FaCubes, FaGift, FaWallet, FaBook, FaUserCircle } from 'react-icons/fa';
import { FiLogOut, FiDownload, FiShoppingBag, FiGrid } from 'react-icons/fi';
import ThemeToggle from '@/components/ThemeToggle';
import { MusicPlayerContext } from '@/contexts/MusicPlayerContext';

export default function Navbar() {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  // Retrieve the function to show the music modal from the music player context
  const { setShowModal } = useContext(MusicPlayerContext);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left Side: Logo and Public Links */}
        <div className="navbar-left">
          <Link href="/" className="logo title-small">
            <img
              className="logo-icon"
              src="http://localhost:4000/assets/icons/ashfall-icon.png"
              alt="Ashfall logo"
            />
          </Link>

          <div
            className="dropdown"
            onMouseEnter={() => setLibraryOpen(true)}
            onMouseLeave={() => setLibraryOpen(false)}
          >
            <button className="dropdown-button">
              <FaBook /> Library <span className="arrow">▼</span>
            </button>
            {libraryOpen && (
              <div className="dropdown-menu">
                <Link href="/news"><FaNewspaper /> News</Link>
                <Link href="/crypto"><FaWallet /> Crypto</Link> 
                <Link href="/how-to-play"><FaQuestionCircle /> How to Play</Link>
                <Link href="/balancing"><FaBalanceScale /> Balancing</Link>
                <Link href="/glossary"><FiGrid /> Glossary</Link>
                <Link href="/lore"><FaLandmark /> Lore</Link>
                <Link href="/wiki"><FaBookOpen /> Wiki</Link>
                <Link href="/catalog"><FaThLarge /> Card Catalog</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Auth Links, Music Controls, and Theme Toggle */}
        <div className="navbar-right">
          {user && (
            <>
              <Link href="/dashboard"><MdDashboard /> Dashboard</Link>
              <Link href="/decks"><FaThLarge /> Decks</Link>
              <Link href="/collection"><FaCubes /> Collection</Link>
              <Link href="/packs"><FaGift /> Packs</Link>
              <Link href="/store"><FiShoppingBag /> Store</Link>

              <div
                className="dropdown profile-dropdown"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button className="dropdown-button">
                  <FaUserCircle /> Profile <span className="arrow">▼</span>
                </button>
                {profileOpen && (
                  <div className="dropdown-menu">
                    <Link href="/profile"><FaUserEdit /> Edit Profile</Link>
                    <button className="dropdown-btn" onClick={logout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {!user && (
            <Link href="/account">
              <FaUserCircle /> Account
            </Link>
          )}

          {/* Music Controls: Only the Music Modal button */}
          <div className="navbar-music-controls">
  <button
    onClick={() => setShowModal(true)}
    className="navbar-music-button"
    title="Open Music Player"
    aria-label="Open Music Player"
  >
    <MdMusicNote size={22} />
  </button>
</div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
