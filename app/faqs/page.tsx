"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "What grade levels do you cater to?",
    answer:
      "We provide educational materials for students from Prep (Nursery) to Class 8, covering all major subjects including English, Mathematics, Science, Urdu, and Social Studies.",
  },
  {
    question: "Are your books aligned with the national curriculum?",
    answer:
      "Yes, all our books are carefully designed to align with both national and provincial curriculum standards. Our content is regularly updated to reflect any curriculum changes.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept multiple payment methods including Cash on Delivery (COD), Easypaisa, JazzCash, and Bank Transfer. Choose the method that's most convenient for you.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery typically takes 3-7 business days depending on your location. We provide free shipping across Pakistan for all orders.",
  },
  {
    question: "Can I return or exchange books?",
    answer:
      "Yes, we have a flexible return and exchange policy. You can return books within 7 days of delivery if they are in original condition. Please refer to our Return Policy for detailed terms.",
  },
  {
    question: "Do you offer bulk discounts for schools?",
    answer:
      "Yes, we offer special pricing for bulk orders from schools and educational institutions. Please contact us directly to discuss your requirements and get a customized quote.",
  },
  {
    question: "Are your books available in both English and Urdu?",
    answer:
      "We publish books in both English and Urdu mediums. Each product page clearly indicates the language of instruction. You can filter by language when browsing our catalog.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is dispatched, you'll receive tracking information via email and SMS. You can also check your order status by logging into your account on our website.",
  },
  {
    question: "Do you provide teacher guides and resources?",
    answer:
      "Yes, we offer comprehensive teacher guides and additional resources for educators. These materials include lesson plans, answer keys, and teaching tips to support classroom instruction.",
  },
  {
    question: "What if I receive a damaged book?",
    answer:
      "If you receive a damaged book, please contact us immediately with photos of the damage. We'll arrange for a replacement at no additional cost to you.",
  },
  {
    question: "Can I cancel my order after placing it?",
    answer:
      "You can cancel your order within 24 hours of placing it, provided it hasn't been dispatched yet. Once dispatched, you can use our return policy instead.",
  },
  {
    question: "Do you have a physical store?",
    answer:
      "Currently, we operate primarily online to serve customers across Pakistan efficiently. However, you can contact us to arrange pickup from our warehouse in specific cases.",
  },
]

export default function FAQsPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our books, ordering, and services.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our customer support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
