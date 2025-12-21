import React from 'react'
import { Modal, Form, Input, Radio } from 'antd'
import { DistrictType } from './types'

const { TextArea } = Input

interface DistrictFormModalProps {
  visible: boolean
  districtType: DistrictType // 默认类型（从当前tab获取）
  onSave: (data: {
    name: string
    type: DistrictType
    schools: string[]
  }) => void
  onCancel: () => void
}

export default function DistrictFormModal({
  visible,
  districtType,
  onSave,
  onCancel,
}: DistrictFormModalProps) {
  const [form] = Form.useForm()

  // 当visible变化时，重置表单并设置默认类型
  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({ type: districtType })
    } else {
      form.resetFields()
    }
  }, [visible, districtType, form])

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // 解析学校列表（支持换行或逗号分隔，可选）
        const schoolsText = values.schools || ''
        const schools = schoolsText
          .split(/[,\n]/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0)

        onSave({
          name: values.name,
          type: values.type || districtType,
          schools,
        })

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
      title="创建学区"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="确认并开始绘制"
      cancelText="取消"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="学区类型"
          rules={[{ required: true, message: '请选择学区类型' }]}
        >
          <Radio.Group>
            <Radio value="primary">小学</Radio>
            <Radio value="middle">初中</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="name"
          label="学区名称"
          rules={[{ required: true, message: '请输入学区名称' }]}
        >
          <Input placeholder="请输入学区名称" />
        </Form.Item>

        <Form.Item
          name="schools"
          label="学校列表（可选）"
          extra="每行一个学校名称，或用逗号分隔，可以留空后续添加"
        >
          <TextArea
            placeholder="请输入学校名称，每行一个或用逗号分隔&#10;例如：&#10;学校A&#10;学校B&#10;（可选，可留空）"
            rows={6}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

