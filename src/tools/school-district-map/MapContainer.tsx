import { useEffect, useRef } from 'react'
import { MapContainer as LeafletMapContainer, TileLayer, useMap, Polygon, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// @ts-ignore - leaflet-draw types may not be perfect
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import { SchoolDistrict, Community } from './types'
import { useSchoolDistrictMapStore } from './school-district-map.store'
import { getPolygonCenter } from './utils'

// 修复Leaflet默认图标路径问题
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapContainerProps {
  districts: SchoolDistrict[]
  isDrawing: boolean
  isAuthenticated: boolean
  selectedDistrictId: string | null
  selectedCommunityId: string | null
  searchResults: Array<{
    type: 'district' | 'community'
    district?: SchoolDistrict
    community?: Community
    communityDistrict?: SchoolDistrict
  }>
  onPolygonComplete: (polygon: number[][]) => void
  onMarkerClick?: (location: [number, number]) => void
  onDrawingButtonClick?: () => void
  onNewDistrictClick?: () => void
  activeTab?: 'primary' | 'middle' | 'community'
}

// 绘制控制组件
function DrawingControl({ isDrawing, onPolygonComplete }: { isDrawing: boolean; onPolygonComplete: (polygon: number[][]) => void }) {
  const map = useMap()
  const drawControlRef = useRef<L.Control.Draw | null>(null)
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup())

  useEffect(() => {
    if (!map) return

    // 添加绘制工具
    drawnItemsRef.current.addTo(map)

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: true,
          showArea: true,
          shapeOptions: {
            color: '#3388ff',
          },
        },
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
      },
      edit: {
        featureGroup: drawnItemsRef.current,
      },
    })

    drawControlRef.current = drawControl

    if (isDrawing) {
      map.addControl(drawControl)
    } else {
      map.removeControl(drawControl)
      drawnItemsRef.current.clearLayers()
    }

    const handleDrawCreated = (e: any) => {
      const layer = e.layer
      drawnItemsRef.current.addLayer(layer)

      if (layer instanceof L.Polygon) {
        const latlngs = layer.getLatLngs()[0] as L.LatLng[]
        const polygon = latlngs.map((latlng) => [latlng.lng, latlng.lat])
        onPolygonComplete(polygon)
        
        // 绘制完成后移除控制
        map.removeControl(drawControl)
        drawnItemsRef.current.clearLayers()
      }
    }

    map.on(L.Draw.Event.CREATED, handleDrawCreated as any)

    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated as any)
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current)
      }
      map.removeLayer(drawnItemsRef.current)
    }
  }, [map, isDrawing, onPolygonComplete])

  return null
}

// 地图事件处理组件
function MapEventHandler({
  isMarkerMode,
  onMarkerClick,
}: {
  isMarkerMode: boolean
  onMarkerClick?: (location: [number, number]) => void
}) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isMarkerMode && onMarkerClick) {
        onMarkerClick([e.latlng.lng, e.latlng.lat])
      }
    }

    if (isMarkerMode) {
      map.on('click', handleMapClick)
      map.getContainer().style.cursor = 'crosshair'
    } else {
      map.off('click', handleMapClick)
      map.getContainer().style.cursor = ''
    }

    return () => {
      map.off('click', handleMapClick)
      map.getContainer().style.cursor = ''
    }
  }, [map, isMarkerMode, onMarkerClick])

  return null
}

// 绘制控制按钮组件（Leaflet Control）
function DrawingButtonControl({ onClick, isDrawing }: { onClick: () => void; isDrawing: boolean }) {
  const map = useMap()
  const controlRef = useRef<L.Control | null>(null)

  useEffect(() => {
    if (!map) return

    // 创建容器和按钮
    const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar')
    container.style.marginTop = '10px'
    container.style.clear = 'both'
    container.style.width = 'auto'
    
    const button = L.DomUtil.create('a', '', container)
    button.href = '#'
    // 使用图标：⚙️ 齿轮图标（进入编辑模式），❌ 取消图标（退出编辑模式）
    button.innerHTML = isDrawing ? '❌' : '⚙️'
    button.title = isDrawing ? '退出编辑模式' : '进入编辑模式' // 添加提示文字
    button.style.cssText = 'display: block; padding: 8px; text-align: center; text-decoration: none; color: #666; background: white; border: 2px solid rgba(0,0,0,0.2); border-radius: 4px; font-size: 18px; width: 34px; height: 34px; line-height: 18px; box-sizing: border-box;'
    
    if (!isDrawing) {
      // 进入编辑模式：白底，灰色齿轮
      button.style.background = 'white'
      button.style.color = '#666'
      button.style.borderColor = 'rgba(0,0,0,0.2)'
    } else {
      // 退出编辑模式：保持红色取消图标样式
      button.style.color = '#333'
    }

    L.DomEvent.disableClickPropagation(button)
    L.DomEvent.on(button, 'click', (e) => {
      L.DomEvent.stopPropagation(e)
      L.DomEvent.preventDefault(e)
      onClick()
    })

    // 创建自定义Leaflet Control
    const DrawingControl = L.Control.extend({
      onAdd: () => {
        return container
      },
      onRemove: () => {
        // 清理工作
        L.DomEvent.off(button)
      },
    })

    const control = new DrawingControl({
      position: 'topleft', // 和缩放控件在同一位置
    })

    controlRef.current = control
    map.addControl(control)

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current)
        controlRef.current = null
      }
    }
  }, [map, onClick, isDrawing])

  return null
}

