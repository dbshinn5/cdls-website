// Sanity GROQ queries for CDLS content

// Fellow queries - matches existing Sanity schema
export const allFellowsQuery = `*[_type == "fellow"] | order(name asc) {
  _id,
  name,
  firstName,
  familyName,
  slug,
  position,
  academicUnit,
  email,
  image {
    _type,
    asset,
    hotspot,
    crop
  },
  imageUrl,
  website,
  category,
  tags
}`

export const fellowBySlugQuery = `*[_type == "fellow" && slug.current == $slug][0] {
  _id,
  name,
  firstName,
  familyName,
  slug,
  position,
  academicUnit,
  email,
  telephone,
  image,
  imageUrl,
  content,
  htmlContent,
  website,
  category,
  tags
}`

export const projectsByFellowQuery = `*[_type == "project" && references($fellowId)] | order(year desc) {
  _id,
  title,
  slug,
  year,
  status,
  mainImage
}`

export const fellowsByCategory = `*[_type == "fellow" && category == $category] | order(name asc) {
  _id,
  name,
  slug,
  position,
  academicUnit,
  image,
  imageUrl,
  category,
  tags
}`

// Post/News queries - matches existing Sanity schema
export const allPostsQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  author,
  publishedAt,
  mainImage
}`

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  author,
  publishedAt,
  mainImage,
  body
}`

export const recentPostsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage
}`

// ── Projects ─────────────────────────────────────────────────────────

export const allProjectsQuery = `*[_type == "project"] | order(year desc) {
  _id,
  title,
  slug,
  year,
  status,
  projectCategory,
  description,
  mainImage,
  facultyAdvisor,
  client
}`

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  year,
  status,
  description,
  body,
  mainImage,
  teamMembers[]-> {
    _id,
    name,
    slug,
    position,
    image,
    imageUrl
  },
  facultyAdvisor,
  client,
  resources[] {
    title,
    "fileUrl": file.asset->url
  },
  originalUrl
}`

// ── News Posts ────────────────────────────────────────────────────────

export const allNewsPostsQuery = `*[_type == "newsPost"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  author,
  publishedAt,
  excerpt,
  mainImage
}`

export const newsPostBySlugQuery = `*[_type == "newsPost" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  author,
  publishedAt,
  excerpt,
  body,
  mainImage,
  originalUrl
}`

export const recentNewsQuery = `*[_type == "newsPost"] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  author,
  publishedAt,
  excerpt,
  mainImage
}`

// ── Events ───────────────────────────────────────────────────────────

export const upcomingEventsQuery = `*[_type == "event" && startDateTime >= now()] | order(startDateTime asc)[0...6] {
  _id,
  title,
  slug,
  startDateTime,
  endDateTime,
  locations,
  description,
  mainImage,
  eventType,
  program
}`

export const pastEventsQuery = `*[_type == "event" && startDateTime < now()] | order(startDateTime desc) {
  _id,
  title,
  slug,
  startDateTime,
  endDateTime,
  locations,
  description,
  mainImage,
  eventType,
  program
}`

export const eventBySlugQuery = `*[_type == "event" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  startDateTime,
  endDateTime,
  locations,
  description,
  body,
  mainImage,
  eventType,
  program,
  registrationUrl,
  originalUrl
}`

// Legacy aliases for backward compatibility
export const allPeopleQuery = allFellowsQuery
export const personBySlugQuery = fellowBySlugQuery
export const peopleByCategory = fellowsByCategory
