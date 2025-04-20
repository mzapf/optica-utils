"use client";

import React from 'react';
import Link from 'next/link'; // Importar Link de next/link

// Shadcn/UI Components & Icons
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle, Calculator, CheckCircle, Github } from 'lucide-react'; // Añadir Github icon

// Custom Hook, Components, Constants & Types
import { useOpticalCalculator } from '@/hooks/useOpticalCalculator';
import { PrescriptionInputGroup } from '@/components/PrescriptionInputGroup';
import * as C from '@/constants/index';
import { FieldErrors } from '@/lib/types';
import { cn } from '@/lib/utils'; // Importar cn

// Helper local para clases de error
const getErrorClass = (fieldName: string, fieldErrors: FieldErrors): string => {
    // Devuelve solo la clase de borde de error o una cadena vacía
    return fieldErrors[fieldName] ? C.ERROR_BORDER_CLASS : C.NORMAL_BORDER_CLASS;
};


export default function Home() {
    const {
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
        resultOD_PI_075, resultOI_PI_075,
        resultOD_PI_125, resultOI_PI_125,
        errorMessages, fieldErrors,
        highlightOdAdd, highlightOiAdd,
        highlightOdVc, highlightOiVc,
        handleCalculateAdd, handleCalculateRpi,
    } = useOpticalCalculator();

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-6 md:p-10 lg:p-12 bg-gray-100 dark:bg-gray-950">
            <Card className="w-full max-w-xl shadow-xl border dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-t-lg border-b dark:border-gray-700">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Calculadora Óptica</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Calculadora de adición (ADD) y regresión (RPI)</CardDescription>
                </CardHeader>

                <CardContent className="p-5 sm:p-6 space-y-6">

                    {/* --- Sección LEJOS (VL) --- */}
                    <section className="space-y-5 p-4 border dark:border-gray-700/50 rounded-lg bg-white dark:bg-gray-800/20 shadow-sm">
                        <h3 className="text-base sm:text-lg font-semibold border-b dark:border-gray-600 pb-2 mb-4 text-gray-700 dark:text-gray-300">Visión Lejana</h3>
                        <PrescriptionInputGroup
                            eyeLabel="Ojo Derecho (OD)"
                            eyePrefix="od"
                            sectionPrefix="Vl"
                            values={{ esfera: odVlEsfera, cilindro: odVlCilindro, eje: odVlEje }}
                            setters={{ setEsfera: setOdVlEsfera, setCilindro: setOdVlCilindro, setEje: setOdVlEje }}
                            fieldErrors={fieldErrors}
                            handleStepChange={handleStepChange}
                            handleInputChange={handleInputChange}
                        />
                         <div className="pt-4">
                             <PrescriptionInputGroup
                                eyeLabel="Ojo Izquierdo (OI)"
                                eyePrefix="oi"
                                sectionPrefix="Vl"
                                values={{ esfera: oiVlEsfera, cilindro: oiVlCilindro, eje: oiVlEje }}
                                setters={{ setEsfera: setOiVlEsfera, setCilindro: setOiVlCilindro, setEje: setOiVlEje }}
                                fieldErrors={fieldErrors}
                                handleStepChange={handleStepChange}
                                handleInputChange={handleInputChange}
                            />
                         </div>
                    </section>

                    {/* --- Sección ADD --- */}
                    <section className="space-y-4 p-4 border dark:border-gray-700/50 rounded-lg bg-white dark:bg-gray-800/20 shadow-sm">
                        <h3 className="text-base sm:text-lg font-semibold border-b dark:border-gray-600 pb-2 mb-4 text-gray-700 dark:text-gray-300">Adición (ADD)</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 items-start">
                                <div className="space-y-1.5">
                                    <Label htmlFor="odAdd" className="text-sm font-medium">OD ADD</Label>
                                    <Input id="odAdd" type="text" inputMode="decimal" placeholder="" value={odAdd}
                                           onChange={handleInputChange(setOdAdd, "odAdd")}
                                        className={cn(
                                            'transition-colors placeholder:text-muted-foreground/60 h-9',
                                            highlightOdAdd ? C.INPUT_HIGHLIGHT_CLASS : '',
                                            getErrorClass("odAdd", fieldErrors)
                                        )}
                                        aria-invalid={!!fieldErrors["odAdd"]}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="oiAdd" className="text-sm font-medium">OI ADD</Label>
                                    <Input id="oiAdd" type="text" inputMode="decimal" placeholder="" value={oiAdd}
                                           onChange={handleInputChange(setOiAdd, "oiAdd")}
                                           className={cn(
                                            'transition-colors placeholder:text-muted-foreground/60 h-9',
                                            highlightOiAdd ? C.INPUT_HIGHLIGHT_CLASS : '',
                                            getErrorClass("oiAdd", fieldErrors)
                                        )}
                                        aria-invalid={!!fieldErrors["oiAdd"]}
                                   />
                                </div>
                            </div>
                            <div className="pt-1 text-center sm:text-right">
                                <Button type="button" variant="outline" size="sm" onClick={handleCalculateAdd} className="shadow-sm">
                                    <Calculator className="mr-2 h-4 w-4" /> Calcular ADD
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* --- Sección CERCA (VC) --- */}
                    <section className={`space-y-5 p-4 border dark:border-gray-700/50 rounded-lg bg-white dark:bg-gray-800/20 shadow-sm transition-colors`}>
                        <h3 className="text-base sm:text-lg font-semibold border-b dark:border-gray-600 pb-2 mb-4 text-gray-700 dark:text-gray-300">Visión Cercana</h3>
                         <PrescriptionInputGroup
                            eyeLabel="Ojo Derecho (OD)"
                            eyePrefix="od"
                            sectionPrefix="Vc"
                            values={{ esfera: odVcEsfera, cilindro: odVcCilindro, eje: odVcEje }}
                            setters={{ setEsfera: setOdVcEsfera, setCilindro: setOdVcCilindro, setEje: setOdVcEje }}
                            fieldErrors={fieldErrors}
                            handleStepChange={handleStepChange}
                            handleInputChange={handleInputChange}
                            containerClass={highlightOdVc ? C.HIGHLIGHT_CONTAINER_CLASS : undefined}
                        />
                         <div className="pt-4">
                              <PrescriptionInputGroup
                                eyeLabel="Ojo Izquierdo (OI)"
                                eyePrefix="oi"
                                sectionPrefix="Vc"
                                values={{ esfera: oiVcEsfera, cilindro: oiVcCilindro, eje: oiVcEje }}
                                setters={{ setEsfera: setOiVcEsfera, setCilindro: setOiVcCilindro, setEje: setOiVcEje }}
                                fieldErrors={fieldErrors}
                                handleStepChange={handleStepChange}
                                handleInputChange={handleInputChange}
                                containerClass={highlightOiVc ? C.HIGHLIGHT_CONTAINER_CLASS : undefined}
                            />
                         </div>
                        <div className="text-center sm:text-left pt-2">
                            <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                                <Info size={14} />
                                Ingrese LEJOS y ADD, <span className='font-medium'>o</span> ingrese CERCA directamente para calcular RPI.
                            </p>
                        </div>
                    </section>

                    {/* --- Sección RESULTADOS RPI (Condicional) --- */}
                    {(resultOD_PI_075 !== null || resultOI_PI_075 !== null || resultOD_PI_125 !== null || resultOI_PI_125 !== null) && errorMessages.length === 0 ? (
                        <section className="space-y-4 p-4 mt-5 border-2 rounded-lg bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600 shadow-md animate-fade-in">
                            <h3 className="text-base sm:text-lg font-semibold border-b border-green-400 dark:border-green-600 pb-2 mb-4 text-green-800 dark:text-green-300 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" /> Posibles Distancias Intermedias
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3 p-4 border border-green-300 dark:border-green-700 rounded bg-white dark:bg-gray-800/40 shadow-sm">
                                    <h4 className="font-semibold text-center text-sm sm:text-base text-green-700 dark:text-green-400">RPI 0.75</h4>
                                    <Separator className="bg-green-200 dark:bg-green-600" />
                                    <div className="space-y-1.5 text-xs sm:text-sm">
                                        <p className="flex justify-between items-center"><span className="font-medium text-gray-700 dark:text-gray-300">OD:</span> <code className="font-mono bg-green-200 dark:bg-green-900/60 px-2 py-1 rounded text-green-900 dark:text-green-200">{resultOD_PI_075 ?? '---'}</code></p>
                                        <p className="flex justify-between items-center"><span className="font-medium text-gray-700 dark:text-gray-300">OI:</span> <code className="font-mono bg-green-200 dark:bg-green-900/60 px-2 py-1 rounded text-green-900 dark:text-green-200">{resultOI_PI_075 ?? '---'}</code></p>
                                    </div>
                                </div>
                                <div className="space-y-3 p-4 border border-green-300 dark:border-green-700 rounded bg-white dark:bg-gray-800/40 shadow-sm">
                                    <h4 className="font-semibold text-center text-sm sm:text-base text-green-700 dark:text-green-400">RPI 1.25</h4>
                                    <Separator className="bg-green-200 dark:bg-green-600" />
                                    <div className="space-y-1.5 text-xs sm:text-sm">
                                        <p className="flex justify-between items-center"><span className="font-medium text-gray-700 dark:text-gray-300">OD:</span> <code className="font-mono bg-green-200 dark:bg-green-900/60 px-2 py-1 rounded text-green-900 dark:text-green-200">{resultOD_PI_125 ?? '---'}</code></p>
                                        <p className="flex justify-between items-center"><span className="font-medium text-gray-700 dark:text-gray-300">OI:</span> <code className="font-mono bg-green-200 dark:bg-green-900/60 px-2 py-1 rounded text-green-900 dark:text-green-200">{resultOI_PI_125 ?? '---'}</code></p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : null}

                    {/* --- Mostrar Errores Generales si existen --- */}
                    {errorMessages.length > 0 && (
                        <Alert variant="destructive" className="mt-6 shadow animate-shake">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error de Validación</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    {Array.from(new Set(errorMessages)).map((msg, index) => <li key={index}>{msg}</li>)}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                </CardContent>

                <CardFooter className="flex justify-center p-5 border-t dark:border-gray-700 mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                    <Button onClick={handleCalculateRpi} size="lg" className="px-12 sm:px-16 text-base sm:text-lg w-full sm:w-auto tracking-wide font-semibold shadow-md hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
                        Calcular RPI
                    </Button>
                </CardFooter>
            </Card>

            {/* --- Footer --- */}
            <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 w-full max-w-xl">
                Desarrollado por Matias Zapf |{' '}
                <Link
                    href="https://github.com/mzapf/optica-utils/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary dark:hover:text-primary-foreground transition-colors underline underline-offset-2"
                >
                    <Github size={14} /> Ver en GitHub
                </Link>
            </footer>

             {/* Opcional: Añadir CSS para animaciones */}
             <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }

                @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
                .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
            `}</style>
        </main>
    );
}
