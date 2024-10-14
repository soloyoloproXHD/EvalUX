'use client'
import React, { useEffect } from "react";
import { faCircleRight} from '@fortawesome/free-solid-svg-icons';
import { AdaptButton } from "@/components/AdaptButton";
import AppInputOut from "@/components/ui/inputOuside";
import { Card, CardBody, Checkbox } from "@nextui-org/react";
import { useTheme } from 'next-themes';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { motion } from "framer-motion";

const Created = () => {
    const { theme } = useTheme();
    const router = useRouter();

    const [principles, setPrinciples] = useState<{id: number, contenido: string}[]>([]);


    const [principiosData, setPrincipiosData] = useState({ //Información seleccionada para principios
        nombreR: '',
        selectedP: [] as {id: number, label: string}[]
    });

    useEffect(() => {
        axios.get('/api/getPrincipios')
        .then((response) => {
            setPrinciples(response.data.principios);
        })
        .catch((error) => {
            console.error("Error al obtener los principios: ", error);
        })
    },[])

    const [errors, setErrors] = useState({
        nombreR: ''
    });

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
        }else if (principiosData.selectedP.length === 0){
            isValid = false
        }
        setErrors(newErrors);
        return isValid;
    }
    //Manejo de principios seleccionados
    const handlePrincipleChange = (principleId: number, principleLabel: string, isChecked: boolean) => {
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
        if (validateForm()){
            sessionStorage.setItem('principiosData', JSON.stringify(principiosData));
            router.push("/rubrica/created1");
        } else {
            console.log('Información faltante')
        }
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
                            onChange={handleChange}
                            isInvalid={!!errors.nombreR}
                            errorMessage={errors.nombreR}
                        />
                    </div>
                </div>
            </div>
            <div className="max-w-full mx-auto p-4">
                <h2 className="text-xl font-bold mb-4">Seleccione los principios UX a evaluar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {principles.map((principle) => (
                        <motion.div
                            key={principle.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <Card className="w-3/4 rounded-lg shadow-lg transition duration-300 glowingborder" isHoverable={true}>
                                <CardBody className="flex justify-between px-6">
                                    <div className="flex justify-between">
                                        <p className="text-lg">{principle.contenido}</p>
                                        <Checkbox
                                            isSelected={principiosData.selectedP.some(p => p.id === principle.id)}
                                            onChange={(e) => handlePrincipleChange(principle.id, principle.contenido, e.target.checked)}
                                            color={theme === 'dark' ? 'primary' : 'success'}
                                            aria-label={`Select ${principle.contenido}`}
                                            className="ml-2"
                                            size="lg"
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Created;
