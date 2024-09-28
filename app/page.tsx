import AadhaarLogin from "@/components/aadhaar-login"


export const metadata = {
  title: 'Aadhaar Login Portal',
  description: 'Login with your Aadhaar number and facial recognition',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AadhaarLogin/>
    </div>
  )
}