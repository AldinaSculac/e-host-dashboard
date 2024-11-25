import { fetchApartment } from '@/app/lib/data';
import Form from '@/app/ui/note/create-note';
import Breadcrumbs from '@/app/ui/breadcrumbs';

export default async function Page(props: {
  params: Promise<{ 'apartment-id': string }>;
}) {
  const params = await props.params;
  const apartmentId = params['apartment-id'];
  const apartment = await fetchApartment(apartmentId);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: `${apartment?.name}`, href: `/dashboard/${apartmentId}` },
          {
            label: 'Add Note',
            href: `/dashboard/${apartmentId}/notes/create`,
            active: true,
          },
        ]}
      />
      <Form apartmentId={apartmentId} />
    </main>
  );
}
