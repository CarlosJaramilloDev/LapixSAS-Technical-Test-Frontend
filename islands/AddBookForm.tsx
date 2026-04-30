import { useSignal } from "@preact/signals";
import { AddBookFormProps } from "../types/types.ts";

export default function AddBookForm({ apiUrl }: AddBookFormProps) {
  const isOpen = useSignal(false);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    loading.value = true;
    error.value = null;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseInt(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
    };

    try {
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }
      const resp = await fetch(`${apiUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        globalThis.location.reload();
      } else {
        const errData = await resp.json();
        console.error(`Failed to create book: ${errData}`);
        error.value = `Failed to create book: ${errData.message}`;
      }
    } catch (err) {
      console.error(`Could not connect to the server: ${err}`);
      error.value = `Could not connect to the server: ${err}`;
    } finally {
      loading.value = false;
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => (isOpen.value = true)}
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition"
      >
        + Add New Book
      </button>

      {isOpen.value && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 class="text-2xl font-bold mb-4">Register New Book</h2>
            
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input name="title" required class="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" required class="w-full border rounded-lg px-3 py-2 mt-1" rows={3}></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input name="price" type="number" step="1" required class="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Initial Stock</label>
                  <input name="stock" type="number" required class="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
              </div>

              {error.value && <p class="text-red-500 text-sm">{error.value}</p>}

              <div class="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => (isOpen.value = false)}
                  class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading.value}
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50"
                >
                  {loading.value ? "Saving..." : "Save Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}