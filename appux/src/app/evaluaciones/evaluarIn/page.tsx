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
import { motion } from "framer-motion";

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
    const [rubricaData, setRubricaData] = useState({ titulo: '', selectedRubrica: { id: 0, nombre: "" } });
    const [selectedRubrica, setSelectedRubrica] = useState<string | null>(null);
    const [errors, setErrors] = useState({ titulo: '', selectedRubrica: '' });
    const [loading, setLoading] = useState(true); // Estado de carga
    const [textArea, setTextArea] = useState<string>('');

    useEffect(() => {
        fetchRubricas();
    }, []);

    useEffect(() => {
        const storedRubricaId = sessionStorage.getItem('idRubrica');
        if (storedRubricaId && rubricas.length > 0) {
            handleRubricaSelection(storedRubricaId);
        }
    }, [rubricas]);

    const fetchRubricas = async () => {
        setLoading(true);
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await axios.post('/api/getRubricas', { userId });
            setRubricas(response.data);
            setOriginalRubricas(response.data);
        } catch (error) {
            console.error("Error al obtener las rúbricas:", error);
        } finally {
            setLoading(false);
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
        return isError ? toast.error(message, config) : toast.success(message, config);
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextArea(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {
            titulo: rubricaData.titulo.trim() ? '' : 'El campo no puede estar vacío',
            selectedRubrica: rubricaData.selectedRubrica.id !== 0 ? '' : 'Debe seleccionar una rúbrica'
        };
        setErrors(newErrors);
        return !newErrors.titulo && !newErrors.selectedRubrica;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            sessionStorage.setItem('tituloEv', rubricaData.titulo);
            sessionStorage.setItem('descripcion', textArea);
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
        console.log(selectedKey);
        const selectedItem = rubricas.find(rubrica => rubrica.id.toString() === selectedKey);
        console.log(selectedItem);
        if (selectedItem) {
            setSelectedRubrica(selectedKey);
            setRubricaData(prevData => ({ ...prevData, selectedRubrica: selectedItem }));
            setErrors(prevErrors => ({ ...prevErrors, selectedRubrica: '' }));
        }
    };

    const container = {
        hidden: { opacity: 1, scale: 2 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.5,
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="py-8 px-12">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold title">Evaluación</h1>
                <div className="flex gap-x-2 px-6">
                    <AdaptButton size='md' texto="Cancelar" icon={faCancel} onClick={handleCancel} />
                    <AdaptButton size='md' texto="Siguiente" icon={faCircleRight} onClick={handleSubmit} />
                </div>
            </header>
            <section className="grid grid-cols-2 px-6 mb-6">
                <div className="flex flex-col justify-start w-full">
                    <p className="mb-1 text-xl">Información sobre el proyecto o software a evaluar.</p>
                    <AppInputOut
                        type="text"
                        label="Título"
                        name="titulo"
                        value={rubricaData.titulo}
                        onChange={handleInputChange}
                        isInvalid={!!errors.titulo}
                        errorMessage={errors.titulo}
                    />
                    <Textarea className="max-w-md mt-5"
                        variant="flat"
                        label="Descripción"
                        onChange={(e) => handleTextAreaChange(e as unknown as React.ChangeEvent<HTMLTextAreaElement>)}
                        labelPlacement="outside" />
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
                    <div className="flex place-content-center items-center">
                        <motion.ul
                            className="container"
                            variants={container}
                            initial="hidden"
                            animate="visible"
                        >
                            <Listbox
                                aria-label="Seleccione una rúbrica"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selectedRubrica ? [selectedRubrica] : []}
                                onSelectionChange={(key) => handleRubricaSelection(key ? Array.from(key).join('') : null)}
                            >
                                {rubricas.map((rubrica) => (
                                    <ListboxItem key={rubrica.id.toString()} aria-label={rubrica.nombre}>
                                        <Card>
                                            <motion.li key={rubrica.id} className="item p-2 flex justify-between items-center" variants={item}>
                                                <CardBody>{rubrica.nombre}</CardBody>
                                            </motion.li>
                                        </Card>
                                    </ListboxItem>
                                ))}
                            </Listbox>
                        </motion.ul>
                    </div>
                )}
            </section>
        </div>
    );
};

export default EvaluarIn;