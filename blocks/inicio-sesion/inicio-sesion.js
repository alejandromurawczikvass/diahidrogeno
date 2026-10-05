import { moveInstrumentation } from '../../scripts/scripts.js';

let formCount = 0;

function getFieldValue(field) {
  const link = field?.querySelector('a');
  return (link ? link.href : field?.textContent || '').trim();
}

function getActionUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
  } catch {
    return '';
  }

  return '';
}

export default function decorate(block) {
  const rows = [...block.children];
  const fields = rows.flatMap((row) => [...row.children]);
  const [titleField, actionField, buttonTextField] = fields;
  const title = getFieldValue(titleField);
  const actionUrl = getActionUrl(getFieldValue(actionField));
  const buttonText = getFieldValue(buttonTextField) || 'ENVIAR';

  const container = document.createElement('div');
  container.className = 'inicio-sesion-content';
  if (rows[0]) moveInstrumentation(rows[0], container);

  if (title) {
    const heading = document.createElement('h2');
    heading.textContent = title;
    if (titleField) moveInstrumentation(titleField, heading);
    container.append(heading);
  }

  const form = document.createElement('form');
  form.method = 'get';
  if (actionUrl) form.action = actionUrl;
  if (actionField) moveInstrumentation(actionField, form);

  formCount += 1;
  const emailId = `inicio-sesion-email-${formCount}`;
  const emailLabel = document.createElement('label');
  emailLabel.className = 'inicio-sesion-label';
  emailLabel.htmlFor = emailId;
  emailLabel.textContent = 'Email';

  const emailInput = document.createElement('input');
  emailInput.id = emailId;
  emailInput.name = 'email';
  emailInput.type = 'email';
  emailInput.placeholder = 'Email';
  emailInput.autocomplete = 'email';
  emailInput.required = true;

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = buttonText;
  if (buttonTextField) moveInstrumentation(buttonTextField, submitButton);

  form.append(emailLabel, emailInput, submitButton);
  container.append(form);
  block.replaceChildren(container);
}
