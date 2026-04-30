import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { Book, HomeProps } from "../types/types.ts";


export const handler = define.handlers({
  async GET(ctx) {
    try {
      const resp = await fetch(`${Deno.env.get("API_URL")}/books`, {
        headers: { "Accept": "application/json" },
      });
      
      if (!resp.ok) return ctx.render(<Home books={[]} />);
      
      const books: Book[] = await resp.json();
      return ctx.render(<Home books={books} />);
    } catch (err) {
      console.error("Error fetching books:", err);
      return ctx.render(<Home books={[]} />);
    }
  },
});


export default function Home({ books }: HomeProps) {
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
          </div>
          {/* Aquí irá luego el botón para añadir libro */}
        </div>

        <div class="grid gap-6 shadow-sm bg-white p-6 rounded-xl border border-gray-100">
          {books.length > 0 ? (
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="py-3 px-4 font-semibold text-gray-700">Book Details</th>
                    <th class="py-3 px-4 font-semibold text-gray-700 text-center">Price</th>
                    <th class="py-3 px-4 font-semibold text-gray-700 text-center">Current Stock</th>
                    <th class="py-3 px-4 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} class="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td class="py-4 px-4">
                        <div class="font-bold text-gray-800">{book.title}</div>
                        <div class="text-sm text-gray-500">{book.description}</div>
                      </td>
                      <td class="py-4 px-4 text-center font-mono text-green-600 font-semibold">
                        ${book.price}
                      </td>
                      <td class="py-4 px-4 text-center font-bold text-lg">
                        {book.stock}
                      </td>
                      <td class="py-4 px-4 text-right">
                        {/* Aquí insertaremos nuestra Isla de Stock pronto */}
                        <div class="inline-flex gap-2">
                           <button type="button" class="text-blue-500 hover:underline">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div class="text-center py-20 text-gray-400">
              <p>No books available in the database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
