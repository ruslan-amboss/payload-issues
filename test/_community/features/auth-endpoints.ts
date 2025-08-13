import type { Endpoint } from 'payload'

import { AuthService } from './auth.js'

export const loginEndpoint: Endpoint = {
  path: '/auth/login',
  method: 'post',
  handler: async (req, res, next) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required',
        })
      }

      const authService = new AuthService(req.payload)
      const result = await authService.login({ email, password })

      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message,
      })
    }
  },
}

export const logoutEndpoint: Endpoint = {
  path: '/auth/logout',
  method: 'post',
  handler: async (req, res, next) => {
    try {
      const authService = new AuthService(req.payload)
      await authService.logout()

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  },
}

export const meEndpoint: Endpoint = {
  path: '/auth/me',
  method: 'get',
  handler: async (req, res, next) => {
    try {
      const authService = new AuthService(req.payload)
      const user = await authService.me()

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message,
      })
    }
  },
}

export const registerEndpoint: Endpoint = {
  path: '/auth/register',
  method: 'post',
  handler: async (req, res, next) => {
    try {
      const { email, password, name, roles } = req.body

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required',
        })
      }

      const authService = new AuthService(req.payload)
      const user = await authService.register({
        email,
        password,
        name,
        roles: roles || ['user'],
      })

      res.status(201).json({
        success: true,
        data: user,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      })
    }
  },
}

export const refreshTokenEndpoint: Endpoint = {
  path: '/auth/refresh',
  method: 'post',
  handler: async (req, res, next) => {
    try {
      const authService = new AuthService(req.payload)
      const result = await authService.refreshToken()

      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message,
      })
    }
  },
}
