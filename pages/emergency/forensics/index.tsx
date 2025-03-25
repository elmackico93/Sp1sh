import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function ForensicsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Route to the dynamic emergency category page
    router.push('/emergency/forensics');
  }, [router]);

  return <LoadingPlaceholder />;
}
