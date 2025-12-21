import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import MainLayout from './components/Layout/MainLayout'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import { tools } from './tools'

// 加载占位符组件
const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    }}
  >
    <Spin size="large" tip="加载中..." />
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <MainLayout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              {tools.map((tool) => (
                <Route
                  key={tool.id}
                  path={tool.route}
                  element={<tool.component />}
                />
              ))}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </Router>
    </ErrorBoundary>
  )
}

export default App
