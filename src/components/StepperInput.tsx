import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from 'lucide-react';
import * as C from '@/constants/index';
import { StepperInputProps } from '@/lib/types';
import { cn } from '@/lib/utils'; // Asegurar importación de cn

export const StepperInput: React.FC<StepperInputProps> = ({
    id,
    label,
    value,
    placeholder,
    setter,
    fieldName,
    isAxis = false,
    handleStepChange,
    handleInputChange,
    error
}) => {
    const stepValue = isAxis ? C.AXIS_STEP : C.STEP;
    const inputType = isAxis ? "number" : "text";
    const inputMode = isAxis ? "numeric" : "decimal";
    const handleChange = handleInputChange(setter, fieldName);

    // Usar cn para combinar clases base con la clase de error condicional
    const containerClasses = cn(
        'flex items-center gap-0 rounded-md border focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-colors',
        error ? C.ERROR_BORDER_CLASS.replace('border-input', 'border') : 'border-input dark:border-gray-700/50' // Aplicar borde rojo si hay error
    );

    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
            <div className={containerClasses}>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    className="h-9 w-9 flex-shrink-0 rounded-r-none border-r dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground"
                    onClick={() => handleStepChange(value, setter, fieldName, -stepValue, isAxis)}
                    aria-label={`Disminuir ${label}`}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <Input
                    id={id}
                    type={inputType}
                    inputMode={inputMode}
                    min={isAxis ? "1" : undefined}
                    max={isAxis ? "180" : undefined}
                    step={isAxis ? "1" : "0.01"}
                    // Solo cambia el placeholder visual, no el valor real
                    placeholder={label === "Esfera" ? "Esf." : placeholder}
                    value={value}
                    onChange={handleChange}
                    className={`text-center flex-grow min-w-0 h-9 placeholder:text-muted-foreground/60 rounded-none z-10 relative focus:z-20 focus:ring-0 focus:outline-none border-none shadow-none bg-transparent`}
                    aria-invalid={error}
                    aria-describedby={error ? `${fieldName}-error` : undefined}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    className="h-9 w-9 flex-shrink-0 rounded-l-none border-l dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground"
                    onClick={() => handleStepChange(value, setter, fieldName, stepValue, isAxis)}
                    aria-label={`Aumentar ${label}`}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};