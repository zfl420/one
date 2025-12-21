import { useState, useEffect } from 'react'
import { Row, Col, Card, Tabs, message } from 'antd'
import MapContainer from './MapContainer'
import SearchBar from './SearchBar'
import DrawingControls from './DrawingControls'
import DistrictList from './DistrictList'
import CommunityList from './CommunityList'
import DistrictFormModal from './DistrictFormModal'
import CommunityFormModal from './CommunityFormModal'
import { useSchoolDistrictMapStore } from './school-district-map.store'
import { SearchResult, DistrictType } from './types'
import { verifyPassword } from './school-district-map.store'
import { findDistrictByLocation } from './utils'

export default function SchoolDistrictMap() {
  const {
    districts,
    currentType,
    setCurrentType,
    isDrawing,
    setIsDrawing,
    isAuthenticated,
    setAuthenticated,
    searchResults,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedCommunityId,
    setSelectedCommunityId,
    saveDistrict,
    addCommunityToDistrict,
    loadDistricts,
  } = useSchoolDistrictMapStore()

  // Tab类型扩展
  type TabType = 'primary' | 'middle' | 'community'

  const [districtFormVisible, setDistrictFormVisible] = useState(false)
  const [communityFormVisible, setCommunityFormVisible] = useState(false)
  const [pendingCommunityLocation, setPendingCommunityLocation] = useState<[number, number] | null>(null)
  const [isMarkerMode, setIsMarkerMode] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [password, setPassword] = useState('')
  // 存储待创建学区的信息（在绘制前收集）
  const [pendingDistrictInfo, setPendingDistrictInfo] = useState<{
    name: string
    type: DistrictType
    schools: string[]
  } | null>(null)

  // 加载数据
  useEffect(() => {
    loadDistricts()
  }, [loadDistricts])

  // 处理绘制完成
  const handlePolygonComplete = (polygon: number[][]) => {
    if (polygon.length < 3) {
      message.warning('多边形至少需要3个点')
      setIsDrawing(false)
      return
    }

    // 如果已有待创建学区信息，直接保存
    if (pendingDistrictInfo) {
      const newDistrictData = {
        name: pendingDistrictInfo.name,
        type: pendingDistrictInfo.type,
        polygon,
        schools: pendingDistrictInfo.schools || [],
      }
      
      // 保存学区（saveDistrict是同步的）
      saveDistrict(newDistrictData)
      
      // 获取保存后的districts，找到最新创建的学区（ID最大的）
      const newDistricts = useSchoolDistrictMapStore.getState().districts
      if (newDistricts.length > 0) {
        const newDistrict = newDistricts.reduce((latest, current) => {
          return parseInt(current.id) > parseInt(latest.id) ? current : latest
        }, newDistricts[0])
        
        // 自动选中新创建的学区
        setSelectedDistrictId(newDistrict.id)
        // 切换到对应的tab
        setCurrentType(newDistrict.type)
        setActiveTab(newDistrict.type)
      }
      
      // 清除待创建信息
      setPendingDistrictInfo(null)
      setIsDrawing(false)
      message.success('学区保存成功')
    } else {
      // 如果没有待创建信息，说明流程异常，取消绘制
      setIsDrawing(false)
      message.error('学区信息丢失，请重新开始')
    }
  }

  // 保存学区（表单确认后，开始绘制）
  const handleSaveDistrictInfo = (data: {
    name: string
    type: DistrictType
    schools: string[]
  }) => {
    // 保存待创建学区信息
    setPendingDistrictInfo(data)
    // 关闭表单
    setDistrictFormVisible(false)
    // 开始绘制
    setIsDrawing(true)
    message.info('请在地图上绘制学区范围')
  }

  // 处理搜索结果选择
  const handleSearchResultSelect = (result: SearchResult) => {
    if (result.type === 'district' && result.district) {
      setSelectedDistrictId(result.district.id)
    } else if (result.type === 'community' && result.community) {
      setSelectedDistrictId(null)
      // 地图会自动定位到小区位置
    }
  }

  // 处理手动标记
  const handleManualMark = () => {
    setIsMarkerMode(true)
    message.info('请在地图上点击标记小区位置')
  }

  // 处理地图点击（标记模式）
  const handleMapMarkerClick = (location: [number, number]) => {
    if (!isMarkerMode) return

    setPendingCommunityLocation(location)
    setCommunityFormVisible(true)
    setIsMarkerMode(false)
  }

  // 保存小区
  const handleSaveCommunity = (name: string) => {
    if (!pendingCommunityLocation) return

    // 查找小区所属的学区
    const district = findDistrictByLocation(pendingCommunityLocation, districts)

    if (district) {
      addCommunityToDistrict(district.id, {
        name,
        location: pendingCommunityLocation,
      })
      message.success(`小区已添加到学区：${district.name}`)
    } else {
      message.warning('该位置不在任何学区范围内，无法添加')
    }

    setCommunityFormVisible(false)
    setPendingCommunityLocation(null)
  }

  // 处理开始绘制（进入/退出编辑状态）
  const handleStartDrawing = () => {
    if (isAuthenticated) {
      // 如果已认证，退出编辑状态
      setAuthenticated(false)
      setIsDrawing(false)
      setPendingDistrictInfo(null)
      message.info('已退出编辑模式')
    } else {
      // 如果未认证，弹出密码框
      setPasswordModalVisible(true)
    }
  }

  // 处理取消绘制（绘制过程中取消）
  const handleCancelDrawing = () => {
    setIsDrawing(false)
    setPendingDistrictInfo(null)
    message.info('已取消绘制')
  }

  // 处理密码验证
  const handlePasswordSubmit = () => {
    if (verifyPassword(password)) {
      setAuthenticated(true)
      setPasswordModalVisible(false)
      setPassword('')
      message.success('验证成功，已进入编辑模式')
      // 验证成功后只进入编辑状态，不弹出表单，不开始绘制
    } else {
      message.error('密码错误')
    }
  }

  // 处理新建学区（点击新建按钮时调用）
  const handleNewDistrict = () => {
    setDistrictFormVisible(true)
  }

  // Tab切换
  const handleTabChange = (key: string) => {
    setActiveTab(key as TabType)
    if (key === 'community') {
      // 小区tab不需要设置currentType，保持当前值
      setSelectedDistrictId(null)
    } else {
      setCurrentType(key as DistrictType)
      setSelectedDistrictId(null)
      // 切换到学区tab时，清除选中的小区
      setSelectedCommunityId(null)
    }
  }

  // 处理绘制按钮点击（切换编辑状态）
  const handleDrawingButtonClick = () => {
    if (isDrawing) {
      // 如果正在绘制，取消绘制
      handleCancelDrawing()
    } else {
      // 否则，切换编辑状态（进入或退出）
      handleStartDrawing()
    }
  }

  const [activeTab, setActiveTab] = useState<TabType>('primary')

  const tabItems = [
    {
      key: 'primary',
      label: '小学',
      children: <DistrictList onDistrictSelect={(d) => setSelectedDistrictId(d.id)} />,
    },
    {
      key: 'middle',
      label: '初中',
      children: <DistrictList onDistrictSelect={(d) => setSelectedDistrictId(d.id)} />,
    },
    {
      key: 'community',
      label: '小区',
      children: <CommunityList onCommunitySelect={(communityId) => setSelectedCommunityId(communityId)} />,
    },
  ]

  return (
    <div 
      className="school-district-map-container"
      style={{ 
        overflow: 'hidden', 
        margin: 0, 
        padding: 0
      }}
    >
      <Row gutter={0} style={{ height: '100%', margin: 0 }}>
        {/* 左侧地图区域 */}
        <Col xs={24} lg={16} style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0 }}>
          {/* 地图（自适应高度） */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <MapContainer
              districts={districts}
              isDrawing={isDrawing}
              isAuthenticated={isAuthenticated}
              selectedDistrictId={selectedDistrictId}
              selectedCommunityId={selectedCommunityId}
              searchResults={searchResults}
              onPolygonComplete={handlePolygonComplete}
              onMarkerClick={isMarkerMode ? handleMapMarkerClick : undefined}
              onDrawingButtonClick={handleDrawingButtonClick}
              onNewDistrictClick={handleNewDistrict}
              activeTab={activeTab}
            />
          </div>
        </Col>

        {/* 右侧面板 */}
        <Col xs={24} lg={8} style={{ height: '100%' }}>
          <Card
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 0,
            }}
            bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {/* 搜索框（右侧顶部） */}
            <div style={{ padding: '16px', flexShrink: 0, borderBottom: '1px solid #f0f0f0' }}>
              <SearchBar
                onSearchResultSelect={handleSearchResultSelect}
                onManualMark={handleManualMark}
              />
            </div>

            {/* Tab切换和列表 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, paddingLeft: '16px' }}>
              <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={tabItems}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 学区信息输入对话框（绘制前填写） */}
      <DistrictFormModal
        visible={districtFormVisible}
        districtType={currentType}
        onSave={handleSaveDistrictInfo}
        onCancel={() => {
          setDistrictFormVisible(false)
          setPendingDistrictInfo(null)
        }}
      />

      {/* 小区信息输入对话框 */}
      {pendingCommunityLocation && (
        <CommunityFormModal
          visible={communityFormVisible}
          location={pendingCommunityLocation}
          onSave={handleSaveCommunity}
          onCancel={() => {
            setCommunityFormVisible(false)
            setPendingCommunityLocation(null)
          }}
        />
      )}

      {/* 密码输入对话框 */}
      <DrawingControls
        visible={passwordModalVisible}
        password={password}
        onPasswordChange={setPassword}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          setPasswordModalVisible(false)
          setPassword('')
        }}
      />
      <style>{`
        .school-district-map-container {
          height: calc(100vh - 64px);
        }
        @media (min-width: 993px) {
          .school-district-map-container {
            height: 100vh;
          }
        }
      `}</style>
    </div>
  )
}

