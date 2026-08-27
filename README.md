# 💈 Style Luna Azul — Sistema de Gestión de Barbería Premium

Aplicación web moderna y completa para la administración integral de la barbería **Luna Azul**. Permite gestionar clientes, barberos, citas, inventario y caja registrada en punto de venta (POS).

---

## 🚀 Características Principales

### 👨‍👩‍👧‍👦 Portal de Clientes (`Role: CLIENT`)
- **Catálogo de Servicios**: Exploración de servicios por categorías (*Cortes, Barba, Combos, Infantil, Peinados*).
- **Barberos Destacados**: Visualización del equipo de barberos con calificación en estrellas y disponibilidad en tiempo real.
- **Asistente de Reserva Interactivo**: Flujo de reserva en 4 pasos (Servicio ➔ Barbero ➔ Fecha y Hora en calendario ➔ Confirmación).
- **Simulación de Google Calendar**: Creación automática de ID de evento al confirmar la cita.
- **Gestión de Mis Citas**: Consulta de citas próximas y activas con opción de cancelación y revisión del historial de citas completadas.

### ✂️ Portal de Barberos (`Role: BARBER`)
- **Agenda Diaria Interactiva**: Selector semanal interactivo para revisar cronograma de citas asignadas.
- **Gestión de Disponibilidad**: Interruptor en tiempo real para activar o desactivar la recepción de nuevas reservas.
- **Flujo de Atención**: Cambio dinámico del estado de las citas (*Confirmar ➔ Iniciar ➔ Completar*).
- **Configuración de Horario Laboral**: Modificación de días de atención y franjas horarias personalizadas.

### 🛡️ Panel de Administración (`Role: ADMIN`)
- **Dashboard Estadístico**: Métricas clave del día (ingresos en COP, número de citas, barberos activos y alertas de inventario) con gráfico de tendencia de ingresos semanales.
- **Gestión de Personal**: Creación, edición, asignación de especialidades, control de estado y eliminación de miembros del equipo.
- **Inventario de Productos**: Control de existencias, precios en Pesos Colombianos, alertas automáticas por stock mínimo y buscador reactivo.
- **Caja y Punto de Venta (POS)**: Registro de ventas rápidas de servicios y productos con soporte para pago en Efectivo, Tarjeta y Plataformas Digitales.

---

## 🛠️ Tecnologías Utilizadas

- **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador**: [Vite](https://vitejs.dev/)
- **Estilos & Diseño**: [Tailwind CSS](https://tailwindcss.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Formatos Locales**: Pesos Colombianos (COP) vía `Intl.NumberFormat` / [`formatCurrency`](file:///c:/Users/StalavoX/Downloads/project/src/utils/format.ts)
- **Carga Resiliente de Imágenes**: Componente [`ImageWithFallback`](file:///c:/Users/StalavoX/Downloads/project/src/components/ui/ImageWithFallback.tsx) con avatares dinámicos basados en iniciales.

---

## 💻 Requisitos Previos e Instalación

Asegúrate de tener instalado **Node.js** (versión 18 o superior).

1. **Clonar o abrir el proyecto en tu terminal**:
   ```bash
   cd project
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   > ⚠️ **Nota importante**: No utilices extensiones como *Live Server* de VS Code directamente sobre `index.html`, ya que los navegadores requieren que Vite compile los archivos TypeScript (`.tsx`).

4. **Abrir en el navegador**:
   Visita la URL indicada en la terminal (usualmente `http://localhost:5173`).

---

## 🔑 Cuentas de Prueba (Demo)

Puedes iniciar sesión con cualquiera de las siguientes credenciales para probar los distintos roles del sistema:

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Cliente** | `carlos@email.com` | `carlos123` |
| **Barbero** | `marco@lunazul.com` | `marco123` |
| **Administrador** | `admin@lunazul.com` | `admin123` |

---

## 📁 Estructura del Proyecto

```text
project/
├── public/                 # Recursos estáticos y manifiesto PWA
├── src/
│   ├── components/         # Componentes de interfaz
│   │   ├── ui/             # Componentes base (Button, Card, Modal, Input, ImageWithFallback)
│   │   └── Layout.tsx      # Disposición principal y menús según rol
│   ├── context/            # Estado global (AuthContext, DataContext)
│   ├── data/               # Mock data (Servicios, Barberos, Citas, Productos, Ventas)
│   ├── screens/            # Pantallas agrupadas por rol
│   │   ├── admin/          # Panel de Control, Inventario, Ventas, Personal
│   │   ├── barber/         # Agenda diaria del barbero
│   │   ├── client/         # Catálogo, Flujo de Reserva, Mis Citas
│   │   ├── AuthScreen.tsx  # Pantalla de Login / Registro
│   │   └── ProfileScreen.tsx# Perfil de usuario
│   ├── utils/              # Utilidades de formato (formatCurrency en COP)
│   ├── App.tsx             # Enrutador e integración principal
│   └── main.tsx            # Punto de entrada de React
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📝 Comandos Útiles

- `npm run dev`: Ejecuta el servidor de desarrollo en local.
- `npm run build`: Compila y genera el paquete de producción en la carpeta `dist/`.
- `npm run preview`: Previsualiza la build de producción.
- `npm run typecheck`: Verifica que no existan errores de tipos en TypeScript.
