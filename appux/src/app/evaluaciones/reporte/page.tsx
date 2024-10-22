"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen } from "lucide-react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import AdaptButton from "@/components/AdaptButton";
import Stars from "@/components/ui/starts"; // Importar el componente Stars
import Loanding from "../loading";

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

function ReporteEvaluacion() {
  const [reporte, setReporte] = useState<DataWithUserId | null>(null);

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

        <div className="flex justify-center gap-8 items-center">
          <div>
            <p className="title font-semibold text-3xl">Descargar Reporte</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-y-4">
            <AdaptButton size='md' texto="PDF" />
            <AdaptButton size='md' texto="EXCEL" />
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
