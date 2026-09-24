import type { OperationType } from "./api-types";

/** Rango opcional enviado a la API en formato YYYY-MM-DD. */
export interface DateRangeFilter {
  /** Fecha inicial inclusiva, o ausencia de filtro. Se serializa como el query param API `start_date`. */
  startDate?: string;
  /** Fecha final inclusiva, o ausencia de filtro. Se serializa como el query param API `end_date`. */
  endDate?: string;
}

/** Parameters for GET /api/metrics/alerts. */
export interface AlertsParams extends DateRangeFilter {
  /** Decimal threshold greater than or equal to 0; the API query name is `threshold` and its default is 0.3. */
  threshold?: number;
}

/** Parameters for GET /api/metrics/categories/top. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Operation filter; the API query name is `operation_type`, valid values are income or outcome, and the default is outcome. */
  operationType?: OperationType;
  /** Maximum number of rows; the API query name is `limit`, an integer from 1 through 20, with default 5. */
  limit?: number;
}
