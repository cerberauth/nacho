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
