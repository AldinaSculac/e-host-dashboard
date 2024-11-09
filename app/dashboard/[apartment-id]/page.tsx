import { Suspense } from 'react';
import ApartmentCard from '@/app/ui/apartment/apartment-card';
import { ApartmentCardSkeleton, NoteTableSkeleton } from '@/app/ui/skeletons';
import NoteTable from '@/app/ui/note/table';
import Search from '@/app/ui/search';
import { CreateNote } from '@/app/ui/note/buttons';
import Pagination from '@/app/ui/note/pagination';
import { fetchNotesPages } from '@/app/lib/data';

export default async function Page({
  params,
  searchParams,
}: {
  params: { 'apartment-id': string };
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const apartmentId = Array.isArray(params['apartment-id'])
    ? params['apartment-id'][0]
    : params['apartment-id'];

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchNotesPages(apartmentId, query);

  return (
    <main>
      <Suspense fallback={<ApartmentCardSkeleton />}>
        <ApartmentCard apartmentId={apartmentId} />
      </Suspense>

      <div className="flex mb-2 w-full items-center justify-between md:mb-4">
        <h2 className="text-lg md:text-xl">Notes</h2>
      </div>

      <div className="mb-4 flex items-center justify-between gap-2 md:mb-8">
        <Search placeholder="Search notes..." />
        <CreateNote apartmentId={apartmentId} />
      </div>
      <Suspense key={query + currentPage} fallback={<NoteTableSkeleton />}>
        <NoteTable
          apartmentId={apartmentId}
          query={query}
          currentPage={currentPage}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
