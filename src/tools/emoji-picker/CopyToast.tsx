import { useEmojiPickerStore } from './emoji-picker.store'

export default function CopyToast() {
  const { copySuccess, hideCopySuccess } = useEmojiPickerStore()

  if (!copySuccess) {
    return null
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3">
        <div className="text-3xl">{copySuccess}</div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">已复制到剪贴板</span>
        </div>
        <button
          onClick={hideCopySuccess}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
