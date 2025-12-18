export interface ToolConfig {
  id: string
  name: string
  category: 'math' | 'text' | 'convert' | 'image' | 'dev' | 'other'
  icon: string
  component: React.ComponentType
  route: string
  description?: string
}
