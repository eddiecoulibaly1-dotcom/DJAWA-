"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { productId: string; price: number; currency: string; unit: string; available: number };

const messages: Record<string, string> = {
  AUTH_REQUIRED: "Connectez-vous pour commander.",
  INVALID_QUANTITY: "Quantité invalide.",
  PRODUCT_NOT_AVAILABLE: "Cette offre n'est plus disponible.",
  CANNOT_BUY_OWN_PRODUCT: "Vous ne pouvez pas commander votre propre offre.",
  INSUFFICIENT_STOCK: "La quantité demandée dépasse le stock disponible.",
};

export default function OrderForm({ productId, price, currency, unit, available }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [quantity, setQuantity] = useState("1");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const total = Number(quantity || 0) * price;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }
    const { data, error } = await supabase.rpc("place_order", {
      p_product_id: productId,
      p_quantity: Number(quantity),
      p_delivery_city: city || null,
      p_notes: notes || null,
      p_client_reference: crypto.randomUUID(),
    });
    if (error || !data) {
      const key = error?.message?.split(":")[0] || "";
      setError(messages[key] || error?.message || "Impossible de créer la commande.");
      setLoading(false); return;
    }
    router.push(`/orders/${data.id}`);
  }

  return <form onSubmit={submit} className="card" style={{marginTop:24}}>
    <span className="badge">Commander</span>
    <div className="field" style={{marginTop:16}}><label>Quantité ({unit})</label><input required min="0.001" max={available} step="0.001" type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} /></div>
    <div className="field"><label>Ville de livraison</label><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Ex. Abidjan" /></div>
    <div className="field"><label>Note au vendeur</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Qualité, délai, conditionnement…" /></div>
    {error && <div className="error">{error}</div>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,marginBottom:16}}><span>Total estimé</span><strong style={{fontSize:24}}>{new Intl.NumberFormat("fr-FR").format(total)} {currency}</strong></div>
    <button className="btn primary" disabled={loading || Number(quantity) <= 0 || Number(quantity) > available}>{loading ? "Création…" : "Confirmer la commande"}</button>
  </form>;
}