// 新建学区按钮组件（Leaflet Control）
function NewDistrictButtonControl({ onClick, visible }: { onClick: () => void; visible: boolean }) {
  const map = useMap()
  const controlRef = useRef<L.Control | null>(null)

  useEffect(() => {
    if (!map) return

    if (!visible) {
      // 如果不可见，移除控制
      if (controlRef.current) {
        map.removeControl(controlRef.current)
        controlRef.current = null
      }
      return
    }

    // 创建容器和按钮
    const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar')
    container.style.marginTop = '10px'
    container.style.clear = 'both'
    container.style.width = 'auto'
    
    const button = L.DomUtil.create('a', '', container)
    button.href = '#'
    button.innerHTML = '➕'
    button.title = '新建学区'
    button.style.cssText = 'display: block; padding: 8px; text-align: center; text-decoration: none; color: white; background: #52c41a; border: 2px solid #52c41a; border-radius: 4px; font-size: 18px; width: 34px; height: 34px; line-height: 18px; box-sizing: border-box;'

    L.DomEvent.disableClickPropagation(button)
    L.DomEvent.on(button, 'click', (e) => {
      L.DomEvent.stopPropagation(e)
      L.DomEvent.preventDefault(e)
      onClick()
    })

    // 创建自定义Leaflet Control
    const NewDistrictControl = L.Control.extend({
      onAdd: () => {
        return container
      },
      onRemove: () => {
        L.DomEvent.off(button)
      },
    })

    const control = new NewDistrictControl({
      position: 'topleft',
    })

    controlRef.current = control
    map.addControl(control)

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current)
        controlRef.current = null
      }
    }
  }, [map, onClick, visible])

  return null
}

// 地图视图控制组件
function MapViewControl({ 
  selectedDistrictId,
  selectedCommunityId,
  searchResults,
  districts,
  allCommunities
}: { 
  selectedDistrictId: string | null
  selectedCommunityId: string | null
  searchResults: Array<{
    type: 'district' | 'community'
    district?: SchoolDistrict
    community?: Community
  }>
  districts: SchoolDistrict[]
  allCommunities: Array<{ community: Community; district: SchoolDistrict }>
}) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // 如果有选中的小区，优先定位到小区
    if (selectedCommunityId) {
      const communityData = allCommunities.find(({ community }) => community.id === selectedCommunityId)
      if (communityData) {
        // 转换为 Leaflet 格式 [lat, lng]
        const [lng, lat] = communityData.community.location
        map.setView([lat, lng], 16, { animate: true })
      }
      return
    }

    // 如果有选中的学区，定位到该学区
    if (selectedDistrictId) {
      const district = districts.find((d) => d.id === selectedDistrictId)
      if (district && district.polygon.length > 0) {
        const center = getPolygonCenter(district.polygon)
        map.setView(center, 14, { animate: true })
      }
      return
    }

    // 如果有搜索结果，定位到搜索结果
    if (searchResults.length > 0) {
      const firstResult = searchResults[0]
      if (firstResult.type === 'district' && firstResult.district) {
        const center = getPolygonCenter(firstResult.district.polygon)
        map.setView(center, 14, { animate: true })
      } else if (firstResult.type === 'community' && firstResult.community) {
        // 转换为 Leaflet 格式 [lat, lng]
        const [lng, lat] = firstResult.community.location
        map.setView([lat, lng], 15, { animate: true })
      }
    }
  }, [map, selectedDistrictId, selectedCommunityId, searchResults, districts, allCommunities])

  return null
}

