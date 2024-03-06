import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types'
import createParentField from '../../../../packages/plugin-nested-docs/src/fields/parent'

import { pagesSlug } from '../Pages'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  fields: [
    // Creates a parent field with a relationship to Pages
    createParentField(pagesSlug),
    {
      name: 'slug',
      type: 'text',
    },
  ],
  slug: postsSlug,
}
