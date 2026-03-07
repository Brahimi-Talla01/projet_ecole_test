# FE-AUTH-01 – Infrastructure API, Schémas & Sécurité JWT

## Résumé

Configuration de l'infrastructure API avec Axios, interceptors, schémas de validation Zod, et gestion sécurisée des tokens JWT via httpOnly cookies.

## Travail Réalisé

### 1. Configuration Axios

**Fichier** : `src/core/api/client.ts`

- Instance Axios globale avec `withCredentials: true`
- Timeout de 10 secondes
- Base URL depuis les variables d'environnement

### 2. Interceptors

**Fichiers** :
- `src/core/api/interceptors/auth.interceptor.ts`
- `src/core/api/interceptors/error.interceptor.ts`
- `src/core/api/interceptors/retry.interceptor.ts`
- `src/core/api/interceptors/refresh.interceptor.ts`

**Fonctionnalités** :
- Gestion automatique du refresh token (401)
- Retry automatique sur erreurs réseau (3 tentatives)
- Gestion centralisée des erreurs HTTP
- Les tokens sont gérés via httpOnly cookies (backend)

### 3. Types API

**Fichier** : `src/core/api/types/api-response.ts`

Types génériques pour les réponses API, erreurs, pagination.

### 4. Configuration

**Fichiers** :
- `src/core/config/env.ts` : Variables d'environnement validées avec Zod
- `src/core/config/constants.ts` : Constantes globales (timeout, limites, codes HTTP)
- `src/core/config/routes.ts` : Routes centralisées (frontend + API)

### 5. Schémas Zod

**Fichier** : `src/features/authentication/presentation/validators/auth.schema.ts`

Schémas de validation pour :
- Login
- Inscription
- Vérification email
- Vérification OTP
- Réinitialisation de mot de passe

### 6. Tests Unitaires

**Fichier** : `src/features/authentication/presentation/validators/__tests__/auth.schema.test.ts`

- 15+ tests unitaires avec Vitest
- Couverture complète des schémas Zod
- Tests de cas limites (edge cases)

## Sécurité JWT

**Approche httpOnly cookies** :

- Access Token stocké dans un cookie httpOnly (géré par le backend)
- Refresh Token stocké dans un cookie httpOnly (géré par le backend)
- Frontend ne manipule JAMAIS les tokens directement
- Protection contre les attaques XSS

**Flow d'authentification** :

1. Login → Backend définit les cookies httpOnly
2. Requête API → Cookies envoyés automatiquement
3. Token expiré (401) → Interceptor appelle `/auth/refresh`
4. Nouveau token → Backend redéfinit le cookie
5. Requête réessayée automatiquement

## Comment Tester
```bash
# Lancer les tests unitaires
npm run test

# Lancer les tests avec couverture
npm run test:coverage

# Lancer les tests en mode watch
npm run test:watch
```

## Métriques

- **Fichiers créés/modifiés** : 10
- **Tests unitaires** : 15
- **Couverture de code** : 100% sur les schémas Zod
- **Complexité cyclomatique** : Faible (< 10 par fonction)

## Critères d'Acceptation Validés

- L'instance Axios injecte automatiquement les headers nécessaires
- Les schémas Zod rejettent les données malformées avant l'envoi au serveur
- Le stockage des tokens respecte les standards de sécurité (protection XSS via httpOnly)
- Fichier `client.ts` opérationnel
- Schémas Zod testés unitairement (Vitest)
- Typage TypeScript complet pour les réponses API

### Dépendances

Ce ticket est un **prérequis** pour :
- FE-AUTH-02 (Formulaire inscription)
- FE-AUTH-03 (API inscription)
- FE-AUTH-04 (Formulaire connexion)
- FE-AUTH-05 (Gestion session)

## Documentation Associée

- [Architecture Clean](../architecture/clean-architecture.md)
- [Guide Zustand](../guides/zustand.md)
- [Convention de commits](../conventions/commits.md)