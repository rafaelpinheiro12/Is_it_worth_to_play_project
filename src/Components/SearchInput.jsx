import axios from "axios";
import { URL } from "../config";

 const fetchSuggestions = async ({query, setSuggestions, setShowSuggestions}) => {
    if (!query || query.trim().length < 2) return;
    
    try {
      console.log('[SearchInput] Fetching suggestions', { query: query.trim(), url: `${URL}/fetchGame/searchInputHandler` });
      const response = await axios.post(`${URL}/fetchGame/searchInputHandler`,{}, {
        params: { query: query.trim() }
      });
      console.log('[SearchInput] Response headers:', response.headers);
      console.log('[SearchInput] Response data:', response.data);
      if (response?.data) {
        const headerSource = response?.headers?.['x-search-source'] || response?.headers?.['X-Search-Source'];
        console.log('[SearchInput] Detected source:', response.data.source || headerSource || 'unknown');
        console.log('[SearchInput] Sample results:', (response.data.results || []).slice(0, 3));
      }
      setSuggestions(response.data.results || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('[SearchInput] Error fetching suggestions:', error?.response?.data || error?.message || error);
      setSuggestions([]);
  };
}

export default fetchSuggestions;