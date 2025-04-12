"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Leaf,
  Trophy,
  Users,
  Flame,
  Star,
  Share2,
  Gift,
  BarChart3,
  Medal,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Sample challenges data
const challenges = {
  daily: [
    {
      id: "d1",
      title: "Reusable Water Bottle",
      description: "Use a reusable water bottle instead of buying plastic bottles",
      impact: { carbon: 0.5, water: 3 },
      points: 10,
      completed: false,
      difficulty: "easy",
      category: "waste",
      streak: 0,
    },
    {
      id: "d2",
      title: "Lights Out",
      description: "Turn off lights when leaving a room for at least 1 hour",
      impact: { carbon: 0.2, water: 0 },
      points: 5,
      completed: true,
      difficulty: "easy",
      category: "energy",
      streak: 3,
    },
    {
      id: "d3",
      title: "Shorter Shower",
      description: "Take a shower under 5 minutes to conserve water",
      impact: { carbon: 0.1, water: 40 },
      points: 15,
      completed: false,
      difficulty: "medium",
      category: "water",
      streak: 0,
    },
  ],
  weekly: [
    {
      id: "w1",
      title: "Meatless Monday",
      description: "Go vegetarian for a full day to reduce carbon footprint",
      impact: { carbon: 4, water: 1500 },
      points: 50,
      completed: false,
      difficulty: "medium",
      category: "food",
      streak: 0,
    },
    {
      id: "w2",
      title: "Public Transport",
      description: "Use public transportation instead of a car for at least 3 days",
      impact: { carbon: 12, water: 0 },
      points: 75,
      completed: false,
      difficulty: "hard",
      category: "transport",
      streak: 0,
    },
    {
      id: "w3",
      title: "Zero Waste Shopping",
      description: "Shop with reusable bags and avoid packaged products",
      impact: { carbon: 2, water: 100 },
      points: 40,
      completed: true,
      difficulty: "medium",
      category: "waste",
      streak: 2,
    },
  ],
  monthly: [
    {
      id: "m1",
      title: "Plant a Tree",
      description: "Plant a tree in your community or contribute to a reforestation project",
      impact: { carbon: 20, water: -1000 },
      points: 200,
      completed: false,
      difficulty: "hard",
      category: "nature",
      streak: 0,
    },
    {
      id: "m2",
      title: "Energy Audit",
      description: "Conduct an energy audit of your home and implement at least 3 improvements",
      impact: { carbon: 50, water: 200 },
      points: 150,
      completed: false,
      difficulty: "expert",
      category: "energy",
      streak: 0,
    },
    {
      id: "m3",
      title: "Sustainable Wardrobe",
      description: "Buy only second-hand clothing or from sustainable brands for a month",
      impact: { carbon: 30, water: 2000 },
      points: 100,
      completed: false,
      difficulty: "medium",
      category: "lifestyle",
      streak: 0,
    },
  ],
}

// Sample leaderboard data
const leaderboardData = [
  { id: 1, name: "EcoWarrior", points: 1250, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "GreenThumb", points: 980, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "EarthSaver", points: 875, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "RecycleKing", points: 720, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "EcoHero", points: 650, avatar: "/placeholder.svg?height=40&width=40" },
]

// Sample achievements data
const achievements = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first challenge",
    icon: <Star className="h-5 w-5" />,
    unlocked: true,
  },
  {
    id: 2,
    name: "Streak Master",
    description: "Complete 5 challenges in a row",
    icon: <Flame className="h-5 w-5" />,
    unlocked: false,
  },
  { id: 3, name: "Carbon Cutter", description: "Save 50kg of CO2", icon: <Leaf className="h-5 w-5" />, unlocked: true },
  {
    id: 4,
    name: "Water Wizard",
    description: "Save 5000L of water",
    icon: <Leaf className="h-5 w-5" />,
    unlocked: false,
  },
  {
    id: 5,
    name: "Challenge Champion",
    description: "Complete all monthly challenges",
    icon: <Trophy className="h-5 w-5" />,
    unlocked: false,
  },
]

// Difficulty badge colors
const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-orange-100 text-orange-800",
  expert: "bg-red-100 text-red-800",
}

// Category badge colors
const categoryColors = {
  waste: "bg-purple-100 text-purple-800",
  energy: "bg-yellow-100 text-yellow-800",
  water: "bg-blue-100 text-blue-800",
  food: "bg-green-100 text-green-800",
  transport: "bg-slate-100 text-slate-800",
  nature: "bg-emerald-100 text-emerald-800",
  lifestyle: "bg-pink-100 text-pink-800",
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    },
  },
}

const counterVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
}

