import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { ArticlesCollection } from './collections/Articles/index.js'
import { MediaCollection } from './collections/Media/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import { UsersCollection } from './collections/Users/index.js'
import {
  loginEndpoint,
  logoutEndpoint,
  meEndpoint,
  refreshTokenEndpoint,
  registerEndpoint,
} from './features/auth-endpoints.js'
import { MenuGlobal } from './globals/Menu/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [UsersCollection, PostsCollection, MediaCollection, ArticlesCollection],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin: false, // Disable auto-login to force login screen
  },
  editor: lexicalEditor({}),
  endpoints: [loginEndpoint, logoutEndpoint, meEndpoint, registerEndpoint, refreshTokenEndpoint],
  globals: [
    // ...add more globals here
    MenuGlobal,
  ],
  onInit: async (payload) => {
    // Create example post
    await payload.create({
      collection: postsSlug,
      data: {
        title: 'example post',
      },
    })

    // Create test users if they don't exist
    const testUsers = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        roles: ['admin'],
      },
      {
        email: 'user@example.com',
        password: 'user123',
        name: 'Regular User',
        roles: ['user'],
      },
      {
        email: 'editor@example.com',
        password: 'editor123',
        name: 'Editor User',
        roles: ['user'],
      },
    ]

    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: userData.email,
            },
          },
        })

        if (existingUser.docs.length === 0) {
          // Create user if it doesn't exist
          await payload.create({
            collection: 'users',
            data: userData,
          })
          console.log(`✅ Created user: ${userData.email}`)
        } else {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`)
        }
      } catch (error) {
        console.log(
          `❌ Failed to create user ${userData.email}:`,
          error instanceof Error ? error.message : String(error),
        )
      }
    }

    console.log('\n🔐 Test users created! You can login with:')
    console.log('Admin: admin@example.com / admin123')
    console.log('User: user@example.com / user123')
    console.log('Editor: editor@example.com / editor123')
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
