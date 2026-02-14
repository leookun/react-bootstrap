export type UserAccess = 'admin' | 'user' | 'guest'

export interface CurrentUser {
  name: string
  avatar: string
  email: string
  title: string
  group: string
  access: UserAccess
}

export type LoginType = 'account' | 'mobile'

export interface LoginParams {
  type: LoginType
  username?: string
  password?: string
  mobile?: string
  captcha?: string
  autoLogin?: boolean
}

export interface LoginResult {
  status: 'ok' | 'error'
  type: LoginType
  currentAuthority: UserAccess
}

export interface RuleListItem {
  key: number
  name: string
  owner: string
  desc: string
  callNo: number
  status: 0 | 1 | 2 | 3
  updatedAt: string
  createdAt: string
  target?: string
  template?: string
  ruleType?: '0' | '1'
  time?: string
  frequency?: 'month' | 'week'
}

export interface RuleListResponse {
  data: RuleListItem[]
  total: number
  success: true
  current: number
  pageSize: number
}

export interface RuleQueryParams {
  current?: number
  pageSize?: number
  name?: string
  status?: 'all' | 0 | 1 | 2 | 3
  sortField?: 'callNo' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface RulePayload {
  name: string
  desc: string
  target?: string
  template?: string
  ruleType?: '0' | '1'
  time?: string
  frequency?: 'month' | 'week'
}
