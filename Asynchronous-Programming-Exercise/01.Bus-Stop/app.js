async function getInfo() {
  const stopId = document.getElementById("stopId").value;
  const stopName = document.getElementById("stopName");
  const busesList = document.getElementById("buses");
  const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId}`;

  try {
    const response = await fetch(url);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const data = await response.json();
    stopName.textContent = data.name;

    busesList.replaceChildren();
    Object.entries(data.buses).forEach(([busId, time]) => {
      const li = document.createElement("li");
      li.textContent = `Bus ${busId} arrives in ${time} minutes`;
      busesList.appendChild(li);
    });
  } catch (error) {
    stopName.textContent = "Error";
  }
}
