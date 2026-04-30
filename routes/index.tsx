import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { Book, HomeProps } from "../types/types.ts";
import StockManager from "../islands/StockManager.tsx";
import AddBookForm from "../islands/AddBookForm.tsx";
import EditBookForm from "../islands/EditBookForm.tsx";

function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;
  return typeof record.id === "number" &&
    typeof record.title === "string" &&
    typeof record.description === "string" &&
    typeof record.price === "number" &&
    typeof record.stock === "number";
}

export const handler = define.handlers({
  async GET(ctx) {
    try {
      const apiUrl = Deno.env.get("API_URL");
      if (!apiUrl) {
        return ctx.render(
          <Home
            books={[]}
            errorMessage="API_URL is not configured."
            apiUrl={undefined}
          />,
        );
      }

      const resp = await fetch(`${apiUrl}/books`, {
        headers: { "Accept": "application/json" },
      });

      if (!resp.ok) {
        return ctx.render(
          <Home
            books={[]}
            errorMessage={`Could not load books (HTTP ${resp.status}).`}
            apiUrl={apiUrl}
          />,
        );
      }

      const payload: unknown = await resp.json();
      if (!Array.isArray(payload)) {
        return ctx.render(
          <Home
            books={[]}
            errorMessage="Invalid data format from API."
            apiUrl={apiUrl}
          />,
        );
      }

      const books = payload.filter(isBook);
      const hasInvalidItems = books.length !== payload.length;

      return ctx.render(
        <Home
          books={books}
          errorMessage={hasInvalidItems
            ? "Some items were ignored because they have an invalid format."
            : undefined}
          apiUrl={apiUrl}
        />,
      );
    } catch (err) {
      console.error("Error fetching books:", err);
      return ctx.render(
        <Home
          books={[]}
          errorMessage="Unexpected error while loading books."
          apiUrl={undefined}
        />,
      );
    }
  },
});

export default function Home({ books, errorMessage, apiUrl }: HomeProps) {
  return (
    <div class="px-4 py-8 mx-auto bg-gray-50 min-h-screen">
      <Head>
        <title>Book Inventory | Admin</title>
      </Head>

      <div class="max-w-screen-lg mx-auto">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold text-gray-800">Book Inventory</h1>
            <p class="text-gray-600">Manage your stock levels securely</p>
            <AddBookForm apiUrl={apiUrl} />
          </div>  
        </div>

        {errorMessage && (
          <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div class="grid gap-6 shadow-sm bg-white p-6 rounded-xl border border-gray-100">
          {books.length > 0
            ? (
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-gray-100">
                      <th class="py-3 px-4 font-semibold text-gray-700">
                        Book Details
                      </th>
                      <th class="py-3 px-4 font-semibold text-gray-700 text-center">
                        Price
                      </th>
                      <th class="py-3 px-4 font-semibold text-gray-700 text-right">
                        Stock
                      </th>
                      <th class="py-3 px-4 font-semibold text-gray-700 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr
                        key={book.id}
                        class="border-b border-gray-50 hover:bg-gray-50 transition"
                      >
                        <td class="py-4 px-4">
                          <div class="font-bold text-gray-800">
                            {book.title}
                          </div>
                          <div class="text-sm text-gray-500">
                            {book.description}
                          </div>
                        </td>
                        <td class="py-4 px-4 text-center font-mono text-green-600 font-semibold">
                          ${book.price}
                        </td>
                        <td class="py-4 px-4 text-right">
                          <StockManager
                            bookId={book.id}
                            initialStock={book.stock}
                            apiUrl={apiUrl}
                          />
                        </td>
                        <td class="py-4 px-4 text-right">
                          <div class="inline-flex gap-2">
                          <EditBookForm book={book} apiUrl={apiUrl} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
            : (
              <div class="text-center py-20 text-gray-400">
                <p>No books available in the database.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
