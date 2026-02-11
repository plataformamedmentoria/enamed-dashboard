import { NextRequest, NextResponse } from 'next/server';

// Mapa subdomínio → ID da escola
const SUBDOMAIN_MAP: Record<string, string> = {
  'unimar': 'unimar',
  'unifaa': 'unifaa',
  'integrado': 'integrado',
  'multivix-vitoria': 'multivix_vitoria',
  'multivix-cachoeiro': 'multivix_cachoeiro',
  'slmandic-araras': 'slmandic_araras',
  'slmandic-campinas': 'slmandic_campinas',
  'facene-rn': 'facene_rn',
  'enamed-5': 'enamed_5',
  'unifoa': 'unifoa',
};

// Domínios base (sem subdomínio = admin)
const BASE_DOMAINS = [
  'enamed.sprmed.com.br',
  'localhost:3000',
];

function getSubdomain(host: string): string | null {
  // Remove porta se houver
  const hostname = host.split(':')[0];

  // Vercel preview URLs: ignorar
  if (hostname.endsWith('.vercel.app')) {
    return null;
  }

  // Checa se é subdomínio de enamed.sprmed.com.br
  const baseDomain = 'enamed.sprmed.com.br';
  if (hostname.endsWith(baseDomain) && hostname !== baseDomain) {
    const sub = hostname.replace(`.${baseDomain}`, '');
    return sub;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const subdomain = getSubdomain(host);

  if (!subdomain) {
    // Sem subdomínio = acesso normal (admin ou Vercel preview)
    return NextResponse.next();
  }

  const escolaId = SUBDOMAIN_MAP[subdomain];

  if (!escolaId) {
    // Subdomínio inválido → 404
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  const url = request.nextUrl.clone();

  // Se está na home, redireciona pro dashboard da escola
  if (url.pathname === '/') {
    url.pathname = `/escola/${escolaId}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-escola-subdomain', escolaId);
    return response;
  }

  // Se está tentando acessar outra escola, bloqueia
  if (url.pathname.startsWith('/escola/')) {
    const requestedId = url.pathname.split('/escola/')[1]?.split('/')[0];
    if (requestedId && requestedId !== escolaId && requestedId !== 'brasil_todos' && requestedId !== 'brasil_concluintes') {
      url.pathname = `/escola/${escolaId}`;
      const response = NextResponse.redirect(url);
      return response;
    }
  }

  // Passa o subdomínio como header pra esconder navegação
  const response = NextResponse.next();
  response.headers.set('x-escola-subdomain', escolaId);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|data/).*)'],
};
