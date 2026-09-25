import React from 'react';
import { SchoolLogo } from './SchoolLogo';

interface PgriLogoProps {
  className?: string;
  size?: number;
  showBadgeBorder?: boolean;
  withWhiteBg?: boolean;
}

/**
 * School Logo Component (RA Al-Maqom)
 * Maintains backwards compatibility for existing imports while rendering
 * the official RA Al-Maqom emblem.
 */
export const PgriLogo: React.FC<PgriLogoProps> = ({ 
  className = '', 
  size = 48,
  showBadgeBorder = false,
  withWhiteBg = false,
}) => {
  return (
    <SchoolLogo
      className={className}
      size={size}
      showBadgeBorder={showBadgeBorder}
      withWhiteBg={withWhiteBg}
    />
  );
};

export default PgriLogo;
