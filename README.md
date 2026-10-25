# DJAWA

DJAWA est une plateforme Agri-Fintech africaine qui connecte **commerce → paiement → confiance → financement**.

## Premier périmètre

- **Market** : offres agricoles B2B structurées.
- **Trade** : base de données commandes et articles.
- **Pay** : `payment_intents` préparés pour l'orchestration de rails réglementés.
- **Trust** : identité commerciale et événements de confiance.
- **Capital** : couche future, via des partenaires réglementés.

## Stack

- Next.js 16 + TypeScript
- React 19
- Supabase Auth + PostgreSQL + RLS
- `@supabase/ssr` pour les sessions SSR
- PWA/web d'abord, mobile Flutter ensuite

## Supabase

Le frontend cible **uniquement** le projet DJAWA : `pyrvavkicutxpyeedndc`.

Variables locales :

```bash
cp .env.example .env.local
```

Puis renseigner `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Ne jamais exposer une clé `service_role` dans le navigateur.

## Développement

```bash
npm install
npm run dev
```

## Parcours déjà implémenté

1. Accueil
2. Inscription / connexion email
3. Onboarding Producteur / Commerçant
4. Dashboard connecté
5. Market
6. Publication d'une offre agricole

## Prochaine tranche

- détail d'une offre et création de commande atomique ;
- confirmation vendeur ;
- PaymentIntent côté serveur / idempotence ;
- événements Trust server-authoritative ;
- offline outbox pour la PWA ;
- tests et CI ;
- déploiement Vercel.
