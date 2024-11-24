import Link from 'next/link';
import { HomeModernIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateApartment } from '@/app/lib/actions';
import { ApartmentForm } from '@/app/lib/definitions';

export default function Form({ apartment }: { apartment: ApartmentForm }) {
  // We cannot pass the id as an argument to the Server Action, we need to use JS bind
  const updateApartmentWithId = updateApartment.bind(null, apartment.id);

  return (
    <form action={updateApartmentWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Apartment Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Apartment Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={apartment.name}
                placeholder="Enter apartment name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <HomeModernIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Apartment Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Apartment Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={4}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-cyan-600 sm:text-sm/6"
              defaultValue={apartment.description}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/dashboard/${apartment.id}`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Apartment</Button>
      </div>
    </form>
  );
}