import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components'
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Drawer, Input, Modal, Steps, message } from 'antd'
import { useRef, useState } from 'react'
import { addRule, queryRules, removeRules, updateRule } from '../services/mockApi'
import type { RuleListItem } from '../types'

function TableListPage() {
  const actionRef = useRef<ActionType | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [currentRow, setCurrentRow] = useState<RuleListItem>()
  const [selectedRowsState, setSelectedRows] = useState<RuleListItem[]>([])
  const [messageApi, contextHolder] = message.useMessage()

  const [createOpen, setCreateOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createDesc, setCreateDesc] = useState('')
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateStep, setUpdateStep] = useState(0)
  const [updateName, setUpdateName] = useState('')
  const [updateDesc, setUpdateDesc] = useState('')

  const columns: ProColumns<RuleListItem>[] = [
    {
      dataIndex: 'name',
      title: 'Rule name',
      render: (dom, entity) => (
        <a
          onClick={() => {
            setCurrentRow(entity)
            setShowDetail(true)
          }}
        >
          {dom}
        </a>
      ),
    },
    {
      dataIndex: 'desc',
      title: 'Description',
      valueType: 'textarea',
    },
    {
      dataIndex: 'callNo',
      hideInForm: true,
      sorter: true,
      title: 'Number of service calls',
      renderText: val => `${val} 万`,
    },
    {
      dataIndex: 'status',
      hideInForm: true,
      title: 'Status',
      valueEnum: {
        0: { status: 'Default', text: 'Shut down' },
        1: { status: 'Processing', text: 'Running' },
        2: { status: 'Success', text: 'Online' },
        3: { status: 'Error', text: 'Abnormal' },
      },
    },
    {
      dataIndex: 'updatedAt',
      sorter: true,
      title: 'Last scheduled time',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'option',
      title: 'Operating',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record)
            setUpdateName(record.name)
            setUpdateDesc(record.desc)
            setUpdateStep(0)
            setUpdateOpen(true)
          }}
        >
          Configuration
        </a>,
        <a href="https://procomponents.ant.design/" key="subscribeAlert" rel="noreferrer" target="_blank">
          Subscribe to alerts
        </a>,
      ],
    },
  ]

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<RuleListItem>
        actionRef={actionRef}
        columns={columns}
        headerTitle="Enquiry form"
        request={async (params, sort) => {
          const sortField = sort.callNo ? 'callNo' : sort.updatedAt ? 'updatedAt' : undefined
          const sortOrder = sort.callNo === 'ascend' || sort.updatedAt === 'ascend' ? 'asc' : 'desc'
          const result = await queryRules({
            current: params.current,
            name: params.name,
            pageSize: params.pageSize,
            sortField,
            sortOrder,
          })
          return {
            data: result.data,
            success: result.success,
            total: result.total,
          }
        }}
        rowKey="key"
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        search={{ labelWidth: 120 }}
        toolBarRender={() => [
          <Button key="create" onClick={() => setCreateOpen(true)} type="primary">New</Button>,
        ]}
      />

      {selectedRowsState.length > 0 && (
        <FooterToolbar
          extra={(
            <div>
              Chosen
              {' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>
              {' '}
              item
              &nbsp;&nbsp;
              <span>
                Total number of service calls
                {' '}
                {selectedRowsState.reduce((pre, item) => pre + (item.callNo ?? 0), 0)}
                万
              </span>
            </div>
          )}
        >
          <Button
            onClick={async () => {
              await removeRules(selectedRowsState.map(item => item.key))
              setSelectedRows([])
              messageApi.success('Deleted successfully and will refresh soon')
              actionRef.current?.reloadAndRest?.()
            }}
          >
            Batch deletion
          </Button>
          <Button type="primary">Batch approval</Button>
        </FooterToolbar>
      )}

      <Drawer
        closable={false}
        onClose={() => {
          setCurrentRow(undefined)
          setShowDetail(false)
        }}
        open={showDetail}
        size="large"
      >
        {currentRow?.name && (
          <ProDescriptions<RuleListItem>
            column={2}
            columns={columns as ProDescriptionsItemProps<RuleListItem>[]}
            params={{ id: currentRow?.name }}
            request={async () => ({ data: currentRow || {} })}
            title={currentRow?.name}
          />
        )}
      </Drawer>

      <Modal
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          await addRule({
            desc: createDesc || '这是一段描述',
            name: createName,
          })
          setCreateOpen(false)
          setCreateDesc('')
          setCreateName('')
          actionRef.current?.reload?.()
          messageApi.success('Added successfully')
        }}
        open={createOpen}
        title="New rule"
      >
        <Input
          onChange={event => setCreateName(event.target.value)}
          placeholder="Rule name"
          style={{ marginBottom: 12 }}
          value={createName}
        />
        <Input.TextArea onChange={event => setCreateDesc(event.target.value)} placeholder="Description" value={createDesc} />
      </Modal>

      <Modal
        onCancel={() => setUpdateOpen(false)}
        onOk={async () => {
          if (updateStep < 2) {
            setUpdateStep(updateStep + 1)
            return
          }
          if (currentRow) {
            await updateRule(currentRow.key, {
              desc: updateDesc,
              name: updateName,
            })
            messageApi.success('Configuration is successful')
            actionRef.current?.reload?.()
          }
          setUpdateOpen(false)
        }}
        open={updateOpen}
        title="规则配置"
      >
        <Steps
          current={updateStep}
          items={[
            { title: '基本信息' },
            { title: '配置规则属性' },
            { title: '设定调度周期' },
          ]}
          style={{ marginBottom: 24 }}
        />
        {updateStep === 0 && (
          <>
            <Input
              onChange={event => setUpdateName(event.target.value)}
              placeholder="规则名称"
              style={{ marginBottom: 12 }}
              value={updateName}
            />
            <Input.TextArea onChange={event => setUpdateDesc(event.target.value)} placeholder="规则描述" value={updateDesc} />
          </>
        )}
        {updateStep === 1 && <Input placeholder="规则模板配置（演示）" />}
        {updateStep === 2 && <Input placeholder="调度周期配置（演示）" />}
      </Modal>
    </PageContainer>
  )
}

export default TableListPage
