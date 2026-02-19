import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
    const upstreamUrl = `https://api.ghystsystem.com.br/thauan`

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
            // Repassar status 500 (rate limit) diretamente
            if (res.status === 500) {
                return NextResponse.json(
                    { success: false, error: `Rate limit: Upstream returned ${res.status}` },
                    { status: 500 }
                )
            }
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

        return NextResponse.json(
            { success: false, error: 'Failed to fetch upstream' },
            { status: 502 }
        )
    }
}


