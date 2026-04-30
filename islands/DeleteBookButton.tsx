import { useSignal } from "@preact/signals";
import { DeleteBookButtonProps } from "../types/types.ts";

export default function DeleteBookButton({ bookId, bookTitle, apiUrl }: DeleteBookButtonProps) {
  const loading = useSignal(false);

  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete "${bookTitle}"?`);
    
    if (!confirmed) return;

    loading.value = true;
    try {
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const resp = await fetch(`${apiUrl}/books/${bookId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
        },
      });

      if (resp.ok) {
        globalThis.location.reload();
      } else {
        const errData = await resp.json();
        console.error(`Failed to delete book: ${errData}`);
        alert(`Failed to delete book: ${errData.message}`);
      }
    } catch (err) {
      console.error(`Could not connect to the server: ${err}`);
      alert(`Could not connect to the server: ${err}`);
    } finally {
      loading.value = false;
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading.value}
      class="text-red-500 hover:text-red-700 font-medium transition disabled:opacity-50"
    >
      {loading.value ? "Deleting..." : "Delete"}
    </button>
  );
}