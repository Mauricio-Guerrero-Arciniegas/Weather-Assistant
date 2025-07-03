function PressureInfo() {
  return (
    <div className="pressure-card">
      <h3>ℹ️ ¿Qué es la presión atmosférica?</h3>
      <p>
        Es el peso del aire sobre la superficie terrestre. Se mide en <strong>hPa</strong> (hectopascales).
        Un valor normal ronda los <strong>1013 hPa</strong>.
      </p>

      <table className="pressure-table">
        <thead>
          <tr>
            <th>Presión</th>
            <th>Interpretación</th>
            <th>Clima Típico</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>&gt; 1020 hPa</td>
            <td>Alta presión</td>
            <td>Tiempo estable ☀️</td>
          </tr>
          <tr>
            <td>1010 - 1020 hPa</td>
            <td>Normal</td>
            <td>Clima equilibrado 🌤️</td>
          </tr>
          <tr>
            <td>&lt; 1010 hPa</td>
            <td>Baja presión</td>
            <td>Lluvias probables 🌧️</td>
          </tr>
          <tr>
            <td>&lt; 1000 hPa</td>
            <td>Muy baja presión</td>
            <td>Tormentas fuertes ⛈️</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PressureInfo