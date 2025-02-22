/*
 * For more info see
 * https://nextjs.org/docs/app/building-your-application/routing/internationalization
 * */
import { type NextRequest, NextResponse } from 'next/server'

import Negotiator from 'negotiator'
import linguiConfig from '../lingui.config'

const { locales } = linguiConfig

/**
 * Middleware function to handle locale-based redirection in the incoming
 * request URL. It checks if the URL path includes a valid locale, if not, it
 * redirects to a URL with the default locale.
 *
 * @param request - The incoming HTTP request object.
 * @returns - Returns a redirection response if the URL path lacks a locale,
 *   otherwise returns undefined.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getRequestLocale(request.headers)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl)
}

/**
 * Determines the locale from the given request headers.
 *
 * @param requestHeaders - The headers from the incoming request.
 * @returns The locale determined from the request headers, or a default locale
 *   if none is found.
 */
function getRequestLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get('accept-language') || undefined
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader },
  }).languages([...locales])

  const activeLocale = languages[0] || locales[0] || 'en'

  return activeLocale
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */

    '/((?!_next/static|_next/image|favicon.ico|api|subgraphs|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
