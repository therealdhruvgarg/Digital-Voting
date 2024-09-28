import FacialRecognition from "@/components/FacialRecgnition"


export const metadata = {
  title: 'Facial Recognition',
  description: 'Complete your login with facial recognition',
}

export default function FacialRecognitionPage() {
  return (
    <div className="min-h-screen bg-background">
      <FacialRecognition/>
    </div>
  )
}