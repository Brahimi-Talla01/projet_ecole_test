# FE-AUTH-04 – Connexion : Sécurité & Anti-Brute Force


## User Story

En tant qu'utilisateur, je veux me connecter en toute sécurité et être protégé contre les tentatives de piratage sur mon compte.


## Décisions d'architecture

| Décision | Choix | Raison |
|---|---|---|
| Messages d'erreur 401/403 identiques | Message générique unique | Ne pas aider un attaquant à énumérer les comptes existants (email connu vs MDP faux) |
| Compteur d'échecs en Zustand | `auth.slice.ts` dans `core/store` | Reset au refresh voulu — pas de persistence entre sessions |
| Double protection brute force | Frontend (5 échecs) + sync 429 backend | Le frontend peut être contourné — le backend reste la source de vérité |
| `lockAccount` séparé de `recordFailedAttempt` | Actions distinctes | 429 backend peut arriver avant 5 tentatives frontend (délai réseau, autre session) |
| `isLocked` comme fonction et non state dérivé | Calcul live via `Date.now()` | Évite un état périmé si le timer expire entre deux renders |
| `mode: 'onBlur'` sur `useForm` | Validation au blur uniquement | Moins agressif que `onChange` pour la connexion — l'utilisateur ne doit pas être interrompu en tapant |
| `BRUTE_FORCE_CONFIG` exporté depuis `auth.slice` | Constantes centralisées | Le composant peut afficher le max de tentatives sans magic number |


## Flux d'exécution

```
Utilisateur soumet le formulaire
        ↓
useLogin.onSubmit()
        ↓
Guard → isLocked() ? return (bloque silencieusement)
        ↓
LoginUseCase.execute({ email, password })
        ↓
AuthRepository.login()               [POST /auth/login]
        ↓
┌── Succès ──────────────────────────────────────────────┐
│  resetAttempts()                                        │
│  setAuthenticated(true)                                 │
│  router.push(/[locale]/dashboard)                       │
└─────────────────────────────────────────────────────────┘
        ↓
┌── Échec 401 / 403 ─────────────────────────────────────┐
│  recordFailedAttempt()                                  │
│    ├── attempts < 5 → setError('root', message générique)│
│    └── attempts >= 5 → lockedUntil = now + 15min        │
└─────────────────────────────────────────────────────────┘
        ↓
┌── Échec 429 (backend) ─────────────────────────────────┐
│  lockAccount()  → lockedUntil = now + 15min             │
│  setError('root', message bloqué)                       │
└─────────────────────────────────────────────────────────┘
        ↓
┌── Timer expiré ────────────────────────────────────────┐
│  isLocked() détecte Date.now() >= lockedUntil           │
│  Auto-reset : lockedUntil = null, failedAttempts = 0    │
└─────────────────────────────────────────────────────────┘
```


## Couche Domain

### `domain/use-cases/login.use-case.ts`

