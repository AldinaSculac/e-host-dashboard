import Form from '@/app/ui/note/edit-note';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchApartment, fetchNote } from '@/app/lib/data';

export default async function Page(props: {
  params: Promise<{ 'apartment-id': string; 'notes-id': string }>;
}) {
  const params = await props.params;
  const apartmentId = params['apartment-id'];
  const notetId = params['notes-id'];
  const apartment = await fetchApartment(apartmentId);
  const note = await fetchNote(notetId);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          {
            label: `${apartment?.name}`,
            href: `/dashboard/${apartmentId}`,
          },
          {
            label: 'Edit Note',
            href: `/dashboard/${apartmentId}/notes/${notetId}/edit`,
            active: true,
          },
        ]}
      />
      <Form note={note} />
    </main>
  );
}
