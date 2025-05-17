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
      ai_settings: {
        Row: {
          ai_enabled: boolean
          api_key: string
          created_at: string | null
          id: number
          max_tokens: number
          model: string
          provider: string
          system_prompt: string
          temperature: number
          updated_at: string | null
        }
        Insert: {
          ai_enabled?: boolean
          api_key: string
          created_at?: string | null
          id?: number
          max_tokens: number
          model: string
          provider: string
          system_prompt: string
          temperature: number
          updated_at?: string | null
        }
        Update: {
          ai_enabled?: boolean
          api_key?: string
          created_at?: string | null
          id?: number
          max_tokens?: number
          model?: string
          provider?: string
          system_prompt?: string
          temperature?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      construct_items: {
        Row: {
          construct_id: number | null
          description: string | null
          duration: number
          id: number
          name: string
          phase: string | null
        }
        Insert: {
          construct_id?: number | null
          description?: string | null
          duration?: number
          id?: number
          name: string
          phase?: string | null
        }
        Update: {
          construct_id?: number | null
          description?: string | null
          duration?: number
          id?: number
          name?: string
          phase?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "construct_items_construct_id_fkey"
            columns: ["construct_id"]
            isOneToOne: false
            referencedRelation: "constructs"
            referencedColumns: ["id"]
          },
        ]
      }
      constructs: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      environments: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      knowledge_chunks: {
        Row: {
          content: string
          created_at: string
          file_name: string
          file_type: string
          id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_name: string
          file_type: string
          id?: string
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string
          file_type?: string
          id?: string
        }
        Relationships: []
      }
      lesson_equipment: {
        Row: {
          equipment_id: number | null
          id: number
          lesson_id: string | null
        }
        Insert: {
          equipment_id?: number | null
          id?: number
          lesson_id?: string | null
        }
        Update: {
          equipment_id?: number | null
          id?: number
          lesson_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_equipment_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_items: {
        Row: {
          id: number
          item_id: number | null
          lesson_id: string | null
        }
        Insert: {
          id?: number
          item_id?: number | null
          lesson_id?: string | null
        }
        Update: {
          id?: number
          item_id?: number | null
          lesson_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "construct_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_items_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          construct_id: number | null
          created_at: string | null
          environment_id: number | null
          finish_role_id: number | null
          finish_time: number
          id: string
          main_role_id: number | null
          main_time: number
          preparation_role_id: number | null
          preparation_time: number
          school_id: number | null
          title: string
        }
        Insert: {
          construct_id?: number | null
          created_at?: string | null
          environment_id?: number | null
          finish_role_id?: number | null
          finish_time?: number
          id?: string
          main_role_id?: number | null
          main_time?: number
          preparation_role_id?: number | null
          preparation_time?: number
          school_id?: number | null
          title: string
        }
        Update: {
          construct_id?: number | null
          created_at?: string | null
          environment_id?: number | null
          finish_role_id?: number | null
          finish_time?: number
          id?: string
          main_role_id?: number | null
          main_time?: number
          preparation_role_id?: number | null
          preparation_time?: number
          school_id?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_construct_id_fkey"
            columns: ["construct_id"]
            isOneToOne: false
            referencedRelation: "constructs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_environment_id_fkey"
            columns: ["environment_id"]
            isOneToOne: false
            referencedRelation: "environments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_finish_role_id_fkey"
            columns: ["finish_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_main_role_id_fkey"
            columns: ["main_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_preparation_role_id_fkey"
            columns: ["preparation_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          id: number
          lessons_per_week: number
          name: string
        }
        Insert: {
          id?: number
          lessons_per_week?: number
          name: string
        }
        Update: {
          id?: number
          lessons_per_week?: number
          name?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
