import { type SchemaTypeDefinition } from 'sanity'

import { fellow } from './fellow'
import { project } from './project'
import { newsPost } from './newsPost'
import { event } from './event'
import { policy } from './policy'

export const schemaTypes: SchemaTypeDefinition[] = [
  fellow,
  project,
  newsPost,
  event,
  policy,
]
