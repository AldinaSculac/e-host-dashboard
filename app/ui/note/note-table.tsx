import { Note } from '@/app/lib/definitions';
import React from 'react';

type NotesProps = {
  notes?: Note[];
};

export default function NoteTable({ notes }: NotesProps) {
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
