import { FieldErrors, PrescriptionValues } from './types';
import * as C from '@/constants/index'; // Importar todas las constantes

export const validatePrescription = (
    p: PrescriptionValues,
    inputs: { s: string, c: string, a: string, add?: string },
    prefix: string, // e.g., "OD Lejos"
    errors: string[], // Array para acumular mensajes de error
    fieldErrs: FieldErrors, // Objeto para marcar campos con error
    isRequired: boolean = false // Indica si la esfera de esta prescripción es requerida
): boolean => {
    let isValid = true;
    // Normalizar fieldName a camelCase consistentemente para buscar en fieldErrs
    const prefixNorm = prefix.toLowerCase().replace(/\s+/g, '');
    const esferaField = `${prefixNorm}Esfera`;
    const cilindroField = `${prefixNorm}Cilindro`;
    const ejeField = `${prefixNorm}Eje`;

    // Validar Esfera
    const hasEsferaInput = inputs.s.trim() !== '';
    const isEsferaValidNumber = (inputs.s.trim() === '' && (p.esfera === 0 || p.esfera === null)) || (p.esfera !== null && !isNaN(p.esfera));
    // Nueva validación: rango y múltiplos de 0.25
    const isEsferaInRange = p.esfera === null || (Math.abs(p.esfera) < 25);
    const isEsferaStep = p.esfera === null || Number.isInteger(Math.round((p.esfera ?? 0) * 100) % 25);

    if (hasEsferaInput && !isEsferaValidNumber) {
        errors.push(`${prefix} Esfera: ${C.NUMERIC_ERROR}`);
        fieldErrs[esferaField] = true;
        isValid = false;
    } else if (isRequired && !hasEsferaInput) {
        // Si es requerido pero está vacío, NO marcar error, tratar como 0
    } else if (isRequired && hasEsferaInput && !isEsferaValidNumber) {
        errors.push(`${prefix} Esfera: ${C.NUMERIC_ERROR}`);
        fieldErrs[esferaField] = true;
        isValid = false;
    }
    if (hasEsferaInput && isEsferaValidNumber) {
        if (!isEsferaInRange) {
            errors.push(`${prefix} Esfera: Debe ser menor a 25 o mayor a -25.`);
            fieldErrs[esferaField] = true;
            isValid = false;
        }
        if (!isEsferaStep) {
            errors.push(`${prefix} Esfera: Solo se permiten múltiplos de 0.25.`);
            fieldErrs[esferaField] = true;
            isValid = false;
        }
    }

    // Validar Cilindro y Eje
    const hasCilInput = inputs.c.trim() !== '';
    const hasEjeInput = inputs.a.trim() !== '';
    const isCilValidNumber = hasCilInput ? (p.cilindro !== null && !isNaN(p.cilindro)) : true;
    const isCilInRange = p.cilindro === null || (Math.abs(p.cilindro) < 25);
    const isCilStep = p.cilindro === null || Number.isInteger(Math.round((p.cilindro ?? 0) * 100) % 25);
    const cilValue = hasCilInput ? (p.cilindro ?? 0) : 0;

    if (hasCilInput && !isCilValidNumber) {
        errors.push(`${prefix} Cilindro: ${C.NUMERIC_ERROR}`);
        fieldErrs[cilindroField] = true;
        isValid = false;
    }
    if (hasCilInput && isCilValidNumber) {
        if (!isCilInRange) {
            errors.push(`${prefix} Cilindro: Debe ser menor a 25 o mayor a -25.`);
            fieldErrs[cilindroField] = true;
            isValid = false;
        }
        if (!isCilStep) {
            errors.push(`${prefix} Cilindro: Solo se permiten múltiplos de 0.25.`);
            fieldErrs[cilindroField] = true;
            isValid = false;
        }
    }

    const isEjeValidNumber = hasEjeInput ? (p.eje !== null && !isNaN(p.eje)) : true;
    const isEjeInRange = p.eje === null || (p.eje >= 0 && p.eje <= 180);

    if (hasEjeInput && !isEjeValidNumber) {
        errors.push(`${prefix} Eje: ${C.NUMERIC_ERROR}`);
        fieldErrs[ejeField] = true;
        isValid = false;
    }
    if (hasEjeInput && isEjeValidNumber && !isEjeInRange) {
        errors.push(`${prefix} Eje: Debe estar entre 0 y 180.`);
        fieldErrs[ejeField] = true;
        isValid = false;
    }

    // Solo si hay CIL distinto de 0, exigir EJE válido
    if (hasCilInput && isCilValidNumber && cilValue !== 0) {
        if (!hasEjeInput || !isEjeValidNumber) {
            errors.push(`${prefix} Eje: ${C.AXIS_REQUIRED_ERROR}`);
            fieldErrs[ejeField] = true;
            isValid = false;
        } else if (p.eje !== null && (p.eje <= 0 || p.eje > 180)) {
            errors.push(`${prefix} Eje: ${C.AXIS_RANGE_ERROR}`);
            fieldErrs[ejeField] = true;
            isValid = false;
        }
    }
    // Si hay EJE pero no hay CIL válido distinto de 0, marcar error
    if (hasEjeInput && (!hasCilInput || cilValue === 0)) {
        errors.push(`${prefix} Eje: ${C.AXIS_WITHOUT_CYL_ERROR}`);
        fieldErrs[ejeField] = true;
        if (hasCilInput) fieldErrs[cilindroField] = true;
        isValid = false;
    }

    // Validar ADD si existe (opcional, pero si lo usas en tu flujo)
    if ('add' in inputs && inputs.add !== undefined) {
        const addValue = parseFloat(inputs.add.replace(',', '.'));
        const isAddValid = !isNaN(addValue) && Math.abs(addValue) < 25 && Number.isInteger(Math.round(addValue * 100) % 25);
        if (inputs.add.trim() !== '' && !isAddValid) {
            errors.push(`${prefix} ADD: Solo se permiten múltiplos de 0.25 y valores menores a 25.`);
            fieldErrs[`${prefixNorm}Add`] = true;
            isValid = false;
        }
    }

    // Asegurarse que si un campo es requerido y válido pero la prescripción general no (ej. falta eje), se marque el campo requerido
    if (isRequired && !isValid && !fieldErrs[esferaField] && isEsferaValidNumber) {
         // Si la esfera era requerida y válida, pero algo más falló (ej. CIL/EJE),
         // no marcar la esfera como error de requerimiento, pero mantener isValid=false.
    }

    return isValid;
};