/**
 * 学区地图工具的类型定义
 */

export type DistrictType = 'primary' | 'middle'

export interface Community {
  id: string
  name: string // 小区名称
  location: [number, number] // 小区坐标 [lng, lat]
}

export interface SchoolDistrict {
  id: string
  name: string // 学区名称
  type: DistrictType // 小学或初中
  polygon: number[][] // 多边形顶点坐标 [[lng, lat], ...]
  schools: string[] // 学校名称列表
  communities?: Community[] // 可选：该学区下的小区列表
  createdAt: number
  updatedAt: number
}

export interface SearchResult {
  type: 'district' | 'community'
  district?: SchoolDistrict
  community?: Community
  communityDistrict?: SchoolDistrict // 小区所属的学区
}

