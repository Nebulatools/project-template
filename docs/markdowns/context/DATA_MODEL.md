# Nomenclatura de Nombres en Tablas de Base de Datos

## Prefijos

SYS_*  -  SYSTEM  -  Tablas de control interno del sistema (no están disponibles visualmente para edición dentro de la aplicación).

CAT_*  -  CATALOG  -  Tablas de catálogos ABC (altas, bajas y cambios) del sistema.

DET_*  -  DETAIL  -  Tablas que guardan el detalle de alguna otra tabla main, en la que un registro, puede tener varios ligados en esta tabla.

REC_*  -  RECORD  -  Tablas de registro y/o auditoría del sistema.

LOG_*  -  LOG/AUDIT  -  Tablas de registro que a diferencia de las REC suelen ser temporales para debug o pruebas/monitoreo.

TRN_*  -  TRANSACCTION  -  Tablas de alta transaccionalidad de registros, por lo general guardan la información core del sistema.

REL_*  -  RELATIONS  -  Tablas intermediarias de marcar la relación de ID's de dos o más tablas principales del sistema.

HST_*  -  HISTORY  -  Tablas que una vez caducada la data de las tablas TRN, se respalda toda la info en las tablas históricas.
