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
  authorizationCode = 'authorization_code',
  pkce = 'pkce',
  refreshToken = 'refresh_token',
  clientCredentials = 'client_credentials',
  implicit = 'implicit',
  jwtBearer = 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  deviceCode = 'urn:ietf:params:oauth:grant-type:device_code',
}

export enum TokenEndpointAuthMethod {
  none = 'none',
  clientSecretPost = 'client_secret_post',
  clientSecretBasic = 'client_secret_basic',
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
    id: GrantType.authorizationCode,
    label: 'Authorization Code',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1',
    ],
  },

  {
    id: GrantType.pkce,
    label: 'PKCE',
    references: [
      'https://tools.ietf.org/html/rfc7636',
    ],
  },

  {
    id: GrantType.refreshToken,
    label: 'Refresh Token',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-1.5',
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

  {
    id: GrantType.implicit,
    label: 'Implicit',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.2',
    ],
  },

  {
    id: GrantType.jwtBearer,
    label: 'JWT Bearer',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc7523',
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
