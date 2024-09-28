'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Webcam from 'react-webcam'
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"
import { CameraIcon, CheckCircleIcon } from "lucide-react"
import { motion } from "framer-motion"

export default function FacialRecognition() {
  const [isCapturing, setIsCapturing] = useState(true)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const router = useRouter()

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
      setIsCapturing(false)
    }
  }, [webcamRef])

  const retake = () => {
    setCapturedImage(null)
    setIsCapturing(true)
  }

  const handleRecognition = async () => {
    if (!capturedImage) return

    setIsVerifying(true)

    try {
      const response = await fetch('/api/verify-facial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facialData: capturedImage }),
      })

      if (response.ok) {
        alert('Facial recognition successful!')
        router.push('/dashboard') // Redirect to dashboard or home page
      } else {
        alert('Facial recognition failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <motion.header 
        className="px-4 lg:px-6 h-14 flex items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CameraIcon className="h-6 w-6 mr-2" />
        <h1 className="text-lg font-semibold">Facial Recognition</h1>
      </motion.header>
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md">
            <CardContent className="space-y-4 pt-6">
              <motion.div 
                className="space-y-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold">Facial Recognition</h2>
                <p className="text-muted-foreground">Please look at the camera for authentication</p>
              </motion.div>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {isCapturing ? (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg"
                  />
                ) : (
                  <img src={capturedImage!} alt="Captured" className="w-full rounded-lg" />
                )}
                <div className="flex justify-center space-x-4">
                  {isCapturing ? (
                    <Button onClick={capture}>Capture</Button>
                  ) : (
                    <>
                      <Button onClick={retake} variant="outline">Retake</Button>
                      <Button onClick={handleRecognition} disabled={isVerifying}>
                        <CheckCircleIcon className="mr-2 h-4 w-4" />
                        {isVerifying ? 'Verifying...' : 'Verify'}
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}