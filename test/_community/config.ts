import { buildConfigWithDefaults } from '../buildConfigWithDefaults'
import { devUser } from '../credentials'
import { PostsCollection, postsSlug } from './collections/Posts'
import { PagesCollection, pagesSlug } from './collections/Pages'
import type { Post, Page } from './payload-types'

import nestedDocs from '../../packages/plugin-nested-docs/src'

export default buildConfigWithDefaults({
  collections: [PagesCollection, PostsCollection],
  graphQL: {
    schemaOutputFile: './test/_community/schema.graphql',
  },
  plugins: [
    nestedDocs({
      collections: [pagesSlug, postsSlug],
      generateLabel: (_, doc) => doc.slug as string,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
  ],

  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    const page = await payload.create({
      collection: pagesSlug,
      data: {
        slug: 'example-page',
      },
    })

    await payload.create({
      collection: pagesSlug,
      data: {
        slug: 'example-nested-page',
        parent: page.id.toString(),
      } satisfies Partial<Page>,
    })

    await payload.create({
      collection: postsSlug,
      data: {
        slug: 'example-nested-post',
        parent: page.id.toString(),
      } satisfies Partial<Post>,
    })
  },
})
