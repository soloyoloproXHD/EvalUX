'use client';
import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import AppInputOut from "./inputOuside";


interface ModalProps {
    show: boolean;
    onClose: () => void;
}

export default function AppModalR({show, onClose}: ModalProps) {
    const {isOpen,onOpen} = useDisclosure();

    useEffect(() => {
        if (!show) return;
        else if (show == true){
            onOpen();
        } else {
            onClose();
        }

        
    }, [show, onOpen, onClose]);

    const handleCloseModal = () => {
        onClose();
    };

    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        correoE: '',
        contrasena: '',
        ccontrasena: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData)
        handleCloseModal()
    };

    if (!show) return null;

    return (
      <>
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={handleCloseModal}>
          <ModalContent>
              <>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-5">
                        <div >logo</div>
                        <div className="row-span-2">
                            <p className="text-center p-5">Crear Cuenta</p>
                            <div className="gap-1">
                                <AppInputOut type="text" size="md" label="Nombres" name="nombres" value={formData.nombres} onChange={handleChange}/>
                                <AppInputOut type="text" size="md" label="Apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange}/>
                                <AppInputOut type="email" size="md" label="Correo Electronico" name="correoE" value={formData.correoE} onChange={handleChange}/>
                                <AppInputOut type="password" size="md" label="Contraseña" name="contrasena" value={formData.contrasena} onChange={handleChange} isPassword={true}/>
                                <AppInputOut type="password" size="md" label="Repita Contraseña" name="ccontrasena" value={formData.ccontrasena} onChange={handleChange} isPassword={true}/>
                            </div>
                        </div>
                        <div >3</div>
                    </div>
                </ModalHeader>
                <ModalBody>
                  
                </ModalBody>
                <ModalFooter>
                  <Button onClick={handleCloseModal} color="danger" variant="light" onPress={handleCloseModal}>
                    Close
                  </Button>
                  <Button onClick={handleSubmit} color="primary" >
                    Action
                  </Button>
                </ModalFooter>
              </>
          </ModalContent>
        </Modal>
      </>
    );
  }