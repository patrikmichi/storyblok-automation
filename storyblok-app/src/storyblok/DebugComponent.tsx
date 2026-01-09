'use client'

export function DebugComponent({ blok }: { blok: any }) {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50 overflow-auto max-h-96">
      <h3 className="font-bold mb-2">Debug: Component Data</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(blok, null, 2)}
      </pre>
    </div>
  )
}

