import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderForm from "@/components/OrderForm";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase.from("products").select("id,seller_id,name,category,variety,description,unit,price,currency,quantity_available,location_city,status,created_at").eq("id", id).eq("status", "published").single();
  if (error || !product) notFound();
  const { data: seller } = await supabase.from("profiles").select("full_name,business_name,city,is_verified,trust_score").eq("id", product.seller_id).single();
  return <main className="container section">
    <Link href="/market" className="btn secondary">← Retour au Market</Link>
    <div className="grid" style={{gridTemplateColumns:"1.15fr .85fr",marginTop:24,alignItems:"start"}}>
      <article className="card">
        <span className="badge">{product.category}</span>
        <h1 style={{fontSize:52}}>{product.name}</h1>
        <p>{product.variety || "Produit agricole"} · {product.location_city || "Côte d’Ivoire"}</p>
        <div className="price" style={{fontSize:30,fontWeight:900}}>{new Intl.NumberFormat("fr-FR").format(product.price)} {product.currency} / {product.unit}</div>
        <p><strong>{product.quantity_available}</strong> {product.unit} disponibles</p>
        {product.description && <div style={{marginTop:24}}><h2 style={{fontSize:22}}>Description</h2><p>{product.description}</p></div>}
        <div className="card" style={{marginTop:24,background:"#f7f8f3"}}><span className="badge">Vendeur</span><h2 style={{fontSize:24,marginTop:12}}>{seller?.business_name || seller?.full_name || "Vendeur DJAWA"}</h2><p>{seller?.city || "Côte d’Ivoire"} · Trust Score {seller?.trust_score ?? 0} {seller?.is_verified ? "· Vérifié" : ""}</p></div>
      </article>
      <div>
        <OrderForm productId={product.id} price={product.price} currency={product.currency} unit={product.unit} available={product.quantity_available} />
        <p style={{fontSize:13,marginTop:12}}>La commande réserve le stock de façon atomique côté serveur. Le paiement réel sera branché sur un rail réglementé à l’étape suivante.</p>
      </div>
    </div>
  </main>;
}
