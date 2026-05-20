import Link from 'next/link'

type InaccuracyDict = {
  note: string
  text: string
  openIssue: string
  textAfter: string
}

const defaultDict: InaccuracyDict = {
  note: 'Note:',
  text: 'The current data is based on provider documentation/experience and may not be 100% accurate. Please',
  openIssue: 'open an issue',
  textAfter: 'if you have spotted any inconsistencies.',
}

type Props = {
  dict?: InaccuracyDict
}

export function ProviderInaccuracyWarning({ dict = defaultDict }: Props) {
  return (
    <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
      <strong>{dict.note}</strong> {dict.text}{' '}
      <Link href="https://github.com/cerberauth/nacho/issues" rel="nofollow" target="_blank">{dict.openIssue}</Link>{' '}
      {dict.textAfter}
    </p>
  )
}
