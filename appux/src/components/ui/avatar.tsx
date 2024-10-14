import Image from 'next/image';
import  {Avatar as NextAvatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem}  from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons'

interface AvatarProps {
  src: string;
  alt: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt }) => {
  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
        <NextAvatar src={src} alt={alt} />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="logout" color="danger" className='flex justify-center items-center'>
          <FontAwesomeIcon icon={faRightFromBracket} className='hover:bounce text-white mr-2' />
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default Avatar;
