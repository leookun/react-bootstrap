import type {
  CurrentUser,
  LoginParams,
  LoginResult,
  RuleListItem,
  RuleListResponse,
  RulePayload,
  RuleQueryParams,
} from '../types'

const AUTH_STORAGE_KEY = 'react-bootstrap-admin.auth'
const RULE_STORAGE_KEY = 'react-bootstrap-admin.rules'

const wait = (time = 300) => new Promise<void>((resolve) => setTimeout(resolve, time))

const USERS: Record<'admin' | 'user', CurrentUser> = {
  admin: {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    email: 'antdesign@alipay.com',
    title: '交互专家',
    group: '蚂蚁金服 - 某某平台部 - UED',
    access: 'admin',
  },
  user: {
    name: '普通用户',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
    email: 'user@example.com',
    title: '产品运营',
    group: '企业平台团队',
    access: 'user',
  },
}

let cacheRules: RuleListItem[] | null = null

const formatDateTime = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const randomInt = (max: number) => Math.floor(Math.random() * max)

const createSeedRules = (count = 100): RuleListItem[] => {
  const now = new Date()
  const list: RuleListItem[] = []

  for (let index = 0; index < count; index += 1) {
    const offsetDate = new Date(now)
    offsetDate.setDate(now.getDate() - index)
    list.push({
      key: index + 1,
      name: `TradeCode ${index + 1}`,
      owner: index % 2 === 0 ? '曲丽丽' : '王昭君',
      desc: '这是一段描述',
      callNo: randomInt(1000),
      status: (index % 4) as 0 | 1 | 2 | 3,
      updatedAt: formatDateTime(offsetDate),
      createdAt: formatDateTime(offsetDate),
      target: index % 2 === 0 ? '0' : '1',
      template: index % 2 === 0 ? '0' : '1',
      ruleType: index % 2 === 0 ? '0' : '1',
      frequency: index % 2 === 0 ? 'month' : 'week',
      time: formatDateTime(offsetDate),
    })
  }

  return list
}

const readStoredAccess = (): 'admin' | 'user' | null => {
  const access = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (access === 'admin' || access === 'user')
    return access
  return null
}

const writeStoredAccess = (access: 'admin' | 'user' | null) => {
  if (!access) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, access)
}

const readStoredRules = (): RuleListItem[] => {
  const raw = window.localStorage.getItem(RULE_STORAGE_KEY)
  if (!raw)
    return []
  try {
    const parsed = JSON.parse(raw) as RuleListItem[]
    if (Array.isArray(parsed))
      return parsed
    return []
  }
  catch {
    return []
  }
}

const writeStoredRules = (rules: RuleListItem[]) => {
  cacheRules = rules
  window.localStorage.setItem(RULE_STORAGE_KEY, JSON.stringify(rules))
}

const ensureRules = () => {
  if (cacheRules)
    return cacheRules

  const stored = readStoredRules()
  if (stored.length > 0) {
    cacheRules = stored
    return stored
  }

  const seededRules = createSeedRules()
  writeStoredRules(seededRules)
  return seededRules
}

const toDateValue = (value: string) => {
  const normalized = value.replace(' ', 'T')
  const parsed = new Date(normalized).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

export async function login(params: LoginParams): Promise<LoginResult> {
  await wait(600)

  if (params.type === 'account') {
    if (params.password === 'ant.design' && params.username === 'admin') {
      writeStoredAccess('admin')
      return {
        status: 'ok',
        type: params.type,
        currentAuthority: 'admin',
      }
    }
    if (params.password === 'ant.design' && params.username === 'user') {
      writeStoredAccess('user')
      return {
        status: 'ok',
        type: params.type,
        currentAuthority: 'user',
      }
    }
  }

  if (params.type === 'mobile' && /^1\d{10}$/.test(params.mobile ?? '') && params.captcha === '1234') {
    writeStoredAccess('admin')
    return {
      status: 'ok',
      type: params.type,
      currentAuthority: 'admin',
    }
  }

  writeStoredAccess(null)
  return {
    status: 'error',
    type: params.type,
    currentAuthority: 'guest',
  }
}

export async function currentUser(): Promise<CurrentUser | undefined> {
  await wait(200)
  const access = readStoredAccess()
  if (!access)
    return undefined
  return { ...USERS[access] }
}

export async function outLogin() {
  await wait(120)
  writeStoredAccess(null)
}

export async function getFakeCaptcha(phone: string) {
  await wait(500)
  if (!/^1\d{10}$/.test(phone))
    throw new Error('请输入正确的手机号')
  return '1234'
}

export async function queryRules(params: RuleQueryParams): Promise<RuleListResponse> {
  await wait(260)
  const current = params.current ?? 1
  const pageSize = params.pageSize ?? 10
  const keyword = params.name?.trim().toLowerCase() ?? ''
  const sortField = params.sortField ?? 'updatedAt'
  const sortOrder = params.sortOrder ?? 'desc'

  let list = [...ensureRules()]

  if (keyword) {
    list = list.filter((item) => {
      return item.name.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword)
    })
  }

  if (params.status !== undefined && params.status !== 'all') {
    list = list.filter(item => item.status === params.status)
  }

  list.sort((left, right) => {
    const order = sortOrder === 'asc' ? 1 : -1
    if (sortField === 'callNo')
      return (left.callNo - right.callNo) * order
    return (toDateValue(left.updatedAt) - toDateValue(right.updatedAt)) * order
  })

  const total = list.length
  const start = (current - 1) * pageSize
  const data = list.slice(start, start + pageSize)

  return {
    data,
    total,
    success: true,
    current,
    pageSize,
  }
}

export async function addRule(payload: RulePayload) {
  await wait(300)
  const rules = [...ensureRules()]
  const maxKey = rules.reduce((max, item) => Math.max(max, item.key), 0)
  const now = formatDateTime(new Date())

  const nextRule: RuleListItem = {
    key: maxKey + 1,
    name: payload.name,
    owner: '曲丽丽',
    desc: payload.desc,
    callNo: randomInt(1000),
    status: randomInt(4) as 0 | 1 | 2 | 3,
    createdAt: now,
    updatedAt: now,
    target: payload.target ?? '0',
    template: payload.template ?? '0',
    ruleType: payload.ruleType ?? '0',
    frequency: payload.frequency ?? 'month',
    time: payload.time ?? now,
  }

  rules.unshift(nextRule)
  writeStoredRules(rules)
  return nextRule
}

export async function updateRule(key: number, payload: RulePayload) {
  await wait(280)
  const rules = [...ensureRules()]
  const now = formatDateTime(new Date())
  const nextRules = rules.map((item) => {
    if (item.key !== key)
      return item
    return {
      ...item,
      ...payload,
      updatedAt: now,
    }
  })
  writeStoredRules(nextRules)
}

export async function removeRules(keys: number[]) {
  await wait(220)
  const set = new Set(keys)
  const nextRules = ensureRules().filter(item => !set.has(item.key))
  writeStoredRules(nextRules)
}
