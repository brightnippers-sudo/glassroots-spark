import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { apiService } from "@/services/apiService"

interface StatisticsCard {
  id: number
  value: string
  label: string
}

const defaultStatistics: StatisticsCard[] = [
  {
    id: 1,
    value: "25,000+",
    label: "Total Participants",
  },
  {
    id: 2,
    value: "500+",
    label: "Registered Schools",
  },
  {
    id: 3,
    value: "36",
    label: "States Covered",
  },
  {
    id: 4,
    value: "8",
    label: "Years of Excellence",
  }
]

export const StatisticsSection = () => {
  const [statistics, setStatistics] = useState<StatisticsCard[]>(defaultStatistics)

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const data = await apiService.getStatistics()
        if (data && Array.isArray(data.statistics)) {
          setStatistics(data.statistics.slice(0, 4)) // Ensure we only show 4 cards
        }
      } catch (error) {
        console.error('Error loading statistics:', error)
      }
    }

    loadStatistics()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {statistics.map((card) => (
        <GlassCard key={card.id} className="text-center hover-glass">
          <div className="text-3xl font-bold text-primary mb-2">{card.value}</div>
          <div className="text-muted-foreground">{card.label}</div>
        </GlassCard>
      ))}
    </div>
  )
}
