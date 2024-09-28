'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, Card } from "@/components/ui/card"
import { IdCardIcon, TicketIcon } from "lucide-react"
import { motion } from "framer-motion"

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <motion.header 
        className="px-4 lg:px-6 h-14 flex items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <IdCardIcon className="h-6 w-6 mr-2" />
        <h1 className="text-lg font-semibold">Aadhaar Login Portal</h1>
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
                <h2 className="text-3xl font-bold">Login with Aadhaar</h2>
                <p className="text-muted-foreground">Enter your Aadhaar number to proceed</p>
              </motion.div>
              <motion.form 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    placeholder="XXXX XXXX XXXX"
                    required
                    type="text"
                    pattern="\d{4}\s?\d{4}\s?\d{4}"
                    maxLength={14}
                  />
                </div>
                <Button className="w-full" type="submit">
                  Login
                </Button>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <motion.footer 
        className="h-14 flex items-center justify-end px-4 lg:px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" className="flex items-center">
            <TicketIcon className="h-4 w-4 mr-2" />
            Verify E-Ticket
          </Button>
        </motion.div>
      </motion.footer>
    </div>
  )
}