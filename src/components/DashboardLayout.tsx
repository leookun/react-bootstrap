import { CrownOutlined, SmileOutlined, TableOutlined } from '@ant-design/icons'
import { ProLayout } from '@ant-design/pro-components'
import { Avatar, Dropdown } from 'antd'
import type { PropsWithChildren } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { CurrentUser } from '../types'
import AppFooter from './AppFooter'

interface DashboardLayoutProps extends PropsWithChildren {
  user: CurrentUser
  onLogout: () => void
}

const route = {
  routes: [
    {
      icon: <SmileOutlined />,
      name: 'welcome',
      path: '/welcome',
    },
    {
      icon: <CrownOutlined />,
      name: 'admin',
      path: '/admin',
      routes: [
        {
          name: 'sub-page',
          path: '/admin/sub-page',
        },
      ],
    },
    {
      icon: <TableOutlined />,
      name: 'list.table-list',
      path: '/list',
    },
  ],
}

function DashboardLayout(props: DashboardLayoutProps) {
  const { user, onLogout, children } = props
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh' }}>
      <ProLayout
        avatarProps={{
          render: (_, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    { key: 'logout', label: '退出登录' },
                  ],
                  onClick: ({ key }) => {
                    if (key === 'logout')
                      onLogout()
                  },
                }}
              >
                {dom}
              </Dropdown>
            )
          },
          src: <Avatar src={user.avatar} />,
          title: user.name,
        }}
        fixSiderbar
        location={{ pathname: location.pathname }}
        logo="/logo.svg"
        menu={{ locale: false }}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              if (item.path)
                navigate(item.path)
            }}
          >
            {dom}
          </a>
        )}
        menuHeaderRender={undefined}
        onMenuHeaderClick={() => navigate('/welcome')}
        route={route}
        title="Ant Design Pro"
      >
        {children}
        <AppFooter />
      </ProLayout>
    </div>
  )
}

export default DashboardLayout
