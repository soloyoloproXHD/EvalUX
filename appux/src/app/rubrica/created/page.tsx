'use client'
import React from "react";
import { faCircleRight} from '@fortawesome/free-solid-svg-icons';
import { AdaptButton } from "@/components/AdaptButton";
import AppInputOut from "@/components/ui/inputOuside";
import { Card, CardBody, Checkbox } from "@nextui-org/react";
import { useTheme } from 'next-themes';
import { useState } from "react";
import { useRouter } from "next/navigation";

export const Created = () => {
    const { theme } = useTheme();
    const router = useRouter();

    const principles = [
        { id: "usability", label: "Usabilidad" },
        { id: "consistency", label: "Consistencia" },
        { id: "accessibility", label: "Accesibilidad" },
        { id: "userCentered", label: "Centrado en el usuario" },
        { id: "simplicity", label: "Simplicidad" },
    ];

    const [principiosData, setPrincipiosData] = useState({ //Información seleccionada para principios
        nombreR: '',
        selectedP: [] as {id: string, label: string}[]
    });

    //Manejo de la info del input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPrincipiosData({
            ...principiosData,
            [name]: value
        });
    };

    //Manejo de principios seleccionados
    const handlePrincipleChange = (principleId: string, principleLabel: string, isChecked: boolean) => {
        setPrincipiosData((prevState) => {
            const {selectedP} = prevState;
            if (isChecked) {
                return {
                    ...prevState,
                    selectedP: [...selectedP, {id: principleId, label: principleLabel}]
                };
            }else {
                return {
                    ...prevState,
                    selectedP: selectedP.filter(p => p.id !== principleId)
                };
            }
        });
    };

    //Envio de infomación a la siguiente pagina
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        sessionStorage.setItem('principiosData', JSON.stringify(principiosData));
        router.push("/rubrica/created1");
    };
    
    return (
        <>
            <div className="py-8 px-12">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-2xl font-bold  title">Creación de Rubrica</p>
                    <div className="flex gap-x-2 px-4">
                        <AdaptButton texto="Siguiente" icon={faCircleRight} onClick={handleSubmit}/>
                    </div>
                </div>
                <div className="flex flex-col justify-start px-6 mb-6">
                    <div className="flex font-bold justify-start items-center">
                        <p className="mb-1 text-xl"> Ingrese un nombre para su rubrica</p>
                        {/* <FontAwesomeIcon icon={faPencil} className="ml-2 mb-4" /> */}
                    </div>
                    <div className="max-w-md">
                        <AppInputOut 
                            type="text" 
                            label="Nombre de la rubrica"
                            name="nombreR" 
                            value={principiosData.nombreR} 
                            onChange={handleChange
                        }/>
                    </div>
                </div>
                <div className="max-w-full mx-auto p-4">
                    <h2 className="text-xl font-bold mb-4">Seleccione los principios UX a evaluar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 space-y-5 mt-16">
                        {principles.map((principle) => ( // Mapeo de principios UX
                            <Card key={principle.id} className="w-3/4" isHoverable={true}>
                                <CardBody className="flex justify-between px-6 my-5">
                                    <div className="flex justify-between">
                                        <p className="text-lg">{principle.label}</p>
                                        <Checkbox
                                            isSelected={principiosData.selectedP.some(p => p.id === principle.id)}
                                            onChange={(e) => handlePrincipleChange(principle.id, principle.label, e.target.checked)}
                                            color={theme === 'dark' ? 'primary' : 'success'}
                                            aria-label={`Select ${principle.label}`}
                                            className="ml-2"
                                            size="lg"
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Created;