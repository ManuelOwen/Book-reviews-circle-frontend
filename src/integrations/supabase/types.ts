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
      book_tags: {
        Row: {
          book_id: string
          tag_id: string
        }
        Insert: {
          book_id: string
          tag_id: string
        }
        Update: {
          book_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_tags_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          genre: string | null
          id: string
          isbn: string | null
          page_count: number | null
          published_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          isbn?: string | null
          page_count?: number | null
          published_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          isbn?: string | null
          page_count?: number | null
          published_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question?: string
          user_id?: string
        }
        Relationships: []
      }
      clubs: {
        Row: {
          cover_image_url: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_private: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      diseases: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          prevention_tips: string[]
          symptoms: string[]
          treatments: string[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          prevention_tips: string[]
          symptoms: string[]
          treatments: string[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          prevention_tips?: string[]
          symptoms?: string[]
          treatments?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      educational_resources: {
        Row: {
          created_at: string | null
          description: string
          disease_id: string | null
          id: string
          resource_type: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          description: string
          disease_id?: string | null
          id?: string
          resource_type: string
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string
          disease_id?: string | null
          id?: string
          resource_type?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "educational_resources_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          club_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          club_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          club_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_library: {
        Row: {
          added_at: string
          book_id: string
          finished_reading_at: string | null
          id: string
          started_reading_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          added_at?: string
          book_id: string
          finished_reading_at?: string | null
          id?: string
          started_reading_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          added_at?: string
          book_id?: string
          finished_reading_at?: string | null
          id?: string
          started_reading_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_library_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          favorite_genres: string[] | null
          full_name: string | null
          id: string
          organization: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          favorite_genres?: string[] | null
          full_name?: string | null
          id: string
          organization?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          favorite_genres?: string[] | null
          full_name?: string | null
          id?: string
          organization?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      review_likes: {
        Row: {
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          book_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      scans: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          description: string | null
          disease_name: string | null
          id: string
          image_url: string
          preventive_measures: string | null
          severity: string | null
          total_cases: number | null
          treatment_recommendation: string | null
          user_id: string
          video_thumbnails: string[] | null
          video_titles: string[] | null
          video_urls: string[] | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          disease_name?: string | null
          id?: string
          image_url: string
          preventive_measures?: string | null
          severity?: string | null
          total_cases?: number | null
          treatment_recommendation?: string | null
          user_id: string
          video_thumbnails?: string[] | null
          video_titles?: string[] | null
          video_urls?: string[] | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          disease_name?: string | null
          id?: string
          image_url?: string
          preventive_measures?: string | null
          severity?: string | null
          total_cases?: number | null
          treatment_recommendation?: string | null
          user_id?: string
          video_thumbnails?: string[] | null
          video_titles?: string[] | null
          video_urls?: string[] | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
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
      user_role: "farmer" | "researcher" | "admin"
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
      user_role: ["farmer", "researcher", "admin"],
    },
  },
} as const
