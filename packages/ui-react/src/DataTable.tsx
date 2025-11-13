// DataTable.tsx
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type {
  DataTableProps,
  TableColumn,
  RowId,
  TableSortState,
  DataMode,
  PaginationState,
} from "./utils/DataTable.types";
import { Button } from "./Button";

export type {
  DataTableProps,
  TableColumn,
  RowId,
  TableSortState,
  DataMode,
  PaginationState,
} from "./utils/DataTable.types";

const DEFAULT_COLUMN_MIN_WIDTH = 120;

function getCellValue<T>(row: T, column: TableColumn<T>): unknown {
  if (column.accessor) return column.accessor(row);
  const key = column.id as keyof T;
  const value = row[key];
  if (typeof value === "function") return undefined;
  return value;
}

function getSortValue<T>(row: T, column: TableColumn<T>): string | number {
  const raw = getCellValue(row, column);
  if (raw == null) return "";
  if (typeof raw === "number") return raw;
  if (raw instanceof Date) return raw.getTime();
  return String(raw);
}

const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 20,
};


/**
 * DataTable — generic table with sorting, selection and optional pagination.
 *
 * - `data`: array of rows (`TData`)
 * - `columns`: column config (id, label, optional accessor/cell, width, align)
 * - Selection: `enableSelection` + `onSelectionChange`
 * - Sorting (client): `enableSorting`, `defaultSort` or controlled `sortState`
 * - Pagination: `enablePagination` + `dataMode="client" | "server"` and
 *   optional `pagination` / `totalItems` / `onPaginationChange`
 *
 * Basic usage:
 * const columns = [
 *   { id: "name", label: "Nombre", isPrimary: true },
 *   { id: "email", label: "Email" },
 * ];
 *
 * <DataTable
 *   data={rows}
 *   columns={columns}
 *   getRowId={(row) => row.id}
 *   enableSorting
 *   enablePagination
 *   dataMode="client"
 *   onRowClick={(row) => openDetail(row)}
 * />;
 */


