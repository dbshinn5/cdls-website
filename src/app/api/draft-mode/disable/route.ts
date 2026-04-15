import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  ;(await draftMode()).disable()
  const { searchParams } = new URL(request.url)
  const redirectUrl = searchParams.get('redirect') ?? '/'
  return NextResponse.redirect(new URL(redirectUrl, request.url))
}
