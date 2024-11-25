'use server';
import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Apartment,
  NoteTable,
  Note,
} from './definitions';
import { formatCurrency } from './utils';

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

export async function fetchNotes(apartmentId: string) {
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
        notes.apartment_id = ${apartmentId};
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch notes.');
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

////////////////////////////////////
export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
