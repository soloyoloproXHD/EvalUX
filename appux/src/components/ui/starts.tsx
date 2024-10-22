import React from "react";
import '../../styles/starts.css';

interface StarsProps {
    evaluation: number; // Puntuación de 0 a 5 (puede ser decimal)
}

const Stars: React.FC<StarsProps> = ({ evaluation }) => {
    // Calcular el porcentaje de las estrellas a colorear basado en la evaluación
    const getStarClass = (starIndex: number) => {
        const filled = evaluation >= starIndex;
        const halfFilled = evaluation >= starIndex - 0.5 && evaluation < starIndex;
        return filled ? "filled" : halfFilled ? "half-filled" : "empty";
    };

    return (
        <div className="stars-rating">
            {[1, 2, 3, 4, 5].map((starIndex) => (
                <span key={starIndex} className={`star ${getStarClass(starIndex)}`}>
                    ★
                </span>
            ))}
        </div>
    );
};

export default Stars;
