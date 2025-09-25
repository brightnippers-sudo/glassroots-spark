import { useState } from "react"
import { Plus, Edit, Copy, Archive, Calendar, Globe, Users, Filter } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

const EventsManager = () => {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Scholars Cambridge Maths 2025",
      type: "Maths",
      stage: "Stage One",
      region: "Southwest",
      openDate: "2025-02-01T09:00",
      closeDate: "2025-03-15T23:59",
      virtual: true,
      status: "active",
      isHero: true,
      fees: { lowerPrimary: 2500, upperPrimary: 2500, jss: 3000, sss: 3000 }
    },
    {
      id: "2", 
      title: "Scholars Cambridge Science 2025",
      type: "Science",
      stage: "Regional",
      region: "South-South & Southeast",
      openDate: "2025-03-01T09:00",
      closeDate: "2025-04-20T23:59",
      virtual: true,
      status: "draft",
      isHero: false,
      fees: { lowerPrimary: 2500, upperPrimary: 2500, jss: 3000, sss: 3000 }
    }
  ])

  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)

  const competitionTypes = ["Maths", "Science", "Coding"]
  const stages = ["Stage One", "Regional", "Finals"]
  const regions = ["Southwest", "South-South & Southeast", "North Central", "Northwest", "Northeast"]

  const handleCreateEvent = () => {
    setEditingEvent({
      id: "",
      title: "",
      type: "Maths",
      stage: "Stage One",
      region: "Southwest",
      openDate: "",
      closeDate: "",
      virtual: true,
      status: "draft",
      isHero: false,
      fees: { lowerPrimary: 2500, upperPrimary: 2500, jss: 3000, sss: 3000 }
    })
    setIsCreateModalOpen(true)
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent({...event})
    setIsCreateModalOpen(true)
  }

  const handleCopyEvent = (event: any) => {
    setEditingEvent({
      ...event,
      id: "",
      title: event.title + " (Copy)",
      status: "draft",
      isHero: false
    })
    setIsCreateModalOpen(true)
  }

  const handleSaveEvent = () => {
    if (editingEvent.id) {
      setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e))
    } else {
      setEvents([...events, { ...editingEvent, id: Date.now().toString() }])
    }
    setIsCreateModalOpen(false)
    setEditingEvent(null)
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for events:`, selectedEvents)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      draft: "secondary",
      archived: "destructive"
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events Manager</h1>
          <p className="text-muted-foreground">Admin / Events Manager</p>
        </div>
        <div className="flex gap-2">
          <GlassButton variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </GlassButton>
          <GlassButton variant="accent" onClick={handleCreateEvent}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </GlassButton>
        </div>
      </div>

      {/* Events List */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Competition Events</h2>
          {selectedEvents.length > 0 && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleBulkAction("publish")}>
                Publish Selected
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                Export Participants
              </Button>
            </div>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedEvents.length === events.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedEvents(events.map(e => e.id))
                    } else {
                      setSelectedEvents([])
                    }
                  }}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Registration Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hero</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEvents([...selectedEvents, event.id])
                      } else {
                        setSelectedEvents(selectedEvents.filter(id => id !== event.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    {event.title}
                    {event.virtual && (
                      <Badge variant="outline" className="ml-2">
                        <Globe className="w-3 h-3 mr-1" />
                        Virtual
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{event.type}</TableCell>
                <TableCell>{event.stage}</TableCell>
                <TableCell>{event.region}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Opens: {new Date(event.openDate).toLocaleDateString()}</div>
                    <div>Closes: {new Date(event.closeDate).toLocaleDateString()}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(event.status)}</TableCell>
                <TableCell>
                  {event.isHero && <Badge variant="secondary">Hero Event</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCopyEvent(event)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>

      {/* Create/Edit Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent?.id ? "Edit Competition" : "Create New Competition"}
            </DialogTitle>
          </DialogHeader>
          
          {editingEvent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Competition Title</Label>
                  <Input
                    id="event-title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                    placeholder="e.g., Scholars Cambridge Maths 2025"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-type">Competition Type</Label>
                    <Select
                      value={editingEvent.type}
                      onValueChange={(value) => setEditingEvent({...editingEvent, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {competitionTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="event-stage">Stage</Label>
                    <Select
                      value={editingEvent.stage}
                      onValueChange={(value) => setEditingEvent({...editingEvent, stage: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="event-region">Region Group</Label>
                  <Select
                    value={editingEvent.region}
                    onValueChange={(value) => setEditingEvent({...editingEvent, region: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="open-date">Registration Opens</Label>
                    <Input
                      id="open-date"
                      type="datetime-local"
                      value={editingEvent.openDate}
                      onChange={(e) => setEditingEvent({...editingEvent, openDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="close-date">Registration Closes</Label>
                    <Input
                      id="close-date"
                      type="datetime-local"
                      value={editingEvent.closeDate}
                      onChange={(e) => setEditingEvent({...editingEvent, closeDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="virtual"
                    checked={editingEvent.virtual}
                    onCheckedChange={(checked) => setEditingEvent({...editingEvent, virtual: checked})}
                  />
                  <Label htmlFor="virtual">Virtual Competition</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-hero"
                    checked={editingEvent.isHero}
                    onCheckedChange={(checked) => setEditingEvent({...editingEvent, isHero: checked})}
                  />
                  <Label htmlFor="is-hero">Use as homepage hero event</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Registration Fees (₦)</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between">
                      <span>Lower Primary</span>
                      <Input
                        type="number"
                        className="w-24"
                        value={editingEvent.fees.lowerPrimary}
                        onChange={(e) => setEditingEvent({
                          ...editingEvent,
                          fees: {...editingEvent.fees, lowerPrimary: parseInt(e.target.value)}
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Upper Primary</span>
                      <Input
                        type="number"
                        className="w-24"
                        value={editingEvent.fees.upperPrimary}
                        onChange={(e) => setEditingEvent({
                          ...editingEvent,
                          fees: {...editingEvent.fees, upperPrimary: parseInt(e.target.value)}
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>JSS</span>
                      <Input
                        type="number"
                        className="w-24"
                        value={editingEvent.fees.jss}
                        onChange={(e) => setEditingEvent({
                          ...editingEvent,
                          fees: {...editingEvent.fees, jss: parseInt(e.target.value)}
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SSS</span>
                      <Input
                        type="number"
                        className="w-24"
                        value={editingEvent.fees.sss}
                        onChange={(e) => setEditingEvent({
                          ...editingEvent,
                          fees: {...editingEvent.fees, sss: parseInt(e.target.value)}
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={editingEvent.status}
                    onValueChange={(value) => setEditingEvent({...editingEvent, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Public</SelectItem>
                      <SelectItem value="invite-only">Invite Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="syllabus-url">Syllabus URL</Label>
                  <Input
                    id="syllabus-url"
                    placeholder="https://example.com/syllabus.pdf"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    placeholder="Competition notes, special instructions, etc."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEvent}>
              {editingEvent?.id ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EventsManager