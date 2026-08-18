import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to div structure for accordion */
  const accordion = document.createElement('div');
  accordion.className = 'accordion-content';

  [...block.children].forEach((row, index) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';

    const itemChildren = [...row.children];
    
    if (itemChildren.length >= 2) {
      // First cell is the title
      const titleDiv = itemChildren[0];
      const title = document.createElement('button');
      title.className = 'accordion-trigger';
      title.setAttribute('aria-expanded', 'false');
      title.setAttribute('aria-controls', `accordion-content-${index}`);
      moveInstrumentation(titleDiv, title);
      
      // Extract text content
      while (titleDiv.firstElementChild) {
        title.append(titleDiv.firstElementChild);
      }
      if (titleDiv.textContent) {
        title.textContent = titleDiv.textContent;
      }

      // Second cell is the content
      const contentDiv = itemChildren[1];
      const content = document.createElement('div');
      content.className = 'accordion-panel';
      content.id = `accordion-content-${index}`;
      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', `accordion-title-${index}`);
      content.style.display = 'none';
      
      moveInstrumentation(contentDiv, content);
      
      while (contentDiv.firstElementChild) {
        content.append(contentDiv.firstElementChild);
      }
      if (contentDiv.textContent) {
        content.innerHTML = contentDiv.innerHTML;
      }

      title.id = `accordion-title-${index}`;
      
      item.append(title, content);

      // Add click handler
      title.addEventListener('click', () => {
        const isExpanded = title.getAttribute('aria-expanded') === 'true';
        title.setAttribute('aria-expanded', !isExpanded);
        content.style.display = isExpanded ? 'none' : 'block';
      });
    }

    accordion.append(item);
  });

  block.replaceChildren(accordion);
}
