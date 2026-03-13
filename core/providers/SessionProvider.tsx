// 'use client';

// import { useAuth } from '@/features/authentication/presentation/hooks/useAuth';
// import { useAppStore } from '@/core/store';

// interface SessionProviderProps {
//       children: React.ReactNode;
// }

// export function SessionProvider({ children }: SessionProviderProps) {
//       const { isLoadingSession } = useAuth();
//       const storeLoading = useAppStore((s) => s.isLoadingSession);

//       const loading = isLoadingSession || storeLoading;

//       if (loading) {
//             return (
//                   <div className="flex min-h-screen items-center justify-center bg-white">
//                         <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
//                   </div>
//             );
//       }

//       return <>{children}</>;
// }