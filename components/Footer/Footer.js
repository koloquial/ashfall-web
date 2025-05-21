'use client';
import React from 'react';
import {
  FaFacebookF, FaTwitter, FaDiscord, FaYoutube, FaInstagram
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        
        <div className="footer-social">
          <h4>Follow</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://discord.com" target="_blank" aria-label="Discord"><FaDiscord /></a>
            <a href="https://youtube.com" target="_blank" aria-label="YouTube"><FaYoutube /></a>
            <a href="https://instagram.com" target="_blank" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>

        <div className="footer-links">
            <h4>Ashfall</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Code of Conduct</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

      
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Ashfall. All rights reserved.</p>
      </div>
    </footer>
  );
}
