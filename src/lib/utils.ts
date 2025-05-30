import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrescriptionValues } from './types';
import { PLACEHOLDER_DIOPTER, PLACEHOLDER_AXIS } from '@/constants/index';

// --- Standard Shadcn/UI cn function ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// --- Fin de la función cn ---

// --- Tus funciones existentes ---
export const isCompletePrescription = (p: PrescriptionValues, raw: {s: string, c: string, a: string}): boolean => {
    // Considerar ESF vacía como 0.00 para cálculos
    const hasEsfera = (raw.s.trim() !== '' || raw.s.trim() === '') && (p.esfera !== null && !isNaN(p.esfera));
    const hasCilindro = raw.c.trim() !== '' && p.cilindro !== null && !isNaN(p.cilindro) && p.cilindro !== 0;
    const hasEje = raw.a.trim() !== '' && p.eje !== null && !isNaN(p.eje);

    if (!hasEsfera) return false; // Esfera siempre necesaria (pero ahora siempre true)
    if (hasCilindro && !hasEje) return false; // Si hay cilindro distinto de 0, debe haber eje
    if (!hasCilindro && hasEje) return false; // Si no hay cilindro (o es 0), no debe haber eje
    // Considerar cilindro 0 como sin cilindro
    // Si Cilindro es 0, ignorar Eje
    return true;
};

export const parseInput = (value: string): number | null => {
    if (value === null || value.trim() === '') return 0; // Asumir 0.00 si está vacío
    const match = value.trim().match(/^[+-]?(\d+([.,]\d*)?|[.,]\d+)/);
    if (!match) return NaN;
    const sanitizedValue = match[0].replace(',', '.');
    const number = parseFloat(sanitizedValue);
    return isNaN(number) ? NaN : number;
};

export const formatNumberInput = (value: number | null | undefined, decimals = 2): string => {
    if (value === null || value === undefined || isNaN(value)) return '';
    if (Object.is(value, -0)) return (0).toFixed(decimals);
    return value.toFixed(decimals);
};

export const formatDiopterDisplay = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return PLACEHOLDER_DIOPTER;
    if (Object.is(value, -0)) value = 0;
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${Math.abs(value).toFixed(2)}`;
};

export const formatAxisDisplay = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return PLACEHOLDER_AXIS;
    return `${Math.round(value)}`;
};

export const formatPrescriptionResult = (p: PrescriptionValues): string => {
    if (p.esfera === null || isNaN(p.esfera)) return '---';
    const esf = formatDiopterDisplay(p.esfera);
    if (p.cilindro === null || isNaN(p.cilindro) || p.cilindro === 0) {
        return esf;
    }
    if (p.eje === null || isNaN(p.eje)) {
        return `${esf} ${formatDiopterDisplay(p.cilindro)} x ???`;
    }
    return `${esf} ${formatDiopterDisplay(p.cilindro)} x ${formatAxisDisplay(p.eje)}`;
};

export const arePrescriptionsCompatible = (vl: PrescriptionValues, vc: PrescriptionValues): boolean => {
    const vlCil = vl.cilindro ?? 0;
    const vcCil = vc.cilindro ?? 0;
    const vlEje = vl.eje !== null ? Math.round(vl.eje) : null;
    const vcEje = vc.eje !== null ? Math.round(vc.eje) : null;
    if (vlCil !== 0 && vcCil !== 0) {
        if (vlCil !== vcCil) return false;
        if (vlEje !== vcEje) return false;
    }
    return true;
};

// Invierte una receta óptica (inputs como string, salida como string)
export function invertPrescriptionInput(
  values: { esfera: string; cilindro: string; eje: string }
): { esfera: string; cilindro: string; eje: string } {
  // Parsear valores
  const esf = parseInput(values.esfera);
  const cil = parseInput(values.cilindro);
  const eje = parseInput(values.eje);
  // Si no hay cilindro o eje, devolver los mismos valores (la validación se hace fuera)
  if (cil === null || isNaN(cil) || cil === 0 || eje === null || isNaN(eje)) {
    return values;
  }
  // 1. Nueva esfera: esf + cil
  const newEsf = esf !== null && !isNaN(esf) ? esf + cil : cil;
  // 2. Cambiar signo del cilindro
  const newCil = -cil;
  // 3. Ajustar eje
  let newEje = eje;
  if (eje <= 90) {
    newEje = eje + 90;
  } else {
    newEje = eje - 90;
  }
  // Normalizar eje a 1-180
  if (newEje > 180) newEje -= 180;
  if (newEje <= 0) newEje += 180;
  return {
    esfera: formatNumberInput(newEsf, 2),
    cilindro: formatNumberInput(newCil, 2),
    eje: Math.round(newEje).toString(),
  };
}
