"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Payment = {
  status: "initiated" | "pending" | "success" | "failed" | "reversed" | "refunded" | "unknown";
  provider: string | null;
  failure_reason?: string | null;
  provider_payment_request_id?: string | null;
  updated_at: string;
};

const labels: Record<Payment["status"], string> = {
  initiated: "Paiement préparé",
  pending: "Paiement en attente",
  success: "Paiement confirmé",
  failed: "Paiement échoué",
  reversed: "Paiement annulé",
  refunded: "Paiement remboursé",
  unknown: "Statut à vérifier",
};

export default function PaymentStatus({ payment, callback }: { payment: Payment | null; callback?: "success" | "error" }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!payment || payment.status === "success" || payment.status === "failed" || !callback) return;
    const interval = window.setInterval(() => {
      setSeconds((value) => {
        const next = value + 3;
        if (next <= 30) router.refresh();
        return next;
      });
    }, 3000);
    return () => window.clearInterval(interval);
  }, [payment, callback, router]);

  if (!payment) {
    return <div className="card" style={{ marginTop: 20 }}><h2 style={{ fontSize: 24 }}>Paiement</h2><p>Aucun paiement n'est encore associé à cette commande.</p></div>;
  }

  const isPending = payment.status === "initiated" || payment.status === "pending";
  const callbackMessage = callback === "error" && isPending
    ? "Le retour du prestataire indique un échec ou une interruption. Nous vérifions encore le statut côté serveur."
    : callback === "success" && isPending
      ? "Retour reçu. La confirmation finale dépend du webhook Jèko et peut prendre quelques secondes."
      : null;

  return <section className="card" style={{ marginTop: 20 }} aria-live="polite">
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <div>
        <span className="badge">DJAWA Pay</span>
        <h2 style={{ fontSize: 24, marginTop: 10 }}>{labels[payment.status]}</h2>
      </div>
      <span className="badge">{payment.status}</span>
    </div>
    {callbackMessage && <p style={{ marginTop: 12 }}>{callbackMessage}</p>}
    {payment.status === "success" && <p style={{ marginTop: 12 }}>Le paiement a été confirmé par le serveur. Vous pouvez conserver cette commande comme preuve de transaction.</p>}
    {payment.status === "failed" && <p style={{ marginTop: 12 }}>{payment.failure_reason || "Le paiement n'a pas abouti. Vous pouvez réessayer avec un nouveau paiement."}</p>}
    {isPending && callback && <p style={{ marginTop: 12, opacity: 0.75 }}>Actualisation automatique pendant quelques secondes…</p>}
    <p style={{ marginTop: 12, fontSize: 13, opacity: 0.65 }}>Dernière mise à jour : {new Date(payment.updated_at).toLocaleString("fr-FR")}</p>
  </section>;
}
