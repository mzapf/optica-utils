import React from 'react';
import { Label } from '@/components/ui/label';
import { StepperInput } from './StepperInput';
import { PrescriptionInputGroupProps } from '@/lib/types';
import * as C from '@/constants/index';
import { cn } from '@/lib/utils'; // Asegurar importación de cn

export const PrescriptionInputGroup: React.FC<PrescriptionInputGroupProps> = ({
    eyeLabel,
    eyePrefix,
    sectionPrefix,
    values,
    setters,
    fieldErrors,
    handleStepChange,
    handleInputChange,
    containerClass // Recibe la clase para highlight o normal
}) => {
    const esferaFieldName = `${eyePrefix}${sectionPrefix}Esfera`;
    const cilindroFieldName = `${eyePrefix}${sectionPrefix}Cilindro`;
    const ejeFieldName = `${eyePrefix}${sectionPrefix}Eje`;

    // Usar cn para aplicar clases base y la clase dinámica del contenedor
    const finalContainerClass = cn(
        'space-y-3 rounded-md transition-colors duration-300',
        containerClass ?? C.NORMAL_CONTAINER_CLASS // Usar clase normal por defecto si no se provee
    );


    return (
        <div className={finalContainerClass}>
            <Label className="font-medium text-base text-gray-600 dark:text-gray-400 block mb-2">
                {eyeLabel}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-4 items-start">
                <StepperInput
                    id={esferaFieldName}
                    label="Esfera"
                    value={values.esfera}
                    placeholder="Esf."
                    setter={setters.setEsfera}
                    fieldName={esferaFieldName}
                    handleStepChange={handleStepChange}
                    handleInputChange={handleInputChange}
                    error={!!fieldErrors[esferaFieldName]}
                />
                <StepperInput
                    id={cilindroFieldName}
                    label="Cilindro"
                    value={values.cilindro}
                    placeholder="Cil."
                    setter={setters.setCilindro}
                    fieldName={cilindroFieldName}
                    handleStepChange={handleStepChange}
                    handleInputChange={handleInputChange}
                    error={!!fieldErrors[cilindroFieldName]}
                />
                <StepperInput
                    id={ejeFieldName}
                    label="Eje"
                    value={values.eje}
                    placeholder="Eje"
                    setter={setters.setEje}
                    fieldName={ejeFieldName}
                    isAxis
                    handleStepChange={handleStepChange}
                    handleInputChange={handleInputChange}
                    error={!!fieldErrors[ejeFieldName]}
                />
            </div>
        </div>
    );
};