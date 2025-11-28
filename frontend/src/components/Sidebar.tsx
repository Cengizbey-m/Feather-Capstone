import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface SidebarProps {
  navigation: Array<{
    name: string
    href: string
    icon: LucideIcon
  }>
  currentPath: string
  expanded?: boolean
}

export const Sidebar = ({ navigation, currentPath, expanded = false }: SidebarProps) => {
  return (
    <div className={`flex flex-col h-full pt-16 bg-gray-800 dark:bg-gray-900 border-r border-gray-700 dark:border-gray-800 transition-all duration-300 ${
      expanded ? 'w-64' : 'w-16'
    }`}>
      {/* Logo at top */}
      <div className={`flex items-center px-3 py-4 border-b border-gray-700 dark:border-gray-800 ${expanded ? 'justify-start' : 'justify-center'}`}>
        <div className="flex items-center justify-center w-8 h-8">
          <img 
            src="/images/image002.png" 
            alt="Feather Logo" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement
              target.style.display = 'none'
              const nextSibling = target.nextElementSibling as HTMLElement
              if (nextSibling) nextSibling.style.display = 'block'
            }}
          />
          <span className="text-white text-lg hidden">🪶</span>
        </div>
        {expanded && (
          <span className="ml-3 text-white font-bold text-lg">Feather</span>
        )}
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.href
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } ${expanded ? 'justify-start' : 'justify-center'}`}
              title={expanded ? undefined : item.name}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${expanded ? 'mr-3' : ''}`} />
              {expanded && (
                <span className="flex-1 whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
