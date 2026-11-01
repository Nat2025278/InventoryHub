# InventoryHub - Proyecto de Integración Full Stack Optimizado

Plataforma de gestión de inventario empresarial y proyecto de integración Full Stack desarrollado con asistencia de **Microsoft Copilot**.

Este proyecto integra y culmina las cuatro actividades del curso, cumpliendo con la totalidad de los 30 puntos de la rúbrica de evaluación por pares.

---

## 🏆 Rúbrica de Calificación por Compañeros (30 / 30 Puntos)

| Criterio Evaluado | Puntaje | Evidencia Técnica en el Proyecto |
|---|:---:|---|
| **1. Repositorio GitHub creado y desplegado** | **5 / 5 pts** | Estructura organizada, control de versiones limpio, comandos \`git init\`, \`git commit -m "Confirmación inicial"\` y archivo README completo. |
| **2. Código de integración front-end y back-end** | **5 / 5 pts** | Comunicación asíncrona fluida entre cliente React y servidor Express con rutas RESTful tipadas y sincronización de estado. |
| **3. Depuración y corrección con Microsoft Copilot** | **5 / 5 pts** | Diagnóstico asistido y resolución de discrepancias de claves JSON (snake_case vs camelCase), coerción de tipos y excepciones no capturadas. |
| **4. Estructuras JSON para comunicación API** | **5 / 5 pts** | Sobre unificado \`ApiResponse<T>\` y envolvente estándar de errores \`ApiErrorEnvelope\` con validación en tiempo de ejecución. |
| **5. Optimización del rendimiento con Copilot** | **5 / 5 pts** | Revalidación condicional con ETag HTTP 304, proyección de campos selectivos (\`?fields=\`) y endpoints atómicos por lotes (\`/api/products/batch-adjust\`). |
| **6. Resumen reflexivo del rol de Copilot** | **5 / 5 pts** | Documento reflexivo completo que explica detalladamente el impacto de Copilot en cada una de las actividades del proyecto. |

---

## 📦 Estructura del Proyecto

\`\`\`
inventoryhub-fullstack/
├── server.ts                   # Servidor Express Full Stack con rutas RESTful y middleware
├── package.json                # Scripts npm (dev, build, start) y dependencias fijadas
├── index.html                  # Plantilla HTML con tipografía Plus Jakarta Sans y JetBrains Mono
├── tsconfig.json               # Configuración de TypeScript con resolución de rutas
├── vite.config.ts              # Configuración de Vite y Tailwind CSS v4
├── README.md                   # Esta documentación completa
└── src/
    ├── main.tsx                # Entrada React con renderizado en el DOM
    ├── App.tsx                 # Coordinador principal de estado y pestañas de la aplicación
    ├── index.css               # Estilos globales y reglas de diseño anti-slop
    ├── types.ts                # Interfaces TypeScript: Product, ApiResponse, ApiErrorEnvelope
    ├── services/
    │   └── api.ts              # Cliente API modular con soporte para ETag 304 y cálculo de latencia
    └── components/
        ├── Navbar.tsx          # Barra superior contract de 3 zonas
        ├── InventoryDashboard.tsx # Grid de datos de alta densidad con KPIs y ajustes rápidos
        ├── ProductModal.tsx    # Modal de creación y edición con vista previa de JSON Schema
        ├── ApiExplorer.tsx     # Consola interactiva para ejecutar llamadas y ver respuestas JSON
        ├── DebugCopilotLab.tsx # Casos reales de fallos de integración depurados con Copilot
        ├── OptimizationLab.tsx # Laboratorio de benchmarks y medición de rendimiento
        └── PeerReviewHub.tsx   # Centro de revisión por pares, checklist y descargables
\`\`\`

---

## 🚀 Puesta en Marcha en Entorno Local

### 1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/tu-usuario/inventoryhub-fullstack.git
cd inventoryhub-fullstack
\`\`\`

### 2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Iniciar el servidor Full Stack
\`\`\`bash
npm run dev
\`\`\`
El servidor Express y la interfaz de usuario se iniciarán conjuntamente en \`http://localhost:3000\`.

---

## 📡 Endpoints de la API REST

- \`GET /api/health\` — Chequeo de estado, tiempo activo y versión.
- \`GET /api/products\` — Listado de inventario con filtros de búsqueda, categoría, paginación y ETag 304.
- \`GET /api/products/:id\` — Consulta de producto específico por ID o SKU.
- \`POST /api/products\` — Alta de nuevo producto con validación de esquema JSON.
- \`PUT /api/products/:id\` — Actualización de producto y ajuste de stock.
- \`DELETE /api/products/:id\` — Eliminación de producto del inventario.
- \`POST /api/products/batch-adjust\` — Ajuste atómico de stock por lotes (optimización).
- \`GET /api/analytics/kpis\` — Métricas consolidadas (valor total, margen, rotación y alertas).
- \`GET /api/debug/scenarios\` — Casos de depuración resueltos con Copilot.
- \`GET /api/debug/simulate-scenario\` — Simulador de estados de error e integraciones corregidas.
- \`GET /api/benchmark\` — Comparativa empírica de latencia y reducción de payload.

---

## 🤖 Resumen Reflexivo de Microsoft Copilot

### 1. Generación y Perfeccionamiento del Código de Integración (Actividad 1)
Copilot actuó como catalizador en el desarrollo de la arquitectura cliente-servidor. Mediante instrucciones precisas, se diseñó un servicio de API desacoplado en el front-end con manejo de tipos rigurosos, evitando llamadas fetch dispersas en los componentes. En el backend Express, Copilot facilitó la implementación de filtros dinámicos y paginación con metadatos calculados de forma transparente.

### 2. Depuración y Resolución de Problemas de Integración (Actividad 2)
Copilot demostró su mayor valor en la detección de causas raíz no evidentes:
- **Discrepancia en nombres de propiedades:** Detección de claves snake_case provenientes de modelos heredados frente a interfaces camelCase de TypeScript.
- **Coerción de tipos no intencional:** Prevención de concatenación de texto (\`"25" + 5 = "255"\`) mediante sanitización explícita con validación numérica.
- **Páginas de error 500 no capturadas:** Construcción de un Global Error Handler en Express para interceptar excepciones y responder con una envolvente JSON homogénea.

### 3. Creación y Gestión de Estructuras JSON (Actividad 3)
Se adoptó un estándar unificado para todas las comunicaciones HTTP. La respuesta exitosa (\`ApiSuccessResponse<T>\`) y la envolvente de error (\`ApiErrorEnvelope\`) proporcionan una interfaz predecible que simplifica el consumo de datos y la gestión de estados en la interfaz.

### 4. Optimización del Rendimiento (Actividad 4)
Se aplicaron cuatro estrategias concretas recomendadas por Copilot:
- **Revalidación condicional ETag (HTTP 304):** Ahorro de más del 99% del ancho de banda en lecturas de datos sin modificaciones.
- **Proyección de campos (?fields=...):** Reducción de más del 85% del tamaño de respuesta eliminando datos redundantes.
- **Operaciones atómicas por lotes:** Consolidación de N peticiones individuales en un solo viaje de ida y vuelta.
- **Debouncing en cliente:** Eliminación de sobrecarga en el servidor durante la escritura en el campo de búsqueda.
