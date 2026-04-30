export interface Book {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    created_at?: string;
    updated_at?: string;
}

export interface HomeProps {
    books: Book[];
    errorMessage?: string;
}