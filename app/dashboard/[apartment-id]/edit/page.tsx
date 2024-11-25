import Form from '@/app/ui/apartment/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchApartment } from '@/app/lib/data';

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
          {
            label: `${apartment?.name}`,
            href: `/dashboard/${apartmentId}`,
          },
          {
            label: 'Edit',
            href: `/dashboard/${apartmentId}/edit`,
            active: true,
          },
        ]}
      />
      <Form apartment={apartment} />
    </main>
  );
}
