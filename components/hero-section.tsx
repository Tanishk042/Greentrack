import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Track Your Environmental Impact
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Scan products, complete eco-challenges, manage waste, and shop sustainably to reduce your environmental
                footprint.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/scanner">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Scan a Product
                </Button>
              </Link>
              <Link href="/challenges">
                <Button size="lg" variant="outline">
                  View Eco Challenges
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full md:h-[450px] lg:h-[450px] xl:h-[550px] rounded-lg overflow-hidden bg-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                <div className="relative w-[80%] h-[80%] bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Scan Any Product</h3>
                  <p className="text-sm text-muted-foreground">
                    Instantly see environmental impact data and sustainable alternatives
                  </p>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="bg-emerald-50 p-2 rounded-md">
                      <div className="text-xs text-muted-foreground">Carbon</div>
                      <div className="text-emerald-600 font-medium">12.4 kg</div>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-md">
                      <div className="text-xs text-muted-foreground">Water</div>
                      <div className="text-emerald-600 font-medium">320 L</div>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-md">
                      <div className="text-xs text-muted-foreground">Waste</div>
                      <div className="text-emerald-600 font-medium">0.8 kg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
