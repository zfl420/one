// 车型识别相关类型定义

// VIN码识别API响应
export interface VinApiResponse {
  code: number
  msg: string
  data?: VinResultData | string // data可能是对象（查车型）或字符串（纯识别VIN）
  error?: string
}

// 车型数据
export interface VinResultData {
  model_year_from_vin?: string
  epc?: string
  epc_cn?: string
  my_model_std_id?: string
  epc_id?: string
  matching_mode?: string
  brand?: string
  gonggao_no?: string
  build_date?: string
  model_list?: VehicleModel[]
  vin?: string // 识别出的VIN码
  VIN?: string // 大写的VIN字段
  Vin?: string // 首字母大写
  vin_code?: string // VIN码的其他可能字段名
  vinCode?: string
  ocr_vin?: string // OCR识别出的VIN码
  [key: string]: any // 允许其他字段
}

// 车型详细信息
export interface VehicleModel {
  Id: number
  Js_id: number
  model_detail_key?: string
  Gonggao_no?: string
  Group_id?: string
  UrlMake?: string
  Epc?: string
  Epc_id?: string
  Model_year?: string
  Model_detail?: string // 完整车型名称（中文）
  Model_detial_en?: string // 完整车型名称（英文）
  Factory?: string // 厂商
  Factory_en?: string
  Brand?: string // 品牌
  Brand_en?: string
  Model?: string // 车型
  Model_zh?: string
  Model_en?: string
  Series?: string // 系列
  Series_en?: string
  Series_zh?: string
  Sales_version?: string // 销售版本
  Engine_model?: string // 发动机型号
  Displacement?: string // 排量
  Gearbox_type?: string // 变速箱类型
  Gearbox_desc?: string // 变速箱描述
  Drivetrain?: string // 驱动方式
  Fuel_type?: string // 燃料类型
  Body_structure?: string // 车身结构
  Seats?: number // 座位数
  Doors?: number // 门数
  [key: string]: any // 其他可能的字段
}

// 识别结果（用于展示）
export interface VehicleResult {
  vin: string
  brand?: string
  model?: string
  year?: string
  factory?: string
  detail?: string
  matchingMode?: string
  modelList?: VehicleModel[]
  timestamp: number
}

// 历史记录
export interface VehicleRecord {
  id: string
  vin: string
  brand?: string
  model?: string
  year?: string
  detail?: string
  timestamp: number
  inputMode: 'image' | 'text'
}

// 输入模式
export type InputMode = 'image' | 'text'

// API请求参数
export interface VinApiParams {
  action: string
  user: string
  token: string
  vin?: string // 手动输入VIN码
  base64_urlencode_imagestring?: string // 图片Base64编码
}

