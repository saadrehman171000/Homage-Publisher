import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react"

/**
 * Enhanced Footer Component
 * Features: Beautiful design, social media, contact info, animations
 */
export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-6">
              <Image
                src="/images/homage-logo.png"
                alt="Homage Educational Publishers"
                width={180}
                height={60}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Homage Educational Publishers is dedicated to providing high-quality educational materials for students
              from Pre-School to Grade 8. We believe in nurturing young minds through excellent content and innovative
              learning approaches that inspire academic excellence.
            </p>

            {/* Enhanced Social Media Links */}
            <div className="flex space-x-6">
              <a
                href="#"
                className="group text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <div className="p-3 rounded-full bg-gray-800 group-hover:bg-blue-600 transition-all duration-300">
                  <Facebook className="h-6 w-6" />
                </div>
              </a>
              <a
                href="#"
                className="group text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <div className="p-3 rounded-full bg-gray-800 group-hover:bg-blue-400 transition-all duration-300">
                  <Twitter className="h-6 w-6" />
                </div>
              </a>
              <a
                href="#"
                className="group text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <div className="p-3 rounded-full bg-gray-800 group-hover:bg-pink-600 transition-all duration-300">
                  <Instagram className="h-6 w-6" />
                </div>
              </a>
              <a
                href="#"
                className="group text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                aria-label="YouTube"
              >
                <div className="p-3 rounded-full bg-gray-800 group-hover:bg-red-600 transition-all duration-300">
                  <Youtube className="h-6 w-6" />
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { href: "/about", label: "About Us" },
                { href: "/shop", label: "Shop" },
                { href: "/new-arrivals", label: "New Arrivals" },
                { href: "/announcements", label: "Announcements" },
                { href: "/faqs", label: "FAQs" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-white">Support & Legal</h3>
            <ul className="space-y-4">
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "/terms", label: "Terms & Conditions" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/return-policy", label: "Return Policy" },
                { href: "/shipping", label: "Shipping Info" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enhanced Contact Information */}
        <div className="border-t border-gray-700 mt-12 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center group">
              <div className="p-4 rounded-full bg-red-600 mr-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Email Us</p>
                <p className="text-white font-semibold text-lg">info@homagepublishers.com</p>
              </div>
            </div>

            <div className="flex items-center group">
              <div className="p-4 rounded-full bg-red-600 mr-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Call Us</p>
                <p className="text-white font-semibold text-lg">+92-21-1234-5678</p>
              </div>
            </div>

            <div className="flex items-center group">
              <div className="p-4 rounded-full bg-red-600 mr-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Visit Us</p>
                <p className="text-white font-semibold text-lg">Karachi, Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-lg mb-2">
            © 2024 Homage Educational Publishers (Pvt.) Limited. All rights reserved.
          </p>
          <p className="text-gray-500 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-2 text-red-500 animate-pulse" /> for Education
          </p>
        </div>
      </div>
    </footer>
  )
}
