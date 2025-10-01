import SearchInput from '../Components/SearchInput'
import { useState, useEffect } from 'react'

function MainPage() {

const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
const [query, setQuery] = useState('');

useEffect(() => {
    SearchInput({ query, setSuggestions, setShowSuggestions });
}, [query]);

  return (
    <div>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div>
        {showSuggestions && suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>{suggestion.name}</li>
            ))}
          </ul>)}
      </div>
    </div>
  )
}

export default MainPage
