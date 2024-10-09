import { Input } from "@nextui-org/react"
import { useState } from "react";
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
}

export default function AppInputOut({type, size, label, name, value, onChange, isPassword = false}: InputProps) {
    const [isVisible, setIsVIsible] = useState(false);

    const toggleVisibility = () => setIsVIsible((prev) => !prev);
    return (
        <>
            <Input key={"outside"} 
                   type={type && isVisible ? 'text' : type}
                   size={size}
                   label={label}
                   name={name}
                   value={value}
                   onChange={onChange} 
                   labelPlacement="outside"
                   endContent={isPassword && (
                        <button
                            type="button"
                            onClick={toggleVisibility}
                            aria-label="toggle password visibility"
                            className="focus:outline-none"
                        >
                        {isVisible ? (
                            <EyeSlashFilledIcon/>
                        ) : (
                            <EyeFilledIcon/>
                        )}
                    </button>
                )}
            />
        </>
    )
}