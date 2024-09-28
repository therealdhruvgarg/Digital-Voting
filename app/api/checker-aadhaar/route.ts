import { NextResponse } from 'next/server'
import { getUserByAadhaar } from '@/lib/db'

export async function POST(request: Request) {
  const { aadhaarNumber } = await request.json()

  try {
    const user = await getUserByAadhaar(aadhaarNumber)

    if (user) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false }, { status: 404 })
    }
  } catch (error) {
    console.error('Error checking Aadhaar:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}