export default function MapContainer({
  districts,
  isDrawing,
  isAuthenticated,
  selectedDistrictId,
  selectedCommunityId,
  searchResults,
  onPolygonComplete,
  onMarkerClick,
  onDrawingButtonClick,
  onNewDistrictClick,
  activeTab = 'primary',
}: MapContainerProps) {

  // 根据当前类型过滤学区（如果activeTab不是'community'，则过滤学区）
  const currentType = useSchoolDistrictMapStore((state) => state.currentType)
  const filteredDistricts = activeTab === 'community' ? districts : districts.filter((d) => d.type === currentType)
  
  // 获取所有小区标记（如果是小区tab，显示所有小区；否则只显示当前类型学区的小区）
  const allCommunities: Array<{ community: Community; district: SchoolDistrict }> = []
  filteredDistricts.forEach((district) => {
    if (district.communities) {
      district.communities.forEach((community) => {
        allCommunities.push({ community, district })
      })
    }
  })
  
  // 如果是小区tab，显示所有学区；否则只显示过滤后的学区
  const districtsToShow = activeTab === 'community' ? [] : filteredDistricts

  // 获取搜索结果中的小区标记
  const searchCommunityMarkers = searchResults
    .filter((r) => r.type === 'community' && r.community)
    .map((r) => r.community!)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <LeafletMapContainer
        center={[30.2875, 120.1536]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 绘制控制按钮（Leaflet Control） */}
        {onDrawingButtonClick && (
          <DrawingButtonControl onClick={onDrawingButtonClick} isDrawing={isAuthenticated || isDrawing} />
        )}

        {/* 新建学区按钮（仅在编辑状态且未绘制时显示） */}
        {onNewDistrictClick && isAuthenticated && !isDrawing && (
          <NewDistrictButtonControl onClick={onNewDistrictClick} visible={true} />
        )}

        {/* 绘制控制 */}
        {isDrawing && (
          <DrawingControl isDrawing={isDrawing} onPolygonComplete={onPolygonComplete} />
        )}

        {/* 地图事件处理 */}
        <MapEventHandler
          isMarkerMode={!!onMarkerClick}
          onMarkerClick={onMarkerClick}
        />

        {/* 地图视图控制 */}
        <MapViewControl
          selectedDistrictId={selectedDistrictId}
          selectedCommunityId={selectedCommunityId}
          searchResults={searchResults}
          districts={districts}
          allCommunities={allCommunities}
        />

        {/* 渲染学区多边形 */}
        {districtsToShow.map((district) => {
          const isSelected = district.id === selectedDistrictId
          const isInSearchResults = searchResults.some(
            (r) => r.type === 'district' && r.district?.id === district.id
          )

          return (
            <Polygon
              key={district.id}
              positions={district.polygon.map(([lng, lat]) => [lat, lng])}
              pathOptions={{
                color: isSelected || isInSearchResults ? '#ff4d4f' : '#1890ff',
                fillColor: isSelected || isInSearchResults ? '#ff7875' : '#40a9ff',
                fillOpacity: 0.3,
                weight: isSelected || isInSearchResults ? 3 : 2,
              }}
            >
              <Popup>
                <div>
                  <strong>{district.name}</strong>
                  <div>类型: {district.type === 'primary' ? '小学' : '初中'}</div>
                  <div>学校数量: {district.schools.length}</div>
                </div>
              </Popup>
            </Polygon>
          )
        })}

        {/* 渲染小区标记 */}
        {(() => {
          // 预先过滤出需要渲染的小区
          const communitiesToRender = allCommunities.filter(({ community }) => {
            // 检查是否在搜索结果中（搜索结果中的小区会单独渲染，这里不重复）
            const isInSearchResults = searchResults.some(
              (r) => r.type === 'community' && r.community?.id === community.id
            )
            
            // 验证location有效性
            const hasValidLocation = community.location && Array.isArray(community.location) && community.location.length === 2
            
            return !isInSearchResults && hasValidLocation
          })
          
          return communitiesToRender.map(({ community, district }) => {
            const isSelected = selectedCommunityId === community.id
            const position: [number, number] = [community.location[1], community.location[0]]
            
            // 使用红色图标高亮显示选中的小区，普通图标显示其他小区
            // 如果isSelected，传递icon prop；否则不传递（使用默认图标）
            const markerProps: any = {
              key: community.id,
              position: position,
            }
            
            if (isSelected && typeof L !== 'undefined' && typeof L.icon === 'function') {
              try {
                markerProps.icon = L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              } catch (error) {
                // 如果icon创建失败，使用默认图标
                console.error('Error creating marker icon:', error)
              }
            }
            
            return (
              <Marker {...markerProps}>
                <Popup>
                  <div>
                    <strong>{community.name}</strong>
                    <div>所属学区: {district.name}</div>
                  </div>
                </Popup>
              </Marker>
            )
          })
        })()}

        {/* 渲染搜索结果中的小区标记（高亮显示） */}
        {searchCommunityMarkers.map((community) => (
          <Marker
            key={`search-${community.id}`}
            position={[community.location[1], community.location[0]]}
            icon={L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <div>
                <strong>{community.name}</strong>
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMapContainer>
    </div>
  )
}

