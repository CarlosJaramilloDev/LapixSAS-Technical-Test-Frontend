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
    apiUrl: string | undefined;
    errorMessage?: string;
}

export interface StockManagerProps {
    bookId: number;
    initialStock: number;
    apiUrl: string | undefined;
}

export interface AddBookFormProps {
    apiUrl: string | undefined;
}

export interface EditBookFormProps {
    book: Book;
    apiUrl: string | undefined;
}

export interface DeleteBookButtonProps {
    bookId: number;
    bookTitle: string;
    apiUrl: string | undefined;
  }