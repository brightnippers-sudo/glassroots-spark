import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/ui/glass-card"
import HeroContentEditor from "../HeroContentEditor"
import StatisticsEditor from "./StatisticsEditor"
import TestimonialsEditor from "./TestimonialsEditor"
import HowItWorksEditor from "./HowItWorksEditor"
import ConversionEditor from "@/components/admin/homepage/ConversionEditor"

const HomePageManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Homepage Management</h1>
        <p className="text-muted-foreground">Manage all sections of the homepage</p>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hero">
          <HeroContentEditor />
        </TabsContent>
        
        <TabsContent value="conversion">
          <ConversionEditor />
        </TabsContent>
        
        <TabsContent value="statistics">
          <StatisticsEditor />
        </TabsContent>
        
        <TabsContent value="testimonials">
          <TestimonialsEditor />
        </TabsContent>
        
        <TabsContent value="how-it-works">
          <HowItWorksEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HomePageManager