export default function ChallengesPage() {
  const [userChallenges, setUserChallenges] = useState(challenges)
  const [userStats, setUserStats] = useState({
    points: 95,
    carbonSaved: 14.3,
    waterSaved: 1640,
    completedChallenges: 2,
    streak: 3,
    level: 4,
  })
  const [activeTab, setActiveTab] = useState("daily")
  const [showConfetti, setShowConfetti] = useState(false)
  const [animatePoints, setAnimatePoints] = useState(false)
  const [filter, setFilter] = useState("all")
  const [showAchievement, setShowAchievement] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState(null)
  const [displayedPoints, setDisplayedPoints] = useState(userStats.points)

  // Animate points counter
  useEffect(() => {
    if (displayedPoints !== userStats.points) {
      const interval = setInterval(() => {
        setDisplayedPoints((prev) => {
          const diff = userStats.points - prev
          const increment = Math.max(1, Math.floor(Math.abs(diff) / 10))

          if (Math.abs(diff) <= increment) {
            clearInterval(interval)
            return userStats.points
          }

          return diff > 0 ? prev + increment : prev - increment
        })
      }, 50)

      return () => clearInterval(interval)
    }
  }, [userStats.points, displayedPoints])

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  // Trigger confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  // Check for achievements
  const checkAchievements = (stats) => {
    // Example: If user completes 5 challenges, unlock "Streak Master" achievement
    if (stats.completedChallenges >= 5 && !achievements[1].unlocked) {
      const updatedAchievements = [...achievements]
      updatedAchievements[1].unlocked = true

      setCurrentAchievement(updatedAchievements[1])
      setShowAchievement(true)

      setTimeout(() => {
        setShowAchievement(false)
      }, 3000)
    }
  }

  const toggleChallengeCompletion = (type, id) => {
    const updatedChallenges = { ...userChallenges }
    const challenge = updatedChallenges[type].find((c) => c.id === id)

    if (challenge) {
      const wasCompleted = challenge.completed
      challenge.completed = !wasCompleted

      // Update streak
      if (!wasCompleted) {
        challenge.streak += 1
      } else {
        challenge.streak = Math.max(0, challenge.streak - 1)
      }

      // Update user stats
      const pointsChange = challenge.completed ? challenge.points : -challenge.points
      const carbonChange = challenge.completed ? challenge.impact.carbon : -challenge.impact.carbon
      const waterChange = challenge.completed ? challenge.impact.water : -challenge.impact.water
      const completedChange = challenge.completed ? 1 : -1
      const streakChange = challenge.completed ? 1 : -1

      const newStats = {
        points: userStats.points + pointsChange,
        carbonSaved: userStats.carbonSaved + carbonChange,
        waterSaved: userStats.waterSaved + waterChange,
        completedChallenges: userStats.completedChallenges + completedChange,
        streak: userStats.streak + (challenge.completed ? 1 : -1),
        level: Math.floor((userStats.points + pointsChange) / 100) + 1,
      }

      setUserStats(newStats)

      // Animate points
      setAnimatePoints(true)
      setTimeout(() => setAnimatePoints(false), 1000)

      // Trigger confetti if completing a challenge
      if (challenge.completed) {
        triggerConfetti()
        checkAchievements(newStats)
      }
    }

    setUserChallenges(updatedChallenges)
  }

  // Filter challenges by category
  const getFilteredChallenges = (type) => {
    if (filter === "all") return userChallenges[type]
    return userChallenges[type].filter((challenge) => challenge.category === filter)
  }

  return (
    <main className="container py-8 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-500 opacity-10"
            style={{
              width: Math.random() * 20 + 5,
              height: Math.random() * 20 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Achievement popup */}
      <AnimatePresence>
        {showAchievement && currentAchievement && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg w-80">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-amber-800">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Achievement Unlocked!
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">{currentAchievement.icon}</div>
                <div>
                  <h3 className="font-bold">{currentAchievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentAchievement.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Eco Challenges</h1>
            <p className="text-muted-foreground">Complete challenges to reduce your environmental impact</p>
          </div>
          <motion.div variants={pulseVariants} animate="pulse">
            <Card className="w-full md:w-auto bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Your Points</div>
                    <motion.div
                      key={displayedPoints}
                      initial="initial"
                      animate="animate"
                      variants={counterVariants}
                      className="text-2xl font-bold"
                    >
                      {displayedPoints}
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Carbon Saved</div>
                    <motion.div
                      key={userStats.carbonSaved}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xl font-bold"
                    >
                      {userStats.carbonSaved} kg
                    </motion.div>
                  </div>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (userStats.carbonSaved / 50) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-1 bg-emerald-500 mt-2 rounded-full"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Leaf className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Water Saved</div>
                    <motion.div
                      key={userStats.waterSaved}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xl font-bold"
                    >
                      {userStats.waterSaved} L
                    </motion.div>
                  </div>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (userStats.waterSaved / 5000) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-1 bg-blue-500 mt-2 rounded-full"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Flame className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                    <div className="flex items-center">
                      <motion.div
                        key={userStats.streak}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xl font-bold mr-1"
                      >
                        {userStats.streak}
                      </motion.div>
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        backgroundColor: i < userStats.streak ? "#f59e0b" : "#e5e7eb",
                      }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="h-2 flex-1 rounded-full"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-4 flex justify-between items-center"
            >
              <h2 className="text-xl font-semibold">Your Challenges</h2>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8" onClick={() => setFilter("all")}>
                        <BarChart3 className="h-4 w-4 mr-1" />
                        All
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Show all challenges</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(categoryColors).map(([category, color]) => (
                        <Button
                          key={category}
                          variant="ghost"
                          size="sm"
                          className={`justify-start ${filter === category ? "bg-muted" : ""}`}
                          onClick={() => setFilter(category)}
                        >
                          <div className={`w-2 h-2 rounded-full ${color.split(" ")[0]} mr-2`}></div>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>

            <Tabs defaultValue="daily" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger
                    value="daily"
                    className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Daily
                  </TabsTrigger>
                  <TabsTrigger
                    value="weekly"
                    className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger
                    value="monthly"
                    className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              {(["daily", "weekly", "monthly"] as const).map((period) => (
                <TabsContent key={period} value={period} className="space-y-4 min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {activeTab === period && (
                      <motion.div
                        key={`${period}-${filter}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        {getFilteredChallenges(period).length > 0 ? (
                          getFilteredChallenges(period).map((challenge) => (
                            <motion.div key={challenge.id} variants={itemVariants}>
                              <Card
                                className={`${challenge.completed ? "border-emerald-200 bg-emerald-50" : ""} 
                                  transition-all duration-300 hover:shadow-md`}
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="flex items-center">
                                        {challenge.title}
                                        {challenge.completed && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                          >
                                            <CheckCircle2 className="ml-2 h-5 w-5 text-emerald-600" />
                                          </motion.div>
                                        )}
                                      </CardTitle>
                                      <CardDescription>{challenge.description}</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                      <Badge variant="outline" className={categoryColors[challenge.category]}>
                                        {challenge.category}
                                      </Badge>
                                      <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>
                                        {challenge.difficulty}
                                      </Badge>
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Badge
                                          variant="outline"
                                          className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                        >
                                          {challenge.points} pts
                                        </Badge>
                                      </motion.div>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-sm text-muted-foreground mb-1">Carbon Impact</div>
                                      <div className="flex items-center gap-2">
                                        <Leaf className="h-4 w-4 text-emerald-600" />
                                        <span>{challenge.impact.carbon} kg CO₂ saved</span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-muted-foreground mb-1">Water Impact</div>
                                      <div className="flex items-center gap-2">
                                        <Leaf className="h-4 w-4 text-blue-600" />
                                        <span>{challenge.impact.water} L saved</span>
                                      </div>
                                    </div>
                                  </div>

                                  {challenge.streak > 0 && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      className="mt-3 bg-amber-50 p-2 rounded-md border border-amber-100"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Flame className="h-4 w-4 text-amber-500" />
                                        <span className="text-sm font-medium text-amber-700">
                                          {challenge.streak} day streak! Keep it up!
                                        </span>
                                      </div>
                                    </motion.div>
                                  )}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button
                                      onClick={() => toggleChallengeCompletion(period, challenge.id)}
                                      variant={challenge.completed ? "outline" : "default"}
                                      className={challenge.completed ? "" : "bg-emerald-600 hover:bg-emerald-700"}
                                    >
                                      {challenge.completed ? "Mark as Incomplete" : "Mark as Complete"}
                                    </Button>
                                  </motion.div>
                                  <Button variant="ghost" size="icon">
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-10 text-center"
                          >
                            <div className="bg-muted p-4 rounded-full mb-4">
                              <Leaf className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">No challenges found</h3>
                            <p className="text-muted-foreground mb-4">
                              No {filter !== "all" ? filter : ""} challenges available for this period
                            </p>
                            <Button onClick={() => setFilter("all")} variant="outline">
                              View all challenges
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboardData.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={`flex items-center justify-between p-2 rounded-md ${
                          index === 0 ? "bg-amber-50 border border-amber-100" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6">
                            {index < 3 ? (
                              <Medal
                                className={`h-5 w-5 ${
                                  index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-700"
                                }`}
                              />
                            ) : (
                              <span className="text-sm text-muted-foreground">{index + 1}</span>
                            )}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <span className="font-bold">{user.points}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-sm">
                    View Full Leaderboard
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-emerald-600" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className={`flex items-center gap-3 p-2 rounded-md ${
                          achievement.unlocked ? "bg-emerald-50" : "opacity-60"
                        }`}
                      >
                        <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-emerald-100" : "bg-gray-100"}`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                        {achievement.unlocked && <CheckCircle2 className="h-4 w-4 text-emerald-600 ml-auto" />}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-sm">
                    View All Achievements
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-emerald-600" />
            <h3 className="font-medium">Community Progress</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Monthly Challenge Participation</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
                className="bg-gray-200 rounded-full h-2 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "68%" }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="bg-emerald-500 h-2"
                />
              </motion.div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Carbon Reduction Goal</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
                className="bg-gray-200 rounded-full h-2 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "42%" }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                  className="bg-emerald-500 h-2"
                />
              </motion.div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Water Conservation Goal</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
                className="bg-gray-200 rounded-full h-2 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                  className="bg-emerald-500 h-2"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
