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

  // --- Auto-cálculo de Visión Cercana (VC) cuando cambian VL + ADD ---
  // Esta lógica puede entrar en conflicto si el usuario edita VC manualmente después.
  // Considera si este auto-cálculo es deseado o si debería ser más explícito.
  useEffect(() => {
    const esferaVl = parseInput(odVlEsfera);
    const addVal = parseInput(odAdd);
    const cilVl = parseInput(odVlCilindro); // Parsear cilindro
    const ejeVl = parseInput(odVlEje); // Parsear eje

    // Solo auto-calcular si VL está completo y ADD es válido
    const vlCompleto = esferaVl !== null && !isNaN(esferaVl) &&
                       (cilVl === null || isNaN(cilVl) || cilVl === 0 || (ejeVl !== null && !isNaN(ejeVl)));

    if (vlCompleto && addVal !== null && !isNaN(addVal) && addVal > 0) {
      setOdVcEsfera(formatNumberInput(esferaVl! + addVal));
      setOdVcCilindro(formatNumberInput(cilVl)); // Usar el cilindro parseado
      setOdVcEje(ejeVl !== null && !isNaN(ejeVl) && cilVl !== 0 ? Math.round(ejeVl).toString() : ''); // Solo poner eje si hay cilindro
      setHighlightOdVc(true);
    }
    // Si ADD se borra o es inválido, no necesariamente borrar VC, el usuario podría estar ingresándolo manualmente.
    // else {
    //   // Opcional: Limpiar VC si ADD se vuelve inválido? Podría ser molesto.
    //   // setOdVcEsfera(''); setOdVcCilindro(''); setOdVcEje('');
    // }
  }, [odVlEsfera, odVlCilindro, odVlEje, odAdd]);

  useEffect(() => {
    const esferaVl = parseInput(oiVlEsfera);
    const addVal = parseInput(oiAdd);
    const cilVl = parseInput(oiVlCilindro);
    const ejeVl = parseInput(oiVlEje);

    const vlCompleto = esferaVl !== null && !isNaN(esferaVl) &&
                       (cilVl === null || isNaN(cilVl) || cilVl === 0 || (ejeVl !== null && !isNaN(ejeVl)));

    if (vlCompleto && addVal !== null && !isNaN(addVal) && addVal > 0) {
      setOiVcEsfera(formatNumberInput(esferaVl! + addVal));
      setOiVcCilindro(formatNumberInput(cilVl));
      setOiVcEje(ejeVl !== null && !isNaN(ejeVl) && cilVl !== 0 ? Math.round(ejeVl).toString() : '');
      setHighlightOiVc(true);
    }
    // else {
    //   // Opcional: Limpiar VC si ADD se vuelve inválido?
    //   // setOiVcEsfera(''); setOiVcCilindro(''); setOiVcEje('');
    // }
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
      // Si se edita un campo de VC, quitar highlight de ADD relacionado
      if (field.startsWith('odVc')) setHighlightOdAdd(false);
      if (field.startsWith('oiVc')) setHighlightOiAdd(false);
      // Si se edita un campo de ADD, quitar highlight de VC relacionado
      if (field === 'odAdd') setHighlightOdVc(false);
      if (field === 'oiAdd') setHighlightOiVc(false);
      // Si se edita VL, quitar ambos highlights relacionados
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
    clearResultsAndErrors(); // Limpia resultados y errores anteriores
    const errs: FieldErrors = {};
    const msgs: string[] = [];
    let hOdAdd = false, hOiAdd = false;
    let hOdVc = false, hOiVc = false; // Para highlight de VC si se usa

    // 1. Parsear Inputs
    const odVl: PrescriptionValues = { esfera: parseInput(odVlEsfera), cilindro: parseInput(odVlCilindro), eje: parseInput(odVlEje) };
    const oiVl: PrescriptionValues = { esfera: parseInput(oiVlEsfera), cilindro: parseInput(oiVlCilindro), eje: parseInput(oiVlEje) };
    const odVc: PrescriptionValues = { esfera: parseInput(odVcEsfera), cilindro: parseInput(odVcCilindro), eje: parseInput(odVcEje) };
    const oiVc: PrescriptionValues = { esfera: parseInput(oiVcEsfera), cilindro: parseInput(oiVcCilindro), eje: parseInput(oiVcEje) };

    // 2. Validar Inputs necesarios (VL y VC)
    const rawOdVl = { s: odVlEsfera, c: odVlCilindro, a: odVlEje };
    const rawOiVl = { s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje };
    const rawOdVc = { s: odVcEsfera, c: odVcCilindro, a: odVcEje };
    const rawOiVc = { s: oiVcEsfera, c: oiVcCilindro, a: oiVcEje };

    const validOdVl = validatePrescription(odVl, rawOdVl, 'OD VL', msgs, errs, true); // true = require all fields if cil exists
    const validOiVl = validatePrescription(oiVl, rawOiVl, 'OI VL', msgs, errs, true);
    const validOdVc = validatePrescription(odVc, rawOdVc, 'OD VC', msgs, errs, true);
    const validOiVc = validatePrescription(oiVc, rawOiVc, 'OI VC', msgs, errs, true);

    let calculatedOdAdd: number | null = null;
    let calculatedOiAdd: number | null = null;

    // 3. Calcular ADD para OD si VL y VC son válidos y compatibles
    if (validOdVl && validOdVc) {
      if (arePrescriptionsCompatible(odVl, odVc)) {
        calculatedOdAdd = odVc.esfera! - odVl.esfera!;
        if (calculatedOdAdd <= 0 || isNaN(calculatedOdAdd)) {
          msgs.push(`OD: El valor de VC Esfera debe ser mayor que VL Esfera.`);
          errs['odVcEsfera'] = true; // Marcar error en VC Esfera
          calculatedOdAdd = null; // Invalidar cálculo
        } else {
          hOdAdd = true; // Marcar para highlight
          hOdVc = true; // Marcar VC como fuente
        }
      } else {
        msgs.push(`OD: ${C.INCOMPATIBILITY_ERROR}`);
        // Marcar errores en los campos que no coinciden (Cil y Eje de VC)
        if (odVl.cilindro !== odVc.cilindro) errs['odVcCilindro'] = true;
        if (odVl.eje !== odVc.eje) errs['odVcEje'] = true;
      }
    } else {
        // Si alguna validación falló, añadir mensaje genérico si no hay específicos
        if (!validOdVl && !msgs.some(m => m.startsWith('OD VL'))) msgs.push('OD VL: Datos incompletos o inválidos.');
        if (!validOdVc && !msgs.some(m => m.startsWith('OD VC'))) msgs.push('OD VC: Datos incompletos o inválidos.');
    }

    // 4. Calcular ADD para OI si VL y VC son válidos y compatibles
    if (validOiVl && validOiVc) {
      if (arePrescriptionsCompatible(oiVl, oiVc)) {
        calculatedOiAdd = oiVc.esfera! - oiVl.esfera!;
        if (calculatedOiAdd <= 0 || isNaN(calculatedOiAdd)) {
          msgs.push(`OI: El valor de VC Esfera debe ser mayor que VL Esfera.`);
          errs['oiVcEsfera'] = true;
          calculatedOiAdd = null;
        } else {
          hOiAdd = true;
          hOiVc = true;
        }
      } else {
        msgs.push(`OI: ${C.INCOMPATIBILITY_ERROR}`);
        if (oiVl.cilindro !== oiVc.cilindro) errs['oiVcCilindro'] = true;
        if (oiVl.eje !== oiVc.eje) errs['oiVcEje'] = true;
      }
    } else {
        if (!validOiVl && !msgs.some(m => m.startsWith('OI VL'))) msgs.push('OI VL: Datos incompletos o inválidos.');
        if (!validOiVc && !msgs.some(m => m.startsWith('OI VC'))) msgs.push('OI VC: Datos incompletos o inválidos.');
    }

    // 5. Actualizar Estados
    setOdAdd(formatNumberInput(calculatedOdAdd));
    setOiAdd(formatNumberInput(calculatedOiAdd));
    setHighlightOdAdd(hOdAdd);
    setHighlightOiAdd(hOiAdd);
    setHighlightOdVc(hOdVc); // Highlight VC si se usó para calcular ADD
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
    let hOdVc = false, hOiVc = false; // Para highlight de la fuente usada (VC o ADD->VC)
    let hOdAdd = false, hOiAdd = false; // Para highlight si se usa ADD

    // 1. Parsear todos los inputs relevantes
    const odVl: PrescriptionValues = { esfera: parseInput(odVlEsfera), cilindro: parseInput(odVlCilindro), eje: parseInput(odVlEje) };
    const oiVl: PrescriptionValues = { esfera: parseInput(oiVlEsfera), cilindro: parseInput(oiVlCilindro), eje: parseInput(oiVlEje) };
    const odVc: PrescriptionValues = { esfera: parseInput(odVcEsfera), cilindro: parseInput(odVcCilindro), eje: parseInput(odVcEje) };
    const oiVc: PrescriptionValues = { esfera: parseInput(oiVcEsfera), cilindro: parseInput(oiVcCilindro), eje: parseInput(oiVcEje) };
    const od_add_val = parseInput(odAdd);
    const oi_add_val = parseInput(oiAdd);

    // Inputs raw para validación y chequeo de completitud
    const rawOdVl = { s: odVlEsfera, c: odVlCilindro, a: odVlEje };
    const rawOiVl = { s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje };
    const rawOdVc = { s: odVcEsfera, c: odVcCilindro, a: odVcEje };
    const rawOiVc = { s: oiVcEsfera, c: oiVcCilindro, a: oiVcEje };

    let odBaseRpi: PrescriptionValues | null = null;
    let oiBaseRpi: PrescriptionValues | null = null;
    let odSource: 'VC' | 'ADD' | null = null; // Para saber de dónde vino la base
    let oiSource: 'VC' | 'ADD' | null = null;

    // --- Lógica para Ojo Derecho (OD) ---
    // Prioridad 1: Usar VC si está completo y es válido
    const odVcIsComplete = isCompletePrescription(odVc, rawOdVc);
    if (odVcIsComplete && validatePrescription(odVc, rawOdVc, 'OD VC', msgs, errs, true)) {
       // Verificar compatibilidad con VL si VL también está completo
       const odVlIsComplete = isCompletePrescription(odVl, rawOdVl);
       if (odVlIsComplete && validatePrescription(odVl, rawOdVl, 'OD VL', [], {}, true)) { // Validar VL sin añadir errores globales aún
           if (arePrescriptionsCompatible(odVl, odVc)) {
               odBaseRpi = odVc;
               odSource = 'VC';
               hOdVc = true; // Highlight VC como fuente directa
               // Opcional: Recalcular y actualizar ADD para consistencia
               const implicitAdd = odVc.esfera! - odVl.esfera!;
               if (implicitAdd > 0) {
                   setOdAdd(formatNumberInput(implicitAdd));
                   // No poner highlight en ADD aquí, la fuente fue VC
               } else {
                   // Si la ADD implícita es inválida, podría ser un error, pero seguimos con VC
                   msgs.push("OD: Datos de VC implican una ADD inválida o cero respecto a VL.");
                   // Considerar si invalidar odBaseRpi aquí o solo advertir
               }
           } else {
               msgs.push(`OD: ${C.INCOMPATIBILITY_ERROR} entre VL y VC.`);
               if (odVl.cilindro !== odVc.cilindro) errs['odVcCilindro'] = true;
               if (odVl.eje !== odVc.eje) errs['odVcEje'] = true;
               // No se puede proceder con OD si son incompatibles
           }
       } else {
           // Si VL no está completo, no podemos verificar compatibilidad, pero podemos usar VC si es válido por sí mismo.
           odBaseRpi = odVc;
           odSource = 'VC';
           hOdVc = true;
           // No podemos calcular ADD implícita sin VL completo.
       }
    }
    // Prioridad 2: Si VC no se usó, intentar usar VL + ADD
    else if (odSource === null) {
        const odVlIsValid = validatePrescription(odVl, rawOdVl, 'OD VL', msgs, errs, true);
        const odAddIsValid = od_add_val !== null && !isNaN(od_add_val) && od_add_val > 0;

        if (odVlIsValid && odAddIsValid) {
            // Calcular VC teórico desde VL + ADD
            odBaseRpi = {
                esfera: odVl.esfera! + od_add_val,
                cilindro: odVl.cilindro,
                eje: odVl.eje
            };
            odSource = 'ADD';
            hOdAdd = true; // Highlight ADD como fuente
            hOdVc = true; // Highlight VC porque es el resultado implícito
            // Actualizar campos VC para reflejar VL+ADD
            setOdVcEsfera(formatNumberInput(odBaseRpi.esfera));
            setOdVcCilindro(formatNumberInput(odBaseRpi.cilindro));
            setOdVcEje(odBaseRpi.eje !== null && odBaseRpi.cilindro !== 0 ? Math.round(odBaseRpi.eje).toString() : '');
        } else {
            // No se pudo usar ni VC ni VL+ADD
            if (!odVcIsComplete && rawOdVc.s.trim() === '' && rawOdVc.c.trim() === '' && rawOdVc.a.trim() === '') {
                 // Si VC está vacío, el error es falta de ADD o VL
                 if (!odVlIsValid) msgs.push("OD VL: Datos incompletos o inválidos.");
                 if (!odAddIsValid) {
                    msgs.push("OD ADD: Valor inválido o ausente.");
                    if (odAdd.trim() !== '') errs['odAdd'] = true; // Marcar error si hay algo pero es inválido
                 }
            } else if (odVcIsComplete) {
                // VC estaba completo pero falló la validación o compatibilidad (ya gestionado arriba)
            } else {
                // VC tiene datos pero está incompleto
                msgs.push("OD VC: Datos incompletos. Complete todos los campos de VC o use VL y ADD.");
                validatePrescription(odVc, rawOdVc, 'OD VC', [], errs, true); // Marcar campos erróneos en VC
            }
        }
    }

    // --- Lógica para Ojo Izquierdo (OI) --- (Similar a OD)
    const oiVcIsComplete = isCompletePrescription(oiVc, rawOiVc);
    if (oiVcIsComplete && validatePrescription(oiVc, rawOiVc, 'OI VC', msgs, errs, true)) {
        const oiVlIsComplete = isCompletePrescription(oiVl, rawOiVl);
        if (oiVlIsComplete && validatePrescription(oiVl, rawOiVl, 'OI VL', [], {}, true)) {
            if (arePrescriptionsCompatible(oiVl, oiVc)) {
                oiBaseRpi = oiVc;
                oiSource = 'VC';
                hOiVc = true;
                const implicitAdd = oiVc.esfera! - oiVl.esfera!;
                if (implicitAdd > 0) {
                    setOiAdd(formatNumberInput(implicitAdd));
                } else {
                    msgs.push("OI: Datos de VC implican una ADD inválida o cero respecto a VL.");
                }
            } else {
                msgs.push(`OI: ${C.INCOMPATIBILITY_ERROR} entre VL y VC.`);
                if (oiVl.cilindro !== oiVc.cilindro) errs['oiVcCilindro'] = true;
                if (oiVl.eje !== oiVc.eje) errs['oiVcEje'] = true;
            }
        } else {
            oiBaseRpi = oiVc;
            oiSource = 'VC';
            hOiVc = true;
        }
    }
    else if (oiSource === null) {
        const oiVlIsValid = validatePrescription(oiVl, rawOiVl, 'OI VL', msgs, errs, true);
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
             if (!oiVcIsComplete && rawOiVc.s.trim() === '' && rawOiVc.c.trim() === '' && rawOiVc.a.trim() === '') {
                 if (!oiVlIsValid) msgs.push("OI VL: Datos incompletos o inválidos.");
                 if (!oiAddIsValid) {
                    msgs.push("OI ADD: Valor inválido o ausente.");
                    if (oiAdd.trim() !== '') errs['oiAdd'] = true;
                 }
            } else if (oiVcIsComplete) {
                // Ya gestionado arriba
            } else {
                msgs.push("OI VC: Datos incompletos. Complete todos los campos de VC o use VL y ADD.");
                validatePrescription(oiVc, rawOiVc, 'OI VC', [], errs, true);
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
    } else if (!msgs.some(m => m.startsWith('OD:'))) { // Añadir error genérico si no hay base y no hay error específico
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
    // Dependencias: todos los inputs y setters necesarios
    odVlEsfera, odVlCilindro, odVlEje, odAdd, odVcEsfera, odVcCilindro, odVcEje,
    oiVlEsfera, oiVlCilindro, oiVlEje, oiAdd, oiVcEsfera, oiVcCilindro, oiVcEje,
    setOdAdd, setOiAdd, setOdVcEsfera, setOdVcCilindro, setOdVcEje,
    setOiVcEsfera, setOiVcCilindro, setOiVcEje,
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
