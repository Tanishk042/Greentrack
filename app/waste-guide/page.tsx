"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Recycle,
  AlertTriangle,
  MapPin,
  Info,
  Leaf,
  Upload,
  Camera,
  X,
  ChevronRight,
  Trophy,
  Sparkles,
  Globe,
  Clock,
  Thermometer,
  Droplet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import confetti from "canvas-confetti"

// Enhanced waste items database with environmental impact, recycling locations, and alternatives
const wasteItems = [
  {
    id: "w1",
    name: "Plastic Bottle",
    category: "Plastic",
    recyclable: true,
    instructions: "Remove cap and label. Rinse thoroughly. Place in recycling bin.",
    tips: "Consider using a reusable water bottle instead.",
    materials: ["PET plastic"],
    disposal: {
      curbside: true,
      dropOff: true,
      specialHandling: false,
    },
    impact: {
      carbon: 82.8, // grams of CO2
      water: 1.5, // liters
      waste: 0.03, // kg
      decomposition: "450 years",
      description:
        "Plastic bottles contribute to pollution and require significant resources to produce. They can harm wildlife if not properly disposed of.",
    },
    recyclingLocations: [
      {
        name: "City Recycling Center",
        address: "123 Green St, Eco City",
        distance: "2.5 miles",
        coordinates: { lat: 40.7128, lng: -74.006 },
      },
      {
        name: "Community Drop-off Point",
        address: "456 Recycle Ave, Eco City",
        distance: "1.2 miles",
        coordinates: { lat: 40.7148, lng: -74.013 },
      },
    ],
    alternatives: [
      {
        name: "Reusable Water Bottle",
        benefit: "Eliminates single-use plastic waste",
        link: "/shop",
        savingsPerYear: {
          carbon: 12.5,
          water: 1500,
          waste: 10.2,
        },
      },
    ],
    alternativeUses: [
      "Cut the bottom off to create a small planter for seedlings",
      "Use as a bird feeder by cutting holes and adding perches",
      "Create a piggy bank by cutting a slot in the cap",
      "Make a DIY sprinkler by poking holes in the cap",
    ],
    funFacts: [
      "A plastic bottle can take up to 450 years to decompose in a landfill",
      "Americans use 50 billion plastic water bottles per year, but only about 23% are recycled",
      "It takes 3 times the amount of water in a plastic bottle to make the bottle itself",
    ],
    recyclingSteps: [
      { step: 1, instruction: "Remove cap and label", image: "/placeholder.svg?height=100&width=100" },
      { step: 2, instruction: "Rinse thoroughly", image: "/placeholder.svg?height=100&width=100" },
      { step: 3, instruction: "Crush to save space (optional)", image: "/placeholder.svg?height=100&width=100" },
      { step: 4, instruction: "Place in recycling bin", image: "/placeholder.svg?height=100&width=100" },
    ],
  },
  {
    id: "w2",
    name: "Cardboard Box",
    category: "Paper",
    recyclable: true,
    instructions: "Remove tape and staples. Flatten. Place in recycling bin.",
    tips: "Reuse boxes for storage or shipping before recycling.",
    materials: ["Cardboard"],
    disposal: {
      curbside: true,
      dropOff: true,
      specialHandling: false,
    },
    impact: {
      carbon: 35.2, // grams of CO2
      water: 3.8, // liters
      waste: 0.05, // kg
      decomposition: "2 months",
      description:
        "Cardboard is biodegradable and recyclable, making it more environmentally friendly than plastic. However, its production still requires trees and energy.",
    },
    recyclingLocations: [
      {
        name: "City Recycling Center",
        address: "123 Green St, Eco City",
        distance: "2.5 miles",
        coordinates: { lat: 40.7128, lng: -74.006 },
      },
      {
        name: "Paper Recycling Facility",
        address: "789 Paper Mill Rd, Eco City",
        distance: "3.8 miles",
        coordinates: { lat: 40.7218, lng: -74.016 },
      },
    ],
    alternatives: [
      {
        name: "Reusable Storage Containers",
        benefit: "Longer lasting and more durable",
        link: "/shop",
        savingsPerYear: {
          carbon: 8.2,
          water: 950,
          waste: 5.5,
        },
      },
    ],
    alternativeUses: [
      "Create storage organizers for your home",
      "Make compost for your garden",
      "Use as weed barrier in garden beds",
      "Create DIY cat scratching posts or toys",
    ],
    funFacts: [
      "Recycling one ton of cardboard saves 9 cubic yards of landfill space",
      "Cardboard can be recycled 5-7 times before the fibers become too short",
      "Making new cardboard from recycled materials uses 75% less energy than making it from raw materials",
    ],
    recyclingSteps: [
      {
        step: 1,
        instruction: "Remove tape, staples, and other non-paper materials",
        image: "/placeholder.svg?height=100&width=100",
      },
      { step: 2, instruction: "Break down and flatten the box", image: "/placeholder.svg?height=100&width=100" },
      { step: 3, instruction: "Keep dry and clean", image: "/placeholder.svg?height=100&width=100" },
      {
        step: 4,
        instruction: "Place in recycling bin or bundle for collection",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "w3",
    name: "Smartphone",
    category: "Electronics",
    recyclable: false,
    instructions:
      "Do not place in regular trash or recycling. Take to an electronics recycling center or retailer with an e-waste program.",
    tips: "Consider repairing your phone or selling/donating it before recycling.",
    materials: ["Plastic", "Glass", "Metals", "Rare Earth Elements", "Battery"],
    disposal: {
      curbside: false,
      dropOff: true,
      specialHandling: true,
    },
    impact: {
      carbon: 55000, // grams of CO2 (55kg)
      water: 12700, // liters
      waste: 0.08, // kg
      decomposition: "1000+ years for components",
      description:
        "Smartphones contain valuable and hazardous materials. Manufacturing a single phone can produce as much carbon as driving a car for a week.",
    },
    recyclingLocations: [
      {
        name: "Electronics Retailer",
        address: "222 Tech Blvd, Eco City",
        distance: "1.7 miles",
        coordinates: { lat: 40.7158, lng: -74.009 },
      },
      {
        name: "E-Waste Recycling Center",
        address: "333 Circuit Ave, Eco City",
        distance: "4.2 miles",
        coordinates: { lat: 40.7228, lng: -74.026 },
      },
    ],
    alternatives: [
      {
        name: "Refurbished Smartphone",
        benefit: "Extends the life of existing devices",
        link: "/shop",
        savingsPerYear: {
          carbon: 45000,
          water: 10000,
          waste: 0.06,
        },
      },
      {
        name: "Modular Phone",
        benefit: "Allows for component replacement instead of whole device",
        link: "/shop",
        savingsPerYear: {
          carbon: 30000,
          water: 8000,
          waste: 0.05,
        },
      },
    ],
    alternativeUses: [
      "Repurpose as a dedicated smart home controller",
      "Use as a security camera with monitoring apps",
      "Convert to a media player or gaming device",
      "Use as a dedicated GPS for your car",
    ],
    funFacts: [
      "Only about 15-20% of e-waste is recycled globally",
      "A typical smartphone contains over 60 different elements, including precious metals like gold and silver",
      "Extending a smartphone's life by just one year can reduce its carbon footprint by 31%",
    ],
    recyclingSteps: [
      {
        step: 1,
        instruction: "Back up your data and perform a factory reset",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        step: 2,
        instruction: "Remove SIM card and any external storage",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        step: 3,
        instruction: "Find a certified e-waste recycler or trade-in program",
        image: "/placeholder.svg?height=100&width=100",
      },
      { step: 4, instruction: "Drop off at the recycling location", image: "/placeholder.svg?height=100&width=100" },
    ],
  },
  {
    id: "w4",
    name: "Batteries",
    category: "Hazardous",
    recyclable: true,
    instructions: "Do not place in regular trash or recycling. Take to a hazardous waste collection site.",
    tips: "Consider using rechargeable batteries to reduce waste.",
    materials: ["Heavy metals", "Chemicals"],
    disposal: {
      curbside: false,
      dropOff: true,
      specialHandling: true,
    },
    impact: {
      carbon: 120, // grams of CO2
      water: 5.2, // liters
      waste: 0.02, // kg
      decomposition: "100 years",
      description:
        "Batteries contain toxic chemicals that can leach into soil and water. They can cause fires in waste facilities if not properly disposed of.",
    },
    recyclingLocations: [
      {
        name: "Hazardous Waste Facility",
        address: "101 Chemical Way, Eco City",
        distance: "5.3 miles",
        coordinates: { lat: 40.7328, lng: -74.036 },
      },
      {
        name: "Electronics Store Battery Collection",
        address: "222 Tech Blvd, Eco City",
        distance: "1.7 miles",
        coordinates: { lat: 40.7158, lng: -74.009 },
      },
    ],
    alternatives: [
      {
        name: "Rechargeable Batteries",
        benefit: "Can be reused hundreds of times",
        link: "/shop",
        savingsPerYear: {
          carbon: 1200,
          water: 50,
          waste: 0.2,
        },
      },
      {
        name: "Solar-Powered Devices",
        benefit: "Eliminates battery waste entirely",
        link: "/shop",
        savingsPerYear: {
          carbon: 1500,
          water: 60,
          waste: 0.25,
        },
      },
    ],
    alternativeUses: [],
    funFacts: [
      "One AA battery can contaminate 20 square meters of soil for 50 years",
      "Americans throw away more than 3 billion batteries each year",
      "Recycling batteries recovers valuable metals like lithium, cobalt, and nickel",
    ],
    recyclingSteps: [
      {
        step: 1,
        instruction: "Tape the terminals of lithium batteries to prevent short circuits",
        image: "/placeholder.svg?height=100&width=100",
      },
      { step: 2, instruction: "Store in a non-metal container", image: "/placeholder.svg?height=100&width=100" },
      {
        step: 3,
        instruction: "Locate a battery recycling drop-off point",
        image: "/placeholder.svg?height=100&width=100",
      },
      { step: 4, instruction: "Drop off at the collection site", image: "/placeholder.svg?height=100&width=100" },
    ],
  },
  {
    id: "w5",
    name: "Food Scraps",
    category: "Organic",
    recyclable: true,
    instructions: "Compost if possible. Otherwise, dispose in food waste collection or regular trash.",
    tips: "Start a home compost bin to turn food scraps into nutrient-rich soil.",
    materials: ["Organic matter"],
    disposal: {
      curbside: true,
      dropOff: false,
      specialHandling: false,
    },
    impact: {
      carbon: 95, // grams of CO2 when sent to landfill
      water: 0, // liters
      waste: 0.25, // kg
      decomposition: "2-4 weeks (if composted)",
      description:
        "Food waste in landfills produces methane, a potent greenhouse gas. Composting food scraps returns nutrients to the soil and reduces emissions.",
    },
    recyclingLocations: [
      {
        name: "Community Compost Center",
        address: "555 Garden Way, Eco City",
        distance: "3.1 miles",
        coordinates: { lat: 40.7198, lng: -74.016 },
      },
    ],
    alternatives: [
      {
        name: "Home Composting Kit",
        benefit: "Creates nutrient-rich soil for gardening",
        link: "/shop",
        savingsPerYear: {
          carbon: 2500,
          water: 0,
          waste: 250,
        },
      },
      {
        name: "Food Waste Digester",
        benefit: "Processes food waste into liquid fertilizer",
        link: "/shop",
        savingsPerYear: {
          carbon: 2000,
          water: 0,
          waste: 200,
        },
      },
    ],
    alternativeUses: [
      "Create vegetable stock from vegetable scraps",
      "Use coffee grounds as garden fertilizer",
      "Regrow vegetables from scraps (lettuce, green onions)",
      "Make natural dyes from onion skins or avocado pits",
    ],
    funFacts: [
      "About one-third of all food produced globally is wasted",
      "Food waste in landfills produces methane, a greenhouse gas 25 times more potent than CO2",
      "Composting food waste can reduce your carbon footprint by up to 2,000 pounds of CO2 per year",
    ],
    recyclingSteps: [
      { step: 1, instruction: "Separate food scraps from other waste", image: "/placeholder.svg?height=100&width=100" },
      {
        step: 2,
        instruction: "Add to compost bin or food waste collection",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        step: 3,
        instruction: "Mix with brown materials (for home composting)",
        image: "/placeholder.svg?height=100&width=100",
      },
      { step: 4, instruction: "Turn compost regularly to aerate", image: "/placeholder.svg?height=100&width=100" },
    ],
  },
  {
    id: "w6",
    name: "Light Bulbs",
    category: "Hazardous",
    recyclable: true,
    instructions:
      "CFL and LED bulbs should be taken to a hazardous waste collection site. Incandescent bulbs can go in regular trash.",
    tips: "Switch to LED bulbs for longer life and less waste.",
    materials: ["Glass", "Metal", "Mercury (in CFLs)"],
    disposal: {
      curbside: false,
      dropOff: true,
      specialHandling: true,
    },
    impact: {
      carbon: 48.5, // grams of CO2
      water: 1.2, // liters
      waste: 0.08, // kg
      decomposition: "Up to 1000 years for glass components",
      description:
        "CFL bulbs contain mercury, which is toxic. LED bulbs are more efficient and last longer, reducing waste and energy use.",
    },
    recyclingLocations: [
      {
        name: "Hardware Store Collection Point",
        address: "333 Builder St, Eco City",
        distance: "2.2 miles",
        coordinates: { lat: 40.7168, lng: -74.012 },
      },
      {
        name: "Hazardous Waste Facility",
        address: "101 Chemical Way, Eco City",
        distance: "5.3 miles",
        coordinates: { lat: 40.7328, lng: -74.036 },
      },
    ],
    alternatives: [
      {
        name: "LED Light Bulbs",
        benefit: "Last longer and use less energy",
        link: "/shop",
        savingsPerYear: {
          carbon: 500,
          water: 10,
          waste: 0.5,
        },
      },
    ],
    alternativeUses: [
      "Create terrariums from incandescent bulbs",
      "Make decorative ornaments",
      "Use as small vases for single flowers",
      "Create art projects (with caution for broken glass)",
    ],
    funFacts: [
      "CFLs contain a small amount of mercury, about 4mg per bulb",
      "LED bulbs last up to 25 times longer than incandescent bulbs",
      "Switching to LED lighting can reduce energy usage by up to 80%",
    ],
    recyclingSteps: [
      { step: 1, instruction: "Handle carefully to avoid breakage", image: "/placeholder.svg?height=100&width=100" },
      {
        step: 2,
        instruction: "Place in original packaging or wrap in newspaper",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        step: 3,
        instruction: "Take to a designated recycling location",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        step: 4,
        instruction: "If a CFL breaks, ventilate the area and clean up carefully",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "w7",
    name: "Styrofoam",
    category: "Plastic",
    recyclable: false,
    instructions: "Most curbside programs do not accept styrofoam. Check for specialized recycling facilities.",
    tips: "Avoid purchasing products with styrofoam packaging when possible.",
    materials: ["Expanded Polystyrene"],
    disposal: {
      curbside: false,
      dropOff: false,
      specialHandling: true,
    },
    impact: {
      carbon: 135, // grams of CO2
      water: 2.8, // liters
      waste: 0.01, // kg (very light but high volume)
      decomposition: "500+ years",
      description:
        "Styrofoam is not biodegradable and can break into small pieces that pollute waterways and harm wildlife. It's difficult to recycle in most areas.",
    },
    recyclingLocations: [],
    alternatives: [
      {
        name: "Biodegradable Packaging",
        benefit: "Breaks down naturally in the environment",
        link: "/shop",
        savingsPerYear: {
          carbon: 1000,
          water: 20,
          waste: 5,
        },
      },
      {
        name: "Reusable Food Containers",
        benefit: "Eliminates single-use packaging waste",
        link: "/shop",
        savingsPerYear: {
          carbon: 1200,
          water: 25,
          waste: 6,
        },
      },
    ],
    alternativeUses: [
      "Use as packing material for shipping",
      "Create drainage in plant pots",
      "Make DIY insulation for coolers",
      "Use for craft projects and model making",
    ],
    funFacts: [
      "Styrofoam is actually a brand name; the material is expanded polystyrene foam (EPS)",
      "Styrofoam can take up to 30% of space in landfills worldwide",
      "When exposed to sunlight, styrofoam breaks down into microplastics that can enter the food chain",
    ],
    recyclingSteps: [
      {
        step: 1,
        instruction: "Check if your area has specialized styrofoam recycling",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        step: 2,
        instruction: "Clean the styrofoam of any food residue",
        image: "/placeholder.svg?height=100&width=100",
      },
      { step: 3, instruction: "Break down large pieces to save space", image: "/placeholder.svg?height=100&width=100" },
      {
        step: 4,
        instruction: "Transport to specialized recycling facility if available",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
]

// Sample recycling categories
const categories = [
  { id: "c1", name: "Plastic", icon: "♳", color: "bg-blue-100 text-blue-800" },
  { id: "c2", name: "Paper", icon: "📄", color: "bg-yellow-100 text-yellow-800" },
  { id: "c3", name: "Glass", icon: "🥛", color: "bg-green-100 text-green-800" },
  { id: "c4", name: "Metal", icon: "🥫", color: "bg-gray-100 text-gray-800" },
  { id: "c5", name: "Organic", icon: "🍎", color: "bg-emerald-100 text-emerald-800" },
  { id: "c6", name: "Hazardous", icon: "⚠️", color: "bg-red-100 text-red-800" },
  { id: "c7", name: "E-Waste", icon: "💻", color: "bg-purple-100 text-purple-800" },
  { id: "c8", name: "Textiles", icon: "👕", color: "bg-pink-100 text-pink-800" },
]

// Recycling achievements
const achievements = [
  { id: "a1", name: "Recycling Rookie", description: "Scan your first item", icon: "🔍", unlocked: true },
  { id: "a2", name: "Plastic Preventer", description: "Learn about 5 plastic items", icon: "♳", unlocked: false },
  {
    id: "a3",
    name: "E-Waste Warrior",
    description: "Properly recycle 3 electronic devices",
    icon: "💻",
    unlocked: false,
  },
  { id: "a4", name: "Compost Champion", description: "Start composting food waste", icon: "🌱", unlocked: false },
  { id: "a5", name: "Waste Reduction Hero", description: "Reduce your waste by 50%", icon: "🏆", unlocked: false },
]

// Animation variants
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

const slideIn = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

export default function WasteGuidePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchMethod, setSearchMethod] = useState<"name" | "image">("name")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [activeInfoTab, setActiveInfoTab] = useState("impact")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<any>(null)
  const [showMap, setShowMap] = useState(false)
  const [showRecyclingSteps, setShowRecyclingSteps] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonItem, setComparisonItem] = useState<any>(null)
  const [userRecyclingStats, setUserRecyclingStats] = useState({
    itemsRecycled: 12,
    carbonSaved: 1250,
    waterSaved: 4500,
    wastePrevented: 8.5,
  })
  const [showTip, setShowTip] = useState(false)
  const [currentTip, setCurrentTip] = useState("")

  // Refs for scroll animations
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [categoriesRef, categoriesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)

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

  const handleSearch = () => {
    if (!searchQuery && !uploadedImage) return

    setIsScanning(true)

    // Simulate scanning delay
    setTimeout(() => {
      // Find matching item
      const foundItem = wasteItems.find((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

      if (foundItem) {
        setSelectedItem(foundItem)
        // Trigger achievement for first scan if it's the first time
        if (!achievements[0].unlocked) {
          triggerAchievement(achievements[0])
        }
      } else {
        // If no exact match, simulate finding something close
        if (searchQuery.toLowerCase().includes("phone") || searchQuery.toLowerCase().includes("mobile")) {
          setSelectedItem(wasteItems.find((item) => item.name === "Smartphone"))
        } else if (searchQuery.toLowerCase().includes("bottle") || searchQuery.toLowerCase().includes("plastic")) {
          setSelectedItem(wasteItems.find((item) => item.name === "Plastic Bottle"))
        } else {
          setSelectedItem(null)
        }
      }
      setIsScanning(false)
    }, 1500)
  }

  const simulateImageUpload = () => {
    setIsUploading(true)
    setUploadedImage("/placeholder.svg?height=200&width=200")

    // Simulate processing delay
    setTimeout(() => {
      setIsUploading(false)
      setIsScanning(true)

      // Further delay to simulate scanning
      setTimeout(() => {
        // Simulate finding a smartphone from the image
        const foundItem = wasteItems.find((item) => item.name === "Smartphone")
        setSelectedItem(foundItem)
        setIsScanning(false)

        // Trigger achievement for first scan if it's the first time
        if (!achievements[0].unlocked) {
          triggerAchievement(achievements[0])
        }
      }, 1500)
    }, 1000)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedItem(null)
    setUploadedImage(null)
    setShowRecyclingSteps(false)
    setShowComparison(false)
    setComparisonItem(null)
  }

  const triggerAchievement = (achievement: any) => {
    setCurrentAchievement(achievement)
    setShowAchievement(true)

    // Show confetti
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      })

      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#6ee7b7"],
      })
    }

    // Hide achievement after 5 seconds
    setTimeout(() => {
      setShowAchievement(false)
    }, 5000)
  }

  const toggleRecyclingSteps = () => {
    setShowRecyclingSteps(!showRecyclingSteps)
  }

  const startComparison = () => {
    // Find a different item in the same category for comparison
    const sameCategory = wasteItems.filter(
      (item) => item.category === selectedItem.category && item.id !== selectedItem.id,
    )

    if (sameCategory.length > 0) {
      setComparisonItem(sameCategory[0])
    } else {
      // If no items in same category, just pick a different item
      const differentItem = wasteItems.find((item) => item.id !== selectedItem.id)
      setComparisonItem(differentItem)
    }

    setShowComparison(true)
  }

  const showRandomTip = () => {
    const tips = [
      "Rinse containers before recycling to prevent contamination",
      "Remove caps from plastic bottles before recycling",
      "Flatten cardboard boxes to save space in recycling bins",
      "Check with your local recycling center for specific guidelines",
      "Not all plastics are recyclable - check the number inside the recycling symbol",
    ]

    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setCurrentTip(randomTip)
    setShowTip(true)

    setTimeout(() => {
      setShowTip(false)
    }, 5000)
  }

  // Floating particles animation component
  const FloatingParticles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#a4c639] opacity-20"
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
    <main className="container py-8 relative overflow-x-hidden">
      {/* Canvas for confetti */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: "100vw", height: "100vh" }}
      ></canvas>

      {/* Achievement notification */}
      <AnimatePresence>
        {showAchievement && currentAchievement && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-[#a4c639] text-white px-6 py-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{currentAchievement.icon}</div>
              <div>
                <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                <p className="font-medium">{currentAchievement.name}</p>
                <p className="text-sm">{currentAchievement.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Random tip notification */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-xs"
          >
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">Recycling Tip</h3>
                <p className="text-sm">{currentTip}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Waste Guide Scanner</h1>
          <p className="text-muted-foreground">
            Find out how to properly dispose of items and their environmental impact
          </p>
        </motion.div>

        {/* User Stats Section */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-[#f8fae8] p-4 rounded-lg border border-[#a4c639] mb-8"
        >
          <h2 className="font-bold text-lg mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-[#a4c639] mr-2" />
            Your Recycling Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-[#a4c639]">
                {statsInView ? <CountUp end={userRecyclingStats.itemsRecycled} /> : "0"}
              </div>
              <div className="text-sm text-muted-foreground">Items Recycled</div>
            </div>
            <div className="bg-white p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-[#a4c639]">
                {statsInView ? <CountUp end={userRecyclingStats.carbonSaved} /> : "0"}g
              </div>
              <div className="text-sm text-muted-foreground">CO₂ Saved</div>
            </div>
            <div className="bg-white p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-[#a4c639]">
                {statsInView ? <CountUp end={userRecyclingStats.waterSaved} /> : "0"}L
              </div>
              <div className="text-sm text-muted-foreground">Water Saved</div>
            </div>
            <div className="bg-white p-3 rounded-md text-center">
              <div className="text-2xl font-bold text-[#a4c639]">
                {statsInView ? <CountUp end={userRecyclingStats.wastePrevented} /> : "0"}kg
              </div>
              <div className="text-sm text-muted-foreground">Waste Prevented</div>
            </div>
          </div>
        </motion.div>

        {/* Search Tabs */}
        <Tabs
          defaultValue="name"
          value={searchMethod}
          onValueChange={(value) => setSearchMethod(value as "name" | "image")}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-[#e8f0c0]">
            <TabsTrigger value="name" className="data-[state=active]:bg-[#a4c639] data-[state=active]:text-white">
              <Search className="mr-2 h-4 w-4" />
              Search by Name
            </TabsTrigger>
            <TabsTrigger value="image" className="data-[state=active]:bg-[#a4c639] data-[state=active]:text-white">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="name" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for an item (e.g., plastic bottle, smartphone)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch()
                    }}
                    className="pl-10 pr-10 h-12 border-2 border-[#a4c639] rounded-md"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSearch}
                    disabled={isScanning}
                    className="ml-2 h-12 bg-[#a4c639] hover:bg-[#8ca830] text-white"
                  >
                    {isScanning ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Scanning...
                      </div>
                    ) : (
                      "Check"
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="image" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-[#a4c639] rounded-md p-8 bg-[#f8fae8] relative overflow-hidden"
            >
              <FloatingParticles />

              {uploadedImage ? (
                <div className="text-center relative z-10">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <Image
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded item"
                      width={160}
                      height={160}
                      className="object-contain"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setUploadedImage(null)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                  {isScanning ? (
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-[#a4c639] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Analyzing image...</p>
                    </div>
                  ) : isUploading ? (
                    <p className="text-muted-foreground">Processing upload...</p>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={handleSearch} className="bg-[#a4c639] hover:bg-[#8ca830] text-white">
                        Identify Item
                      </Button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="relative z-10"
                  >
                    <Camera className="h-12 w-12 text-[#a4c639] mb-4" />
                  </motion.div>
                  <p className="text-center text-muted-foreground mb-4 relative z-10">
                    Take or upload a photo of the item you want to recycle
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
                    <Button
                      onClick={simulateImageUpload}
                      disabled={isUploading}
                      className="bg-[#a4c639] hover:bg-[#8ca830] text-white"
                    >
                      {isUploading ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Uploading...
                        </div>
                      ) : (
                        "Upload Image"
                      )}
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Results */}
        <AnimatePresence mode="wait">
          {selectedItem && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Result Header */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`p-4 rounded-md ${selectedItem.recyclable ? "bg-green-50" : "bg-red-50"}`}
              >
                <div className="flex items-start">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className={`p-2 rounded-full ${selectedItem.recyclable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} mr-3`}
                  >
                    {selectedItem.recyclable ? <Recycle className="h-6 w-6" /> : <X className="h-6 w-6" />}
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                    <div className="flex items-center">
                      <span className={`font-medium ${selectedItem.recyclable ? "text-green-700" : "text-red-700"}`}>
                        {selectedItem.recyclable ? "Recyclable" : "Not Recyclable"}
                      </span>
                      <span className="mx-2">•</span>
                      <Badge variant="outline">{selectedItem.category}</Badge>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#a4c639] text-[#a4c639]"
                    onClick={toggleRecyclingSteps}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    {showRecyclingSteps ? "Hide Recycling Steps" : "Show Recycling Steps"}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#a4c639] text-[#a4c639]"
                    onClick={startComparison}
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Compare With Similar Items
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#a4c639] text-[#a4c639]"
                    onClick={showRandomTip}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Recycling Tip
                  </Button>
                </motion.div>
              </div>

              {/* Recycling Steps */}
              <AnimatePresence>
                {showRecyclingSteps && selectedItem.recyclingSteps && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Card className="bg-[#f8fae8] border-[#a4c639]">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                          <Recycle className="mr-2 h-5 w-5 text-[#a4c639]" />
                          How to Recycle {selectedItem.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedItem.recyclingSteps.map((step: any, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 bg-white p-3 rounded-lg"
                            >
                              <div className="bg-[#a4c639] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                {step.step}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{step.instruction}</p>
                              </div>
                              <div className="w-12 h-12 bg-gray-100 rounded-md shrink-0 flex items-center justify-center">
                                <Image
                                  src={step.image || "/placeholder.svg"}
                                  alt={step.instruction}
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comparison View */}
              <AnimatePresence>
                {showComparison && comparisonItem && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Card className="bg-gray-50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-lg">Environmental Impact Comparison</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowComparison(false)
                              setComparisonItem(null)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-3 md:col-span-1">
                            <div className="text-center p-2">
                              <div className="font-medium">{selectedItem.name}</div>
                              <Badge variant="outline">{selectedItem.category}</Badge>
                            </div>
                          </div>
                          <div className="col-span-3 md:col-span-1">
                            <div className="text-center font-bold">VS</div>
                          </div>
                          <div className="col-span-3 md:col-span-1">
                            <div className="text-center p-2">
                              <div className="font-medium">{comparisonItem.name}</div>
                              <Badge variant="outline">{comparisonItem.category}</Badge>
                            </div>
                          </div>

                          {/* Carbon comparison */}
                          <div className="col-span-3 bg-white p-3 rounded-lg">
                            <div className="font-medium mb-2 flex items-center">
                              <Thermometer className="h-4 w-4 text-red-500 mr-2" />
                              Carbon Footprint
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="text-center">{selectedItem.impact.carbon} g CO₂</div>
                              <div className="text-center text-muted-foreground text-sm">
                                {selectedItem.impact.carbon > comparisonItem.impact.carbon ? (
                                  <span className="text-red-500">
                                    {Math.round(
                                      (selectedItem.impact.carbon / comparisonItem.impact.carbon) * 100 - 100,
                                    )}
                                    % higher
                                  </span>
                                ) : (
                                  <span className="text-green-500">
                                    {Math.round(
                                      (comparisonItem.impact.carbon / selectedItem.impact.carbon) * 100 - 100,
                                    )}
                                    % lower
                                  </span>
                                )}
                              </div>
                              <div className="text-center">{comparisonItem.impact.carbon} g CO₂</div>
                            </div>
                          </div>

                          {/* Water comparison */}
                          <div className="col-span-3 bg-white p-3 rounded-lg">
                            <div className="font-medium mb-2 flex items-center">
                              <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                              Water Usage
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="text-center">{selectedItem.impact.water} L</div>
                              <div className="text-center text-muted-foreground text-sm">
                                {selectedItem.impact.water > comparisonItem.impact.water ? (
                                  <span className="text-red-500">
                                    {Math.round((selectedItem.impact.water / comparisonItem.impact.water) * 100 - 100)}%
                                    higher
                                  </span>
                                ) : (
                                  <span className="text-green-500">
                                    {Math.round((comparisonItem.impact.water / selectedItem.impact.water) * 100 - 100)}%
                                    lower
                                  </span>
                                )}
                              </div>
                              <div className="text-center">{comparisonItem.impact.water} L</div>
                            </div>
                          </div>

                          {/* Decomposition comparison */}
                          <div className="col-span-3 bg-white p-3 rounded-lg">
                            <div className="font-medium mb-2 flex items-center">
                              <Clock className="h-4 w-4 text-amber-500 mr-2" />
                              Decomposition Time
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="text-center">{selectedItem.impact.decomposition}</div>
                              <div className="text-center text-muted-foreground text-sm">vs</div>
                              <div className="text-center">{comparisonItem.impact.decomposition}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info Tabs */}
              <Card>
                <Tabs defaultValue="impact" value={activeInfoTab} onValueChange={setActiveInfoTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted">
                    <TabsTrigger
                      value="impact"
                      className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                    >
                      <Leaf className="mr-2 h-4 w-4" />
                      Environmental Impact
                    </TabsTrigger>
                    <TabsTrigger
                      value="locations"
                      className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Recycling Locations
                    </TabsTrigger>
                    <TabsTrigger
                      value="alternatives"
                      className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                    >
                      <Recycle className="mr-2 h-4 w-4" />
                      Alternative Uses
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="impact" className="p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <p className="text-muted-foreground">{selectedItem.impact.description}</p>

                      <div>
                        <h3 className="font-medium mb-2">Environmental Footprint</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Carbon Footprint</span>
                              <span className="text-sm font-medium">{selectedItem.impact.carbon} g CO₂</span>
                            </div>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((selectedItem.impact.carbon / 150) * 100, 100)}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-2 bg-red-500 rounded"
                            ></motion.div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Water Usage</span>
                              <span className="text-sm font-medium">{selectedItem.impact.water} L</span>
                            </div>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((selectedItem.impact.water / 6) * 100, 100)}%` }}
                              transition={{ duration: 1, delay: 0.4 }}
                              className="h-2 bg-blue-500 rounded"
                            ></motion.div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Waste Generated</span>
                              <span className="text-sm font-medium">{selectedItem.impact.waste} kg</span>
                            </div>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((selectedItem.impact.waste / 0.1) * 100, 100)}%` }}
                              transition={{ duration: 1, delay: 0.6 }}
                              className="h-2 bg-amber-500 rounded"
                            ></motion.div>
                          </div>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-amber-50 p-4 rounded-md"
                      >
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-amber-800">Decomposition Time</h3>
                            <p className="text-amber-700">{selectedItem.impact.decomposition}</p>
                          </div>
                        </div>
                      </motion.div>

                      <div>
                        <h3 className="font-medium mb-2">Proper Disposal</h3>
                        <p className="text-muted-foreground">{selectedItem.instructions}</p>
                      </div>

                      {/* Fun Facts */}
                      {selectedItem.funFacts && selectedItem.funFacts.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                            <Globe className="h-5 w-5 text-blue-600 mr-2" />
                            Did You Know?
                          </h3>
                          <ul className="space-y-2">
                            {selectedItem.funFacts.map((fact: string, index: number) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-blue-700 flex items-start"
                              >
                                <span className="mr-2">•</span>
                                <span>{fact}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="locations" className="p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      {selectedItem.recyclingLocations.length > 0 ? (
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            {selectedItem.recyclable
                              ? "This item can be recycled at these locations:"
                              : "This item is not commonly recyclable through standard programs. However, these specialized facilities may accept it:"}
                          </p>

                          {selectedItem.recyclingLocations.map((location: any, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                              className="bg-muted p-4 rounded-md"
                            >
                              <div className="flex">
                                <MapPin className="h-5 w-5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                                <div>
                                  <h3 className="font-medium">{location.name}</h3>
                                  <p className="text-sm text-muted-foreground">{location.address}</p>
                                  <p className="text-sm text-emerald-600">{location.distance} away</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex justify-center"
                          >
                            <Button
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => setShowMap(!showMap)}
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              {showMap ? "Hide Map" : "Show on Map"}
                            </Button>
                          </motion.div>

                          {/* Interactive Map */}
                          <AnimatePresence>
                            {showMap && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "300px" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden rounded-lg"
                              >
                                <div className="w-full h-full bg-gray-200 rounded-lg relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                      <MapPin className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                                      <p className="text-muted-foreground">
                                        Interactive map would display recycling locations here
                                      </p>
                                    </div>
                                  </div>
                                  {selectedItem.recyclingLocations.map((location: any, index: number) => (
                                    <motion.div
                                      key={index}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.5 + index * 0.2 }}
                                      className="absolute"
                                      style={{
                                        left: `${30 + index * 20}%`,
                                        top: `${40 + (index % 2) * 20}%`,
                                      }}
                                    >
                                      <div className="bg-emerald-600 text-white p-2 rounded shadow-lg text-sm">
                                        {location.name}
                                        <div className="absolute w-2 h-2 bg-emerald-600 rotate-45 -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Standard Recycling Options</h3>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            This item is not commonly recyclable through standard programs. Consider the alternative
                            uses or sustainable replacements.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="alternatives" className="p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      {selectedItem.alternativeUses && selectedItem.alternativeUses.length > 0 ? (
                        <div>
                          <h3 className="font-medium mb-3">Creative Reuse Ideas</h3>
                          <ul className="space-y-2">
                            {selectedItem.alternativeUses.map((use: string, index: number) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start"
                              >
                                <div className="bg-emerald-100 p-1 rounded-full mr-2 mt-0.5">
                                  <Leaf className="h-4 w-4 text-emerald-600" />
                                </div>
                                <span>{use}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="bg-muted p-4 rounded-md">
                          <p className="text-muted-foreground">No alternative uses available for this item.</p>
                        </div>
                      )}

                      {selectedItem.alternatives && selectedItem.alternatives.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-3">Sustainable Alternatives</h3>
                          <div className="space-y-4">
                            {selectedItem.alternatives.map((alternative: any, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-emerald-50 p-4 rounded-md hover:bg-emerald-100 transition-colors"
                              >
                                <Link href={alternative.link} className="block">
                                  <div className="flex">
                                    <Leaf className="h-5 w-5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <h4 className="font-medium">{alternative.name}</h4>
                                      <p className="text-sm text-emerald-700">{alternative.benefit}</p>

                                      {alternative.savingsPerYear && (
                                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                                          <div className="bg-emerald-100 p-1 rounded text-center">
                                            <span className="block font-medium text-emerald-800">
                                              {alternative.savingsPerYear.carbon}g
                                            </span>
                                            <span className="text-emerald-700">CO₂ saved/year</span>
                                          </div>
                                          <div className="bg-blue-100 p-1 rounded text-center">
                                            <span className="block font-medium text-blue-800">
                                              {alternative.savingsPerYear.water}L
                                            </span>
                                            <span className="text-blue-700">water saved/year</span>
                                          </div>
                                          <div className="bg-amber-100 p-1 rounded text-center">
                                            <span className="block font-medium text-amber-800">
                                              {alternative.savingsPerYear.waste}kg
                                            </span>
                                            <span className="text-amber-700">waste reduced/year</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-emerald-600 self-center" />
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedItem.tips && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="bg-blue-50 p-4 rounded-md"
                        >
                          <div className="flex">
                            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5 mr-2" />
                            <div>
                              <h3 className="font-medium text-blue-800">Eco Tip</h3>
                              <p className="text-blue-700">{selectedItem.tips}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Timeline visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="font-medium mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-gray-600 mr-2" />
                  Decomposition Timeline
                </h3>
                <div className="relative h-16">
                  <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-300 -translate-y-1/2"></div>

                  {/* Timeline markers */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                    <div className="text-xs mt-1 text-center">Today</div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="absolute left-1/4 top-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div className="text-xs mt-1 text-center">1 year</div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="absolute left-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div className="text-xs mt-1 text-center">10 years</div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1 }}
                    className="absolute left-3/4 top-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div className="text-xs mt-1 text-center">100 years</div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.3 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="text-xs mt-1 text-center">{selectedItem.impact.decomposition}</div>
                  </motion.div>

                  {/* Progress line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-emerald-500 to-red-500 -translate-y-1/2"
                  ></motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results Message */}
        <AnimatePresence>
          {searchQuery && !selectedItem && !isScanning && !isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 bg-muted rounded-lg"
            >
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Item Not Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find information about this item. Try a different search term or browse categories.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning Animation */}
        <AnimatePresence>
          {isScanning && !isUploading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 bg-[#f8fae8] rounded-lg border-2 border-[#a4c639]"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                >
                  <Recycle className="h-16 w-16 text-[#a4c639] mx-auto" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-[#a4c639] border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                ></motion.div>
              </div>
              <h3 className="text-lg font-medium mb-2">Scanning Item</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Analyzing the item to provide recycling information...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Section */}
        {!selectedItem && !isScanning && !isUploading && (
          <motion.div
            ref={categoriesRef}
            initial={{ opacity: 0, y: 20 }}
            animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mt-8"
          >
            <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={categoriesInView ? "visible" : "hidden"}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  variants={scaleUp}
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSearchQuery(category.name)
                      handleSearch()
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${category.color}`}
                      >
                        <span className="text-xl">{category.icon}</span>
                      </div>
                      <h3 className="font-medium">{category.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Achievements Section */}
        {!selectedItem && !isScanning && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 bg-[#f8fae8] p-6 rounded-lg border border-[#a4c639]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-[#a4c639]" />
              <h3 className="font-bold text-lg">Recycling Achievements</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-4 rounded-lg ${achievement.unlocked ? "bg-white" : "bg-gray-100"} relative overflow-hidden`}
                >
                  {achievement.unlocked && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-[#a4c639] text-white text-xs px-2 py-1 rounded-bl">Unlocked</div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-2xl ${achievement.unlocked ? "opacity-100" : "opacity-50"}`}>
                      {achievement.icon}
                    </div>
                    <div className={achievement.unlocked ? "" : "opacity-50"}>
                      <h4 className="font-medium">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-8 bg-[#f8fae8] p-4 rounded-lg border border-[#a4c639]">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-5 w-5 text-[#a4c639]" />
            <h3 className="font-medium">Recycling Tips</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="font-medium">Clean Before Recycling:</span>
              <span className="text-muted-foreground">Rinse containers to remove food residue.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">Check Local Guidelines:</span>
              <span className="text-muted-foreground">Recycling rules vary by location.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">Reduce First:</span>
              <span className="text-muted-foreground">The best waste is the waste you don't create.</span>
            </li>
          </ul>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
            <Button
              variant="outline"
              className="w-full border-[#a4c639] text-[#a4c639] hover:bg-[#f0f8d9]"
              onClick={showRandomTip}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Show Random Tip
            </Button>
          </motion.div>
        </div>
      </div>

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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </main>
  )
}
