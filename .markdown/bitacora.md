# Detalles por solucionar

Tareas:

- Bugs aplicación móvil

1. Desde el home puedo volver a la pantalla de login sin cerrar sesión y el PIN se mantiene.
2. Si cierro la app y vuelvo a abrirla, el PIN se mantiene.
3. Hay muchos console.log() en el código y se muestran repetidamente.
4. La vista de actualizar Mi Perfil no se muestra correctamente.
5. Si el usuario no tiene foto de perfil no se está mostrando la por defecto.
6. Hay un warning sobre el manejo de las props en componentes en el StackNavigator.

7. El navbar se ve elevado y no se muestra correctamente.

8. Hay funciones asincronas que no están manejando correctamente el estado de la aplicación. Por ejemplo se utiliza try-catch pero no se está manejando el error. (solo se muestra un console.log()).
   En ese caso el try-catch es completamente innecesario.

9. La vista de ajustes debe estar linkeada a la navBar del home. De momento la vista de ajustes no tiene el mismo estilo que el home.
10. Hace falta un botón de cerrar sesión, puede estar en el menu principal al lado de mi perfil
11. El header es excesivamente grande, se debe reducir el tamaño.

12. La función de actualizar imagen de perfil no está funcionando correctamente.
13. El código debe comentarse correctamente, ya que es difícil de entender.

--- COSAS A AÑADIR ---
Pertenencia de eventos en las rutas
