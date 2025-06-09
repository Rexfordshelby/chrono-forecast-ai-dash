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
      asset_types: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          asset_type_id: string | null
          category: string
          country: string | null
          created_at: string
          currency: string | null
          description: string | null
          exchange: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          logo_url: string | null
          market_cap: number | null
          name: string
          sector: string | null
          symbol: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          asset_type_id?: string | null
          category: string
          country?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          exchange?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          market_cap?: number | null
          name: string
          sector?: string | null
          symbol: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          asset_type_id?: string | null
          category?: string
          country?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          exchange?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          market_cap?: number | null
          name?: string
          sector?: string | null
          symbol?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_asset_type_id_fkey"
            columns: ["asset_type_id"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          actual_outcome: string | null
          confidence: number
          created_at: string
          direction: string
          expires_at: string
          id: string
          reasoning: string | null
          sentiment: number | null
          symbol: string
          target_price: number
        }
        Insert: {
          actual_outcome?: string | null
          confidence: number
          created_at?: string
          direction: string
          expires_at?: string
          id?: string
          reasoning?: string | null
          sentiment?: number | null
          symbol: string
          target_price: number
        }
        Update: {
          actual_outcome?: string | null
          confidence?: number
          created_at?: string
          direction?: string
          expires_at?: string
          id?: string
          reasoning?: string | null
          sentiment?: number | null
          symbol?: string
          target_price?: number
        }
        Relationships: []
      }
      price_data: {
        Row: {
          asset_id: string | null
          change_24h: number | null
          change_percent_24h: number | null
          data_source: string | null
          high_price: number | null
          id: string
          low_price: number | null
          market_cap: number | null
          open_price: number | null
          price: number
          symbol: string
          timestamp: string
          volume: number | null
        }
        Insert: {
          asset_id?: string | null
          change_24h?: number | null
          change_percent_24h?: number | null
          data_source?: string | null
          high_price?: number | null
          id?: string
          low_price?: number | null
          market_cap?: number | null
          open_price?: number | null
          price: number
          symbol: string
          timestamp?: string
          volume?: number | null
        }
        Update: {
          asset_id?: string | null
          change_24h?: number | null
          change_percent_24h?: number | null
          data_source?: string | null
          high_price?: number | null
          id?: string
          low_price?: number | null
          market_cap?: number | null
          open_price?: number | null
          price?: number
          symbol?: string
          timestamp?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_data_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          alert_type: string
          asset_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          symbol: string
          target_value: number
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          asset_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          symbol: string
          target_value: number
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          asset_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          symbol?: string
          target_value?: number
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_alerts_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          symbol: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          symbol: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      user_performance: {
        Row: {
          accuracy_rate: number | null
          correct_predictions: number | null
          created_at: string
          id: string
          points: number | null
          rank_position: number | null
          total_predictions: number | null
          total_return: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_rate?: number | null
          correct_predictions?: number | null
          created_at?: string
          id?: string
          points?: number | null
          rank_position?: number | null
          total_predictions?: number | null
          total_return?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_rate?: number | null
          correct_predictions?: number | null
          created_at?: string
          id?: string
          points?: number | null
          rank_position?: number | null
          total_predictions?: number | null
          total_return?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_positions: {
        Row: {
          asset_id: string | null
          average_cost: number
          created_at: string
          id: string
          position_type: string | null
          shares: number
          symbol: string
          total_cost: number
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_id?: string | null
          average_cost: number
          created_at?: string
          id?: string
          position_type?: string | null
          shares: number
          symbol: string
          total_cost: number
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_id?: string | null
          average_cost?: number
          created_at?: string
          id?: string
          position_type?: string | null
          shares?: number
          symbol?: string
          total_cost?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_positions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_votes: {
        Row: {
          created_at: string
          id: string
          symbol: string
          user_id: string
          vote: string
        }
        Insert: {
          created_at?: string
          id?: string
          symbol: string
          user_id: string
          vote: string
        }
        Update: {
          created_at?: string
          id?: string
          symbol?: string
          user_id?: string
          vote?: string
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
