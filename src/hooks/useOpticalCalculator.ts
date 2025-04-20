import { useState, useCallback, useEffect } from 'react';
import { FieldErrors, PrescriptionValues } from '@/lib/types';
import * as C from '@/constants/index';
import {
  parseInput,
  formatNumberInput,
  formatPrescriptionResult,
  arePrescriptionsCompatible,
  isCompletePrescription,
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
      setOdVcEsfera(formatNumberInput(esferaVl! + addVal));
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
      setOiVcEsfera(formatNumberInput(esferaVl! + addVal));
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
        if (rawOdVl.s.trim() === '') errs['odVlEsfera'] = true;
        if (rawOdVl.c.trim() === '') errs['odVlCilindro'] = true;
        if (rawOdVl.a.trim() === '') errs['odVlEje'] = true;
      }
      if (msg.startsWith('OD Cerca: Datos incompletos')) {
        if (rawOdVc.s.trim() === '') errs['odVcEsfera'] = true;
        if (rawOdVc.c.trim() === '') errs['odVcCilindro'] = true;
        if (rawOdVc.a.trim() === '') errs['odVcEje'] = true;
      }
      if (msg.startsWith('OI Lejos: Datos incompletos')) {
        if (rawOiVl.s.trim() === '') errs['oiVlEsfera'] = true;
        if (rawOiVl.c.trim() === '') errs['oiVlCilindro'] = true;
        if (rawOiVl.a.trim() === '') errs['oiVlEje'] = true;
      }
      if (msg.startsWith('OI Cerca: Datos incompletos')) {
        if (rawOiVc.s.trim() === '') errs['oiVcEsfera'] = true;
        if (rawOiVc.c.trim() === '') errs['oiVcCilindro'] = true;
        if (rawOiVc.a.trim() === '') errs['oiVcEje'] = true;
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
    let hOdAdd = false, hOiAdd = false;

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
    const od_add_val = parseInput(odAdd);
    const oi_add_val = parseInput(oiAdd);

    let odBaseRpi: PrescriptionValues | null = null;
    let oiBaseRpi: PrescriptionValues | null = null;
    let odSource: 'VC' | 'ADD' | null = null; // Para saber de dónde vino la base
    let oiSource: 'VC' | 'ADD' | null = null;

    // --- Lógica para Ojo Derecho (OD) ---
    const odVcEsferaVal = parseInput(odVcEsfera);
    const odVcHasEsfera = odVcEsferaVal !== null && !isNaN(odVcEsferaVal);
    const odVcHasCil = odVcCilindro.trim() !== '';
    const odVcHasEje = odVcEje.trim() !== '';

    if ((odVcHasEsfera && !odVcHasCil && !odVcHasEje) || (odVcHasCil && odVcHasEje)) {
      // Permitir cálculo si hay sólo esfera, o si hay CIL y EJE válidos en CERCA
      odBaseRpi = {
        esfera: odVcHasEsfera ? odVcEsferaVal! : null,
        cilindro: odVcHasCil ? parseInput(odVcCilindro) : null,
        eje: odVcHasEje ? parseInput(odVcEje) : null
      };
      odSource = 'VC';
      hOdVc = true;
    } else {
      // Lógica original (Cerca completa)
      const odVcIsComplete = isCompletePrescription(odVc, { s: odVcEsfera, c: odVcCilindro, a: odVcEje });
      if (odVcIsComplete && validatePrescription(odVc, { s: odVcEsfera, c: odVcCilindro, a: odVcEje }, 'OD Cerca', msgs, errs, true)) {
        const odVlIsComplete = isCompletePrescription(odVl, { s: odVlEsfera, c: odVlCilindro, a: odVlEje });
        if (odVlIsComplete && validatePrescription(odVl, { s: odVlEsfera, c: odVlCilindro, a: odVlEje }, 'OD Lejos', [], {}, true)) {
          if (arePrescriptionsCompatible(odVl, odVc)) {
            odBaseRpi = odVc;
            odSource = 'VC';
            hOdVc = true;
            const implicitAdd = odVc.esfera! - odVl.esfera!;
            if (implicitAdd > 0) {
              setOdAdd(formatNumberInput(implicitAdd));
            } else {
              // Solo mostrar error si ambos (LEJOS y CERCA) tienen ESFERA
              if (odVc.esfera !== null && odVl.esfera !== null) {
                msgs.push("OD: Datos de Cerca implican una ADD inválida o cero respecto a Lejos.");
              }
            }
          } else {
            msgs.push(`OD: ${C.INCOMPATIBILITY_ERROR} entre Lejos y Cerca.`);
            if (odVl.cilindro !== odVc.cilindro) errs['odVcCilindro'] = true;
            if (odVl.eje !== odVc.eje) errs['odVcEje'] = true;
          }
        } else {
          odBaseRpi = odVc;
          odSource = 'VC';
          hOdVc = true;
        }
      }
    }

    // --- Lógica para Ojo Izquierdo (OI) --- (Similar a OD)
    const oiVcEsferaVal = parseInput(oiVcEsfera);
    const oiVcHasEsfera = oiVcEsferaVal !== null && !isNaN(oiVcEsferaVal);
    const oiVcHasCil = oiVcCilindro.trim() !== '';
    const oiVcHasEje = oiVcEje.trim() !== '';

    if ((oiVcHasEsfera && !oiVcHasCil && !oiVcHasEje) || (oiVcHasCil && oiVcHasEje)) {
      // Permitir cálculo si hay sólo esfera, o si hay CIL y EJE válidos en CERCA
      oiBaseRpi = {
        esfera: oiVcHasEsfera ? oiVcEsferaVal! : null,
        cilindro: oiVcHasCil ? parseInput(oiVcCilindro) : null,
        eje: oiVcHasEje ? parseInput(oiVcEje) : null
      };
      oiSource = 'VC';
      hOiVc = true;
    } else {
      const oiVcIsComplete = isCompletePrescription(oiVc, { s: oiVcEsfera, c: oiVcCilindro, a: oiVcEje });
      if (oiVcIsComplete && validatePrescription(oiVc, { s: oiVcEsfera, c: oiVcCilindro, a: oiVcEje }, 'OI Cerca', msgs, errs, true)) {
        const oiVlIsComplete = isCompletePrescription(oiVl, { s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje });
        if (oiVlIsComplete && validatePrescription(oiVl, { s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje }, 'OI Lejos', [], {}, true)) {
          if (arePrescriptionsCompatible(oiVl, oiVc)) {
            oiBaseRpi = oiVc;
            oiSource = 'VC';
            hOiVc = true;
            const implicitAdd = oiVc.esfera! - oiVl.esfera!;
            if (implicitAdd > 0) {
              setOiAdd(formatNumberInput(implicitAdd));
            } else {
              // Solo mostrar error si ambos (LEJOS y CERCA) tienen ESFERA
              if (oiVc.esfera !== null && oiVl.esfera !== null) {
                msgs.push("OI: Datos de Cerca implican una ADD inválida o cero respecto a Lejos.");
              }
            }
          } else {
            msgs.push(`OI: ${C.INCOMPATIBILITY_ERROR} entre Lejos y Cerca.`);
            if (oiVl.cilindro !== oiVc.cilindro) errs['oiVcCilindro'] = true;
            if (oiVl.eje !== oiVc.eje) errs['oiVcEje'] = true;
          }
        } else {
          oiBaseRpi = oiVc;
          oiSource = 'VC';
          hOiVc = true;
        }
      }
    }
    if (oiSource === null) {
      const oiVlIsValid = validatePrescription(oiVl, { s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje }, 'OI Lejos', msgs, errs, true);
      const oiAddIsValid = oi_add_val !== null && !isNaN(oi_add_val) && oi_add_val > 0;

      if (oiVlIsValid && oiAddIsValid) {
        oiBaseRpi = {
          esfera: oiVl.esfera! + oi_add_val,
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
        if (!oiVcEsfera.trim() && !oiVcCilindro.trim() && !oiVcEje.trim()) {
          if (!oiVlIsValid) msgs.push("OI Lejos: Datos incompletos o inválidos.");
          if (!oiAddIsValid) {
            msgs.push("OI ADD: Valor inválido o ausente.");
            if (oiAdd.trim() !== '') errs['oiAdd'] = true;
          }
        } else {
          msgs.push("OI Cerca: Datos incompletos. Complete todos los campos de Cerca o use Lejos y ADD.");
          validatePrescription(oiVc, { s: oiVcEsfera, c: oiVcCilindro, a: oiVcEje }, 'OI Cerca', [], errs, true);
        }
      }
    }

    // 3. Calcular RPI si tenemos bases válidas
    let finalOdPi075: string | null = null;
    let finalOdPi125: string | null = null;
    let finalOiPi075: string | null = null;
    let finalOiPi125: string | null = null;

    if (odBaseRpi !== null) {
      const odPi075 = { esfera: odBaseRpi.esfera! - 0.75, cilindro: odBaseRpi.cilindro, eje: odBaseRpi.eje };
      const odPi125 = { esfera: odBaseRpi.esfera! - 1.25, cilindro: odBaseRpi.cilindro, eje: odBaseRpi.eje };
      finalOdPi075 = formatPrescriptionResult(odPi075);
      finalOdPi125 = formatPrescriptionResult(odPi125);
    } else if (!msgs.some(m => m.startsWith('OD:'))) {
      msgs.push(`OD: ${C.INSUFFICIENT_DATA_RPI_ERROR}`);
    }

    if (oiBaseRpi !== null) {
      const oiPi075 = { esfera: oiBaseRpi.esfera! - 0.75, cilindro: oiBaseRpi.cilindro, eje: oiBaseRpi.eje };
      const oiPi125 = { esfera: oiBaseRpi.esfera! - 1.25, cilindro: oiBaseRpi.cilindro, eje: oiBaseRpi.eje };
      finalOiPi075 = formatPrescriptionResult(oiPi075);
      finalOiPi125 = formatPrescriptionResult(oiPi125);
    } else if (!msgs.some(m => m.startsWith('OI:'))) {
      msgs.push(`OI: ${C.INSUFFICIENT_DATA_RPI_ERROR}`);
    }

    // --- Marcar en rojo los campos relevantes si hay mensajes genéricos de datos insuficientes ---
    msgs.forEach(msg => {
      if (msg.startsWith('OD:') && msg.includes('insuficientes')) {
        if (odVlEsfera.trim() === '') errs['odVlEsfera'] = true;
        if (odVlCilindro.trim() !== '') errs['odVlCilindro'] = true;
        if (odVlEje.trim() !== '') errs['odVlEje'] = true;
        if (odAdd.trim() === '') errs['odAdd'] = true;
        if (odVcEsfera.trim() === '') errs['odVcEsfera'] = true;
        if (odVcCilindro.trim() !== '') errs['odVcCilindro'] = true;
        if (odVcEje.trim() !== '') errs['odVcEje'] = true;
      }
      if (msg.startsWith('OI:') && msg.includes('insuficientes')) {
        if (oiVlEsfera.trim() === '') errs['oiVlEsfera'] = true;
        if (oiVlCilindro.trim() !== '') errs['oiVlCilindro'] = true;
        if (oiVlEje.trim() !== '') errs['oiVlEje'] = true;
        if (oiAdd.trim() === '') errs['oiAdd'] = true;
        if (oiVcEsfera.trim() === '') errs['oiVcEsfera'] = true;
        if (oiVcCilindro.trim() !== '') errs['oiVcCilindro'] = true;
        if (oiVcEje.trim() !== '') errs['oiVcEje'] = true;
      }
      if (msg.startsWith('OD Cerca: Datos incompletos')) {
        if (odVcEsfera.trim() === '') errs['odVcEsfera'] = true;
        if (odVcCilindro.trim() !== '') errs['odVcCilindro'] = true;
        if (odVcEje.trim() !== '') errs['odVcEje'] = true;
      }
      if (msg.startsWith('OI Cerca: Datos incompletos')) {
        if (oiVcEsfera.trim() === '') errs['oiVcEsfera'] = true;
        if (oiVcCilindro.trim() !== '') errs['oiVcCilindro'] = true;
        if (oiVcEje.trim() !== '') errs['oiVcEje'] = true;
      }
      if (msg.startsWith('OD Lejos: Datos incompletos')) {
        if (odVlEsfera.trim() === '') errs['odVlEsfera'] = true;
        if (odVlCilindro.trim() !== '') errs['odVlCilindro'] = true;
        if (odVlEje.trim() !== '') errs['odVlEje'] = true;
      }
      if (msg.startsWith('OI Lejos: Datos incompletos')) {
        if (oiVlEsfera.trim() === '') errs['oiVlEsfera'] = true;
        if (oiVlCilindro.trim() !== '') errs['oiVlCilindro'] = true;
        if (oiVlEje.trim() !== '') errs['oiVlEje'] = true;
      }
      if (msg.startsWith('OD ADD: Valor inválido') && odAdd.trim() === '') errs['odAdd'] = true;
      if (msg.startsWith('OI ADD: Valor inválido') && oiAdd.trim() === '') errs['oiAdd'] = true;
    });

    // 4. Actualizar Estados de Resultados, Errores y Highlights
    setResultOD_PI_075(finalOdPi075);
    setResultOD_PI_125(finalOdPi125);
    setResultOI_PI_075(finalOiPi075);
    setResultOI_PI_125(finalOiPi125);
    setErrorMessages(msgs);
    setFieldErrors(errs);
    setHighlightOdVc(hOdVc); // Highlight basado en la fuente real
    setHighlightOiVc(hOiVc);
    setHighlightOdAdd(hOdAdd); // Highlight ADD si fue la fuente
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
  };
};
