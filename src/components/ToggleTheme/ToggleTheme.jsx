import styles from './ToggleTheme.module.scss'
import { FiMoon, FiSun } from 'react-icons/fi'

function ToggleTheme({ isDarkMode, setIsDarkMode }) {
  return (
    <button
      className={styles.toggle}
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label="Cambiar tema"
    >
      {isDarkMode ? <FiSun /> : <FiMoon />}
    </button>
  )
}

export default ToggleTheme