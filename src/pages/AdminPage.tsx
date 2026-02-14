import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { Alert, Card, Typography } from 'antd'

function AdminPage() {
  return (
    <PageContainer content="This page can only be viewed by admin">
      <Card>
        <Alert
          banner
          message="Faster and stronger heavy-duty components have been released."
          showIcon
          style={{ margin: -12, marginBottom: 48 }}
          type="success"
        />
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          <SmileTwoTone />
          {' '}
          Ant Design Pro
          {' '}
          <HeartTwoTone twoToneColor="#eb2f96" />
          {' '}
          You
        </Typography.Title>
      </Card>
      <p style={{ marginTop: 24, textAlign: 'center' }}>
        Want to add more pages? Please refer to
        {' '}
        <a href="https://pro.ant.design/docs/block-cn" rel="noreferrer" target="_blank">use block</a>
        。
      </p>
    </PageContainer>
  )
}

export default AdminPage
