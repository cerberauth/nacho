import clsx from 'clsx'

export interface ChoiceCardOption<T = string> {
  id: string
  value: T
  label: string
  description: string
  icon: React.ReactNode
}

type ChoiceCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  technologies?: string[]
  className?: string
}

export function ChoiceCard({ title, description, icon, onClick, technologies, className }: ChoiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx("space-y-4 bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer", className)}
    >
      <div className="flex flex-col items-center space-y-4">
        {icon}
        <h3 className="text-lg text-center font-semibold">{title}</h3>
      </div>
      {description && (
        <p className="text-gray-500 text-center">{description}</p>
      )}
      {Array.isArray(technologies) && technologies.length > 0 && (
        <p className="text-xs text-gray-400 text-center">{technologies.join(', ')}</p>
      )}
    </div>
  )
}

type MiniChoiceCardProps = {
  className?: string
  icon: React.ReactNode
  title: string
  onClick: () => void
}

export function MiniChoiceCard({ className, icon, title, onClick }: MiniChoiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx("bg-white dark:bg-gray-950 rounded-lg shadow-sm p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer", className)}
    >
      <div className="flex flex-col items-center space-y-4">
        {icon}
        <h3 className="w-full max-w-10 text-sm text-center font-semibold">{title}</h3>
      </div>
    </div>
  )
}
