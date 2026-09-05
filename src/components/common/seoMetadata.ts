export const BASE_URL = 'https://www.manatuner.app'

export const PAGE_TITLES: Record<string, string> = {
  '/analyzer': 'Deck Analyzer',
  '/mathematics': 'Mathematics',
  '/land-glossary': 'Land Glossary',
  '/guide': 'User Guide',
  '/library': 'Reading Library',
  '/my-analyses': 'My Analyses',
  '/about': 'About',
  '/privacy': 'Privacy',
}

interface BreadcrumbItem {
  '@type': 'ListItem'
  position: number
  name: string
  item: string
}

export function buildBreadcrumbs(path: string): Record<string, unknown> {
  const items: BreadcrumbItem[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${BASE_URL}/`,
    },
  ]
  if (path && path !== '/') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: PAGE_TITLES[path] || path.replace(/^\//, ''),
      item: `${BASE_URL}${path}`,
    })
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}
