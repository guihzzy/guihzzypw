'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './page.module.css'
import robloxIcon from '../assets/roblox.png'
import valorantIcon from '../assets/valorant.png'
import beamngIcon from '../assets/BeamNG.drive.png'

// Tipos da API
interface SpotifyData {
  nome: string
  id: string | null
  tipo: number
  detalhe: string
  state: string
  emoji: string | null
  sync: string
  timestamps: {
    start: string
    end: string
  }
  assets: {
    grande: string
    pequena: string
    large_text: string
    small_text: string | null
  }
  buttons: any[]
  inicio: number
}

interface UltimaMusica {
  musica: string
  artista: string
  album_art: string
  started_at: string
  saved_at: number
  formatted_time: string
}

interface Badge {
  name: string
  url: string
  popup: string
}

interface UserStatus {
  status: string
  img: string
}

interface OutraAtividade {
  nome: string
  id: string
  tipo: string | null
  detalhe: string | null
  state: string | null
  emoji: string | null
  sync: string | null
  timestamps: {
    start: string
    end: string | null
  }
  assets: {
    grande: string | null
    pequena: string | null
    large_text: string | null
    small_text: string | null
  }
  buttons: any[]
  inicio: number
}

interface User {
  username: string
  global_name: string | null
  avatar: string
  avatarDecoration: string | null
  badges: Badge[]
  spotify: SpotifyData | null
  ultima_musica: UltimaMusica | null
  user_status: UserStatus | null
  outras_atividades: OutraAtividade[] | null
}

