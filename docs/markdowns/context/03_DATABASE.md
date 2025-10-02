# NOMENCLATURA DE TABLAS DE BASE DE DATOS

## Prefijos

`SYS_*`     SYSTEM      Tablas de control interno del sistema (no están
                        disponibles visualmente para edición dentro de la aplicación).

`CAT_*`     CATALOG     Tablas de catálogos ABC (altas, bajas y cambios) del sistema.

`DET_*`     DETAIL      Tablas que guardan el detalle de alguna otra tabla main, en
                        la que un registro, puede tener varios ligados en esta tabla.

`REC_*`     RECORD      Tablas de registro y/o auditoría del sistema.

`LOG_*`     LOG/AUDIT   Tablas de registro que a diferencia de las REC suelen ser
                        temporales para debug o pruebas/monitoreo.

`TRN_*`  TRANSACCTION   Tablas de alta transaccionalidad de registros, por
                        lo general guardan la información core del sistema.

`REL_*`     RELATIONS   Tablas intermediarias de marcar la relación de ID's
                        de dos o más tablas principales del sistema.

`HST_*`     HISTORY     Tablas que una vez caducada la data de las tablas TRN,
                        se respalda toda la info en las tablas históricas.

## Tablas Base

`sys_options`
- opt_id

`sys_status`
- sts_id        INT, PK, NOT NULL, AUTO_INCREMENT
- sts_name1     VARCHAR(30), NULL, DEFAULT NULL
- sts_name2     VARCHAR(30), NULL, DEFAULT NULL
- sts_flag      INT(1), NULL, DEFAULT NULL
- sts_order     INT(2), NULL, DEFAULT NULL

`sys_roles`
- rol_id        INT, PK, NOT NULL, AUTO_INCREMENT
- rol_name1     VARCHAR(30), NULL, DEFAULT NULL
- rol_name2     VARCHAR(30), NULL, DEFAULT NULL
- rol_flag      INT(1), NULL, DEFAULT NULL
- rol_order     INT(2), NULL, DEFAULT NULL

`sys_profiles`
- pfl_id

`cat_users`
- usr_id        INT, PK, NOT NULL, AUTO_INCREMENT
- usr_name      VARCHAR(30), NULL, DEFAULT NULL
- usr_email     VARCHAR(30), NULL, DEFAULT NULL
- usr_phone     VARCHAR(30), NULL, DEFAULT NULL
- usr_passwd    VARCHAR(30), NULL, DEFAULT NULL
- usr_dt_ini    DATETIME, NULL, DEFAULT NULL
- usr_dt_edit   DATETIME, NULL, DEFAULT NULL
- usr_dt_fin    DATETIME, NULL, DEFAULT NULL
- usr_rol       INT, NOT NULL
- usr_sts       INT, NOT NULL

`rec_audit`
- aud_id            INT, PK, NOT NULL, AUTO_INCREMENT
- aud_date          TIMESTAMP(6), NOT NULL
- aud_usr           INT, NOT NULL
- aud_event         VARCHAR(30), NULL, DEFAULT NULL
- aud_element       VARCHAR(30), NULL, DEFAULT NULL
- aud_values1       LONGTEXT, NULL, DEFAULT NULL
- aud_values2       LONGTEXT, NULL, DEFAULT NULL
- aud_description   LONGTEXT, NULL, DEFAULT NULL
