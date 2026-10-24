import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & { variant?: 'default' | 'outline' | 'ghost' | 'dark'; size?: 'default' | 'sm' | 'icon' };
export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  return <button className={cn('ug-button', `ug-button-${variant}`, `ug-button-${size}`, className)} {...props} />;
}
