import { Modal, Form, Input } from 'antd'

interface CommunityFormModalProps {
  visible: boolean
  location: [number, number]
  onSave: (name: string) => void
  onCancel: () => void
}

export default function CommunityFormModal({
  visible,
  location,
  onSave,
  onCancel,
}: CommunityFormModalProps) {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values.name)
        form.resetFields()
      })
      .catch((error) => {
        console.error('Validation failed:', error)
      })
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="添加小区"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="小区名称"
          rules={[{ required: true, message: '请输入小区名称' }]}
        >
          <Input placeholder="请输入小区名称" autoFocus />
        </Form.Item>
        <div style={{ color: '#999', fontSize: '12px', marginTop: '-16px' }}>
          坐标: {location[0].toFixed(6)}, {location[1].toFixed(6)}
        </div>
      </Form>
    </Modal>
  )
}

