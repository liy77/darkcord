import { IconType } from "react-icons";

export interface IconProps {
  as: IconType;
  color?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export function Icon({
  as: Icon,
  color = "#787f85",
  size = 18,
  className,
  onClick,
}: IconProps) {
  return (
    <Icon onClick={onClick} className={className} color={color} size={size} />
  );
}
