import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteNote } from '@/app/lib/actions';

export function CreateNote({ apartmentId }: { apartmentId: string }) {
  return (
    <Link
      href={`/dashboard/${apartmentId}/notes/create`}
      className="flex h-10 items-center rounded-lg bg-cyan-600 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
    >
      <span className="hidden md:block">Create Note</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateNote({
  noteId,
  apartmentId,
}: {
  noteId: string;
  apartmentId: string;
}) {
  return (
    <Link
      href={`/dashboard/${apartmentId}/notes/${noteId}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteNote({
  noteId,
  apartmentId,
}: {
  noteId: string;
  apartmentId: string;
}) {
  // We cannot pass the id as an argument to the Server Action, we need to use JS bind
  const deleteNoteWithId = deleteNote.bind(null, noteId, apartmentId);

  return (
    <form action={deleteNoteWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
