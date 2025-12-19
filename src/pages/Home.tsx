import { useState, useEffect } from 'react'

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const getTimeComponents = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Shanghai',
      hour12: false,
    }
    
    const beijingDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }))
    
    return {
      date: beijingDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: beijingDate.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      weekday: beijingDate.toLocaleDateString('zh-CN', {
        weekday: 'long',
      }),
    }
  }

  const { date, time, weekday } = getTimeComponents(currentTime)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center space-y-8">
          {/* 欢迎信息 */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">one</span>
            </h1>
          </div>

          {/* 北京时间显示 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-6 border border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">北京时间</span>
            </div>
            
            <div className="space-y-4">
              {/* 时间 */}
              <div className="text-6xl md:text-7xl font-bold text-gray-900 tabular-nums tracking-tight">
                {time}
              </div>
              
              {/* 日期和星期 */}
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <span className="text-xl font-medium">{date}</span>
                <span className="text-gray-300">|</span>
                <span className="text-xl font-medium">{weekday}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
