import { type SchemaTypeDefinition } from 'sanity'

import { fellow } from './fellow'
import { project } from './project'
import { newsPost } from './newsPost'
import { event } from './event'

export const schemaTypes: SchemaTypeDefinition[] = [
  fellow,
  project,
  newsPost,
  event,
]
