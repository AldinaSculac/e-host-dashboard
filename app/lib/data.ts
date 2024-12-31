'use server';
import { sql } from '@vercel/postgres';
import { Apartment, NoteTable, Note } from './definitions';

export async function fetchApartments(userId: string) {
  try {
    const data =
      await sql<Apartment>`SELECT id, name FROM apartments WHERE user_id=${userId} ORDER BY created_at ASC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch apartments.');
  }
}

export async function fetchApartment(apartmentId: string) {
  try {
    const data =
      await sql<Apartment>`SELECT id, name, description, created_at, updated_at FROM apartments WHERE id=${apartmentId}`;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch apartment details.');
  }
}

export async function fetchCategories() {
  try {
    const data = await sql<Apartment>`SELECT id, name FROM categories`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function fetchNote(id: string) {
  try {
    const data = await sql<Note>`
      SELECT 
        notes.id, 
        notes.title, 
        notes.description, 
        notes.apartment_id,
        notes.created_at, 
        notes.updated_at, 
        categories.name AS category_name
      FROM 
        notes
      JOIN 
        categories 
      ON 
        notes.category_id = categories.id
      WHERE 
        notes.id = ${id};
    `;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch note.');
  }
}

export async function fetchCardData(userId: string) {
  try {
    const data = await sql`
      SELECT 
        (SELECT COUNT(*) FROM apartments WHERE user_id = ${userId}) AS total_apartments,
        (SELECT COUNT(*) 
          FROM notes 
          WHERE apartment_id IN (SELECT id FROM apartments WHERE user_id = ${userId})
        ) AS total_notes
    `;

    const { total_apartments, total_notes } = data.rows[0];

    return {
      numberOfApartments: total_apartments ?? '0',
      numberOfNotes: total_notes ?? '0',
    };
  } catch (error) {
    console.error('Database Error while fetching card data:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredNotes(
  apartmentId: string,
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  // TODO: search by date?
  try {
    const data = await sql<NoteTable>`
      SELECT 
        notes.id, 
        notes.title, 
        notes.created_at, 
        notes.updated_at, 
        categories.name AS category_name
      FROM 
        notes
      JOIN 
        categories 
      ON 
        notes.category_id = categories.id
      WHERE 
        notes.apartment_id = ${apartmentId} AND
        (notes.title ILIKE ${`%${query}%`} OR
        categories.name ILIKE ${`%${query}%`})
        ORDER BY notes.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch notes.');
  }
}

export async function fetchNotesPages(apartmentId: string, query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM notes
    JOIN categories ON notes.category_id = categories.id
    WHERE 
      notes.apartment_id = ${apartmentId} AND
      (notes.title ILIKE ${`%${query}%`} OR
      categories.name ILIKE ${`%${query}%`})
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of notes.');
  }
}
