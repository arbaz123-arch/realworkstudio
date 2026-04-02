import { redirect } from 'next/navigation';

/**
 * Root redirects are handled in middleware; this is a fallback for direct navigation.
 */
export default function RootPage() {
  redirect('/login');
}
