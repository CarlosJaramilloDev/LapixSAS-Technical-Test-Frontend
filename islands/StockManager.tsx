import { useSignal } from "@preact/signals";
import { StockManagerProps } from "../types/types.ts";

export default function StockManager({ bookId, initialStock, apiUrl }: StockManagerProps) {
  const stock = useSignal(initialStock);
  const loading = useSignal(false);

  const updateStock = async (amount: number) => {
    if (!apiUrl) {
      alert("API URL is not configured.");
      return;
    }

    loading.value = true;
    try {
    
      const response = await fetch(`${apiUrl}/books/${bookId}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (response.ok) {
        stock.value = data.book.stock;
      } else {
        const message = data.error ?? "Unknown error while updating stock.";
        console.error(message);
        alert(`Error updating stock: ${message}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Could not connect to the server: ${err}`);
    } finally {
      loading.value = false;
    }
  };

  return (
    <div class="flex items-center justify-end gap-3">
      <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => updateStock(-1)}
          disabled={loading.value || stock.value <= 0}
          class="px-3 py-1 bg-gray-50 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors border-r border-gray-200 font-bold"
        >
          -
        </button>
        
        <span class={`px-4 py-1 min-w-[3rem] text-center font-bold ${loading.value ? "animate-pulse text-gray-400" : "text-gray-800"}`}>
          {stock.value}
        </span>

        <button
          type="button"
          onClick={() => updateStock(1)}
          disabled={loading.value}
          class="px-3 py-1 bg-gray-50 hover:bg-green-50 hover:text-green-600 disabled:opacity-50 transition-colors border-l border-gray-200 font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}