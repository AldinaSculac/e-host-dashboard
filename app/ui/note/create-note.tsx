import Link from 'next/link';
import { DocumentTextIcon, TagIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createNote } from '@/app/lib/actions';
import { fetchCategories } from '@/app/lib/data';

export default async function Form({ apartmentId }: { apartmentId: string }) {
  // We cannot pass the id as an argument to the Server Action, we need to use JS bind
  const createNotetWithId = createNote.bind(null, apartmentId);
  const categories = await fetchCategories();

  return (
    <form action={createNotetWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Note Title */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter title"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Choose category
          </label>
          <div className="relative">
            <select
              id="category"
              name="categoryId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Note Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={4}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-cyan-600 sm:text-sm/6"
              defaultValue={''}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/dashboard/${apartmentId}`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Note</Button>
      </div>
    </form>
  );
}
