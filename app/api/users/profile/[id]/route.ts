import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  // Usar endpoint correto baseado no ID
  const endpoint = id === '614547076617076738' ? 'xxx' : 'guih'
  const upstreamUrl = `http://api.ghystsystem.com.br/${endpoint}`

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

    const text = await res.text()

    // repassa status e conteúdo (json) do upstream
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json; charset=utf-8',
        // útil se alguém consumir essa rota externamente também
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




