# Calculadora Óptica - Optica Utils

Esta es una aplicación web desarrollada con [Next.js](https://nextjs.org) que sirve como herramienta para profesionales de la óptica. Permite calcular de forma rápida y sencilla la Adición (ADD) necesaria para una prescripción de cerca y la Regresión para Potencia Intermedia (RPI) a partir de los datos de visión lejana (VL) y visión cercana (VC) o la Adición.

## Funcionalidades Principales

*   **Cálculo de Adición (ADD):** Introduce los valores de la prescripción de Visión Lejana (VL) y Visión Cercana (VC) para obtener automáticamente la Adición (ADD) correspondiente para cada ojo.
*   **Cálculo de Regresión para Potencia Intermedia (RPI):** A partir de la prescripción de Visión Lejana (VL) y la Adición (ADD) calculada o introducida, o directamente desde la prescripción de Visión Cercana (VC), la aplicación calcula los valores para la distancia intermedia utilizando dos regresiones comunes: 0.75 y 1.25.
*   **Interfaz Intuitiva:** Diseño claro y fácil de usar, optimizado para una entrada de datos rápida y visualización clara de los resultados.
*   **Validación de Datos:** Incorpora validaciones para asegurar que los valores introducidos sean coherentes y estén dentro de los rangos ópticos habituales.
*   **Diseño Responsivo:** Adaptable a diferentes tamaños de pantalla, funcionando correctamente en escritorio y dispositivos móviles.

## Tecnologías Utilizadas

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Librería UI:** [React](https://reactjs.org/)
*   **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Iconos:** [Lucide React](https://lucide.dev/)
*   **Hooks:** React Hooks para la gestión del estado y la lógica.
*   **Fuente:** [Geist](https://vercel.com/font) (optimizada con `next/font`)
*   **Despliegue:** Vercel

## Getting Started (Para Desarrollo)

Si deseas ejecutar este proyecto localmente:

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/mzapf/optica-utils.git
    cd optica-utils
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
3.  Ejecuta el servidor de desarrollo:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Abre http://localhost:3000 en tu navegador para ver la aplicación. Puedes empezar a editar la página modificando `app/page.tsx`. La página se actualiza automáticamente a medida que editas el archivo.

## Learn More

Para aprender más sobre Next.js, echa un vistazo a los siguientes recursos:

*   Next.js Documentation - aprende sobre las características y la API de Next.js.
*   Learn Next.js - un tutorial interactivo de Next.js.

Puedes consultar el repositorio de Next.js en GitHub - ¡tus comentarios y contribuciones son bienvenidos!

## Deploy on Vercel

La forma más fácil de desplegar tu aplicación Next.js es usar la Plataforma Vercel de los creadores de Next.js.

Consulta nuestra documentación de despliegue de Next.js para más detalles.