export function DataTable<TData>(props: DataTableProps<TData>) {
  const {
    data,
    columns,
    getRowId,
    onRowClick,

    enableSelection,
    selectedRowIds,
    defaultSelectedRowIds,
    onSelectionChange,

    enableSorting = true,
    sortState,
    defaultSort = null,
    onSortChange,

    dataMode = "client",
    enablePagination,
    pagination,
    defaultPagination = DEFAULT_PAGINATION,
    totalItems,
    onPaginationChange,

    className,
    tableClassName,
    headerClassName,
    rowClassName,
    cellClassName,
  } = props;

  const mode: DataMode = dataMode;

  const wrapperClassName = ["tmbk-theme tmbk-datatable", className]
    .filter(Boolean)
    .join(" ");
  const tableCls = ["tmbk-datatable__table", tableClassName]
    .filter(Boolean)
    .join(" ");
  const headCls = ["tmbk-datatable__head", headerClassName]
    .filter(Boolean)
    .join(" ");

  // --- primary column ---

  const primaryColumnId = useMemo(() => {
    const explicit = columns.find((c) => c.isPrimary)?.id;
    return explicit ?? columns[0]?.id;
  }, [columns]);

  const visibleColumns = columns;

  // --- rows with IDs ---

  const rawRows = useMemo(
    () =>
      data.map((row, index) => ({
        row,
        rowId: getRowId ? getRowId(row, index) : (index as RowId),
      })),
    [data, getRowId],
  );

  // --- sorting state ---

  const [internalSort, setInternalSort] = useState<TableSortState | null>(
    () => defaultSort,
  );
  const currentSort = sortState ?? internalSort;

  function setSort(next: TableSortState | null) {
    if (!sortState) setInternalSort(next);
    onSortChange?.(next);
  }

  function handleHeaderClick(column: TableColumn<TData>) {
    if (!enableSorting || !column.sortable) return;
    if (!column.id) return;

    if (!currentSort || currentSort.columnId !== column.id) {
      setSort({ columnId: column.id, direction: "asc" });
    } else if (currentSort.direction === "asc") {
      setSort({ columnId: column.id, direction: "desc" });
    } else {
      setSort(null);
    }
  }

  const sortedRows = useMemo(() => {
    if (!currentSort || mode === "server") return rawRows;

    const sortCol = columns.find((c) => c.id === currentSort.columnId);
    if (!sortCol) return rawRows;

    const sorted = [...rawRows].sort((a, b) => {
      const av = getSortValue(a.row, sortCol);
      const bv = getSortValue(b.row, sortCol);
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });

    if (currentSort.direction === "desc") sorted.reverse();
    return sorted;
  }, [rawRows, currentSort, columns, mode]);

  // --- pagination state ---

  const [internalPagination, setInternalPagination] =
    useState<PaginationState>(() => defaultPagination);

  const currentPagination = pagination ?? internalPagination;

  const effectiveTotalItems =
    mode === "client"
      ? sortedRows.length
      : totalItems ?? sortedRows.length;

  const pageCount =
    enablePagination && effectiveTotalItems > 0
      ? Math.max(1, Math.ceil(effectiveTotalItems / currentPagination.pageSize))
      : 1;

  const clampedPageIndex = Math.min(
    currentPagination.pageIndex,
    pageCount - 1,
  );

  function setPaginationState(next: PaginationState) {
    if (!pagination) setInternalPagination(next);
    onPaginationChange?.(next);
  }

  function goToPage(newIndex: number) {
    const clamped = Math.max(0, Math.min(newIndex, pageCount - 1));
    if (clamped === clampedPageIndex) return;
    setPaginationState({ ...currentPagination, pageIndex: clamped });
  }

  function nextPage() {
    goToPage(clampedPageIndex + 1);
  }

  function prevPage() {
    goToPage(clampedPageIndex - 1);
  }

  const pageRows = useMemo(() => {
    if (!enablePagination) return sortedRows;

    if (mode === "server") {
      return sortedRows;
    }

    const start = clampedPageIndex * currentPagination.pageSize;
    const end = start + currentPagination.pageSize;
    return sortedRows.slice(start, end);
  }, [sortedRows, enablePagination, mode, clampedPageIndex, currentPagination]);

  // --- selection ---

  const [internalSelected, setInternalSelected] = useState<Set<RowId>>(
    () => new Set(defaultSelectedRowIds ?? []),
  );

  const selectedSet = useMemo<Set<RowId>>(() => {
    if (selectedRowIds) return new Set(selectedRowIds);
    return internalSelected;
  }, [selectedRowIds, internalSelected]);

  useEffect(() => {
    if (!selectedRowIds && defaultSelectedRowIds) {
      setInternalSelected(new Set(defaultSelectedRowIds));
    }
  }, [defaultSelectedRowIds, selectedRowIds]);

  function emitSelectionChange(next: Set<RowId>) {
    const ids = Array.from(next);
    const selectedRows = rawRows
      .filter((r) => next.has(r.rowId))
      .map((r) => r.row);
    onSelectionChange?.({ selectedIds: ids, selectedRows });
  }

  function updateSelection(next: Set<RowId>) {
    if (!selectedRowIds) setInternalSelected(next);
    emitSelectionChange(next);
  }

  function toggleRowSelection(rowId: RowId) {
    const next = new Set(selectedSet);
    if (next.has(rowId)) next.delete(rowId);
    else next.add(rowId);
    updateSelection(next);
  }

  const visibleIds = pageRows.map((r) => r.rowId);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));
  const someVisibleSelected =
    visibleIds.some((id) => selectedSet.has(id)) && !allVisibleSelected;

  function toggleAllVisible() {
    const next = new Set<RowId>(selectedSet);
    if (allVisibleSelected) {
      visibleIds.forEach((id) => next.delete(id));
    } else {
      visibleIds.forEach((id) => next.add(id));
    }
    updateSelection(next);
  }

  // --- render ---

  return (
    <div className={wrapperClassName}>
      {/* Scrollable region: header + rows */}
      <div className="tmbk-datatable__scroll">
        <div className="tmbk-datatable__scroll-hint" />

        <table className={tableCls}>
          <thead className={headCls}>
            <tr>
              {enableSelection && (
                <th className="tmbk-datatable__header-cell tmbk-datatable__cell--select">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    aria-checked={
                      someVisibleSelected ? "mixed" : allVisibleSelected
                    }
                    onChange={toggleAllVisible}
                  />
                </th>
              )}

              {visibleColumns.map((column) => {
                const isPrimary = column.id === primaryColumnId;
                const isSorted =
                  !!currentSort && currentSort.columnId === column.id;
                const sortDir = isSorted ? currentSort!.direction : undefined;
                const sortable = enableSorting && column.sortable;

                const headerClasses = [
                  "tmbk-datatable__header-cell",
                  isPrimary && "tmbk-datatable__header-cell--primary",
                  sortable && "tmbk-datatable__header-cell--sortable",
                ]
                  .filter(Boolean)
                  .join(" ");

                const style: React.CSSProperties = {
                  width: column.width as any,
                  minWidth:
                    (column.minWidth as any) ??
                    `${DEFAULT_COLUMN_MIN_WIDTH}px`,
                  textAlign: column.align ?? "left",
                };

                return (
                  <th
                    key={column.id}
                    className={headerClasses}
                    style={style}
                    onClick={
                      sortable ? () => handleHeaderClick(column) : undefined
                    }
                  >
                    <span className="tmbk-datatable__header-label">
                      {column.label}
                      {sortable && (
                        <span className="tmbk-datatable__sort-indicator">
                          {isSorted ? (sortDir === "asc" ? "↑" : "↓") : ""}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  className="tmbk-datatable__empty"
                  colSpan={visibleColumns.length + (enableSelection ? 1 : 0)}
                >
                  No hay datos para mostrar.
                </td>
              </tr>
            ) : (
              pageRows.map(({ row, rowId }, rowIndex) => {
                const clickable = !!onRowClick;
                const isSelected = selectedSet.has(rowId);

                const rowClasses = [
                  "tmbk-datatable__row",
                  rowClassName,
                  clickable && "tmbk-datatable__row--clickable",
                  isSelected && "tmbk-datatable__row--selected",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <tr
                    key={rowId}
                    className={rowClasses}
                    onClick={
                      clickable ? () => onRowClick?.(row) : undefined
                    }
                  >
                    {enableSelection && (
                      <td
                        className="tmbk-datatable__cell tmbk-datatable__cell--select"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(rowId)}
                        />
                      </td>
                    )}

                    {visibleColumns.map((column) => {
                      const value = getCellValue(row, column);
                      const isPrimary = column.id === primaryColumnId;

                      let content: ReactNode;
                      if (column.cell) {
                        content = column.cell({
                          row,
                          value,
                          rowIndex,
                          column,
                        });
                      } else {
                        content = value as ReactNode;
                      }

                      const cellClasses = [
                        "tmbk-datatable__cell",
                        isPrimary && "tmbk-datatable__cell--primary",
                        cellClassName,
                      ]
                        .filter(Boolean)
                        .join(" ");

                      const style: React.CSSProperties = {
                        textAlign: column.align ?? "left",
                        minWidth:
                          (column.minWidth as any) ??
                          `${DEFAULT_COLUMN_MIN_WIDTH}px`,
                      };

                      return (
                        <td key={column.id} className={cellClasses} style={style}>
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <div className="tmbk-datatable__footer">
          <span className="tmbk-datatable__footer-text">
            Página {clampedPageIndex + 1} de {pageCount}
            {effectiveTotalItems > 0 && (
              <span className="tmbk-datatable__footer-meta">
                {" "}
                · {effectiveTotalItems} registros
              </span>
            )}
          </span>
          <div className="tmbk-datatable__footer-actions">
            <Button
              intent="neutral"
              size="sm"
              disabled={clampedPageIndex === 0}
              onClick={prevPage}
            >
              Anterior
            </Button>
            <Button
              intent="neutral"
              size="sm"
              disabled={clampedPageIndex >= pageCount - 1}
              onClick={nextPage}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
