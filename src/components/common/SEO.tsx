import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { BASE_URL, buildBreadcrumbs } from './seoMetadata'

interface SEOProps {
  title: string
  description: string
  path: string
  ogImage?: string
  jsonLd?: Record<string, unknown>
  noindex?: boolean
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  ogImage = `${BASE_URL}/og-image-v4.jpg`,
  jsonLd,
  noindex = false,
}) => {
  const url = `${BASE_URL}${path}`
  // Escape `<` so any literal `</script>` in serialized fields cannot
  // break out of the JSON-LD <script> block. Harmless for parsers
  // (they'll decode \u003c), critical if a future seed ever contains
  // `</script>` in a curatorNote or description.
  const jsonLdString = useMemo(
    () => (jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : null),
    [jsonLd]
  )
  const breadcrumbsString = useMemo(
    () => (noindex ? null : JSON.stringify(buildBreadcrumbs(path)).replace(/</g, '\\u003c')),
    [path, noindex]
  )

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="ManaTuner" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdString && <script type="application/ld+json">{jsonLdString}</script>}
      {breadcrumbsString && <script type="application/ld+json">{breadcrumbsString}</script>}
    </Helmet>
  )
}
