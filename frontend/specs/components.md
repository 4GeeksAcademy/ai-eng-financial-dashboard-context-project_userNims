# Especificación de componentes del dashboard

Esta especificación usa `FacetsResponse`, `AlertEntry`, `AlertsResponse`, `CategoryEntry`, `TopCategoriesResponse`, `DateRangeFilter`, `AlertsParams` y `TopCategoriesParams` definidos en `api-types.ts` y `param-types.ts`.

Los componentes descritos aquí son contratos de comportamiento. No incluyen JSX ni implementación.

## Funcionalidad 1: filtro de rango de fechas

### Componente

`DateRangeFilterSection`

Sección reutilizable que contiene dos inputs de fecha:

- `start`: representa `DateRangeFilter.startDate` y se serializa como `start_date`.
- `end`: representa `DateRangeFilter.endDate` y se serializa como `end_date`.

### Props

```text
DateRangeFilterSectionProps {
  value: DateRangeFilter
  facets: FacetsResponse | null
  loadingFacets: boolean
  facetsError: string | null
  onChange: (value: DateRangeFilter) => void
}
```

- `value` no inventa una fecha inicial. Su valor inicial es `{}`: ambas propiedades ausentes.
- `facets` contiene `min_date` y `max_date` en formato `YYYY-MM-DD` cuando la carga termina correctamente.
- `loadingFacets` controla el estado de carga de `GET /api/metrics/facets`.
- `facetsError` contiene el error de facetas o `null` si no existe.
- `onChange` emite el rango conceptual en camelCase; el adaptador HTTP debe mapearlo a `start_date` y `end_date`.

### Presentación y formato

- Mostrar `facets.min_date` como mínimo disponible.
- Mostrar `facets.max_date` como máximo disponible.
- Los dos inputs usan valores HTML de fecha y solo aceptan/emitirán `YYYY-MM-DD`.
- No mostrar ni enviar una fecha por defecto cuando no hay filtro.
- Las fechas del API son inclusivas: `create_date >= start_date` y `create_date <= end_date`.

### Reglas de actualización

- Cada cambio válido actualiza el estado compartido `DateRangeFilter`.
- El rango activo debe actualizar coordinadamente todas las consultas del dashboard: métricas, alertas y top de categorías.
- Con ambos inputs vacíos se solicita `GET /api/metrics` sin `start_date` ni `end_date`; eso solicita todos los datos disponibles.
- Solo con `startDate`, se envía únicamente `start_date`; se incluyen movimientos desde esa fecha.
- Solo con `endDate`, se envía únicamente `end_date`; se incluyen movimientos hasta esa fecha.
- Con ambos valores, se envían ambos parámetros.
- Si `startDate` es posterior a `endDate`, el componente muestra un error de validación local, no dispara nuevas consultas y conserva el rango para que el usuario lo corrija. La API no documenta un error específico de orden; no se debe inventar uno.

### Estados

- **Carga:** conservar los inputs deshabilitados o en estado de carga y mostrar que se están obteniendo los límites de facetas.
- **Éxito:** mostrar los límites `min_date` y `max_date` reales.
- **Error:** mantener la sección visible, mostrar un error explícito y no sustituir los límites por fechas inventadas. Los inputs pueden seguir funcionando con validación local.
- **Rango sin resultados:** el filtro permanece visible; cada funcionalidad dependiente muestra su propio estado vacío.

## Funcionalidad 2: tabla de anomalías

### Componente

`AnomaliesTable`

Tabla alimentada por `GET /api/metrics/alerts`.

### Props

```text
AnomaliesTableProps {
  params: AlertsParams
  entries: AlertsResponse
  loading: boolean
  error: string | null
  onParamsChange: (params: AlertsParams) => void
}
```

- `params.threshold` es un número decimal entre `0.01` y `1.0`, con valor inicial `0.3`.
- `params.startDate` y `params.endDate` reutilizan `DateRangeFilter` y se serializan como `start_date` y `end_date`.
- `entries` es el array directo `AlertsResponse`, sin `data`, `items` ni `results`.
- `loading` y `error` controlan los estados de consulta.

### Control de threshold

- Input numérico con mínimo de interfaz `0.01`, máximo `1.0` y valor inicial `0.3`.
- En la API, `threshold` se llama exactamente `threshold`, es opcional, tiene default `0.3` y acepta valores `>= 0`. El rango `0.01..1.0` es una restricción de producto de la interfaz, no una restricción completa documentada por FastAPI.
- Valores menores que `0.01` o mayores que `1.0` muestran validación local y no se consultan.
- Un valor vacío o no numérico deja el control en estado inválido, muestra un error y no envía la consulta.
- No convertir el valor a porcentaje antes de enviarlo: `0.3` se envía como ratio decimal.

### Consulta y actualización

- Cada cambio válido de `threshold` o del rango activo vuelve a solicitar:

```text
GET /api/metrics/alerts?threshold=<ratio>&start_date=<YYYY-MM-DD>&end_date=<YYYY-MM-DD>
```

- Omite `start_date` y/o `end_date` cuando la propiedad correspondiente está ausente.
- `group_by` no forma parte de `AlertsParams`; se usa el default documentado de la API (`month`) salvo que el contrato de tipos se amplíe explícitamente.

### Columnas

La tabla conserva exactamente cuatro columnas:

1. **Período**: `AlertEntry.period`. Es `string`; su formato depende de `group_by` y no está formalizado como un formato adicional en OpenAPI. Con el default `month`, las respuestas observadas tienen formato `YYYY-MM`.
2. **Outcome registrado**: `AlertEntry.outcome_total`, número.
3. **Media de referencia**: `AlertEntry.baseline_average`, número.
4. **Incremento porcentual**: `AlertEntry.increase_ratio`, ratio decimal convertida visualmente a porcentaje (`0.7353` se muestra como `73.53%`). No llega ya formateada como porcentaje entero.

