import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Contador global compartilhado
// NOTA: Em produção com múltiplas instâncias serverless, considere usar:
// - Upstash Redis (gratuito): https://upstash.com
// - Vercel KV (se usar Vercel)
// - Um banco de dados simples
let globalViewCount = 6758

export async function GET() {
  return NextResponse.json({ count: globalViewCount })
}

export async function POST() {
  globalViewCount += 1
  
  return NextResponse.json({ 
    count: globalViewCount, 
    success: true 
  })
}
