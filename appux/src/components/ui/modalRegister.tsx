'use client';
import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import AppInputOut from "./inputOuside";
import Image from "next/image";
import { useTheme } from 'next-themes';
import Logo from '../../../public/img/Logo.png';
import LogoW from '../../../public/img/Logo.png';


interface ModalProps {
    show: boolean;
    onClose: () => void;
}

export default function AppModalR({show, onClose}: ModalProps) {
    const {isOpen,onOpen} = useDisclosure();
    const { theme } = useTheme();

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

    const [errors, setErrors] = useState({
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

      //Quita el error al comenzar a escribir
      if (value.trim() !== ""){
        setErrors({
          ...errors,
          [name]: ""
        });
      }
    };

    const validateForm = () => {
      const newErrors = {...errors};
      let isValid = true;

      if (formData.nombres.trim() === '') {
        newErrors.nombres = "El campo de nombres no puede estar vacío";
        isValid = false;
      }
      if (formData.apellidos.trim() === '') {
        newErrors.apellidos = "El campo de apellidos no puede estar vacío";
        isValid = false;
      }
      if (formData.correoE.trim() === '') {
        newErrors.correoE = "El campo de correo no puede estar vacío";
        isValid = false;
      }
      if (formData.contrasena.trim() === '') {
        newErrors.contrasena = "El campo de contraseña no puede estar vacío";
        isValid = false;
      }
      if (formData.ccontrasena.trim() === '') {
        newErrors.ccontrasena = "El campo de repetir contraseña no puede estar vacío";
        isValid = false;
      }
  
      setErrors(newErrors);
      return isValid;

    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validateForm()) {
        handleCloseModal();
      } else {
        console.log("Formulario Inválido");
      }
    };

    if (!show) return null;

    return (
      <>
        <Modal size="xl" backdrop={"blur"} isOpen={isOpen} onClose={handleCloseModal}>
          <ModalContent>
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="grid grid-cols-2 grid-rows-2 gap-5">
                    <div className="flex place-content-center items-center gap-2 text-white">
                      <Image src={theme === 'dark' ? LogoW : Logo} alt="Logo" className='h-7 w-auto' />
                      <p className='text-lg font-semibold'>EvalUX</p>
                    </div>
                    <div className="row-span-2">
                        <p className="text-center p-5">Crear Cuenta</p>
                        <div className="gap-1">
                                <AppInputOut 
                                  type="text" 
                                  size="md" 
                                  label="Nombres" 
                                  name="nombres" 
                                  value={formData.nombres} 
                                  onChange={handleChange}
                                  isInvalid = {!!errors.nombres}
                                  errorMessage={errors.nombres}
                                />
                                <AppInputOut 
                                  type="text" 
                                  size="md" 
                                  label="Apellidos" 
                                  name="apellidos" 
                                  value={formData.apellidos} 
                                  onChange={handleChange}
                                  isInvalid = {!!errors.apellidos}
                                  errorMessage={errors.apellidos}
                                />
                                <AppInputOut 
                                  type="email" 
                                  size="md" 
                                  label="Correo Electronico" 
                                  name="correoE" 
                                  value={formData.correoE} 
                                  onChange={handleChange}
                                  isInvalid = {!!errors.correoE}
                                  errorMessage={errors.correoE}
                                />
                                <AppInputOut 
                                  type="password" 
                                  size="md" 
                                  label="Contraseña" 
                                  name="contrasena" 
                                  value={formData.contrasena} 
                                  onChange={handleChange}
                                  isInvalid = {!!errors.contrasena}
                                  errorMessage={errors.contrasena}
                                  isPassword={true}
                                />
                                <AppInputOut 
                                  type="password" 
                                  size="md" 
                                  label="Repita Contraseña" 
                                  name="ccontrasena" 
                                  value={formData.ccontrasena} 
                                  onChange={handleChange}
                                  isInvalid = {!!errors.ccontrasena}
                                  errorMessage={errors.ccontrasena}
                                  isPassword={true}
                                />
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