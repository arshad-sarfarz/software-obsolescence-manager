
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
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ServerFormData = {
  name: string;
  owner: string;
  team: string;
  comments?: string;
};

export function AddServerModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServerFormData>();

  const onSubmit = async (data: ServerFormData) => {
    try {
      setIsSubmitting(true);
      
      // Bypassing authentication check temporarily for easier testing
      // In a production environment, this would need proper authentication
      
      const { error } = await supabase
        .from('servers')
        .insert([{
          name: data.name,
          owner: data.owner,
          team: data.team,
          comments: data.comments,
          status: 'Active'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Server has been created successfully",
      });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating server:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create server",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Server Name</Label>
            <Input 
              id="name" 
              {...register("name", { required: "Server name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input 
              id="owner" 
              {...register("owner", { required: "Owner is required" })}
            />
            {errors.owner && (
              <p className="text-sm text-red-500">{errors.owner.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input 
              id="team" 
              {...register("team", { required: "Team is required" })}
            />
            {errors.team && (
              <p className="text-sm text-red-500">{errors.team.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea id="comments" {...register("comments")} />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Server"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
