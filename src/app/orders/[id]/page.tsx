import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PayButton from "@/components/PayButton";
import OrderActions from "@/components/OrderActions";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: order } = await supabase.from("orders").select("id,buyer_id,seller_id,status,total_amount,currency,delivery_city,notes,created_at,updated_at").eq("id", id).single();
  if (!order || (order.buyer_id !== user.id && order.seller_id !== user.id)) notFound();
  const { data: item } = await supabase.from("order_items").select("quantity,unit_price,status,product_id").eq("order_id", id).limit(1).single();
  const { data: product } = item ? await supabase.from("products").select("name,unit,category").eq("id", item.product_id).single() : { data: null };
  const { data: events } = await supabase.from("order_events").select("id,from_status,to_status,event_type,metadata,created_at").eq("order_id", id).order("created_at", { ascending: false }).limit(10);
  const buying = order.buyer_id === user.id;
  return <main className="container section">
    <Link href="/orders" className="btn secondary">← Mes commandes</Link>
    <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"end",marginTop:24,flexWrap:"wrap"}}><div><span className="kicker">DJAWA Trade</span><h1 style={{fontSize:48}}>Commande #{order.id.slice(0,8)}</h1><p>{buying ? "Votre achat" : "Votre vente"} · {new Date(order.created_at).toLocaleString("fr-FR")}</p></div><span className="badge">{order.status}</span></div>
    <div className="grid grid3" style={{marginTop:28}}>
      <div className="card"><span className="badge">Produit</span><h2 style={{fontSize:24,marginTop:12}}>{product?.name || "Produit"}</h2><p>{item?.quantity} {product?.unit || "unité"} · {item?.status || "pending"}</p></div>
      <div className="card"><span className="badge">Montant</span><div className="stat" style={{marginTop:12}}>{new Intl.NumberFormat("fr-FR").format(order.total_amount)}</div><p>{order.currency}</p></div>
      <div className="card"><span className="badge">Livraison</span><h2 style={{fontSize:24,marginTop:12}}>{order.delivery_city || "À définir"}</h2><p>{order.notes || "Aucune note"}</p></div>
    </div>
    {buying && order.status === "confirmed" && <PayButton orderId={order.id} />}
    {buying && order.status === "pending" && <div className="card" style={{marginTop:20}}><h2 style={{fontSize:24}}>En attente de confirmation</h2><p>Le vendeur doit confirmer la disponibilité avant que le paiement puisse être préparé.</p></div>}
    <OrderActions orderId={order.id} status={order.status} role={buying ? "buyer" : "seller"} />
    {events && events.length > 0 && <section style={{marginTop:28}}><h2 style={{fontSize:28}}>Historique</h2><div className="card" style={{marginTop:12}}>{events.map((event) => <div key={event.id} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}><strong>{event.event_type}</strong><p style={{margin:4}}>{event.from_status ? `${event.from_status} → ` : ""}{event.to_status} · {new Date(event.created_at).toLocaleString("fr-FR")}</p></div>)}</div></section>}
  </main>;
}
