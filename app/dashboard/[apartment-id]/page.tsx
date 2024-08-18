import { Suspense } from 'react';
import ApartmentCard from '@/app/ui/apartment/apartment-card';
import { ApartmentCardSkeleton, NoteTableSkeleton } from '@/app/ui/skeletons';
import Table from '@/app/ui/note/table';

export default function Page({
  params,
}: {
  params: { 'apartment-id': string };
}) {
  const apartmentId = Array.isArray(params['apartment-id'])
    ? params['apartment-id'][0]
    : params['apartment-id'];

  return (
    <main>
      <Suspense fallback={<ApartmentCardSkeleton />}>
        <ApartmentCard apartmentId={apartmentId} />
      </Suspense>
      <Suspense fallback={<NoteTableSkeleton />}>
        <Table apartmentId={apartmentId} />
      </Suspense>
    </main>
  );
}
