// Importa automáticamente todas las imágenes de episodios y temporadas
const images = {};

// Importar todas las imágenes de la carpeta
function importAll(r) {
  r.keys().forEach((key) => {
    const name = key.replace('./', ''); // deja extensión
    images[name] = r(key);
  });
}

// Importar todas las imágenes .webp
importAll(require.context('../../assets/episodes', false, /\.webp$/));

export const episodeImages = images;
