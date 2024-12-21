// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // プリフライトリクエストへの対応
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
                'Access-Control-Max-Age': '86400',
                'Access-Control-Allow-Headers': '*',
                'Vary': 'Access-Control-Request-Headers',
                'Content-Length': '0',
            },
        })
        return response
    }

    // 実際のリクエストのレスポンスヘッダーを設定
    const response = NextResponse.next()

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', '*')

    return response
}

// このミドルウェアを適用するパスを指定
export const config = {
    matcher: ['/api/oauth/token', '/oauth/token']  // あなたのAPIエンドポイントのパスに合わせて変更してください
}