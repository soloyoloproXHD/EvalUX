'use client'
import React, { useEffect, useState } from "react";
import AdaptButton from "@/components/AdaptButton";
import { faPlus, faQuestion, faTableList } from '@fortawesome/free-solid-svg-icons';
import { Card, CardBody } from "@nextui-org/react";
import { Help } from "../../components/ui/help";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/react";

const IndexRubrica = () => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // Definir el tipo de datos que esperamos
    type Rubrica = {
        id: number;
        nombre: string;
        ruta_rubrica: string;
        usuario_id: number;
    };

    const handleCreated = () => {
        router.push("/rubrica/created");
    }

    // Estado para almacenar las rúbricas
    const [rubricas, setRubricas] = useState<Rubrica[]>([]);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');

        axios.post('/api/getRubricas', {
            userId: userId
        })
            .then((response) => {
                setRubricas(response.data); // El JSON es un array de objetos
            })
            .catch((error) => {
                console.error("Error al obtener las rúbricas: ", error);
            });
    }, []); // Ejecutar solo una vez al montar el componente


    useEffect(() => {
        axios.post('/api/getDefaultRubrica')
            .then((response) => {
                // Guardar la rúbrica por defecto en el almacenamiento local
                sessionStorage.setItem('rubricaDefault', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error al obtener la rúbrica por defecto: ", error);
            });
    }, []); 
    

    const handleDefault = () => {
        router.push("/rubrica/createdDefault");
    }
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
        <div className=" py-8 px-12">
            {/* Encabezado con el título y los botones */}
            <div className="flex justify-between items-center mb-5">
                <p className="text-2xl font-bold">Rúbricas</p>
                <div className="flex gap-x-2">
                    <AdaptButton texto="Nueva rúbrica" icon={faPlus} onPress={onOpen} />
                    <Help text='Pulse "Nueva rúbrica" para crear una rúbrica' icon={faQuestion} />
                </div>
            </div>

            {/* Mostrar contenido según si hay rúbricas o no */}
            {rubricas.length > 0 ? (
                <ul>
                    {rubricas.map((rubrica, index) => (
                        <Card key={index} className="my-4" isHoverable={true} allowTextSelectionOnPress={true}>
                            <CardBody>
                                <li className="p-2 flex justify-between items-center">
                                    <p>{rubrica.nombre}</p> {/* Mostrar el nombre de la rúbrica */}
                                    <AdaptButton texto="Ver más..." />
                                </li>
                            </CardBody>
                        </Card>
                    ))}
                </ul>
            ) : (
                <div className="flex justify-center items-center flex-col p-16">
                    <p className="text-xl">No hay rúbricas creadas</p>
                    <FontAwesomeIcon icon={faBan} className="mt-10 h-40 custom-icon" />
                </div>
            )}

            {/* Modal de selección */}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}
                size="2xl">
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Selecciona una opción</ModalHeader>
                            <ModalBody>
                                <div className="px-2 pb-2">
                                    <div className="flex items-center justify-between p-5 m-2 border border-white rounded-lg hover:bg-gray-400 hover:bg-opacity-25 transition duration-300">
                                        <div className="">
                                            <h2 className="text-lg font-semibold">Cargar Plantilla</h2>
                                            <p className="text-sm pe-6">Utiliza nuestra plantilla la cual ya engloba gran parte de las categorías mas importantes de los principios UX, siempre puedes modificarla!</p>
                                        </div>

                                        <AdaptButton texto="Cargar" icon={faTableList} onClick={handleDefault} />
                                    </div>
                                    <div className="flex items-center justify-between p-5 m-2 border border-white rounded-lg hover:bg-gray-400 hover:bg-opacity-25 transition duration-300">
                                        <div className="">
                                            <h2 className="text-lg font-semibold">Crear rubrica desde cero</h2>
                                            <p className="text-sm">Crea una rubrica a tu gusto</p>
                                        </div>

                                        <AdaptButton texto="Crear" icon={faPlus} onClick={handleCreated} />
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            
            <div className="grid place-items-center">
                {/* Mostrar contenido según si hay rúbricas o no */}
                {rubricas.length > 0 ? (
                    <motion.ul
                        className="container"
                        variants={container}
                        initial="hidden"
                        animate="visible"
                    >
                        {rubricas.map((rubrica, index) => (
                            <Card key={index} className="my-4" isHoverable={true} allowTextSelectionOnPress={true}>
                                <CardBody>
                                    <motion.li key={index} className="item p-2 flex justify-between items-center" variants={item}>
                                        <p>{rubrica.nombre}</p> {/* Mostrar el nombre de la rúbrica */}
                                        <AdaptButton texto="Ver más..." />
                                    </motion.li>
                                </CardBody>
                            </Card>
                        ))}
                    </motion.ul>
                ) : (
                    <div className="flex justify-center items-center flex-col p-16">
                        <p className="text-xl">No hay rúbricas creadas</p>
                        <FontAwesomeIcon icon={faBan} className="mt-10 h-40 custom-icon"/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IndexRubrica;
