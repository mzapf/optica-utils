// Steps & Placeholders
export const STEP = 0.25;
export const AXIS_STEP = 1;
export const PLACEHOLDER_DIOPTER = '--.--';
export const PLACEHOLDER_AXIS = '---';

// Error Messages
export const REQUIRED_ERROR = "Valor requerido.";
export const POSITIVE_ADD_ERROR = "ADD debe ser numérico y positivo.";
export const NUMERIC_ERROR = "Debe ser numérico si se ingresa.";
export const AXIS_RANGE_ERROR = "Debe estar entre 1 y 180.";
export const AXIS_REQUIRED_ERROR = "Requerido si hay Cilindro.";
export const AXIS_WITHOUT_CYL_ERROR = "No puede existir sin Cilindro (distinto de cero).";
export const INCOMPATIBILITY_ERROR = "Incompatibilidad de Cilindro/Eje entre VL y VC impide calcular ADD.";
export const INSUFFICIENT_DATA_ADD_ERROR = "Datos insuficientes o inválidos en VL/VC para calcular ADD.";
export const INSUFFICIENT_DATA_RPI_ERROR = "Se requieren datos válidos en (VL y ADD) o en VC.";
export const GENERIC_PROCEED_ERROR = "Datos insuficientes/inválidos para proceder.";

// CSS Classes
export const HIGHLIGHT_CONTAINER_CLASS = "bg-green-50 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-md p-2";
export const NORMAL_CONTAINER_CLASS = "p-2";
export const INPUT_HIGHLIGHT_CLASS = "bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600";
export const ERROR_BORDER_CLASS = "border-red-500 dark:border-red-600 ring-1 ring-red-500 dark:ring-red-600 ring-offset-1 dark:ring-offset-gray-900";
export const NORMAL_BORDER_CLASS = "border-input dark:border-gray-700/50";