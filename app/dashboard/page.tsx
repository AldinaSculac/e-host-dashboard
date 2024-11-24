import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { CardsSkeleton } from '../ui/skeletons';

export default async function Page() {
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* TODO: Create apt card should not be wrapped with suspense */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
    </main>
  );
}
