/** Operation values exposed by the metrics API. */
export type OperationType = "income" | "outcome";

/** Business lines exposed by the metrics API. */
export type BusinessType = "B2B" | "B2C";

/** Category values exposed by the metrics API. */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/**
 * Response from GET /api/metrics/facets.
 * This response is a direct JSON value, not wrapped in data, items, or results.
 */
export interface FacetsResponse {
  /** Available operation values; required, non-null, and limited to income or outcome. */
  operation_types: OperationType[];
  /** Available business lines; required, non-null, and limited to B2B or B2C. */
  business_types: BusinessType[];
  /** Available category values; required, non-null, and limited to the documented category enum. */
  categories: Category[];
  /** Earliest available movement date; required, non-null, and formatted as YYYY-MM-DD. */
  min_date: string;
  /** Latest available movement date; required, non-null, and formatted as YYYY-MM-DD. */
  max_date: string;
}

/** One anomaly row returned by GET /api/metrics/alerts. */
export interface AlertEntry {
  /** Alert period; required and non-null string. The period format follows the requested group_by value; the default is month. */
  period: string;
  /** Outcome total for the alert period; required, non-null number. */
  outcome_total: number;
  /** Average outcome baseline from preceding periods; required, non-null number. */
  baseline_average: number;
  /** Increase ratio compared with the baseline; required, non-null decimal ratio, not an integer percentage. */
  increase_ratio: number;
}

/**
 * Response from GET /api/metrics/alerts.
 * The API returns a direct array of alert rows, not a data, items, or results wrapper.
 */
export type AlertsResponse = AlertEntry[];

/** One category row returned by GET /api/metrics/categories/top. */
export interface CategoryEntry {
  /** Category name; required, non-null, and limited to the documented category enum. */
  category: Category;
  /** Operation selected for the result; required, non-null, and limited to income or outcome. */
  operation_type: OperationType;
  /** Aggregated amount for the category; required, non-null number. */
  total_amount: number;
}

/**
 * Response from GET /api/metrics/categories/top.
 * The API returns a direct array of category rows, not a data, items, or results wrapper.
 * No percentage field or business_type field is present in the documented response.
 */
export type TopCategoriesResponse = CategoryEntry[];
