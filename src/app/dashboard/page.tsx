import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("full_name, role, business_name, city, trust_score, onboarding_completed").eq("id", user.id).single();
  if (!profile?.onboarding_completed) redirect("/onboarding");
  const { count: productsCount } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("seller_id", user.id);
  const { count: ordersCount } = await supabase.from("orders").select("id", { count: "exact", head: true }).or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
  return <main className="container section">
    <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"end",flexWrap:"wrap"}}><div><span className="kicker">Tableau de bord</span><h1 style={{fontSize:48,marginBottom:8}}>Bonjour {profile.full_name || ""}.</h1><p>{profile.business_name || "Votre activité"} · {profile.city || "Côte d’Ivoire"}</p></div><span className="badge">{profile.role === "producer" ? "Producteur" : "Commerçant"}</span></div>
    <div className="grid grid3" style={{marginTop:28}}><div className="card"><div className="stat">{productsCount ?? 0}</div><p>Offres publiées / créées</p></div><div className="card"><div className="stat">{ordersCount ?? 0}</div><p>Commandes</p></div><div className="card"><div className="stat">{profile.trust_score}</div><p>Trust Score</p></div></div>
    <div className="grid grid3" style={{marginTop:20}}><Link href="/market" className="card"><span className="badge">Market</span><h2 style={{fontSize:24,marginTop:14}}>Explorer les offres</h2><p>Trouvez des produits agricoles disponibles.</p></Link><Link href="/products/new" className="card"><span className="badge">Vendre</span><h2 style={{fontSize:24,marginTop:14}}>Publier une offre</h2><p>Ajoutez produit, prix, quantité et localisation.</p></Link><Link href="/orders" className="card"><span className="badge">Trade</span><h2 style={{fontSize:24,marginTop:14}}>Mes commandes</h2><p>Suivez vos achats, ventes et paiements préparés.</p></Link></div>
  </main>;
}
