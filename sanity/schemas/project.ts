import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Ongoing', value: 'ongoing' },
          { title: 'Completed', value: 'completed' },
        ],
      },
    }),
    defineField({
      name: 'projectCategory',
      title: 'Project Category',
      type: 'string',
      options: {
        list: [
          { title: 'Community Partnerships', value: 'community-partnerships' },
          { title: 'Fellow-Led Initiatives', value: 'fellow-led' },
          { title: 'Outreach & Education', value: 'outreach-education' },
          { title: 'Core Programs', value: 'core-programs' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short summary for cards',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'fellow' }],
        },
      ],
    }),
    defineField({
      name: 'facultyAdvisor',
      title: 'Faculty Advisor',
      type: 'string',
    }),
    defineField({
      name: 'client',
      title: 'Client / Partner Organization',
      type: 'string',
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'file',
              title: 'File',
              type: 'file',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'originalUrl',
      title: 'Original URL',
      type: 'url',
      description: 'WordPress source link',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'mainImage',
    },
    prepare(selection) {
      const { subtitle } = selection
      return {
        ...selection,
        subtitle: subtitle ? `${subtitle}` : undefined,
      }
    },
  },
})
