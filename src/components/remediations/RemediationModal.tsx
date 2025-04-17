
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Remediation } from "@/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Create a schema for form validation
const remediationSchema = z.object({
  serverId: z.string().optional(),
  technologyId: z.string().optional(),
  status: z.enum(["Not started", "In progress", "Completed"]),
  assignedTo: z.string().min(2, "Assigned to must be at least 2 characters"),
  startDate: z.string().optional(),
  targetCompletionDate: z.string().min(1, "Target completion date is required"),
  actualCompletionDate: z.string().optional(),
  remediationType: z.enum(["Upgrade", "Migration", "Decommission", "Other"]),
  comments: z.string().optional()
});

interface RemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  remediation?: Remediation;
  onSubmit: (data: Omit<Remediation, 'id'>) => void;
}

export function RemediationModal({ 
  isOpen, 
  onClose, 
  remediation, 
  onSubmit 
}: RemediationModalProps) {
  const form = useForm<z.infer<typeof remediationSchema>>({
    resolver: zodResolver(remediationSchema),
    defaultValues: remediation ? {
      serverId: remediation.serverId || undefined,
      technologyId: remediation.technologyId || undefined,
      status: remediation.status,
      assignedTo: remediation.assignedTo,
      startDate: remediation.startDate || undefined,
      targetCompletionDate: remediation.targetCompletionDate,
      actualCompletionDate: remediation.actualCompletionDate || undefined,
      remediationType: remediation.remediationType,
      comments: remediation.comments || undefined
    } : {
      status: "Not started",
      remediationType: "Other"
    }
  });

  const handleSubmit = (data: z.infer<typeof remediationSchema>) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {remediation ? "Edit Remediation" : "Create Remediation"}
          </DialogTitle>
          <DialogDescription>
            {remediation 
              ? "Update the details of this remediation" 
              : "Create a new remediation plan"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter server ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technology ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter technology ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Not started">Not started</SelectItem>
                      <SelectItem value="In progress">In progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignee name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetCompletionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Completion Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remediationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remediation Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select remediation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Upgrade">Upgrade</SelectItem>
                      <SelectItem value="Migration">Migration</SelectItem>
                      <SelectItem value="Decommission">Decommission</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter comments" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {remediation ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
