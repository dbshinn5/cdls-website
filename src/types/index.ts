import { PortableTextBlock } from '@portabletext/types'

// Fellow type - matches Sanity schema
export interface Fellow {
  _id: string
  name: string
  firstName?: string
  familyName?: string
  slug: {
    current: string
  }
  position?: string
  academicUnit?: string
  email?: string
  telephone?: string
  image?: SanityImage
  imageUrl?: string
  content?: PortableTextBlock[]
  htmlContent?: string
  website?: {
    title?: string
    url?: string
  }
  originalId?: number
  originalDate?: string
  originalUrl?: string
  // Future fields for categorization
  category?: FellowCategory
  tags?: FellowTag[]
}

// Post type - matches Sanity schema (legacy alias for NewsPost)
export interface Post {
  _id: string
  title: string
  slug: {
    current: string
  }
  author?: string
  publishedAt?: string
  mainImage?: SanityImage
  body?: PortableTextBlock[]
}

// News Post type - matches newsPost Sanity schema
export interface NewsPost {
  _id: string
  title: string
  slug: { current: string }
  author?: string
  publishedAt: string
  excerpt?: string
  body?: PortableTextBlock[]
  mainImage?: SanityImage
  originalUrl?: string
}

// Project type - matches project Sanity schema
export type ProjectCategory = 'community-partnerships' | 'fellow-led' | 'outreach-education' | 'core-programs'

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  'community-partnerships': 'Community Partnerships',
  'fellow-led': 'Fellow-Led Initiatives',
  'outreach-education': 'Outreach & Education',
  'core-programs': 'Core Programs',
}

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  year?: number
  status?: 'ongoing' | 'completed'
  projectCategory?: ProjectCategory
  description?: string
  body?: PortableTextBlock[]
  mainImage?: SanityImage
  teamMembers?: Fellow[]
  facultyAdvisor?: string
  client?: string
  resources?: { title?: string; fileUrl?: string }[]
  originalUrl?: string
}

// Event type - matches event Sanity schema
export interface Event {
  _id: string
  title: string
  slug: { current: string }
  startDateTime: string
  endDateTime?: string
  locations?: { name?: string; address?: string }[]
  description?: string
  body?: PortableTextBlock[]
  mainImage?: SanityImage
  eventType?: 'lecture-series' | 'workshop' | 'community' | 'other'
  program?: string
  registrationUrl?: string
  originalUrl?: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  hotspot?: {
    _type: 'sanity.imageHotspot'
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    _type: 'sanity.imageCrop'
    top: number
    bottom: number
    left: number
    right: number
  }
}

// Category types for future use
export type FellowCategory =
  | 'fellows'
  | 'community-fellows'
  | 'early-career-fellows'
  | 'faculty-fellows'
  | 'pilot'
  | 'veterans'

export type FellowTag =
  | 'staff'
  | 'leadership'
  | 'technical-experts'
  | 'students'
  | 'board-of-advisors'
  | 'affiliates'
  | 'past-community-members'

// Display labels
export const categoryLabels: Record<FellowCategory, string> = {
  'fellows': 'Fellows',
  'community-fellows': 'Community Fellows',
  'early-career-fellows': 'Early Career Fellows',
  'faculty-fellows': 'Faculty Fellows',
  'pilot': 'Pilot',
  'veterans': 'Veterans',
}

export const tagLabels: Record<FellowTag, string> = {
  'staff': 'Staff',
  'leadership': 'Leadership',
  'technical-experts': 'Technical Experts',
  'students': 'Students',
  'board-of-advisors': 'Board of Advisors',
  'affiliates': 'Affiliates',
  'past-community-members': 'Past Community Members',
}

// Legacy alias for backward compatibility
export type Person = Fellow
export type PersonCategory = FellowCategory
export type PersonTag = FellowTag
