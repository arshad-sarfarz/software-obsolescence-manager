
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "lucide-react";

export function AddTechnologyModal() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement technology creation logic
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Database className="mr-2 h-4 w-4" />
          Add Technology
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Technology</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Technology Name</Label>
            <Input id="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input id="version" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEndDate">Support End Date</Label>
            <Input type="date" id="supportEndDate" required />
          </div>
          <Button type="submit" className="w-full">Create Technology</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
