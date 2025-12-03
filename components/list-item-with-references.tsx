import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export function ListItemWithReferences({ name, references }: { name: string, references: string[] }) {
  return (
    <li>
      {name}
      {' '}
      (<Link href={references[0]} target="_blank" className="inline-flex text-xs underline">
        Reference
        <ArrowUpRight className="w-3 h-3 ml-1 inline-block" />
      </Link>)
    </li>
  )
}
