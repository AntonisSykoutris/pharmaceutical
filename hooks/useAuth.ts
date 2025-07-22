// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useState, useEffect } from 'react';
// import { redirect } from 'next/navigation';
// import { Claims } from '@/lib/types/common';
// import { createClient } from '@/lib/supabase/client';

// type UseAuthReturn = {
//   claims: Claims | null;
//   isLoading: boolean;
//   error: string | null;
//   signOut: () => Promise<void>;
// };

// export function useAuth(): UseAuthReturn {
//   const [claims, setClaims] = useState<Claims | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const supabase = createClient();

//   const fetchClaims = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const { data, error } = await supabase.auth.getClaims();

//       if (error || !data?.claims) {
//         console.error('❌ Failed to get claims:', error);
//         redirect('/auth/login');
//       } else {
//         setClaims(data.claims as Claims);
//         console.log('✅ User claims:', data.claims);
//       }
//     } catch (err: any) {
//       console.error('❌ Error fetching claims:', err);
//       setError(err.message);
//       redirect('/auth/login');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       setClaims(null);
//       redirect('/auth/login');
//     } catch (err: any) {
//       console.error('❌ Error signing out:', err);
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchClaims();

//     // ✅ Add auth state change listener for reactive claims refresh
//     const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, _session) => {
//       await fetchClaims();
//     });

//     return () => {
//       subscription?.subscription?.unsubscribe();
//     };
//   }, []);

//   return {
//     claims,
//     isLoading,
//     error,
//     signOut,
//   };
// }
