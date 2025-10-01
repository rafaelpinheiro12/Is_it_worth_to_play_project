import axios from "axios";

 const fetchSuggestions = async ({query, setSuggestions, setShowSuggestions}) => {
    if (!query || query.trim().length < 2) return;
    
    try {
      const response = await axios.post(`http://localhost:4444/fetchGame/searchInputHandler`,{}, {
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