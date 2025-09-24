async function loadRecords() {
  // 1) Fetch the record book JSON
  const response = await fetch("data.json");
  const data = await response.json();

  // 2) Optional elements (script will no-op if they're not present)
  const yearFilter = document.getElementById("yearFilter");           // <select>
  const categoryFilter = document.getElementById("categoryFilter");   // <select>
  const container = document.getElementById("records-container");     // <div>

  if (!container || !yearFilter || !categoryFilter) {
    // If these elements aren't on the page, still expose helpers globally if needed and exit
    window.__osuClubFootballData = data;
    return;
  }

  // 3) Helpers to adapt JSON -> simple table rows
  const parseRecord = (recStr) => {
    // "9-1" -> { wins: 9, losses: 1 }; otherwise null
    const m = typeof recStr === "string" && recStr.match(/^(\d+)-(\d+)$/);
    if (!m) return { wins: null, losses: null };
    return { wins: Number(m[1]), losses: Number(m[2]) };
  };

  const teamRows = (year) => {
    // Build rows from team_records.year_by_year
    let rows = (data.team_records?.year_by_year || []).map(r => {
      const { wins, losses } = parseRecord(r.record);
      const champions = (r.note || "").toLowerCase().includes("champion");
      return {
        year: r.year,
        wins,
        losses,
        champions,
        note: r.note || ""
      };
    });
    if (year && year !== "all") {
      rows = rows.filter(x => String(x.year) === String(year));
    }
    // Sort descending by year for display
    rows.sort((a, b) => b.year - a.year);
    return rows;
  };

  const awardsRows = () => {
    return (data.awards || []).map(a => ({
      title: a.title || "",
      person: a.person || "",
      role: a.role || "",
      narrative: a.narrative || ""
    }));
  };

  const opponentsRows = () => {
    return (data.record_vs_opponents?.rows || []).map(r => ({
      opponent: r.opponent,
      won: r.won,
      lost: r.lost,
      first: r.first_meeting,
      last: r.last_meeting
    })).sort((a, b) => a.opponent.localeCompare(b.opponent));
  };

  const statsBlocks = () => {
    // Flatten stats to a simple list of {block, subcat, rank, text}
    const out = [];
    const stats = data.stats || {};
    Object.keys(stats).forEach(block => {
      const sub = stats[block] || {};
      Object.keys(sub).forEach(subcat => {
        (sub[subcat] || []).forEach(item => {
          out.push({ block, subcat, rank: item.rank, text: item.text });
        });
      });
    });
    return out;
  };

  // 4) Populate year dropdown (with "all")
  const allYears = [...new Set((data.team_records?.year_by_year || []).map(x => x.year))].sort((a, b) => b - a);
  yearFilter.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = "All Years";
  yearFilter.appendChild(optAll);
  allYears.forEach(y => {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearFilter.appendChild(option);
  });

  // 5) Populate category dropdown if empty (team/opponents/awards/stats)
  if (!categoryFilter.options || categoryFilter.options.length === 0) {
    [
      { val: "team", label: "Team (Year-by-Year)" },
      { val: "opponents", label: "Record vs. Opponents" },
      { val: "awards", label: "Awards" },
      { val: "stats", label: "Stat Leaders" }
    ].forEach(({ val, label }) => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = label;
      categoryFilter.appendChild(opt);
    });
  }

  // 6) Rendering
  function render() {
    const category = categoryFilter.value || "team";
    const year = yearFilter.value || "all";
    container.innerHTML = "";

    if (category === "team") {
      const rows = teamRows(year);
      const table = document.createElement("table");
      const thead = `
        <thead>
          <tr>
            <th>Year</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Champions</th>
            <th>Note</th>
          </tr>
        </thead>
      `;
      const tbody = `
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.year ?? ""}</td>
              <td>${r.wins ?? ""}</td>
              <td>${r.losses ?? ""}</td>
              <td>${r.champions ? "Yes" : "No"}</td>
              <td>${r.note}</td>
            </tr>
          `).join("")}
        </tbody>
      `;
      table.innerHTML = thead + tbody;
      container.appendChild(table);
      return;
    }

    if (category === "opponents") {
      const rows = opponentsRows();
      const table = document.createElement("table");
      const thead = `
        <thead>
          <tr>
            <th>Opponent</th>
            <th>W</th>
            <th>L</th>
            <th>First</th>
            <th>Last</th>
          </tr>
        </thead>
      `;
      const tbody = `
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.opponent}</td>
              <td>${r.won}</td>
              <td>${r.lost}</td>
              <td>${r.first}</td>
              <td>${r.last}</td>
            </tr>
          `).join("")}
        </tbody>
      `;
      table.innerHTML = thead + tbody;
      container.appendChild(table);
      return;
    }

    if (category === "awards") {
      const rows = awardsRows();
      // Card-style layout in container
      const grid = document.createElement("div");
      grid.className = "grid three";
      rows.forEach(a => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <h3>${a.title}</h3>
          <p class="muted">${[a.role, a.person].filter(Boolean).join(" — ")}</p>
          <p>${a.narrative}</p>
        `;
        grid.appendChild(card);
      });
      container.appendChild(grid);
      return;
    }

    if (category === "stats") {
      const rows = statsBlocks();
      // Group by block/subcat
      const byBlock = {};
      rows.forEach(r => {
        byBlock[r.block] ||= {};
        byBlock[r.block][r.subcat] ||= [];
        byBlock[r.block][r.subcat].push(r);
      });

      const grid = document.createElement("div");
      grid.className = "grid two";

      Object.keys(byBlock).forEach(block => {
        const card = document.createElement("article");
        card.className = "card";
        const h3 = document.createElement("h3");
        h3.textContent = block.charAt(0).toUpperCase() + block.slice(1);
        card.appendChild(h3);

        Object.keys(byBlock[block]).forEach(sub => {
          const h4 = document.createElement("h4");
          h4.textContent = sub;
          const ol = document.createElement("ol");
          ol.className = "rank-list compact";
          byBlock[block][sub].forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<span class="rank">${item.rank}.</span> ${item.text}`;
            ol.appendChild(li);
          });
          card.append(h4, ol);
        });

        grid.appendChild(card);
      });

      container.appendChild(grid);
      return;
    }
  }

  // 7) Wire events
  yearFilter.addEventListener("change", render);
  categoryFilter.addEventListener("change", render);

  // 8) Initial render
  render();

  // Expose for debugging
  window.__osuClubFootballData = data;
}

loadRecords();
