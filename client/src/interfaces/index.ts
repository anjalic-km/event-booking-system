export interface userType {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface eventType {
  _id: string;
  name: string;
  description: string;
  organizer: string;
  guests: string[];
  address: string;
  city: string;
  date: string;
  time: string;
  media: string[];
  tickets: {
    name: string;
    price: number;
    limit: number;
  }[];
  ticketTypes?: {
    name: string;
    price: number;
    limit: number;
  }[];
}