// src/services/api.js
const API_URL = 'https://your-api-endpoint.com'

export const api = {
  async get(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: this.getHeaders()
    })
    return this.handleResponse(res)
  },

  async post(endpoint, data) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    })
    return this.handleResponse(res)
  },

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    }
    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  },

  async handleResponse(response) {
    if (!response.ok) {
      throw new Error(await response.text())
    }
    return response.json()
  }
}