"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NewProductPage() {
  const supabase = createClient();
  const [form,setForm]=useState({name:"",category:"Céréales",variety:"",description:"",unit:"kg",price:"",quantity_available:"",location_city:""});
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  function update(key:string,value:string){setForm(v=>({...v,[key]:value}));}
  async function submit(event:FormEvent){event.preventDefault();setLoading(true);setError("");
    const {data:{user}}=await supabase.auth.getUser(); if(!user){window.location.href="/auth/login";return;}
    const {error}=await supabase.from("products").insert({seller_id:user.id,name:form.name,category:form.category,variety:form.variety||null,description:form.description||null,unit:form.unit,price:Number(form.price),quantity_available:Number(form.quantity_available),location_city:form.location_city||null,status:"published"});
    if(error)setError(error.message);else window.location.href="/market"; setLoading(false);
  }
  return <main className="container"><div className="form card" style={{maxWidth:700}}><span className="kicker">DJAWA Market</span><h1 style={{fontSize:42}}>Publier une offre</h1><p>Une offre structurée facilite la négociation, la commande et la confiance.</p>{error&&<div className="error">{error}</div>}
    <form onSubmit={submit}><div className="field"><label>Produit</label><input required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Ex. Maïs grain"/></div><div className="field"><label>Catégorie</label><select value={form.category} onChange={e=>update("category",e.target.value)}><option>Céréales</option><option>Oléagineux</option><option>Fruits</option><option>Légumes</option><option>Tubercules</option><option>Élevage</option><option>Autre</option></select></div><div className="field"><label>Variété</label><input value={form.variety} onChange={e=>update("variety",e.target.value)} placeholder="Ex. Maïs jaune"/></div><div className="field"><label>Description</label><textarea value={form.description} onChange={e=>update("description",e.target.value)} /></div><div className="grid grid3"><div className="field"><label>Prix (XOF)</label><input required min="0" step="0.01" type="number" value={form.price} onChange={e=>update("price",e.target.value)}/></div><div className="field"><label>Quantité</label><input required min="0" step="0.001" type="number" value={form.quantity_available} onChange={e=>update("quantity_available",e.target.value)}/></div><div className="field"><label>Unité</label><select value={form.unit} onChange={e=>update("unit",e.target.value)}><option>kg</option><option>tonne</option><option>sac</option><option>caisse</option><option>unité</option></select></div></div><div className="field"><label>Ville</label><input value={form.location_city} onChange={e=>update("location_city",e.target.value)} placeholder="Ex. Korhogo"/></div><button className="btn primary" disabled={loading}>{loading?"Publication…":"Publier l'offre"}</button></form>
  </div></main>;
}
