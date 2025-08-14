import axios from 'axios';
import { useCookies } from '@vueuse/integrations/useCookies'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const baseApiUrl=import.meta.env.VITE_APP_API_URL+"admin/"
const cookies = useCookies(['fishingMap'])
const token = cookies.getAll().fishingMap

const speciesAPI = axios.create({
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
    Authorization:`${token}`
  },
});

export function useSpecies() {

  const species = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const getSpecies = async () => {
    loading.value = true;
    try {
      const { data } = await speciesAPI.get(`${baseApiUrl}/species`);
      species.value = data.result;
    } catch (err) {
      error.value = err;
      toast.error("Failed to fetch species");
    } finally {
      loading.value = false;
    }
  };

  const createSpecies = async (speciesData) => {
    loading.value = true;
    try {
      const { data } = await speciesAPI.post(`${baseApiUrl}/species`, speciesData);
      species.value.push(data.result);
    } catch (err) {
      error.value = err;
      toast.error("Failed to create species");
    } finally {
      loading.value = false;
    }
  };

  const updateSpecies = async (speciesId, speciesData) => {
    loading.value = true;
    try {
      const { data } = await speciesAPI.put(`${baseApiUrl}/species/${speciesId}`, speciesData);
      const index = species.value.findIndex((s) => s._id === speciesId);
      if (index !== -1) {
        species.value[index] = data.result;
      }
    } catch (err) {
      error.value = err;
      toast.error("Failed to update species");
    } finally {
      loading.value = false;
    }
  };

  const deleteSpecies = async (speciesId) => {
    loading.value = true;
    try {
      await speciesAPI.delete(`${baseApiUrl}/species/${speciesId}`);
      species.value = species.value.filter((s) => s._id !== speciesId);
    } catch (err) {
      error.value = err;
      toast.error("Failed to delete species");
    } finally {
      loading.value = false;
    }
  };

  return {
    species,
    loading,
    error,
    getSpecies,
    createSpecies,
    updateSpecies,
    deleteSpecies
  };
}