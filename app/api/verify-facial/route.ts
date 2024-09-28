import { NextResponse } from 'next/server'
import { getUserByAadhaar, updateUserFacialData } from '@/lib/db'

// TODO you'd use a proper facial recognition API.
async function compareFacialData(storedData: string, newData: string): Promise<boolean> {
  // TODO Implement actual facial recognition comparison logic here
  return true
}

export async function POST(request: Request) {
  const { facialData } = await request.json()

  try {
   
    const aadhaarNumber = 'XXXX XXXX XXXX' // Placeholder

    const user = await getUserByAadhaar(aadhaarNumber)

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    const isMatch = await compareFacialData(user.facialData, facialData)

    if (isMatch) {
      // Update the stored facial data with the new one
      await updateUserFacialData(aadhaarNumber, facialData)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: 'Facial recognition failed' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error verifying facial data:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}