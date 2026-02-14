import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Result
      extra={<Button onClick={() => navigate('/welcome')} type="primary">返回首页</Button>}
      status="404"
      subTitle="你访问的地址不存在"
      title="404"
    />
  )
}

export default NotFoundPage
