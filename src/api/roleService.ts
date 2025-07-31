const API_URL = `${import.meta.env.VITE_APP_URL}/roles`;

export interface Role {
    id: number,
    name: string,
    description: string
}