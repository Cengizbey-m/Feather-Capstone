import { SocialFeed } from '@/components/SocialFeed'

export const SocialPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Social Feed
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Connect with other traders and share market insights
        </p>
      </div>

      {/* Social Feed */}
      <SocialFeed />
    </div>
  )
}
