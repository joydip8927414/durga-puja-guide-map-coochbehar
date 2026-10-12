/**
 * Supabase Database TypeScript Definitions
 * Reflects tables, views, enums, and strict schemas defined in migrations.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PandalTier = "top_5" | "top_10" | "top_20" | "general";
export type VehicleAccess = "none" | "two_wheeler_only" | "four_wheeler_restricted" | "all_vehicles";
export type CrowdLevelStatus = "LOW" | "MED" | "HIGH";
export type AmenityCategory = "POLICE" | "HOSPITAL" | "FOOD" | "TOILET" | "WATER" | "FIRE_STATION";
export type AdminRole = "super_admin" | "moderator" | "police_liaison";

export interface Database {
  public: {
    Tables: {
      app_admins: {
        Row: {
          user_id: string;
          role: AdminRole;
          assigned_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          role?: AdminRole;
          assigned_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          role?: AdminRole;
          assigned_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pandals: {
        Row: {
          id: string;
          code_name: string;
          name: string;
          zone: string;
          tier: PandalTier;
          milestone_year: string | null;
          latitude: number;
          longitude: number;
          vehicle_allowed: VehicleAccess;
          entry_gate_desc: string | null;
          avg_rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code_name: string;
          name: string;
          zone: string;
          tier?: PandalTier;
          milestone_year?: string | null;
          latitude: number;
          longitude: number;
          vehicle_allowed?: VehicleAccess;
          entry_gate_desc?: string | null;
          avg_rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code_name?: string;
          name?: string;
          zone?: string;
          tier?: PandalTier;
          milestone_year?: string | null;
          latitude?: number;
          longitude?: number;
          vehicle_allowed?: VehicleAccess;
          entry_gate_desc?: string | null;
          avg_rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      crowd_reports: {
        Row: {
          id: string;
          pandal_id: string;
          crowd_level: CrowdLevelStatus;
          reported_at: string;
          reporter_id: string | null;
          submission_ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pandal_id: string;
          crowd_level: CrowdLevelStatus;
          reported_at?: string;
          reporter_id?: string | null;
          submission_ip_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          pandal_id?: string;
          crowd_level?: CrowdLevelStatus;
          reported_at?: string;
          reporter_id?: string | null;
          submission_ip_hash?: string | null;
          created_at?: string;
        };
      };
      pandal_photos: {
        Row: {
          id: string;
          pandal_id: string;
          image_url: string;
          is_approved: boolean;
          uploader_id: string | null;
          created_at: string;
          approved_by: string | null;
          approved_at: string | null;
        };
        Insert: {
          id?: string;
          pandal_id: string;
          image_url: string;
          is_approved?: boolean;
          uploader_id?: string | null;
          created_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
        };
        Update: {
          id?: string;
          pandal_id?: string;
          image_url?: string;
          is_approved?: boolean;
          uploader_id?: string | null;
          created_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
        };
      };
      amenities: {
        Row: {
          id: string;
          name: string;
          category: AmenityCategory;
          latitude: number;
          longitude: number;
          helpline_number: string | null;
          is_24x7: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: AmenityCategory;
          latitude: number;
          longitude: number;
          helpline_number?: string | null;
          is_24x7?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: AmenityCategory;
          latitude?: number;
          longitude?: number;
          helpline_number?: string | null;
          is_24x7?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      active_pandal_crowd: {
        Row: {
          pandal_id: string;
          current_crowd_level: CrowdLevelStatus | null;
          recent_reports_count: number;
          last_reported_at: string | null;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
  };
}
