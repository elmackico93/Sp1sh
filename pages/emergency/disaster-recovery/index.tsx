import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function DisasterRecoveryPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Route to the dynamic emergency category page
    router.push('/emergency/disaster-recovery');
  }, [router]);

  return <LoadingPlaceholder />;
}
