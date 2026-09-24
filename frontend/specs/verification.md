## Evidencia de API

| Afirmación | Evidencia | Estado |
|---|---|---|
| El rango de fechas se obtiene de `GET /api/metrics/facets`. | `/docs`, operación `get_metrics_facets_api_metrics_facets_get`: respuesta `MetricsFacets` con los campos `min_date` y `max_date`. Respuesta observada: `min_date: "2025-09-02"`, `max_date: "2026-08-28"`. | ✅ verificada |
| Los campos de fecha mínima y máxima se llaman `min_date` y `max_date`. | `/docs`, esquema `MetricsFacets`; ambos campos son `string` con formato `date`, están en `required` y no aceptan `null`. | ✅ verificada |
| Las fechas usan formato ISO `YYYY-MM-DD`. | `/docs`, esquema `MetricsFacets`; `min_date` y `max_date` tienen `format: date`. La respuesta real usa, por ejemplo, `2025-09-02`. | ✅ verificada |
| El endpoint de métricas usa `start_date` y `end_date`. | `/docs`, operación `get_metrics_api_metrics_get`: ambos son parámetros `query`, opcionales, tipo `date`. | ✅ verificada |
| Si faltan ambos límites, se devuelven todas las métricas disponibles. | `/docs`, `GET /api/metrics` permite ambos parámetros ausentes. Respuesta real sin filtros: 360 movimientos, desde `2025-09-02` hasta `2026-08-28`. | ✅ verificada |
| Si falta `start_date`, se filtra por `create_date <= end_date`. | Código de `get_metrics_api_metrics_get` y `filter_movements_by_date`; prueba real con `end_date=2025-12-31`: 120 movimientos, hasta `2025-12-27`. | ✅ verificada |
| Si falta `end_date`, se filtra por `create_date >= start_date`. | Código de `get_metrics_api_metrics_get` y `filter_movements_by_date`; prueba real con `start_date=2025-01-01`: no reduce el conjunto porque todos los datos son posteriores a esa fecha. | ✅ verificada |
| Los límites de fecha son inclusivos. | Código de `filter_movements_by_date`: usa `>= start_date` y `<= end_date`. | ✅ verificada |
| Una fecha inválida produce un error documentado. | `/docs`, respuesta `422` `HTTPValidationError`; prueba real con `start_date=not-a-date` devolvió `date_from_datetime_parsing`. | ✅ verificada |
| Las alertas aceptan `GET /api/metrics/alerts?threshold=<ratio>`. | `/docs`, operación `get_metrics_alerts_api_metrics_alerts_get`; `threshold` es `query`, `number`, valor predeterminado `0.3`, mínimo `0`. | ✅ verificada |
| Cada alerta tiene período, outcome, media e incremento. | `/docs`, esquema `MetricsAlert`: campos obligatorios `period: string`, `outcome_total: number`, `baseline_average: number`, `increase_ratio: number`. Respuesta real con `threshold=0.3` coincide. | ✅ verificada |
| El nombre exacto del período es `period`. | `/docs`, esquema `MetricsAlert`; la respuesta real usa valores como `"2025-12"`. | ✅ verificada |
| El campo de outcome se llama `outcome_total`. | `/docs`, esquema `MetricsAlert`; no aparece un campo `outcome`. | ✅ verificada |
| La media de referencia se llama `baseline_average`. | `/docs`, esquema `MetricsAlert`; el backend calcula la media de todos los outcomes históricos anteriores al período actual. | ✅ verificada |
| `baseline_average` es una media móvil de ventana fija. | El código de `detect_outcome_alerts` calcula `sum(historical_outcomes) / len(historical_outcomes)` con todo el historial previo; `/docs` no define ninguna ventana. | ❌ incorrecta: documentar como media acumulada de períodos anteriores |
| El incremento se devuelve como porcentaje ya multiplicado por 100. | `/docs`, campo `increase_ratio: number`; el backend calcula `(outcome - baseline) / baseline`. Respuesta real `0.7353` equivale a 73.53%, no a `73.53`. | ❌ incorrecta: es una ratio decimal |
| Top de categorías acepta `operation_type=income` y `limit=5`. | `/docs`, operación `get_top_categories_api_metrics_categories_top_get`; `operation_type` admite `income|outcome`, por defecto `outcome`, y `limit` admite enteros de `1` a `20`, por defecto `5`. | ✅ verificada |
| Cada elemento top contiene categoría, total y porcentaje. | `/docs`, esquema `TopCategoryItem`: `category`, `operation_type`, `total_amount`. No existe ningún campo de porcentaje. | ❌ incorrecta: la API no devuelve porcentaje |
| El campo de categoría se llama `category`. | `/docs`, esquema `TopCategoryItem`; enum: `suppliers`, `sales`, `operational`, `administrative`, `others`. | ✅ verificada |
| El total se llama `total_amount`. | `/docs`, esquema `TopCategoryItem`; tipo `number`. En la consulta real de income se devolvieron dos elementos: `sales` y `others`. | ✅ verificada |
| Top de categorías devuelve B2B y B2C agrupados en la misma respuesta. | `/docs`, `business_type` es un filtro opcional de `GET /api/metrics/categories/top`; la respuesta `TopCategoryItem` no contiene `business_type`. | ❌ incorrecta: solo filtra una línea por llamada; no agrupa B2B/B2C ni identifica la línea en cada resultado |
| Las facetas de negocio se obtienen con `GET /api/metrics/facets`. | `/docs`, operación `get_metrics_facets_api_metrics_facets_get`: respuesta `MetricsFacets` contiene `business_types` y `categories`. | ✅ verificada |
| El campo de líneas de negocio es `business_types`. | `/docs`, esquema `MetricsFacets`; valores observados: `["B2B", "B2C"]`. | ✅ verificada |
| Las categorías disponibles están en `categories`. | `/docs`, esquema `MetricsFacets`; valores observados: `administrative`, `operational`, `others`, `sales`, `suppliers`. | ✅ verificada |
| Las respuestas de facetas, alertas y top contienen campos opcionales o nulos. | Los campos requeridos de `MetricsFacets`, `MetricsAlert` y `TopCategoryItem` están completos en OpenAPI y no tienen tipo nullable. | ✅ verificada: no hay campos opcionales/nulos en esas respuestas |
| Los errores de alertas y top están documentados como `422`. | `/docs`: alertas responde `200, 422`; top responde `200, 422`. Pruebas reales: `threshold=-0.1`, `limit=0` y `limit=21` devolvieron `422`. | ✅ verificada |

### Desajustes resueltos

- Usar `min_date` y `max_date`, no nombres alternativos como `date_from` o `date_to`.
- Usar `period`, `outcome_total`, `baseline_average` e `increase_ratio` para alertas.
- Presentar `increase_ratio` como ratio decimal y convertirlo a porcentaje solo en la interfaz si se necesita mostrar `%`.
- No calcular ni asumir un porcentaje de categoría desde un campo inexistente; si el producto lo necesita, debe calcularse explícitamente a partir de los totales y del conjunto definido, o solicitarse una ampliación de API.
- No representar top categorías como una agrupación B2B/B2C: `business_type` solo actúa como filtro opcional y no forma parte de `TopCategoryItem`.
- Usar `business_types` y `categories` desde `/api/metrics/facets` para construir los filtros del dashboard.
