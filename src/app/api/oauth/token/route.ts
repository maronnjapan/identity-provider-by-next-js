import { postOauthToken, PostOauthTokenBody } from "@/apis";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const bodyText = await request.text()
    const bodyList = bodyText.split('&').map(item => item.split(/=(.+)/, 2))

    const body = bodyList.reduce((acc, [key, value]) => {
        return { ...acc, [key]: value }
    }, {} as PostOauthTokenBody)

    const res = await postOauthToken(body)

    console.log(res.data)

    return NextResponse.json({ ...res.data }, {
        status: 200, headers: {
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Content-Type': 'application/json',
        }
    })
}
