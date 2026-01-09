import { getStoryblokApi } from '@storyblok/react/rsc'
import Link from 'next/link'

export default async function Home() {
  const storyblokApi = getStoryblokApi()
  
  let stories: any[] = []
  try {
    const response = await storyblokApi.get('cdn/stories', {
      version: 'published',
    })
    stories = response.data?.stories || []
  } catch (error) {
    console.error('Error fetching stories:', error)
  }

  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Storyblok Content</h1>
        
        {stories.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Available Pages:</h2>
            <ul className="space-y-2">
              {stories.map((story: any) => (
                <li key={story.id}>
                  <Link
                    href={`/${story.full_slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {story.name} ({story.full_slug})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">No stories found</h2>
            <p className="text-gray-700 mb-4">
              Make sure you have:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Set NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN in .env.local</li>
              <li>Created at least one page in your Storyblok space</li>
              <li>Published the page in Storyblok</li>
            </ul>
          </div>
        )}

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Components Available:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ benefits_section</li>
            <li>✅ benefit_item</li>
            <li>✅ business_types_section</li>
            <li>✅ business_type_card</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
