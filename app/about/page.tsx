import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About Homage Educational Publishers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated to nurturing young minds through quality educational content and innovative learning materials.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded with a vision to transform education in Pakistan, Homage Educational Publishers has been at the
                forefront of creating innovative and engaging educational materials for students from Prep to Class 8.
              </p>
              <p>
                Our journey began with a simple belief: every child deserves access to quality education. We recognized
                the need for curriculum-aligned, locally relevant, and internationally competitive educational content
                that would prepare our students for the challenges of tomorrow.
              </p>
              <p>
                Today, we are proud to serve thousands of students, teachers, and parents across Pakistan, providing
                them with the tools they need to succeed in their educational journey.
              </p>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/homage-logo-02.png"
              alt="Homage Educational Publishers"
              width={500}
              height={300}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To provide high-quality, accessible educational materials that inspire learning, foster creativity, and
              prepare students for academic excellence and lifelong success.
            </p>
          </div>
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To be the leading educational publisher in Pakistan, recognized for innovation, quality, and our
              commitment to transforming education for future generations.
            </p>
          </div>
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-gray-600">
              Excellence, Innovation, Accessibility, Integrity, and Student-Centricity guide everything we do in our
              mission to enhance educational outcomes.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Textbooks</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive textbooks aligned with national curriculum standards
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Workbooks</h3>
              <p className="text-gray-600 text-sm">Interactive workbooks with exercises and practice materials</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Tools</h3>
              <p className="text-gray-600 text-sm">Comprehensive assessment and evaluation materials</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">👨‍🏫</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Resources</h3>
              <p className="text-gray-600 text-sm">Supporting materials and guides for educators</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Homage?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Curriculum Aligned</h4>
                  <p className="text-gray-600 text-sm">
                    All our books are carefully aligned with national and provincial curriculum standards.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Expert Authors</h4>
                  <p className="text-gray-600 text-sm">
                    Content developed by experienced educators and subject matter experts.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Quality Printing</h4>
                  <p className="text-gray-600 text-sm">
                    High-quality printing and binding for durability and visual appeal.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Affordable Pricing</h4>
                  <p className="text-gray-600 text-sm">
                    Competitive prices to make quality education accessible to all.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Wide Distribution</h4>
                  <p className="text-gray-600 text-sm">Available across Pakistan with reliable delivery services.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Customer Support</h4>
                  <p className="text-gray-600 text-sm">Dedicated customer service to assist with all your needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore our collection of educational books and join thousands of satisfied customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Browse Our Books
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
