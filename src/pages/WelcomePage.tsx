import { PageContainer } from '@ant-design/pro-components'
import { Card } from 'antd'

function InfoCard(props: { desc: string, href: string, index: number, title: string }) {
  const { desc, href, index, title } = props
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        color: 'rgba(0, 0, 0, 0.65)',
        flex: 1,
        fontSize: 14,
        minWidth: 220,
        padding: '16px 19px',
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: 4 }}>
        <div
          style={{
            backgroundImage: 'url(https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg)',
            backgroundSize: '100%',
            color: '#fff',
            fontWeight: 'bold',
            height: 48,
            lineHeight: '22px',
            padding: '8px 16px 16px 12px',
            textAlign: 'center',
            width: 48,
          }}
        >
          {index}
        </div>
        <div style={{ color: 'rgba(0, 0, 0, 0.88)', fontSize: 16, paddingBottom: 8 }}>{title}</div>
      </div>
      <div style={{ lineHeight: '22px', marginBottom: 8, marginTop: 8, textAlign: 'justify' }}>{desc}</div>
      <a href={href} rel="noreferrer" target="_blank">了解更多 {'>'}</a>
    </div>
  )
}

function WelcomePage() {
  return (
    <PageContainer>
      <Card>
        <div
          style={{
            backgroundImage: 'url(https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ)',
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
          }}
        >
          <div style={{ color: 'rgba(0, 0, 0, 0.88)', fontSize: 20 }}>欢迎使用 Ant Design Pro</div>
          <p style={{ color: 'rgba(0, 0, 0, 0.65)', lineHeight: '22px', marginBottom: 32, marginTop: 16, width: '65%' }}>
            Ant Design Pro 是一个整合了 umi，Ant Design 和 ProComponents 的脚手架方案。致力于在设计规范和基础组件的基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <InfoCard
              desc="umi 是一个可扩展的企业级前端应用框架，支持配置式路由和约定式路由。"
              href="https://umijs.org/docs/introduce/introduce"
              index={1}
              title="了解 umi"
            />
            <InfoCard
              desc="antd 是基于 Ant Design 设计体系的 React UI 组件库。"
              href="https://ant.design"
              index={2}
              title="了解 ant design"
            />
            <InfoCard
              desc="ProComponents 是一个基于 Ant Design 做了更高抽象的模板组件。"
              href="https://procomponents.ant.design"
              index={3}
              title="了解 Pro Components"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  )
}

export default WelcomePage
