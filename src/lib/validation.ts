import { FieldErrors, PrescriptionValues } from './types';
import * as C from '@/constants/index'; // Importar todas las constantes

export const validatePrescription = (
    p: PrescriptionValues,
    inputs: { s: string, c: string, a: string },
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
    // Si el input está vacío, tratamos la esfera como 0 y válida
    const isEsferaValidNumber = (inputs.s.trim() === '' && (p.esfera === 0 || p.esfera === null)) || (p.esfera !== null && !isNaN(p.esfera));

    if (hasEsferaInput && !isEsferaValidNumber) {
        errors.push(`${prefix} Esfera: ${C.NUMERIC_ERROR}`);
        fieldErrs[esferaField] = true;
        isValid = false;
    } else if (isRequired && !hasEsferaInput) {
        // Si es requerido pero está vacío, NO marcar error, tratar como 0
        // No hacer nada, es válido
    } else if (isRequired && hasEsferaInput && !isEsferaValidNumber) {
        // Caso: requerido, con input, pero inválido
        errors.push(`${prefix} Esfera: ${C.NUMERIC_ERROR}`);
        fieldErrs[esferaField] = true;
        isValid = false;
    }

    // Validar Cilindro y Eje
    const hasCilInput = inputs.c.trim() !== '';
    const hasEjeInput = inputs.a.trim() !== '';
    const isCilValidNumber = p.cilindro !== null && !isNaN(p.cilindro);
    const isEjeValidNumber = p.eje !== null && !isNaN(p.eje);
    const cilValue = p.cilindro ?? 0; // Tratar null como 0 para lógica

    if (hasCilInput && !isCilValidNumber) {
        errors.push(`${prefix} Cilindro: ${C.NUMERIC_ERROR}`);
        fieldErrs[cilindroField] = true;
        isValid = false;
    }
    if (hasEjeInput && !isEjeValidNumber) {
        errors.push(`${prefix} Eje: ${C.NUMERIC_ERROR}`);
        fieldErrs[ejeField] = true;
        isValid = false;
    }

    if (isCilValidNumber && cilValue !== 0) {
        // Si hay cilindro válido distinto de cero, se necesita eje válido
        if (!isEjeValidNumber) {
            // Si hay input de eje O input de cilindro, el eje era esperado
            if (hasEjeInput || hasCilInput) {
                 errors.push(`${prefix} Eje: ${C.AXIS_REQUIRED_ERROR}`);
                 fieldErrs[ejeField] = true; isValid = false;
            }
        } else if (p.eje !== null && (p.eje <= 0 || p.eje > 180)) {
            // Si hay eje válido, debe estar en rango
             errors.push(`${prefix} Eje: ${C.AXIS_RANGE_ERROR}`);
             fieldErrs[ejeField] = true; isValid = false;
        }
    } else if (isEjeValidNumber) {
        // No puede haber eje válido si el cilindro es 0 o inválido/ausente
         errors.push(`${prefix} Eje: ${C.AXIS_WITHOUT_CYL_ERROR}`);
         // Marcar error en eje y potencialmente cilindro si hubo inputs
         if(hasEjeInput) fieldErrs[ejeField] = true;
         if(hasCilInput || hasEjeInput) fieldErrs[cilindroField] = true;
         isValid = false;
    }

    // Asegurarse que si un campo es requerido y válido pero la prescripción general no (ej. falta eje), se marque el campo requerido
    if (isRequired && !isValid && !fieldErrs[esferaField] && isEsferaValidNumber) {
         // Si la esfera era requerida y válida, pero algo más falló (ej. CIL/EJE),
         // no marcar la esfera como error de requerimiento, pero mantener isValid=false.
    }

    return isValid;
};