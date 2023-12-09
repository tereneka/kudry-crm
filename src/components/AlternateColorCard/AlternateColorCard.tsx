import './AlternateColorCard.css';
import { ReactNode } from 'react';

interface AlternateColorCardProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export default function AlternateColorCard({
  className,
  style,
  children,
}: AlternateColorCardProps) {
  return (
    <div
      className={`alternate-color-card ${className}`}
      style={style}>
      {children}
    </div>
  );
}
