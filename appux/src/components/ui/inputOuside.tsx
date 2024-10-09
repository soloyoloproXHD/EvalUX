import { Input } from "@nextui-org/react"

interface InputProps {
    type: string;
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AppInputOut({type, label, name, value, onChange}: InputProps) {
    return (
        <>
            <Input key={"outside"} 
                   type={type} 
                   label={label}
                   name={name}
                   value={value}
                   onChange={onChange} 
                   labelPlacement="outside"/>
        </>
    )
}