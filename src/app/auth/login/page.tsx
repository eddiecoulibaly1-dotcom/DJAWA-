"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message); else window.location.href = "/dashboard";
    setLoading(false);
  }

  return <main className="container"><div className="form card">
    <span className="kicker">DJAWA</span><h1 style={{fontSize:42}}>Connexion</h1><p>Retrouvez votre activité commerciale.</p>
    {error && <div className="error">{error}</div>}
    <form onSubmit={submit}>
      <div className="field"><label>Email</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div className="field"><label>Mot de passe</label><input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button className="btn primary" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</button>
    </form>
    <p>Pas encore de compte ? <Link href="/auth/signup"><strong>Créer un compte</strong></Link></p>
  </div></main>;
}
