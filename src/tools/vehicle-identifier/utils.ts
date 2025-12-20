import CryptoJS from 'crypto-js'
import {
  VinApiResponse,
  VinApiParams,
  VehicleResult,
  VinResultData,
} from './types'

// 从环境变量获取配置
const API_CONFIG = {
  username: import.meta.env.VITE_17VIN_USERNAME || 'kzcf',
  password: import.meta.env.VITE_17VIN_PASSWORD || 'kz06cf',
  // 开发环境使用代理，生产环境使用直接URL
  apiUrl: import.meta.env.DEV 
    ? '/api/17vin' 
    : (import.meta.env.VITE_17VIN_API_URL || 'http://api.17vin.com:8080'),
}

/**
 * 生成API请求的token
 * 根据17vin API文档: token = MD5(MD5(username) + MD5(site_md5_password) + url_parameters)
 * @param params - 请求参数对象（不包含token）
 */
export function generateToken(params: Record<string, string>): string {
  // 1. MD5(username)
  const md5Username = CryptoJS.MD5(API_CONFIG.username).toString()
  
  // 2. MD5(password)
  const md5Password = CryptoJS.MD5(API_CONFIG.password).toString()
  
  // 3. 构建url_parameters字符串
  // 将参数按key排序后拼接成 key1=value1&key2=value2 格式
  const sortedKeys = Object.keys(params).sort()
  const urlParameters = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  // 4. 最终token = MD5(MD5(username) + MD5(password) + url_parameters)
  const tokenString = md5Username + md5Password + urlParameters
  return CryptoJS.MD5(tokenString).toString()
}

/**
 * 将图片文件转换为Base64编码并进行URL编码
 */
export async function imageToBase64UrlEncoded(
  file: File
): Promise<{ base64: string; size: number; error?: string }> {
  return new Promise((resolve, reject) => {
    // 检查文件大小（4MB限制）
    const maxSize = 4 * 1024 * 1024
    if (file.size > maxSize) {
      resolve({
        base64: '',
        size: file.size,
        error: '图片大小超过4MB限制',
      })
      return
    }

    // 检查文件格式
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      resolve({
        base64: '',
        size: file.size,
        error: '仅支持 JPG、PNG、BMP 格式',
      })
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const result = e.target?.result as string
        // 移除 data:image/xxx;base64, 前缀
        const base64Data = result.split(',')[1]
        // URL编码
        const urlEncoded = encodeURIComponent(base64Data)

        // 检查编码后的大小
        if (urlEncoded.length > maxSize) {
          resolve({
            base64: '',
            size: urlEncoded.length,
            error: '编码后图片大小超过4MB限制，请使用更小的图片',
          })
          return
        }

        resolve({
          base64: urlEncoded,
          size: urlEncoded.length,
        })
      } catch (error) {
        reject(new Error('图片编码失败'))
      }
    }

    reader.onerror = () => {
      reject(new Error('图片读取失败'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * 调用VIN码OCR识别+查车型接口
 * 策略：先用vin_ocr识别VIN码，再用vin_decode查车型
 */
export async function recognizeVehicleByImage(
  imageFile: File
): Promise<VehicleResult> {
  try {
    // 转换图片为Base64并URL编码
    const { base64, error } = await imageToBase64UrlEncoded(imageFile)

    if (error) {
      throw new Error(error)
    }

    console.log('========== 第1步：识别VIN码 ==========')
    
    // 第1步：先用vin_ocr接口识别VIN码
    const ocrBusinessParams = {
      action: 'vin_ocr',
      base64_urlencode_imagestring: base64,
    }

    const ocrToken = generateToken(ocrBusinessParams)
    const ocrParams: VinApiParams = {
      ...ocrBusinessParams,
      user: API_CONFIG.username,
      token: ocrToken,
    }

    const ocrResponse = await fetch(API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(ocrParams as any),
      mode: 'cors',
    })

    if (!ocrResponse.ok) {
      throw new Error(`OCR识别HTTP错误: ${ocrResponse.status}`)
    }

    const ocrData: VinApiResponse = await ocrResponse.json()
    console.log('OCR识别响应:', ocrData)

    if (ocrData.code !== 1 || !ocrData.data) {
      throw new Error(ocrData.msg || ocrData.error || 'VIN码识别失败')
    }

    // 提取VIN码（3002接口返回的data直接就是VIN码字符串）
    const vinCode = typeof ocrData.data === 'string' ? ocrData.data : (ocrData.data as any).vin || ''
    console.log('识别出的VIN码:', vinCode)

    if (!vinCode || vinCode.length !== 17) {
      throw new Error('识别的VIN码格式不正确')
    }

    console.log('========== 第2步：查询车型信息 ==========')
    
    // 第2步：用识别出的VIN码查询车型
    return await recognizeVehicleByVin(vinCode)
  } catch (error) {
    console.error('车型识别失败:', error)
    // 提供更友好的错误信息
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络或API服务是否可用')
    }
    throw error
  }
}

/**
 * 通过VIN码查询车型信息
 */
export async function recognizeVehicleByVin(vin: string): Promise<VehicleResult> {
  try {
    // 验证VIN码格式（17位）
    if (!vin || vin.length !== 17) {
      throw new Error('VIN码必须是17位字符')
    }

    // 1. 先构建业务参数（用于生成token，不包含user和token）
    const businessParams = {
      action: 'vin_decode',
      vin,
    }

    // 2. 生成token
    const token = generateToken(businessParams)

    // 3. 完整的请求参数（包含user和token）
    const params: VinApiParams = {
      ...businessParams,
      user: API_CONFIG.username,
      token,
    }

    // 发送POST请求
    const response = await fetch(API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params as any),
      mode: 'cors', // 明确指定CORS模式
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data: VinApiResponse = await response.json()

    if (data.code !== 1 || !data.data) {
      throw new Error(data.msg || data.error || '查询失败')
    }

    return parseVehicleResult(data.data, vin)
  } catch (error) {
    console.error('VIN码查询失败:', error)
    // 提供更友好的错误信息
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络或API服务是否可用')
    }
    throw error
  }
}

/**
 * 解析API返回的数据为展示用的结果
 */
function parseVehicleResult(data: VinResultData, vinCode?: string): VehicleResult {
  const firstModel = data.model_list?.[0]

  // 使用传入的VIN码，如果没有则从data中获取
  const finalVin = vinCode || data.vin || ''
  
  console.log('parseVehicleResult - 最终VIN码:', finalVin)

  return {
    vin: finalVin,
    brand: data.brand || firstModel?.Brand,
    model: firstModel?.Model,
    year: data.model_year_from_vin || firstModel?.Model_year,
    factory: firstModel?.Factory,
    detail: firstModel?.Model_detail,
    matchingMode: data.matching_mode,
    modelList: data.model_list,
    timestamp: Date.now(),
  }
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 验证VIN码格式
 */
export function validateVin(vin: string): { valid: boolean; error?: string } {
  if (!vin) {
    return { valid: false, error: '请输入VIN码' }
  }

  if (vin.length !== 17) {
    return { valid: false, error: 'VIN码必须是17位字符' }
  }

  // VIN码不包含字母 I, O, Q
  if (/[IOQ]/i.test(vin)) {
    return { valid: false, error: 'VIN码不能包含字母 I、O、Q' }
  }

  return { valid: true }
}

