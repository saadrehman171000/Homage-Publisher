"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"

export function TermsModal() {
  const { state, dispatch } = useApp()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Show modal if terms haven't been accepted
    if (!state.termsAccepted) {
      setIsOpen(true)
    }
  }, [state.termsAccepted])

  const handleAccept = () => {
    dispatch({ type: "ACCEPT_TERMS" })
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms and Conditions</h2>

          <div className="prose prose-sm max-w-none text-gray-700 mb-6">
            <p className="mb-4">
              Welcome to Homage Educational Publishers. By using our website, you agree to the following terms and
              conditions:
            </p>

            <h3 className="text-lg font-semibold mb-2">1. Use of Website</h3>
            <p className="mb-4">
              This website is intended for educational purposes and the purchase of educational materials. You agree to
              use this website only for lawful purposes.
            </p>

            <h3 className="text-lg font-semibold mb-2">2. Product Information</h3>
            <p className="mb-4">
              We strive to provide accurate product information, including prices, descriptions, and availability.
              However, we reserve the right to correct any errors or inaccuracies.
            </p>

            <h3 className="text-lg font-semibold mb-2">3. Orders and Payment</h3>
            <p className="mb-4">
              All orders are subject to acceptance and availability. We accept various payment methods including Cash on
              Delivery, Easypaisa, JazzCash, and Bank Transfer.
            </p>

            <h3 className="text-lg font-semibold mb-2">4. Privacy</h3>
            <p className="mb-4">
              We respect your privacy and are committed to protecting your personal information. Your data will only be
              used for order processing and communication purposes.
            </p>

            <h3 className="text-lg font-semibold mb-2">5. Returns and Refunds</h3>
            <p className="mb-4">
              Please refer to our Return and Refund Policy for detailed information about returns, exchanges, and
              refunds.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleAccept} className="bg-red-600 hover:bg-red-700">
              Accept Terms and Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
