'use client'

import React from 'react'
import { useRef, useState, useEffect } from 'react'
import styles from './page.module.css'
import VolumeControl from './components/VolumeControl'
import valorantIcon from './assets/valorant.png'
import robloxIcon from './assets/roblox.png'
import beamngIcon from './assets/BeamNG.drive.png'

// Tipos da API
interface SpotifyData {
  musica: string
  artista: string
  album_art: string
  started_at: string
  ends_at: string
  duration: number
  duration_formatted: string
  elapsed: number
  elapsed_formatted: string
  remaining: number
  remaining_formatted: string
}

interface UltimaMusicaSpotify {
  musica: string
  artista: string
  album_art: string
  started_at: string
  saved_at: number
  formatted_time: string
}

interface Badge {
  id: string
  description: string
  icon: string
  link: string
}

interface UserStatus {
  status: string
  img: string
}

interface OutraAtividade {
  name: string
  details: string | null
  state: string | null
  assets: string | null
  started_at?: string
}

interface ApiData {
  username: string
  global_name: string | null
  id: string
  avatar: string
  avatarDecoration: string | null
  user_status: UserStatus | null
  spotify: SpotifyData | null
  ultima_musica_spotify: UltimaMusicaSpotify | null
  outras_atividades: OutraAtividade[] | null
  badges: Badge[]
}

interface ApiResponse {
  success: boolean
  data: ApiData
  timestamp: string
}

// Tipos internos do componente (mapeados)
interface MappedSpotifyData {
  musica: string
  artista: string
  album_art: string
  started_at: string
  ends_at: string | null
  duration: number | null
  duration_formatted: string | null
  timestamps?: {
    start: string
    end: string | null
  }
}

interface MappedUltimaMusica {
  musica: string
  artista: string
  album_art: string
  started_at: string
  saved_at: number
  formatted_time: string
}

interface MappedBadge {
  name: string
  url: string
  popup: string
}

interface MappedOutraAtividade {
  nome: string
  detalhe: string | null
  state: string | null
  assets: {
    grande: string | null
    pequena: string | null
  }
  timestamps: {
    start: string
    end: string | null
  }
}

interface User {
  id: string
  username: string
  global_name: string | null
  avatar: string
  avatarDecoration: string | null
  badges: MappedBadge[]
  spotify: MappedSpotifyData | null
  ultima_musica: MappedUltimaMusica | null
  user_status: UserStatus | null
  outras_atividades: MappedOutraAtividade[] | null
}

// Tipos da API do Discord
interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  description: string | null
}

interface DiscordInviteResponse {
  guild: DiscordGuild
  profile?: {
    id: string
    name: string
    icon_hash: string | null
    member_count: number
    online_count: number
    description?: string | null
  }
}

function useMouseGlow<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  const rafRef = useRef<number>()

  const handleMouseMove = (e: React.MouseEvent<T>) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      element.style.setProperty('--mouse-x', `${x}px`)
      element.style.setProperty('--mouse-y', `${y}px`)
    })
  }

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    const element = ref.current
    if (!element) return
    element.style.setProperty('--mouse-x', '-1000px')
    element.style.setProperty('--mouse-y', '-1000px')
  }

  return { ref, handleMouseMove, handleMouseLeave }
}


function IconExternalLink(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

function IconEye(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconGlobe(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  )
}

function IconMusic(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="7" cy="18" r="3" />
      <circle cx="19" cy="16" r="3" />
    </svg>
  )
}

function IconClock(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function IconInstagram(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 2500 2500"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
    >
      <g id="SVGRepo_iconCarrier">
        <path d="M833.4,1250c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7S833.4,1480.11,833.4,1250m-225.26,0c0,354.5,287.36,641.86,641.86,641.86S1891.86,1604.5,1891.86,1250,1604.5,608.14,1250,608.14,608.14,895.5,608.14,1250M1767.27,582.69a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M745,2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27s373.28,1.31,505.15,7.27c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M734.65,7.57c-133.07,6.06-224,27.16-303.41,58.06C349,97.54,279.38,140.35,209.81,209.81S97.54,349,65.63,431.24c-30.9,79.46-52,170.34-58.06,303.41C1.41,867.93,0,910.54,0,1250s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43S349,2402.37,431.24,2434.37c79.56,30.9,170.34,52,303.41,58.06C868,2498.49,910.54,2500,1250,2500s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95,97.54,2068.86,65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17,1.51,1589.56,0,1250.1,0S868,1.41,734.65,7.57" fill="currentColor"></path>
      </g>
    </svg>
  )
}

