'use client'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Sparkles, Video } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header Badge */}
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 border-blue-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Acolyte Health
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Generate Video Clips with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Veo-v3</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium">Our latest AI model powered by Google</p>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              Experience the future of video creation with Veo-v3, Google's most advanced AI video generation model.
              Transform your ideas into stunning, professional-quality video clips with unprecedented realism and
              creativity.
            </p>
            <p className="text-base text-gray-600">
              From concept to creation in seconds. Generate high-resolution videos with natural motion, perfect
              lighting, and cinematic quality that brings your vision to life.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">High Quality</h3>
              <p className="text-sm text-gray-600">Generate videos up to 4K resolution with stunning visual fidelity</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">Leveraging Google's cutting-edge Veo-v3 technology</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">Create professional videos in minutes, not hours</p>
            </div>
          </div>

          {/* Video Preview */}
          <div className="relative max-w-3xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl overflow-hidden shadow-2xl">
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
              >
                <source src="/video-1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => router.push('/chat')}
            >
              Let's Create
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Trusted by creative professionals worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">Google</div>
              <div className="text-2xl font-bold text-gray-400">Acolyte Health</div>
              <div className="text-2xl font-bold text-gray-400">Veo-v3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
