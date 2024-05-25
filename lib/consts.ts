export enum ApplicationType {
  spa = 'SPA',
  webApplication = 'Server Web Application',
  mobileApplication = 'Mobile Application',
  machineToMachine = 'Machine to Machine',
  cli = 'CLI',
  smartTvAndLimitedInputDevice = 'Smart TV and Limited Input Device',
}

export enum GrantType {
  authorizationCodeWithPKCE = 'Authorization Code with PKCE',
  clientCredentials = 'Client Credentials',
  deviceCode = 'Device Code',
}
