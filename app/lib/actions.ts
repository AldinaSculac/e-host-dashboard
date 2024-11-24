'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const CreateApartment = FormSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export async function createApartment(formData: FormData) {
  const { name, description } = CreateApartment.parse({
    name: formData.get('name'),
    description: formData.get('description'),
  });
  const created_at = new Date().toISOString().split('T')[0];
  const user_id = '410544b2-4001-4271-9855-fec4b6a6442a'; // TODO: get correct userId

  const result = await sql`
    INSERT INTO apartments (name, description, user_id, created_at)
    VALUES (${name}, ${description}, ${user_id}, ${created_at})
    RETURNING id
  `;

  const apartment = result.rows[0];
  const id = apartment.id;

  redirect(`/dashboard/${id}`);
}

const UpdateApartment = FormSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export async function updateApartment(id: string, formData: FormData) {
  const { name, description } = UpdateApartment.parse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  const updated_at = new Date().toISOString().split('T')[0];

  await sql`
    UPDATE apartments
    SET name = ${name}, description = ${description}, updated_at = ${updated_at}
    WHERE id = ${id}
  `;

  revalidatePath(`/dashboard/${id}`);
  redirect(`/dashboard/${id}`);
}

export async function deleteApartment(id: string) {
  await sql`DELETE FROM apartments WHERE id = ${id}`;
  revalidatePath('/dashboard');
  redirect(`/dashboard`);
}
