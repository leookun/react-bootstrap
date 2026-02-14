import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <Result
      extra={<Button onClick={() => navigate('/welcome')} type="primary">返回欢迎页</Button>}
      status="403"
      subTitle="当前账号不是 admin，无法访问管理员子页面"
      title="403"
    />
  )
}

export default ForbiddenPage
