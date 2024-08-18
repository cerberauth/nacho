import { AppWindowMac, Monitor, PanelTop, Server, SquareTerminal, TabletSmartphone, Tv } from 'lucide-react'

type ApplicationTypeIconProps = {
  type: ApplicationType
}

export function ApplicationTypeIcon({ type }: ApplicationTypeIconProps) {
  switch (type) {
    case 'spa':
      return <PanelTop className="w-8 h-8 text-primary" />
    case 'webApplication':
      return <AppWindowMac className="w-8 h-8 text-primary" />
    case 'mobileApplication':
      return <TabletSmartphone className="w-8 h-8 text-primary" />
    case 'desktopApplication':
      return <Monitor className="w-8 h-8 text-primary" />
    case 'machineToMachine':
      return <Server className="w-8 h-8 text-primary" />
    case 'cli':
      return <SquareTerminal className="w-8 h-8 text-primary" />
    case 'smartTvAndLimitedInputDevice':
      return <Tv className="w-8 h-8 text-primary" />
    default:
      return null
  }
}
