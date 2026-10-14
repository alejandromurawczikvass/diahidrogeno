export default function decorate(block) {
  const rows = [...block.children];
  const getValue = (row) => {
    const link = row?.querySelector('a[href]');
    return link ? link.getAttribute('href') : row?.textContent.trim() || '';
  };

  const [href, text, title, type, target] = rows.map(getValue);
  if (!href || !text) return;

  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.className = `button${['primary', 'secondary', 'accent'].includes(type) ? ` ${type}` : ''}`;
  link.title = title || text;

  if (target === '_blank') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  const wrapper = document.createElement('p');
  wrapper.className = 'button-wrapper';
  wrapper.append(link);
  block.replaceChildren(wrapper);
}
