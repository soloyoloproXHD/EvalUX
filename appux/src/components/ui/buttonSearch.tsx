import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import '../../styles/buttonSearch.css';

type ButtonSearchProps = {
    placeholder?: string;
    onChange: (value: string) => void;
    icon?: React.ReactNode;
    value?: string;
    className?: string;
};

const ButtonSearch: React.FC<ButtonSearchProps> = ({
    placeholder = "Search...",
    onChange,
    icon = <FontAwesomeIcon icon={faSearch} />,
    value = "",
    className = "",
}) => {
    const [search, setSearch] = useState(value);
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        onChange(e.target.value);
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className={`container buscarContainer ${className}`}>
            <input
                type="checkbox"
                className="checkbox buscarCheckbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            <div className="mainbox buscarMainbox">
                <div className="iconContainer buscarIconContainer">
                    {icon}
                </div>
                <input
                    className="search_input buscarInput"
                    placeholder={placeholder}
                    type="text"
                    value={search}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default ButtonSearch;
