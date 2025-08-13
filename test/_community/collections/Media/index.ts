import type { CollectionConfig } from 'payload'

export const mediaSlug = 'media'

export const MediaCollection: CollectionConfig = {
  slug: mediaSlug,
  access: {
    create: () => true,
    read: ({ req }) => {
      console.log('READ')
      console.dir(
        {
          // Request basics
          url: req.url,
          method: req.method,
          headers: req.headers,
          query: req.query,
          routeParams: req.routeParams,

          // Auth & API context
          payloadAPI: req.payloadAPI, // 'REST' | 'GraphQL' | 'local'
          user: req.user,
          context: req.context,

          // Payload internals
          payloadUploadSizes: req.payloadUploadSizes,
          transactionID: req.transactionID,

          // Body & file
          data: req.data,
          file: req.file
            ? {
                name: req.file.name,
                mimetype: req.file.mimetype,
                size: req.file.size,
                tempFilePath: req.file.tempFilePath,
                clientUploadContext: req.file.clientUploadContext,
              }
            : undefined,
        },
        { depth: null },
      )

      return !!req.user
    },
    update: ({ req: { user } }) => {
      console.log('UPDATE', user)
      return !!user
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  upload: {
    staticDir: 'media-test',
    crop: true,
    focalPoint: true,
    skipSafeFetch: true, //
    imageSizes: [
      {
        name: 'thumbnail',
        height: 200,
        width: 200,
      },
      {
        name: 'medium',
        height: 800,
        width: 800,
      },
      {
        name: 'large',
        height: 1200,
        width: 1200,
      },
    ],
  },
}
