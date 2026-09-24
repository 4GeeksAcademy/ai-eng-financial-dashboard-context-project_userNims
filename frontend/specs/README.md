# Frontend data contract

Este documento es el contrato de datos para una sesión nueva de trabajo frontend. La evidencia primaria es el OpenAPI activo en [`/docs`](http://localhost:8000/docs) y su documento [`/openapi.json`](http://localhost:8000/openapi.json).

## Regla de verificación

Ningún nombre de campo o parámetro se considera válido sin evidencia en `/docs`. Las anclas Swagger usadas en este contrato son:

- [`GET /api/metrics`](http://localhost:8000/docs#/default/get_metrics_api_metrics_get)
- [`GET /api/metrics/facets`](http://localhost:8000/docs#/default/get_metrics_facets_api_metrics_facets_get)
- [`GET /api/metrics/alerts`](http://localhost:8000/docs#/default/get_metrics_alerts_api_metrics_alerts_get)
- [`GET /api/metrics/categories/top`](http://localhost:8000/docs#/default/get_top_categories_api_metrics_categories_top_get)

Los tipos TypeScript de referencia están en [api-types.ts](api-types.ts) y [param-types.ts](param-types.ts). La evidencia detallada está en [verification.md](verification.md).

## Scope boundary and workflow

Esta fase es documental. Está prohibido implementar fuera de alcance: no se debe escribir JSX, crear componentes React, cambiar rutas de la aplicación, modificar el backend ni inventar un campo para cerrar una discrepancia de producto. Los cambios de implementación quedan para una fase posterior y requieren contrato resuelto.

El orden obligatorio de trabajo es:

1. **Requisito:** conservar el wording del producto y separar lo que la API realmente expone.
2. **Plan:** seleccionar endpoints, tipos, serialización, estados y criterios de vacío.
3. **Tareas:** resolver primero las decisiones bloqueadas (`business_type` en `TopCategoriesParams`, denominadores B2B/B2C y media de tres períodos).
4. **Implementación futura:** crear componentes y adaptadores solo después de cerrar esas tareas; esta fase no los implementa.
5. **Verificación:** comparar cada nombre con `/docs`, compilar los tipos en strict y probar estados de carga, error, vacío y rangos parciales.

Una sesión nueva debe detenerse y documentar una discrepancia si no puede cumplir un requisito con los campos verificados; no debe resolverla mediante una llamada inventada.

## Shared date range

- **Type:** `DateRangeFilter`.
- **Frontend fields:** `startDate?: string`, `endDate?: string`.
- **API query names:** `startDate` se serializa como `start_date`; `endDate` como `end_date`.
- **Format:** `YYYY-MM-DD`, correspondiente al formato `date` de OpenAPI.
- **Inclusion:** ambos límites son inclusivos: `create_date >= start_date` y `create_date <= end_date`.
- **Nullability:** no se envía `null`; una propiedad ausente significa que ese límite no se aplica. Las respuestas de facetas usan `min_date` y `max_date` como strings `date` obligatorios y no nulos.
- **Initial value:** `{}`. No se inventa una fecha inicial.
- **Invalid order:** si ambas fechas existen y `startDate > endDate`, la UI muestra validación local y no realiza consultas. La API no documenta un error de orden específico.

## Feature 1 — Date range

### Endpoint contract

La sección obtiene los límites disponibles con:

```text
GET /api/metrics/facets
```

OpenAPI: `get_metrics_facets_api_metrics_facets_get`.

La respuesta es un objeto directo `FacetsResponse`, no contiene `data`, `items` ni `results`:

```text
{
  operation_types: OperationType[]
  business_types: BusinessType[]
  categories: Category[]
  min_date: string
  max_date: string
}
```

`min_date` y `max_date` son obligatorios, no nulos y tienen formato `YYYY-MM-DD`.

### Request parameters

`GET /api/metrics/facets` no recibe parámetros.

El rango seleccionado se aplica a las consultas de las otras funcionalidades mediante los parámetros opcionales `start_date` y `end_date` de sus endpoints. Ambos pueden omitirse.

La consulta compartida de movimientos es:

```text
GET /api/metrics?start_date=<YYYY-MM-DD>&end_date=<YYYY-MM-DD>
```

OpenAPI: `get_metrics_api_metrics_get`. El endpoint devuelve una lista directa de movimientos con el modelo `FinancialMovement` publicado en `/docs`; esos campos pertenecen al dashboard existente y no se redefinen en los tipos de esta fase. Su contrato debe reutilizar los nombres de `/docs`, no crear un wrapper ni asumir campos adicionales.

### Response type

- TypeScript: `FacetsResponse`.
- `business_types` contiene valores `B2B | B2C`.
- `categories` contiene `suppliers | sales | operational | administrative | others`.
- `operation_types` contiene `income | outcome`.

### UI states

- **Loading:** inputs y límites disponibles en estado de carga mientras se obtiene `FacetsResponse`.
- **Success:** mostrar `min_date` y `max_date` como límites informativos de los inputs.
- **Error:** mantener la sección visible, mostrar un error explícito y no sustituir los límites por fechas inventadas.
- **Active range:** cada cambio válido actualiza el `DateRangeFilter` compartido y vuelve a solicitar métricas, alertas y top de categorías.
- **Empty results:** la sección de filtro no desaparece; cada funcionalidad dependiente presenta su propio estado vacío.

### Edge cases

1. **Both dates empty:** enviar las consultas sin `start_date` ni `end_date`; se solicitan todos los datos disponibles.
2. **Only one date present:** con solo `startDate`, enviar solo `start_date` y filtrar desde esa fecha; con solo `endDate`, enviar solo `end_date` y filtrar hasta esa fecha.
3. **Start after end:** mostrar error de validación local, no enviar una consulta y pedir corrección del rango.

## Feature 2 — Anomaly alerts

### Endpoint contract

```text
GET /api/metrics/alerts
```

OpenAPI: `get_metrics_alerts_api_metrics_alerts_get`.

El endpoint devuelve `AlertsResponse`, un array directo de `AlertEntry`; no hay wrapper `data`, `items` o `results`.

Cada fila tiene exactamente estos campos obligatorios y no nulos:

- `period: string`.
- `outcome_total: number`.
- `baseline_average: number`.
- `increase_ratio: number`.

`period` es string. Con el `group_by=month` predeterminado, las respuestas observadas usan `YYYY-MM`. `increase_ratio` es una ratio decimal: `0.7353` se presenta en UI como `73.53%`.

### Request parameters

Los parámetros válidos son:

```text
threshold: number, opcional, default 0.3, mínimo API 0
start_date: string date, opcional
end_date: string date, opcional
```

La UI aplica una restricción de producto más estrecha: `threshold` mínimo `0.01`, máximo `1.0`, inicial `0.3`. El adaptador envía el valor decimal sin multiplicarlo por 100.

El `DateRangeFilter` se serializa como `start_date` y `end_date`. `group_by` existe en `/docs`, pero no forma parte de `AlertsParams`; se conserva el default `month`.

### Response type

- TypeScript: `AlertsResponse` y `AlertEntry`.
- Columna **Período**: `period`.
- Columna **Outcome registrado**: `outcome_total`.
- Columna **Media de referencia**: `baseline_average`.
- Columna **Incremento porcentual**: `increase_ratio * 100` solo para presentación.

La API calcula `baseline_average` con todos los outcomes históricos anteriores, no con una ventana móvil fija de tres períodos. Por tanto, el contrato frontend debe etiquetarlo como **Media de referencia**. Cumplir literalmente “media móvil de los tres períodos anteriores” requiere una ampliación backend o una fuente adicional; no se debe presentar el valor actual como si tuviera esa semántica.

### UI states

- **Loading:** conservar la tabla y sus cuatro columnas; mostrar filas de carga.
- **Success with rows:** renderizar las cuatro columnas y una fila por `AlertEntry`.
- **Empty:** conservar la tabla visible y mostrar `No se detectaron anomalías para el umbral y período seleccionados`.
- **Error:** conservar el contenedor visible y mostrar error de red o `422 Validation Error`; no convertir un error en una tabla vacía.
- **Update:** ante un cambio válido de `threshold` o del rango, reemplazar las filas con el resultado de la nueva consulta.

### Edge cases

1. **Empty result:** `AlertsResponse = []`; la tabla no desaparece y muestra el mensaje de vacío.
2. **Threshold out of range:** valores `< 0.01`, `> 1.0`, vacíos o no numéricos son inválidos localmente y no se envían. Además, la API rechaza valores menores que `0` con `422`.
3. **Range with no data:** conservar el rango y mostrar el estado vacío; no sustituirlo por el rango global.
4. **Partial range:** omitir únicamente el parámetro ausente; no enviar `null`.

## Feature 3 — B2B vs B2C

### Page and shared controls

- **Page name:** `BusinessComparisonPage`.
- **Frontend route:** `/business-comparison`.
- **Date control:** reutiliza `DateRangeFilter` y `DateRangeFilterSection`.
- **Business options:** `FacetsResponse.business_types`, con valores verificados `B2B` y `B2C`.
- **Category options:** `FacetsResponse.categories`; no se deben inventar categorías.

La ruta `/business-comparison` es frontend. No es una ruta FastAPI.

### Endpoint contract

Cada panel solicita el top de ingresos de su línea:

```text
GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B
GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C
```

El rango activo añade opcionalmente `start_date` y `end_date`.

OpenAPI: `get_top_categories_api_metrics_categories_top_get`.

Parámetros verificados:

- `operation_type`: opcional, valores `income | outcome`, default `outcome`.
- `limit`: opcional, entero de `1` a `20`, default `5`.
- `business_type`: opcional, valores `B2B | B2C`.
- `start_date` y `end_date`: opcionales, formato `date`.

`TopCategoriesParams` modela `operationType`, `limit`, `startDate` y `endDate`. Como la vista necesita separar B2B y B2C, el adaptador debe añadir `business_type` al contrato de parámetros antes de implementar la consulta. Ese campo sí está verificado en `/docs`, pero todavía no existe en `TopCategoriesParams`; no se debe ocultar esta diferencia.

### Response type

Cada llamada devuelve `TopCategoriesResponse`, un array directo de `CategoryEntry`:

- `category: Category`.
- `operation_type: OperationType`.
- `total_amount: number`.

No existe `percentage` ni `business_type` en `CategoryEntry`.

La UI renderiza dos paneles en paralelo, uno B2B y otro B2C. Cada tabla tiene hasta cinco filas y estas tres columnas:

1. **Nombre:** `category`.
2. **Total de ingresos:** `total_amount` con `operation_type=income`.
3. **Porcentaje del total del grupo:** requiere un denominador adicional.

La API top no devuelve el total general de ingresos de la línea y `limit=5` puede truncar categorías. Por eso el porcentaje exacto del total del grupo no puede calcularse solo con `TopCategoriesResponse`. La decisión de contrato es bloquear esa columna hasta elegir una fuente verificada para el denominador: ampliar el backend, consultar movimientos completos B2B/B2C o cambiar explícitamente la métrica a porcentaje del top devuelto. No se implementará una cifra truncada etiquetada como total del grupo.

### Comparison chart

Debajo de los dos paneles habrá un único gráfico con el total B2B y el total B2C. El total debe provenir de la misma fuente completa que resuelva el denominador de porcentaje; no se sumarán únicamente las cinco filas top.

### UI states

- **Facets loading/error:** mantener la página y sus controles visibles; mostrar carga o error explícito sin inventar líneas ni categorías.
- **Panel loading:** cada panel puede cargar de forma independiente.
- **Panel success:** mostrar las filas recibidas, hasta cinco.
- **Panel error:** mantener el panel visible con su error; no ocultarlo ni convertirlo silenciosamente en vacío.
- **Panel empty:** si un top devuelve `[]`, mantener ese panel y mostrar un estado vacío explícito.
- **Comparison chart loading/error/empty:** controlar su estado de forma independiente de las tablas.

### Edge cases

1. **B2B panel empty:** renderizar el panel B2B con estado vacío; el panel B2C sigue visible y operativo.
2. **B2C panel empty:** renderizar el panel B2C con estado vacío; el panel B2B sigue visible y operativo.
3. **Fewer than five categories:** renderizar solo las categorías devueltas; no rellenar filas inventadas.
4. **Range with no results:** conservar ambos paneles y mostrar vacío de forma independiente; el gráfico no muestra un total inventado.
5. **Missing percentage denominator:** mostrar estado bloqueado o no disponible para el porcentaje y para el gráfico hasta consultar una fuente completa; no usar la suma del top-5 como total del grupo.

## Verification checklist

- [x] All endpoints match `/docs`.
- [x] All response fields match `/docs`.
- [x] No `any` or `object` in the reference types.
- [x] Empty states are explicit.
- [x] TypeScript reference types compile with strict validation.
- [ ] Backend contract extended or selected to provide the exact three-period rolling average.
- [ ] Backend contract extended or selected to provide complete business totals/percentages for B2B vs B2C.
- [ ] `TopCategoriesParams` extended with the verified `business_type` query parameter for the two panel requests.