interface ApiResponse {
  user: User
  message: string
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

function IconExternalLink(props: { className?: string }) {
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
      <path d="M14 3h7v7" />
      <path d="M10 14L21 3" />
      <path d="M21 14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
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
      fill="#000000"
      aria-hidden="true"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <defs>
          <radialGradient id="0" cx="332.14" cy="2511.81" r="3263.54" gradientUnits="userSpaceOnUse">
            <stop offset=".09" stopColor="#fa8f21"></stop>
            <stop offset=".78" stopColor="#d82d7e"></stop>
          </radialGradient>
          <radialGradient id="1" cx="1516.14" cy="2623.81" r="2572.12" gradientUnits="userSpaceOnUse">
            <stop offset=".64" stopColor="#8c3aaa" stopOpacity="0"></stop>
            <stop offset="1" stopColor="#8c3aaa"></stop>
          </radialGradient>
        </defs>
        <path d="M833.4,1250c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7S833.4,1480.11,833.4,1250m-225.26,0c0,354.5,287.36,641.86,641.86,641.86S1891.86,1604.5,1891.86,1250,1604.5,608.14,1250,608.14,608.14,895.5,608.14,1250M1767.27,582.69a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M745,2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27s373.28,1.31,505.15,7.27c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M734.65,7.57c-133.07,6.06-224,27.16-303.41,58.06C349,97.54,279.38,140.35,209.81,209.81S97.54,349,65.63,431.24c-30.9,79.46-52,170.34-58.06,303.41C1.41,867.93,0,910.54,0,1250s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43S349,2402.37,431.24,2434.37c79.56,30.9,170.34,52,303.41,58.06C868,2498.49,910.54,2500,1250,2500s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95,97.54,2068.86,65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17,1.51,1589.56,0,1250.1,0S868,1.41,734.65,7.57" fill="url(#0)"></path>
        <path d="M833.4,1250c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7S833.4,1480.11,833.4,1250m-225.26,0c0,354.5,287.36,641.86,641.86,641.86S1891.86,1604.5,1891.86,1250,1604.5,608.14,1250,608.14,608.14,895.5,608.14,1250M1767.27,582.69a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M745,2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27s373.28,1.31,505.15,7.27c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M734.65,7.57c-133.07,6.06-224,27.16-303.41,58.06C349,97.54,279.38,140.35,209.81,209.81S97.54,349,65.63,431.24c-30.9,79.46-52,170.34-58.06,303.41C1.41,867.93,0,910.54,0,1250s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43S349,2402.37,431.24,2434.37c79.56,30.9,170.34,52,303.41,58.06C868,2498.49,910.54,2500,1250,2500s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95,97.54,2068.86,65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17,1.51,1589.56,0,1250.1,0S868,1.41,734.65,7.57" fill="url(#1)"></path>
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M8.45095 19.7926C8.60723 18.4987 9.1379 17.7743 10.1379 17.0317C11.5688 16.0259 13.3561 16.5948 13.3561 16.5948V13.2197C13.7907 13.2085 14.2254 13.2343 14.6551 13.2966V17.6401C14.6551 17.6401 12.8683 17.0712 11.4375 18.0775C10.438 18.8196 9.90623 19.5446 9.7505 20.8385C9.74562 21.5411 9.87747 22.4595 10.4847 23.2536C10.3345 23.1766 10.1815 23.0889 10.0256 22.9905C8.68807 22.0923 8.44444 20.7449 8.45095 19.7926ZM22.0352 6.97898C21.0509 5.90039 20.6786 4.81139 20.5441 4.04639H21.7823C21.7823 4.04639 21.5354 6.05224 23.3347 8.02482L23.3597 8.05134C22.8747 7.7463 22.43 7.38624 22.0352 6.97898ZM28 10.0369V14.293C28 14.293 26.42 14.2312 25.2507 13.9337C23.6179 13.5176 22.5685 12.8795 22.5685 12.8795C22.5685 12.8795 21.8436 12.4245 21.785 12.3928V21.1817C21.785 21.6711 21.651 22.8932 21.2424 23.9125C20.709 25.246 19.8859 26.1212 19.7345 26.3001C19.7345 26.3001 18.7334 27.4832 16.9672 28.28C15.3752 28.9987 13.9774 28.9805 13.5596 28.9987C13.5596 28.9987 11.1434 29.0944 8.96915 27.6814C8.49898 27.3699 8.06011 27.0172 7.6582 26.6277L7.66906 26.6355C9.84383 28.0485 12.2595 27.9528 12.2595 27.9528C12.6779 27.9346 14.0756 27.9528 15.6671 27.2341C17.4317 26.4374 18.4344 25.2543 18.4344 25.2543C18.5842 25.0754 19.4111 24.2001 19.9423 22.8662C20.3498 21.8474 20.4849 20.6247 20.4849 20.1354V11.3475C20.5435 11.3797 21.2679 11.8347 21.2679 11.8347C21.2679 11.8347 22.3179 12.4734 23.9506 12.8889C25.1204 13.1864 26.7 13.2483 26.7 13.2483V9.91314C27.2404 10.0343 27.7011 10.0671 28 10.0369Z" fill="#EE1D52"></path>
        <path d="M26.7009 9.91314V13.2472C26.7009 13.2472 25.1213 13.1853 23.9515 12.8879C22.3188 12.4718 21.2688 11.8337 21.2688 11.8337C21.2688 11.8337 20.5444 11.3787 20.4858 11.3464V20.1364C20.4858 20.6258 20.3518 21.8484 19.9432 22.8672C19.4098 24.2012 18.5867 25.0764 18.4353 25.2553C18.4353 25.2553 17.4337 26.4384 15.668 27.2352C14.0765 27.9539 12.6788 27.9357 12.2604 27.9539C12.2604 27.9539 9.84473 28.0496 7.66995 26.6366L7.6591 26.6288C7.42949 26.4064 7.21336 26.1717 7.01177 25.9257C6.31777 25.0795 5.89237 24.0789 5.78547 23.7934C5.78529 23.7922 5.78529 23.791 5.78547 23.7898C5.61347 23.2937 5.25209 22.1022 5.30147 20.9482C5.38883 18.9122 6.10507 17.6625 6.29444 17.3494C6.79597 16.4957 7.44828 15.7318 8.22233 15.0919C8.90538 14.5396 9.6796 14.1002 10.5132 13.7917C11.4144 13.4295 12.3794 13.2353 13.3565 13.2197V16.5948C13.3565 16.5948 11.5691 16.028 10.1388 17.0317C9.13879 17.7743 8.60812 18.4987 8.45185 19.7926C8.44534 20.7449 8.68897 22.0923 10.0254 22.991C10.1813 23.0898 10.3343 23.1775 10.4845 23.2541C10.7179 23.5576 11.0021 23.8221 11.3255 24.0368C12.631 24.8632 13.7249 24.9209 15.1238 24.3842C16.0565 24.0254 16.7586 23.2167 17.0842 22.3206C17.2888 21.7611 17.2861 21.1978 17.2861 20.6154V4.04639H20.5417C20.6763 4.81139 21.0485 5.90039 22.0328 6.97898C22.4276 7.38624 22.8724 7.7463 23.3573 8.05134C23.5006 8.19955 24.2331 8.93231 25.1734 9.38216C25.6596 9.61469 26.1722 9.79285 26.7009 9.91314Z" fill="#FFFFFF"></path>
        <path d="M4.48926 22.7568V22.7594L4.57004 22.9784C4.56076 22.9529 4.53074 22.8754 4.48926 22.7568Z" fill="#69C9D0"></path>
        <path d="M10.5128 13.7916C9.67919 14.1002 8.90498 14.5396 8.22192 15.0918C7.44763 15.7332 6.79548 16.4987 6.29458 17.354C6.10521 17.6661 5.38897 18.9168 5.30161 20.9528C5.25223 22.1068 5.61361 23.2983 5.78561 23.7944C5.78543 23.7956 5.78543 23.7968 5.78561 23.798C5.89413 24.081 6.31791 25.0815 7.01191 25.9303C7.2135 26.1763 7.42963 26.4111 7.65924 26.6334C6.92357 26.1457 6.26746 25.5562 5.71236 24.8839C5.02433 24.0451 4.60001 23.0549 4.48932 22.7626C4.48919 22.7605 4.48919 22.7584 4.48932 22.7564V22.7527C4.31677 22.2571 3.95431 21.0651 4.00477 19.9096C4.09213 17.8736 4.80838 16.6239 4.99775 16.3108C5.4985 15.4553 6.15067 14.6898 6.92509 14.0486C7.608 13.4961 8.38225 13.0567 9.21598 12.7484C9.73602 12.5416 10.2778 12.3891 10.8319 12.2934C11.6669 12.1537 12.5198 12.1415 13.3588 12.2575V13.2196C12.3808 13.2349 11.4148 13.4291 10.5128 13.7916Z" fill="#69C9D0"></path>
        <path d="M20.5438 4.04635H17.2881V20.6159C17.2881 21.1983 17.2881 21.76 17.0863 22.3211C16.7575 23.2167 16.058 24.0253 15.1258 24.3842C13.7265 24.923 12.6326 24.8632 11.3276 24.0368C11.0036 23.823 10.7187 23.5594 10.4844 23.2567C11.5962 23.8251 12.5913 23.8152 13.8241 23.341C14.7558 22.9821 15.4563 22.1734 15.784 21.2774C15.9891 20.7178 15.9864 20.1546 15.9864 19.5726V3H20.4819C20.4819 3 20.4315 3.41188 20.5438 4.04635ZM26.7002 8.99104V9.9131C26.1725 9.79263 25.6609 9.61447 25.1755 9.38213C24.2352 8.93228 23.5026 8.19952 23.3594 8.0513C23.5256 8.1559 23.6981 8.25106 23.8759 8.33629C25.0192 8.88339 26.1451 9.04669 26.7002 8.99104Z" fill="#69C9D0"></path>
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

export default function Profile() {
  const mainCard = useMouseGlow()
  const courtCard = useMouseGlow()
  const [userData, setUserData] = useState<User | null>(null)
  const [discordData, setDiscordData] = useState<DiscordInviteResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [viewCount, setViewCount] = useState(0) // Valor inicial resetado
  const [isActivityClosing, setIsActivityClosing] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const [isDecorationClosing, setIsDecorationClosing] = useState(false)
  const [previousDecoration, setPreviousDecoration] = useState<string | null>(null)

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://api.brunno.pw/api/guih')
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário')
      }
      const data: ApiResponse = await response.json()
      setUserData(data.user)
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
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

  useEffect(() => {
    // Resetar contador (zerar)
    localStorage.removeItem('viewCount')
    setViewCount(0)

    // Incrementar contador de visualizações toda vez que alguém entrar no site
    const incrementViewCount = () => {
      const stored = localStorage.getItem('viewCount')
      const currentCount = stored ? parseInt(stored, 10) : 0
      const newCount = currentCount + 1
      localStorage.setItem('viewCount', newCount.toString())
      setViewCount(newCount)
    }

    // Sempre incrementa quando a página carrega
    incrementViewCount()

    fetchUserData()
    fetchDiscordData()

    // Atualizar dados da API a cada 3 segundos
    const apiInterval = setInterval(() => {
      fetchUserData()
    }, 3000)

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

  // Detectar quando para de jogar e animar
  useEffect(() => {
    const temAtividadesAtivas = userData?.outras_atividades?.some(a => isPlayingNow(a)) || false

    if (temAtividadesAtivas) {
      setShowActivity(true)
      setIsActivityClosing(false)
    } else if (showActivity && !temAtividadesAtivas) {
      // Estava jogando e parou - iniciar animação de fechamento
      setIsActivityClosing(true)
      const timer = setTimeout(() => {
        setShowActivity(false)
        setIsActivityClosing(false)
      }, 400) // Duração da animação (sincronizado com CSS)

      return () => clearTimeout(timer)
    }
  }, [userData?.outras_atividades, showActivity])

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


  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          Carregando...
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          Erro ao carregar perfil
        </div>
      </div>
    )
  }

  const displayName = userData.global_name || userData.username
  const isPlaying = !!userData.spotify
  const spotifyData = userData.spotify || userData.ultima_musica
  const albumArt = spotifyData
    ? (userData.spotify?.assets?.grande || userData.ultima_musica?.album_art)
    : null
  const trackTitle = spotifyData
    ? (userData.spotify?.detalhe || userData.ultima_musica?.musica)
    : null
  const trackArtist = spotifyData
    ? (userData.spotify?.state || userData.ultima_musica?.artista)
    : null

  // Calcular progresso do Spotify se tiver timestamps
  const getProgress = () => {
    if (!userData.spotify?.timestamps) return 0
    const start = new Date(userData.spotify.timestamps.start).getTime()
    const end = new Date(userData.spotify.timestamps.end).getTime()
    const now = currentTime
    if (now >= end) return 100
    const progress = ((now - start) / (end - start)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    if (!userData.spotify?.timestamps) return '0:00'
    const start = new Date(userData.spotify.timestamps.start).getTime()
    const end = new Date(userData.spotify.timestamps.end).getTime()
    const duration = (end - start) / 1000
    return formatTime(duration)
  }

  const getCurrentTime = () => {
    if (!userData.spotify?.timestamps) return '0:00'
    const start = new Date(userData.spotify.timestamps.start).getTime()
    const now = currentTime
    const end = new Date(userData.spotify.timestamps.end).getTime()
    const elapsed = Math.min((now - start) / 1000, (end - start) / 1000)
    return formatTime(Math.max(0, elapsed))
  }

  // Calcular tempo de jogo
  const getPlayingTime = (atividade: OutraAtividade) => {
    if (!atividade.timestamps?.start) return null
    const start = new Date(atividade.timestamps.start).getTime()
    const now = currentTime
    const elapsed = Math.floor((now - start) / 1000) // segundos

    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Verificar se está jogando agora (timestamps.end é null)
  const isPlayingNow = (atividade: OutraAtividade) => {
    return atividade.timestamps?.end === null
  }

  // Mapear nome da atividade para imagem local
  const getActivityIcon = (nome: string): string | null => {
    const nomeLower = nome.toLowerCase()
    const iconMap: Record<string, any> = {
      'roblox': robloxIcon,
      'valorant': valorantIcon,
      'beamng.drive': beamngIcon
    }
    const icon = iconMap[nomeLower]
    if (!icon) return null

    // Se for string, retorna direto
    if (typeof icon === 'string') {
      return icon
    }

    // Se for objeto, tenta .src ou .default
    if (typeof icon === 'object') {
      return (icon as any).src || (icon as any).default || null
    }

    return null
  }

  // Função para determinar a extensão do ícone do Discord
  const getDiscordIconUrl = (guildId: string, iconHash: string | null) => {
    if (!iconHash) return null

    // Se começa com "a_", é animado (gif), senão é estático (png)
    const extension = iconHash.startsWith('a_') ? 'gif' : 'png'
    return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${extension}?size=256`
  }

  return (
    <div className={styles.page}>
      <div className={styles.viewCount}>
        <IconEye className={styles.eyeIcon} />
        <span key={viewCount}>{formatViewCount(viewCount)}</span>
      </div>

      <main className={styles.stack}>
        {/* Card principal (perfil + redes + spotify) */}
        <section
          className={styles.card}
          ref={mainCard.ref}
          onMouseMove={mainCard.handleMouseMove}
          onMouseLeave={mainCard.handleMouseLeave}
        >
          <button className={styles.cornerAction} aria-label="Abrir perfil em nova aba" type="button">
            <IconExternalLink />
          </button>

          <div className={styles.profileRow}>
            <div className={styles.avatarWrapper}>
              <div
                key={userData.avatar}
                className={styles.avatar}
                style={{
                  backgroundImage: `url(${userData.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'grayscale(0%)'
                }}
              />
              {(userData.avatarDecoration || (isDecorationClosing && previousDecoration)) && (
                <img
                  key={userData.avatarDecoration || previousDecoration}
                  src={userData.avatarDecoration || previousDecoration || ''}
                  alt="Avatar decoration"
                  className={`${styles.avatarDecoration} ${isDecorationClosing ? styles.avatarDecorationClosing : ''}`}
                />
              )}
              {userData.user_status && (
                <div
                  key={`${userData.user_status.status}-${userData.user_status.img}`}
                  className={styles.statusIndicator}
                >
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

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconGlobe className={styles.sectionIcon} />
              <span>Redes Sociais</span>
              <div className={styles.sectionLine} />
            </div>

            <div className={styles.socialRow}>
              <a className={`${styles.socialBtn} ${styles.ig}`} href="#" aria-label="Instagram">
                <IconInstagram />
              </a>
              <a className={`${styles.socialBtn} ${styles.tt}`} href="https://www.tiktok.com/@isttolls?_r=1&_t=ZS-92bkwqhv0PH" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <IconTikTok />
              </a>
              <a className={`${styles.socialBtn} ${styles.sp}`} href="#" aria-label="Spotify">
                <IconSpotify />
              </a>
            </div>
          </div>

          {showActivity && (
            <div className={`${styles.section} ${isActivityClosing ? styles.sectionClosing : ''}`}>
              <div className={styles.sectionHeader}>
                <IconGamepad className={styles.sectionIcon} />
                <span>Jogando</span>
                <div className={styles.sectionLine} />
                <span className={styles.livePill}>
                  <span className={styles.liveDot}>•</span> Jogando agora
                </span>
              </div>

              <div className={styles.activitiesRow}>
                {userData?.outras_atividades?.filter(a => isPlayingNow(a)).map((atividade, index) => {
                  const playingTime = getPlayingTime(atividade)
                  const localIcon = getActivityIcon(atividade.nome)
                  const apiIconUrl = atividade.assets?.grande || atividade.assets?.pequena
                  const iconSrc = localIcon || apiIconUrl

                  return (
                    <div key={`${atividade.nome}-${atividade.timestamps?.start}`} className={styles.activityItem}>
                      {iconSrc ? (
                        <img
                          key={iconSrc}
                          src={iconSrc}
                          alt={atividade.nome}
                          className={styles.activityIconImage}
                        />
                      ) : (
                        <div className={styles.activityIcon}>
                          <IconGamepad className={styles.activityDefaultIcon} />
                        </div>
                      )}
                      <div className={styles.activityInfo}>
                        <div key={atividade.nome} className={styles.activityName}>{atividade.nome}</div>
                        {playingTime && (
                          <div key={currentTime} className={styles.activityTime}>Jogando há {playingTime}</div>
                        )}
                        {atividade.assets?.large_text && (
                          <div className={styles.activityDetail}>{atividade.assets.large_text}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {spotifyData && trackTitle && (
            <div
              key={`${isPlaying ? 'playing' : 'last'}-${trackTitle}`}
              className={styles.section}
            >
              <div className={styles.sectionHeader}>
                <IconMusic className={styles.sectionIcon} />
                <span key={isPlaying ? 'playing' : 'last'} className={styles.sectionTitle}>
                  {isPlaying ? 'Ouvindo Spotify' : 'Última música'}
                </span>
                <div className={styles.sectionLine} />
                {isPlaying && (
                  <span className={styles.livePill}>
                    <span className={styles.liveDot}>•</span> Ao vivo
                  </span>
                )}
                {!isPlaying && userData.ultima_musica?.formatted_time && (
                  <span className={styles.lastPlayedTime}>
                    {userData.ultima_musica.formatted_time}
                  </span>
                )}
              </div>

              <div className={styles.spotifyTop}>
                <div
                  key={albumArt || 'no-art'}
                  className={styles.cover}
                  aria-hidden="true"
                  style={{
                    backgroundImage: albumArt ? `url(${albumArt})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className={styles.track}>
                  <div key={trackTitle} className={styles.trackTitle}>{trackTitle}</div>
                  <div key={trackArtist} className={styles.trackArtist}>{trackArtist}</div>
                </div>
              </div>

              {isPlaying ? (
                <div className={styles.spotifyBottom}>
                  <div className={styles.timeRow}>
                    <span>{getCurrentTime()}</span>
                    <span>{getTotalDuration()}</span>
                  </div>
                  <div className={styles.bar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${getProgress()}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.lastPlayedInfo}>
                  <IconClock className={styles.clockIcon} />
                  <span>Reproduzida via Spotify</span>
                </div>
              )}
            </div>
          )}
        </section>

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

            <div className={styles.arrow} aria-hidden="true">
              →
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

