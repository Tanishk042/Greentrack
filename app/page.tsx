import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Leaf, Recycle, ShoppingBag, BarChart3, Award } from "lucide-react"
import FeatureCard from "@/components/feature-card"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="container py-12 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your environmental impact, manage waste, and shop sustainably all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Camera className="h-10 w-10 text-emerald-500" />}
            title="Scan Products"
            description="Scan any product barcode to instantly see its environmental impact and sustainability score."
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10 text-emerald-500" />}
            title="Track Impact"
            description="Visualize your carbon footprint and see how your choices affect the environment."
          />
          <FeatureCard
            icon={<Award className="h-10 w-10 text-emerald-500" />}
            title="Complete Challenges"
            description="Take on eco-challenges and track your progress toward a more sustainable lifestyle."
          />
          <FeatureCard
            icon={<Recycle className="h-10 w-10 text-emerald-500" />}
            title="Waste Management"
            description="Learn how to properly dispose of items and find recycling centers near you."
          />
          <FeatureCard
            icon={<Leaf className="h-10 w-10 text-emerald-500" />}
            title="Eco Tips"
            description="Get personalized recommendations to reduce your environmental impact."
          />
          <FeatureCard
            icon={<ShoppingBag className="h-10 w-10 text-emerald-500" />}
            title="Shop Sustainably"
            description="Discover and purchase eco-friendly alternatives to everyday products."
          />
        </div>
      </section>
    </main>
  )
}
