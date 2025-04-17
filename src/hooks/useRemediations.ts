
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Remediation } from "@/types";
import { toast } from "@/components/ui/use-toast";

export function useRemediations() {
  const queryClient = useQueryClient();

  // Fetch remediations
  const { data: remediations, isLoading } = useQuery({
    queryKey: ['remediations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('remediations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Remediation[];
    }
  });

  // Create remediation mutation
  const createRemediation = useMutation({
    mutationFn: async (newRemediation: Omit<Remediation, 'id'>) => {
      const { data, error } = await supabase
        .from('remediations')
        .insert(newRemediation)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remediations'] });
      toast({
        title: "Remediation Created",
        description: "A new remediation has been added successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create remediation: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update remediation mutation
  const updateRemediation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Remediation> & { id: string }) => {
      const { data, error } = await supabase
        .from('remediations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remediations'] });
      toast({
        title: "Remediation Updated",
        description: "The remediation has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update remediation: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete remediation mutation
  const deleteRemediation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('remediations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remediations'] });
      toast({
        title: "Remediation Deleted",
        description: "The remediation has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete remediation: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return {
    remediations,
    isLoading,
    createRemediation: createRemediation.mutate,
    updateRemediation: updateRemediation.mutate,
    deleteRemediation: deleteRemediation.mutate
  };
}
