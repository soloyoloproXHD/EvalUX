'use client'
import React, { useEffect } from "react";
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { AdaptButton } from "@/components/AdaptButton";
import AppInputOut from "@/components/ui/inputOuside";
import { Card, CardBody } from "@nextui-org/react";
//import { useTheme } from 'next-themes';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea, Listbox, ListboxItem } from "@nextui-org/react";
import axios from 'axios';

export default function EvaluarIn (){
    //const { theme } = useTheme();
    const router = useRouter();

    const [principles, setPrinciples] = useState<{ id: number; contenido: string }[]>([]);
    const [selectedR, setSelectedR] = useState<string>("");

    const [principiosData, setPrincipiosData] = useState({
        nombreR: '',
        selectedP: { id: 0, label: "" }, // Solo un principio seleccionado
    });

    useEffect(() => {
        axios.get('/api/getPrincipios')
            .then((response) => {
                setPrinciples(response.data.principios);
            })
            .catch((error) => {
                console.error("Error al obtener los principios: ", error);
            })
    }, [])

    const [errors, setErrors] = useState({ nombreR: '' });

    //Manejo de la info del input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPrincipiosData({
            ...principiosData,
            [name]: value
        });

        //Quita el error al comenzar a escribir
        if (value.trim() !== "") {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const validateForm = () => { //validador del formulario
        const newErrors = { ...errors };
        let isValid = true;

        if (principiosData.nombreR.trim() === '') {
            newErrors.nombreR = "El campo no puede estar vacío";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    }

    //Envio de infomación a la siguiente pagina
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            sessionStorage.setItem('principiosData', JSON.stringify(principiosData));
            router.push("/rubrica/created1");
        } else {
            console.log('Información faltante')
        }
    };

    // Manejo de la selección en el Listbox (solo una rúbrica)
    const handleListboxChange = (selectedR: string) => {
        const selectedItem = principles.find((p) => p.id.toString() === selectedR);
        
        if (selectedItem) {
            setSelectedR(selectedR);
            setPrincipiosData({
                ...principiosData,
                selectedP: { id: selectedItem.id, label: selectedItem.contenido },
            });
            console.log(principiosData)
        }
    };

    return (
        <>
            <div className="py-8 px-12">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-2xl font-bold  title">Evaluación</p>
                    <div className="flex gap-x-2 px-4">
                        <AdaptButton texto="Siguiente" icon={faCircleRight} onClick={handleSubmit} />
                    </div>
                </div>
                <div className="flex flex-col justify-start px-6 mb-6">
                    <div className="flex justify-start items-center">
                        <p className="mb-1 text-xl"> Información sobre el proyecto o software a evaluar.</p>
                    </div>
                    <div className="max-w-md">
                        <AppInputOut
                            type="text"
                            label="Titulo"
                            name="nombreR"
                            value={principiosData.nombreR}
                            onChange={handleChange}
                            isInvalid={!!errors.nombreR}
                            errorMessage={errors.nombreR}
                        />
                    </div>
                    <div className="max-w-md mt-5">
                        <Textarea key="bordered" variant="flat" label="Descripción" labelPlacement="outside" />
                    </div>
                </div>
                <div className="max-w-full mx-auto p-4">
                    <h2 className="text-xl font-bold mb-4">Seleccione la rúbrica con la que desea evaluar.</h2>
                    <p className="text-white">{principiosData.selectedP.label}</p>
                    <Listbox
                        aria-label="Seleccione una rúbrica"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedR} // Rúbrica seleccionada
                        onSelectionChange={(key) => handleListboxChange(key as string)} // Manejamos un solo valor
                    >
                        {principles.map((principle) => (
                            <ListboxItem
                                key={principle.id.toString()}
                                aria-label={principle.contenido}
                            >
                                <Card>
                                    <CardBody>
                                        {principle.contenido}
                                    </CardBody>
                                </Card>
                            </ListboxItem>
                        ))}
                    </Listbox>
                </div>
            </div>
        </>
    );
}