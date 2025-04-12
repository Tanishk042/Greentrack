"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ScannerPopup from "@/components/ScannerPopup";

export default function ScannerPage() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <main className="container py-8">
      <div className="flex flex-col items-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Product Scanner</h1>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Product Scanner</CardTitle>
            <CardDescription>
              Scan products to get nutritional information and environmental impact analysis.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col gap-4 justify-center items-center">
            <button
              onClick={() => setShowScanner(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
            >
              Open Scanner
            </button>
            <p className="text-sm text-muted-foreground">© 2025 EcoScan. All rights reserved.</p>
          </CardFooter>
        </Card>

        {/* Scanner Popup */}
        {showScanner && <ScannerPopup onClose={() => setShowScanner(false)} />}
      </div>
    </main>
  )
}