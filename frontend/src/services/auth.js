import API from './api';

export async function signup(payload) { return API.post('/auth/signup', payload); }
export async function login(payload) { return API.post('/auth/login', payload); }
export function setToken(token) { localStorage.setItem('token', token); }
export function getToken() { return localStorage.getItem('token'); }
export function logout() { localStorage.removeItem('token'); }
