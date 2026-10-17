import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button, Dropdown, MenuItem, Modal, Popover } from '@tembok/ui-react';

let host: HTMLDivElement;
let root: Root;

async function render(element: React.ReactNode) {
  await act(async () => { root.render(element); });
}
async function click(element: HTMLElement) {
  await act(async () => { element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); });
}
async function key(keyName: string, shiftKey = false) {
  await act(async () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: keyName, shiftKey, bubbles: true, cancelable: true }));
  });
}
function findButton(label: string) {
  const button = [...document.querySelectorAll<HTMLButtonElement>('button')].find(node => node.textContent?.trim() === label);
  if (!button) throw new Error('Missing button: ' + label);
  return button;
}

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  // jsdom intentionally does not calculate layout; focusable visibility tests
  // use an explicit visibility fixture rather than requiring browser geometry.
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockImplementation(function (this: HTMLElement) {
    return this.hidden ? { length: 0 } as DOMRectList : { length: 1 } as DOMRectList;
  });
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => { root.unmount(); });
  host.remove();
  document.querySelectorAll('.tmbk-popover,.tmbk-modal').forEach(node => node.remove());
  vi.restoreAllMocks();
});

describe('React overlay regressions', () => {
  it('opens modal, contains keyboard focus and restores opener', async () => {
    function Example() {
      const [open, setOpen] = useState(false);
      return <><Button onClick={() => setOpen(true)}>Open</Button>
        <Modal open={open} onOpenChange={setOpen} header="Title" footer={<Button>Last</Button>}>
          <input aria-label="First" />
        </Modal></>;
    }
    await render(<Example />);
    const opener = findButton('Open');
    opener.focus();
    await click(opener);
    const first = document.querySelector<HTMLInputElement>('input[aria-label="First"]')!;
    expect(document.activeElement).toBe(first);
    first.focus();
    await key('Tab', true);
    expect(document.activeElement).toBe(findButton('Last'));
    await key('Escape');
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('keeps focus on the dialog for zero-focusable content', async () => {
    function Example() {
      const [open, setOpen] = useState(false);
      return <><Button onClick={() => setOpen(true)}>Open</Button>
        <Modal open={open} onOpenChange={setOpen}><p>Nothing interactive</p></Modal></>;
    }
    await render(<Example />);
    await click(findButton('Open'));
    const dialog = document.querySelector<HTMLElement>('.tmbk-modal-panel')!;
    expect(document.activeElement).toBe(dialog);
    await key('Tab');
    expect(document.activeElement).toBe(dialog);
    await key('Tab', true);
    expect(document.activeElement).toBe(dialog);
  });

  it('unmounts popover on Escape and restores trigger', async () => {
    await render(<Popover trigger={<Button>Menu</Button>}><button>Action</button></Popover>);
    const trigger = findButton('Menu');
    await click(trigger);
    expect(document.querySelector('.tmbk-popover')).not.toBeNull();
    findButton('Action').focus();
    await key('Escape');
    expect(document.querySelector('.tmbk-popover')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('reports controlled dismissal reasons and preserves keep-open item', async () => {
    const reasons: string[] = [];
    function Example() {
      const [open, setOpen] = useState(false);
      return <Dropdown trigger={<Button>Actions</Button>} open={open}
        onOpenChange={(next, reason) => { reasons.push(reason); setOpen(next); }}>
        <button data-close-popover="false">Keep open</button>
        <button>Rename</button>
      </Dropdown>;
    }
    await render(<Example />);
    await click(findButton('Actions'));
    expect(reasons).toContain('trigger');
    await click(findButton('Keep open'));
    expect(document.querySelector('.tmbk-popover')).not.toBeNull();
    await click(findButton('Rename'));
    expect(reasons.at(-1)).toBe('select');
    expect(document.querySelector('.tmbk-popover')).toBeNull();
  });

  it('supports modal size presets, custom width, and a scrollable content region', async () => {
    await render(<Modal open onOpenChange={() => {}} size="lg" width="680px"
      header={<h2>Long form</h2>} footer={<button>Save</button>}>
      <div>{Array.from({ length: 40 }, (_, i) => <p key={i}>Row {i}</p>)}</div>
    </Modal>);
    const panel = document.querySelector<HTMLElement>('.tmbk-modal-panel')!;
    expect(panel.dataset.size).toBe('lg');
    expect(panel.style.getPropertyValue('--tmbk-modal-width')).toBe('680px');
    expect(panel.querySelector('.tmbk-modal-body')).not.toBeNull();
    expect(panel.querySelector('.tmbk-modal-footer')).not.toBeNull();
  });

  it('MenuItem supports action details and per-item keep-open', async () => {
    await render(<Dropdown trigger={<Button>Commands</Button>}>
      <MenuItem icon={<span>✎</span>} trailing="Ctrl R" keepOpen>Rename</MenuItem>
      <MenuItem danger disabled>Delete</MenuItem>
      <MenuItem>Duplicate</MenuItem>
    </Dropdown>);
    await click(findButton('Commands'));
    const rename = [...document.querySelectorAll<HTMLButtonElement>('.tmbk-menu-item')]
      .find(button => button.querySelector('.tmbk-menu-item-label')?.textContent === 'Rename');
    expect(rename).toBeDefined();
    expect(rename.getAttribute('data-close-popover')).toBe('false');
    expect(findButton('Delete').disabled).toBe(true);
    await click(rename);
    expect(document.querySelector('.tmbk-dropdown')).not.toBeNull();
    await click(findButton('Duplicate'));
    expect(document.querySelector('.tmbk-dropdown')).toBeNull();
  });

  it('Escape dismisses nested Popover before Modal', async () => {
    function Example() {
      const [open, setOpen] = useState(false);
      return <><Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onOpenChange={setOpen}>
          <Popover trigger={<Button>Nested</Button>}><button>Child action</button></Popover>
        </Modal></>;
    }
    await render(<Example />);
    const opener = findButton('Open Modal');
    // Synthetic clicks do not move focus like real pointer interaction.
    // Model an actual keyboard/pointer opener before checking focus return.
    opener.focus();
    expect(document.activeElement).toBe(opener);
    await click(opener);
    const trigger = findButton('Nested');
    await click(trigger);
    expect(document.querySelector('.tmbk-popover')).not.toBeNull();
    await key('Escape');
    expect(document.querySelector('.tmbk-popover')).toBeNull();
    expect(document.querySelector('.tmbk-modal')).not.toBeNull();
    expect(document.activeElement).toBe(trigger);
    await key('Escape');
    expect(document.querySelector('.tmbk-modal')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});
