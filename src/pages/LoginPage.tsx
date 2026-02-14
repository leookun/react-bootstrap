import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons'
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components'
import { Alert, Tabs, message } from 'antd'
import { useState } from 'react'
import AppFooter from '../components/AppFooter'
import { getFakeCaptcha } from '../services/mockApi'
import type { LoginParams, LoginResult } from '../types'

interface LoginPageProps {
  search: string
  onSuccess: (path: string) => void
  onLogin: (params: LoginParams) => Promise<LoginResult>
}

function LoginMessage({ content }: { content: string }) {
  return <Alert message={content} showIcon style={{ marginBottom: 24 }} type="error" />
}

function LoginPage(props: LoginPageProps) {
  const { search, onSuccess, onLogin } = props
  const [type, setType] = useState<'account' | 'mobile'>('account')
  const [loginState, setLoginState] = useState<LoginResult | undefined>()

  const submit = async (values: Record<string, string | boolean>) => {
    const result = await onLogin({
      autoLogin: Boolean(values.autoLogin),
      captcha: values.captcha as string | undefined,
      mobile: values.mobile as string | undefined,
      password: values.password as string | undefined,
      type,
      username: values.username as string | undefined,
    })

    if (result.status === 'ok') {
      message.success('登录成功')
      const params = new URLSearchParams(search)
      onSuccess(params.get('redirect') || '/')
      return
    }

    setLoginState(result)
    message.error('登录失败，请重试')
  }

  return (
    <div
      style={{
        backgroundImage: 'url(https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr)',
        backgroundSize: '100% 100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <div style={{ flex: 1, padding: '32px 0' }}>
        <LoginForm
          actions={[
            <span key="loginWith">其他登录方式</span>,
            <AlipayCircleOutlined key="alipay" style={{ color: 'rgba(0, 0, 0, 0.2)', fontSize: 24, marginLeft: 8 }} />,
            <TaobaoCircleOutlined key="taobao" style={{ color: 'rgba(0, 0, 0, 0.2)', fontSize: 24, marginLeft: 8 }} />,
            <WeiboCircleOutlined key="weibo" style={{ color: 'rgba(0, 0, 0, 0.2)', fontSize: 24, marginLeft: 8 }} />,
          ]}
          initialValues={{ autoLogin: true }}
          logo={<img alt="logo" src="/logo.svg" />}
          onFinish={async (values) => {
            await submit(values as Record<string, string | boolean>)
          }}
          subTitle="Ant Design Pro 是一个整合了 umi，Ant Design 和 ProComponents 的脚手架方案"
          title="Ant Design"
        >
          <Tabs
            activeKey={type}
            centered
            items={[
              { key: 'account', label: '账户密码登录' },
              { key: 'mobile', label: '手机号登录' },
            ]}
            onChange={value => setType(value as 'account' | 'mobile')}
          />

          {loginState?.status === 'error' && loginState.type === 'account' && (
            <LoginMessage content="账户或密码错误(admin/user, ant.design)" />
          )}

          {type === 'account' && (
            <>
              <ProFormText
                fieldProps={{ prefix: <UserOutlined />, size: 'large' }}
                name="username"
                placeholder="用户名: admin or user"
                rules={[{ message: '请输入用户名', required: true }]}
              />
              <ProFormText.Password
                fieldProps={{ prefix: <LockOutlined />, size: 'large' }}
                name="password"
                placeholder="密码: ant.design"
                rules={[{ message: '请输入密码', required: true }]}
              />
            </>
          )}

          {loginState?.status === 'error' && loginState.type === 'mobile' && (
            <LoginMessage content="验证码错误，请输入 1234" />
          )}

          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{ prefix: <MobileOutlined />, size: 'large' }}
                name="mobile"
                placeholder="手机号"
                rules={[
                  { message: '请输入手机号', required: true },
                  { message: '手机号格式错误', pattern: /^1\d{10}$/ },
                ]}
              />
              <ProFormCaptcha
                captchaProps={{ size: 'large' }}
                captchaTextRender={(timing, count) => timing ? `${count} s` : '获取验证码'}
                fieldProps={{ prefix: <LockOutlined />, size: 'large' }}
                name="captcha"
                onGetCaptcha={async (phone) => {
                  const code = await getFakeCaptcha(phone)
                  message.success(`获取验证码成功，验证码：${code}`)
                }}
                placeholder="请输入验证码"
                rules={[{ message: '请输入验证码', required: true }]}
              />
            </>
          )}

          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox name="autoLogin" noStyle>自动登录</ProFormCheckbox>
            <a style={{ float: 'right' }}>忘记密码</a>
          </div>
        </LoginForm>
      </div>
      <AppFooter />
    </div>
  )
}

export default LoginPage
