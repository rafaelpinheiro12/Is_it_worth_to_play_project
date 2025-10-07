import { useState, useEffect, use } from "react";
import { useNavigate } from 'react-router';
import SearchInput from './SearchInput.jsx'
import {useAtom} from 'jotai'
import {selectedGameAtom} from '../State/state'

function GameSearchTool() {

    const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
const [query, setQuery] = useState('');
const [selectedSuggestion, setSelectedSuggestion] = useAtom(selectedGameAtom);

const navigate = useNavigate();

useEffect(() => {
    if (!query.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
    }

    const debounceTimer = setTimeout(() => {
        SearchInput({ query, setSuggestions, setShowSuggestions });
    }, 300);

    return () => {
        clearTimeout(debounceTimer);
    };
}, [query]);

  return (
    <>
      <input className="search-input" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      
        {showSuggestions && suggestions.length > 0 && (
            <div className="search-input-dropdown">
          <ul >
            {suggestions.map((suggestion) => (
              <div className="suggestion" key={suggestion.id} onClick={() => {
                setQuery("");
                setShowSuggestions(false);
                setSelectedSuggestion(suggestion);
                navigate(`/${suggestion.name}`);
              }}>
                <img className="suggestion-image" src={suggestion.background_image} alt={suggestion.name} />
                <li>{suggestion.name}</li>
              </div>
            ))}
          </ul>
          </div>)}
      
    </>
  )
}

export default GameSearchTool
