# FE-AUTH-03 – Inscription : Logique API & Unicité Email

## User Story

> En tant qu'utilisateur, je veux savoir immédiatement si mon email est déjà utilisé afin de ne pas soumettre un formulaire inutilement.


## Décisions d'architecture

| Décision | Choix | Raison |
|---|---|---|
| Validation email/password retirée du use case | Déléguée à Zod (présentation) | Évite deux sources de vérité et des messages contradictoires |
| `checkEmailAvailability` retiré du use case | Géré par debounce dans `useRegister` | Éviter un double appel réseau à la soumission |
| 409 géré dans le use case | Filet de sécurité à la soumission | Le debounce peut rater (race condition, réseau) |
| Catch silencieux dans le hook (debounce) | Intentionnel | Un timeout réseau ne doit pas bloquer l'UX — le 409 à la soumission reste le filet |
| Catch **non** silencieux dans `AuthRepository` | Erreur remonte au hook | Un timeout ne doit pas faire croire que l'email est pris |
| `isCheckingEmail` en `useState` et non `useRef` | `useState` déclenche un re-render | `useRef` ne notifie pas React → spinner invisible dans l'UI |
| Gestion d'erreurs via `apiError.statusCode` | Utilise `ApiError` normalisé par `error.interceptor` | L'intercepteur transforme déjà l'`AxiosError` brut — pas besoin d'inspecter `error.response.status` |


## Flux d'exécution

```
Utilisateur tape un email
        ↓
onChange → checkEmailAvailability(email)    [useRegister]
        ↓
debounce 500ms (annulé si nouvelle frappe)
        ↓
AuthRepository.checkEmailAvailability()     [GET /auth/check-email?email=xxx]
        ↓
├── available: true  → clearErrors('email')
├── available: false → setError('email', 'Email déjà utilisé')
└── erreur réseau   → clearErrors('email') [silencieux]

Utilisateur soumet le formulaire
        ↓
useRegister.onSubmit()                      [useMutation]
        ↓
RegisterUseCase.execute(dto)
        ↓
AuthRepository.register()                  [POST /auth/register]
        ↓
├── Succès → router.push(/[locale]/verify-email?email=xxx)
├── 409    → setError('email', ...)         [emailConflict]
├── 422    → setError('root', ...)
├── 5xx    → setError('root', ...)
└── 503    → setError('root', ...) [erreur réseau normalisée par error.interceptor]
```


## Couche Domain

### `domain/entities/AuthTokens.ts`

Entité représentant les métadonnées des tokens JWT côté client.
Les tokens réels sont en httpOnly cookies — cette entité ne contient que les métadonnées utiles.

```typescript
export class AuthTokens {
  getExpiresAt(): Date { ... }
  isExpired(bufferSeconds = 60): boolean { ... }
}
```


### `domain/use-cases/register.use-case.ts`

**Ce qui a été corrigé vs version initiale :**

| Avant | Après | Raison |
|---|---|---|
| `execute(email, password, profileType, ...)` | `execute(dto: RegisterDto)` | Cohérence avec `IAuthRepository` |
| Validation email/password par regex | Supprimée | Zod s'en charge, duplication dangereuse |
| `checkEmailAvailability` dans le use case | Supprimé | Double appel réseau + race condition |
| `extractHttpStatus` inspectait `error.response.status` | `apiError.statusCode` depuis `ApiError` | L'`error.interceptor` a déjà normalisé l'erreur |

**Gestion d'erreurs — pipeline :**

```
Axios throw AxiosError
    ↓
error.interceptor  →  Promise.reject({ message, statusCode })   [ApiError normalisé]
    ↓
RegisterUseCase    →  catch(apiError) → RegisterUseCaseResult   [sens métier]
    ↓
useRegister hook   →  setError('email' | 'root')                [UX]
```

**Codes traités :**

| Status | Résultat | Flag |
|---|---|---|
| `409` | Email déjà utilisé | `emailConflict: true` |
| `422` | Données invalides | — |
| `5xx` | Erreur serveur | — |
| `503` | Erreur réseau (normalisée par intercepteur) | — |


## Couche Data

### `data/dtos/RegisterDto.ts`
Ajout de `firstName` et `lastName`.

### `data/repositories/AuthRepository.ts`

**Ce qui a été corrigé vs version initiale :**

| Avant | Après | Raison |
|---|---|---|
| `baseUrl = '/auth'` hardcodé | `API_ROUTES.AUTH_*` | Une seule source de vérité pour les URLs |
| `catch silencieux` dans `checkEmailAvailability` | Erreur remonte au hook | `return false` sur timeout = email semble pris à tort |

```typescript
// checkEmailAvailability laisse remonter les erreurs
async checkEmailAvailability(email: string): Promise<boolean> {
  const response = await apiClient.get<CheckEmailResponse>(
    API_ROUTES.AUTH_CHECK_EMAIL,
    { params: { email } },
  );
  return response.data.available;
}
```

> **@mock** — `checkEmailAvailability` utilise GET avec query param par défaut.  
> À adapter selon le contrat API définitif (POST `{email}` possible).

Exporté en **singleton** : `export const authRepository = new AuthRepository()`.


## Couche Presentation

### `presentation/hooks/useRegister.ts`

**Stack technique :**

| Outil | Usage |
|---|---|
| `useMutation` (TanStack Query) | État `isPending`, cycle de vie de la requête |
| `useFormContext` (React Hook Form) | `setError` sur les champs sans props drilling |
| `useRef` | Annulation du debounce timer |
| `useState` | `isCheckingEmail` — déclenche les re-renders pour le spinner |

**Points clés :**

- `debounceTimerRef` (useRef) annule le timer précédent à chaque frappe — pas de re-render inutile
- `isCheckingEmail` en `useState` — obligatoire pour que le spinner s'affiche dans l'UI
- `onSuccess` de `useMutation` gère la redirection : `router.push(/[locale]/verify-email?email=xxx)`
- `onSubmit` dispatche les erreurs au bon endroit : `setError('email')` pour 409, `setError('root')` pour le reste


## Critères d'acceptation — Validation

| Critère | Statut |
|---|---|
| Vérification email déclenchée après arrêt de saisie | debounce 500ms + annulation `clearTimeout` |
| Email existant → message sous le champ email | `setError('email')` via `useFormContext` |
| Succès → redirection vers page de confirmation | `router.push(withLocale(VERIFY_EMAIL)?email=xxx)` |

## Definition of Done — Validation

| Critère | Statut |
|---|---|
| Logique de debounce implémentée | timer 500ms avec annulation propre |
| Appel API lié au service Auth | `AuthRepository.register()` via `API_ROUTES.AUTH_REGISTER` |
| Gestion erreur 409 Conflict | `RegisterUseCase` + flag `emailConflict` |


## Points d'attention pour la suite

- `checkEmailAvailability` est **mockée en GET** (`?email=xxx`). Dès que le contrat API est défini, seule `AuthRepository.checkEmailAvailability()` est à modifier — aucun autre fichier impacté.
- Si d'autres queries dépendent de l'état auth après inscription, ajouter dans `useMutation` : `onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth'] })`.
- Le préfixe `/api/v1` dans les URLs API doit être géré par `NEXT_PUBLIC_API_URL` dans `.env` — vérifier avec le backend que `API_ROUTES.AUTH_REGISTER = '/auth/register'` est correct relativement à `baseURL`.