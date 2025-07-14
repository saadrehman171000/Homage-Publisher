"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ShoppingCart, User, Menu, X, ChevronDown, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"

const categories = [
  "Pre-School",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
]

/**
 * Enhanced Navigation Header Component
 * Features: Beautiful logo, smooth animations, enhanced UX
 */
export function Navbar() {
  const { state } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)

  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click outside to close categories dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }

    if (isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCategoriesOpen])

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg border-b-2 border-red-100" : "shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/images/homage-logo-02.png"
                alt="Homage Educational Publishers - Quality Educational Books"
                width={220}
                height={80}
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="relative text-gray-700 hover:text-red-600 font-semibold transition-all duration-300 group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/shop"
              className="relative text-gray-700 hover:text-red-600 font-semibold transition-all duration-300 group"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Enhanced Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center text-gray-700 hover:text-red-600 font-semibold transition-all duration-300 group"
              >
                Categories
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    {categories.map((category, index) => (
                      <Link
                        key={category}
                        href={`/category/${category.toLowerCase().replace(" ", "-")}`}
                        className="block px-6 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:pl-8"
                        onClick={() => setIsCategoriesOpen(false)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-3 opacity-0 transition-opacity duration-200 hover:opacity-100"></span>
                          {category}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/new-arrivals"
              className="relative text-gray-700 hover:text-red-600 font-semibold transition-all duration-300 group"
            >
              <span className="flex items-center">
                New Arrivals
                <span className="ml-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/announcements"
              className="relative flex items-center text-gray-700 hover:text-red-600 font-semibold transition-all duration-300 group"
            >
              <Bell className="h-4 w-4 mr-1" />
              Announcements
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/about"
              className="relative text-gray-700 hover:text-red-600 font-semibold transition-all duration-300 group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/contact"
              className="relative text-gray-700 hover:text-red-600 font-semibold transition-all duration-300 group"
            >
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <Button variant="ghost" size="sm" className="hidden sm:flex p-2 hover:bg-red-50">
              <Search className="h-5 w-5 text-gray-600 hover:text-red-600 transition-colors" />
            </Button>

            {/* User Menu */}
            <div className="hidden sm:block">
              {state.user ? (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center text-gray-700 hover:text-red-600 transition-all duration-300 p-2 rounded-lg hover:bg-red-50"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span className="font-medium">{state.user.name}</span>
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center text-gray-700 hover:text-red-600 transition-all duration-300 p-2 rounded-lg hover:bg-red-50"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span className="font-medium">Login</span>
                </Link>
              )}
            </div>

            {/* Enhanced Cart */}
            <Link
              href="/cart"
              className="relative flex items-center text-gray-700 hover:text-red-600 transition-all duration-300 p-2 rounded-lg hover:bg-red-50 group"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-red-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>

              {/* Mobile Categories */}
              <div className="px-4 py-2">
                <button
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                  className="flex items-center text-gray-700 hover:text-red-600 font-medium w-full py-2 transition-colors duration-200"
                >
                  Categories
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${isMobileCategoriesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isMobileCategoriesOpen && (
                  <div className="mt-2 pl-4 space-y-1 animate-in slide-in-from-top duration-200">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/category/${category.toLowerCase().replace(" ", "-")}`}
                        className="block py-2 px-3 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                        onClick={() => {
                          setTimeout(() => {
                            setIsMenuOpen(false)
                            setIsMobileCategoriesOpen(false)
                          }, 100)
                        }}
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/new-arrivals"
                className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>

              <Link
                href="/announcements"
                className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Announcements
              </Link>

              <Link
                href="/about"
                className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              <Link
                href="/contact"
                className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>

              {/* Mobile User Menu */}
              <div className="border-t border-gray-200 pt-2">
                {state.user ? (
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/sign-in"
                    className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
