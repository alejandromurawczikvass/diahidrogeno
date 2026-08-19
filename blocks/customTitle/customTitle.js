import { moveInstrumentation } from '../../scripts/scripts.js';

const titleTypes = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const alignments = new Set(['left', 'center', 'right']);
const colors = new Set(['default', 'primary', 'primary-dark', 'text']);

function getFieldValue(row) {
  return row?.firstElementChild?.textContent.trim() || '';
}

function addOptionClass(element, prefix, value, options) {
  if (options.has(value)) element.classList.add(`${prefix}-${value}`);
}

export default function decorate(block) {
  const rows = [...block.children];
  const values = rows.map(getFieldValue);
  const [title, titleType, titleAlignment, titleColor, text, textAlignment, textColor] = values;
  const titleElement = document.createElement(titleTypes.has(titleType) ? titleType : 'h2');
  const textElement = document.createElement('div');

  titleElement.textContent = title;
  titleElement.className = 'custom-title-heading';
  textElement.className = 'custom-title-text';
  textElement.innerHTML = text;
  addOptionClass(titleElement, 'custom-title-align', titleAlignment, alignments);
  addOptionClass(titleElement, 'custom-title-color', titleColor, colors);
  addOptionClass(textElement, 'custom-title-align', textAlignment, alignments);
  addOptionClass(textElement, 'custom-title-color', textColor, colors);

  if (rows[0]) moveInstrumentation(rows[0], titleElement);
  if (rows[4]) moveInstrumentation(rows[4], textElement);

  block.replaceChildren(titleElement, textElement);
}
