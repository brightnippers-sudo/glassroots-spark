import { useState, useEffect } from "react"
import { apiService } from "@/services/apiService"
import { Save } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Statistics {
  participants: number;
  schools: number;
  states: number;
  years: number;
}

const DEFAULT_STATS: Statistics = {
  participants: 25000,
  schools: 500,
  states: 36,
  years: 8
};

const StatisticsEditor = () => {
  const [stats, setStats] = useState<Statistics>(DEFAULT_STATS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load statistics when component mounts
    const loadStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await apiService.getStatistics();
        console.log('Raw statistics response:', response)
        
        // Convert object with numeric keys to array
        const statsArray = response.success ? Object.values(response).filter(item => 
          typeof item === 'object' && item !== null && 'key_name' in item && 'value' in item
        ) : [];
        
        console.log('Converted stats array:', statsArray);
        
        if (statsArray.length > 0) {
          const statsObj = statsArray.reduce<Statistics>((acc, curr) => {
            const item = curr as { key_name: keyof Statistics; value: string | number };
            if (Object.keys(DEFAULT_STATS).includes(item.key_name)) {
              acc[item.key_name] = Number(item.value);
            }
            return acc;
          }, { ...DEFAULT_STATS });
          console.log('Processed statistics:', statsObj)
          setStats(statsObj);
        } else {
          console.error('Invalid statistics data format:', response);
          setError('Invalid data format received from server')
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
        setError('Failed to load statistics')
      } finally {
        setIsLoading(false)
      }
    };
    
    loadStats();
  }, []);

  const handleSave = async () => {
    if (isSaving) return
    
    try {
      setIsSaving(true)
      console.log('Saving statistics:', stats)
      const updateResponse = await apiService.updateStatistics(stats);
      console.log('Update response:', updateResponse);
      
      // Refresh the data
      const response = await apiService.getStatistics();
      // Convert object with numeric keys to array
      const statsArray = response.success ? Object.values(response).filter(item => 
        typeof item === 'object' && item !== null && 'key_name' in item && 'value' in item
      ) : [];
      
      if (statsArray.length > 0) {
        const statsObj = statsArray.reduce<Statistics>((acc, curr) => {
          const item = curr as { key_name: keyof Statistics; value: string | number };
          if (Object.keys(DEFAULT_STATS).includes(item.key_name)) {
            acc[item.key_name] = Number(item.value);
          }
          return acc;
        }, { ...DEFAULT_STATS });
        console.log('Updated statistics:', statsObj)
        setStats(statsObj);
      }
      
      alert('Statistics updated successfully!');
    } catch (error) {
      console.error('Error saving statistics:', error);
      alert('Error saving statistics. Please try again.');
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Homepage Statistics</h2>
        <GlassButton variant="primary" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </GlassButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="participants">Total Participants</Label>
          <Input
            id="participants"
            type="number"
            value={stats.participants}
            onChange={(e) => setStats({...stats, participants: parseInt(e.target.value)})}
          />
        </div>

        <div>
          <Label htmlFor="schools">Registered Schools</Label>
          <Input
            id="schools"
            type="number"
            value={stats.schools}
            onChange={(e) => setStats({...stats, schools: parseInt(e.target.value)})}
          />
        </div>

        <div>
          <Label htmlFor="states">States Covered</Label>
          <Input
            id="states"
            type="number"
            value={stats.states}
            onChange={(e) => setStats({...stats, states: parseInt(e.target.value)})}
          />
        </div>

        <div>
          <Label htmlFor="years">Years Running</Label>
          <Input
            id="years"
            type="number"
            value={stats.years}
            onChange={(e) => setStats({...stats, years: parseInt(e.target.value)})}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3">Preview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="p-4 bg-accent/10 rounded-lg text-center">
              <div className="text-2xl font-bold">{value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {key.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

export default StatisticsEditor