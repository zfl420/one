import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const targetUrl = 'http://api.17vin.com:8080'
    
    // 处理请求体
    // Vercel 默认会解析 application/x-www-form-urlencoded 为对象
    // 我们需要将其转换回 URLSearchParams 格式
    let body: string
    
    if (typeof req.body === 'string') {
      // 如果已经是字符串，直接使用
      body = req.body
    } else if (req.body && typeof req.body === 'object') {
      // 如果是对象（Vercel 解析后的），转换为 URLSearchParams 字符串
      const params = new URLSearchParams()
      Object.entries(req.body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
      body = params.toString()
    } else {
      body = ''
    }

    // 转发请求到目标 API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    })

    const data = await response.json()
    
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    res.status(response.status).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ 
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

