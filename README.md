# DJAWA

DJAWA est une plateforme Agri-Fintech africaine qui connecte **commerce → paiement → confiance → financement**.

## Premier périmètre

- **Market** : offres agricoles B2B structurées.
- **Trade** : commandes atomiques, stock réservé côté serveur et suivi des commandes.
- **Pay** : `payment_intents` idempotents, prêts pour l'orchestration de rails réglementés.
- **Trust** : événements server-authoritative lors de la création d'une commande.
- **Capital** : couche future, via des partenaires réglementés.

## Stack

- Next.js 16 + TypeScript
- React 19
- Supabase Auth + PostgreSQL + RLS
- `@supabase/ssr` pour les sessions SSR
- PWA/web d'abord, mobile Flutter ensuite

## Sécurité transactionnelle

La création d'une commande ne fait pas confiance au prix ou au total envoyés par le navigateur. La fonction PostgreSQL `place_order` vérifie l'utilisateur, l'offre publiée, le vendeur, le stock, calcule le total depuis la base et réserve le stock dans la même transaction.

La fonction `create_payment_intent` vérifie que l'utilisateur est l'acheteur et que le montant vient de la commande. Les deux RPC sont exécutables uniquement par les utilisateurs authentifiés.

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

## Parcours implémenté

1. Accueil
2. Inscription / connexion email
3. Onboarding Producteur / Commerçant
4. Dashboard connecté
5. Market
6. Publication d'une offre agricole
7. Détail d'une offre
8. Création atomique d'une commande
9. Liste et détail des commandes
10. Création idempotente d'un PaymentIntent
11. Événements Trust lors de la commande

## Prochaine tranche

- confirmation vendeur et transitions d'état contrôlées ;
- intégration d'un premier rail de paiement réglementé ;
- webhooks de paiement et réconciliation ;
- offline outbox pour la PWA ;
- tests d'intégration transactionnels ;
- déploiement Vercel.
