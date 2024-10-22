"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen } from "lucide-react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import AdaptButton from "@/components/AdaptButton";
import Stars from "@/components/ui/starts"; // Importar el componente Stars
import Loanding from "../loading";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

interface Categoria {
  id: string;
  contenido: string;
}

interface Principio {
  id: number;
  label: string;
  categorias: Categoria[];
  evaluacionFinal: number | null;
}

interface DataWithUserId {
  nombreR: string;
  nombreE: string;
  descripcion: string;
  evaluacionGeneral: number;
  selectedP: Principio[];
}

interface Categoria {
  id: string;
  contenido: string;
  incognitas?: string;
  escenarios?: {
    contenido: string;
  }[];
}

interface Principio {
  id: number;
  label: string;
  evaluacionFinal: number | null;
  categorias: Categoria[];
}

function ReporteEvaluacion() {
  const [reporte, setReporte] = useState<DataWithUserId | null>(null);

  const [data, setData] = useState({
    nombreR: '',
    nombreE: '',
    descripcion: '',
    evaluacionGeneral: '',
    selectedP: [] as Principio[]
  });

  useEffect(() => {
    const data = sessionStorage.getItem('evaluaciónFinal')
    if (data) {
      const parseData = JSON.parse(data);
      setData(parseData);
    }
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "l" });
    doc.setFontSize(18);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight(); // Altura de la página

    // Agregar imagen y texto en el lado izquierdo
    const img = new Image();
    img.src = '/img/Logo.png';
    img.onload = () => {
      const imgWidth = 10;
      const imgHeight = 10;
      const imgX = 10;
      const imgY = 10;
      doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
      doc.text("EvalUX", imgX + imgWidth + 5, imgY + imgHeight / 2 + 3, { align: "left" });
      doc.text("Reporte de Evaluación: " + data.nombreE, pageWidth / 2, imgY + imgHeight + 10, { align: "center" });
      doc.text("Rúbrica: " + data.nombreR, pageWidth / 2, imgY + imgHeight + 20, { align: "center" });
      doc.setFontSize(10);

      let currentY = imgY + imgHeight + 30;
      const tableColumns = [
        "Categorías",
        "Incógnitas de evaluación",
        "Insatisfactorio (1)",
        "Satisfactorio (2)",
        "Aceptable (3)",
        "Bueno (4)",
        "Excelente (5)",
      ];

      data.selectedP.forEach((principio) => {
        doc.setFontSize(14);
        doc.text(principio.label, pageWidth / 2, currentY, { align: "center" });
        doc.setFontSize(10);

        currentY += 5;

        const tableRows: (string | number)[][] = [];
        principio.categorias.forEach((categoria) => {
          const row = [
            categoria.contenido,
            categoria.incognitas || "",
            categoria.escenarios?.[0]?.contenido || "",
            categoria.escenarios?.[1]?.contenido || "",
            categoria.escenarios?.[2]?.contenido || "",
            categoria.escenarios?.[3]?.contenido || "",
            categoria.escenarios?.[4]?.contenido || "",
          ];
          tableRows.push(row);
        });

        // Verificar si necesitamos un salto de página
        const rowsHeight = tableRows.length * 10; // Altura estimada de las filas
        if (currentY + rowsHeight > pageHeight - 20) {
          doc.addPage();
          currentY = 20; // Reiniciar la posición Y en la nueva página
        }

        // Dibujar la tabla sin repetir encabezados en el salto de página
        autoTable(doc, {
          head: [tableColumns],
          body: tableRows,
          startY: currentY,
          showHead: 'firstPage', // Muestra los encabezados solo en la primera página de cada tabla
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontSize: 12,
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle',
          },
          bodyStyles: {
            fillColor: [245, 245, 245],
            textColor: [0, 0, 0],
            fontSize: 10,
            halign: 'left',
            valign: 'middle',
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
          styles: {
            cellPadding: 4,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
          },
          theme: "grid",
          didDrawPage: (data) => {
            if (data.cursor) {
              currentY = data.cursor.y + 10;
            }
          },
        });
      });

      // Nueva página para resultados de evaluación
      doc.addPage();
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(28);
      doc.text("Resultados de Evaluación", pageWidth / 2, imgY + imgHeight + 10, { align: "center" });
      doc.setFont('Helvetica', 'normal');

      // Agregar el resultado general
      doc.setFontSize(18);
      doc.text(`Puntuación General: ${data.evaluacionGeneral} de 5`, pageWidth / 2, currentY, { align: "center" });
      //currentY += 10;
      // Agregar gráfica de barras horizontal
      drawBarChart(doc, 30);
      doc.save("Rubrica_de_EvalUX.pdf");
    };
  };

  // Función para dibujar la gráfica de barras horizontal
  const drawBarChart = (doc: jsPDF, startY: number) => {
    const barHeight = 10;
    const barSpacing = 5;
    const chartWidth = 100;
    const chartX = 125;
    const maxScore = 5; // Máxima puntuación posible

    const labels = data.selectedP.map(principio => principio.label);
    const scores = data.selectedP.map(principio => principio.evaluacionFinal);

    // Dibujar cada barra
    labels.forEach((label, index) => {
      const score = scores[index];
      if (score) {
        const barWidth = (score / maxScore) * chartWidth;

        doc.setFont('Helvetica', 'bold');
        doc.text(label, chartX - 5, startY + (barHeight + barSpacing) * index + barHeight / 2, { align: "right" });
        doc.setFont('Helvetica', 'normal');

        doc.setFillColor(41, 128, 185);
        doc.rect(chartX, startY + (barHeight + barSpacing) * index, barWidth, barHeight, 'F');

        doc.text(score.toString(), chartX + barWidth + 5, startY + (barHeight + barSpacing) * index + barHeight / 2);
      }
    });

    // Dibujar el eje x con las puntuaciones
    for (let i = 0; i <= maxScore; i++) {
      const xPos = chartX + (i / maxScore) * chartWidth;
      doc.text(i.toString(), xPos, startY + (barHeight + barSpacing) * labels.length + 5, { align: "center" });
    }
  };



  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const reporteId = sessionStorage.getItem("reporteId");
        if (!reporteId) {
          console.error("Reporte ID no encontrado en sessionStorage");
          return;
        }

        const response = await axios.post("/api/getReporte", { reporteId });
        setReporte(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error al obtener el reporte:", error);
      }
    };

    fetchReporte();
  }, []);

  if (!reporte) return <div><Loanding /></div>;

  return (
    <div className="container mx-auto p-4">
      <header className="flex flex-col mb-8">
        <p className="text-2xl font-bold">Evaluación</p>
        <div className="flex">
          <p>Reporte de evaluación: {reporte.nombreE}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 hover:scale-[102%] transition duration-300 glowingborder">
          <CardHeader>
            <h3 className="title font-semibold">Información General</h3>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between ">
              <p className="text-lg font-semibold">Puntuación final: <span className="font-semibold">{reporte.evaluacionGeneral.toFixed(1)}</span>/5 </p>
              <Stars evaluation={reporte.evaluacionGeneral} />
            </div>
            <p className="text-sm text-gray-500">Fecha: {new Date().toLocaleDateString()}</p>
          </CardBody>
        </Card>

        <div className="grid place-content-center gap-8 items-center">
          <div>
            <p className="title font-semibold text-3xl">Descargar Reporte</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-y-4">
            <AdaptButton size='md' icon={faFilePdf} onPress={handleDownloadPDF} texto="PDF" />
          </div>
        </div>
      </div>

      <Card className="mt-4 p-4 hover:scale-[102%] transition duration-300 glowingborder">
        <CardHeader className="flex items-center">
          <BookOpen className="mr-2 h-6 w-6" />
          <h3 className="title font-semibold">{reporte.nombreE}</h3>
        </CardHeader>
        <div className="grid  grid-cols-2 gap-4">
          <div className="flex-1 h-auto ">
            <p className="mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
              {reporte.descripcion}
            </p>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {reporte.selectedP.map((principio) => (
                <div key={principio.id} className="flex flex-col items-center">
                  <h3 className="font-semibold">{principio.label}</h3>
                  <div
                    className={`text-white font-bold rounded-xl p-2 w-14 h-10 flex items-center justify-center ${getScoreColor(
                      principio.evaluacionFinal
                    )}`}
                  >
                    {principio.evaluacionFinal?.toFixed(1)}/5
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>


    </div>
  );
}

function getScoreColor(score: number | null): string {
  if (score === null) return "bg-gray-600";
  if (score == 5) return "bg-green-500";
  if (score >= 4) return "bg-green-800";
  if (score >= 3) return "bg-yellow-600";
  if (score >= 2) return "bg-orange-600";
  return "bg-red-800";
}

export default ReporteEvaluacion;
