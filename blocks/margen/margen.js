export default function decorate(block) {
  const fields = [...block.children].flatMap((row) => [...row.children]);
  const [amountField] = fields;
  const rawAmount = amountField?.textContent.trim() || '40';
  const amount = Number(rawAmount);

  if (!Number.isFinite(amount) || amount < 0) {
    block.remove();
    return;
  }

  const margin = `${amount}px`;
  block.style.marginTop = margin;
  block.style.marginBottom = margin;
  block.style.display = 'flow-root';
  block.replaceChildren();
}
