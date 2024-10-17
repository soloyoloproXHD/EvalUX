'use client';
import React, { useEffect, useState } from "react";
import { faCancel, faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { AdaptButton } from "@/components/AdaptButton";
import AppInputOut from "@/components/ui/inputOuside";
import { Card, CardBody, Textarea, Listbox, ListboxItem } from "@nextui-org/react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { toast } from 'react-toastify';
import ButtonSearch from "../../../components/ui/buttonSearch";

type Rubrica = {
    id: number;
    nombre: string;
    ruta_rubrica: string;
    usuario_id: number;
};

const EvaluarIn: React.FC = () => {
    const router = useRouter();
    const [rubricas, setRubricas] = useState<Rubrica[]>([]);
    const [originalRubricas, setOriginalRubricas] = useState<Rubrica[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [rubricaData, setRubricaData] = useState({ nombreR: '', selectedRubrica: { id: 0, nombre: "" } });
    const [errors, setErrors] = useState({ nombreR: '', selectedRubrica: '' });
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        fetchRubricas();
    }, []);

    const fetchRubricas = async () => {
        setLoading(true); // Comienza la carga
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await axios.post('/api/getRubricas', { userId });
            setRubricas(response.data);
            setOriginalRubricas(response.data);
        } catch (error) {
            console.error("Error al obtener las rúbricas: ", error);
        } finally {
            setLoading(false); // Termina la carga
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRubricaData(prevData => ({
            ...prevData,
            [name]: value
        }));
        if (value.trim() !== "") {
            setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
        }
    };

    const notify = (message: string, isError = false) => {
        const config = { autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark" };
        isError ? toast.error(message, config) : toast.success(message, config);
    };

    const validateForm = () => {
        const newErrors = {
            nombreR: rubricaData.nombreR.trim() ? '' : 'El campo no puede estar vacío',
            selectedRubrica: rubricaData.selectedRubrica.id !== 0 ? '' : 'Debe seleccionar una rúbrica'
        };
        setErrors(newErrors);
        return !newErrors.nombreR && !newErrors.selectedRubrica;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            sessionStorage.setItem('rubricaData', JSON.stringify(rubricaData));
            router.push("/evaluaciones/evaluarMid");
        } else {
            notify('Por favor, complete todos los campos requeridos.', true);
        }
    };

    const handleCancel = () => router.back();

    const handleSearchChange = (value: string) => {
        if (value.trim() === "") {
            setRubricas(originalRubricas);
        } else {
            const filteredRubricas = originalRubricas.filter(rubrica => rubrica.nombre.toLowerCase().includes(value.toLowerCase()));
            setRubricas(filteredRubricas);
        }
    };

    const handleRubricaSelection = (selectedKey: string | null) => {
        const selectedItem = rubricas.find(rubrica => rubrica.id.toString() === selectedKey);
        if (selectedItem) {
            setRubricaData(prevData => ({ ...prevData, selectedRubrica: selectedItem }));
            setErrors(prevErrors => ({ ...prevErrors, selectedRubrica: '' }));
        }
    };

    return (
        <div className="py-8 px-12">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold title">Evaluación</h1>
                <div className="flex gap-x-2 px-6">
                    <AdaptButton texto="Cancelar" icon={faCancel} onClick={handleCancel} />
                    <AdaptButton texto="Siguiente" icon={faCircleRight} onClick={handleSubmit} />
                </div>
            </header>
            <section className="grid grid-cols-2 px-6 mb-6">
                <div className="flex flex-col justify-start w-full">
                    <p className="mb-1 text-xl">Información sobre el proyecto o software a evaluar.</p>
                    <AppInputOut
                        type="text"
                        label="Título"
                        name="nombreR"
                        value={rubricaData.nombreR}
                        onChange={handleInputChange}
                        isInvalid={!!errors.nombreR}
                        errorMessage={errors.nombreR}
                    />
                    <Textarea className="max-w-md mt-5" variant="flat" label="Descripción" labelPlacement="outside" />
                </div>
                <div className="flex justify-start items-center w-full h-auto ml-16">
                    <Image
                        src="/img/eval1.png"
                        alt="imagen de evaluaciones"
                        width={350}
                        height={350}
                        style={{ opacity: 0.3 }}
                    />
                </div>
            </section>
            <section className="max-w-full mx-auto p-4">
                <div className="flex items-center mb-4 gap-x-5">
                    <h2 className="text-xl font-bold title">Seleccione la rúbrica con la que desea evaluar.</h2>
                    {errors.selectedRubrica && <span className="text-red-500 mt-2">{errors.selectedRubrica}</span>}
                    <ButtonSearch placeholder="Buscar..." onChange={handleSearchChange} />
                </div>
                {loading ? ( // Condición para mostrar el mensaje de carga
                    <div className="text-center text-xl">Cargando...</div>
                ) : (
                    <Listbox
                        aria-label="Seleccione una rúbrica"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedKey ? [selectedKey] : undefined}
                        onSelectionChange={(key) => handleRubricaSelection(key ? Array.from(key).join('') : null)}
                    >
                        {rubricas.map((rubrica) => (
                            <ListboxItem key={rubrica.id.toString()} aria-label={rubrica.nombre}>
                                <Card>
                                    <CardBody>{rubrica.nombre}</CardBody>
                                </Card>
                            </ListboxItem>
                        ))}
                    </Listbox>
                )}
            </section>
        </div>
    );
};

export default EvaluarIn;
