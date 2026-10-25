import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="container hero">
        <div>
          <span className="kicker">Agri-Fintech africaine</span>
          <h1>Du champ au marché, avec confiance.</h1>
          <p style={{fontSize:18,maxWidth:650}}>DJAWA connecte producteurs, commerçants, paiements, logistique, confiance et financement dans une même infrastructure.</p>
          <div className="actions">
            <Link href="/auth/signup" className="btn primary">Créer mon compte</Link>
            <Link href="/market" className="btn secondary">Explorer le Market</Link>
          </div>
        </div>
        <div className="card">
          <span className="badge">Commerce → Paiement → Confiance → Financement</span>
          <h2 style={{marginTop:18}}>Commencer simplement.</h2>
          <p>Publiez une offre agricole, trouvez un fournisseur, construisez votre identité commerciale et préparez votre accès aux services financiers.</p>
          <div className="grid grid3" style={{marginTop:24}}>
            <div><div className="stat">01</div><p>Market</p></div>
            <div><div className="stat">02</div><p>Trade</p></div>
            <div><div className="stat">03</div><p>Trust</p></div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid grid3">
          <div className="card"><span className="badge">DJAWA Market</span><h2 style={{fontSize:24,marginTop:14}}>Acheter & vendre</h2><p>Des offres agricoles structurées avec quantité, prix, localisation et statut.</p></div>
          <div className="card"><span className="badge">DJAWA Pay</span><h2 style={{fontSize:24,marginTop:14}}>Payer avec les rails existants</h2><p>Une orchestration des paiements sans créer un portefeuille propriétaire au lancement.</p></div>
          <div className="card"><span className="badge">DJAWA Trust</span><h2 style={{fontSize:24,marginTop:14}}>Construire la confiance</h2><p>Une identité commerciale et un historique transactionnel conçus pour ouvrir la voie au financement.</p></div>
        </div>
      </section>
    </main>
  );
}
