export type FieldErrors = { [key: string]: boolean; };
export type PrescriptionValues = { esfera: number | null, cilindro: number | null, eje: number | null };

// Tipo para los setters de un grupo de prescripción
export type PrescriptionSetters = {
    setEsfera: React.Dispatch<React.SetStateAction<string>>;
    setCilindro: React.Dispatch<React.SetStateAction<string>>;
    setEje: React.Dispatch<React.SetStateAction<string>>;
};

// Tipo para los valores de input de un grupo de prescripción
export type PrescriptionInputValues = {
    esfera: string;
    cilindro: string;
    eje: string;
};

// Tipo para las props del StepperInput
export interface StepperInputProps {
    id: string;
    label: string;
    value: string;
    placeholder: string;
    setter: React.Dispatch<React.SetStateAction<string>>;
    fieldName: string;
    isAxis?: boolean;
    handleStepChange: (currentValue: string, setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string, step: number, isAxis?: boolean) => void;
    handleInputChange: (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: boolean;
};

// Tipo para las props del PrescriptionInputGroup
export interface PrescriptionInputGroupProps {
    eyeLabel: string; // "Ojo Derecho (OD)" u "Ojo Izquierdo (OI)"
    eyePrefix: 'od' | 'oi';
    sectionPrefix: 'Vl' | 'Vc'; // Usar consistentemente para fieldName
    values: PrescriptionInputValues;
    setters: PrescriptionSetters;
    fieldErrors: FieldErrors;
    handleStepChange: StepperInputProps['handleStepChange'];
    handleInputChange: StepperInputProps['handleInputChange'];
    containerClass?: string; // Para aplicar clases al div contenedor (ej. highlight)
};