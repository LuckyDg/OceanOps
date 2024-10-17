# Aplicación de Gestión de Flotas (OceanOps)

Este Proyecto esta generado con [Angular CLI](https://github.com/angular/angular-cli) version 18.2.1.

La Aplicación de Gestión de Flotas es una web desarrollada con Angular con el proposito de practicar github actions y para ayudar a gestionar operaciones de flotas rastreando barcos y sus contenedores. Ofrece funcionalidades como la generación de reportes en PDF, mostrar detalles de los contenedores basados en los roles de usuario, y gestionar sesiones de inicio/cierre de sesión. Utiliza Sonner para notificaciones y Jest para pruebas unitarias esta aplicacion esta en desarrollo.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
- [Pruebas](#pruebas)
- [Licencia](#licencia)

## Características

- **Gestión de Barcos:** Ver y gestionar barcos en una interfaz responsiva con tarjetas.
- **Detalles de Contenedores:** Mostrar información de los contenedores con detalles expandibles al hacer clic.
- **Generación de Reportes en PDF:** Generar reportes descargables en PDF usando jsPDF y html2canvas.
- **Control de Acceso Basado en Roles:** Los administradores pueden ver detalles adicionales de los contenedores.
- **Gestión de Sesiones:** Iniciar y cerrar sesión con notificaciones de éxito o error mediante Sonner.
- **Notificaciones:** Toasts para dar retroalimentación de acciones clave.
- **Pruebas:** Pruebas unitarias y end-to-end usando Jest y Cypress.

## Tecnologías

- **Angular 18:** Framework frontend para construir la interfaz web.
- **TypeScript:** Usado para escribir código JavaScript tipado.
- **Jest:** Para pruebas unitarias.
- **Sonner:** Para notificaciones tipo toast.
- **jsPDF & html2canvas:** Usados para generar y descargar reportes en formato PDF.

## Instalación

Requisitos Previos
Asegúrate de tener instalado lo siguiente en tu máquina:

- **Node.js** (versión 18+)
- **Angular CLI** (versión 18+)
- **Git**

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/fleet-management-app.git
cd fleet-management-app
```

### Instalar Dependencias

```bash
npm install
```

## Configuración

La aplicación utiliza JSON como backend simulado para los datos de los usuarios y los contenedores. Si deseas modificar o extender los datos simulados, puedes encontrar los archivos JSON en la carpeta `src/assets/`.

## Ejecución de la Aplicación

Para ejecutar la aplicación localmente, usa el siguiente comando:

```bash
ng serve
```

Esto iniciará la aplicación en [http://localhost:4200](http://localhost:4200).

### Compilar

Para compilar el proyecto para producción, ejecuta:

```bash
ng build
```

Los archivos de compilación se almacenarán en el directorio `dist/`.

## Pruebas

El proyecto incluye tanto pruebas unitarias para garantizar la calidad del código.

### Ejecutar Pruebas Unitarias

Las pruebas unitarias están escritas con Jest. Para ejecutarlas, usa el siguiente comando:

```bash
Copiar código
npm run test
```

## Notificaciones con Sonner

Para notificar al usuario sobre eventos importantes, como el inicio de sesión exitoso o un error al generar un reporte, se usa el componente Sonner. Aquí un ejemplo en el código:

```typescript
this.toastService.toastSuccess('¡Sesión iniciada exitosamente!');
```

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - mira el archivo LICENSE para más detalles.

### Mejoras Futuras

- **Integración con API:** Reemplazar los datos simulados con una API real.
- **Gestión de Roles:** Extender el control de acceso basado en roles para mayor granularidad.
- **Mejoras en Rendimiento:** Optimizar la generación de PDF para grandes reportes.

Autor

- [LuckyDg](https://github.com/LuckyDg)

### Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores, por favor abre un issue primero para discutir lo que te gustaría cambiar.

Nota: Falta arreglar el testing para que corra con alias y tambien falta despliegue a vercel
