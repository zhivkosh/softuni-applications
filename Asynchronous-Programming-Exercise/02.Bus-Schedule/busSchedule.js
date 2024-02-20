function solve() {
  const infoText = document.querySelector(".info");
  const departBtn = document.getElementById("depart");
  const arriveBtn = document.getElementById("arrive");
  let nextStopId = "depot";
  let stopName;

  const url = `http://localhost:3030/jsonstore/bus/schedule/${nextStopId}`;

  async function depart() {
    try {
      const response = await fetch(url);
      if (response.ok == false) {
        const error = await response.json();
        throw error;
      }
      const data = await response.json();
      stopName = data.name;
      infoText.textContent = `Next stop ${stopName}`;

      departBtn.disabled = true;
      arriveBtn.disabled = false;
    } catch (error) {
      infoText.textContent = "Error";
      departBtn.disabled = true;
      arriveBtn.disabled = true;
    }
  }

  function arrive() {
    infoText.textContent = `Arriving at ${stopName}`;
    departBtn.disabled = false;
    arriveBtn.disabled = true;
  }

  return {
    depart,
    arrive,
  };
}

let result = solve();
