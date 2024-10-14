'use client';
import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { faArrowRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Divider } from "@nextui-org/divider";
import AppInputOut from "./inputOuside";
import Image from "next/image";
import { useTheme } from 'next-themes';
import Logo from '../../../public/img/Logo.png';
import LogoW from '../../../public/img/Logo.png';
import AdaptButton from "../AdaptButton";
import AppModalR from "./modalRegister";
import { useRouter } from "next/navigation";


interface ModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AppModalL({ show, onClose }: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen } = useDisclosure();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!show) return;
    else if (show == true) {
      onOpen();
    } else {
      onClose();
    }
  }, [show, onOpen, onClose]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onClose();
  };
  const handleOPenModal = () => {
    setIsModalOpen(true);
  };


  const initialFormData = {
    correoE: '',
    contrasena: ''
  };

  const [formData, setFormData] = useState({
    correoE: '',
    contrasena: ''
  });

  const [errors, setErrors] = useState({
    correoE: '',
    contrasena: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
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

    if (formData.correoE.trim() === '') {
      newErrors.correoE = "El campo de correo no puede estar vacío";
      isValid = false;
    }
    if (formData.contrasena.trim() === '') {
      newErrors.contrasena = "El campo de contraseña no puede estar vacío";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;

  }

  //Validación del Correo
  /*const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            console.error('Error en la respuesta:', error);
            setErrors(prev => ({ ...prev, correoE: error.message }));
            throw new Error('Error en el inicio de sesión');
          });
        }
        return response.json();
      })
      .then(result => {
        console.log('Login Success:', result);
      
        const { token } = result;
        const { userId } = result;

        if (token) {
          sessionStorage.setItem('token', token);  // Guardar token en localStorage
          sessionStorage.setItem('userId', userId);  // Guardar userId en sessionStorage
          console.log('Token guardado en sessionStorage', sessionStorage.getItem('userId'));
        } else {
          console.error('Token no recibido en la respuesta');
        }
      
        handleCloseModal();  // Cerrar el modal de inicio de sesión
        setFormData(initialFormData);  // Restablecer el formulario
        window.location.href = '/rubrica'; 
        })
      .catch(error => {
        console.error('Error en el proceso de inicio de sesión:', error);
      });
    }
  };

  if (!show) return null;

  return (
    <>
      <Modal size="xl" backdrop={"blur"} isOpen={isOpen} onClose={handleCloseModal}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="grid grid-cols-1 grid-rows-1 gap-5">
                <div>
                  <div className="flex place-content-center items-center gap-2 mt-4 text-white">
                    <Image src={theme === 'dark' ? LogoW : Logo} alt="Logo" className='h-12 w-auto' />
                    <p className='text-2xl font-semibold'>EvalUX</p>
                  </div>
                </div>
                <div>
                  <p className="text-2xl text-center p-5">Iniciar Sesión</p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex justify-center items-center h-full">
                <div className="grid grid-cols-1 grid-rows-1 gap-5 max-w-xs">
                  <div className="gap-1">
                    <AppInputOut
                      type="email"
                      size="md"
                      label="Correo Electronico"
                      name="correoE"
                      value={formData.correoE}
                      onChange={handleChange}
                      isInvalid={!!errors.correoE}
                      errorMessage={errors.correoE}
                    />
                    <AppInputOut
                      type="password"
                      size="md"
                      label="Contraseña"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleChange}
                      isInvalid={!!errors.contrasena}
                      errorMessage={errors.contrasena}
                      isPassword={true}
                    />
                  </div>
                  <p className="text-sm text-center p-3">
                    Al continuar, aceptas las Condiciones de uso y el Aviso de Privacidad de EvalUX.
                  </p>
                  <div className="flex place-content-center items-center">
                    <AdaptButton icon={faArrowRightToBracket} onClick={handleSubmit} texto="Continuar" />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex-1 items-center place-content-center">
                <div className="flex place-content-center items-center">
                  <Divider className="max-w-14" />
                  <p className="text-center text-sm">¿Eres nuevo en EvalUX?</p>
                  <Divider className="max-w-14" />
                </div>
                <div className="flex place-content-center items-center p-5">
                  <AdaptButton icon={faUserPlus} texto="Crea tu cuenta de EvalUX" onClick={handleOPenModal} />
                </div>
              </div>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
      {/*Modal de Registro*/}
      <AppModalR show={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}