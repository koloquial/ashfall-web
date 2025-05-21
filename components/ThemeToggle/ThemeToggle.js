'use client';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="toggle-container">
      <label className="switch">
        <input
          type="checkbox"
          onChange={toggleTheme}
          checked={theme === 'light'}
        />
        <span className="slider" />
      </label>
      <span className="toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </div>
  );
}
