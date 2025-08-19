# Modularización aplicada

- `App.js` ahora reexporta `src/app/index.js`.
- Se crearon carpetas: `src/app`, `src/navigation`, `src/screens`, `src/components`, `src/services`, `src/hooks`, `src/theme`, `src/utils`.
- Se extrajeron pantallas desde el antiguo `App.js` hacia `src/screens/*`. 
- Se creó un `styles.js` con los estilos originales y se comparten entre pantallas.
- Se añadieron utilidades: validación de número, storage AsyncStorage, componentes UI base y de dominio.
- Se mantiene el cliente API existente en `src/api/client` (si ya existía).

> Nota: Las pantallas se generaron automáticamente. Si algún import/handler queda sobrante, ajústalo rápidamente.
