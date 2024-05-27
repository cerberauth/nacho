import { AppWindowMac, Monitor, PanelTop, Server, SquareTerminal, TabletSmartphone, Tv } from 'lucide-react'
import { ApplicationType } from '../lib/consts'
import { ChoiceCard, ChoiceCardOption } from '@/components/choice-card'

type ApplicationTypeOption = ChoiceCardOption<keyof typeof ApplicationType> & {
  withUserInteraction: boolean
  technologies: string[]
}

const applicationTypeOptions: ApplicationTypeOption[] = [
  {
    id: 'spa',
    value: ApplicationType.spa,
    label: 'SPA (Single Page Application)',
    description: 'Frontend application without server side rendering.',
    icon: <PanelTop className="w-8 h-8 text-primary" />,
    withUserInteraction: true,
    technologies: ['React', 'Angular', 'Vue', 'Svelte'],
  },
  {
    id: 'webApplication',
    value: ApplicationType.webApplication,
    label: 'Web Application',
    description: 'Web application with server side rendering.',
    icon: <AppWindowMac className="w-8 h-8 text-primary" />,
    withUserInteraction: true,
    technologies: ['PHP', 'Java', '.Net', 'Node.JS', 'NextJS', 'Nuxt'],
  },
  {
    id: 'mobileApplication',
    value: ApplicationType.mobileApplication,
    label: 'Mobile Application',
    description: 'Mobile application for iOS and Android.',
    icon: <TabletSmartphone className="w-8 h-8 text-primary" />,
    withUserInteraction: true,
    technologies: ['iOS', 'Android', 'Flutter', 'React Native', 'Xamarin'],
  },
  {
    id: 'desktopApplication',
    value: ApplicationType.desktopApplication,
    label: 'Desktop Application',
    description: 'Desktop application for Windows, macOS and Linux.',
    icon: <Monitor className="w-8 h-8 text-primary" />,
    withUserInteraction: true,
    technologies: ['Electron', 'Java', 'C#', 'C++'],
  },
  {
    id: 'machineToMachine',
    value: ApplicationType.machineToMachine,
    label: 'Machine to Machine',
    description: 'Cron jobs, daemons, microservice to microservice, ...',
    icon: <Server className="w-8 h-8 text-primary" />,
    withUserInteraction: false,
    technologies: ['Node.JS', 'Python', 'Go', 'Java', 'C#', 'PHP'],
  },
  {
    id: 'cli',
    value: ApplicationType.cli,
    label: 'CLI',
    description: 'Command Line Interface applications',
    icon: <SquareTerminal className="w-8 h-8 text-primary" />,
    withUserInteraction: false,
    technologies: ['Shell', 'Python', 'Node.JS', 'Go'],
  },
  {
    id: 'smartTvAndLimitedInputDevice',
    value: ApplicationType.smartTvAndLimitedInputDevice,
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
    <>
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
    </>
  )
}
