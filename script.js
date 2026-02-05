const baseRows = [
  {
    clase: "Antitérmicos/antiinflamatorios",
    principio: "Paracetamol",
    ejemplos: "Apiretal (solución oral 100 mg/ml; comprimidos bucodispersables 325 mg y 500 mg).",
  },
  {
    clase: "Antitérmicos/antiinflamatorios",
    principio: "Ibuprofeno",
    ejemplos:
      "Ibuprofeno KERN PHARMA (20 mg/ml, 40 mg/ml, sobres 600 mg), Apirefeno 40 mg/ml, Algidrín pediátrico 20 y 40 mg/ml.",
  },
  {
    clase: "Antitérmicos/antiinflamatorios",
    principio: "Metamizol",
    ejemplos: "Metalgial 500 mg/ml gotas orales, Metamizol Normon 500 mg/ml gotas orales.",
  },
  {
    clase: "Antihistamínicos",
    principio: "Cetirizina",
    ejemplos: "Cetirizina TEVA 1 mg/ml, Zyrtec 1 mg/ml.",
  },
  {
    clase: "Antihistamínicos",
    principio: "Desloratadina",
    ejemplos: "Aerius 0.5 mg/ml solución oral, Desloratadina KERN PHARMA 0.5 mg/ml solución oral.",
  },
  {
    clase: "Antihistamínicos",
    principio: "Bilastina",
    ejemplos: "Bilaxten 2.5 mg/ml solución oral, Bilaxten 10 mg y 20 mg.",
  },
  {
    clase: "Antibióticos",
    principio: "Amoxicilina",
    ejemplos: "Amoxicilina (contiene sacarosa).",
  },
  {
    clase: "Antibióticos",
    principio: "Amoxicilina + ácido clavulánico",
    ejemplos: "Amoxicilina clavulánico (contiene dextrinomaltosa).",
  },
  {
    clase: "Antibióticos",
    principio: "Fenoximetilpenicilina",
    ejemplos: "Penilevel 250 mg (contiene sacarosa).",
  },
  {
    clase: "Antibióticos",
    principio: "Azitromicina",
    ejemplos: "Azitromicina 200 mg/5 ml solución oral (contiene sacarosa).",
  },
  {
    clase: "Antibióticos",
    principio: "Cefuroxima",
    ejemplos: "Zinnat solución oral 250 mg/5 ml (contiene sacarosa).",
  },
  {
    clase: "Antibióticos",
    principio: "Fosfomicina",
    ejemplos: "Monurol sobres (contiene sacarosa).",
  },
];

const rows = [...baseRows];
const tableBody = document.querySelector("#drug-table tbody");
const downloadButton = document.querySelector("#download-pdf");
const downloadFilteredButton = document.querySelector("#download-pdf-filtered");
const classFilter = document.querySelector("#filter-class");
const searchFilter = document.querySelector("#filter-search");
const filterCount = document.querySelector("#filter-count");
const addForm = document.querySelector("#add-drug-form");
const formStatus = document.querySelector("#form-status");

const apiUrl = "/.netlify/functions/drugs";

const createCell = (value, field) => {
  const cell = document.createElement("td");
  cell.textContent = value;
  cell.setAttribute("contenteditable", "true");
  cell.dataset.field = field;
  return cell;
};

const getFilteredRows = () => {
  const selectedClass = classFilter.value;
  const searchValue = searchFilter.value.trim().toLowerCase();
  return rows
    .map((row, index) => ({ ...row, index }))
    .filter((row) => selectedClass === "all" || row.clase === selectedClass)
    .filter((row) => {
      if (!searchValue) {
        return true;
      }
      return [row.clase, row.principio, row.ejemplos].some((value) =>
        value.toLowerCase().includes(searchValue),
      );
    });
};

const renderTable = () => {
  const filteredRows = getFilteredRows();
  tableBody.innerHTML = "";
  filteredRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.dataset.index = row.index;
    tr.appendChild(createCell(row.clase, "clase"));
    tr.appendChild(createCell(row.principio, "principio"));
    tr.appendChild(createCell(row.ejemplos, "ejemplos"));
    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-row";
    deleteButton.textContent = "Eliminar";
    deleteButton.dataset.index = row.index;
    actionCell.appendChild(deleteButton);
    tr.appendChild(actionCell);
    tableBody.appendChild(tr);
  });
  filterCount.textContent = `Mostrando ${filteredRows.length} de ${rows.length}`;
};

