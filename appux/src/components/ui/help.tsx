import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Tooltip } from "@nextui-org/react";
import { CustomIcon } from '../../components/CustomIcon';

interface HelpProps {
    text: string; 
    icon?: IconProp;
}

export const Help: React.FC<HelpProps> = ({ icon, text }) => {
    return (
        <Tooltip
            content={
                <div className="px-1 py-2">
                    <div className="text-xs font-bold">Ayuda</div>
                    <div className="text-tiny">{text}</div>
                </div>
            }
        >
            <button className="p-1 mx-2">{icon && <CustomIcon icon={icon} />}</button>
        </Tooltip>
    );
}

export default Help;