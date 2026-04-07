import { NextResponse } from 'next/server'
import { buscarDadosNaWyzBots } from '@/lib/api-client'

export async function GET() {
    try {
        const dados = await buscarDadosNaWyzBots('/thauan')
        
        return NextResponse.json(dados, {
            status: 200,
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'access-control-allow-origin': '*',
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


