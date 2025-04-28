'use client';

import { pagesPath } from "@/router/$path";
import styles from "./LoginForm.module.css";

export function LoginForm() {

    const login = async () => {
        const res = await fetch('/api/login', { method: 'GET' })
        const data = await res.json()
        const publicKeyOptions: PublicKeyCredentialRequestOptions = {
            ...data,
            challenge: new TextEncoder().encode(data.challenge),
        }
        const credential = await navigator.credentials.get({
            publicKey: publicKeyOptions
        })

        console.log(credential)

        const c = credential as unknown as { response: AuthenticatorAssertionResponse }
        if (c.response.userHandle) {
            const b = new Uint8Array(c.response.userHandle).buffer;
            console.log(new TextDecoder().decode(c.response.userHandle));
        }


        await fetch('/api/login', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(credential)
        })
    }

    return (
        <div className={styles.loginContainer}>
            <h2>パスキーでログイン</h2>
            <p className={styles.description}>パスキーは、パスワードを使わずに安全にログインできる方法です。</p>
            <button type="button" onClick={login} className={styles.loginButton}>パスキーでログイン</button>
            <div style={{ marginTop: '40px' }}>
                <a href={pagesPath.login.register.$url().pathname}>
                    <button type="button" className={styles.registerButton}>ユーザーを作成する</button>
                </a>
            </div>
        </div>
    )
}