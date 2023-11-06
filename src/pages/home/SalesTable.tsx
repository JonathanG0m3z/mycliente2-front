import * as React from 'react';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import SalesTableColumns from './SalesTableColumns';
import { useFetch, useLazyFetch } from '@/utils/useFetch';
import { Table } from 'antd';
import Swal from 'sweetalert2';
import { Alert, AlertColor, Grid, IconButton, Menu, MenuItem, Snackbar, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { Sale } from '@/types/Sales';
import { useRouter } from 'next/router';

interface AlertStateType {
  open: boolean;
  text: string;
  severety: AlertColor;
}
interface SalesFilters {
  page: number;
  limit: number;
}

export interface SalesTableRef {
  refresh: () => void;
}

interface SalesTableProps {}

const SalesTable = React.forwardRef<SalesTableRef, SalesTableProps>(function SalesTable(_props, ref) {
  const router = useRouter();
  const [loadingTable, setLoadingTable] = React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<SalesFilters>({
    page: 0,
    limit: 10,
  });
  const [alertState, setAlertState] = React.useState<AlertStateType>({
    open: false,
    text: '',
    severety: 'success',
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, limit: +event.target.value, page: 0 });
  };
  const { data, error, loading, refetch } = useFetch(`sales?page=${filters.page + 1}&limit=${filters.limit}`, 'GET');
  const { error: errorDelete, loading: loadingDelete, fetchApiData: deleteSale } = useLazyFetch();

  React.useEffect(() => {
    if (error !== null || errorDelete !== null) {
      Swal.fire({
        title: 'Algo salió mal',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        text: error?.message || errorDelete?.message,
        customClass: {
          container: 'zindex-sweetalert',
        },
      });
    }
  }, [error, errorDelete]);

  const onOpenAlert = (text: string, severety: AlertColor = 'success') => {
    setAlertState({ open: true, text, severety });
  };
  const onCloseAlert = () => {
    setAlertState({ open: false, text: '', severety: 'success' });
  };

  const refreshTable = () => {
    setLoadingTable(true);
    refetch()
      .then(() => {
        setLoadingTable(false);
      })
      .catch(() => {
        setLoadingTable(false);
      });
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null);
  const menuOpen = Boolean(anchorEl || contextMenu);
  const onClickOptions = (event: React.MouseEvent<HTMLButtonElement>, record: Sale) => {
    setSelectedSale(record);
    setAnchorEl(event.currentTarget);
  };
  const onCloseMenu = () => {
    setAnchorEl(null);
    setContextMenu(null);
    setSelectedSale(null);
  };

  const onRow = (record: any) => ({
    onContextMenu: (event: React.MouseEvent) => {
      event.preventDefault();
      setSelectedSale(record);
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
            // Other native context menus might behave different.
            // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
            null
      );
    },
  });

  const onDeleteSale = () => {
    onCloseMenu();
    if (selectedSale !== null) {
      Swal.fire({
        title: '¿Deseas eliminar esta venta?',
        text: 'Esta acción no se puede revertir',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteSale(`sales/${selectedSale.id}`, 'DELETE')
            .then(() => {
              refreshTable();
              onOpenAlert('Venta eliminada');
            })
            .catch((err) => {
              Swal.fire({
                title: 'Algo salió mal',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                text: err?.message,
                customClass: {
                  container: 'zindex-sweetalert',
                },
              });
            });
        } else {
          onOpenAlert('No se eliminó la venta', 'info');
        }
      });
    } else {
      Swal.fire({
        title: 'Algo salió mal',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        text: 'No se ha seleccionado ninguna venta',
        customClass: {
          container: 'zindex-sweetalert',
        },
      });
    }
  };

  const onEditSale = () => {
    onCloseMenu();
    if (selectedSale !== null) {
      router.push(`/sales/${selectedSale.id}`);
    } else {
      Swal.fire({
        title: 'Algo salió mal',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        text: 'No se ha seleccionado ninguna venta',
        customClass: {
          container: 'zindex-sweetalert',
        },
      });
    }
  };

  React.useImperativeHandle(ref, () => ({
    refresh() {
      refreshTable();
    },
  }));

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Table
        onRow={onRow}
        dataSource={data?.sales ?? []}
        columns={SalesTableColumns({ openMenu: onClickOptions, isMenuOpen: menuOpen })}
        loading={loading || loadingTable || loadingDelete}
        pagination={false}
        size="small"
        scroll={{ x: '100%' }}
      />
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={onCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorReference={contextMenu !== null ? 'anchorPosition' : undefined}
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem onClick={onEditSale}>Editar</MenuItem>
        <MenuItem onClick={onDeleteSale}>Eliminar</MenuItem>
      </Menu>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={11} alignItems="center">
          <TablePagination
            rowsPerPageOptions={[1, 10, 25, 100]}
            component="div"
            count={data?.total}
            rowsPerPage={filters.limit}
            page={filters.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
          />
        </Grid>
        <Grid item xs={1}>
          <Tooltip title="Refrescar">
            <IconButton onClick={refreshTable} aria-label="Refrescar" color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Snackbar open={alertState.open} autoHideDuration={5000} onClose={onCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={onCloseAlert} severity={alertState.severety} sx={{ width: '100%' }}>
          {alertState.text}
        </Alert>
      </Snackbar>
    </Paper>
  );
});

export default SalesTable;
