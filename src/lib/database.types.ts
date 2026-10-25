export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string; phone: string | null; role: "producer" | "trader" | "cooperative" | "agent" | "admin"; business_name: string | null; city: string | null; country_code: string; avatar_url: string | null; is_verified: boolean; created_at: string; updated_at: string; preferred_language: string; onboarding_completed: boolean; trust_score: number };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: { id: string; seller_id: string; name: string; category: string; variety: string | null; description: string | null; unit: string; price: number; currency: string; quantity_available: number; location_city: string | null; status: "draft" | "published" | "paused" | "sold_out" | "archived"; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & { seller_id: string; name: string; category: string; price: number };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      orders: { Row: { id: string; buyer_id: string; seller_id: string; status: string; total_amount: number; currency: string; delivery_city: string | null; notes: string | null; created_at: string; updated_at: string }; Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & { buyer_id: string; seller_id: string }; Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>; Relationships: [] };
      order_items: { Row: { id: string; order_id: string; product_id: string; quantity: number; unit_price: number; status: string; created_at: string }; Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]> & { order_id: string; product_id: string; quantity: number; unit_price: number }; Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>; Relationships: [] };
      trust_events: { Row: { id: string; user_id: string; event_type: string; score_delta: number; reference_type: string | null; reference_id: string | null; metadata: Json; created_at: string }; Insert: Partial<Database["public"]["Tables"]["trust_events"]["Row"]> & { user_id: string; event_type: string }; Update: Partial<Database["public"]["Tables"]["trust_events"]["Row"]>; Relationships: [] };
      payment_intents: { Row: { id: string; order_id: string; payer_id: string; amount: number; currency: string; provider: string | null; status: string; provider_reference: string | null; idempotency_key: string; created_at: string; updated_at: string }; Insert: Partial<Database["public"]["Tables"]["payment_intents"]["Row"]> & { order_id: string; payer_id: string; amount: number; idempotency_key: string }; Update: Partial<Database["public"]["Tables"]["payment_intents"]["Row"]>; Relationships: [] };
    };
    Views: {};
    Functions: { current_user_role: { Args: never; Returns: Database["public"]["Tables"]["profiles"]["Row"]["role"] }; published_products_count: { Args: never; Returns: number }; validate_order_item_access: { Args: { p_order_id: string }; Returns: boolean } };
    Enums: { listing_status: "draft" | "published" | "paused" | "sold_out" | "archived"; order_item_status: "pending" | "accepted" | "rejected" | "fulfilled"; order_status: "pending" | "confirmed" | "processing" | "ready" | "delivered" | "cancelled" | "disputed"; payment_status: "initiated" | "pending" | "success" | "failed" | "reversed" | "refunded" | "unknown"; user_role: "producer" | "trader" | "cooperative" | "agent" | "admin" };
    CompositeTypes: {};
  };
};
