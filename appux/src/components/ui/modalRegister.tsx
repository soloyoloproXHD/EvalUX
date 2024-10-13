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
import AppModalL from "./modalLogIn";


interface ModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AppModalR({ show, onClose }: ModalProps) {
  const [isModalLOpen, setIsModalLOpen] = useState(false);
  const { isOpen, onOpen } = useDisclosure();
  const { theme } = useTheme();

  useEffect(() => {
    if (!show) return;
    else if (show == true) {
      onOpen();
    } else {
      onClose();
    }
  }, [show, onOpen, onClose]);

  const handleCloseModal = () => {
    onClose();
  };

  const initialFormData = {
    nombres: '',
    apellidos: '',
    correoE: '',
    contrasena: '',
    ccontrasena: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //validador de estado para errores
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

  const handleOPenModalL = () => {
    setIsModalLOpen(true);
  };
  const handleCloseModalL = () => {
    setIsModalLOpen(false);
    onClose();
  };

  const validateForm = () => { //validador del formulario
    const newErrors = { ...errors };
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
    if (formData.contrasena !== formData.ccontrasena) {
      newErrors.ccontrasena = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;

  }

  //Validación del Correo
  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const handleSubmit = (e: React.FormEvent) => { //manejador del formData
    e.preventDefault();

    if (validateForm()) {
      // Validar el formato del correo electrónico
      if (!validateEmail(formData.correoE)) {
        setErrors(prev => ({
          ...prev,
          correoE: "Por favor ingrese un correo válido"
        }));
        return;
      }

      console.log(formData) //Manejar aquí el envio de los datos al backend
      setFormData(initialFormData); //Limpieza de los inputs si el formulario es valido
      handleCloseModal(); //Cerrado del modal
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
              <div className="grid grid-cols-2 grid-rows-1 gap-5">
                <div>
                  <div className="flex place-content-center items-center gap-2 mt-4 text-white">
                    <Image src={theme === 'dark' ? LogoW : Logo} alt="Logo" className='h-12 w-auto' />
                    <p className='text-2xl font-semibold'>EvalUX</p>
                  </div>
                </div>
                <div>
                  <p className="text-2xl text-center p-5">Crear Cuenta</p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 grid-rows-1 gap-5">
                <div className="flex-1 items-center place-content-center">
                  <div className="flex items-center">
                    <Divider className="max-w-14" />
                    <p className="text-center text-sm">¿Ya tienes una cuenta?</p>
                    <Divider className="max-w-14" />
                  </div>
                  <div className="flex place-content-center items-center p-5">
                    <AdaptButton icon={faArrowRightToBracket} texto="Iniciar Sesión" onClick={handleOPenModalL} />
                  </div>
                </div>
                <div>
                  <div className="gap-1">
                    <AppInputOut
                      type="text"
                      size="md"
                      label="Nombres"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      isInvalid={!!errors.nombres}
                      errorMessage={errors.nombres}
                    />
                    <AppInputOut
                      type="text"
                      size="md"
                      label="Apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      isInvalid={!!errors.apellidos}
                      errorMessage={errors.apellidos}
                    />
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
                    <AppInputOut
                      type="password"
                      size="md"
                      label="Confirmar Contraseña"
                      name="ccontrasena"
                      value={formData.ccontrasena}
                      onChange={handleChange}
                      isInvalid={!!errors.ccontrasena}
                      errorMessage={errors.ccontrasena}
                      isPassword={true}
                    />
                  </div>
                  <p className="text-sm text-center p-3">
                    Al crear una cuenta, aceptas las Condiciones de uso y el Aviso de Privacidad de EvalUX.
                  </p>
                  <div className="flex place-content-center items-center">
                    <AdaptButton icon={faUserPlus} onClick={handleSubmit} texto="Continuar" />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
          </>
        </ModalContent>
        {/*Modal de Inicio de Sesión*/}
        <AppModalL show={isModalLOpen} onClose={handleCloseModalL}/>
      </Modal>
    </>
  );
}