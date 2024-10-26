export enum ApplicationTypes {
  spa = 'spa',
  webApplication = 'webApplication',
  mobileApplication = 'mobileApplication',
  desktopApplication = 'desktopApplication',
  machineToMachine = 'machineToMachine',
  cli = 'cli',
  smartTvAndLimitedInputDevice = 'smartTvAndLimitedInputDevice',
}

export enum GrantTypes {
  authorizationCode = 'authorization_code',
  pkce = 'pkce',
  refreshToken = 'refresh_token',
  clientCredentials = 'client_credentials',
  implicit = 'implicit',
  jwtBearer = 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  deviceCode = 'urn:ietf:params:oauth:grant-type:device_code',
}

export enum TokenEndpointAuthMethods {
  none = 'none',
  clientSecretPost = 'client_secret_post',
  clientSecretBasic = 'client_secret_basic',
  mtls = 'mtls',
}

export const applicationTypeImplementationRecommendation = [
  {
    types: [ApplicationTypes.spa],
    references: [
      'https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps',
    ],
  },

  {
    types: [ApplicationTypes.mobileApplication, ApplicationTypes.desktopApplication],
    references: [
      'https://datatracker.ietf.org/doc/html/rfc8252',
    ],
  },
]

export const applicationTypes = [
  {
    id: 'spa',
    value: ApplicationTypes.spa,
    label: 'SPA (Single Page Application)',
    description: 'Frontend application without server side rendering.',
    withUserInteraction: true,
    technologies: ['React', 'Angular', 'Vue', 'Svelte'],
  },
  {
    id: 'webApplication',
    value: ApplicationTypes.webApplication,
    label: 'Web Application',
    description: 'Web application with server side rendering.',
    withUserInteraction: true,
    technologies: ['PHP', 'Java', '.Net', 'Node.JS', 'NextJS', 'Nuxt'],
  },
  {
    id: 'mobileApplication',
    value: ApplicationTypes.mobileApplication,
    label: 'Mobile Application',
    description: 'Mobile application for iOS and Android.',
    withUserInteraction: true,
    technologies: ['iOS', 'Android', 'Flutter', 'React Native', 'Xamarin'],
  },
  {
    id: 'desktopApplication',
    value: ApplicationTypes.desktopApplication,
    label: 'Desktop Application',
    description: 'Desktop application for Windows, macOS and Linux.',
    withUserInteraction: true,
    technologies: ['Electron', 'Java', 'C#', 'C++'],
  },
  {
    id: 'machineToMachine',
    value: ApplicationTypes.machineToMachine,
    label: 'Machine to Machine',
    description: 'Cron jobs, daemons, microservice to microservice, ...',
    withUserInteraction: false,
    technologies: ['Node.JS', 'Python', 'Go', 'Java', 'C#', 'PHP'],
  },
  {
    id: 'cli',
    value: ApplicationTypes.cli,
    label: 'CLI',
    description: 'Command Line Interface applications',
    withUserInteraction: false,
    technologies: ['Shell', 'Python', 'Node.JS', 'Go'],
  },
  {
    id: 'smartTvAndLimitedInputDevice',
    value: ApplicationTypes.smartTvAndLimitedInputDevice,
    label: 'Smart TV and Limited Input Device',
    description: 'Applications for Smart TVs, Encoders and more globally device with limited capability for inputting text.',
    withUserInteraction: true,
    technologies: ['Android TV', 'Apple TV', 'Roku', 'Fire TV'],
  },
]

export const grantTypes = [
  {
    id: GrantTypes.authorizationCode,
    label: 'Authorization Code',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1',
    ],
  },

  {
    id: GrantTypes.pkce,
    label: 'PKCE',
    references: [
      'https://tools.ietf.org/html/rfc7636',
    ],
  },

  {
    id: GrantTypes.refreshToken,
    label: 'Refresh Token',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-1.5',
    ],
  },

  {
    id: GrantTypes.clientCredentials,
    label: 'Client Credentials',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.4',
    ],
  },

  {
    id: GrantTypes.deviceCode,
    label: 'Device Code',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc8628',
    ],
  },

  {
    id: GrantTypes.implicit,
    label: 'Implicit',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.2',
    ],
  },

  {
    id: GrantTypes.jwtBearer,
    label: 'JWT Bearer',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc7523',
    ],
  },
]

export const tokenAuthenticationMethods = [
  {
    id: TokenEndpointAuthMethods.none,
    label: 'None',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc7636#section-4.5',
    ],
  },
  {
    id: TokenEndpointAuthMethods.clientSecretPost,
    label: 'Client Secret Post',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-2.3.1',
    ],
  },
  {
    id: TokenEndpointAuthMethods.clientSecretBasic,
    label: 'Client Secret Basic',
    references: [
      'https://datatracker.ietf.org/doc/html/rfc6749#section-2.3.1',
    ],
  },
  // {
  //   id: TokenEndpointAuthMethods.mtls,
  //   label: 'Mutual TLS',
  //   references: [
  //     'https://datatracker.ietf.org/doc/html/rfc8705',
  //   ],
  // },
]
