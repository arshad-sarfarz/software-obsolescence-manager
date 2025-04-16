export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      application_servers: {
        Row: {
          application_id: string
          server_id: string
        }
        Insert: {
          application_id: string
          server_id: string
        }
        Update: {
          application_id?: string
          server_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_servers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      application_technologies: {
        Row: {
          application_id: string
          technology_id: string
        }
        Insert: {
          application_id: string
          technology_id: string
        }
        Update: {
          application_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_technologies_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          created_at: string | null
          criticality: Database["public"]["Enums"]["criticality_level"]
          description: string | null
          id: string
          name: string
          owner: string
          team: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          criticality?: Database["public"]["Enums"]["criticality_level"]
          description?: string | null
          id?: string
          name: string
          owner: string
          team: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          criticality?: Database["public"]["Enums"]["criticality_level"]
          description?: string | null
          id?: string
          name?: string
          owner?: string
          team?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      remediations: {
        Row: {
          actual_completion_date: string | null
          assigned_to: string
          comments: string | null
          created_at: string | null
          id: string
          remediation_type: string
          server_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["remediation_status"]
          target_completion_date: string
          technology_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_completion_date?: string | null
          assigned_to: string
          comments?: string | null
          created_at?: string | null
          id?: string
          remediation_type: string
          server_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["remediation_status"]
          target_completion_date: string
          technology_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_completion_date?: string | null
          assigned_to?: string
          comments?: string | null
          created_at?: string | null
          id?: string
          remediation_type?: string
          server_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["remediation_status"]
          target_completion_date?: string
          technology_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remediations_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remediations_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      server_technologies: {
        Row: {
          server_id: string
          technology_id: string
        }
        Insert: {
          server_id: string
          technology_id: string
        }
        Update: {
          server_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "server_technologies_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          comments: string | null
          created_at: string | null
          id: string
          name: string
          owner: string
          status: Database["public"]["Enums"]["server_status"]
          team: string
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          id?: string
          name: string
          owner: string
          status?: Database["public"]["Enums"]["server_status"]
          team: string
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          id?: string
          name?: string
          owner?: string
          status?: Database["public"]["Enums"]["server_status"]
          team?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      technologies: {
        Row: {
          category: string
          created_at: string | null
          extended_security_update_end_date: string | null
          extended_support_end_date: string | null
          id: string
          name: string
          standard_support_end_date: string | null
          support_end_date: string
          support_status: Database["public"]["Enums"]["support_status"]
          updated_at: string | null
          version: string
        }
        Insert: {
          category: string
          created_at?: string | null
          extended_security_update_end_date?: string | null
          extended_support_end_date?: string | null
          id?: string
          name: string
          standard_support_end_date?: string | null
          support_end_date: string
          support_status: Database["public"]["Enums"]["support_status"]
          updated_at?: string | null
          version: string
        }
        Update: {
          category?: string
          created_at?: string | null
          extended_security_update_end_date?: string | null
          extended_support_end_date?: string | null
          id?: string
          name?: string
          standard_support_end_date?: string | null
          support_end_date?: string
          support_status?: Database["public"]["Enums"]["support_status"]
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      criticality_level: "Low" | "Medium" | "High" | "Critical"
      remediation_status: "Not started" | "In progress" | "Completed"
      server_status:
        | "Active"
        | "Upgraded"
        | "Migrated to cloud"
        | "Decommissioned"
      support_status: "EOL" | "SS" | "ES" | "ESU"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      criticality_level: ["Low", "Medium", "High", "Critical"],
      remediation_status: ["Not started", "In progress", "Completed"],
      server_status: [
        "Active",
        "Upgraded",
        "Migrated to cloud",
        "Decommissioned",
      ],
      support_status: ["EOL", "SS", "ES", "ESU"],
    },
  },
} as const
