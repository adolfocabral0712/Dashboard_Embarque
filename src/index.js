
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/datos") {
      if (!env.DROPBOX_JSON_URL) {
        return new Response(
          JSON.stringify({
            error: "Falta configurar DROPBOX_JSON_URL"
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "no-store"
            }
          }
        );
      }

      try {
        const separador = env.DROPBOX_JSON_URL.includes("?") ? "&" : "?";

        const respuestaDropbox = await fetch(
          env.DROPBOX_JSON_URL +
            separador +
            "_=" +
            Date.now(),
          {
            headers: {
              Accept: "application/json"
            }
          }
        );

        if (!respuestaDropbox.ok) {
          return new Response(
            JSON.stringify({
              error:
                "Dropbox respondió con HTTP " +
                respuestaDropbox.status
            }),
            {
              status: 502,
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-store"
              }
            }
          );
        }

        return new Response(respuestaDropbox.body, {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            "X-Content-Type-Options": "nosniff"
          }
        });
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: "No fue posible obtener el JSON desde Dropbox"
          }),
          {
            status: 502,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "no-store"
            }
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
