import payload from '../../packages/payload/src'
import { devUser } from '../credentials'
import { initPayloadTest } from '../helpers/configHelpers'
import { pagesSlug } from './collections/Pages'
import { postsSlug } from './collections/Posts'

require('isomorphic-fetch')

let apiUrl
let jwt

const headers = {
  'Content-Type': 'application/json',
}
const { email, password } = devUser
describe('_Community Tests', () => {
  // --__--__--__--__--__--__--__--__--__
  // Boilerplate test setup/teardown
  // --__--__--__--__--__--__--__--__--__
  beforeAll(async () => {
    const { serverURL } = await initPayloadTest({ __dirname, init: { local: false } })
    apiUrl = `${serverURL}/api`

    const response = await fetch(`${apiUrl}/users/login`, {
      body: JSON.stringify({
        email,
        password,
      }),
      headers,
      method: 'post',
    })

    const data = await response.json()
    jwt = data.token
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy(payload)
    }
  })

  // --__--__--__--__--__--__--__--__--__
  // You can run tests against the local API or the REST API
  // use the tests below as a guide
  // --__--__--__--__--__--__--__--__--__

  it('should populate breadcrumbs from external parent collection', async () => {
    const nestedPost = await payload.find({
      collection: postsSlug,
      where: {
        slug: { equals: 'example-nested-post' },
      },
    })

    expect(nestedPost.docs[0]?.breadcrumbs).toHaveLength(2) // fails
  })

  it('should populate breadcrumbs from the same parent collection', async () => {
    const nestedPage = await payload.find({
      collection: pagesSlug,
      where: {
        slug: { equals: 'example-nested-page' },
      },
    })

    expect(nestedPage.docs[0]?.breadcrumbs).toHaveLength(2) // passes
  })
})