function IconTikTok(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M8.45095 19.7926C8.60723 18.4987 9.1379 17.7743 10.1379 17.0317C11.5688 16.0259 13.3561 16.5948 13.3561 16.5948V13.2197C13.7907 13.2085 14.2254 13.2343 14.6551 13.2966V17.6401C14.6551 17.6401 12.8683 17.0712 11.4375 18.0775C10.438 18.8196 9.90623 19.5446 9.7505 20.8385C9.74562 21.5411 9.87747 22.4595 10.4847 23.2536C10.3345 23.1766 10.1815 23.0889 10.0256 22.9905C8.68807 22.0923 8.44444 20.7449 8.45095 19.7926ZM22.0352 6.97898C21.0509 5.90039 20.6786 4.81139 20.5441 4.04639H21.7823C21.7823 4.04639 21.5354 6.05224 23.3347 8.02482L23.3597 8.05134C22.8747 7.7463 22.43 7.38624 22.0352 6.97898ZM28 10.0369V14.293C28 14.293 26.42 14.2312 25.2507 13.9337C23.6179 13.5176 22.5685 12.8795 22.5685 12.8795C22.5685 12.8795 21.8436 12.4245 21.785 12.3928V21.1817C21.785 21.6711 21.651 22.8932 21.2424 23.9125C20.709 25.246 19.8859 26.1212 19.7345 26.3001C19.7345 26.3001 18.7334 27.4832 16.9672 28.28C15.3752 28.9987 13.9774 28.9805 13.5596 28.9987C13.5596 28.9987 11.1434 29.0944 8.96915 27.6814C8.49898 27.3699 8.06011 27.0172 7.6582 26.6277L7.66906 26.6355C9.84383 28.0485 12.2595 27.9528 12.2595 27.9528C12.6779 27.9346 14.0756 27.9528 15.6671 27.2341C17.4317 26.4374 18.4344 25.2543 18.4344 25.2543C18.5842 25.0754 19.4111 24.2001 19.9423 22.8662C20.3498 21.8474 20.4849 20.6247 20.4849 20.1354V11.3475C20.5435 11.3797 21.2679 11.8347 21.2679 11.8347C21.2679 11.8347 22.3179 12.4734 23.9506 12.8889C25.1204 13.1864 26.7 13.2483 26.7 13.2483V9.91314C27.2404 10.0343 27.7011 10.0671 28 10.0369Z" fill="currentColor"></path>
        <path d="M26.7009 9.91314V13.2472C26.7009 13.2472 25.1213 13.1853 23.9515 12.8879C22.3188 12.4718 21.2688 11.8337 21.2688 11.8337C21.2688 11.8337 20.5444 11.3787 20.4858 11.3464V20.1364C20.4858 20.6258 20.3518 21.8484 19.9432 22.8672C19.4098 24.2012 18.5867 25.0764 18.4353 25.2553C18.4353 25.2553 17.4337 26.4384 15.668 27.2352C14.0765 27.9539 12.6788 27.9357 12.2604 27.9539C12.2604 27.9539 9.84473 28.0496 7.66995 26.6366L7.6591 26.6288C7.42949 26.4064 7.21336 26.1717 7.01177 25.9257C6.31777 25.0795 5.89237 24.0789 5.78547 23.7934C5.78529 23.7922 5.78529 23.791 5.78547 23.7898C5.61347 23.2937 5.25209 22.1022 5.30147 20.9482C5.38883 18.9122 6.10507 17.6625 6.29444 17.3494C6.79597 16.4957 7.44828 15.7318 8.22233 15.0919C8.90538 14.5396 9.6796 14.1002 10.5132 13.7917C11.4144 13.4295 12.3794 13.2353 13.3565 13.2197V16.5948C13.3565 16.5948 11.5691 16.028 10.1388 17.0317C9.13879 17.7743 8.60812 18.4987 8.45185 19.7926C8.44534 20.7449 8.68897 22.0923 10.0254 22.991C10.1813 23.0898 10.3343 23.1775 10.4845 23.2541C10.7179 23.5576 11.0021 23.8221 11.3255 24.0368C12.631 24.8632 13.7249 24.9209 15.1238 24.3842C16.0565 24.0254 16.7586 23.2167 17.0842 22.3206C17.2888 21.7611 17.2861 21.1978 17.2861 20.6154V4.04639H20.5417C20.6763 4.81139 21.0485 5.90039 22.0328 6.97898C22.4276 7.38624 22.8724 7.7463 23.3573 8.05134C23.5006 8.19955 24.2331 8.93231 25.1734 9.38216C25.6596 9.61469 26.1722 9.79285 26.7009 9.91314Z" fill="currentColor"></path>
        <path d="M4.48926 22.7568V22.7594L4.57004 22.9784C4.56076 22.9529 4.53074 22.8754 4.48926 22.7568Z" fill="currentColor"></path>
        <path d="M10.5128 13.7916C9.67919 14.1002 8.90498 14.5396 8.22192 15.0918C7.44763 15.7332 6.79548 16.4987 6.29458 17.354C6.10521 17.6661 5.38897 18.9168 5.30161 20.9528C5.25223 22.1068 5.61361 23.2983 5.78561 23.7944C5.78543 23.7956 5.78543 23.7968 5.78561 23.798C5.89413 24.081 6.31791 25.0815 7.01191 25.9303C7.2135 26.1763 7.42963 26.4111 7.65924 26.6334C6.92357 26.1457 6.26746 25.5562 5.71236 24.8839C5.02433 24.0451 4.60001 23.0549 4.48932 22.7626C4.48919 22.7605 4.48919 22.7584 4.48932 22.7564V22.7527C4.31677 22.2571 3.95431 21.0651 4.00477 19.9096C4.09213 17.8736 4.80838 16.6239 4.99775 16.3108C5.4985 15.4553 6.15067 14.6898 6.92509 14.0486C7.608 13.4961 8.38225 13.0567 9.21598 12.7484C9.73602 12.5416 10.2778 12.3891 10.8319 12.2934C11.6669 12.1537 12.5198 12.1415 13.3588 12.2575V13.2196C12.3808 13.2349 11.4148 13.4291 10.5128 13.7916Z" fill="currentColor"></path>
        <path d="M20.5438 4.04635H17.2881V20.6159C17.2881 21.1983 17.2881 21.76 17.0863 22.3211C16.7575 23.2167 16.058 24.0253 15.1258 24.3842C13.7265 24.923 12.6326 24.8632 11.3276 24.0368C11.0036 23.823 10.7187 23.5594 10.4844 23.2567C11.5962 23.8251 12.5913 23.8152 13.8241 23.341C14.7558 22.9821 15.4563 22.1734 15.784 21.2774C15.9891 20.7178 15.9864 20.1546 15.9864 19.5726V3H20.4819C20.4819 3 20.4315 3.41188 20.5438 4.04635ZM26.7002 8.99104V9.9131C26.1725 9.79263 25.6609 9.61447 25.1755 9.38213C24.2352 8.93228 23.5026 8.19952 23.3594 8.0513C23.5256 8.1559 23.6981 8.25106 23.8759 8.33629C25.0192 8.88339 26.1451 9.04669 26.7002 8.99104Z" fill="currentColor"></path>
      </g>
    </svg>
  )
}

function IconSteam(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <title>steam</title>
        <path d="M18.102 12.129c0-0 0-0 0-0.001 0-1.564 1.268-2.831 2.831-2.831s2.831 1.268 2.831 2.831c0 1.564-1.267 2.831-2.831 2.831-0 0-0 0-0.001 0h0c-0 0-0 0-0.001 0-1.563 0-2.83-1.267-2.83-2.83 0-0 0-0 0-0.001v0zM24.691 12.135c0-2.081-1.687-3.768-3.768-3.768s-3.768 1.687-3.768 3.768c0 2.081 1.687 3.768 3.768 3.768v0c2.080-0.003 3.765-1.688 3.768-3.767v-0zM10.427 23.76l-1.841-0.762c0.524 1.078 1.611 1.808 2.868 1.808 1.317 0 2.448-0.801 2.93-1.943l0.008-0.021c0.155-0.362 0.246-0.784 0.246-1.226 0-1.757-1.424-3.181-3.181-3.181-0.405 0-0.792 0.076-1.148 0.213l0.022-0.007 1.903 0.787c0.852 0.364 1.439 1.196 1.439 2.164 0 1.296-1.051 2.347-2.347 2.347-0.324 0-0.632-0.066-0.913-0.184l0.015 0.006zM15.974 1.004c-7.857 0.001-14.301 6.046-14.938 13.738l-0.004 0.054 8.038 3.322c0.668-0.462 1.495-0.737 2.387-0.737 0.001 0 0.002 0 0.002 0h-0c0.079 0 0.156 0.005 0.235 0.008l3.575-5.176v-0.074c0.003-3.12 2.533-5.648 5.653-5.648 3.122 0 5.653 2.531 5.653 5.653s-2.531 5.653-5.653 5.653h-0.131l-5.094 3.638c0 0.065 0.005 0.131 0.005 0.199 0 0.001 0 0.002 0 0.003 0 2.342-1.899 4.241-4.241 4.241-2.047 0-3.756-1.451-4.153-3.38l-0.005-0.027-5.755-2.383c1.841 6.345 7.601 10.905 14.425 10.905 8.281 0 14.994-6.713 14.994-14.994s-6.713-14.994-14.994-14.994c-0 0-0.001 0-0.001 0h0z"></path>
      </g>
    </svg>
  )
}

