import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Quando DevTools se conecta a pagina, Chrome/Brave faz esse request automaticamente.
  // Interceptamos e setamos um cookie para o JS do cliente detectar.
  if (request.nextUrl.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
    const response = NextResponse.json({}, { status: 404 })
    response.cookies.set('_dt', '1', {
      maxAge: 60,
      path: '/',
      httpOnly: false, // JS precisa ler esse cookie
      sameSite: 'lax',
    })
    return response
  }

  // Se o cookie _dt existe em qualquer request de pagina, redireciona
  if (request.cookies.get('_dt')?.value === '1') {
    // Nao redirecionar requests de API, assets, etc
    const isPageRequest =
      !request.nextUrl.pathname.startsWith('/api/') &&
      !request.nextUrl.pathname.startsWith('/_next/') &&
      !request.nextUrl.pathname.startsWith('/favicon') &&
      !request.nextUrl.pathname.includes('.')

    if (isPageRequest) {
      // Limpa o cookie e redireciona
      const response = NextResponse.redirect('https://www.horariodebrasilia.org/')
      response.cookies.delete('_dt')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
  ],
}
