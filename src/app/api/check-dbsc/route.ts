import { NextRequest, NextResponse } from "next/server";

export function POST(req: NextRequest) {
    console.log(req.headers)
    console.log(req.headers.get('Origin-Trial'))
    return NextResponse.json({})
}