import { useEffect } from 'react'
import { message } from 'antd'
import { useEmojiPickerStore } from './emoji-picker.store'

export default function CopyToast() {
  const { copySuccess, hideCopySuccess } = useEmojiPickerStore()

  useEffect(() => {
    if (copySuccess) {
      message.success({
        content: (
          <span>
            <span style={{ fontSize: 24, marginRight: 8 }}>{copySuccess}</span>
            已复制到剪贴板
          </span>
        ),
        duration: 2,
      })
      // 自动隐藏
      const timer = setTimeout(hideCopySuccess, 2000)
      return () => clearTimeout(timer)
    }
  }, [copySuccess, hideCopySuccess])

  return null
}
