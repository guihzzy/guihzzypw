import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params

    // Usar endpoint correto baseado no ID
    const endpoint = id === '614547076617076738' ? 'xxx' : 'guih'
    const upstreamUrl = `http://api.wyzbots.com.br/${endpoint}`

    // Criar AbortController para timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos de timeout

    console.log(`Tentando conectar com: ${upstreamUrl}`)

    try {
        const res = await fetch(upstreamUrl, {
            // evita cache do Next/edge para refletir presença/spotify rápido
            cache: 'no-store',
            headers: {
                accept: 'application/json',
                'User-Agent': 'site-profile/1.0',
            },
            signal: controller.signal,
        })

        console.log(`Resposta recebida: ${res.status} ${res.statusText}`)

        clearTimeout(timeoutId)

        // Se a resposta não for OK, tratar como erro
        if (!res.ok) {
            return NextResponse.json(
                { success: false, error: `Upstream returned ${res.status}` },
                { status: res.status >= 500 ? 502 : res.status }
            )
        }

        let data = await res.json()

        // Função para formatar a URL do avatar do Discord
        const formatAvatarUrl = (url: string) => {
            if (typeof url !== 'string') return url
            if (url.includes('cdn.discordapp.com/avatars/') && url.includes('/a_')) {
                // Se o hash começa com a_, é animado. Troca .webp/.png por .gif
                return url.replace(/\.(webp|png|jpg|jpeg)(\?|$)/, '.gif$2')
            }
            return url
        }

        // Aplicar formatação se os dados forem do perfil
        if (data && data.data && data.data.avatar) {
            data.data.avatar = formatAvatarUrl(data.data.avatar)
        } else if (data && data.user && data.user.avatar) {
            // Caso o formato varie dependendo do endpoint
            data.user.avatar = formatAvatarUrl(data.user.avatar)
        }

        // repassa status e conteúdo (json) do upstream
        return NextResponse.json(data, {
            status: res.status,
            headers: {
                'access-control-allow-origin': '*',
            },
        })
    } catch (err: any) {
        clearTimeout(timeoutId)

        console.error('Proxy error:', err.message || err)

        // Retornar dados mockados em caso de qualquer erro de conexão
        // Isso evita que o site quebre quando a API externa está offline
        const mockData = {
            success: true,
            data: {
                username: "guihzzy",
                global_name: "guih",
                id: "408002057522380801",
                avatar: "https://cdn.discordapp.com/avatars/408002057522380801/a_d5efa99b3eeaa7dd43acca82f5692432.gif?size=1024",
                user_status: {
                    status: "online",
                    img: "https://cdn.discordapp.com/emojis/749221433552404581.png"
                },
                spotify: null,
                ultima_musica_spotify: null,
                outras_atividades: null,
                badges: []
            },
            timestamp: new Date().toISOString()
        }

        return NextResponse.json(mockData, { status: 200 })
    }
}




