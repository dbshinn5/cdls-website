import { defineField, defineType } from 'sanity'

export const fellow = defineType({
  name: 'fellow',
  title: 'Fellow',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'familyName',
      title: 'Family Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Position/Title',
      type: 'string',
    }),
    defineField({
      name: 'academicUnit',
      title: 'Institution',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'telephone',
      title: 'Telephone',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
      description: 'Original image URL from the source',
    }),
    defineField({
      name: 'content',
      title: 'Content/Bio',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'object',
          name: 'customHtml',
          title: 'Custom HTML',
          fields: [
            {
              name: 'html',
              title: 'HTML',
              type: 'text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'htmlContent',
      title: 'HTML Content (Raw)',
      type: 'text',
      description: 'Original HTML content from source',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'url',
          title: 'URL',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'originalId',
      title: 'Original ID',
      type: 'number',
      description: 'ID from the original database',
    }),
    defineField({
      name: 'originalDate',
      title: 'Original Date',
      type: 'datetime',
      description: 'Date from the original database',
    }),
    defineField({
      name: 'originalUrl',
      title: 'Original URL',
      type: 'url',
      description: 'Original permalink URL',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'position',
      media: 'image',
    },
  },
})



