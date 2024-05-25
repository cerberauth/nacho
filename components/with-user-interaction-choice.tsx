import { Server, User } from 'lucide-react'
import { ChoiceCard } from "@/components/choice-card"

interface UserInteraction {
  id: string
  value: boolean
  label: string
  description: string
  icon: React.ReactNode
}

const userInteractionOptions: UserInteraction[] = [
  {
    id: 'yes',
    value: true,
    label: 'User Log In',
    description: 'User log in and may consent through an interface.',
    icon: <User className="w-8 h-8 text-primary" />,
  },
  {
    id: 'no',
    value: false,
    label: 'No User Interaction',
    description: 'No user interaction is needed. The application runs in the background or as a service.',
    icon: <Server className="w-8 h-8 text-primary" />,
  },
]

type WithUserInteractionChoiceProps = {
  onChange: (userInteraction: boolean) => void;
}

export function WithUserInteractionChoice({ onChange }: WithUserInteractionChoiceProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">How the token will be retrieved?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userInteractionOptions.map((option) => (
          <ChoiceCard
            key={option.id}
            title={option.label}
            description={option.description}
            icon={option.icon}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  )
}
