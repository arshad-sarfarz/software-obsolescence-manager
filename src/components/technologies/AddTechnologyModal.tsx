
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

type TechnologyFormData = {
  name: string;
  version: string;
  category: string;
  supportStatus: 'EOL' | 'SS' | 'ES' | 'ESU';
  supportEndDate: string;
  standardSupportEndDate?: string;
  extendedSupportEndDate?: string;
  extendedSecurityUpdateEndDate?: string;
};

export function AddTechnologyModal() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TechnologyFormData>();

  const onSubmit = async (data: TechnologyFormData) => {
    try {
      const { error } = await supabase
        .from('technologies')
        .insert([{
          name: data.name,
          version: data.version,
          category: data.category,
          support_status: data.supportStatus,
          support_end_date: data.supportEndDate,
          standard_support_end_date: data.standardSupportEndDate,
          extended_support_end_date: data.extendedSupportEndDate,
          extended_security_update_end_date: data.extendedSecurityUpdateEndDate
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Technology has been created successfully",
      });
      setOpen(false);
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create technology",
        variant: "destructive",
      });
    }
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Technology Name</Label>
            <Input 
              id="name" 
              {...register("name", { required: "Technology name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input 
              id="version" 
              {...register("version", { required: "Version is required" })}
            />
            {errors.version && (
              <p className="text-sm text-red-500">{errors.version.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category" 
              {...register("category", { required: "Category is required" })}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportStatus">Support Status</Label>
            <Controller
              name="supportStatus"
              control={control}
              rules={{ required: "Support status is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select support status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EOL">End of Life</SelectItem>
                    <SelectItem value="SS">Standard Support</SelectItem>
                    <SelectItem value="ES">Extended Support</SelectItem>
                    <SelectItem value="ESU">Extended Security Updates</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEndDate">Support End Date</Label>
            <Input 
              type="date" 
              id="supportEndDate" 
              {...register("supportEndDate", { required: "Support end date is required" })}
            />
            {errors.supportEndDate && (
              <p className="text-sm text-red-500">{errors.supportEndDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="standardSupportEndDate">Standard Support End Date</Label>
            <Input 
              type="date" 
              id="standardSupportEndDate" 
              {...register("standardSupportEndDate")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="extendedSupportEndDate">Extended Support End Date</Label>
            <Input 
              type="date" 
              id="extendedSupportEndDate" 
              {...register("extendedSupportEndDate")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="extendedSecurityUpdateEndDate">Extended Security Update End Date</Label>
            <Input 
              type="date" 
              id="extendedSecurityUpdateEndDate" 
              {...register("extendedSecurityUpdateEndDate")}
            />
          </div>
          <Button type="submit" className="w-full">Create Technology</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
