import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import type { StructureBuilder } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Fellows')
        .schemaType('fellow')
        .child(S.documentTypeList('fellow').title('Fellows')),
      S.listItem()
        .title('Projects')
        .schemaType('project')
        .child(S.documentTypeList('project').title('Projects')),
      S.listItem()
        .title('News')
        .schemaType('newsPost')
        .child(S.documentTypeList('newsPost').title('News Posts')),
      S.listItem()
        .title('Events')
        .schemaType('event')
        .child(S.documentTypeList('event').title('Events')),
      S.divider(),
      S.listItem()
        .title('Policy')
        .schemaType('policy')
        .child(S.documentTypeList('policy').title('Policies')),
    ])

export default defineConfig({
  name: 'default',
  title: 'CDLS Website',

  projectId: 'nmidzq40',
  dataset: 'fellows',

  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
