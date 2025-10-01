import SearchInput from '../Components/SearchInput'
import { useState, useEffect } from 'react'
import "../App.css"
import SelectedGame from '../Components/SelectedGame';
import { Navigate } from 'react-router';

function MainPage() {

const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
const [query, setQuery] = useState('');
const [selectedSuggestion, setSelectedSuggestion] = useState(null);

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
    <div>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div>
        {showSuggestions && suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion) => (
              <div className="suggestion" key={suggestion.id} onClick={() => {
                setQuery("");
                setShowSuggestions(false);
                setSelectedSuggestion(suggestion);
                <Navigate to={`/${suggestion.name}`}/>;
              }}>
                <img className="suggestion-image" src={suggestion.background_image} alt={suggestion.name} />
                <li>{suggestion.name}</li>
              </div>
            ))}
          </ul>)}
      </div>
      <div>
        {selectedSuggestion && (
          <SelectedGame selectedGame={selectedSuggestion}/>
        )}
      </div>
    </div>
  )
}

export default MainPage
