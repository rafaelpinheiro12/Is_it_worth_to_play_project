import axios from "axios";
import { URL } from "../config";

 const fetchSuggestions = async ({query, setSuggestions, setShowSuggestions}) => {
    if (!query || query.trim().length < 2) return;
    
    try {
      const response = await axios.post(`${URL}/fetchGame/searchInputHandler`,{}, {
        params: { query: query.trim() }
      });
      console.log(response.data);
      setSuggestions(response.data.results || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
  };
}

export default fetchSuggestions;