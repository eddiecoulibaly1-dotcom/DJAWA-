"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const supabase = createClient();
  const [role, setRole] = useState<"producer"|"trader">("producer"); const [businessName,setBusinessName]=useState(""); const [city,setCity]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/auth/login"; return; }
    const { error } = await supabase.from("profiles").update({ role, business_name: businessName || null, city: city || null, onboarding_completed: true }).eq("id", user.id);
    if (error) setError(error.message); else window.location.href = "/dashboard";
    setLoading(false);
  }
  return <main className="container"><div className="form card">
    <span className="kicker">Étape 1</span><h1 style={{fontSize:42}}>Votre activité</h1><p>Choisissez votre rôle. Les rôles sensibles (agent, coopérative, admin) seront attribués par le processus de confiance DJAWA.</p>
    {error && <div className="error">{error}</div>}
    <form onSubmit={submit}>
      <div className="field"><label>Je suis</label><select value={role} onChange={e=>setRole(e.target.value as "producer"|"trader")}><option value="producer">Producteur</option><option value="trader">Commerçant / acheteur</option></select></div>
      <div className="field"><label>Nom de l'activité</label><input value={businessName} onChange={e=>setBusinessName(e.target.value)} placeholder="Ex. Ferme Coulibaly" /></div>
      <div className="field"><label>Ville</label><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Ex. Korhogo" /></div>
      <button className="btn primary" disabled={loading}>{loading ? "Enregistrement…" : "Continuer"}</button>
    </form>
  </div></main>;
}
