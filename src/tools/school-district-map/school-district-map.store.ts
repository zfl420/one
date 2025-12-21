import { create } from 'zustand'
import { SchoolDistrict, DistrictType, Community, SearchResult } from './types'
import { storageManager } from '../../utils/storage'
import { STORAGE_KEYS } from '../../constants/storage'
import {
  searchDistricts,
  searchCommunities,
  findDistrictByLocation,
  searchWithNominatim,
} from './utils'

interface SchoolDistrictMapState {
  // 数据
  districts: SchoolDistrict[]
  currentType: DistrictType // 当前选中的学区类型

  // UI状态
  isDrawing: boolean // 是否正在绘制
  isAuthenticated: boolean // 是否已验证密码
  searchKeyword: string // 搜索关键词
  searchResults: SearchResult[] // 搜索结果
  selectedDistrictId: string | null // 当前选中的学区ID
  selectedCommunityId: string | null // 当前选中的小区ID

  // Actions
  setCurrentType: (type: DistrictType) => void
  setIsDrawing: (drawing: boolean) => void
  setAuthenticated: (auth: boolean) => void
  setSearchKeyword: (keyword: string) => void
  setSelectedDistrictId: (id: string | null) => void
  setSelectedCommunityId: (id: string | null) => void

  // 数据操作
  loadDistricts: () => void
  saveDistrict: (district: Omit<SchoolDistrict, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateDistrict: (id: string, updates: Partial<SchoolDistrict>) => void
  deleteDistrict: (id: string) => void

  // 搜索
  search: (keyword: string) => Promise<void>
  clearSearch: () => void

  // 小区操作
  addCommunityToDistrict: (districtId: string, community: Omit<Community, 'id'>) => void
  removeCommunityFromDistrict: (districtId: string, communityId: string) => void
}

const DRAWING_PASSWORD = 'zoufeilong'

export const useSchoolDistrictMapStore = create<SchoolDistrictMapState>((set, get) => ({
  // 初始状态
  districts: [],
  currentType: 'primary',
  isDrawing: false,
  isAuthenticated: false,
  searchKeyword: '',
  searchResults: [],
  selectedDistrictId: null,
  selectedCommunityId: null,

  // UI Actions
  setCurrentType: (type) => set({ currentType: type }),

  setIsDrawing: (drawing) => set({ isDrawing: drawing }),

  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  setSelectedDistrictId: (id) => set({ selectedDistrictId: id }),

  setSelectedCommunityId: (id) => set({ selectedCommunityId: id }),

  // 验证密码
  verifyPassword: (password: string): boolean => {
    return password === DRAWING_PASSWORD
  },

  // 加载数据
  loadDistricts: () => {
    const data = storageManager.get<SchoolDistrict[]>(STORAGE_KEYS.SCHOOL_DISTRICT_MAP, [])
    
    // 检查是否存在大禹路校区，如果不存在则添加，如果存在则更新
    const existingDistrictIndex = data.findIndex(d => d.name.includes('大禹路校区'))
    
    // 大禹路校区学区多边形坐标（根据官方示意图和边界描述创建）
    // 东：古墩路——墩祥街——罗家兜河（与余杭、拱墅交界处）
    // 南：灯彩街
    // 西：厚仁路
    // 北：池华街
    // 坐标格式：[lng, lat]，基于杭州三墩区域实际地理位置
    // 注意：东边界是L形的（古墩路+墩祥街+罗家兜河），不是直线
    const dayuRoadPolygon: number[][] = [
      [120.062, 30.338], // 西北角（厚仁路与池华街交汇）
      [120.075, 30.338], // 古墩路与池华街交汇（东边界开始）
      [120.075, 30.325], // 古墩路与墩祥街交汇（L形转折点）
      [120.095, 30.325], // 墩祥街与罗家兜河交汇（继续向东）
      [120.095, 30.302], // 罗家兜河与灯彩街交汇（东南角）
      [120.062, 30.302], // 西南角（厚仁路与灯彩街交汇）
      [120.062, 30.338], // 闭合多边形
    ]
    
    // 所有包含的小区（根据官方信息）
    // 如果学区已存在，保留已有小区的ID；否则创建新的ID
    const existingDistrict = existingDistrictIndex >= 0 ? data[existingDistrictIndex] : null
    const existingCommunitiesMap = new Map(
      (existingDistrict?.communities || []).map(c => [c.name, c])
    )
    
    const communityDefinitions = [
      { name: '中海金溪园', location: [120.082, 30.330] as [number, number] },
      { name: '白马尊邸', location: [120.068, 30.335] as [number, number] },
      { name: '金厦公寓', location: [120.090, 30.308] as [number, number] },
      { name: '兰韵天城', location: [120.088, 30.318] as [number, number] },
      { name: '润达花园 36 幢', location: [120.065, 30.305] as [number, number] },
      { name: '三墩颐景园曲水苑', location: [120.078, 30.320] as [number, number] },
      { name: '三墩颐景园留云苑', location: [120.070, 30.322] as [number, number] },
      { name: '三墩颐景园荷风苑', location: [120.075, 30.318] as [number, number] },
      { name: '信鸿花园 1~23 幢', location: [120.072, 30.310] as [number, number] },
      { name: '紫金港湾', location: [120.080, 30.315] as [number, number] },
    ]
    
    const communities: Community[] = communityDefinitions.map((def, index) => {
      const existing = existingCommunitiesMap.get(def.name)
      return {
        id: existing?.id || `community-dayu-${def.name}-${index}`,
        name: def.name,
        location: def.location,
      }
    })
    
    const dayuRoadDistrict: SchoolDistrict = {
      id: existingDistrictIndex >= 0 ? data[existingDistrictIndex].id : `district-${Date.now()}`,
      name: '大禹路校区 (大禹路/三墩区域)',
      type: 'primary',
      polygon: dayuRoadPolygon,
      schools: ['大禹路小学'],
      communities: communities,
      createdAt: existingDistrictIndex >= 0 ? data[existingDistrictIndex].createdAt : Date.now(),
      updatedAt: Date.now(),
    }
    
    let updatedData: SchoolDistrict[]
    if (existingDistrictIndex >= 0) {
      // 更新已存在的学区
      updatedData = [...data]
      updatedData[existingDistrictIndex] = dayuRoadDistrict
    } else {
      // 添加新学区
      updatedData = [...data, dayuRoadDistrict]
    }
    
    set({ districts: updatedData })
    storageManager.set(STORAGE_KEYS.SCHOOL_DISTRICT_MAP, updatedData)
  },

  // 添加学区
  saveDistrict: (districtData) => {
    const newDistrict: SchoolDistrict = {
      ...districtData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const newDistricts = [...get().districts, newDistrict]
    set({ districts: newDistricts })
    storageManager.set(STORAGE_KEYS.SCHOOL_DISTRICT_MAP, newDistricts)
  },

  // 更新学区
  updateDistrict: (id, updates) => {
    const updatedDistricts = get().districts.map((d) =>
      d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d
    )
    set({ districts: updatedDistricts })
    storageManager.set(STORAGE_KEYS.SCHOOL_DISTRICT_MAP, updatedDistricts)
  },

  // 删除学区
  deleteDistrict: (id) => {
    const filteredDistricts = get().districts.filter((d) => d.id !== id)
    set({
      districts: filteredDistricts,
      selectedDistrictId: get().selectedDistrictId === id ? null : get().selectedDistrictId,
    })
    storageManager.set(STORAGE_KEYS.SCHOOL_DISTRICT_MAP, filteredDistricts)
  },

  // 搜索
  search: async (keyword) => {
    if (!keyword.trim()) {
      set({ searchResults: [], searchKeyword: keyword })
      return
    }

    set({ searchKeyword: keyword })

    const { districts } = get()

    // 先搜索本地数据
    const districtResults = searchDistricts(keyword, districts)
    const communityResults = searchCommunities(keyword, districts)

    const results: SearchResult[] = [
      ...districtResults.map((d) => ({ type: 'district' as const, district: d })),
      ...communityResults.map(({ community, district }) => ({
        type: 'community' as const,
        community,
        communityDistrict: district,
      })),
    ]

    // 如果没有本地结果，尝试使用Nominatim API搜索
    if (results.length === 0) {
      const nominatimResults = await searchWithNominatim(keyword)
      if (nominatimResults.length > 0) {
        // 找到第一个结果的学区归属
        const firstResult = nominatimResults[0]
        const foundDistrict = findDistrictByLocation(firstResult.location, districts)

        if (foundDistrict) {
          results.push({
            type: 'community',
            community: {
              id: Date.now().toString(),
              name: keyword,
              location: firstResult.location,
            },
            communityDistrict: foundDistrict,
          })
        } else {
          // 搜索结果不在任何学区范围内
          results.push({
            type: 'community',
            community: {
              id: Date.now().toString(),
              name: keyword,
              location: firstResult.location,
            },
          })
        }
      }
    }

    set({ searchResults: results })
  },

  // 清除搜索
  clearSearch: () => {
    set({ searchKeyword: '', searchResults: [] })
  },

  // 添加小区到学区
  addCommunityToDistrict: (districtId, communityData) => {
    const newCommunity: Community = {
      ...communityData,
      id: Date.now().toString(),
    }

    const { districts } = get()
    const district = districts.find((d) => d.id === districtId)
    if (district) {
      const updatedCommunities = [...(district.communities || []), newCommunity]
      get().updateDistrict(districtId, { communities: updatedCommunities })
    }
  },

  // 从学区移除小区
  removeCommunityFromDistrict: (districtId, communityId) => {
    const { districts } = get()
    const district = districts.find((d) => d.id === districtId)
    if (district && district.communities) {
      const updatedCommunities = district.communities.filter((c) => c.id !== communityId)
      get().updateDistrict(districtId, { communities: updatedCommunities })
    }
  },
}))

// 添加密码验证方法到store
export const verifyPassword = (password: string): boolean => {
  return password === DRAWING_PASSWORD
}

// 初始化时加载数据
useSchoolDistrictMapStore.getState().loadDistricts()

