"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Search,
  ShoppingCart,
  Star,
  Filter,
  Leaf,
  ChevronRight,
  X,
  ShoppingBag,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"

// Sample clothing products data
const products = [
  {
    id: "c1",
    name: "Organic Cotton T-Shirt",
    description: "100% organic cotton, ethically made classic fit t-shirt",
    price: 29.99,
    rating: 4.7,
    image: "/images/chomushirt.jpg",
    category: "T-shirts",
    certifications: ["Organic", "Fair Trade", "GOTS Certified"],
    impact: {
      carbon: -5.2,
      water: -2000,
      waste: -0.1,
    },
    colors: ["#FFFFFF", "#000000", "#7CB9E8", "#C19A6B"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
    isBestSeller: false,
  },
  {
    id: "c2",
    name: "Recycled Denim Jeans",
    description: "Stylish jeans made from 80% recycled denim and 20% organic cotton",
    price: 59.99,
    rating: 4.5,
    image: "/images/img8.jpg",
    category: "Pants",
    certifications: ["Recycled Materials", "Water-Saving", "Vegan"],
    impact: {
      carbon: -7.8,
      water: -3500,
      waste: -0.4,
    },
    colors: ["#3B3C36", "#4682B4", "#000000"],
    sizes: ["28", "30", "32", "34", "36"],
    isNew: false,
    isBestSeller: true,
  },
  {
    id: "c3",
    name: "Summer Dress",
    description: "Cozy sweater made from sustainable hemp and organic cotton blend",
    price: 45.99,
    rating: 4.6,
    image: "/images/img2.jpg",
    category: "Sweaters",
    certifications: ["Pesticide-Free", "Biodegradable", "Fair Labor"],
    impact: {
      carbon: -4.3,
      water: -1800,
      waste: -0.2,
    },
    colors: ["#C19A6B", "#F5F5DC", "#808080"],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "c4",
    name: "Meadows Reversible Corded Dress",
    description: "Pack of 4 breathable, antibacterial socks made from bamboo fiber",
    price: 15.99,
    rating: 4.8,
    image: "/images/img3.jpg",
    category: "Accessories",
    certifications: ["Biodegradable", "Renewable Resource", "Antibacterial"],
    impact: {
      carbon: -1.2,
      water: -600,
      waste: -0.05,
    },
    colors: ["#000000", "#FFFFFF", "#808080"],
    sizes: ["One Size"],
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "c5",
    name: "Linen A-line Dress",
    description: "Flowing summer dress made from sustainable Tencel lyocell fabric",
    price: 79.99,
    rating: 4.4,
    image: "/images/img4.jpg",
    category: "Dresses",
    certifications: ["Closed-Loop Production", "Biodegradable", "Low Water Usage"],
    impact: {
      carbon: -6.5,
      water: -2800,
      waste: -0.3,
    },
    colors: ["#F5F5DC", "#FFB6C1", "#000000"],
    sizes: ["XS", "S", "M", "L"],
    isNew: true,
    isBestSeller: false,
  },
  {
    id: "c6",
    name: "Recycled Polyester Jacket",
    description: "Lightweight jacket made from recycled plastic bottles",
    price: 89.99,
    rating: 4.3,
    image: "/images/img9.jpg",
    category: "Outerwear",
    certifications: ["Recycled Materials", "PFC-Free", "Bluesign Approved"],
    impact: {
      carbon: -9.2,
      water: -1200,
      waste: -0.8,
    },
    colors: ["#000000", "#808080", "#4682B4"],
    sizes: ["S", "M", "L", "XL"],
    isNew: false,
    isBestSeller: true,
  },
  {
    id: "c7",
    name: "Organic Linen Shirt",
    description: "Breathable button-up shirt made from 100% organic linen",
    price: 49.99,
    rating: 4.5,
    image: "/images/img10.jpg",
    category: "Shirts",
    certifications: ["Organic", "Low Water Usage", "Biodegradable"],
    impact: {
      carbon: -3.8,
      water: -1500,
      waste: -0.15,
    },
    colors: ["#FFFFFF", "#F5F5DC", "#87CEEB"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "c8",
    name: "Upcycled Kurta",
    description: "Unique scarf handmade from upcycled fabric scraps",
    price: 32.99,
    rating: 4.9,
    image: "/images/img11.jpg",
    category: "Accessories",
    certifications: ["Zero Waste", "Handmade", "Upcycled"],
    impact: {
      carbon: -2.1,
      water: -800,
      waste: -0.9,
    },
    colors: ["#Multicolor"],
    sizes: ["One Size"],
    isNew: true,
    isBestSeller: false,
  },
]

// Clothing Categories
const categories = ["All", "T-shirts", "Shirts", "Sweaters", "Pants", "Dresses", "Outerwear", "Accessories"]

// Sustainable Fashion Certifications
const certifications = [
  "Organic",
  "Fair Trade",
  "Recycled Materials",
  "GOTS Certified",
  "Biodegradable",
  "Vegan",
  "Water-Saving",
  "Zero Waste",
  "Handmade",
  "Upcycled",
]

// Sustainable Fashion Benefits
const benefits = [
  {
    title: "Eco-Friendly Materials",
    description:
      "Our clothing is made from sustainable materials like organic cotton, hemp, bamboo, and recycled fabrics that reduce environmental impact",
    icon: "/placeholder.svg?height=64&width=64",
    stat: "85%",
    statText: "less harmful chemicals",
  },
  {
    title: "Ethical Production",
    description:
      "We ensure fair wages and safe working conditions throughout our supply chain, supporting ethical manufacturing practices",
    icon: "/placeholder.svg?height=64&width=64",
    stat: "100%",
    statText: "fair labor certified",
  },
  {
    title: "Reduced Water Usage",
    description:
      "Our production processes use significantly less water than conventional fashion, helping preserve this precious resource",
    icon: "/placeholder.svg?height=64&width=64",
    stat: "91%",
    statText: "less water used",
  },
  {
    title: "Lower Carbon Footprint",
    description:
      "From farm to closet, our clothing produces fewer emissions, helping combat climate change with every purchase",
    icon: "/placeholder.svg?height=64&width=64",
    stat: "45%",
    statText: "less carbon emissions",
  },
]

// Environmental impact data for animation
const impactData = [
  { year: 2020, carbon: 120, water: 3200, waste: 45 },
  { year: 2021, carbon: 95, water: 2800, waste: 38 },
  { year: 2022, carbon: 75, water: 2100, waste: 30 },
  { year: 2023, carbon: 60, water: 1500, waste: 22 },
  { year: 2024, carbon: 45, water: 950, waste: 15 },
]

// Animation variants for framer-motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [cart, setCart] = useState<string[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [showCartNotification, setShowCartNotification] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null)

  // Refs for scroll animations
  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [impactRef, impactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Animated counter effect
  const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const prevTimeRef = useRef(0)

    useEffect(() => {
      const startTime = Date.now()
      const animate = () => {
        const currentTime = Date.now()
        const elapsedTime = currentTime - startTime

        if (elapsedTime < duration) {
          const nextCount = Math.floor((elapsedTime / duration) * end)
          if (nextCount !== countRef.current) {
            countRef.current = nextCount
            setCount(nextCount)
          }
          requestAnimationFrame(animate)
        } else {
          setCount(end)
        }
      }

      requestAnimationFrame(animate)

      return () => {
        countRef.current = 0
      }
    }, [end, duration])

    return <>{count}</>
  }

  // Filter products based on all criteria
  const getFilteredProducts = () => {
    let filtered = products.filter((product) => {
      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false
      }

      // Certification filter
      if (
        selectedCertifications.length > 0 &&
        !selectedCertifications.some((cert) => product.certifications.includes(cert))
      ) {
        return false
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      return true
    })

    // Tab filter
    if (activeTab === "new") {
      filtered = filtered.filter((product) => product.isNew)
    } else if (activeTab === "popular") {
      filtered = filtered.filter((product) => product.isBestSeller)
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()

  const addToCart = (productId: string) => {
    setCart([...cart, productId])
    setShowCartNotification(true)

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowCartNotification(false)
    }, 3000)
  }

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  const handleCertificationChange = (certification: string) => {
    if (selectedCertifications.includes(certification)) {
      setSelectedCertifications(selectedCertifications.filter((c) => c !== certification))
    } else {
      setSelectedCertifications([...selectedCertifications, certification])
    }
  }

  const openQuickView = (product: any) => {
    setQuickViewProduct(product)
  }

  const closeQuickView = () => {
    setQuickViewProduct(null)
  }

  // Floating particles animation component
  const FloatingParticles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-200 opacity-40"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
    )
  }

  return (
    <main className="overflow-x-hidden">
      {/* Cart Notification */}
      <AnimatePresence>
        {showCartNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center"
          >
            <Check className="mr-2 h-5 w-5" />
            <span>Item added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeQuickView}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(quickViewProduct.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{quickViewProduct.rating}</span>
                    </div>
                  </div>
                  <button onClick={closeQuickView} className="text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                    <Image
                      src={quickViewProduct.image || "/placeholder.svg"}
                      alt={quickViewProduct.name}
                      width={300}
                      height={300}
                      className="object-contain max-h-[300px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-emerald-600">${quickViewProduct.price.toFixed(2)}</div>

                    <p className="text-muted-foreground">{quickViewProduct.description}</p>

                    <div>
                      <h3 className="font-medium mb-2">Colors</h3>
                      <div className="flex gap-2">
                        {quickViewProduct.colors.map((color: string, i: number) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border cursor-pointer hover:scale-110 transition-transform"
                            style={{
                              backgroundColor:
                                color === "Multicolor"
                                  ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
                                  : color,
                            }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {quickViewProduct.sizes.map((size: string, i: number) => (
                          <div
                            key={i}
                            className="px-3 py-1 border rounded-md cursor-pointer hover:bg-emerald-50 hover:border-emerald-500 transition-colors"
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.certifications.map((cert: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-emerald-100 text-emerald-800">
                          {cert}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          addToCart(quickViewProduct.id)
                          closeQuickView()
                        }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => toggleWishlist(quickViewProduct.id)}>
                        <Heart
                          className={`mr-2 h-4 w-4 ${wishlist.includes(quickViewProduct.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                        {wishlist.includes(quickViewProduct.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      </Button>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Environmental Impact</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Carbon Reduction:</span>
                          <span className="text-emerald-600 font-medium">{quickViewProduct.impact.carbon} kg CO₂</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Water Saved:</span>
                          <span className="text-emerald-600 font-medium">{quickViewProduct.impact.water} L</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Waste Reduced:</span>
                          <span className="text-emerald-600 font-medium">{quickViewProduct.impact.waste} kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-100 to-emerald-50 overflow-hidden">
        <FloatingParticles />

        <div className="absolute top-10 left-10 w-32 h-32 opacity-80">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-09%20at%2012.41.04%20AM%20%281%29-62Xjf7wW0el7AtWe8Ni6MWvAlHxjr6.jpeg"
              alt="Sustainable fashion recycling symbol"
              width={128}
              height={128}
              className="object-contain"
            />
          </motion.div>
        </div>

        <div className="absolute bottom-20 right-20 w-24 h-24 opacity-50">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-24 h-24 rounded-full bg-emerald-200"
          ></motion.div>
        </div>

        <div className="absolute top-1/4 right-1/3 rotate-45 opacity-30">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [45, 55, 45],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Leaf className="text-emerald-500 w-12 h-12" />
          </motion.div>
        </div>

        <div className="container py-16 md:py-24 flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 space-y-6 z-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="text-emerald-500 relative">
                EcoFashion
                <motion.span
                  className="absolute -top-6 -right-6"
                  animate={{
                    rotate: [0, 15, 0, -15, 0],
                    scale: [1, 1.2, 1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                >
                  <Sparkles className="h-6 w-6 text-amber-400" />
                </motion.span>
              </span>
            </h1>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-medium">
                Your Sustainable
                <span className="block text-emerald-500 font-bold">Clothing Destination</span>
              </h2>
              <p className="text-muted-foreground max-w-md">
                "Discover Sustainable Style. Embrace Eco-friendly Fashion. Your Ethical Wardrobe for Conscious Living."
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 group">
                SHOP NOW
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 mt-10 md:mt-0 relative"
          >
            <motion.div
              className="relative bg-emerald-500 rounded-3xl overflow-hidden p-4 md:ml-10"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="bg-white/90 rounded-2xl overflow-hidden p-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Image
                    src="/images/image4.png"
                    alt="Sustainable clothing"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section ref={benefitsRef} className="py-16 bg-white">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Why Choose Sustainable Fashion?
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="flex flex-col items-center text-center group"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Image
                    src={benefit.icon || "/placeholder.svg"}
                    alt={benefit.title}
                    width={64}
                    height={64}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground mb-4">{benefit.description}</p>
                <div className="mt-auto">
                  <div className="text-3xl font-bold text-emerald-600">
                    {benefitsInView ? <CountUp end={Number.parseInt(benefit.stat)} /> : "0"}%
                  </div>
                  <div className="text-sm text-emerald-700">{benefit.statText}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-emerald-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center mb-8"
          >
            <h2 className="text-3xl font-bold">Sustainable Clothing</h2>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sustainable clothing..."
                  className="pl-9 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Mobile */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden bg-white p-4 rounded-lg mb-6 overflow-hidden"
                >
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className={
                          selectedCategory === category
                            ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                            : "cursor-pointer"
                        }
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm mb-4">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>

                  <h3 className="font-medium mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {certifications.slice(0, 4).map((certification) => (
                      <Label key={certification} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedCertifications.includes(certification)}
                          onCheckedChange={() => handleCertificationChange(certification)}
                        />
                        {certification}
                      </Label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden md:block w-64 bg-white p-6 rounded-lg h-fit sticky top-24"
            >
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2 mb-6">
                {categories.map((category) => (
                  <Label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <motion.div
                      animate={selectedCategory === category ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className={`w-4 h-4 rounded-full ${selectedCategory === category ? "bg-emerald-600" : "border border-muted-foreground"}`}
                    ></motion.div>
                    {category}
                  </Label>
                ))}
              </div>

              <h3 className="font-medium mb-3">Price Range</h3>
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm mb-6">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>

              <h3 className="font-medium mb-3">Certifications</h3>
              <div className="space-y-2">
                {certifications.map((certification) => (
                  <Label key={certification} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      checked={selectedCertifications.includes(certification)}
                      onCheckedChange={() => handleCertificationChange(certification)}
                      className="group-hover:border-emerald-500 transition-colors"
                    />
                    <span className="group-hover:text-emerald-600 transition-colors">{certification}</span>
                  </Label>
                ))}
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="flex-1">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                <TabsList className="w-full md:w-auto grid grid-cols-3">
                  <TabsTrigger value="all">All Clothing</TabsTrigger>
                  <TabsTrigger value="popular">Best Sellers</TabsTrigger>
                  <TabsTrigger value="new">New Arrivals</TabsTrigger>
                </TabsList>
              </Tabs>

              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12 bg-white rounded-lg"
                >
                  <Leaf className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No clothing items found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={scaleUp}
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="overflow-hidden group hover:shadow-lg transition-shadow h-full flex flex-col">
                        <div className="relative">
                          {product.isNew && (
                            <div className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              NEW
                            </div>
                          )}
                          {product.isBestSeller && (
                            <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              BEST SELLER
                            </div>
                          )}
                          <div className="relative overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={300}
                              height={200}
                              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                className="bg-white text-emerald-600 hover:bg-emerald-50"
                                onClick={() => addToCart(product.id)}
                              >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                className="bg-white/80 hover:bg-white"
                                onClick={() => openQuickView(product)}
                              >
                                <Search className="mr-2 h-4 w-4" />
                                Quick View
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute top-2 right-2 rounded-full bg-white ${wishlist.includes(product.id) ? "text-red-500" : "text-muted-foreground"}`}
                            onClick={() => toggleWishlist(product.id)}
                          >
                            <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                        <CardContent className="p-4 flex flex-col flex-1">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.certifications.slice(0, 2).map((cert) => (
                              <Badge key={cert} variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-emerald-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{product.rating}</span>
                          </div>
                          <div className="flex justify-between items-center mt-auto">
                            <div className="text-lg font-bold text-emerald-600">${product.price.toFixed(2)}</div>
                            <div className="flex items-center text-xs text-emerald-700">
                              <Leaf className="h-3 w-3 mr-1" />
                              <span>Eco-friendly</span>
                            </div>
                          </div>

                          {/* Color options preview */}
                          <div className="mt-3 flex gap-1">
                            {product.colors.slice(0, 4).map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full border hover:scale-125 transition-transform cursor-pointer"
                                style={{
                                  backgroundColor:
                                    color === "Multicolor"
                                      ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
                                      : color,
                                }}
                                title={color}
                              ></div>
                            ))}
                            {product.colors.length > 4 && (
                              <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold">
                                +{product.colors.length - 4}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section ref={impactRef} className="py-16 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={impactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Fashion With a Purpose</h2>
            <p className="text-muted-foreground">
              Every piece of clothing you purchase from us helps reduce environmental impact. Our sustainable fashion
              choices save water, reduce carbon emissions, and minimize waste compared to conventional clothing.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} whileHover={{ y: -5 }} className="bg-emerald-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reduced Carbon</h3>
              <p className="text-4xl font-bold text-emerald-600 mb-2">{impactInView ? <CountUp end={45} /> : "0"}%</p>
              <p className="text-sm text-muted-foreground">
                Lower carbon footprint compared to conventional clothing production
              </p>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ y: -5 }} className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Water Saved</h3>
              <p className="text-4xl font-bold text-blue-600 mb-2">{impactInView ? <CountUp end={91} /> : "0"}%</p>
              <p className="text-sm text-muted-foreground">
                Less water used in our sustainable clothing production processes
              </p>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ y: -5 }} className="bg-amber-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Waste Reduction</h3>
              <p className="text-4xl font-bold text-amber-600 mb-2">{impactInView ? <CountUp end={80} /> : "0"}%</p>
              <p className="text-sm text-muted-foreground">
                Less textile waste through recycling and sustainable practices
              </p>
            </motion.div>
          </motion.div>

          {/* Interactive impact chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={impactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 p-6 bg-gray-50 rounded-lg"
          >
            <h3 className="text-xl font-bold mb-6 text-center">Our Environmental Impact Progress</h3>
            <div className="h-64 flex items-end justify-between gap-4 px-4">
              {impactData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex justify-center gap-1 mb-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={impactInView ? { height: `${data.carbon}px` } : {}}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="w-3 bg-emerald-500 rounded-t-sm"
                      whileHover={{ scale: 1.1 }}
                    ></motion.div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={impactInView ? { height: `${data.water / 20}px` } : {}}
                      transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                      className="w-3 bg-blue-500 rounded-t-sm"
                      whileHover={{ scale: 1.1 }}
                    ></motion.div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={impactInView ? { height: `${data.waste * 2}px` } : {}}
                      transition={{ duration: 1, delay: index * 0.1 + 0.4 }}
                      className="w-3 bg-amber-500 rounded-t-sm"
                      whileHover={{ scale: 1.1 }}
                    ></motion.div>
                  </div>
                  <div className="text-sm font-medium">{data.year}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-2"></div>
                <span className="text-sm">Carbon (kg)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                <span className="text-sm">Water (L/100)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-500 rounded-sm mr-2"></div>
                <span className="text-sm">Waste (kg)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-emerald-600 text-white relative overflow-hidden">
        <FloatingParticles />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Sustainable Fashion Community</h2>
            <p className="mb-6">
              Subscribe to our newsletter for sustainable fashion tips, exclusive offers, and updates on new
              eco-friendly clothing collections.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Input
                placeholder="Your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-white text-emerald-600 hover:bg-emerald-100 group">
                Subscribe
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating cart button */}
      <motion.div className="fixed bottom-6 right-6 z-40" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg relative">
          <ShoppingBag className="h-6 w-6" />
          {cart.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
            >
              {cart.length}
            </motion.span>
          )}
        </Button>
      </motion.div>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(10px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </main>
  )
}
