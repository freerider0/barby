import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { EmailProvider, EMAIL_PROVIDERS, EMAIL_CONFIG } from './config';

interface EmailProviderSelectorProps {
  value?: EmailProvider;
  onChange?: (value: EmailProvider) => void;
  disabled?: boolean;
}

export function EmailProviderSelector({
  value = EMAIL_CONFIG.defaultProvider,
  onChange,
  disabled = false
}: EmailProviderSelectorProps) {
  const handleChange = (newValue: string) => {
    onChange?.(newValue as EmailProvider);
  };

  // Filtrar solo los proveedores habilitados
  const enabledProviders = Object.entries(EMAIL_PROVIDERS)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({
      value: key,
      label: config.displayName,
      color: config.color,
      icon: config.icon
    }));

  return (
    <Select
      value={value}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar proveedor de email" />
      </SelectTrigger>
      <SelectContent>
        {enabledProviders.map((provider) => (
          <SelectItem key={provider.value} value={provider.value}>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: provider.color }}
              />
              {provider.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default EmailProviderSelector; 