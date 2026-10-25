import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MarketPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from("products").select("id,name,category,variety,price,currency,unit,quantity_available,location_city,status").eq("status","published").order("created_at",{ascending:false}).limit(50);
  return <main className="container section">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:20,flexWrap:"wrap"}}><div><span className="kicker">DJAWA Market</span><h1 style={{fontSize:52}}>Offres agricoles</h1><p>Un marché B2B simple, structuré et vérifiable.</p></div><Link href="/products/new" className="btn primary">Publier une offre</Link></div>
    {error ? <div className="error" style={{marginTop:24}}>Impossible de charger le Market : {error.message}</div> : <div className="grid grid3" style={{marginTop:28}}>{products?.length ? products.map(product => <article className="card product" key={product.id}><span className="badge">{product.category}</span><h2 style={{fontSize:24,margin:4}}>{product.name}</h2><p style={{margin:0}}>{product.variety || "Produit agricole"} · {product.location_city || "CI"}</p><div className="price">{new Intl.NumberFormat("fr-FR").format(product.price)} {product.currency} / {product.unit}</div><p style={{margin:0}}>Disponible : {product.quantity_available} {product.unit}</p><Link href={`/market/${product.id}`} className="btn secondary" style={{marginTop:"auto"}}>Voir l&apos;offre</Link></article>) : <div className="card"><h2>Aucune offre pour le moment.</h2><p>Le Market est prêt. Publiez la première offre DJAWA.</p></div>}</div>}
  </main>;
}
