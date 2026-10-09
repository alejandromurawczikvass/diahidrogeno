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
  const [titleField, actionField, validationField, buttonTextField] = fields;
  const title = getFieldValue(titleField);
  const actionUrl = getActionUrl(getFieldValue(actionField));
  const validationUrl = getActionUrl(getFieldValue(validationField));
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

  const message = document.createElement('p');
  message.className = 'inicio-sesion-message';
  message.setAttribute('role', 'alert');
  message.hidden = true;

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = buttonText;
  if (buttonTextField) moveInstrumentation(buttonTextField, submitButton);

  let validationPending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (validationPending) return;

    message.hidden = true;
    if (!actionUrl || !validationUrl) {
      message.textContent = 'Falta configurar la URL de destino o de comprobación.';
      message.hidden = false;
      return;
    }

    validationPending = true;
    submitButton.setAttribute('aria-busy', 'true');

    try {
      const endpoint = new URL(validationUrl);
      endpoint.searchParams.set('email', emailInput.value.trim());
      const response = await fetch(endpoint, { method: 'GET' });

      if (response.status !== 200) {
        message.textContent = 'No se encontró el email o no se pudo validar.';
        message.hidden = false;
        return;
      }

      form.submit();
    } catch {
      message.textContent = 'No se pudo comprobar el email. Inténtalo nuevamente.';
      message.hidden = false;
    } finally {
      validationPending = false;
      submitButton.removeAttribute('aria-busy');
    }
  });

  form.append(emailLabel, emailInput, message, submitButton);
  container.append(form);
  block.replaceChildren(container);
}
