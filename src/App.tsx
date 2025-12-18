import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import NotFound from './pages/NotFound'
import { tools } from './tools'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/tools/calculator" replace />} />
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
      </MainLayout>
    </Router>
  )
}

export default App
