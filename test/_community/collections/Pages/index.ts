import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types'

export const pagesSlug = 'pages'

export const PagesCollection: CollectionConfig = {
  fields: [
    {
      name: 'slug',
      type: 'text',
    },
  ],
  slug: pagesSlug,
}
