export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Return and Refund Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Policy</h2>
            <p className="text-gray-700 mb-4">
              At Homage Educational Publishers, we want you to be completely satisfied with your purchase. If you are
              not satisfied, you may return eligible items within 7 days of delivery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility for Returns</h2>
            <p className="text-gray-700 mb-4">To be eligible for a return, items must meet the following conditions:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Items must be in original condition with no writing, highlighting, or damage</li>
              <li>Items must be returned within 7 days of delivery</li>
              <li>Original packaging and any included materials must be included</li>
              <li>Items must not show signs of excessive wear or use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
            <p className="text-gray-700 mb-4">The following items cannot be returned:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Items that have been written in, highlighted, or damaged</li>
              <li>Items returned after 7 days from delivery</li>
              <li>Items without original packaging</li>
              <li>Custom or personalized items</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Return Items</h2>
            <p className="text-gray-700 mb-4">To initiate a return, please follow these steps:</p>
            <ol className="list-decimal pl-6 text-gray-700 mb-4">
              <li>Contact our customer service team at info@homagepublishers.com or +92-21-1234-5678</li>
              <li>Provide your order number and reason for return</li>
              <li>We will provide you with return instructions and a return authorization number</li>
              <li>Package the items securely with the return authorization number</li>
              <li>Ship the items to the address provided by our customer service team</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
            <p className="text-gray-700 mb-4">
              Once we receive and inspect your returned items, we will process your refund within 5-7 business days.
              Refunds will be issued to the original payment method used for the purchase.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Cash on Delivery orders: Refund via bank transfer or mobile wallet</li>
              <li>Online payments: Refund to original payment method</li>
              <li>Bank transfers: Refund to the same bank account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
            <p className="text-gray-700 mb-4">
              We offer exchanges for defective or damaged items. If you receive a defective or damaged item, please
              contact us immediately with photos of the damage. We will arrange for a replacement at no additional cost.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Shipping</h2>
            <p className="text-gray-700 mb-4">
              Return shipping costs are the responsibility of the customer unless the return is due to our error
              (defective or wrong item sent). We recommend using a trackable shipping service for returns.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Damaged or Defective Items</h2>
            <p className="text-gray-700 mb-4">
              If you receive damaged or defective items, please contact us within 48 hours of delivery. We will arrange
              for a replacement or full refund, including return shipping costs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our Return and Refund Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                Email: info@homagepublishers.com
                <br />
                Phone: +92-21-1234-5678
                <br />
                Address: 123 Education Street, Karachi, Pakistan
                <br />
                Business Hours: Monday - Friday: 9:00 AM - 6:00 PM
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
