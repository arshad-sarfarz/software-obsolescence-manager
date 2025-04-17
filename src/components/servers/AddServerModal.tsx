
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
import { Textarea } from "@/components/ui/textarea";
import { Server } from "lucide-react";

export function AddServerModal() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement server creation logic
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Server className="mr-2 h-4 w-4" />
          Add Server
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Server</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Server Name</Label>
            <Input id="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input id="owner" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input id="team" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea id="comments" />
          </div>
          <Button type="submit" className="w-full">Create Server</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
