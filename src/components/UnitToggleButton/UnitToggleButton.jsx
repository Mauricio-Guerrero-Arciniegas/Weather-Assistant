function UnitToggleButton({ isCelsius, onToggle }) {
  return (
    <button onClick={onToggle} className="unit-toggle">
      Cambiar a °{isCelsius ? 'F' : 'C'}
    </button>
  )
}

export default UnitToggleButton