export interface Category {
  id: string;
  name: string;
  order?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  categoryId: string;
  isAvailable: boolean;
  isPopular: boolean;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface User {
  uid: string;
  email: string;
  role: 'admin';
}
