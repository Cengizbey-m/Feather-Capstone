import { Link } from 'react-router-dom'

interface SidebarItem {
  name: string
  href: string
}

interface SidebarProps {
  navigation: SidebarItem[]
  currentPath: string
  expanded?: boolean
}

export const Sidebar = ({ navigation, currentPath, expanded = false }: SidebarProps) => {
  return (
    <div
      className="flex h-full w-full flex-col bg-gray-900/95 dark:bg-gray-950 border-r border-gray-800/80 dark:border-gray-900 transition-all duration-300"
      aria-label="Primary"
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-gray-800/60 dark:border-gray-900 px-3 py-4 ${
          expanded ? 'justify-start' : 'justify-center'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center">
            <img
              src="/images/image002.png"
              alt="Feather logo"
              className="h-8 w-8 object-contain"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLSpanElement
                if (fallback) fallback.style.display = 'block'
              }}
            />
            <span className="hidden text-xl text-white">🪶</span>
          </div>
          {expanded && (
            <div className="flex flex-col">
              <span className="text-base font-semibold text-white">Feather</span>
              <span className="text-xs uppercase tracking-wider text-gray-400">Research</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = currentPath === item.href

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center rounded-lg font-medium transition-all duration-200 ${
                expanded ? 'px-3 py-2 text-sm' : 'px-2 py-3 text-xs'
              } ${
                isActive
                  ? 'bg-primary-600/90 text-white shadow-inner'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={expanded ? undefined : item.name}
            >
              {expanded ? (
                <span className="flex-1 truncate">{item.name}</span>
              ) : (
                <span className="font-semibold tracking-wide">
                  {item.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
