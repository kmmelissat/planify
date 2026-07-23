# Requerimientos de Frontend — Agente Generativo de Planificación
 
> Extraído de la especificación del proyecto final (Introducción a la Programación con IA).
> Este documento cubre **solo lo que le corresponde al frontend**. Todo lo relacionado a
> backend, integración real con el modelo de IA, base de datos o seguridad de credenciales
> está fuera de este checklist (ver nota al final).
 
## 1. Pantallas y flujos obligatorios
 
- [ ] **Tareas**: crear, editar, consultar y cambiar estado de una tarea.
      Campos obligatorios: título, descripción, categoría, fecha límite, prioridad,
      esfuerzo estimado, estado.
- [ ] **Disponibilidad**: registrar bloques de tiempo disponibles por día.
- [ ] **Restricciones**: registrar horarios ocupados, tareas que no pueden moverse,
      tiempo máximo por sesión, prioridad académica.
- [ ] **Plan propuesto**: mostrar el plan generado (diario o semanal) con orden sugerido
      de tareas y tiempos recomendados.
- [ ] **Justificación**: mostrar el razonamiento de la IA — por qué ordenó las tareas así.
- [ ] **Revisión humana**: el usuario debe poder **aceptar, editar, rechazar o pedir una
      nueva versión** del plan. Ninguna de estas acciones puede faltar.
- [ ] **Replanificación**: acción visible para regenerar el plan cuando cambie una tarea,
      prioridad o disponibilidad.
- [ ] **Alertas/conflictos**: la UI debe indicar visiblemente sobrecarga, fechas en riesgo,
      tareas sin tiempo disponible, o información insuficiente para planificar.
- [ ] **Historial/trazabilidad**: por cada plan generado debe verse: prompt usado, respuesta
      generada, fecha, versión, estado de aprobación y observaciones del usuario.
- [ ] **Consulta de tareas por estado**: filtro/vista por pendiente, en progreso, completada,
      atrasada, reprogramada.
- [ ] **Panel de seguimiento**: avance básico — pendientes, completadas, atrasadas,
      reprogramadas.
## 2. Escenarios de prueba (obligatorios, deben poder demostrarse en la UI)
 
- [ ] Semana académica normal
- [ ] Semana con sobrecarga
- [ ] Semana con cambio inesperado (replanificación)
Estos tres escenarios deben poder mostrarse en la defensa — conviene dejarlos como datos
mock seleccionables, no como algo que solo existe en la base de datos.
 
## 3. Reglas de negocio no negociables (impactan diseño de UI, no solo lógica)
 
- [ ] **Nunca mostrar el plan generado como final automáticamente** — siempre debe pasar
      por un paso de aprobación humana antes de tratarse como "plan vigente".
- [ ] El agente **no ejecuta acciones irreversibles sin aprobación** — cualquier acción
      destructiva o de reemplazo necesita confirmación explícita del usuario.
- [ ] Si un plan no es posible dado tareas/disponibilidad/restricciones, la UI debe
      **decirlo claramente**, no fallar en silencio ni mostrar un plan incompleto como si
      fuera válido.
- [ ] En ningún texto de la interfaz se debe presentar la planificación como una decisión
      obligatoria — siempre como recomendación revisable.
## 4. Validación y manejo de errores (lado frontend)
 
- [ ] Validar fechas, prioridades, esfuerzo estimado y disponibilidad en los formularios
      antes de enviarlos.
- [ ] Validar que la respuesta del módulo de IA tenga el formato/estructura esperada antes
      de renderizarla como plan. Si no lo tiene, mostrar un estado de error controlado
      (no un crash ni una pantalla en blanco).
- [ ] Mensajes de error claros para: datos incompletos, fallo en la generación del plan,
      conflictos no resolubles.
## 5. Trazabilidad visible en UI (RF-10)
 
Cada entrada de historial debe mostrar, como mínimo:
 
- [ ] Prompt usado
- [ ] Respuesta generada (o resumen de ella)
- [ ] Fecha
- [ ] Versión del plan
- [ ] Estado (generado / aprobado / rechazado / reemplazado)
- [ ] Observaciones o ajustes del usuario, si los hubo
## 6. Usabilidad (RNF-07)
 
- [ ] El usuario debe poder entender y modificar el plan **sin confusión** — esto es
      criterio de evaluación explícito, no solo buena práctica.
- [ ] Las acciones de aprobar/rechazar/editar deben ser visibles y obvias, no escondidas
      en menús secundarios.
---
 
## Fuera de este checklist (no es responsabilidad del frontend)
 
- Integración real con el proveedor de IA generativa (API/SDK) — la implementa el equipo
  de backend. El frontend ya está conectado: `src/lib/ai/generate-plan.ts` llama a
  `POST /ai/plans/generate` sobre la API real vía `requestJson` (`src/lib/services/http/client.ts`).
- Persistencia real en base de datos — el frontend ya consume la API real vía los
  repositorios HTTP en `src/lib/services/http/*`, compuestos en `src/lib/services/index.ts`.
  (Los repositorios mock que existían en `src/lib/services/mock/*` se eliminaron por no
  estar conectados a nada; si hace falta demostrar un escenario sin backend levantado,
  usar datos mock locales en el componente, no repositorios completos.)
- La URL base de la API se resuelve con `NEXT_PUBLIC_API_BASE_URL`, con default
  `http://localhost:8000` (ver `src/lib/services/http/client.ts`). El cliente además
  adjunta el token de sesión de Supabase (`sb-*-auth-token` en `localStorage`) como
  header `Authorization: Bearer`.
- Manejo de credenciales/API keys — no deben existir en el código del frontend bajo
  ninguna circunstancia (RNF-02), pero la integración en sí es de backend.
- Documentación entregable (documento técnico, funcional, manual de usuario, catálogo de
  prompts) — son entregables de equipo, no artefactos de código.
 