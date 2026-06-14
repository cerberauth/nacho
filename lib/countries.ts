export type CountryConfig = {
  slug: string
  label: string
  flag: string
  nationalities: string[]
  isRegion?: boolean
}

export const countries: CountryConfig[] = [
  {
    slug: 'usa',
    label: 'United States',
    flag: '🇺🇸',
    nationalities: ['USA'],
  },
  {
    slug: 'european-union',
    label: 'European Union',
    flag: '🇪🇺',
    nationalities: [
      'Germany', 'France', 'Netherlands', 'Sweden', 'Austria',
      'Belgium', 'Spain', 'Italy', 'Portugal', 'Finland', 'Denmark',
      'Ireland', 'Czech Republic', 'Poland', 'Romania', 'Hungary',
      'Bulgaria', 'Croatia', 'Slovakia', 'Slovenia', 'Estonia',
      'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Cyprus', 'Greece',
    ],
    isRegion: true,
  },
  {
    slug: 'germany',
    label: 'Germany',
    flag: '🇩🇪',
    nationalities: ['Germany'],
  },
  {
    slug: 'australia',
    label: 'Australia',
    flag: '🇦🇺',
    nationalities: ['Australia'],
  },
  {
    slug: 'japan',
    label: 'Japan',
    flag: '🇯🇵',
    nationalities: ['Japan'],
  },
  {
    slug: 'israel',
    label: 'Israel',
    flag: '🇮🇱',
    nationalities: ['Israel'],
  },
  {
    slug: 'switzerland',
    label: 'Switzerland',
    flag: '🇨🇭',
    nationalities: ['Switzerland'],
  },
]

export const getCountryBySlug = (slug: string): CountryConfig | undefined =>
  countries.find((c) => c.slug === slug)

export const getCountryByNationality = (nationality: string): CountryConfig | undefined =>
  countries.find((c) => !c.isRegion && c.nationalities.includes(nationality))

export const getRegionsByNationality = (nationality: string): CountryConfig[] =>
  countries.filter((c) => c.isRegion && c.nationalities.includes(nationality))
