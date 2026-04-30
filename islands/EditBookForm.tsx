import { useSignal } from "@preact/signals";
import { EditBookFormProps } from "../types/types.ts";

export default function EditBookForm({ book, apiUrl }: EditBookFormProps) {
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
    };

    try {
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }
      const resp = await fetch(`${apiUrl}/books/${book.id}`, {
        method: "PATCH",
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
        console.error(`Failed to update book: ${errData}`);
        error.value = `Failed to update book: ${errData.message}`;
      }
    } catch (err) {
      console.error(`Could not connect to the server: ${err}`);
      error.value = `Could not connect to the server: ${err}`;
    } finally {
      loading.value = false;
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => (isOpen.value = true)}
        class="text-blue-500 hover:text-blue-700 font-medium transition"
      >
        Edit
      </button>

      {isOpen.value && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl text-left">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">Edit Book</h2>
            
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  name="title" 
                  required 
                  defaultValue={book.title}
                  class="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  name="description" 
                  required 
                  defaultValue={book.description}
                  class="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                  rows={3}
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Price ($)</label>
                <input 
                  name="price" 
                  type="number" 
                  step="1" 
                  required 
                  defaultValue={book.price.toString()}
                  class="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              {error.value && <p class="text-red-500 text-sm">{error.value}</p>}

              <div class="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => (isOpen.value = false)}
                  class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading.value}
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-blue-700 transition"
                >
                  {loading.value ? "Updating..." : "Update Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}