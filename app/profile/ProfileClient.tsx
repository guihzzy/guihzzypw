'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './page.module.css'

interface User {
  username: string
  global_name: string | null
  avatar: string
  avatarDecoration: string | null
  badges: Array<{ name: string; url: string; popup: string }>
  spotify: any
  ultima_musica: any
  user_status: { status: string; img: string } | null
  outras_atividades: any[] | null
}

interface ProfileClientProps {
  initialData: User
  endpoint: string
}

function useMouseGlow<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  const handleMouseMove = (e: React.MouseEvent<T>) => {
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    element.style.setProperty('--mouse-x', `${x}px`)
    element.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleMouseLeave = () => {
    const element = ref.current
    if (!element) return
    element.style.setProperty('--mouse-x', '-1000px')
    element.style.setProperty('--mouse-y', '-1000px')
  }

  return { ref, handleMouseMove, handleMouseLeave }
}

export default function ProfileClient({ initialData, endpoint }: ProfileClientProps) {
  const mainCard = useMouseGlow()
  const [userData, setUserData] = useState<User>(initialData)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    // Incrementar contador de visualizações
    const stored = localStorage.getItem('viewCount')
    const currentCount = stored ? parseInt(stored, 10) : 0
    const newCount = currentCount + 1
    localStorage.setItem('viewCount', newCount.toString())
    setViewCount(newCount)

    // Atualizar dados a cada 3 segundos (apenas no cliente para dados em tempo real)
    const apiInterval = setInterval(async () => {
      try {
        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
          if (data.user || data.data) {
            setUserData(data.user || data.data)
          }
        }
      } catch (err) {
        console.error('Erro ao atualizar dados:', err)
      }
    }, 3000)

    // Atualizar tempo atual a cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => {
      clearInterval(apiInterval)
      clearInterval(timeInterval)
    }
  }, [endpoint])

  const displayName = userData.global_name || userData.username

  return (
    <div className={styles.page}>
      <div className={styles.viewCount}>
        <span>{viewCount.toLocaleString('pt-BR')}</span>
      </div>

      <main className={styles.stack}>
        <section
          className={styles.card}
          ref={mainCard.ref}
          onMouseMove={mainCard.handleMouseMove}
          onMouseLeave={mainCard.handleMouseLeave}
        >
          <div className={styles.profileRow}>
            <div className={styles.avatarWrapper}>
              <div
                className={styles.avatar}
                style={{
                  backgroundImage: `url(${userData.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {userData.avatarDecoration && (
                <img
                  src={userData.avatarDecoration}
                  alt="Avatar decoration"
                  className={styles.avatarDecoration}
                />
              )}
              {userData.user_status && (
                <div className={styles.statusIndicator}>
                  <img
                    src={userData.user_status.img}
                    alt={userData.user_status.status}
                    className={styles.statusIcon}
                  />
                </div>
              )}
            </div>
            <div className={styles.profileMeta}>
              <div className={styles.nameBlock}>
                <div className={styles.name}>{displayName}</div>
                <div className={styles.handle}>@{userData.username}</div>
              </div>

              <div className={styles.badges}>
                {userData.badges.map((badge, index) => (
                  <div key={index} className={styles.badgeWrapper}>
                    <img
                      src={badge.url}
                      alt={badge.popup}
                      className={styles.badgeImage}
                    />
                    <div className={styles.badgeTooltip}>{badge.popup}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Adicione aqui o resto do conteúdo do perfil */}
          {userData.spotify && (
            <div className={styles.section}>
              <p>Ouvindo: {userData.spotify.detalhe}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
