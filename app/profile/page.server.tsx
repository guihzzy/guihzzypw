import { buscarDadosNaWyzBots } from '@/lib/api-client'
import ProfileClient from './ProfileClient'

// Esta é uma Server Component - roda 100% no servidor da Vercel
export default async function ProfilePage() {
  // Buscar dados no servidor (o cliente nunca vê essa requisição)
  const dados = await buscarDadosNaWyzBots('/guih')
  
  // Extrair dados do usuário (pode vir em data ou user dependendo do endpoint)
  const userData = dados.data || dados.user || dados

  // Renderizar o componente client com os dados iniciais
  return (
    <ProfileClient 
      initialData={userData} 
      endpoint="/api/users/profile/408002057522380801"
    />
  )
}

// Revalidar a cada 30 segundos (ISR - Incremental Static Regeneration)
export const revalidate = 30
