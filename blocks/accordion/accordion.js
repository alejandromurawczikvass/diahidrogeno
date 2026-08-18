import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to div structure for accordion */
  const accordion = document.createElement('div');
  accordion.className = 'accordion-wrapper';

  // Extract title and text from first row if present
  const children = [...block.children];
  let startIndex = 0;
  
  if (children.length > 0) {
    const firstRow = children[0];
    const firstRowChildren = firstRow.children;
    
    // Check if first row has title/text (not accordion items)
    if (firstRowChildren.length > 0 && !firstRow.classList.contains('accordion-item')) {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'accordion-header';
      
      // Check if first cell looks like a title (single short element)
      const firstCell = firstRowChildren[0];
      if (firstCell.children.length <= 1) {
        const title = document.createElement('h2');
        title.className = 'accordion-title';
        moveInstrumentation(firstCell, title);
        title.innerHTML = firstCell.innerHTML;
        headerDiv.append(title);
        
        // Second cell is text/description
        if (firstRowChildren.length > 1) {
          const textCell = firstRowChildren[1];
          const text = document.createElement('div');
          text.className = 'accordion-description';
          moveInstrumentation(textCell, text);
          text.innerHTML = textCell.innerHTML;
          headerDiv.append(text);
        }
        
        accordion.append(headerDiv);
        startIndex = 1;
      }
    }
  }

  const accordionContent = document.createElement('div');
  accordionContent.className = 'accordion-content';

  children.slice(startIndex).forEach((row, index) => {
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

  accordion.append(accordionContent);
  block.replaceChildren(accordion);
}