function IconSpotify(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.5a.8.8 0 0 1-1.1.3c-2.7-1.7-6.1-2.1-10.1-1.1a.8.8 0 0 1-.4-1.6c4.4-1.1 8.2-.7 11.2 1.3.4.2.5.8.4 1.1Zm1-2.4a1 1 0 0 1-1.4.4c-3.1-1.9-7.8-2.5-11.5-1.4a1 1 0 0 1-.6-1.9c4.2-1.3 9.4-.7 12.9 1.5.5.2.7.8.6 1.4Zm.1-2.6c-3.7-2.2-9.8-2.4-13.4-1.3a1.1 1.1 0 1 1-.6-2.1c4.2-1.2 11-.9 15.3 1.6a1.1 1.1 0 0 1-1.3 1.8Z" />
    </svg>
  )
}


function IconGamepad(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </svg>
  )
}

function IconX(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

function IconDownload(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function IconCheck(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconInvalid(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function ActivityIcon({ src, alt, className, fallbackClassName }: { src: string | null, alt: string, className: string, fallbackClassName: string }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className={fallbackClassName}>
        <IconInvalid className={styles.activityDefaultIcon} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}

// Helpers puras
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatAgo = (msAgo: number) => {
  const s = Math.max(0, Math.floor(msAgo / 1000))
  if (s < 60) return `${s}s atrás`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m atrás`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h atrás`
  const d = Math.floor(h / 24)
  return `${d}d atrás`
}

const isPlayingNow = (atividade: MappedOutraAtividade) => {
  return atividade.timestamps?.end === null
}

const getPlayingTime = (atividade: MappedOutraAtividade, currentTime: number) => {
  if (!atividade.timestamps?.start) return null
  const start = new Date(atividade.timestamps.start).getTime()
  const elapsed = Math.max(0, Math.floor((currentTime - start) / 1000))

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60

  const mStr = m.toString().padStart(2, '0')
  const sStr = s.toString().padStart(2, '0')

  if (h > 0) {
    return `${h}:${mStr}:${sStr}`
  }
  return `${m}:${sStr}`
}

const ProfileCard = React.memo(({
  user,
  currentTime,
  onAvatarClick,
  previousDecoration,
  isDecorationClosing,
  className,
  style
}: {
  user: User
  currentTime: number
  onAvatarClick: (e: React.MouseEvent<HTMLElement>, rect: DOMRect) => void
  valorantIcon: any
  previousDecoration: string | null
  isDecorationClosing: boolean
  className?: string
  style?: React.CSSProperties
}) => {
  if (!user) return null

  const avatarRef = useRef<HTMLDivElement>(null)

  const getSpotifyElapsedSecLocal = () => {
    if (!user.spotify) return 0
    const duration = user.spotify.duration ?? 0
    const startMs = new Date(user.spotify.started_at).getTime()
    if (!Number.isFinite(startMs)) return 0
    const elapsed = (currentTime - startMs) / 1000
    if (duration > 0) return Math.max(0, Math.min(duration, elapsed))
    return Math.max(0, elapsed)
  }
  const getCurrentTimeLocal = () => !user.spotify ? '0:00' : formatTime(getSpotifyElapsedSecLocal())
  const getTotalDurationLocal = () => {
    if (!user.spotify) return '0:00'
    if (user.spotify.duration_formatted) return user.spotify.duration_formatted
    if (user.spotify.duration) return formatTime(user.spotify.duration)
    return '0:00'
  }
  const getProgressLocal = () => {
    if (!user.spotify) return 0
    const duration = user.spotify.duration ?? 0
    if (!duration) return 0
    const elapsed = getSpotifyElapsedSecLocal()
    return Math.min(100, Math.max(0, (elapsed / duration) * 100))
  }
  const getLastPlayedAgoLocal = () => {
    if (!user.ultima_musica) return null
    const base = typeof user.ultima_musica.saved_at === 'number' ? user.ultima_musica.saved_at : new Date(user.ultima_musica.started_at).getTime()
    if (!Number.isFinite(base)) return null
    return formatAgo(currentTime - base)
  }

  const [showActivity, setShowActivity] = useState(false)
  const [isActivityClosing, setIsActivityClosing] = useState(false)

  // Detectar quando para de jogar e animar saída
  const activityRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const temAtividadesAtivas = user.outras_atividades?.some(a => isPlayingNow(a)) || false

    if (temAtividadesAtivas) {
      setShowActivity(true)
      setIsActivityClosing(false)
    } else if (showActivity && !temAtividadesAtivas) {
      // Preparar animação: Congelar altura atual explicitamente
      if (activityRef.current) {
        // Isso garante que a transição comece da altura exata (ex: 70px) até 0
        // em vez de começar de um 'max-height' arbitrário (ex: 300px) que causaria delay
        activityRef.current.style.height = `${activityRef.current.scrollHeight}px`
        // Forçar reflow para aplicar o estilo antes da classe entrar
        void activityRef.current.offsetHeight
      }

      // Iniciar animação de fechamento
      setIsActivityClosing(true)

      const timer = setTimeout(() => {
        setShowActivity(false)
        setIsActivityClosing(false)
      }, 550) // Duração da animação CSS (0.5s + margem)
      return () => clearTimeout(timer)
    }
  }, [user.outras_atividades, showActivity])

  const displayName = user.global_name || user.username
  const isPlaying = !!user.spotify
  const spotifyData = user.spotify || user.ultima_musica
  const albumArt = spotifyData ? (user.spotify?.album_art || user.ultima_musica?.album_art) : null
  const trackTitle = spotifyData ? (user.spotify?.musica || user.ultima_musica?.musica) : null
  const trackArtist = spotifyData ? (user.spotify?.artista || user.ultima_musica?.artista)?.replace(/;/g, ',') : null

  return (
    <section className={`${styles.card} ${className || ''}`} style={style}>
      <a className={styles.cornerAction} href={`https://discord.com/users/${user.id}`} target="_blank" rel="noopener noreferrer" aria-label="Abrir perfil em nova aba">
        <IconExternalLink />
      </a>
      <div className={styles.profileRow}>
        <div className={styles.avatarWrapper}
          onClick={(e) => {
            e.preventDefault(); e.stopPropagation();
            if (avatarRef.current) {
              onAvatarClick(e, avatarRef.current.getBoundingClientRect())
            }
          }}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div ref={avatarRef} key={user.avatar} className={styles.avatar} style={{ backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(0%)', cursor: 'pointer' }} />
          {(user.avatarDecoration || (isDecorationClosing && previousDecoration)) && (
            <img key={user.avatarDecoration || previousDecoration} src={user.avatarDecoration || previousDecoration || ''} alt="decoration" className={`${styles.avatarDecoration} ${isDecorationClosing ? styles.avatarDecorationClosing : ''}`} />
          )}
          {user.user_status && (
            <div key={`${user.user_status.status}-${user.user_status.img}`} className={styles.statusIndicator}>
              <img src={user.user_status.img} alt={user.user_status.status} className={styles.statusIcon} />
            </div>
          )}
        </div>
        <div className={styles.profileMeta}>
          <div className={styles.nameBlock}>
            <div className={styles.name}>{displayName}</div>
            <div className={styles.handle}>@{user.username}</div>
          </div>
          <div className={styles.badges}>
            {user.badges.map((b, i) => (
              <div key={i} className={styles.badgeWrapper}>
                <img src={b.url} alt={b.popup} className={styles.badgeImage} />
                <div className={styles.badgeTooltip}>{b.popup}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}><IconGlobe className={styles.sectionIcon} /><span>Redes Sociais</span><div className={styles.sectionLine} /></div>
        <div className={styles.socialRow}>
          <a className={`${styles.socialBtn} ${styles.sp}`} href="https://open.spotify.com/user/vf83reqsc1idb1iw98qx7l6qe?si=fe113eddb8d84124" target="_blank" rel="noopener noreferrer"><IconSpotify /></a>
          <a className={`${styles.socialBtn} ${styles.ig}`} href="https://www.instagram.com/guihzzyp" target="_blank" rel="noopener noreferrer"><IconInstagram /></a>
          <a className={`${styles.socialBtn} ${styles.tt}`} href="https://www.tiktok.com/@guihzzy" target="_blank" rel="noopener noreferrer"><IconTikTok /></a>
        </div>
      </div>
      {showActivity && (
        <div ref={activityRef} className={`${styles.section} ${isActivityClosing ? styles.sectionClosing : ''}`}>
          <div className={styles.sectionHeader}><IconGamepad className={styles.sectionIcon} /><span>Jogando</span><div className={styles.sectionLine} /><span className={styles.livePill}><span className={styles.liveDot}></span> Jogando agora</span></div>
          <div className={styles.activitiesRow}>
            {user.outras_atividades?.filter(a => isPlayingNow(a)).filter((a, i, s) => i === s.findIndex(b => b.nome === a.nome && b.timestamps?.start === a.timestamps?.start)).map((a, i) => {
              const playingTime = getPlayingTime(a, currentTime);
              const apiIconSrc = a.assets?.grande || a.assets?.pequena;

              const iconMap: Record<string, any> = {
                'valorant': valorantIcon,
                'roblox': robloxIcon,
                'beamng.drive': beamngIcon
              };

              const localIconRaw = iconMap[a.nome.toLowerCase()];
              const localIcon = localIconRaw ? (typeof localIconRaw === 'string' ? localIconRaw : (localIconRaw as any).src || (localIconRaw as any).default || localIconRaw) : null;

              const iconSrc = apiIconSrc || localIcon;
              return (
                <div key={`${a.nome}-${i}`} className={styles.activityItem}>
                  <ActivityIcon
                    src={iconSrc}
                    alt={a.nome}
                    className={styles.activityIconImage}
                    fallbackClassName={styles.activityIcon}
                  />
                  <div className={styles.activityInfo}>
                    <div className={styles.activityName}>{a.nome}</div>
                    {a.detalhe && <div className={styles.activityDetail}>{a.detalhe}</div>}
                    {a.state && <div className={styles.activityDetail}>{a.state}</div>}
                    {playingTime && <div className={styles.activityTime}>Jogando há: {playingTime}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {spotifyData && trackTitle && (
        <a href="https://open.spotify.com/user/vf83reqsc1idb1iw98qx7l6qe?si=fe113eddb8d84124" target="_blank" rel="noopener noreferrer" className={styles.sectionLink}>
          <div key={`${isPlaying ? 'playing' : 'last'}-${trackTitle}`} className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconMusic className={styles.sectionIcon} />
              <span className={styles.sectionTitle}>{isPlaying ? 'Ouvindo Spotify' : 'Última música'}</span>
              <div className={styles.sectionLine} />
              {isPlaying && <span className={styles.livePill}><span className={styles.liveDot}></span> Ao vivo</span>}
              {!isPlaying && getLastPlayedAgoLocal() && <span className={styles.lastPlayedTime}>{getLastPlayedAgoLocal()}</span>}
            </div>
            <div className={styles.spotifyTop}>
              <div className={styles.cover} style={{ backgroundImage: albumArt ? `url(${albumArt})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className={styles.track}><div className={styles.trackTitle}>{trackTitle}</div><div className={styles.trackArtist}>{trackArtist}</div></div>
            </div>
            {isPlaying ? (
              <div className={styles.spotifyBottom}>
                <div className={styles.timeRow}><span>{getCurrentTimeLocal()}</span><span>{getTotalDurationLocal()}</span></div>
                <div className={styles.bar}><div className={styles.barFill} style={{ width: `${getProgressLocal()}%` }} /></div>
              </div>
            ) : (
              <div className={styles.lastPlayedInfo}><IconClock className={styles.clockIcon} /><span>Reproduzida via Spotify</span></div>
            )}
          </div>
        </a>
      )}
    </section>
  )
})

export default function Home() {
  const mainCard = useMouseGlow<HTMLDivElement>()
  const courtCard = useMouseGlow()
  const audioRef = useRef<HTMLAudioElement>(null)
  // Como a API não manda "start" das atividades, mantemos um start local por atividade
  const activityStartMsRef = useRef<Map<string, number>>(new Map())
  // Spotify: manter contagem em tempo real entre polls (sem “resetar”)
  const spotifySyncRef = useRef<{
    trackKey: string
    baseElapsedSec: number
    durationSec: number
    fetchedAtMs: number
  } | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [discordData, setDiscordData] = useState<DiscordInviteResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [viewCount, setViewCount] = useState(0)
  // showActivity movido para dentro do ProfileCard
  const [isDecorationClosing, setIsDecorationClosing] = useState(false)
  const [previousDecoration, setPreviousDecoration] = useState<string | null>(null)
  const [showEntrance, setShowEntrance] = useState(true)
  const [isEntranceClosing, setIsEntranceClosing] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [avatarModalClosing, setAvatarModalClosing] = useState(false)
  const [avatarStartPosition, setAvatarStartPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  // Triple-click avatar flip
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAvatarFlipping, setIsAvatarFlipping] = useState(false)
  const [alternateUserData, setAlternateUserData] = useState<User | null>(null)

  // Scan animation
  const [isScanning, setIsScanning] = useState(false)
  const [scanOverlayUser, setScanOverlayUser] = useState<User | null>(null)



  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/profile/408002057522380801')
      if (!response.ok) {
        // Timeout ou erro do servidor
        if (response.status === 504) {
          throw new Error('Timeout ao conectar com a API')
        }
        throw new Error('Erro ao buscar dados do usuário')
      }
      const apiResponse: ApiResponse = await response.json()

      if (!apiResponse.success || !apiResponse.data) {
        throw new Error('Resposta da API inválida')
      }

      const data = apiResponse.data

      // Mapear badges
      const mappedBadges: MappedBadge[] = (data.badges || []).map((badge) => {
        const isUrl = badge.icon.startsWith('http')
        return {
          name: badge.id,
          url: isUrl ? badge.icon : `https://cdn.discordapp.com/badge-icons/${badge.icon}.png`,
          popup: badge.description,
        }
      })

      // Mapear spotify
      const mappedSpotify: MappedSpotifyData | null = data.spotify ? {
        musica: data.spotify.musica,
        artista: data.spotify.artista,
        album_art: data.spotify.album_art,
        started_at: data.spotify.started_at,
        ends_at: data.spotify.ends_at ?? null,
        duration: typeof data.spotify.duration === 'number' ? data.spotify.duration : null,
        duration_formatted: data.spotify.duration_formatted ?? null,
        timestamps: {
          start: data.spotify.started_at,
          end: data.spotify.ends_at ?? null,
        },
      } : null

      // Sincronizar timer do Spotify (tempo real entre polls)
      if (data.spotify) {
        const trackKey = `${data.spotify.musica}|${data.spotify.artista}|${data.spotify.started_at}`
        spotifySyncRef.current = {
          trackKey,
          baseElapsedSec: typeof data.spotify.elapsed === 'number' ? data.spotify.elapsed : 0,
          durationSec: typeof data.spotify.duration === 'number' ? data.spotify.duration : 0,
          fetchedAtMs: Date.now(),
        }
      } else {
        spotifySyncRef.current = null
      }

      // Mapear última música
      const mappedUltimaMusica: MappedUltimaMusica | null = data.ultima_musica_spotify ? {
        musica: data.ultima_musica_spotify.musica,
        artista: data.ultima_musica_spotify.artista,
        album_art: data.ultima_musica_spotify.album_art,
        started_at: data.ultima_musica_spotify.started_at,
        saved_at: data.ultima_musica_spotify.saved_at,
        formatted_time: data.ultima_musica_spotify.formatted_time,
      } : null

      // Mapear outras atividades
      const makeActivityKey = (atividade: OutraAtividade) => {
        // Se mudar details/state, consideramos uma "nova" atividade (start reseta)
        return [
          atividade.name ?? '',
          atividade.details ?? '',
          atividade.state ?? '',
          atividade.assets ?? '',
        ].join('|')
      }

      const keysInThisFetch = new Set<string>()
      const seenKeys = new Set<string>()

      const mappedOutrasAtividades: MappedOutraAtividade[] = (data.outras_atividades || [])
        .filter((atividade) => {
          const key = makeActivityKey(atividade)
          if (seenKeys.has(key)) {
            return false // Remove duplicatas
          }
          seenKeys.add(key)
          keysInThisFetch.add(key)
          return true
        })
        .map((atividade) => {
          const key = makeActivityKey(atividade)

          // Se a API retornar started_at, usamos ele com prioridade e atualizamos o ref para consistência
          if (atividade.started_at) {
            const apiStart = new Date(atividade.started_at).getTime()
            if (!isNaN(apiStart)) {
              activityStartMsRef.current.set(key, apiStart)
            }
          }

          const existingStart = activityStartMsRef.current.get(key)
          // Preferência: API > Local existente > Agora
          const startMs = atividade.started_at
            ? new Date(atividade.started_at).getTime()
            : (typeof existingStart === 'number' ? existingStart : Date.now())

          if (existingStart === undefined || (atividade.started_at && existingStart !== startMs)) {
            activityStartMsRef.current.set(key, startMs)
          }

          return {
            nome: atividade.name,
            detalhe: atividade.details,
            state: atividade.state,
            assets: {
              grande: atividade.assets || null,
              pequena: null,
            },
            timestamps: {
              start: new Date(startMs).toISOString(),
              end: null, // Assumimos que está ativo se está na lista
            },
          }
        })

      // Limpar starts de atividades que não existem mais (evita crescer para sempre)
      for (const key of activityStartMsRef.current.keys()) {
        if (!keysInThisFetch.has(key)) {
          activityStartMsRef.current.delete(key)
        }
      }

      // Criar objeto User mapeado
      const mappedUser: User = {
        id: data.id,
        username: data.username,
        global_name: data.global_name,
        avatar: data.avatar,
        avatarDecoration: data.avatarDecoration || null,
        badges: mappedBadges,
        spotify: mappedSpotify,
        ultima_musica: mappedUltimaMusica,
        user_status: data.user_status,
        outras_atividades: mappedOutrasAtividades.length > 0 ? mappedOutrasAtividades : null,
      }

      setUserData(mappedUser)
      setHasError(false)
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
      setHasError(true)
      // Manter userData como null para mostrar silhueta
    } finally {
      setLoading(false)
    }
  }

  const fetchDiscordData = async () => {
    try {
      const response = await fetch('https://canary.discord.com/api/v10/invites/h1t')
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do Discord')
      }
      const data: DiscordInviteResponse = await response.json()
      setDiscordData(data)
    } catch (err) {
      console.error('Erro ao buscar dados do Discord:', err)
    }
  }

  // Função para formatar o número de visualizações
  const formatViewCount = (count: number) => {
    return count.toLocaleString('pt-BR')
  }

  const handleEntranceClick = () => {
    // Reproduzir música de fundo
    if (audioRef.current) {
      audioRef.current.volume = 0.3 // Volume em 30% (0.0 a 1.0)
      audioRef.current.play().catch(err => {
        console.error('Erro ao reproduzir música:', err)
      })
    }

    setIsEntranceClosing(true)
    setTimeout(() => {
      setShowEntrance(false)
      setIsEntranceClosing(false)
    }, 500) // Duração da animação
  }

  const fetchAlternateProfile = async (forceRefresh = false) => {
    if (alternateUserData && !forceRefresh) return // Já carregou antes

    try {
      const response = await fetch('/api/users/profile/614547076617076738')
      if (!response.ok) {
        throw new Error('Erro ao buscar perfil alternativo')
      }
      const apiResponse: ApiResponse = await response.json()

      if (!apiResponse.success || !apiResponse.data) {
        throw new Error('Resposta da API inválida')
      }

      const data = apiResponse.data

      // Mapear dados da mesma forma que o perfil principal
      const mappedBadges: MappedBadge[] = (data.badges || []).map((badge: Badge) => ({
        name: badge.id,
        url: `https://cdn.discordapp.com/badge-icons/${badge.icon}.png`,
        popup: badge.description,
      }))

      // Mapear Spotify
      const mappedSpotify: MappedSpotifyData | null = data.spotify ? {
        musica: data.spotify.musica,
        artista: data.spotify.artista,
        album_art: data.spotify.album_art,
        started_at: data.spotify.started_at,
        ends_at: data.spotify.ends_at ?? null,
        duration: typeof data.spotify.duration === 'number' ? data.spotify.duration : null,
        duration_formatted: data.spotify.duration_formatted ?? null,
        timestamps: {
          start: data.spotify.started_at,
          end: data.spotify.ends_at ?? null,
        },
      } : null

      // Mapear última música
      const mappedUltimaMusica: MappedUltimaMusica | null = data.ultima_musica_spotify ? {
        musica: data.ultima_musica_spotify.musica,
        artista: data.ultima_musica_spotify.artista,
        album_art: data.ultima_musica_spotify.album_art,
        started_at: data.ultima_musica_spotify.started_at,
        saved_at: data.ultima_musica_spotify.saved_at,
        formatted_time: data.ultima_musica_spotify.formatted_time,
      } : null

      // Helper para criar chave única de atividade
      const makeActivityKey = (atividade: OutraAtividade) => {
        return [
          atividade.name ?? '',
          atividade.details ?? '',
          atividade.state ?? '',
          atividade.assets ?? '',
        ].join('|')
      }

      // Mapear outras atividades (usando mesma lógica do perfil principal)
      const seenKeys = new Set<string>()
      const keysInThisFetch = new Set<string>()

      const mappedOutrasAtividades: MappedOutraAtividade[] = (data.outras_atividades || [])
        .filter((atividade) => {
          const key = makeActivityKey(atividade)
          if (seenKeys.has(key)) {
            return false
          }
          seenKeys.add(key)
          keysInThisFetch.add(key)
          return true
        })
        .map((atividade: OutraAtividade) => {
          const key = makeActivityKey(atividade)
          const existingStart = activityStartMsRef.current.get(key)
          const startMs = typeof existingStart === 'number' ? existingStart : Date.now()
          if (existingStart === undefined) {
            activityStartMsRef.current.set(key, startMs)
          }

          return {
            nome: atividade.name,
            detalhe: atividade.details,
            state: atividade.state,
            assets: {
              grande: atividade.assets || null,
              pequena: null,
            },
            timestamps: {
              start: new Date(startMs).toISOString(),
              end: null,
            },
          }
        })

      // Limpar starts de atividades que não existem mais
      for (const key of activityStartMsRef.current.keys()) {
        if (!keysInThisFetch.has(key)) {
          activityStartMsRef.current.delete(key)
        }
      }

      const mappedUser: User = {
        id: data.id,
        username: data.username,
        global_name: data.global_name,
        avatar: data.avatar,
        avatarDecoration: data.avatarDecoration || null,
        badges: mappedBadges,
        spotify: mappedSpotify,
        ultima_musica: mappedUltimaMusica,
        user_status: data.user_status || null,
        outras_atividades: mappedOutrasAtividades.length > 0 ? mappedOutrasAtividades : null,
      }

      setAlternateUserData(mappedUser)
    } catch (err) {
      console.error('Erro ao buscar perfil alternativo:', err)
    }
  }

  const handleAvatarClick = async (e: React.MouseEvent) => {
    // Prevenir abertura do modal ao triple-click
    e.stopPropagation()

    clickCountRef.current += 1

    // Resetar timer anterior
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
    }

    // Se chegou a 3 cliques, iniciar scan
    if (clickCountRef.current === 3) {
      clickCountRef.current = 0

      let targetUser: User | null = null

      if (!isFlipped) {
        // Indo para perfil alternativo
        if (alternateUserData) {
          targetUser = alternateUserData
          fetchAlternateProfile(true) // Revalidar dados em background
        } else {
          try {
            const response = await fetch('/api/users/profile/614547076617076738')
            if (response.ok) {
              const apiResponse: ApiResponse = await response.json()
              if (apiResponse.success && apiResponse.data) {
                const data = apiResponse.data
                const mappedBadges: MappedBadge[] = (data.badges || []).map((badge: Badge) => ({
                  name: badge.id,
                  url: `https://cdn.discordapp.com/badge-icons/${badge.icon}.png`,
                  popup: badge.description,
                }))

                const mappedSpotify: MappedSpotifyData | null = data.spotify ? {
                  musica: data.spotify.musica,
                  artista: data.spotify.artista,
                  album_art: data.spotify.album_art,
                  started_at: data.spotify.started_at,
                  ends_at: data.spotify.ends_at ?? null,
                  duration: typeof data.spotify.duration === 'number' ? data.spotify.duration : null,
                  duration_formatted: data.spotify.duration_formatted ?? null,
                  timestamps: {
                    start: data.spotify.started_at,
                    end: data.spotify.ends_at ?? null,
                  },
                } : null

                const mappedUltimaMusica: MappedUltimaMusica | null = data.ultima_musica_spotify ? {
                  musica: data.ultima_musica_spotify.musica,
                  artista: data.ultima_musica_spotify.artista,
                  album_art: data.ultima_musica_spotify.album_art,
                  started_at: data.ultima_musica_spotify.started_at,
                  saved_at: data.ultima_musica_spotify.saved_at,
                  formatted_time: data.ultima_musica_spotify.formatted_time,
                } : null

                const mappedOutrasAtividades: MappedOutraAtividade[] = (data.outras_atividades || []).map((atividade: OutraAtividade) => ({
                  nome: atividade.name,
                  detalhe: atividade.details,
                  state: atividade.state,
                  assets: {
                    grande: atividade.assets || null,
                    pequena: null,
                  },
                  timestamps: {
                    start: new Date().toISOString(),
                    end: null,
                  },
                }))

                const mappedUser: User = {
                  id: data.id,
                  username: data.username,
                  global_name: data.global_name,
                  avatar: data.avatar,
                  avatarDecoration: data.avatarDecoration || null,
                  badges: mappedBadges,
                  spotify: mappedSpotify,
                  ultima_musica: mappedUltimaMusica,
                  user_status: data.user_status || null,
                  outras_atividades: mappedOutrasAtividades.length > 0 ? mappedOutrasAtividades : null,
                }

                setAlternateUserData(mappedUser)
                targetUser = mappedUser
              }
            }
          } catch (err) {
            console.error('Erro ao buscar perfil alternativo:', err)
          }
        }
      } else {
        // Voltando para perfil original
        targetUser = userData
      }

      if (targetUser) {
        const element = mainCard.ref.current

        // 1. CONGELAR altura ANTES de trocar conteúdo (evita o "buraco")
        if (element) {
          const currentHeight = element.offsetHeight
          element.style.height = `${currentHeight}px`
          element.style.overflow = 'hidden'
        }

        // 2. Iniciar Scan Invertido - Salvar perfil atual para overlay
        setScanOverlayUser(activeUserData)

        // 3. Trocar conteúdo imediatamente (novo perfil)
        setIsFlipped(!isFlipped)

        // 4. Ativar animação de scan
        setIsScanning(true)

        // 5. Animação de altura após React renderizar o novo conteúdo
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (element) {
              // 1. Recuperar altura atual (congelada no style) ou usar offsetHeight
              // Precisamos garantir que isso seja um número válido
              const styleHeight = element.style.height
              const currentHeight = styleHeight ? parseFloat(styleHeight) : element.offsetHeight

              // 2. Medir nova altura do conteúdo (primeiro filho)
              const childElement = element.firstElementChild as HTMLElement

              if (childElement) {
                const rect = childElement.getBoundingClientRect()
                // Usar altura exata do bounding box (inclui bordas e padding)
                // Removemos soma de margens pois em layout flex com gap elas não contribuem da mesma forma ou são 0
                const newHeight = rect.height

                // Se a diferença for minúscula, ignorar animação
                if (Math.abs(currentHeight - newHeight) < 0.1) {
                  // Limpar estilos imediatamente se não houver mudança
                  element.style.height = ''
                  element.style.overflow = ''
                  return
                }

                // Aplicar transição (Ultra rápida: 0.15s)
                element.style.transition = 'height 0.15s ease-in-out'
                element.style.height = `${newHeight}px`

                // Cleanup após transição
                const cleanup = () => {
                  element.style.height = ''
                  element.style.transition = ''
                  element.style.overflow = ''
                  element.removeEventListener('transitionend', handleEnd)
                }

                const handleEnd = (e: TransitionEvent) => {
                  if (e.propertyName === 'height' && e.target === element) {
                    cleanup()
                  }
                }

                element.addEventListener('transitionend', handleEnd)

                // Fallback (0.15s + margem de segurança)
                setTimeout(cleanup, 250)
              }
            }
          })
        })

        // 6. Cleanup do scan overlay (Sincronizado com animação rápida)
        setTimeout(() => {
          setIsScanning(false)
          setScanOverlayUser(null)
        }, 200)
      }


      return
    }

    // Resetar contador após 1 segundo de inatividade
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0
    }, 1000)
  }

  const handleEntranceMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    element.style.setProperty('--mouse-x', `${x}px`)
    element.style.setProperty('--mouse-y', `${y}px`)
  }

  const fetchViewCount = async () => {
    try {
      // Buscar contador atual
      const getResponse = await fetch('/api/views')
      const getData = await getResponse.json()

      // Incrementar contador
      const postResponse = await fetch('/api/views', {
        method: 'POST',
      })
      const postData = await postResponse.json()

      setViewCount(postData.count)
    } catch (err) {
      console.error('Erro ao buscar contador:', err)
    }
  }

  useEffect(() => {
    fetchViewCount()
    fetchUserData()
    fetchDiscordData()

    // Atualizar dados da API a cada 5 segundos
    const apiInterval = setInterval(() => {
      fetchUserData()
    }, 5000)

    // Atualizar dados do Discord a cada 10 segundos (menos frequente)
    const discordInterval = setInterval(() => {
      fetchDiscordData()
    }, 10000)

    // Atualizar tempo atual a cada segundo (para progresso do Spotify)
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => {
      clearInterval(apiInterval)
      clearInterval(discordInterval)
      clearInterval(timeInterval)
    }
  }, [])

  // Manter perfil alternativo atualizado enquanto estiver visível
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isFlipped) {
      interval = setInterval(() => {
        fetchAlternateProfile(true)
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isFlipped])



  // Detectar quando a decoração é removida e animar
  useEffect(() => {
    if (!userData) return

    const currentDecoration = userData.avatarDecoration || null

    // Inicializar previousDecoration se ainda não foi definido
    if (previousDecoration === null && currentDecoration) {
      setPreviousDecoration(currentDecoration)
      return
    }

    if (previousDecoration && !currentDecoration) {
      // Decoração foi removida - iniciar animação de fechamento
      setIsDecorationClosing(true)
      const timer = setTimeout(() => {
        setIsDecorationClosing(false)
        setPreviousDecoration(null)
      }, 500) // Duração da animação (sincronizado com CSS)

      return () => clearTimeout(timer)
    } else if (currentDecoration && currentDecoration !== previousDecoration) {
      // Decoração existe ou mudou
      setIsDecorationClosing(false)
      setPreviousDecoration(currentDecoration)
    }
  }, [userData?.avatarDecoration, previousDecoration, userData])

  // Fechar modal do avatar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAvatarModal) {
        setAvatarModalClosing(true)
        setTimeout(() => {
          setShowAvatarModal(false)
          setAvatarModalClosing(false)
          setAvatarStartPosition(null)
        }, 400)
      }
    }

    if (showAvatarModal) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showAvatarModal])

  // Função para determinar a extensão do ícone do Discord
  const getDiscordIconUrl = (guildId: string, iconHash: string | null) => {
    if (!iconHash) return null

    // Se começa com "a_", é animado (gif), senão é estático (png)
    const extension = iconHash.startsWith('a_') ? 'gif' : 'png'
    return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${extension}?size=256`
  }

  // Mostrar silhueta enquanto carrega ou quando não tiver dados
  if (loading || !userData) {
    return (
      <div className={styles.page}>
        <div className={styles.viewCount}>
          <IconEye className={styles.eyeIcon} />
          <span key={viewCount}>{formatViewCount(viewCount)}</span>
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
                <div className={`${styles.avatar} ${styles.avatarSkeleton}`} />
              </div>
              <div className={styles.profileMeta}>
                <div className={styles.nameBlock}>
                  <div className={styles.skeletonLine} style={{ width: '60%', height: '20px', marginBottom: '8px' }} />
                  <div className={styles.skeletonLine} style={{ width: '40%', height: '14px' }} />
                </div>
                <div className={styles.badges} style={{ marginTop: '10px' }}>
                  <div className={styles.skeletonBadge} />
                  <div className={styles.skeletonBadge} />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconGlobe className={styles.sectionIcon} />
                <span>Redes Sociais</span>
                <div className={styles.sectionLine} />
              </div>
              <div className={styles.socialRow}>
                <div className={styles.skeletonSocialBtn} />
                <div className={styles.skeletonSocialBtn} />
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconMusic className={styles.sectionIcon} />
                <span>Ouvindo Spotify</span>
                <div className={styles.sectionLine} />
              </div>
              <div className={styles.spotifyTop}>
                <div className={`${styles.cover} ${styles.skeletonCover}`} />
                <div className={styles.track}>
                  <div className={styles.skeletonLine} style={{ width: '70%', height: '16px', marginBottom: '8px' }} />
                  <div className={styles.skeletonLine} style={{ width: '50%', height: '14px' }} />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }

  // TypeScript: garantir que userData não é null após a verificação acima
  if (!userData) {
    return null
  }

  // Usar perfil alternativo se estiver flipado e carregado
  const activeUserData = isFlipped && alternateUserData ? alternateUserData : userData

  const handleAvatarModalOpen = (e: React.MouseEvent<HTMLElement>, rect: DOMRect) => {
    setAvatarStartPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height })
    setShowAvatarModal(true)
    setAvatarModalClosing(false)
  }

  return (
    <div className={styles.page}>
      {/* Elemento de áudio para música de fundo */}
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* Volume Control */}
      <VolumeControl audioRef={audioRef} />

      {/* Tela de entrada */}
      {showEntrance && (
        <div
          className={`${styles.entrance} ${isEntranceClosing ? styles.entranceClosing : ''}`}
          onClick={handleEntranceClick}
          onMouseMove={handleEntranceMouseMove}
        >
          <h1 className={styles.entranceTitle}>click para entrar...</h1>
        </div>
      )}

      <div className={styles.viewCount}>
        <IconEye className={styles.eyeIcon} />
        <span key={viewCount}>{formatViewCount(viewCount)}</span>
      </div>

      <main className={styles.stack}>
        {/* Card principal (perfil + redes + spotify) */}
        <div
          className={styles.cardWrapper}
          ref={mainCard.ref}
          onMouseMove={mainCard.handleMouseMove}
          onMouseLeave={mainCard.handleMouseLeave}
          onClick={handleAvatarClick}
        >
          {/* Base Card (Novo perfil - Fundo) */}
          <ProfileCard
            user={activeUserData}
            currentTime={currentTime}
            onAvatarClick={handleAvatarModalOpen}
            valorantIcon={valorantIcon}
            previousDecoration={previousDecoration}
            isDecorationClosing={isDecorationClosing}
          />

          {/* Overlay Scan (Antigo perfil - Frente - Sendo removido) */}
          {isScanning && scanOverlayUser && (
            <>
              <div className={styles.scanOverlay}>
                <ProfileCard
                  user={scanOverlayUser}
                  currentTime={currentTime}
                  onAvatarClick={handleAvatarModalOpen}
                  valorantIcon={valorantIcon}
                  previousDecoration={previousDecoration}
                  isDecorationClosing={isDecorationClosing}
                  className={styles.noBorder}
                />
              </div>
            </>
          )}
        </div>

        {/* Card separado (Discord Server) */}
        {discordData && (
          <section
            className={styles.courtCard}
            ref={courtCard.ref}
            onMouseMove={courtCard.handleMouseMove}
            onMouseLeave={courtCard.handleMouseLeave}
          >
            <div
              className={`${styles.courtIcon} ${discordData.guild.icon ? styles.courtIconWithImage : ''}`}
              aria-hidden="true"
              style={discordData.guild.icon ? {
                backgroundImage: `url(${getDiscordIconUrl(discordData.guild.id, discordData.guild.icon)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent'
              } as React.CSSProperties : undefined}
            >
              {!discordData.guild.icon && <span className={styles.cbx}>CBX</span>}
            </div>

            <div className={styles.courtMeta}>
              <div className={styles.courtTitle}>
                {discordData.profile?.name || discordData.guild.name}
              </div>
              <div className={styles.courtStats}>
                <span className={styles.stat}>
                  <span className={styles.person} aria-hidden="true">
                    👤
                  </span>
                  {discordData.profile?.member_count
                    ? `${(discordData.profile.member_count / 1000).toFixed(1)}k`
                    : '0k'}
                </span>
                <span className={styles.stat}>
                  <span className={styles.dot} aria-hidden="true" />
                  {discordData.profile?.online_count
                    ? `${(discordData.profile.online_count / 1000).toFixed(1)}k online`
                    : '0k online'}
                </span>
              </div>
            </div>

            <a
              className={styles.arrow}
              href="https://discord.gg/h1t"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Entrar no servidor do Discord"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
            </a>
          </section>
        )}
      </main>

      {/* Modal do Avatar */}
      {showAvatarModal && avatarStartPosition && (
        <div
          className={`${styles.avatarModal} ${avatarModalClosing ? styles.avatarModalClosing : ''}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setAvatarModalClosing(true)
              setTimeout(() => {
                setShowAvatarModal(false)
                setAvatarModalClosing(false)
                setAvatarStartPosition(null)
              }, 400)
            }
          }}
        >
          <div className={styles.avatarModalContent}>
            <div
              className={`${styles.avatarModalImage} ${avatarModalClosing ? styles.avatarModalImageClosing : ''}`}
              style={{
                backgroundImage: `url(${activeUserData?.avatar})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                '--start-x': `${avatarStartPosition.x}px`,
                '--start-y': `${avatarStartPosition.y}px`,
                '--start-width': `${avatarStartPosition.width}px`,
                '--start-height': `${avatarStartPosition.height}px`
              } as React.CSSProperties}
            >
              <button
                className={`${styles.avatarModalBtn} ${styles.avatarModalBtnClose}`}
                onClick={() => {
                  setAvatarModalClosing(true)
                  setTimeout(() => {
                    setShowAvatarModal(false)
                    setAvatarModalClosing(false)
                    setAvatarStartPosition(null)
                  }, 400)
                }}
                aria-label="Fechar"
              >
                <IconX />
              </button>
              <button
                className={`${styles.avatarModalBtn} ${styles.avatarModalBtnDownload} ${downloadSuccess ? styles.downloadSuccess : ''}`}
                onClick={async () => {
                  if (activeUserData?.avatar && !downloadSuccess) {
                    try {
                      // Baixar a imagem via fetch para contornar CORS
                      const response = await fetch(activeUserData.avatar)
                      const blob = await response.blob()
                      const url = window.URL.createObjectURL(blob)

                      // Criar link de download
                      const link = document.createElement('a')
                      link.href = url
                      link.download = `avatar-${activeUserData.id}.png`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)

                      // Liberar o objeto URL
                      window.URL.revokeObjectURL(url)

                      // Mostrar animação de sucesso
                      setDownloadSuccess(true)
                      setTimeout(() => {
                        setDownloadSuccess(false)
                      }, 2000)
                    } catch (error) {
                      console.error('Erro ao baixar avatar:', error)
                      // Fallback: abrir em nova aba
                      window.open(activeUserData.avatar, '_blank')
                    }
                  }
                }}
                aria-label="Baixar avatar"
              >
                {downloadSuccess ? <IconCheck /> : <IconDownload />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
