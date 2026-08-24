import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // 1. Extraer el primer enlace (href) de la fila antes de reestructurar
    const linkElement = row.querySelector('a');
    const href = linkElement ? linkElement.getAttribute('href') : null;

    while (row.firstElementChild) li.append(row.firstElementChild);

    // 2. Clasificar los divs manteniendo solo la imagen y opcionalmente la descripción
    [...li.children].forEach((div, index) => {
      if (index === 0 && div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'red-image';
      } else if (index === 2) {
        div.className = 'red-description';
      } else {
        // Se elimina la sección red-body del DOM
        div.remove();
      }
    });

    // 3. Envolver el <picture> dentro de un tag <a> usando el href extraído
    const imageContainer = li.querySelector('.red-image');
    const picture = imageContainer?.querySelector('picture');

    if (picture && href) {
      const link = document.createElement('a');
      link.href = href;
      link.className = 'red-image-link';
      
      // Si el enlace original tenía atributos como target="_blank", se conservan
      if (linkElement.target) link.target = linkElement.target;

      link.append(picture);
      imageContainer.append(link);
    }

    ul.append(li);
  });

  /* Optimización de imágenes manteniendo la instrumentación de edición */
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  /* Inyección limpia del listado */
  block.replaceChildren(ul);
}