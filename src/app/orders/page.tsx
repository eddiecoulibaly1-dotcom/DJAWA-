import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: orders, error } = await supabase.from("orders").select("id,buyer_id,seller_id,status,total_amount,currency,delivery_city,created_at").or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`).order("created_at", { ascending: false }).limit(50);
  return <main className="container section">
    <span className="kicker">DJAWA Trade</span><h1 style={{fontSize:52}}>Mes commandes</h1><p>Suivez vos achats et ventes de bout en bout.</p>
    {error && <div className="error">Impossible de charger les commandes : {error.message}</div>}
    <div className="grid" style={{marginTop:28}}>{orders?.length ? orders.map(order => { const buying = order.buyer_id === user.id; return <Link href={`/orders/${order.id}`} className="card" key={order.id} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:18,alignItems:"center"}}><div><span className="badge">{buying ? "Achat" : "Vente"}</span><h2 style={{fontSize:22,marginTop:10}}>Commande #{order.id.slice(0,8)}</h2><p>{new Date(order.created_at).toLocaleDateString("fr-FR")} · {order.delivery_city || "Livraison à définir"}</p></div><div style={{textAlign:"right"}}><strong style={{fontSize:20}}>{new Intl.NumberFormat("fr-FR").format(order.total_amount)} {order.currency}</strong><p style={{margin:4}}>{order.status}</p></div></Link> }) : <div className="card"><h2>Aucune commande.</h2><p>Les commandes créées depuis le Market apparaîtront ici.</p></div>}</div>
  </main>;
}
