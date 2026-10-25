"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = { orderId: string };

const methods = [
  ["wave", "Wave"],
  ["orange", "Orange Money"],
  ["mtn", "MTN MoMo"],
  ["moov", "Moov Money"],
  ["djamo", "Djamo"],
] as const;

export default function PayButton({ orderId }: Props) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<(typeof methods)[number][0]>("wave");
  const [error, setError] = useState("");

  async function startPayment() {
    setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Session expirée. Reconnectez-vous."); setLoading(false); return; }

    const { data: intent, error: intentError } = await supabase.rpc("create_payment_intent", {
      p_order_id: orderId,
      p_idempotency_key: crypto.randomUUID(),
      p_provider: "jeko",
    });
    if (intentError || !intent) { setError(intentError?.message || "Impossible de préparer le paiement."); setLoading(false); return; }

    const { data, error: functionError } = await supabase.functions.invoke("create-jeko-payment", {
      body: { orderId, paymentIntentId: intent.id, paymentMethod: method },
    });
    if (functionError || !data?.redirectUrl) {
      setError(data?.error || functionError?.message || "Impossible de lancer le paiement Jèko.");
      setLoading(false);
      return;
    }
    window.location.assign(data.redirectUrl);
  }

  return <div className="card" style={{marginTop:20}}>
    <span className="badge">DJAWA Pay</span>
    <h2 style={{fontSize:24,marginTop:12}}>Payer la commande</h2>
    <p>Le paiement est traité par Jèko. La commande ne sera considérée comme payée qu&apos;après confirmation serveur.</p>
    {error && <div className="error">{error}</div>}
    <label style={{display:"block",margin:"14px 0 8px"}}>Moyen de paiement</label>
    <select value={method} onChange={(e) => setMethod(e.target.value as typeof method)} disabled={loading} style={{width:"100%",padding:12,borderRadius:8}}>
      {methods.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </select>
    <button className="btn primary" onClick={startPayment} disabled={loading} style={{marginTop:14}}>
      {loading ? "Redirection…" : "Payer avec Jèko"}
    </button>
  </div>;
}
