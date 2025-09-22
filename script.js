async function loadRecords() {
  const response = await fetch("data.json");
  const data = await response.json();

  const yearFilter = document.getElementById("yearFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const container = document.getElementById("records-container");

  // Populate year dropdown
  const years = [...new Set(data.team_records.map(r => r.year))];
  years.forEach(y => {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearFilter.appendChild(option);
  });

  function render() {
    const category = categoryFilter.value;
    const year = yearFilter.value;
    container.innerHTML = "";

    if (category === "team") {
      let records = data.team_records;
      if (year !== "all") {
        records = records.filter(r => r.year == year);
      }
      const table = document.createElement("table");
      table.innerHTML = `
        <tr><th>Year</th><th>Wins</th><th>Losses</th><th>Champions</th></tr>
        ${records.map(r => `
          <tr>
            <td>${r.year}</td>
            <td>${r.wins}</td>
            <td>${r.losses}</td>
            <td>${r.champions ? "Yes" : "No"}</td>
          </tr>`).join("")}
      `;
      container.appendChild(table);
    }

    if (category === "player") {
      let records = data.player_records;
      const table = document.createElement("table");
      table.innerHTML = `
        <tr><th>Name</th><th>Position</th><th>Stats</th></tr>
        ${records.map(p => `
          <tr>
            <td>${p.name}</td>
            <td>${p.position}</td>
            <td>${p.passing_yards || p.rushing_yards || "—"}</td>
          </tr>`).join("")}
      `;
      container.appendChild(table);
    }
  }

  yearFilter.addEventListener("change", render);
  categoryFilter.addEventListener("change", render);
  render();
}

loadRecords();