### Desajuste del requisito de media móvil

El wording del PM pide “media móvil de los tres períodos anteriores”. La API verificada no proporciona eso: `baseline_average` es la media acumulada de todos los períodos anteriores y `AlertEntry` no contiene la ventana usada.

Por tanto, esta especificación debe mostrar la columna como **Media de referencia** y mapearla a `baseline_average`. Para cumplir literalmente “tres períodos anteriores” hace falta una ampliación del backend o una fuente adicional documentada; no se debe etiquetar el valor actual como media móvil de tres períodos.

### Estados

- **Carga:** mostrar la tabla en estado de carga sin borrar el encabezado ni cambiar el número de columnas.
- **Error:** mantener la tabla visible y mostrar un error de consulta; errores posibles incluyen `422` por parámetros inválidos y errores de red.
- **Vacío:** mantener la tabla visible con sus cuatro columnas y mostrar: `No se detectaron anomalías para el umbral y período seleccionados`.
- La tabla nunca desaparece cuando `entries` es un array vacío.

## Funcionalidad 3: vista B2B vs B2C

### Página y componente

- Página nueva: `BusinessComparisonPage`.
- Ruta propuesta: `/business-comparison`.
- La ruta es una decisión de frontend; no corresponde a una ruta FastAPI y no debe confundirse con `/api/metrics/b2b` o `/api/metrics/b2c`.

### Props de la vista

```text
BusinessComparisonPageProps {
  dateRange: DateRangeFilter
  facets: FacetsResponse | null
  loadingFacets: boolean
  facetsError: string | null
}
```

La vista reutiliza `DateRangeFilterSection` y obtiene las opciones de negocio y categorías desde:

```text
GET /api/metrics/facets
```

- `facets.business_types` proporciona `B2B` y `B2C`.
- `facets.categories` proporciona `administrative`, `operational`, `others`, `sales` y `suppliers`.
- No se deben hardcodear esas opciones si están disponibles en facetas.

### Paneles

Renderizar siempre dos paneles en paralelo, identificados por `BusinessType`:

- Panel `B2B`.
- Panel `B2C`.

Cada panel recibe un estado independiente:

```text
BusinessPanelProps {
  businessType: BusinessType
  entries: TopCategoriesResponse
  loading: boolean
  error: string | null
}
```

Cada panel muestra una tabla de hasta cinco `CategoryEntry` con exactamente estas columnas:

1. **Nombre**: `CategoryEntry.category`.
2. **Total de ingresos**: `CategoryEntry.total_amount` cuando la consulta usa `operation_type=income`.
3. **Porcentaje del total del grupo**: valor derivado, no campo de `CategoryEntry`.

### Consulta de top categorías

Para cada panel, el adaptador debe enviar los nombres de query exactos:

```text
GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B
GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C
```

El rango activo añade opcionalmente `start_date` y `end_date`.

`TopCategoriesParams` cubre `operationType`, `limit`, `startDate` y `endDate`, con estos mapeos:

- `operationType` -> `operation_type`.
- `limit` -> `limit`.
- `startDate` -> `start_date`.
- `endDate` -> `end_date`.

El endpoint también documenta `business_type`, pero `TopCategoriesParams` no lo modela actualmente. El adaptador debe resolver esta diferencia añadiendo ese parámetro al contrato de consulta antes de implementar la vista; no se debe fingir que `TopCategoriesResponse` identifica la línea de negocio porque `CategoryEntry` no contiene `business_type`.

### Porcentaje y limitación de datos

`CategoryEntry` no contiene porcentaje y el endpoint top no devuelve el total general de ingresos del grupo. Por ello no es posible calcular de forma exacta “porcentaje del total del grupo” usando solo `TopCategoriesResponse` con `limit=5`.

La especificación debe elegir una de estas resoluciones explícitas antes de implementación:

- ampliar el backend para devolver el total del grupo o el porcentaje;
- consultar una fuente documentada de movimientos del negocio y sumar sus ingresos para obtener el denominador;
- cambiar el requisito a “porcentaje del total de las categorías devueltas”, dejando claro que no es el total del grupo.

No se debe implementar una fórmula y etiquetarla como porcentaje del grupo sin disponer del denominador real.

### Gráfico comparativo

Debajo de ambos paneles renderizar un único gráfico comparativo con dos series o barras:

- total B2B;
- total B2C.

El total debe provenir de una fuente documentada que incluya todos los ingresos de cada línea, no de la suma truncada de los cinco resultados top. Mientras la API no exponga ese total en `TopCategoriesResponse`, el gráfico queda bloqueado por la misma limitación del denominador.

### Estados y datos faltantes

- **Carga de facetas:** mostrar estado de carga para los controles y no inventar categorías o líneas.
- **Error de facetas:** mostrar error explícito y mantener la estructura de la página.
- **Carga de panel:** cada panel muestra su propio estado de carga.
- **Error de panel:** el panel afectado permanece visible con su error; el otro panel no desaparece.
- **Vacío B2B:** mantener el panel B2B visible y mostrar un estado vacío explícito si su top-5 no contiene datos.
- **Vacío B2C:** mantener el panel B2C visible y mostrar un estado vacío explícito si su top-5 no contiene datos.
- Si hay menos de cinco categorías, mostrar solo las categorías devueltas y conservar la tabla; no rellenar filas con categorías inventadas.
- Si el rango no produce resultados, cada panel muestra su vacío independiente y el gráfico muestra su propio estado sin datos.
- Errores `422`, errores de red y datos faltantes no deben ocultar silenciosamente ningún panel.