Orchestre le flux de connexion et normalise les erreurs depuis `ApiError`
(déjà transformé par `error.interceptor` — pas d'inspection de `error.response.status`).

**Codes traités :**

| Status | Résultat | Flag |
|---|---|---|
| `401` | Message générique | — |
| `403` | Message générique (identique au 401) | — |
| `429` | Accès bloqué | `isLocked: true` |
| `503` | Erreur réseau normalisée par intercepteur | — |
| `5xx` | Erreur serveur | — |

> **Sécurité** — 401 et 403 retournent volontairement le même message :
> `"Identifiants incorrects. Veuillez réessayer."`
> Différencier les deux aiderait un attaquant à savoir si un email est enregistré.


## Couche Store

### `core/store/slices/auth.slice.ts`

Gère l'état d'authentification et la logique anti-brute force.

**État :**

```typescript
isAuthenticated: boolean
failedAttempts: number
lockedUntil: number | null  // timestamp ms — null = pas bloqué
```

**Actions :**

| Action | Déclencheur | Comportement |
|---|---|---|
| `recordFailedAttempt()` | Échec 401/403 | Incrémente le compteur, lock auto à 5 |
| `lockAccount()` | 429 backend | Force `lockedUntil = now + 15min` |
| `resetAttempts()` | Connexion réussie | Remet compteur et timer à zéro |
| `setAuthenticated(bool)` | Connexion / déconnexion | Met à jour `isAuthenticated` |
| `isLocked()` | Chaque render du hook | Calcule live, auto-débloque si timer expiré |
| `getRemainingLockMs()` | Composant `<Countdown>` | Retourne ms restantes, 0 si pas bloqué |

**Constantes exportées :**

```typescript
export const BRUTE_FORCE_CONFIG = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
} as const;
```

### `core/store/index.ts` _(nouveau)_

Store Zustand combiné — point d'entrée unique pour toute l'app.

```typescript
export const useAppStore = create<AppStore>()((...args) => ({
  ...createAuthSlice(...args),
  // futures slices : ...createUiSlice(...args), etc.
}));
```


## Couche Presentation

### `presentation/hooks/useLogin.ts`

**Stack technique :**

| Outil | Usage |
|---|---|
| `useMutation` (TanStack Query) | État `isPending`, cycle de vie requête |
| `useFormContext` (React Hook Form) | `setError` sur `root` sans props drilling |
| `useAppStore` (Zustand) | Lecture/écriture du compteur et du lock |

**Double protection brute force :**

```typescript
// 1. Guard frontend — bloque avant même l'appel API
if (getIsLocked()) return;

// 2. Sync backend — si 429 arrive (autre session, contournement)
if (result.isLocked) {
  lockAccount();  // force le lock même si attempts < 5
}
```

**Retour du hook :**

```typescript
{
  onSubmit: (data: LoginFormData) => Promise<void>;
  isSubmitting: boolean;
  isLocked: boolean;
  remainingLockMs: number;
  failedAttempts: number;
}
```

### `presentation/components/LoginForm/LoginForm.tsx`

**Architecture interne :**

```
<LoginForm>                  ← useForm() + <FormProvider> + mode: 'onBlur'
  └── <LoginFormInner>        ← useFormContext() + useLogin()
        ├── <Countdown>        ← tick 1s, sync sur remainingMs, aria-live
        ├── <AttemptsWarning>  ← visible entre 1 et 4 échecs
        └── <FieldError>       ← erreur sous chaque champ
```

**Champs du formulaire :**
- Email (disabled si `isLocked` ou `isSubmitting`)
- Mot de passe avec toggle visibilité (icône œil / œil barré SVG inline)
- Lien "Mot de passe oublié ?" aligné à droite du label
- Bouton submit (disabled sur `isLocked || isSubmitting`)
- Lien vers `/register`

**Composant `<Countdown>` :**
- `setInterval` de 1000ms, nettoyé au unmount via `clearInterval`
- `useEffect` de sync si `remainingMs` change (nouveau lock déclenché)
- Format `MM:SS` avec `padStart(2, '0')` et `tabular-nums`
- `role="status"` + `aria-live="polite"` pour accessibilité screen reader

**Composant `<AttemptsWarning>` :**
- Visible uniquement si `attempts > 0 && attempts < MAX_ATTEMPTS`
- Clé i18n `login.attemptsWarning` avec placeholder `{remaining}` résolu à l'affichage

**Toggle mot de passe :**
- `type="password"` ↔ `type="text"` via `useState(false)`
- `aria-label` dynamique : `login.showPassword` / `login.hidePassword`
- `tabIndex={-1}` sur le lien "Mot de passe oublié ?" si disabled


## i18n — Clés ajoutées

Namespace `login` ajouté dans `fr.json` et `en.json` :

```
login.title / subtitle / email / password / submit / submitting /
login.forgotPassword / noAccount / register /
login.showPassword / hidePassword /
login.lockedCountdown / attemptsWarning
```

Les namespaces `register.*` et `validation.*` sont inchangés.


## Critères d'acceptation — Validation

| Critère | Statut |
|---|---|
| Bouton "Se connecter" désactivé après 5 tentatives | `isDisabled = isSubmitting \|\| isLocked` |
| Décompte 15 min visible et actualisé | `<Countdown>` tick 1s, `aria-live` |
| Message identique pour email faux ou MDP faux | `case 401` et `case 403` → même string générique |

## Definition of Done — Validation

| Critère | Statut |
|---|---|
| Logique de compteur persistée via état global | Zustand `auth.slice` |
| Appel `POST /auth/login` fonctionnel | `AuthRepository.login()` via `API_ROUTES.AUTH_LOGIN` |
| Composant Toggle œil fluide | `transition-colors`, SVG inline, `aria-label` dynamique |


## Points d'attention pour la suite

- Le store Zustand **reset au refresh** (voulu). Si le produit évolue vers une persistence inter-sessions du lock, ajouter le middleware `persist` de Zustand sur `lockedUntil` uniquement.
- `LOCKOUT_DURATION_MS` est actuellement fixé à 15 min côté frontend pour correspondre à la politique backend. Si le backend change cette durée, les deux doivent être synchronisés — envisager de récupérer cette valeur depuis la réponse 429 (`Retry-After` header).
- La redirection post-login pointe vers `/dashboard` — la gestion du `returnUrl` est traitée dans **FE-AUTH-05**.
- `useAppStore` dans `core/store/index.ts` est prêt à accueillir d'autres slices (`ui.slice`, `notifications.slice`) via le pattern de composition Zustand déjà en place.