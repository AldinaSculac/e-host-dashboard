'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const ApartmentFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const NoteFormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  apartment_id: z.string(),
  category_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const Apartment = ApartmentFormSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
}).extend({
  name: z.string().min(1, 'Apartment name is required.'),
  description: z.string().min(1, 'Apartment description is required.'),
});

const Note = NoteFormSchema.omit({
  id: true,
  apartment_id: true,
  created_at: true,
  updated_at: true,
}).extend({
  title: z.string().min(1, 'Title is required.'),
  category_id: z.preprocess(
    (value) => (value === null ? '' : value),
    z.string().min(1, 'Select a category.')
  ),
  description: z.string().min(1, 'Description is required.'),
});

export type StateApartment = {
  errors?: {
    name?: string[];
    description?: string[];
  };
  message?: string | null;
};

export type StateNote = {
  errors?: {
    title?: string[];
    category_id?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createApartment(
  prevState: StateApartment,
  formData: FormData
) {
  const validatedFields = Apartment.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create an apartment.',
    };
  }

  const { name, description } = validatedFields.data;
  const created_at = new Date().toISOString().split('T')[0];
  const user_id = '410544b2-4001-4271-9855-fec4b6a6442a'; // TODO: get correct userId

  let result;

  try {
    result = await sql`
      INSERT INTO apartments (name, description, user_id, created_at)
      VALUES (${name}, ${description}, ${user_id}, ${created_at})
      RETURNING id
    `;
  } catch (error) {
    return {
      message: 'Failed to create an apartment.',
    };
  }

  if (!result.rows || result.rows.length === 0) {
    return {
      message: 'Failed to retrieve created apartment ID.',
    };
  }

  const apartment = result.rows[0];
  const id = apartment.id;
  redirect(`/dashboard/${id}`);
}

export async function updateApartment(
  id: string,
  prevState: StateApartment,
  formData: FormData
) {
  const validatedFields = Apartment.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to update an apartment.',
    };
  }

  const { name, description } = validatedFields.data;
  const updated_at = new Date().toISOString().split('T')[0];

  try {
    await sql`
      UPDATE apartments
      SET name = ${name}, description = ${description}, updated_at = ${updated_at}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Failed to update apartment.',
    };
  }

  revalidatePath(`/dashboard/${id}`);
  redirect(`/dashboard/${id}`);
}

export async function deleteApartment(id: string) {
  try {
    // delete all notes associated with the apartment
    await sql`DELETE FROM notes WHERE apartment_id = ${id}`;

    // delete the apartment
    await sql`DELETE FROM apartments WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Failed to delete apartment.' };
  }
  redirect(`/dashboard`);
}

export async function createNote(
  id: string,
  prevState: StateNote,
  formData: FormData
) {
  const validatedFields = Note.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    category_id: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create a note.',
    };
  }

  const { title, description, category_id } = validatedFields.data;
  const created_at = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO notes (title, description, apartment_id, category_id, created_at)
      VALUES (${title}, ${description}, ${id}, ${category_id}, ${created_at})`;
  } catch (error) {
    return {
      message: 'Failed to create note.',
    };
  }

  redirect(`/dashboard/${id}`);
}

export async function updateNote(
  noteId: string,
  apartmentId: string,
  prevState: StateNote,
  formData: FormData
) {
  const validatedFields = Note.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    category_id: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create a note.',
    };
  }

  const { title, description, category_id } = validatedFields.data;
  const updated_at = new Date().toISOString().split('T')[0];

  try {
    await sql`
    UPDATE notes
    SET title = ${title}, description = ${description}, category_id = ${category_id}, updated_at = ${updated_at}
    WHERE id = ${noteId}
  `;
  } catch (error) {
    return {
      message: 'Failed to update note.',
    };
  }

  revalidatePath(`/dashboard/${apartmentId}`);
  redirect(`/dashboard/${apartmentId}`);
}

export async function deleteNote(noteId: string, apartmentId: string) {
  try {
    await sql`DELETE FROM notes WHERE id = ${noteId}`;
    revalidatePath(`/dashboard/${apartmentId}`);
    return { message: 'Deleted note.' };
  } catch (error) {
    return { message: 'Failed to delete note.' };
  }
}
