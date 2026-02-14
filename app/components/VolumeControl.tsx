'use client'

import React, { useState, useEffect } from 'react'
import styles from './VolumeControl.module.css'

interface VolumeControlProps {
    audioRef: React.RefObject<HTMLAudioElement>
}

export default function VolumeControl({ audioRef }: VolumeControlProps) {
    const [volume, setVolume] = useState(0.3)
    const [isMuted, setIsMuted] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    // Sync state with audio element events
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateState = () => {
            setVolume(audio.volume)
            setIsMuted(audio.muted)
            setIsPaused(audio.paused)
        }

        // Initial sync
        updateState()

        // Listeners and periodic check
        audio.addEventListener('volumechange', updateState)
        audio.addEventListener('play', updateState)
        audio.addEventListener('pause', updateState)

        // Fallback sync
        const interval = setInterval(updateState, 1000)

        return () => {
            audio.removeEventListener('volumechange', updateState)
            audio.removeEventListener('play', updateState)
            audio.removeEventListener('pause', updateState)
            clearInterval(interval)
        }
    }, [audioRef])

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted
            // Force update local state immediately for snappy UI
            setIsMuted(!isMuted)
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value)
        if (audioRef.current) {
            audioRef.current.volume = newVolume
            if (newVolume > 0 && audioRef.current.muted) {
                audioRef.current.muted = false
            }
        }
    }

    // Unified Animated Icon
    // State logic:
    // - Show waves if playing AND volume > 0 AND not muted
    // - Show X if paused OR volume == 0 OR muted
    const showMuteState = isMuted || volume === 0 || isPaused

    const AnimatedIcon = () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={showMuteState ? styles.muted : styles.unmuted}
        >
            {/* Speaker Body - Always visible but scales */}
            <path d="M11 5L6 9H2V15H6L11 19V5Z" className={styles.speakerBody} />

            {/* Sound Waves - Visible when sound is on */}
            <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" className={styles.wave} />
            <path d="M19.07 4.93C20.9447 6.80527 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" className={styles.wave} style={{ transitionDelay: '0.05s' }} />

            {/* X Mark - Visible when muted/paused (Draws in) */}
            <line x1="23" y1="9" x2="17" y2="15" className={styles.xMark} />
            <line x1="17" y1="9" x2="23" y2="15" className={styles.xMark} style={{ transitionDelay: '0.1s' }} />
        </svg>
    )

    // Calculate percentage for fill width
    const percentage = isMuted ? 0 : volume * 100

    return (
        <div className={styles.container} onClick={(e) => e.stopPropagation()}>
            <div
                className={styles.iconButton}
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                title={isMuted ? "Unmute" : "Mute"}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AnimatedIcon />
                </div>
            </div>

            <div className={styles.sliderWrapper}>
                <div className={styles.track}>
                    <div
                        className={styles.fill}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={audioRef.current?.volume ?? volume}
                    onChange={handleVolumeChange}
                    className={styles.rangeInput}
                    aria-label="Volume"
                />
            </div>
        </div>
    )
}
