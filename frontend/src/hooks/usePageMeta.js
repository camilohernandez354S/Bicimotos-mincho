import { useEffect } from "react";

// Suffix que se agrega al título de cada página (excepto la Home).
const SITE_NAME = "Bicimotos Mincho";

// Hook que setea el <title> y el <meta name="description"> de la página actual.
// Al desmontar el componente, restaura los valores por defecto del index.html.
//
// Uso:
//   usePageMeta({ title: "Catálogo", description: "Todos nuestros productos" });
//
// Si pasás title sin description, mantiene la description anterior.
export function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    const prevTitle = document.title;
    const descTag = document.querySelector('meta[name="description"]');
    const prevDescription = descTag?.getAttribute("content");

    if (title) {
      document.title = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    }
    if (description && descTag) {
      descTag.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
      if (prevDescription && descTag) descTag.setAttribute("content", prevDescription);
    };
  }, [title, description]);
}
