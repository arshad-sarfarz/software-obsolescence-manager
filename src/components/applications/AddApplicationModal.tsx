
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
import { MonitorPlay } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ApplicationFormData = {
  name: string;
  description?: string;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  owner: string;
  team: string;
};

export function AddApplicationModal() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ApplicationFormData>();

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      const { error } = await supabase
        .from('applications')
        .insert([{
          name: data.name,
          description: data.description,
          criticality: data.criticality,
          owner: data.owner,
          team: data.team
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application has been created successfully",
      });
      setOpen(false);
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create application",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <MonitorPlay className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Application Name</Label>
            <Input 
              id="name" 
              {...register("name", { required: "Application name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="criticality">Criticality</Label>
            <Controller
              name="criticality"
              control={control}
              defaultValue="Low"
              rules={{ required: "Criticality is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select criticality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
          <Button type="submit" className="w-full">Create Application</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
