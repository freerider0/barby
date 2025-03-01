
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export default function GradientBackground() {
  const [horizontalPosition, setHorizontalPosition] = useState(50)
  const [verticalPosition, setVerticalPosition] = useState(50)

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at ${horizontalPosition - 25}% ${verticalPosition}%, rgb(0, 255, 255, 0.15), transparent 40%),
            radial-gradient(circle at ${horizontalPosition}% ${verticalPosition}%, rgb(0, 0, 255, 0.15), transparent 50%),
            radial-gradient(circle at ${horizontalPosition + 25}% ${verticalPosition}%, rgb(128, 0, 128, 0.15), transparent 40%)
          `,
        }}
      />

      {/* Controls Panel */}
      <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 bg-black/50 backdrop-blur-md border-gray-800">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Horizontal Position</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[horizontalPosition]}
              onValueChange={([value]) => setHorizontalPosition(value)}
              className="[&_[role=slider]]:bg-white"
            />
            <div className="text-xs text-gray-400 text-right">{horizontalPosition}%</div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Vertical Position</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[verticalPosition]}
              onValueChange={([value]) => setVerticalPosition(value)}
              className="[&_[role=slider]]:bg-white"
            />
            <div className="text-xs text-gray-400 text-right">{verticalPosition}%</div>
          </div>
        </div>
      </Card>

      {/* Content area */}
      <div className="relative z-10 container mx-auto p-8">
        <h1 className="text-white text-4xl font-bold">Adjust Background Position</h1>
      </div>
    </div>
  )
}