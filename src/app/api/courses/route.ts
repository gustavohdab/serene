import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const requestBody = await req.json()

  const { title } = requestBody

  console.log(title)

  const course = {
    id: '123',
    title,
  }

  return NextResponse.json(course)
}
