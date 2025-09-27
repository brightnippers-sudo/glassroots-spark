import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDialog } from "@/hooks/use-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const RegistrationDialog = () => {
  const { isOpen, type, closeDialog } = useDialog()

  if (!isOpen || type !== 'register') return null

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for Competition</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Competition Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maths">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Student Name</Label>
            <Input placeholder="Enter student's full name" />
          </div>
          <div>
            <Label>School</Label>
            <Input placeholder="Enter school name" />
          </div>
          <div>
            <Label>Parent/Guardian Email</Label>
            <Input type="email" placeholder="Enter email address" />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button>Continue Registration</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RegistrationDialog
