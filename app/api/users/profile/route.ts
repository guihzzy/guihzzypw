import { NextResponse } from 'next/server'
import { buscarDadosNaWyzBots } from '@/lib/api-client'

export async function GET(req: Request) {
    // Verificar autenticação interna
    const referer = req.headers.get('referer')
    const host = req.headers.get('host')
    const internalAuth = req.headers.get('x-internal-auth')
    
    // Permitir apenas requisições internas ou do próprio domínio
    const isInternalRequest = internalAuth === 'internal-request'
    const isSameDomain = referer && host && referer.includes(host)
    
    if (!isInternalRequest && !isSameDomain) {
        return NextResponse.json(
            { success: false, error: 'Acesso não autorizado' },
            { status: 403 }
        )
    }

    try {
        const dados = await buscarDadosNaWyzBots('/thauan')
        
        return NextResponse.json(dados, {
            status: 200,
            headers: {
                'content-type': 'application/json; charset=utf-8',
            },
        })
    } catch (err: any) {
        console.error('Erro ao buscar dados:', err.message || err)

        return NextResponse.json(
            { success: false, error: 'Failed to fetch data' },
            { status: 502 }
        )
    }
}


