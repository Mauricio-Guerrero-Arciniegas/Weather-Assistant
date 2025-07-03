function Thermometer({ iconCode, tempC, animationKey, tempColorClass }) {
  return (
    <div className="weather-right">
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
        alt="Icono del clima"
        className="weather-icon"
      />
      <div className="thermo-section">
        <div className="thermo-label">Termómetro</div>
        <div className={`thermometer ${tempColorClass}`}>
          <div
            className="thermo-fill"
            key={animationKey}
            style={{ '--target-height': `${Math.min(tempC, 50) * 2}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default Thermometer