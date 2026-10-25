"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = { orderId: string };

export default function PayButton({ orderId }: Props) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function startPayment() {
    setLoading(true); setError(""); setMessage("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Session expirée. Reconnectez-vous."); setLoading(false); return; }
    const { data, error } = await supabase.rpc("create_payment_intent", {
      p_order_id: orderId,
      p_idempotency_key: crypto.randomUUID(),
      p_provider: null,
    });
    if (error || !data) setError(error?.message || "Impossible de préparer le paiement.");
    else setMessage(`PaymentIntent ${data.id.slice(0,8)} créé. Le prochain module branchera le rail de paiement réglementé.`);
    setLoading(false);
  }

  return <div className="card" style={{marginTop:20}}><span className="badge">DJAWA Pay</span><h2 style={{fontSize:24,marginTop:12}}>Préparer le paiement</h2><p>Aucun débit n'est effectué à cette étape : nous créons seulement l'intention de paiement de façon idempotente.</p>{error&&<div className="error">{error}</div>}{message&&<div className="success">{message}</div>}<button className="btn primary" onClick={startPayment} disabled={loading}>{loading?"Préparation…":"Préparer le paiement"}</button></div>;
}
