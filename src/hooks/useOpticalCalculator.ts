import { useState, useCallback, useEffect } from 'react';
import { FieldErrors, PrescriptionValues } from '@/lib/types';
import * as C from '@/constants/index';
import {
  parseInput,
  formatNumberInput,
  formatPrescriptionResult,
  arePrescriptionsCompatible,
  isCompletePrescription,
  invertPrescriptionInput,
} from '@/lib/utils';
import { validatePrescription } from '@/lib/validation';

export const useOpticalCalculator = () => {
  // --- Estados para Inputs ---
  const [odVlEsfera, setOdVlEsfera] = useState<string>('');
  const [odVlCilindro, setOdVlCilindro] = useState<string>('');
  const [odVlEje, setOdVlEje] = useState<string>('');
  const [oiVlEsfera, setOiVlEsfera] = useState<string>('');
  const [oiVlCilindro, setOiVlCilindro] = useState<string>('');
  const [oiVlEje, setOiVlEje] = useState<string>('');
  const [odAdd, setOdAdd] = useState<string>('');
  const [oiAdd, setOiAdd] = useState<string>('');
  const [odVcEsfera, setOdVcEsfera] = useState<string>('');
  const [odVcCilindro, setOdVcCilindro] = useState<string>('');
  const [odVcEje, setOdVcEje] = useState<string>('');
  const [oiVcEsfera, setOiVcEsfera] = useState<string>('');
  const [oiVcCilindro, setOiVcCilindro] = useState<string>('');
  const [oiVcEje, setOiVcEje] = useState<string>('');

  // --- Estados para Resultados ---
  const [resultOD_PI_075, setResultOD_PI_075] = useState<string | null>(null);
  const [resultOI_PI_075, setResultOI_PI_075] = useState<string | null>(null);
  const [resultOD_PI_125, setResultOD_PI_125] = useState<string | null>(null);
  const [resultOI_PI_125, setResultOI_PI_125] = useState<string | null>(null);

  // --- Estados de Error y Feedback Visual ---
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [highlightOdAdd, setHighlightOdAdd] = useState(false);
  const [highlightOiAdd, setHighlightOiAdd] = useState(false);
  const [highlightOdVc, setHighlightOdVc] = useState(false);
  const [highlightOiVc, setHighlightOiVc] = useState(false);

  // --- Sincronización automática de CIL/EJE entre Lejos y Cerca ---
  useEffect(() => {
    // Solo sincronizar si ambos campos están vacíos al inicio (nunca sobreescribir datos ya ingresados)
    // OD
    if (
      odVcCilindro.trim() !== '' && odVlCilindro.trim() === '' && odVlCilindro === ''
    ) setOdVlCilindro(odVcCilindro);
    if (
      odVcEje.trim() !== '' && odVlEje.trim() === '' && odVlEje === ''
    ) setOdVlEje(odVcEje);
    if (
      odVlCilindro.trim() !== '' && odVcCilindro.trim() === '' && odVcCilindro === ''
    ) setOdVcCilindro(odVlCilindro);
    if (
      odVlEje.trim() !== '' && odVcEje.trim() === '' && odVcEje === ''
    ) setOdVcEje(odVlEje);
    // OI
    if (
      oiVcCilindro.trim() !== '' && oiVlCilindro.trim() === '' && oiVlCilindro === ''
    ) setOiVlCilindro(oiVcCilindro);
    if (
      oiVcEje.trim() !== '' && oiVlEje.trim() === '' && oiVlEje === ''
    ) setOiVlEje(oiVcEje);
    if (
      oiVlCilindro.trim() !== '' && oiVcCilindro.trim() === '' && oiVcCilindro === ''
    ) setOiVcCilindro(oiVlCilindro);
    if (
      oiVlEje.trim() !== '' && oiVcEje.trim() === '' && oiVcEje === ''
    ) setOiVcEje(oiVlEje);
  }, [odVcCilindro, odVcEje, odVlCilindro, odVlEje, oiVcCilindro, oiVcEje, oiVlCilindro, oiVlEje]);

  // --- Auto-cálculo de Visión Cercana (VC) cuando cambian Lejos + ADD ---
  useEffect(() => {
    const esferaVl = parseInput(odVlEsfera);
    const addVal = parseInput(odAdd);
    // No autocompletar CIL/EJE con 0.00, solo si existen en Lejos
    const cilVl = odVlCilindro.trim() !== '' ? parseInput(odVlCilindro) : null;
    const ejeVl = odVlEje.trim() !== '' ? parseInput(odVlEje) : null;
    const vlCompleto = esferaVl !== null && !isNaN(esferaVl);
    if (vlCompleto && addVal !== null && !isNaN(addVal) && addVal > 0) {
      setOdVcEsfera(formatNumberInput(esferaVl + addVal)); // Corregido: era esferaVl!
      if (cilVl !== null) setOdVcCilindro(formatNumberInput(cilVl));
      if (ejeVl !== null && cilVl !== 0) setOdVcEje(Math.round(ejeVl).toString());
      setHighlightOdVc(true);
    }
  }, [odVlEsfera, odVlCilindro, odVlEje, odAdd]);

  useEffect(() => {
    const esferaVl = parseInput(oiVlEsfera);
    const addVal = parseInput(oiAdd);
    const cilVl = oiVlCilindro.trim() !== '' ? parseInput(oiVlCilindro) : null;
    const ejeVl = oiVlEje.trim() !== '' ? parseInput(oiVlEje) : null;
    const vlCompleto = esferaVl !== null && !isNaN(esferaVl);
    if (vlCompleto && addVal !== null && !isNaN(addVal) && addVal > 0) {
      setOiVcEsfera(formatNumberInput(esferaVl + addVal)); // Corregido: era esferaVl!
      if (cilVl !== null) setOiVcCilindro(formatNumberInput(cilVl));
      if (ejeVl !== null && cilVl !== 0) setOiVcEje(Math.round(ejeVl).toString());
      setHighlightOiVc(true);
    }
  }, [oiVlEsfera, oiVlCilindro, oiVlEje, oiAdd]);

  // --- Funciones internas comunes ---
  const clearHighlights = useCallback(() => {
    setHighlightOdAdd(false);
    setHighlightOiAdd(false);
    setHighlightOdVc(false);
    setHighlightOiVc(false);
  }, []);

  const clearResultsAndErrors = useCallback(() => {
    setResultOD_PI_075(null);
    setResultOI_PI_075(null);
    setResultOD_PI_125(null);
    setResultOI_PI_125(null);
    setErrorMessages([]);
    // No limpiar fieldErrors aquí necesariamente, se limpian al interactuar
    clearHighlights();
  }, [clearHighlights]);

  // Limpia errores de un campo específico y los resultados/highlights generales
  const handleInteraction = useCallback((field: string) => {
    // Limpiar resultados y highlights al empezar a editar cualquier campo
    setResultOD_PI_075(null);
    setResultOI_PI_075(null);
    setResultOD_PI_125(null);
    setResultOI_PI_125(null);
    clearHighlights();
    setErrorMessages([]); // Limpiar errores generales también

    // Limpiar error específico del campo
    setFieldErrors(prev => {
      const copy = { ...prev };
      delete copy[field];
      // Si se edita un campo de Cerca, quitar highlight de ADD relacionado
      if (field.startsWith('odVc')) setHighlightOdAdd(false);
      if (field.startsWith('oiVc')) setHighlightOiAdd(false);
      // Si se edita un campo de ADD, quitar highlight de Cerca relacionado
      if (field === 'odAdd') setHighlightOdVc(false);
      if (field === 'oiAdd') setHighlightOiVc(false);
      // Si se edita Lejos, quitar ambos highlights relacionados
      if (field.startsWith('odVl')) { setHighlightOdAdd(false); setHighlightOdVc(false); }
      if (field.startsWith('oiVl')) { setHighlightOiAdd(false); setHighlightOiVc(false); }
      return copy;
    });
  }, [clearHighlights]);


  const handleInputChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        handleInteraction(field); // Llama a la función unificada de interacción
      },
    [handleInteraction]
  );

  const handleStepChange = useCallback(
    (
      val: string,
      setter: React.Dispatch<React.SetStateAction<string>>,
      field: string,
      step: number,
      isAxis = false
    ) => {
      const num = parseInput(val);
      const base = num === null || isNaN(num) ? 0 : num;
      let next = base + step;
      if (isAxis) {
        next = Math.round(next);
        if (next > 180) next = 1; // Eje va de 1 a 180
        if (next <= 0) next = 180;
        setter(next.toString());
      } else {
        setter(formatNumberInput(next, 2));
      }
      handleInteraction(field); // Llama a la función unificada de interacción
    },
    [handleInteraction]
  );

  // --- Invertir graduación de un ojo y distancia ---
  const invertPrescription = useCallback((eye: 'od' | 'oi', section: 'Vl' | 'Vc') => {
    // Determinar setters y valores actuales
    const isOD = eye === 'od';
    const isVL = section === 'Vl';
    // Seleccionar los setters y valores de ambos (actual y contrario)
    const current = isOD
      ? isVL
        ? { values: { esfera: odVlEsfera, cilindro: odVlCilindro, eje: odVlEje }, setters: { setEsfera: setOdVlEsfera, setCilindro: setOdVlCilindro, setEje: setOdVlEje } }
        : { values: { esfera: odVcEsfera, cilindro: odVcCilindro, eje: odVcEje }, setters: { setEsfera: setOdVcEsfera, setCilindro: setOdVcCilindro, setEje: setOdVcEje } }
      : isVL
        ? { values: { esfera: oiVlEsfera, cilindro: oiVlCilindro, eje: oiVlEje }, setters: { setEsfera: setOiVlEsfera, setCilindro: setOiVlCilindro, setEje: setOiVlEje } }
        : { values: { esfera: oiVcEsfera, cilindro: oiVcCilindro, eje: oiVcEje }, setters: { setEsfera: setOiVcEsfera, setCilindro: setOiVcCilindro, setEje: setOiVcEje } };
    const other = isOD
      ? isVL
        ? { values: { esfera: odVcEsfera, cilindro: odVcCilindro, eje: odVcEje }, setters: { setEsfera: setOdVcEsfera, setCilindro: setOdVcCilindro, setEje: setOdVcEje } }
        : { values: { esfera: odVlEsfera, cilindro: odVlCilindro, eje: odVlEje }, setters: { setEsfera: setOdVlEsfera, setCilindro: setOdVlCilindro, setEje: setOdVlEje } }
      : isVL
        ? { values: { esfera: oiVcEsfera, cilindro: oiVcCilindro, eje: oiVcEje }, setters: { setEsfera: setOiVcEsfera, setCilindro: setOiVcCilindro, setEje: setOiVcEje } }
        : { values: { esfera: oiVlEsfera, cilindro: oiVlCilindro, eje: oiVlEje }, setters: { setEsfera: setOiVlEsfera, setCilindro: setOiVlCilindro, setEje: setOiVlEje } };

    // Validar que haya CIL y EJE válidos
    const cil = current.values.cilindro.trim();
    const eje = current.values.eje.trim();
    let errorFields: string[] = [];
    if (cil === '' || cil === '0' || isNaN(Number(cil))) errorFields.push('cilindro');
    if (eje === '' || isNaN(Number(eje))) errorFields.push('eje');
    if (errorFields.length > 0) {
      // Marcar error en el campo faltante
      setFieldErrors(prev => {
        const copy = { ...prev };
        const prefix = `${eye}${section}`;
        if (errorFields.includes('cilindro')) copy[`${prefix}Cilindro`] = true;
        if (errorFields.includes('eje')) copy[`${prefix}Eje`] = true;
        return copy;
      });
      return;
    }
    // Invertir valores
    const inverted = invertPrescriptionInput(current.values);
    current.setters.setEsfera(inverted.esfera);
    current.setters.setCilindro(inverted.cilindro);
    current.setters.setEje(inverted.eje);
    // También invertir la distancia contraria si tiene datos
    if (
      other.values.cilindro.trim() !== '' &&
      other.values.eje.trim() !== '' &&
      other.values.cilindro !== '0'
    ) {
      const invertedOther = invertPrescriptionInput(other.values);
      other.setters.setEsfera(invertedOther.esfera);
      other.setters.setCilindro(invertedOther.cilindro);
      other.setters.setEje(invertedOther.eje);
    }
    // Limpiar errores de los campos de este grupo
    setFieldErrors(prev => {
      const copy = { ...prev };
      const prefix = `${eye}${section}`;
      copy[`${prefix}Cilindro`] = false;
      copy[`${prefix}Eje`] = false;
      return copy;
    });
  }, [
    odVlEsfera, odVlCilindro, odVlEje, odVcEsfera, odVcCilindro, odVcEje,
    oiVlEsfera, oiVlCilindro, oiVlEje, oiVcEsfera, oiVcCilindro, oiVcEje,
    setOdVlEsfera, setOdVlCilindro, setOdVlEje, setOdVcEsfera, setOdVcCilindro, setOdVcEje,
    setOiVlEsfera, setOiVlCilindro, setOiVlEje, setOiVcEsfera, setOiVcCilindro, setOiVcEje,
    setFieldErrors
  ]);

  // --- Cálculo ADD ---
  const handleCalculateAdd = useCallback(() => {
    clearResultsAndErrors();
    const errs: FieldErrors = {};
    const msgs: string[] = [];
    let hOdAdd = false, hOiAdd = false;
    let hOdVc = false, hOiVc = false;

    // 1. Parsear Inputs (ESF incompleto se toma como 0.00)
    const odVl: PrescriptionValues = {
      esfera: odVlEsfera.trim() !== '' ? parseInput(odVlEsfera) : 0,
      cilindro: odVlCilindro.trim() !== '' ? parseInput(odVlCilindro) : null,
      eje: odVlEje.trim() !== '' ? parseInput(odVlEje) : null
    };
    const oiVl: PrescriptionValues = {
      esfera: oiVlEsfera.trim() !== '' ? parseInput(oiVlEsfera) : 0,
      cilindro: oiVlCilindro.trim() !== '' ? parseInput(oiVlCilindro) : null,
      eje: oiVlEje.trim() !== '' ? parseInput(oiVlEje) : null
    };
    const odVc: PrescriptionValues = {
      esfera: odVcEsfera.trim() !== '' ? parseInput(odVcEsfera) : 0,
      cilindro: odVcCilindro.trim() !== '' ? parseInput(odVcCilindro) : null,
      eje: odVcEje.trim() !== '' ? parseInput(odVcEje) : null
    };
    const oiVc: PrescriptionValues = {
      esfera: oiVcEsfera.trim() !== '' ? parseInput(oiVcEsfera) : 0,
      cilindro: oiVcCilindro.trim() !== '' ? parseInput(oiVcCilindro) : null,
      eje: oiVcEje.trim() !== '' ? parseInput(oiVcEje) : null
    };

    // 2. Validar Inputs necesarios (VL y Cerca)
    const rawOdVl = { s: odVlEsfera, c: odVlCilindro, a: odVlEje };
    const rawOiVl = { s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje };
    const rawOdVc = { s: odVcEsfera, c: odVcCilindro, a: odVcEje };
    const rawOiVc = { s: oiVcEsfera, c: oiVcCilindro, a: oiVcEje };

    const validOdVl = validatePrescription(odVl, rawOdVl, 'OD Lejos', msgs, errs, true); // true = require all fields if cil exists
    const validOiVl = validatePrescription(oiVl, rawOiVl, 'OI Lejos', msgs, errs, true);
    const validOdVc = validatePrescription(odVc, rawOdVc, 'OD Cerca', msgs, errs, true);
    const validOiVc = validatePrescription(oiVc, rawOiVc, 'OI Cerca', msgs, errs, true);

    let calculatedOdAdd: number | null = null;
    let calculatedOiAdd: number | null = null;

    // 3. Calcular ADD para OD si Lejos y Cerca son válidos, completos y compatibles
    if (
      validOdVl && validOdVc &&
      odVl.esfera !== null && odVc.esfera !== null &&
      arePrescriptionsCompatible(odVl, odVc)
    ) {
      calculatedOdAdd = odVc.esfera - odVl.esfera;
      if (calculatedOdAdd <= 0 || isNaN(calculatedOdAdd)) {
        msgs.push(`OD: El valor de Cerca Esfera debe ser mayor que Lejos Esfera.`);
        errs['odVcEsfera'] = true;
        calculatedOdAdd = null;
      } else {
        hOdAdd = true;
        hOdVc = true;
      }
    } else {
      if (!validOdVl && !msgs.some(m => m.startsWith('OD Lejos'))) msgs.push('OD Lejos: Datos incompletos o inválidos.');
      if (!validOdVc && !msgs.some(m => m.startsWith('OD Cerca'))) msgs.push('OD Cerca: Datos incompletos o inválidos.');
      if (validOdVl && validOdVc && (!arePrescriptionsCompatible(odVl, odVc))) {
        msgs.push(`OD: ${C.INCOMPATIBILITY_ERROR}`);
        if (odVl.cilindro !== odVc.cilindro) errs['odVcCilindro'] = true;
        if (odVl.eje !== odVc.eje) errs['odVcEje'] = true;
      }
    }

    // 4. Calcular ADD para OI si Lejos y Cerca son válidos, completos y compatibles
    if (
      validOiVl && validOiVc &&
      oiVl.esfera !== null && oiVc.esfera !== null &&
      arePrescriptionsCompatible(oiVl, oiVc)
    ) {
      calculatedOiAdd = oiVc.esfera - oiVl.esfera;
      if (calculatedOiAdd <= 0 || isNaN(calculatedOiAdd)) {
        msgs.push(`OI: El valor de Cerca Esfera debe ser mayor que Lejos Esfera.`);
        errs['oiVcEsfera'] = true;
        calculatedOiAdd = null;
      } else {
        hOiAdd = true;
        hOiVc = true;
      }
    } else {
      if (!validOiVl && !msgs.some(m => m.startsWith('OI Lejos'))) msgs.push('OI Lejos: Datos incompletos o inválidos.');
      if (!validOiVc && !msgs.some(m => m.startsWith('OI Cerca'))) msgs.push('OI Cerca: Datos incompletos o inválidos.');
      if (validOiVl && validOiVc && (!arePrescriptionsCompatible(oiVl, oiVc))) {
        msgs.push(`OI: ${C.INCOMPATIBILITY_ERROR}`);
        if (oiVl.cilindro !== oiVc.cilindro) errs['oiVcCilindro'] = true;
        if (oiVl.eje !== oiVc.eje) errs['oiVcEje'] = true;
      }
    }

    // --- Marcar en rojo los campos relevantes si hay mensajes genéricos de datos incompletos ---
    msgs.forEach(msg => {
      if (msg.startsWith('OD Lejos: Datos incompletos')) {
        if (!validatePrescription(odVl, rawOdVl, '', [], errs, true)) {/* Mark relevant empty fields */}
      }
      if (msg.startsWith('OD Cerca: Datos incompletos')) {
        if (!validatePrescription(odVc, rawOdVc, '', [], errs, true)) {/* Mark relevant empty fields */}
      }
      if (msg.startsWith('OI Lejos: Datos incompletos')) {
        if (!validatePrescription(oiVl, rawOiVl, '', [], errs, true)) {/* Mark relevant empty fields */}
      }
      if (msg.startsWith('OI Cerca: Datos incompletos')) {
        if (!validatePrescription(oiVc, rawOiVc, '', [], errs, true)) {/* Mark relevant empty fields */}
      }
    });

    // 5. Actualizar Estados
    setOdAdd(formatNumberInput(calculatedOdAdd));
    setOiAdd(formatNumberInput(calculatedOiAdd));
    setHighlightOdAdd(hOdAdd);
    setHighlightOiAdd(hOiAdd);
    setHighlightOdVc(hOdVc); // Highlight Cerca si se usó para calcular ADD
    setHighlightOiVc(hOiVc);
    setErrorMessages(msgs);
    setFieldErrors(errs);

  }, [
    odVlEsfera, odVlCilindro, odVlEje, odVcEsfera, odVcCilindro, odVcEje,
    oiVlEsfera, oiVlCilindro, oiVlEje, oiVcEsfera, oiVcCilindro, oiVcEje,
    clearResultsAndErrors // Dependencia explícita
  ]);


  // --- Cálculo RPI ---
  const handleCalculateRpi = useCallback(() => {
    clearResultsAndErrors();
    const errs: FieldErrors = {};
    const msgs: string[] = [];
    let hOdVc = false, hOiVc = false;
    let hOdAdd = false, hOiAdd = false; // Ahora hOdAdd se puede reasignar

    // 1. Parsear todos los inputs relevantes (ESF incompleto se toma como 0.00)
    const odVl: PrescriptionValues = {
      esfera: parseInput(odVlEsfera) ?? 0,
      cilindro: parseInput(odVlCilindro),
      eje: parseInput(odVlEje)
    };
    const oiVl: PrescriptionValues = {
      esfera: parseInput(oiVlEsfera) ?? 0,
      cilindro: parseInput(oiVlCilindro),
      eje: parseInput(oiVlEje)
    };
    const odVc: PrescriptionValues = {
      esfera: parseInput(odVcEsfera) ?? 0,
      cilindro: parseInput(odVcCilindro),
      eje: parseInput(odVcEje)
    };
    const oiVc: PrescriptionValues = {
      esfera: parseInput(oiVcEsfera) ?? 0,
      cilindro: parseInput(oiVcCilindro),
      eje: parseInput(oiVcEje)
    };
    const od_add_val = parseInput(odAdd); // Ahora se usará
    const oi_add_val = parseInput(oiAdd);

    let odBaseRpi: PrescriptionValues | null = null;
    let oiBaseRpi: PrescriptionValues | null = null;
    let odSource: 'VC' | 'ADD' | null = null; // Ahora se usará para la condición
    let oiSource: 'VC' | 'ADD' | null = null;

    // --- Lógica para Ojo Derecho (OD) ---
    // Prioridad 1: Usar datos de Visión Cercana (VC) si son válidos y completos/compatibles
    const odVcEsferaVal = parseInput(odVcEsfera);
    const odVcHasEsfera = odVcEsferaVal !== null && !isNaN(odVcEsferaVal);
    const odVcHasCil = odVcCilindro.trim() !== '';
    const odVcHasEje = odVcEje.trim() !== '';
    const rawOdVc = { s: odVcEsfera, c: odVcCilindro, a: odVcEje };

    if ((odVcHasEsfera && !odVcHasCil && !odVcHasEje) || (odVcHasCil && odVcHasEje)) {
         // Caso 1: Solo esfera en VC es suficiente para intentar calcular
         if (odVcHasEsfera && !odVcHasCil && !odVcHasEje && validatePrescription({ esfera: odVcEsferaVal, cilindro: null, eje: null }, rawOdVc, 'OD Cerca (Esf)', [], errs, false)) {
            odBaseRpi = { esfera: odVcEsferaVal, cilindro: null, eje: null };
            odSource = 'VC';
            hOdVc = true;
         }
         // Caso 2: CIL y EJE presentes en VC (Esfera es opcional aquí pero debe ser válida si existe)
         else if (odVcHasCil && odVcHasEje) {
            const currentOdVc: PrescriptionValues = {
                esfera: odVcHasEsfera ? odVcEsferaVal : 0, // Default a 0 si no hay esfera explícita pero sí CIL/EJE
                cilindro: parseInput(odVcCilindro),
                eje: parseInput(odVcEje)
            };
            if (validatePrescription(currentOdVc, rawOdVc, 'OD Cerca', msgs, errs, true)) {
                 // Validar compatibilidad si Lejos también está completo
                const rawOdVl = { s: odVlEsfera, c: odVlCilindro, a: odVlEje };
                const odVlIsComplete = isCompletePrescription(odVl, rawOdVl);
                if (odVlIsComplete && validatePrescription(odVl, rawOdVl, 'OD Lejos', [], {}, true)) {
                    if (arePrescriptionsCompatible(odVl, currentOdVc)) {
                        odBaseRpi = currentOdVc;
                        odSource = 'VC';
                        hOdVc = true;
                        const implicitAdd = (currentOdVc.esfera ?? 0) - (odVl.esfera ?? 0);
                        if (implicitAdd > 0) {
                             setOdAdd(formatNumberInput(implicitAdd));
                             hOdAdd = true; // Marcar Add también si se infiere
                        } else if ((currentOdVc.esfera !== null && currentOdVc.esfera !== 0) && (odVl.esfera !== null && odVl.esfera !== 0)) {
                             msgs.push("OD: Datos de Cerca implican una ADD inválida o cero respecto a Lejos.");
                             if (currentOdVc.esfera !== null) errs['odVcEsfera'] = true;
                        }
                    } else {
                        msgs.push(`OD: ${C.INCOMPATIBILITY_ERROR} entre Lejos y Cerca.`);
                        if (odVl.cilindro !== currentOdVc.cilindro) errs['odVcCilindro'] = true;
                        if (odVl.eje !== currentOdVc.eje) errs['odVcEje'] = true;
                    }
                } else {
                    // Usar VC aunque Lejos no esté completo/válido
                    odBaseRpi = currentOdVc;
                    odSource = 'VC';
                    hOdVc = true;
                }
            }
         }
    }


    // Prioridad 2: Si no se pudo usar VC, intentar con Visión Lejana (VL) + ADD
    if (odSource === null) { // <--- ¡Aquí se usa odSource!
      const rawOdVl = { s: odVlEsfera, c: odVlCilindro, a: odVlEje };
      const odVlIsValid = validatePrescription(odVl, rawOdVl, 'OD Lejos', msgs, errs, true);
      const odAddIsValid = od_add_val !== null && !isNaN(od_add_val) && od_add_val > 0;

      if (odVlIsValid && odAddIsValid) {
        odBaseRpi = {
          esfera: (odVl.esfera ?? 0) + od_add_val, // <--- ¡Aquí se usa od_add_val!
          cilindro: odVl.cilindro,
          eje: odVl.eje
        };
        odSource = 'ADD';
        hOdAdd = true; // <--- ¡Aquí se reasigna hOdAdd!
        hOdVc = true; // Marcar VC porque se autocompletará
        // Autocompletar VC
        setOdVcEsfera(formatNumberInput(odBaseRpi.esfera));
        setOdVcCilindro(formatNumberInput(odBaseRpi.cilindro));
        setOdVcEje(odBaseRpi.eje !== null && odBaseRpi.cilindro !== 0 ? Math.round(odBaseRpi.eje).toString() : '');
      } else {
        // Si no se puede calcular ni por VC ni por VL+ADD, y VC no estaba vacío, añadir error específico
        if (odVcEsfera.trim() || odVcCilindro.trim() || odVcEje.trim()) {
             if (!msgs.some(m => m.startsWith('OD Cerca:'))) { // Evitar duplicados
                 msgs.push("OD Cerca: Datos incompletos o inválidos. Complete todos los campos de Cerca o use Lejos y ADD.");
                 validatePrescription(odVc, rawOdVc, 'OD Cerca', [], errs, true); // Para marcar campos rojos
             }
        } else { // Si VC estaba vacío, indicar qué falta de VL o ADD
             if (!odVlIsValid && !msgs.some(m => m.startsWith('OD Lejos'))) msgs.push("OD Lejos: Datos incompletos o inválidos.");
             if (!odAddIsValid && !msgs.some(m => m.startsWith('OD ADD'))) {
                 msgs.push("OD ADD: Valor inválido o ausente.");
                 // Marcar ADD en rojo solo si se intentó poner algo inválido, no si está vacío
                 if (odAdd.trim() !== '' && (od_add_val === null || isNaN(od_add_val) || od_add_val <= 0)) {
                     errs['odAdd'] = true;
                 }
             }
        }
      }
    }


    // --- Lógica para Ojo Izquierdo (OI) --- (Similar a OD, ya estaba mayormente correcta)
    const oiVcEsferaVal = parseInput(oiVcEsfera);
    const oiVcHasEsfera = oiVcEsferaVal !== null && !isNaN(oiVcEsferaVal);
    const oiVcHasCil = oiVcCilindro.trim() !== '';
    const oiVcHasEje = oiVcEje.trim() !== '';
    const rawOiVc = { s: oiVcEsfera, c: oiVcCilindro, a: oiVcEje };


    if ((oiVcHasEsfera && !oiVcHasCil && !oiVcHasEje) || (oiVcHasCil && oiVcHasEje)) {
         if (oiVcHasEsfera && !oiVcHasCil && !oiVcHasEje && validatePrescription({ esfera: oiVcEsferaVal, cilindro: null, eje: null }, rawOiVc, 'OI Cerca (Esf)', [], errs, false)) {
            oiBaseRpi = { esfera: oiVcEsferaVal, cilindro: null, eje: null };
            oiSource = 'VC';
            hOiVc = true;
         }
         else if (oiVcHasCil && oiVcHasEje) {
            const currentOiVc: PrescriptionValues = {
                esfera: oiVcHasEsfera ? oiVcEsferaVal : 0,
                cilindro: parseInput(oiVcCilindro),
                eje: parseInput(oiVcEje)
            };
             if (validatePrescription(currentOiVc, rawOiVc, 'OI Cerca', msgs, errs, true)) {
                const rawOiVl = { s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje };
                const oiVlIsComplete = isCompletePrescription(oiVl, rawOiVl);
                if (oiVlIsComplete && validatePrescription(oiVl, rawOiVl, 'OI Lejos', [], {}, true)) {
                    if (arePrescriptionsCompatible(oiVl, currentOiVc)) {
                        oiBaseRpi = currentOiVc;
                        oiSource = 'VC';
                        hOiVc = true;
                        const implicitAdd = (currentOiVc.esfera ?? 0) - (oiVl.esfera ?? 0);
                        if (implicitAdd > 0) {
                            setOiAdd(formatNumberInput(implicitAdd));
                            hOiAdd = true;
                        } else if ((currentOiVc.esfera !== null && currentOiVc.esfera !== 0) && (oiVl.esfera !== null && oiVl.esfera !== 0)) {
                            msgs.push("OI: Datos de Cerca implican una ADD inválida o cero respecto a Lejos.");
                             if (currentOiVc.esfera !== null) errs['oiVcEsfera'] = true;
                        }
                    } else {
                        msgs.push(`OI: ${C.INCOMPATIBILITY_ERROR} entre Lejos y Cerca.`);
                        if (oiVl.cilindro !== currentOiVc.cilindro) errs['oiVcCilindro'] = true;
                        if (oiVl.eje !== currentOiVc.eje) errs['oiVcEje'] = true;
                    }
                } else {
                    oiBaseRpi = currentOiVc;
                    oiSource = 'VC';
                    hOiVc = true;
                }
            }
         }
    }

    // Prioridad 2: OI con VL + ADD
    if (oiSource === null) {
      const rawOiVl = { s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje };
      const oiVlIsValid = validatePrescription(oiVl, rawOiVl, 'OI Lejos', msgs, errs, true);
      const oiAddIsValid = oi_add_val !== null && !isNaN(oi_add_val) && oi_add_val > 0;

      if (oiVlIsValid && oiAddIsValid) {
        oiBaseRpi = {
          esfera: (oiVl.esfera ?? 0) + oi_add_val,
          cilindro: oiVl.cilindro,
          eje: oiVl.eje
        };
        oiSource = 'ADD';
        hOiAdd = true;
        hOiVc = true;
        setOiVcEsfera(formatNumberInput(oiBaseRpi.esfera));
        setOiVcCilindro(formatNumberInput(oiBaseRpi.cilindro));
        setOiVcEje(oiBaseRpi.eje !== null && oiBaseRpi.cilindro !== 0 ? Math.round(oiBaseRpi.eje).toString() : '');
      } else {
        if (oiVcEsfera.trim() || oiVcCilindro.trim() || oiVcEje.trim()) {
             if (!msgs.some(m => m.startsWith('OI Cerca:'))) {
                 msgs.push("OI Cerca: Datos incompletos o inválidos. Complete todos los campos de Cerca o use Lejos y ADD.");
                 validatePrescription(oiVc, rawOiVc, 'OI Cerca', [], errs, true);
             }
        } else {
            if (!oiVlIsValid && !msgs.some(m => m.startsWith('OI Lejos'))) msgs.push("OI Lejos: Datos incompletos o inválidos.");
            if (!oiAddIsValid && !msgs.some(m => m.startsWith('OI ADD'))) {
                msgs.push("OI ADD: Valor inválido o ausente.");
                 if (oiAdd.trim() !== '' && (oi_add_val === null || isNaN(oi_add_val) || oi_add_val <= 0)) {
                     errs['oiAdd'] = true;
                 }
            }
        }
      }
    }

    // 3. Calcular RPI final si tenemos bases válidas
    let finalOdPi075: string | null = null;
    let finalOdPi125: string | null = null;
    let finalOiPi075: string | null = null;
    let finalOiPi125: string | null = null;

    if (odBaseRpi !== null && odBaseRpi.esfera !== null) { // Asegurarse que la esfera base existe
      const odPi075 = { esfera: odBaseRpi.esfera - 0.75, cilindro: odBaseRpi.cilindro, eje: odBaseRpi.eje };
      const odPi125 = { esfera: odBaseRpi.esfera - 1.25, cilindro: odBaseRpi.cilindro, eje: odBaseRpi.eje };
      finalOdPi075 = formatPrescriptionResult(odPi075);
      finalOdPi125 = formatPrescriptionResult(odPi125);
    } else if (odSource === null && !msgs.some(m => m.startsWith('OD:'))) { // Si no hay base Y no hay error específico previo
         // Solo agregar error genérico si no se reportó uno más específico antes
        msgs.push(`OD: ${C.INSUFFICIENT_DATA_RPI_ERROR}`);
    }


    if (oiBaseRpi !== null && oiBaseRpi.esfera !== null) { // Asegurarse que la esfera base existe
      const oiPi075 = { esfera: oiBaseRpi.esfera - 0.75, cilindro: oiBaseRpi.cilindro, eje: oiBaseRpi.eje };
      const oiPi125 = { esfera: oiBaseRpi.esfera - 1.25, cilindro: oiBaseRpi.cilindro, eje: oiBaseRpi.eje };
      finalOiPi075 = formatPrescriptionResult(oiPi075);
      finalOiPi125 = formatPrescriptionResult(oiPi125);
    } else if (oiSource === null && !msgs.some(m => m.startsWith('OI:'))) {
        msgs.push(`OI: ${C.INSUFFICIENT_DATA_RPI_ERROR}`);
    }


    // --- Marcar campos rojos basado en errores específicos y genéricos ---
    // (Esta lógica podría refinarse, pero mantenemos la estructura original por ahora)
     msgs.forEach(msg => {
        // Marcar campos si hay errores de datos incompletos o inválidos
        if (msg.includes('OD Lejos: Datos incompletos') || (msg.startsWith('OD:') && msg.includes(C.INSUFFICIENT_DATA_RPI_ERROR))) {
             const tempErrs: FieldErrors = {};
             validatePrescription(odVl, {s: odVlEsfera, c: odVlCilindro, a: odVlEje}, '', [], tempErrs, true);
             Object.assign(errs, tempErrs);
        }
        if (msg.includes('OI Lejos: Datos incompletos') || (msg.startsWith('OI:') && msg.includes(C.INSUFFICIENT_DATA_RPI_ERROR))) {
            const tempErrs: FieldErrors = {};
            validatePrescription(oiVl, {s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje}, '', [], tempErrs, true);
            Object.assign(errs, tempErrs);
        }
         if (msg.includes('OD Cerca: Datos incompletos') || (msg.startsWith('OD:') && msg.includes(C.INSUFFICIENT_DATA_RPI_ERROR))) {
             const tempErrs: FieldErrors = {};
             validatePrescription(odVc, {s: odVcEsfera, c: odVcCilindro, a: odVcEje}, '', [], tempErrs, true);
             Object.assign(errs, tempErrs);
        }
        if (msg.includes('OI Cerca: Datos incompletos') || (msg.startsWith('OI:') && msg.includes(C.INSUFFICIENT_DATA_RPI_ERROR))) {
            const tempErrs: FieldErrors = {};
            validatePrescription(oiVc, {s: oiVcEsfera, c: oiVcCilindro, a: oiVcEje}, '', [], tempErrs, true);
            Object.assign(errs, tempErrs);
        }
        if ((msg.includes('OD ADD: Valor inválido') || (msg.startsWith('OD:') && msg.includes(C.INSUFFICIENT_DATA_RPI_ERROR))) && odAdd.trim() === '') {
             errs['odAdd'] = true; // Marcar add vacío si es necesario para RPI
         }
        if ((msg.includes('OI ADD: Valor inválido') || (msg.startsWith('OI:') && msg.includes(C.INSUFFICIENT_DATA_RPI_ERROR))) && oiAdd.trim() === '') {
             errs['oiAdd'] = true; // Marcar add vacío si es necesario para RPI
         }
    });


    // 4. Actualizar Estados de Resultados, Errores y Highlights
    setResultOD_PI_075(finalOdPi075);
    setResultOD_PI_125(finalOdPi125);
    setResultOI_PI_075(finalOiPi075);
    setResultOI_PI_125(finalOiPi125);
    // Filtrar mensajes duplicados antes de setear
    setErrorMessages(Array.from(new Set(msgs)));
    setFieldErrors(errs);
    setHighlightOdVc(hOdVc); // Highlight basado en la fuente real o autocompletado
    setHighlightOiVc(hOiVc);
    setHighlightOdAdd(hOdAdd); // Highlight ADD si fue la fuente o inferido
    setHighlightOiAdd(hOiAdd);

  }, [
    odVlEsfera, odVlCilindro, odVlEje, odAdd, odVcEsfera, odVcCilindro, odVcEje,
    oiVlEsfera, oiVlCilindro, oiVlEje, oiAdd, oiVcEsfera, oiVcCilindro, oiVcEje,
    clearResultsAndErrors // Dependencia explícita
  ]);


  return {
    odVlEsfera, odVlCilindro, odVlEje,
    oiVlEsfera, oiVlCilindro, oiVlEje,
    odAdd, oiAdd,
    odVcEsfera, odVcCilindro, odVcEje,
    oiVcEsfera, oiVcCilindro, oiVcEje,
    setOdVlEsfera, setOdVlCilindro, setOdVlEje,
    setOiVlEsfera, setOiVlCilindro, setOiVlEje,
    setOdAdd, setOiAdd,
    setOdVcEsfera, setOdVcCilindro, setOdVcEje,
    setOiVcEsfera, setOiVcCilindro, setOiVcEje,
    handleInputChange, handleStepChange,
    resultOD_PI_075, resultOD_PI_125, resultOI_PI_075, resultOI_PI_125,
    errorMessages, fieldErrors,
    highlightOdAdd, highlightOiAdd, highlightOdVc, highlightOiVc,
    handleCalculateAdd, handleCalculateRpi,
    invertPrescription, // <-- Exponer función
  };
};
