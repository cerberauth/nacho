export enum ApplicationType {
  spa = 'spa',
  webApplication = 'webApplication',
  mobileApplication = 'mobileApplication',
  desktopApplication = 'desktopApplication',
  machineToMachine = 'machineToMachine',
  cli = 'cli',
  smartTvAndLimitedInputDevice = 'smartTvAndLimitedInputDevice',
}

export enum GrantType {
  authorizationCodeWithPKCE = 'authorizationCodeWithPKCE',
  clientCredentials = 'clientCredentials',
  deviceCode = 'deviceCode',
}

export enum TokenEndpointAuthMethod {
  none = 'none',
  clientSecretPost = 'clientSecretPost',
  clientSecretBasic = 'clientSecretBasic',
  mtls = 'mtls',
}

export const applicationTypeImplementationRecommendation = [
  {
    types: [ApplicationType.spa],
    references: [
      'https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps',
    ],
  },

  {
    types: [ApplicationType.mobileApplication, ApplicationType.desktopApplication],
    references: [
      'https://datatracker.ietf.org/doc/html/rfc8252',
    ],
  },
]

export const applicationTypes = [
  {
    id: 'spa',
    value: ApplicationType.spa,
    label: 'SPA (Single Page Application)',
    description: 'Frontend application without server side rendering.',
    withUserInteraction: true,
    technologies: ['React', 'Angular', 'Vue', 'Svelte'],
  },
  {
    id: 'webApplication',
    value: ApplicationType.webApplication,
    label: 'Web Application',
    description: 'Web application with server side rendering.',
    withUserInteraction: true,
    technologies: ['PHP', 'Java', '.Net', 'Node.JS', 'NextJS', 'Nuxt'],
  },
  {
    id: 'mobileApplication',
    value: ApplicationType.mobileApplication,
    label: 'Mobile Application',
    description: 'Mobile application for iOS and Android.',
    withUserInteraction: true,
    technologies: ['iOS', 'Android', 'Flutter', 'React Native', 'Xamarin'],
  },
  {
    id: 'desktopApplication',
    value: ApplicationType.desktopApplication,
    label: 'Desktop Application',
    description: 'Desktop application for Windows, macOS and Linux.',
    withUserInteraction: true,
    technologies: ['Electron', 'Java', 'C#', 'C++'],
  },
  {
    id: 'machineToMachine',
    value: ApplicationType.machineToMachine,
    label: 'Machine to Machine',
    description: 'Cron jobs, daemons, microservice to microservice, ...',
    withUserInteraction: false,
    technologies: ['Node.JS', 'Python', 'Go', 'Java', 'C#', 'PHP'],
  },
  {
    id: 'cli',
    value: ApplicationType.cli,
    label: 'CLI',
    description: 'Command Line Interface applications',
    withUserInteraction: false,
    technologies: ['Shell', 'Python', 'Node.JS', 'Go'],
  },
  {
    id: 'smartTvAndLimitedInputDevice',
    value: ApplicationType.smartTvAndLimitedInputDevice,
    label: 'Smart TV and Limited Input Device',
    description: 'Applications for Smart TVs, Encoders and more globally device with limited capability for inputting text.',
    withUserInteraction: true,
    technologies: ['Android TV', 'Apple TV', 'Roku', 'Fire TV'],
  },
]

export const grantTypes = [
  {
    id: GrantType.authorizationCodeWithPKCE,
    label: 'Authorization Code with PKCE',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1',
      'https://tools.ietf.org/html/rfc7636',
    ],
  },

  {
    id: GrantType.clientCredentials,
    label: 'Client Credentials',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.4',
    ],
  },

  {
    id: GrantType.deviceCode,
    label: 'Device Code',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc8628',
    ],
  },
]

export const tokenAuthenticationMethods = [
  {
    id: TokenEndpointAuthMethod.none,
    label: 'None',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc7636#section-4.5',
    ],
  },
  {
    id: TokenEndpointAuthMethod.clientSecretPost,
    label: 'Client Secret Post',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-2.3.1',
    ],
  },
  {
    id: TokenEndpointAuthMethod.clientSecretBasic,
    label: 'Client Secret Basic',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-2.3.1',
    ],
  },
  {
    id: TokenEndpointAuthMethod.mtls,
    label: 'Mutual TLS',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc8705',
    ],
  },
]
