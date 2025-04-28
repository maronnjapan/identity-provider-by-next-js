'use client';

import { PublicKeyCredentialCreationOptionsInAPI } from "@/app/api/register/route";
import { useState } from "react";

export function RegisterForm() {

    const [username, setUsername] = useState('')
    const [displayName, setDisplayName] = useState('')

    const createKey = async () => {
        const res = await fetch('/api/register', { method: 'GET' })
        const data: PublicKeyCredentialCreationOptionsInAPI = await res.json()

        const publicKeyOptions: PublicKeyCredentialCreationOptions = {
            ...data,
            challenge: new TextEncoder().encode(data.challenge),
            user: {
                id: new TextEncoder().encode(data.user.id),
                name: data.user.name,
                displayName: data.user.displayName
            }
        }
        const credential = await navigator.credentials.create({
            publicKey: publicKeyOptions
        })
        console.log(credential)
    }

    return (
        <form >
            <input type="text" placeholder="ユーザー名" maxLength={255} onChange={(e) => { setUsername(e.target.value) }} />
            <input type="text" placeholder="表示名" maxLength={255} onChange={(e) => { setDisplayName(e.target.value) }} />
            <button type="button" onClick={createKey}>ユーザーを作成</button>
        </form>
    )

}