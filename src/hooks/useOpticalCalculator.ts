import { useState, useCallback, useEffect } from 'react';
import { FieldErrors, PrescriptionValues } from '@/lib/types';
import * as C from '@/constants/index';
import {
  parseInput,
  formatNumberInput,
  formatPrescriptionResult,
  arePrescriptionsCompatible,
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
  useEffect(() => {
    const esferaVl = parseInput(odVlEsfera);
    const addVal = parseInput(odAdd);
    if (esferaVl !== null && !isNaN(esferaVl) && addVal !== null && !isNaN(addVal)) {
      setOdVcEsfera(formatNumberInput(esferaVl + addVal));
      setOdVcCilindro(formatNumberInput(parseInput(odVlCilindro)));
      const ejeVal = parseInput(odVlEje);
      setOdVcEje(ejeVal !== null && !isNaN(ejeVal) ? Math.round(ejeVal).toString() : '');
      setHighlightOdVc(true);
    }
  }, [odVlEsfera, odVlCilindro, odVlEje, odAdd]);

  useEffect(() => {
    const esferaVl = parseInput(oiVlEsfera);
    const addVal = parseInput(oiAdd);
    if (esferaVl !== null && !isNaN(esferaVl) && addVal !== null && !isNaN(addVal)) {
      setOiVcEsfera(formatNumberInput(esferaVl + addVal));
      setOiVcCilindro(formatNumberInput(parseInput(oiVlCilindro)));
      const ejeVal = parseInput(oiVlEje);
      setOiVcEje(ejeVal !== null && !isNaN(ejeVal) ? Math.round(ejeVal).toString() : '');
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
    clearHighlights();
  }, [clearHighlights]);

  const handleInteraction = useCallback((field: string) => {
    clearResultsAndErrors();
    setFieldErrors(prev => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }, [clearResultsAndErrors]);

  const handleInputChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        handleInteraction(field);
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
        if (next > 180) next = 1;
        if (next <= 0) next = 180;
        setter(next.toString());
      } else {
        setter(formatNumberInput(next, 2));
      }
      handleInteraction(field);
    },
    [handleInteraction]
  );

  // --- Cálculo ADD ---
  const handleCalculateAdd = useCallback(() => {
    clearResultsAndErrors();
    const errs: FieldErrors = {};
    const msgs: string[] = [];
    let hOdAdd = false, hOiAdd = false, hOdVc = false, hOiVc = false;

    // parse inputs
    const odVl: PrescriptionValues = { esfera: parseInput(odVlEsfera), cilindro: parseInput(odVlCilindro), eje: parseInput(odVlEje) };
    const oiVl: PrescriptionValues = { esfera: parseInput(oiVlEsfera), cilindro: parseInput(oiVlCilindro), eje: parseInput(oiVlEje) };
    const odVc: PrescriptionValues = { esfera: parseInput(odVcEsfera), cilindro: parseInput(odVcCilindro), eje: parseInput(odVcEje) };
    const oiVc: PrescriptionValues = { esfera: parseInput(oiVcEsfera), cilindro: parseInput(oiVcCilindro), eje: parseInput(oiVcEje) };

    const validOdVl = validatePrescription(odVl, { s: odVlEsfera, c: odVlCilindro, a: odVlEje }, 'OD VL', msgs, errs, true);
    const validOiVl = validatePrescription(oiVl, { s: oiVlEsfera, c: oiVlCilindro, a: oiVlEje }, 'OI VL', msgs, errs, true);
    const validOdVc = validatePrescription(odVc, { s: odVcEsfera, c: odVcCilindro, a: odVcEje }, 'OD VC', msgs, errs, true);
    const validOiVc = validatePrescription(oiVc, { s: oiVcEsfera, c: oiVcCilindro, a: oiVcEje }, 'OI VC', msgs, errs, true);

    // compatibilidad
    let calcOd = validOdVl && validOdVc && odVl.esfera !== null && odVc.esfera !== null;
    let calcOi = validOiVl && validOiVc && oiVl.esfera !== null && oiVc.esfera !== null;
    if (calcOd && !arePrescriptionsCompatible(odVl, odVc)) {
      msgs.push(`OD: ${C.INCOMPATIBILITY_ERROR}`);
      calcOd = false;
    }
    if (calcOi && !arePrescriptionsCompatible(oiVl, oiVc)) {
      msgs.push(`OI: ${C.INCOMPATIBILITY_ERROR}`);
      calcOi = false;
    }

    // calcular
    let resOdAdd: number | null = null, resOiAdd: number | null = null;
    if (calcOd) {
      resOdAdd = odVc.esfera! - odVl.esfera!;
      if (resOdAdd <= 0 || isNaN(resOdAdd)) msgs.push(`OD ADD inválido`);
      else {
        hOdAdd = true;
        // actualizar VC
        setOdVcEsfera(formatNumberInput(odVl.esfera! + resOdAdd));
        setOdVcCilindro(formatNumberInput(odVl.cilindro));
        setOdVcEje(odVl.eje !== null ? Math.round(odVl.eje).toString() : '');
        hOdVc = true;
      }
    }
    if (calcOi) {
      resOiAdd = oiVc.esfera! - oiVl.esfera!;
      if (resOiAdd <= 0 || isNaN(resOiAdd)) msgs.push(`OI ADD inválido`);
      else {
        hOiAdd = true;
        setOiVcEsfera(formatNumberInput(oiVl.esfera! + resOiAdd));
        setOiVcCilindro(formatNumberInput(oiVl.cilindro));
        setOiVcEje(oiVl.eje !== null ? Math.round(oiVl.eje).toString() : '');
        hOiVc = true;
      }
    }

    setOdAdd(formatNumberInput(resOdAdd));
    setOiAdd(formatNumberInput(resOiAdd));
    setHighlightOdAdd(hOdAdd);
    setHighlightOiAdd(hOiAdd);
    setHighlightOdVc(hOdVc);
    setHighlightOiVc(hOiVc);
    setErrorMessages(msgs);
    setFieldErrors(errs);
  }, [odVlEsfera, odVlCilindro, odVlEje, odVcEsfera, odVcCilindro, odVcEje, oiVlEsfera, oiVlCilindro, oiVlEje, oiVcEsfera, oiVcCilindro, oiVcEje, clearResultsAndErrors]);

  // --- Cálculo RPI ---
  const handleCalculateRpi = useCallback(() => {
    clearResultsAndErrors();
    const errs: FieldErrors = {};
    const msgs: string[] = [];
    let hOdVc = false, hOiVc = false;

    // parse y validaciones similares a ADD
    const odVl = { esfera: parseInput(odVlEsfera), cilindro: parseInput(odVlCilindro), eje: parseInput(odVlEje) };
    const oiVl = { esfera: parseInput(oiVlEsfera), cilindro: parseInput(oiVlCilindro), eje: parseInput(oiVlEje) };
    const od_add = parseInput(odAdd);
    const oi_add = parseInput(oiAdd);

    const odHasAdd = odAdd.trim() !== '';
    const oiHasAdd = oiAdd.trim() !== '';

    let odBase: PrescriptionValues, oiBase: PrescriptionValues;
    let proceedOd = false, proceedOi = false;

    // camino OD
    if (odHasAdd && od_add! > 0) {
      odBase = { esfera: odVl.esfera! + od_add!, cilindro: odVl.cilindro, eje: odVl.eje };
      proceedOd = true;
      hOdVc = true;
    } else {
      const odVc = { esfera: parseInput(odVcEsfera), cilindro: parseInput(odVcCilindro), eje: parseInput(odVcEje) };
      odBase = odVc;
      proceedOd = odVc.esfera! !== null;
    }

    // camino OI similar
    if (oiHasAdd && oi_add! > 0) {
      oiBase = { esfera: oiVl.esfera! + oi_add!, cilindro: oiVl.cilindro, eje: oiVl.eje };
      proceedOi = true;
      hOiVc = true;
    } else {
      const oiVc = { esfera: parseInput(oiVcEsfera), cilindro: parseInput(oiVcCilindro), eje: parseInput(oiVcEje) };
      oiBase = oiVc;
      proceedOi = oiVc.esfera! !== null;
    }

    if (!proceedOd) msgs.push(`OD: ${C.INSUFFICIENT_DATA_RPI_ERROR}`);
    if (!proceedOi) msgs.push(`OI: ${C.INSUFFICIENT_DATA_RPI_ERROR}`);

    if (!proceedOd || !proceedOi) {
      setErrorMessages(msgs);
      setFieldErrors(errs);
      return;
    }

    // cálculo PI
    const odPi075 = { esfera: odBase.esfera! - 0.75, cilindro: odBase.cilindro, eje: odBase.eje };
    const odPi125 = { esfera: odBase.esfera! - 1.25, cilindro: odBase.cilindro, eje: odBase.eje };
    const oiPi075 = { esfera: oiBase.esfera! - 0.75, cilindro: oiBase.cilindro, eje: oiBase.eje };
    const oiPi125 = { esfera: oiBase.esfera! - 1.25, cilindro: oiBase.cilindro, eje: oiBase.eje };

    setResultOD_PI_075(formatPrescriptionResult(odPi075));
    setResultOD_PI_125(formatPrescriptionResult(odPi125));
    setResultOI_PI_075(formatPrescriptionResult(oiPi075));
    setResultOI_PI_125(formatPrescriptionResult(oiPi125));
    setHighlightOdVc(hOdVc);
    setHighlightOiVc(hOiVc);
  }, [odVlEsfera, odVlCilindro, odVlEje, odAdd, odVcEsfera, odVcCilindro, odVcEje, oiVlEsfera, oiVlCilindro, oiVlEje, oiAdd, oiVcEsfera, oiVcCilindro, oiVcEje, clearResultsAndErrors]);

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
