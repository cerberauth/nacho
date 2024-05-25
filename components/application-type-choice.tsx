import { AppWindowMac, PanelTop, Server, SquareTerminal, TabletSmartphone, Tv } from 'lucide-react'
import { ApplicationType } from '../lib/consts'
import { ChoiceCard } from '@/components/choice-card'

interface ApplicationTypeOption {
  value: keyof typeof ApplicationType
  label: string
  description: string
  icon: React.ReactNode
  withUserInteraction: boolean
  technologies: string[]
}

const applicationTypeOptions: ApplicationTypeOption[] = [
  {
    value: 'spa',
    label: 'SPA (Single Page Application)',
    description: 'Frontend application without server side rendering.',
    icon: <PanelTop className="w-8 h-8 text-primary" />,
    withUserInteraction: true,
    technologies: ['React', 'Angular', 'Vue', 'Svelte'],
  },
  {
    value: 'webApplication',
    label: 'Web Application',
    description: 'Web application with server side rendering.',
    icon: <AppWindowMac className="w-8 h-8 text-primary" />,
    withUserInteraction: true,
    technologies: ['PHP', 'Java', '.Net', 'Node.JS', 'NextJS', 'Nuxt'],
  },
  {
    value: 'mobileApplication',
    label: 'Mobile Application',
    description: 'Mobile application for iOS and Android.',
    icon: <TabletSmartphone className="w-8 h-8 text-primary" />,
    withUserInteraction: true,
    technologies: ['iOS', 'Android', 'Flutter', 'React Native', 'Xamarin'],
  },
  {
    value: 'machineToMachine',
    label: 'Machine to Machine',
    description: 'Cron jobs, daemons, microservice to microservice, ...',
    icon: <Server className="w-8 h-8 text-primary" />,
    withUserInteraction: false,
    technologies: ['Node.JS', 'Python', 'Go', 'Java', 'C#', 'PHP'],
  },
  {
    value: 'cli',
    label: 'CLI',
    description: 'Command Line Interface applications',
    icon: <SquareTerminal className="w-8 h-8 text-primary" />,
    withUserInteraction: false,
    technologies: ['Shell', 'Python', 'Node.JS', 'Go'],
  },
  {
    value: 'smartTvAndLimitedInputDevice',
    label: 'Smart TV and Limited Input Device',
    description: 'Applications for Smart TVs, Encoders and more globally device with limited capability for inputting text.',
    icon: <Tv className="w-8 h-8 text-primary" />,
    withUserInteraction: true,
    technologies: ['Android TV', 'Apple TV', 'Roku', 'Fire TV'],
  },
]

type ApplicationTypeGridProps = {
  withUserInteraction: boolean
  onChange: (type: keyof typeof ApplicationType) => void
}

export function ApplicationTypeChoice({ withUserInteraction, onChange }: ApplicationTypeGridProps) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-4">What is the type of application?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {applicationTypeOptions.filter(option => option.withUserInteraction === withUserInteraction).map(option => (
          <ChoiceCard
            key={option.value}
            title={option.label}
            description={option.description}
            icon={option.icon}
            onClick={() => onChange(option.value)}
            technologies={option.technologies}
          />
        ))}
      </div>
    </div>
  )
}
