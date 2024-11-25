import { fetchFilteredNotes } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';
import { DeleteNote, UpdateNote } from './buttons';

type NotesProps = {
  apartmentId: string;
  query: string;
  currentPage: number;
};

export default async function NoteTable({
  apartmentId,
  query,
  currentPage,
}: NotesProps) {
  const notes = await fetchFilteredNotes(apartmentId, query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {notes?.map((note) => (
              <div
                key={note.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="text-xl font-medium">{note.title}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{note.category_name}</p>
                    <p>
                      {note.updated_at
                        ? note.updated_at.toLocaleDateString()
                        : note.created_at.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateNote noteId={note.id} apartmentId={apartmentId} />
                    <DeleteNote noteId={note.id} apartmentId={apartmentId} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Last edited
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {notes?.map((note) => (
                <tr
                  key={note.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">{note.title}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {note.category_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {note.updated_at
                      ? note.updated_at.toLocaleDateString()
                      : note.created_at.toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateNote noteId={note.id} apartmentId={apartmentId} />
                      <DeleteNote noteId={note.id} apartmentId={apartmentId} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
