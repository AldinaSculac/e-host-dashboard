import { deleteApartment } from '@/app/lib/actions';
import { CheckCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateApartment({ title }: { title: string }) {
  return (
    <Link
      href="/dashboard/create"
      className="rounded-md bg-cyan-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
    >
      {title}
    </Link>
  );
}

export function EditApartment({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/${id}/edit`}>
      <PencilSquareIcon className="w-5 h-5 hover:text-cyan-600" />
    </Link>
  );
}

export function DeleteApartment({ id }: { id: string }) {
  // We cannot pass the id as an argument to the Server Action, we need to use JS bind
  const deleteApartmentWithId = deleteApartment.bind(null, id);

  return (
    <form action={deleteApartmentWithId}>
      <button
        type="submit"
        className="inline-flex items-center gap-x-1.5 rounded-md bg-cyan-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
      >
        <CheckCircleIcon aria-hidden="true" className="-ml-0.5 size-5" />
        Delete apartment
      </button>
    </form>
  );
}
