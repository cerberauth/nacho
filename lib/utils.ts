import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCountryFlag(nationality: string | undefined): string {
  if (!nationality) return ''
  
  const flagMap: Record<string, string> = {
    'USA': '🇺🇸',
    'Germany': '🇩🇪',
    'Switzerland': '🇨🇭',
    'Australia': '🇦🇺',
    'Japan': '🇯🇵',
    'Israel': '🇮🇱',
    'UK': '🇬🇧',
    'Canada': '🇨🇦',
    'France': '🇫🇷',
  }

  return flagMap[nationality] || nationality
}

