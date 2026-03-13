// "use client";

// import { Button } from '@/core/ui/atoms/Button';
// import { RegisterStepperState } from '@/shared/types/common.types';
// import { useRegisterStep1 } from '../../../hooks/register/useRegisterStep1';

// interface RegisterStep1Props {
//   stepper: RegisterStepperState;
// }

// export const RegisterStep1 = ({ stepper }: RegisterStep1Props) => {
//   const { email, setEmail, error, isLoading, handleContinue } = useRegisterStep1(stepper);

//   return (
//     <form onSubmit={handleContinue} className="flex flex-col flex-1 gap-6">
//       <div className="flex-1 space-y-4">
//         <label className="block text-sm font-medium text-gris-700">
//           Votre adresse email
//         </label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="nom@exemple.com"
//           className={`w-full p-4 rounded-lg border ${
//             error ? 'border-error-500' : 'border-gris-200'
//           } focus:outline-none focus:border-primary-500 transition-all outline-hidden`}
//           required
//         />
//         {error && (
//           <p className="text-error-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
//             {error}
//           </p>
//         )}
//       </div>

//       <Button 
//         type="submit" 
//         variant='primary'
//         loading={isLoading}
//         fullWidth
//       >
//         Continuer
//       </Button>
//     </form>
//   );
// };