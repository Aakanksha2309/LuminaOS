// components/CustomCursor.js
'use client'
import { useEffect, useState } from 'react';
import styles from './CustomCursor.module.css';

const CustomCursor = ({ isHoveringTextBox }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const updateCursorPosition = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    document.addEventListener('mousemove', updateCursorPosition);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
    };
  }, []);

  return (
    <div
      className={`${styles.cursor} ${isHoveringTextBox ? styles.hover : ''}`}
      style={{ left: cursorPosition.x, top: cursorPosition.y }}
    />
  );
};

export default CustomCursor;
