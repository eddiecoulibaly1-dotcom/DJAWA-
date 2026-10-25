"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OrderActions({ orderId, status, role }: { orderId: string; status: string; role: "buyer" | "seller" }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function callRpc(fn: string, args: Record<string, unknown>) {
    setLoading(true); setError("");
    const { error: rpcError } = await supabase.rpc(fn as never, args as never);
    setLoading(false);
    if (rpcError) { setError(rpcError.message); return; }
    router.refresh();
  }

  if (role === "seller" && status === "pending") return <div className="card" style={{marginTop:20}}><h2 style={{fontSize:24}}>Commande reçue</h2><p>Confirmez la disponibilité ou refusez la commande.</p><div style={{display:"flex",gap:12,marginTop:16,flexWrap:"wrap"}}><button className="btn" disabled={loading} onClick={() => callRpc("seller_confirm_order", { p_order_id: orderId })}>{loading ? "Traitement…" : "Confirmer la commande"}</button><button className="btn secondary" disabled={loading} onClick={() => callRpc("seller_reject_order", { p_order_id: orderId, p_reason: "Refus vendeur" })}>Refuser</button></div>{error && <p role="alert" style={{marginTop:12}}>{error}</p>}</div>;

  if (role === "seller" && status === "confirmed") return <div className="card" style={{marginTop:20}}><h2 style={{fontSize:24}}>Préparer la commande</h2><p>La commande est confirmée. Marquez-la prête lorsque la marchandise peut être remise ou expédiée.</p><button className="btn" disabled={loading} onClick={() => callRpc("mark_order_ready", { p_order_id: orderId })} style={{marginTop:16}}>{loading ? "Traitement…" : "Marquer comme prête"}</button>{error && <p role="alert" style={{marginTop:12}}>{error}</p>}</div>;

  if (role === "buyer" && status === "ready") return <div className="card" style={{marginTop:20}}><h2 style={{fontSize:24}}>Commande prête</h2><p>Confirmez la réception uniquement lorsque la marchandise a bien été reçue.</p><button className="btn" disabled={loading} onClick={() => callRpc("mark_order_delivered", { p_order_id: orderId })} style={{marginTop:16}}>{loading ? "Traitement…" : "Confirmer la réception"}</button>{error && <p role="alert" style={{marginTop:12}}>{error}</p>}</div>;

  return null;
}
