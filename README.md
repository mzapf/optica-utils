# Calculadora de inversión, adición (ADD) y regresión (RPI)

Aplicación web progresiva (PWA) de utilidad para profesionales de la óptica y optometría. Permite realizar cálculos auxiliares como Adición (ADD), Regresión para Potencia Intermedia (RPI) e invertir prescripciones, con validación inteligente y sincronización automática de datos.

---

## Funcionalidades principales

- **Cálculo de adición (ADD):** Calcula la visión cercana a partir de la visión lejana y una adición o calcula la adición entre los valores de lejos y cerca.
- **Cálculo de RPI (0.75 y 1.25):** Obtén rápidamente valores para distancias intermedias usando prescripción de lejos y ADD, o directamente desde la prescripción de cerca.
- **Inversión de prescripción:** Invierte la graduación de cualquier ojo y distancia (VL/VC) con un solo clic.
- **Validación inteligente:** El sistema valida rangos, múltiplos y coherencia entre campos, mostrando errores claros y resaltando los campos afectados.
- **Interfaz moderna y responsiva:** UI intuitiva, optimizada para escritorio y móvil, con componentes personalizados y resaltado visual de campos calculados o autocompletados.
- **Restablecimiento y limpieza rápida:** Permite limpiar todos los datos de un ojo o invertir la graduación fácilmente.

---

## Tecnologías Utilizadas

- **Framework:** [Next.js](https://nextjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Librería UI:** [React](https://reactjs.org/)
- **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Fuentes:** [Geist](https://vercel.com/font) (integrada con `next/font`)
- **Despliegue:** [Vercel](https://vercel.com/)

---

## Instalación y Uso

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clona el repositorio:**
    ```bash
    git clone https://github.com/mzapf/optica-utils.git
    cd optica-utils
    ```
2. **Instala las dependencias:**
    ```bash
    npm install
    # o
    yarn install
    # o
    pnpm install
    # o
    bun install
    ```
3. **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    # o
    pnpm dev
    # o
    bun dev
    ```

Accede a [http://localhost:3000](http://localhost:3000) en tu navegador para utilizar la aplicación.

---

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar:

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o corrección (`git checkout -b feature/nombre`).
3. Realiza tus cambios y haz commit.
4. Envía un Pull Request detallando tu aporte.

Por favor, sigue las buenas prácticas de código y asegúrate de que tus cambios no rompan la funcionalidad existente.

---

## Recursos y Documentación

- [Documentación de Next.js](https://nextjs.org/docs)
- [Guía de Shadcn/UI](https://ui.shadcn.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- El icono de la aplicación proviene de [flaticon.com](https://www.flaticon.com/).

---

## Despliegue

La forma recomendada de desplegar esta aplicación es mediante [Vercel](https://vercel.com/), la plataforma oficial de Next.js.

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
