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
      if (firstCell.children.length <= 1 || firstCell.textContent.length < 200) {
        const title = document.createElement('h2');
        title.className = 'accordion-title';
        moveInstrumentation(firstCell, title);
        title.textContent = firstCell.textContent.trim();
        headerDiv.append(title);
        
        // Second cell is text/description
        if (firstRowChildren.length > 1) {
          const textCell = firstRowChildren[1];
          const text = document.createElement('div');
          text.className = 'accordion-description';
          moveInstrumentation(textCell, text);
          
          // Copy all content from textCell to text
          while (textCell.firstChild) {
            text.append(textCell.firstChild);
          }
          
          headerDiv.append(text);
        }
        
        accordion.append(headerDiv);
        startIndex = 1;
      }
    }
  }

  const accordionContent = document.createElement('div');
  accordionContent.className = 'accordion-content';
  accordion.append(accordionContent);

  children.slice(startIndex).forEach((row, index) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';

    const itemChildren = [...row.children];
    
    if (itemChildren.length >= 2) {
      // First cell is the title
      const titleDiv = itemChildren[0];
      const titleButton = document.createElement('button');
      titleButton.className = 'accordion-trigger';
      titleButton.id = `accordion-title-${index}`;
      titleButton.setAttribute('aria-expanded', 'false');
      titleButton.setAttribute('aria-controls', `accordion-content-${index}`);
      moveInstrumentation(titleDiv, titleButton);
      
      // Use text content from the cell
      titleButton.textContent = titleDiv.textContent.trim();

      // Second cell is the content
      const contentDiv = itemChildren[1];
      const content = document.createElement('div');
      content.className = 'accordion-panel';
      content.id = `accordion-content-${index}`;
      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', `accordion-title-${index}`);
      content.style.display = 'none';
      
      moveInstrumentation(contentDiv, content);
      
      // Copy all content from contentDiv to content
      while (contentDiv.firstChild) {
        content.append(contentDiv.firstChild);
      }

      item.append(titleButton, content);

      // Add click handler
      titleButton.addEventListener('click', () => {
        const isExpanded = titleButton.getAttribute('aria-expanded') === 'true';
        titleButton.setAttribute('aria-expanded', !isExpanded);
        content.style.display = isExpanded ? 'none' : 'block';
      });

      accordionContent.append(item);
    }
  });

  block.replaceChildren(accordion);
}
