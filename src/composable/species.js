import axios from 'axios';
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const baseApiUrl=import.meta.env.VITE_APP_API_URL

const speciesAPI = axios.create({
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
  },
});

export function useSpecies() {

  const species = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const getSpecies = async () => {
    loading.value = true;
    try {
      const { data } = await speciesAPI.get(`${baseApiUrl}species`);
      species.value = data.result;
    } catch (err) {
      error.value = err;
      toast.error("Failed to fetch species");
    } finally {
      loading.value = false;
    }
  };


  return {
    species,
    loading,
    error,
    getSpecies,
  };
}