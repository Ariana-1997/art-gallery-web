// auth-admin.js — Se incluye en el <head> de TODAS las páginas *_admin.html y admin.html.
// Si no hay sesión, redirige al login antes de pintar la página.
// OJO: esto solo evita accesos casuales. En un sitio 100% front-end cualquiera
// puede editar localStorage; la seguridad real requiere un backend (ver README de mejoras).
(function () {
    if (!localStorage.getItem("usuario")) {
        window.location.replace("login.html");
    }
})();
