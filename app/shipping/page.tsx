"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Truck, Info, Mail } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Card className="mb-8 shadow-lg border-red-100">
        <CardHeader className="flex flex-row items-center gap-3">
          <Truck className="text-red-500" size={32} />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Shipping & Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-red-600 mb-2">Shipping Policy</h2>
            <p className="text-gray-700">
              We deliver educational books across Pakistan. All orders are processed within <span className="font-semibold">1-2 business days</span> after receiving your order confirmation email. You will receive another notification when your order has shipped.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-red-600 mb-2">Delivery Times</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                <Badge variant="outline" className="mr-2">Karachi</Badge>
                2-3 business days
              </li>
              <li>
                <Badge variant="outline" className="mr-2">Other Cities</Badge>
                3-5 business days
              </li>
              <li>
                <Badge variant="outline" className="mr-2">Remote Areas</Badge>
                5-7 business days
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-red-600 mb-2">Shipping Charges</h2>
            <p className="text-gray-700">
              <span className="font-semibold">Flat Rate:</span> Rs. 200 per order.<br />
              <span className="font-semibold">Free Shipping:</span> On orders above Rs. 3000.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
              <Info size={18} className="text-red-400" /> Need Help?
            </h2>
            <p className="text-gray-700">
              For any shipping-related queries, please <Link href="/contact" className="text-red-600 underline hover:text-red-800">contact us</Link> or email us at <a href="mailto:support@homagepublishers.com" className="text-red-600 underline hover:text-red-800">support@homagepublishers.com</a>.
            </p>
          </section>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Link href="/">
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}