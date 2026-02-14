import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
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
      name: 'startDateTime',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime',
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      description: 'Supports hybrid/multi-venue events',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'address',
              title: 'Address',
              type: 'string',
            },
          ],
        },
      ],
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
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Lecture Series', value: 'lecture-series' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Community', value: 'community' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'program',
      title: 'Program',
      type: 'string',
      description: 'e.g., "VSTEM", "CDLS Fellowship"',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
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
      subtitle: 'startDateTime',
      media: 'mainImage',
    },
    prepare(selection) {
      const { subtitle } = selection
      return {
        ...selection,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString()
          : undefined,
      }
    },
  },
})
