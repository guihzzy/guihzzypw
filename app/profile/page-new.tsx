import { buscarDadosNaWyzBots } from '@/lib/api-client'
import ProfileContent from './ProfileContent'

// Server Component - roda no servidor da Vercel
export default async function ProfilePage() {
  // Buscar dados no servidor (cliente nunca vê essa requisição)
  let userData = null
  
  try {
    const dados = await buscarDadosNaWyzBots('/guih')
    userData = dados.data || dados.user || dados
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    // Dados de fallback
    userData = {
      username: "guihzzy",
      global_name: "guih",
      avatar: "https://cdn.discordapp.com/avatars/408002057522380801/a_d5efa99b3eeaa7dd43acca82f5692432.gif?size=1024",
      avatarDecoration: null,
      badges: [],
      spotify: null,
      ultima_musica: null,
      user_status: {
        status: "online",
        img: "https://cdn.discordapp.com/emojis/749221433552404581.png"
      },
      outras_atividades: null
    }
  }

  // Renderizar componente client com dados pré-carregados
  return <ProfileContent initialData={userData} />
}

// Revalidar a cada 10 segundos (ISR)
export const revalidate = 10
