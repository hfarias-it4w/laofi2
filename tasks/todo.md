# Admin Layer + Pagina INTERNO

## Completado

- [x] Crear helper `/src/lib/adminEmails.ts` con `getAdminEmails()` e `isAdminEmail()`
- [x] Agregar `ADMIN_EMAILS` a `.env.example`
- [x] Auto-asignar rol admin en `/api/register/route.ts`
- [x] Sincronizar rol admin en login (`authOptions.ts`)
- [x] Agregar estado "entregado" en `/pedidos/page.tsx` (filtro + dropdown + color azul)
- [x] Crear pagina `/interno/page.tsx` con gestion de cafes y pedidos paginados
- [x] Agregar link [INTERNO] en footer para admins

## Verificacion

Build exitoso. Pagina `/interno` incluida en build (3.39 kB).

## Para probar

1. Agregar tu email a `ADMIN_EMAILS` en `.env.local`
2. Registrar nuevo usuario con ese email -> verificar `role: admin` en DB
3. Login con usuario existente cuyo email ahora esta en whitelist -> verificar actualizacion de rol
4. Acceder `/interno` como admin -> debe cargar
5. Acceder `/interno` como user normal -> acceso denegado
6. Crear cafe con todos los campos -> verificar en DB y `/productos`
7. Marcar pedido como entregado -> verificar cambio de estado
8. En `/pedidos`, filtrar por "Entregado" -> debe mostrar pedidos marcados
