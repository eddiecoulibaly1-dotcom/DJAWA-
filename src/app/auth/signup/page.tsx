"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError(""); setMessage("");
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) setError(error.message); else if (data.session) window.location.href = "/onboarding"; else setMessage("Compte créé. Vérifiez votre email si la confirmation est activée.");
    setLoading(false);
  }
  return <main className="container"><div className="form card">
    <span className="kicker">Nouveau compte</span><h1 style={{fontSize:42}}>Bienvenue sur DJAWA</h1><p>Créez votre identité commerciale.</p>
    {error && <div className="error">{error}</div>}{message && <div className="success">{message}</div>}
    <form onSubmit={submit}>
      <div className="field"><label>Nom complet</label><input required value={fullName} onChange={e=>setFullName(e.target.value)} /></div>
      <div className="field"><label>Email</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div className="field"><label>Mot de passe</label><input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button className="btn primary" disabled={loading}>{loading ? "Création…" : "Créer mon compte"}</button>
    </form>
    <p>Déjà inscrit ? <Link href="/auth/login"><strong>Se connecter</strong></Link></p>
  </div></main>;
}
