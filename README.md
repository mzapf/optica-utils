# Optica Utils – Calculadora Óptica Profesional

**Optica Utils** es una aplicación web desarrollada con [Next.js](https://nextjs.org), diseñada para profesionales de la óptica y optometría. Permite calcular de manera precisa la Adición (ADD) y la Regresión para Potencia Intermedia (RPI) a partir de prescripciones ópticas, facilitando la toma de decisiones clínicas y la atención personalizada al paciente.

---

## Características Destacadas

- **Cálculo Automático de Adición (ADD):** Obtén la adición necesaria para visión cercana a partir de los valores de visión lejana (VL) y visión cercana (VC).
- **Regresión para Potencia Intermedia (RPI):** Calcula rápidamente valores para distancias intermedias (RPI 0.75 y 1.25) usando prescripción de lejos y adición, o directamente desde la prescripción de cerca.
- **Validación Inteligente de Datos:** El sistema valida los datos ingresados, asegurando coherencia y rangos ópticos adecuados.
- **Interfaz Moderna y Accesible:** UI intuitiva, responsiva y optimizada para dispositivos móviles y escritorio.
- **Componentes UI Personalizados:** Basado en [Shadcn/UI](https://ui.shadcn.com/) y [Tailwind CSS](https://tailwindcss.com/) para una experiencia visual consistente.
- **Código Abierto y Extensible:** Pensado para ser fácilmente mantenible y ampliable por la comunidad.

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

---

## Despliegue

La forma recomendada de desplegar esta aplicación es mediante [Vercel](https://vercel.com/), la plataforma oficial de Next.js.

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
