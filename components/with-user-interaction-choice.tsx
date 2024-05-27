import { Server, User } from 'lucide-react'
import { ChoiceCard, type ChoiceCardOption } from "@/components/choice-card"

const userInteractionOptions: Array<ChoiceCardOption<boolean>> = [
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
    <>
      <h3 className="text-xl font-semibold leading-none tracking-tight mb-2">How the token will be retrieved?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
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
    </>
  )
}
