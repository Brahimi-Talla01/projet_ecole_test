# FE-AUTH-02 – Inscription : Formulaire & Validation temps réel

## User Story

En tant qu'utilisateur, je veux un formulaire d'inscription clair et réactif afin de créer mon compte sans faire d'erreurs de saisie.

## Décisions d'architecture

| Décision | Choix | Raison |
|---|---|---|
| `profileType` exclu du formulaire | Injecté dans `useRegister` comme `CUSTOMER` | Tout nouvel utilisateur est CUSTOMER par défaut, extensible plus tard |
| Messages d'erreur Zod | Clés i18n (`'validation.email.required'`) | Évite les strings hardcodés en français dans le schema |
| Double composant `RegisterForm` / `RegisterFormInner` | Pattern `FormProvider` + `useFormContext` | Permet à `useRegister` d'appeler `setError` directement sans props drilling |
| `mode: 'onChange'` sur `useForm` | Validation temps réel dès la première saisie | Requis par le critère d'acceptation |


## Fichiers produits

### `data/dtos/RegisterDto.ts`
Ajout de `firstName` et `lastName` au DTO d'inscription.

```typescript
export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileType: ProfileType; 
  preferredLang?: Language;
}
```


### `presentation/validators/auth.schema.ts`
- Ajout des champs `firstName` et `lastName` dans `registerSchema`
- `profileType` retiré du schema (injecté côté hook)
- Messages d'erreur convertis en clés i18n
- Export du type `PasswordStrength` pour typage de `calculatePasswordStrength`

```typescript
export const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'validation.firstName.required' })...,
  lastName:  z.string().min(1, { message: 'validation.lastName.required' })...,
  email:     emailSchema,
  password:  passwordSchema,
  confirmPassword: z.string()...,
  preferredLang: z.nativeEnum(Language).optional(),
  acceptTerms: z.boolean().refine(val => val === true, ...),
}).refine(...); 
```


### `presentation/hooks/useRegister.ts`
- Injection de `ProfileType.CUSTOMER` dans `mutationFn` avant appel API
- Ajout de `firstName` et `lastName` dans le payload

```typescript
mutationFn: (data: RegisterFormData) =>
  registerUseCase.execute({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    profileType: ProfileType.CUSTOMER, 
    preferredLang: data.preferredLang,
  }),
```


### `presentation/components/RegisterForm/RegisterForm.tsx`

Composant principal du formulaire d'inscription.

**Architecture interne :**

```
<RegisterForm>              ← crée useForm() + <FormProvider>
  └── <RegisterFormInner>   ← useFormContext() + useRegister()
        ├── <FieldError>    ← affichage erreur sous chaque champ
        └── <PasswordStrengthBar> ← indicateur visuel 3 niveaux
```

**Champs du formulaire :**
- Prénom / Nom (grid 2 colonnes)
- Email (avec spinner de vérification d'unicité)
- Mot de passe (avec `PasswordStrengthBar`)
- Confirmation mot de passe
- Case à cocher conditions d'utilisation
- Bouton submit (désactivé pendant `isSubmitting`)
- Lien vers `/login`

**`PasswordStrengthBar` :**

| Force | Couleur | Largeur barre |
|---|---|---|
| `weak` | Rouge (`bg-red-500`) | 1/3 |
| `medium` | Orange (`bg-orange-400`) | 2/3 |
| `strong` | Vert (`bg-green-500`) | 100% |

Accessible : `role="progressbar"`, `aria-valuenow`, `aria-invalid` sur les inputs.


### `i18n/fr.json` et `i18n/en.json`

Clés ajoutées sous les namespaces `register` et `validation` :

```
register.title / subtitle / firstName / lastName / email /
password / confirmPassword / acceptTerms / submit / submitting /
alreadyHaveAccount / login / emailChecking /
register.passwordStrength.label / weak / medium / strong

validation.email.* / validation.password.* /
validation.confirmPassword.* / validation.firstName.* /
validation.lastName.* / validation.acceptTerms.* /
validation.token.* / validation.otp.*
```


### `core/providers/QueryProvider.tsx`
Créé lors de ce ticket suite à l'erreur `No QueryClient set`.

```typescript
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({ ... }));
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

> À enregistrer dans `src/app/layout.tsx` comme provider racine.


## Critères d'acceptation — Validation

| Critère | Statut |
|---|---|
| Validation visuelle immédiate lors de la saisie | `mode: 'onChange'` |
| Indicateur de force change de couleur (Rouge/Orange/Vert) | `PasswordStrengthBar` |
| Messages d'erreur sous les champs concernés | `<FieldError>` par champ + `errors.root` |

## Definition of Done — Validation

| Critère | Statut |
|---|---|
| Composant `RegisterForm` intégré et responsive | grid 2 cols, `max-w-md` |
| Validation Zod liée à React Hook Form | `zodResolver` + `mode: onChange` |
| Labels i18n fonctionnels | clés dans schema + composant |


## Points d'attention pour la suite

- Le `QueryProvider` doit être présent dans `app/layout.tsx` — requis par tous les hooks qui utilisent TanStack Query.
- `checkEmailAvailability` dans `useRegister` utilise un GET avec query param par défaut (`?email=xxx`). À adapter selon le contrat API final.
- Les clés i18n du namespace `validation` sont partagées avec les autres features auth (login, reset-password). Les centraliser dans `core/i18n` si elles sont réutilisées hors du périmètre authentication.