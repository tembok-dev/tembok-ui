// DataTable.types.ts
import type { ReactNode } from "react";

export type TableColumnId = string;
export type RowId = string | number;

export type SortDirection = "asc" | "desc";
export interface TableSortState {
    columnId: TableColumnId;
    direction: SortDirection;
}

export type DataMode = "client" | "server";

export interface PaginationState {
    /** 0-based page index */
    pageIndex: number;
    /** rows per page */
    pageSize: number;
}

export interface TableColumn<TData> {
    id: TableColumnId;
    label: ReactNode;
    accessor?: (row: TData) => unknown;
    cell?: (ctx: {
        row: TData;
        value: unknown;
        rowIndex: number;
        column: TableColumn<TData>;
    }) => ReactNode;

    isPrimary?: boolean;
    alwaysVisible?: boolean;
    defaultVisible?: boolean;

    sortable?: boolean;
    filterable?: boolean;

    summaryLabel?: ReactNode;
    summaryValue?: (rows: TData[]) => ReactNode;

    /** Layout hints */
    width?: string | number;
    /** 🔹 New: minimum width to avoid crushed cells */
    minWidth?: string | number;
    align?: "left" | "center" | "right";
}

export interface DataTableProps<TData> {
    data: TData[];
    columns: TableColumn<TData>[];

    getRowId?: (row: TData, index: number) => RowId;
    onRowClick?: (row: TData) => void;

    /** --- Selection API (already done) --- */
    enableSelection?: boolean;
    selectedRowIds?: RowId[];
    defaultSelectedRowIds?: RowId[];
    onSelectionChange?: (payload: {
        selectedIds: RowId[];
        selectedRows: TData[];
    }) => void;

    /** --- Sorting API --- */
    enableSorting?: boolean;
    sortState?: TableSortState | null;
    defaultSort?: TableSortState | null;
    onSortChange?: (state: TableSortState | null) => void;

    /** --- Data strategy + pagination --- */

    /**
     * client  → data is full dataset, table can sort + paginate locally.
     * server  → data is a single page, table only renders and emits page/sort changes.
     */
    dataMode?: DataMode;

    /** Enable pagination UI */
    enablePagination?: boolean;

    /** Controlled pagination (for server mode or advanced cases) */
    pagination?: PaginationState;

    /** Default pagination when uncontrolled */
    defaultPagination?: PaginationState;

    /**
     * Total items available.
     * - client mode: optional (falls back to data.length)
     * - server mode: should be provided so we can compute page count
     */
    totalItems?: number;

    onPaginationChange?: (state: PaginationState) => void;

    /** Styles */
    className?: string;
    tableClassName?: string;
    headerClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
}
