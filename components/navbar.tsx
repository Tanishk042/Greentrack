"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Camera, Award, Recycle, ShoppingBag, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { MdWidthFull } from "react-icons/md"

const navItems = [
  {
    name: "Scanner",
    href: "/scanner",
    icon: <Camera className="h-5 w-5 mr-2" />,
  },
  {
    name: "EcoQuest",
    href: "/challenges",
    icon: <Award className="h-5 w-5 mr-2" />,
  },
  {
    name: "Waste Guide",
    href: "/waste-guide",
    icon: <Recycle className="h-5 w-5 mr-2" />,
  },
  {
    name: "Eco Shop",
    href: "/shop",
    icon: <ShoppingBag className="h-5 w-5 mr-2" />,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="h-14 w-14 flex items-center justify-center">
            <img src="/logo23.jpg" alt="" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block"></span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-emerald-600",
                pathname === item.href ? "text-emerald-600" : "text-muted-foreground",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            Sign In
          </Button>
          <Button size="sm" className="hidden md:flex bg-emerald-600 hover:bg-emerald-700">
            Get Started
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="h-14 w-14 flex items-center justify-center">
            <img src="/logo23.jpg" alt="" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block"></span>
        </Link>
              <nav className="grid gap-4 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center py-2 text-base font-medium transition-colors hover:text-emerald-600",
                      pathname === item.href ? "text-emerald-600" : "text-muted-foreground",
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="grid gap-2 mt-4">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
