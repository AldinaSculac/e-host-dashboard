import Form from '@/app/ui/apartment/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          {
            label: 'Create Apartment',
            href: '/dashboard/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
