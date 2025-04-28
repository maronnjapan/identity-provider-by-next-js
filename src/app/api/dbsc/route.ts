import { NextResponse } from "next/server";

export function GET() {

    return NextResponse.json({}, {
        headers: {
            "Sec-Session-Registration": '(ES256 RS256); path="/api/dbsc-check"',
            "Set-Cookie": "auth_cookie=session_id2; max-age=2592000; Domain=identity-provider-by-next-js.vercel.app; SameSite=Lax; ",
        }
    })
}