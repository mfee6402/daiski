'use client';
import Container from '@/components/container';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function CoachesLayout({ children }) {
  const pathname = usePathname();
  if (!pathname.startsWith('/courses/')) {
    return (
      <>
        <Container>{children}</Container>
      </>
    );
  } else {
    return <>{children}</>;
  }
}