const renderClassFilter = () => {
  const currentValue = classFilter.value;
  const classes = Array.from(new Set(rows.map((row) => row.clase))).sort();
  classFilter.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Todas las clases";
  classFilter.appendChild(allOption);
  classes.forEach((clase) => {
    const option = document.createElement("option");
    option.value = clase;
    option.textContent = clase;
    classFilter.appendChild(option);
  });
  classFilter.value = classes.includes(currentValue) ? currentValue : "all";
};

const createExportArea = (rowsToExport) => {
  const wrapper = document.createElement("div");
  wrapper.className = "export-area";
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";

  const table = document.createElement("table");
  table.id = "drug-table";
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Clase de fármaco</th>
      <th>Principio activo</th>
      <th>Ejemplos del documento</th>
    </tr>
  `;
  const tbody = document.createElement("tbody");
  rowsToExport.forEach((row) => {
    const tr = document.createElement("tr");
    ["clase", "principio", "ejemplos"].forEach((field) => {
      const cell = document.createElement("td");
      cell.textContent = row[field];
      tr.appendChild(cell);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.appendChild(table);
  document.body.appendChild(wrapper);
  return wrapper;
};

const downloadPdf = async (rowsToExport, filename) => {
  const exportArea = createExportArea(rowsToExport);
  const canvas = await html2canvas(exportArea, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  exportArea.remove();

  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
  const imgWidth = canvas.width * ratio;
  const imgHeight = canvas.height * ratio;
  const marginX = (pdfWidth - imgWidth) / 2;
  const marginY = 24;

  pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
  pdf.save(filename);
};

tableBody.addEventListener("input", (event) => {
  const cell = event.target.closest("td");
  const row = event.target.closest("tr");
  if (!cell || !row) {
    return;
  }
  const index = Number(row.dataset.index);
  const field = cell.dataset.field;
  if (!Number.isNaN(index) && field && rows[index]) {
    rows[index][field] = cell.textContent.trim();
    renderClassFilter();
  }
});

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-row");
  if (!button) {
    return;
  }
  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) {
    return;
  }
  handleDeleteRow(index);
});

const handleFilters = () => {
  renderTable();
};

const handleDeleteRow = async (index) => {
  const row = rows[index];
  if (!row) {
    return;
  }
  const confirmed = window.confirm("¿Quieres eliminar esta fila?");
  if (!confirmed) {
    return;
  }

  setStatus("Eliminando...");
  if (row.id) {
    try {
      const response = await fetch(`${apiUrl}?id=${row.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Delete failed.");
      }
    } catch (error) {
      setStatus("No se pudo eliminar la fila. Revisa tu función de Netlify.", true);
      return;
    }
  }

  rows.splice(index, 1);
  setStatus(row.id ? "Fila eliminada correctamente." : "Fila eliminada localmente.");
  renderClassFilter();
  renderTable();
};

const setStatus = (message, isError = false) => {
  formStatus.textContent = message;
  formStatus.style.color = isError ? "#dc2626" : "#475569";
};

const loadRowsFromDatabase = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("No se pudieron cargar los datos.");
    }
    const data = await response.json();
    data.forEach((row) => {
      rows.push({
        id: row.id,
        clase: row.clase,
        principio: row.principio,
        ejemplos: row.ejemplos || "",
      });
    });
    renderClassFilter();
    renderTable();
  } catch (error) {
    setStatus(
      "No se pudieron cargar las filas guardadas. Revisa la configuración de Supabase.",
      true,
    );
  }
};

const handleFormSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(addForm);
  const payload = {
    clase: formData.get("clase")?.trim(),
    principio: formData.get("principio")?.trim(),
    ejemplos: formData.get("ejemplos")?.trim() || "",
  };

  if (!payload.clase || !payload.principio) {
    setStatus("Completa la clase y el principio activo.", true);
    return;
  }

  setStatus("Guardando...");
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Error al guardar.");
    }
    const saved = await response.json();
    rows.push({
      id: saved.id,
      clase: saved.clase,
      principio: saved.principio,
      ejemplos: saved.ejemplos || "",
    });
    addForm.reset();
    setStatus("Fila guardada correctamente.");
    renderClassFilter();
    renderTable();
  } catch (error) {
    setStatus("No se pudo guardar la fila. Revisa tu función de Netlify.", true);
  }
};

renderClassFilter();
renderTable();
downloadButton.addEventListener("click", () =>
  downloadPdf(rows, "farmacos-ninos-diabeticos.pdf"),
);
downloadFilteredButton.addEventListener("click", () =>
  downloadPdf(getFilteredRows(), "farmacos-ninos-diabeticos-filtrado.pdf"),
);
classFilter.addEventListener("change", handleFilters);
searchFilter.addEventListener("input", handleFilters);
addForm.addEventListener("submit", handleFormSubmit);

loadRowsFromDatabase();
