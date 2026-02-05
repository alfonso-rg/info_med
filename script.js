const rows = [
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

const tableBody = document.querySelector("#drug-table tbody");
const addRowButton = document.querySelector("#add-row");
const downloadButton = document.querySelector("#download-pdf");

const createCell = (value) => {
  const cell = document.createElement("td");
  cell.textContent = value;
  cell.setAttribute("contenteditable", "true");
  return cell;
};

const renderTable = () => {
  tableBody.innerHTML = "";
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(row.clase));
    tr.appendChild(createCell(row.principio));
    tr.appendChild(createCell(row.ejemplos));
    tableBody.appendChild(tr);
  });
};

const addEmptyRow = () => {
  const tr = document.createElement("tr");
  tr.appendChild(createCell("Nueva clase"));
  tr.appendChild(createCell("Nuevo principio activo"));
  tr.appendChild(createCell("Añade ejemplos o notas"));
  tableBody.appendChild(tr);
};

const downloadPdf = async () => {
  const exportArea = document.querySelector("#export-area");
  const canvas = await html2canvas(exportArea, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

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
  pdf.save("farmacos-ninos-diabeticos.pdf");
};

renderTable();
addRowButton.addEventListener("click", addEmptyRow);
downloadButton.addEventListener("click", downloadPdf);
