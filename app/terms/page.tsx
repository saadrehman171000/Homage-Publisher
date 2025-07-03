export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using the Homage Educational Publishers website, you accept and agree to be bound by the
              terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials on Homage Educational Publishers'
              website for personal, non-commercial transitory viewing only.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>This is the grant of a license, not a transfer of title</li>
              <li>Under this license you may not modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Product Information</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate product information, including prices, descriptions, and availability.
              However, we reserve the right to correct any errors, inaccuracies, or omissions and to change or update
              information at any time without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Orders and Payment</h2>
            <p className="text-gray-700 mb-4">
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order
              for any reason. Payment must be made through our accepted payment methods.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Shipping and Delivery</h2>
            <p className="text-gray-700 mb-4">
              We will make every effort to deliver products within the estimated timeframe. However, delivery times are
              estimates and not guaranteed. We are not liable for delays caused by circumstances beyond our control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              Please refer to our Return and Refund Policy for detailed information about returns, exchanges, and
              refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. We collect and use your personal information only as described in our
              Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall Homage Educational Publishers or its suppliers be liable for any damages arising out of
              the use or inability to use the materials on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                Email: info@homagepublishers.com
                <br />
                Phone: +92-21-1234-5678
                <br />
                Address: 123 Education Street, Karachi, Pakistan
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
