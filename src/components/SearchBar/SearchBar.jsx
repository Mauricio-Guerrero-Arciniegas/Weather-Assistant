import styles from './SearchBar.module.scss'
import { FiSearch } from 'react-icons/fi' // usando react-icons (liviano y simple)

function SearchBar({ city, setCity, onSearch }) {
  return (
    <form className={styles.searchForm} onSubmit={onSearch}>
      <input
        type="text"
        placeholder="Ingresa una ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit" className={styles.searchButton}>
        <FiSearch className={styles.icon} />
        <span>Buscar</span>
      </button>
    </form>
  )
}

export default SearchBar