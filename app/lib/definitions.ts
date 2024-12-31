// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Apartment = {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

export type ApartmentForm = {
  id: string;
  name: string;
  description: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Note = {
  id: string;
  title: string;
  description: string;
  apartment_id: string;
  category_id: string;
  created_at: Date;
  updated_at: Date;
};

export type NoteTable = {
  id: string;
  title: string;
  category_name: string;
  created_at: Date;
  updated_at: Date;
};
