'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchApartment, fetchNotes } from '@/app/lib/data';
import { Apartment, Note } from '@/app/lib/definitions';
import ApartmentCard from '@/app/ui/apartment/apartment-card';
import NoteTable from '@/app/ui/note/note-table';
import { ApartmentCardSkeleton, NoteTableSkeleton } from '@/app/ui/skeletons';

export default function Page() {
  const { 'apartment-id': apartmentId } = useParams();
  const [apartment, setApartment] = useState<Apartment>();
  const [notes, setNotes] = useState<Note[]>();

  const [loadingApartment, setLoadingApartment] = useState<boolean>(true);
  const [loadingNotes, setLoadingNotes] = useState<boolean>(true);

  useEffect(() => {
    const fetchApartmentData = async () => {
      if (typeof apartmentId === 'string') {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const apartmentData = await fetchApartment(apartmentId);
        setApartment(apartmentData);

        apartmentData && setLoadingApartment(false);
      }
    };

    const fetchNotesData = async () => {
      if (typeof apartmentId === 'string') {
        await new Promise((resolve) => setTimeout(resolve, 6000));
        const notesData = await fetchNotes(apartmentId);
        setNotes(notesData);

        notesData && setLoadingNotes(false);
      }
    };

    if (apartmentId) {
      fetchApartmentData();
      fetchNotesData();
    }
  }, [apartmentId]);

  return (
    <main>
      {loadingApartment ? (
        <ApartmentCardSkeleton />
      ) : (
        <ApartmentCard apartment={apartment} />
      )}

      {loadingNotes ? <NoteTableSkeleton /> : <NoteTable notes={notes} />}
    </main>
  );
}
