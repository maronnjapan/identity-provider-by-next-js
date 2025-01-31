import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()


    // セキュリティヘッダーを完全に緩和
    response.headers.set('Content-Security-Policy', '')
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    response.headers.set('Access-Control-Allow-Headers', '*')

    return response
}

export const config = {
    matcher: '/:path*',
}