/**
 * 学区地图工具的工具函数
 */

import { Community, SchoolDistrict } from './types'

/**
 * 计算多边形的中心点
 * 返回 Leaflet 格式的坐标 [lat, lng]
 */
export function getPolygonCenter(polygon: number[][]): [number, number] {
  if (polygon.length === 0) {
    return [30.2875, 120.1536] // 默认杭州中心 [lat, lng]
  }

  let sumLng = 0
  let sumLat = 0

  for (const [lng, lat] of polygon) {
    sumLng += lng
    sumLat += lat
  }

  // 返回 Leaflet 格式 [lat, lng]
  return [sumLat / polygon.length, sumLng / polygon.length]
}

/**
 * 判断点是否在多边形内（Ray Casting算法）
 * @param point 点坐标 [lng, lat]
 * @param polygon 多边形顶点数组 [[lng, lat], ...]
 * @returns 是否在多边形内
 */
export function isPointInPolygon(
  point: [number, number],
  polygon: number[][]
): boolean {
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi

    if (intersect) {
      inside = !inside
    }
  }

  return inside
}

/**
 * 根据坐标查找小区所属的学区
 */
export function findDistrictByLocation(
  location: [number, number],
  districts: SchoolDistrict[]
): SchoolDistrict | null {
  for (const district of districts) {
    if (isPointInPolygon(location, district.polygon)) {
      return district
    }
  }
  return null
}

/**
 * 模糊匹配字符串（不区分大小写）
 */
export function fuzzyMatch(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase())
}

/**
 * 搜索学区
 */
export function searchDistricts(
  keyword: string,
  districts: SchoolDistrict[]
): SchoolDistrict[] {
  if (!keyword.trim()) {
    return []
  }

  return districts.filter((district) => fuzzyMatch(district.name, keyword))
}

/**
 * 搜索小区（在已保存的数据中）
 */
export function searchCommunities(
  keyword: string,
  districts: SchoolDistrict[]
): Array<{ community: Community; district: SchoolDistrict }> {
  if (!keyword.trim()) {
    return []
  }

  const results: Array<{ community: Community; district: SchoolDistrict }> = []

  for (const district of districts) {
    if (district.communities) {
      for (const community of district.communities) {
        if (fuzzyMatch(community.name, keyword)) {
          results.push({ community, district })
        }
      }
    }
  }

  return results
}

/**
 * 使用Nominatim API搜索地点
 */
export async function searchWithNominatim(
  query: string
): Promise<Array<{ name: string; location: [number, number]; display_name: string }>> {
  try {
    const searchQuery = `${query} 杭州`
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      searchQuery
    )}&format=json&limit=5&addressdetails=1`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Hangzhou-School-District-Map/1.0', // Nominatim要求设置User-Agent
      },
    })

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`)
    }

    const data = await response.json()

    return data.map((item: any) => ({
      name: item.display_name,
      location: [parseFloat(item.lon), parseFloat(item.lat)] as [number, number],
      display_name: item.display_name,
    }))
  } catch (error) {
    console.error('Nominatim search error:', error)
    return []
  }
}

