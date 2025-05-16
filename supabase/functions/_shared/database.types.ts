export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          school_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          school_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          school_id?: string;
          created_at?: string;
        };
      };
      teachers: {
        Row: {
          id: string;
          name: string;
          email: string;
          school_id: string;
          class_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          school_id: string;
          class_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          school_id?: string;
          class_id?: string;
          created_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          name: string;
          school_id: string;
          class_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          school_id: string;
          class_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          school_id?: string;
          class_id?: string;
          created_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          status: "present" | "absent" | "late";
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          date: string;
          status: "present" | "absent" | "late";
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          date?: string;
          status?: "present" | "absent" | "late";
          created_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          name: string;
          email: string;
          school_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          school_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          school_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
