import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-components'

function AppFooter() {
  return (
    <DefaultFooter
      copyright="Powered by Ant Design"
      links={[
        {
          blankTarget: true,
          href: 'https://pro.ant.design',
          key: 'Ant Design Pro',
          title: 'Ant Design Pro',
        },
        {
          blankTarget: true,
          href: 'https://github.com/ant-design/ant-design-pro',
          key: 'github',
          title: <GithubOutlined />,
        },
        {
          blankTarget: true,
          href: 'https://ant.design',
          key: 'Ant Design',
          title: 'Ant Design',
        },
      ]}
      style={{ background: 'none' }}
    />
  )
}

export default AppFooter
