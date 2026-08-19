import { moveInstrumentation } from '../../scripts/scripts.js';

const titleTypes = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const alignments = new Set(['left', 'center', 'right']);
const colors = new Set(['default', 'primary', 'primary-dark', 'text']);

function getCell(row) {
  return row?.lastElementChild;
}

function getValue(row) {
  return getCell(row)?.textContent.trim() || '';
}

function addOptionClass(element, prefix, value, options) {
  if (options.has(value)) element.classList.add(`${prefix}-${value}`);
}

export default function decorate(block) {
  const rows = [...block.children];
  const [titleRow, titleTypeRow, titleAlignmentRow, titleColorRow,
    textRow, textAlignmentRow, textColorRow] = rows;
  const title = getValue(titleRow);
  const titleType = getValue(titleTypeRow);
  const textCell = getCell(textRow);
  const titleElement = document.createElement(titleTypes.has(titleType) ? titleType : 'h2');
  const textElement = document.createElement('div');

  titleElement.className = 'customtitle-heading';
  titleElement.textContent = title;
  textElement.className = 'customtitle-text';
  textElement.innerHTML = textCell?.innerHTML || '';
  addOptionClass(titleElement, 'customtitle-align', getValue(titleAlignmentRow), alignments);
  addOptionClass(titleElement, 'customtitle-color', getValue(titleColorRow), colors);
  addOptionClass(textElement, 'customtitle-align', getValue(textAlignmentRow), alignments);
  addOptionClass(textElement, 'customtitle-color', getValue(textColorRow), colors);

  if (titleRow) moveInstrumentation(titleRow, titleElement);
  if (textRow) moveInstrumentation(textRow, textElement);
  block.replaceChildren(titleElement, textElement);
}
