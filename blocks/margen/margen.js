export default function decorate(block) {
  const fields = [...block.children].flatMap((row) => [...row.children]);
  const [sideField, amountField] = fields;
  const side = sideField?.textContent.trim().toLowerCase() || 'both';
  const rawAmount = amountField?.textContent.trim() || '40';
  const amount = Number(rawAmount);

  if (!Number.isFinite(amount) || amount < 0) {
    block.remove();
    return;
  }

  const margin = `${amount}px`;
  block.style.marginTop = side === 'top' || side === 'both' ? margin : '0';
  block.style.marginBottom = side === 'bottom' || side === 'both' ? margin : '0';
  block.style.display = 'flow-root';
  block.replaceChildren();
}
