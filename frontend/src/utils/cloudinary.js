// Helper para inyectar transformaciones en URLs de Cloudinary.
// Doc: https://cloudinary.com/documentation/image_transformations
//
// Una URL de Cloudinary tiene este formato:
//   https://res.cloudinary.com/<cloud>/image/upload/<transformations>/<rest>
// Insertamos las transformaciones después de "/upload/".
//
// Si la URL no es de Cloudinary (ej: placeholder de placehold.co), la devuelve sin tocar.
export function cldImage(url, { w, h, q = "auto", f = "auto" } = {}) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const parts = [];
  if (w) parts.push(`w_${w}`);
  if (h) parts.push(`h_${h}`);
  parts.push(`c_fill`); // recorta para llenar el tamaño exacto
  parts.push(`q_${q}`); // calidad automática (Cloudinary elige según el contenido)
  parts.push(`f_${f}`); // formato automático (WebP/AVIF si el browser lo soporta)

  return url.replace("/upload/", `/upload/${parts.join(",")}/`);
}
