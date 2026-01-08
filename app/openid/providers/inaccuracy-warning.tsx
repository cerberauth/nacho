import Link from 'next/link'

export function ProviderInaccuracyWarning() {
  return (
    <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
      <strong>Note:</strong> The current data is based on provider documentation/experience and may not be 100% accurate.
      Please <Link href="https://github.com/cerberauth/nacho/issues" rel="nofollow" target="_blank">open an issue</Link> if you
      have spotted any inconsistencies.
    </p>
  )
}
