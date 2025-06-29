import React from 'react';
import styles from '../styles/SoundWave.module.css';

const SoundWave = () => {
  return (
    <div className={styles.container}>
      <div className={styles.soundWaveContainer}>
        <div className={styles.soundWave}></div>
        <div className={styles.soundWave2}></div>
      </div>
    </div>
  );
};

export default SoundWave;
