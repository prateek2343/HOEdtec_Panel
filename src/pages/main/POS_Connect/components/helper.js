export const decodeJwt = (token) => {
    if (!token) {
        throw new Error('Token is required')
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token format')
    }

    try {
        const payload = parts[1] // Get the payload part of the JWT
        const decodedPayload = atob(payload) // Decode the Base64Url encoded string
        return JSON.parse(decodedPayload) // Parse the decoded JSON string
    } catch (error) {
        throw new Error('Failed to decode JWT payload')
    }
}
