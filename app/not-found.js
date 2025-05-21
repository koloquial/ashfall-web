'use client';
import { useEffect, useState, useMemo } from 'react';
import './not-found.css';

const lostWhispers = [
  `The path was carved in ash and bone... you strayed too far.`,
  `Even the dead remember the way. You do not.`,
  `A thousand footsteps echoed here... none returned.`,
  `Hollow eyes see clearer than yours. Turn back.`,
  `This is not the place for fire to catch.`,
  `Did you think the map would save you? Maps burn.`,
  `The page is torn, the ink run dry. All routes vanish in the dark.`,
  `Only fools and phantoms walk forgotten roads.`,
  `They whispered of a door that never opened. You found it.`,
  `This realm was left behind for a reason.`
];

export default function NotFoundPage() {
  const fullText = useMemo(() => {
    return lostWhispers[Math.floor(Math.random() * lostWhispers.length)];
  }, []);

  const [text, setText] = useState('');

useEffect(() => {
  let index = 0;
  const interval = setInterval(() => {
    setText(fullText.slice(0, index + 1));
    index++;
    if (index >= fullText.length) clearInterval(interval);
  }, 35);
  return () => clearInterval(interval);
}, [fullText]);

  return (
    <div className="not-found-page">
      <p className="whisper">{text}</p>
    </div>
  );
}
