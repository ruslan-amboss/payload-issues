import type { Payload } from 'payload'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  exp: number
  token: string
  user: any
}

export class AuthService {
  constructor(private payload: Payload) {}

  /**
   * Login a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const result = await this.payload.login({
        collection: 'users',
        data: credentials,
      })

      return {
        user: result.user,
        token: result.token,
        exp: result.exp,
      }
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`)
    }
  }

  /**
   * Logout a user
   */
  async logout(): Promise<void> {
    try {
      await this.payload.logout()
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`)
    }
  }

  /**
   * Get the current user
   */
  async me(): Promise<any> {
    try {
      const result = await this.payload.findMe({
        collection: 'users',
      })
      return result
    } catch (error) {
      throw new Error(`Failed to get current user: ${error.message}`)
    }
  }

  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const result = await this.payload.refresh({
        collection: 'users',
      })

      return {
        user: result.user,
        token: result.token,
        exp: result.exp,
      }
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`)
    }
  }

  /**
   * Create a new user
   */
  async register(userData: {
    email: string
    name?: string
    password: string
    roles?: string[]
  }): Promise<any> {
    try {
      const user = await this.payload.create({
        collection: 'users',
        data: userData,
      })
      return user
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`)
    }
  }
}
