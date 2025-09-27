export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'editor' | 'reader' | 'headmaster'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'editor' | 'reader' | 'headmaster'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'editor' | 'reader' | 'headmaster'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
       categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string | null;
          is_default: boolean;
          document_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color: string;
          icon?: string | null;
          is_default?: boolean;
          document_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          color?: string;
          icon?: string | null;
          is_default?: boolean;
          document_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string
          title: string
          description: string | null
          file_name: string
          file_url: string
          file_size: number | null
          mime_type: string | null
          physical_location: string | null
          shelf_reference: string | null
          category_id: string | null
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_name: string
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          physical_location?: string | null
          shelf_reference?: string | null
          category_id?: string | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_name?: string
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          physical_location?: string | null
          shelf_reference?: string | null
          category_id?: string | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'editor' | 'reader' | 'headmaster'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}