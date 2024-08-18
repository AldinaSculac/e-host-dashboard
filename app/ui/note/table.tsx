import { fetchNotes } from '@/app/lib/data';

type NotesProps = {
  apartmentId: string;
};

export default async function NoteTable({ apartmentId }: NotesProps) {
  const notes = await fetchNotes(apartmentId);

  return (
    <div>
      <h2 className="text-lg mb-2 md:text-xl">Notes</h2>
      {notes?.map((note) => (
        <div key={note.id}>
          <p>{note.title}</p>
          <p>{note.description}</p>
        </div>
      ))}
    </div>
  );
}
