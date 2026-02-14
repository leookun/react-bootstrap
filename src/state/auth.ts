import { proxy } from 'valtio'
import { currentUser, login, outLogin } from '../services/mockApi'
import type { CurrentUser, LoginParams, LoginResult } from '../types'

interface AuthState {
  currentUser?: CurrentUser
  initializing: boolean
}

export const authState = proxy<AuthState>({
  currentUser: undefined,
  initializing: true,
})

export async function initAuth() {
  authState.initializing = true
  authState.currentUser = await currentUser()
  authState.initializing = false
}

export async function loginAction(params: LoginParams): Promise<LoginResult> {
  const result = await login(params)
  if (result.status === 'ok')
    authState.currentUser = await currentUser()
  return result
}

export async function logoutAction() {
  await outLogin()
  authState.currentUser = undefined
}
