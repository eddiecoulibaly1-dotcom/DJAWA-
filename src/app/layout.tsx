import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DJAWA — Commerce, paiement, confiance, financement",
  description: "Infrastructure digitale pour le commerce agricole africain.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <header className="nav">
          <div className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <Link href="/" className="brand">DJAWA</Link>
            <nav className="navlinks">
              <Link className="optional" href="/market">Market</Link>
              <Link className="optional" href="/dashboard">Dashboard</Link>
              <Link href="/auth/login" className="btn primary">Connexion</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
