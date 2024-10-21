import { Input } from "@nextui-org/react"
import { useMemo, useState } from "react";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";
interface InputProps {
    type: string;
    size?: "sm" | "md" | "lg";
    label: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isPassword?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
    disabled?: boolean;
}

export default function AppInputOut({ type, size, label, name, value = "", onChange, isPassword = false, disabled = false, isInvalid = false, errorMessage = "" }: InputProps) {
    const [isVisible, setIsVIsible] = useState(false);

    const toggleVisibility = () => setIsVIsible((prev) => !prev);

    //Validación del Correo
    const validateEmail = (value: string) =>
        value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

    const isEmailInvalid = useMemo(() => {
        if (type === "email" && value !== "") {
            return !validateEmail(value);
        }
        return false;
    }, [value, type]);


    return (
        <>
            <Input key={"outside"}
                type={type && isVisible ? 'text' : type}
                size={size}
                label={label}
                name={name}
                value={value !== null ? value : ''}
                disabled={disabled}
                onChange={onChange}
                labelPlacement="outside"
                isInvalid={isInvalid || isEmailInvalid}
                color={isInvalid || isEmailInvalid ? "danger" : "default"}
                errorMessage={isEmailInvalid ? "Por favor ingrese un correo válido" : errorMessage}
                endContent={isPassword && (
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                    >
                        {isVisible ? (
                            <EyeSlashFilledIcon />
                        ) : (
                            <EyeFilledIcon />
                        )}
                    </button>
                )}
            />
        </>
    )
}