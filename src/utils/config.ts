export const Config = {
    get appUrl() {
        if (!process.env.APP_URL) {
            throw new Error('APP_URL is not defined')
        }
        return process.env.APP_URL
    },

    get appOrigin() {
        if (!process.env.APP_URL) {
            throw new Error('APP_URL is not defined')
        }
        return new URL(process.env.APP_URL).host.split(':')[0]
    }
}