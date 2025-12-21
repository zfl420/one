import { Modal, Input, Form } from 'antd'

interface DrawingControlsProps {
  visible: boolean
  password: string
  onPasswordChange: (password: string) => void
  onOk: () => void
  onCancel: () => void
}

export default function DrawingControls({
  visible,
  password,
  onPasswordChange,
  onOk,
  onCancel,
}: DrawingControlsProps) {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        onOk()
        form.resetFields()
      })
      .catch(() => {
        // 验证失败
      })
  }

  return (
    <Modal
      title="输入密码"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="请输入密码"
            onPressEnter={handleSubmit}
            autoFocus
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
