import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button, Dropdown, IconButton, MenuItem, Modal, Popover, SideBar } from '@tembok/ui-react';
import { Playground } from '../playground';

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
  it('workbench switches preset without mutating body theme attributes', async () => {
    await render(<Playground />);
    const preset = document.querySelector<HTMLSelectElement>('select[aria-label="Theme preset"]');
    expect(preset).not.toBeNull();
    expect(document.body.hasAttribute('data-tmbk-preview-preset')).toBe(false);
    expect(document.body.hasAttribute('data-tmbk-preview-theme')).toBe(false);
    await act(async () => {
      preset!.value = 'reference';
      preset!.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(document.querySelector('.playground')?.getAttribute('data-preset')).toBe('reference');
    expect(document.body.hasAttribute('data-tmbk-preview-preset')).toBe(false);
  });


  it('keeps body locked until the last open modal unmounts', async () => {
    document.body.style.overflow = 'auto';
    function Fixture() {
      const [first, setFirst] = useState(true);
      const [second, setSecond] = useState(true);
      return <><button onClick={() => setFirst(false)}>Close first</button>
        <button onClick={() => setSecond(false)}>Close second</button>
        <Modal id="first-lock" open={first} onOpenChange={setFirst}><p>First</p></Modal>
        <Modal id="second-lock" open={second} onOpenChange={setSecond}><p>Second</p></Modal>
      </>;
    }
    await render(<Fixture />);
    expect(document.body.style.overflow).toBe('hidden');
    await click(findButton('Close first'));
    expect(document.body.style.overflow).toBe('hidden');
    await click(findButton('Close second'));
    expect(document.body.style.overflow).toBe('auto');
    document.body.style.removeProperty('overflow');
  });

  it('controls SideBar open state and returns focus to its opener', async () => {
    function Fixture() {
      const [open, setOpen] = useState(false);
      return <><button onClick={() => setOpen(true)}>Show controlled panel</button>
        <SideBar id="controlled-panel" open={open} onOpenChange={setOpen}>
          <button data-close-menu>Dismiss controlled panel</button>
        </SideBar></>;
    }
    await render(<Fixture />);
    const opener = findButton('Show controlled panel');
    opener.focus();
    await click(opener);
    const panel = document.querySelector<HTMLElement>('.tmbk-sidebar')!;
    expect(panel.dataset.open).toBe('true');
    expect(panel.hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(findButton('Dismiss controlled panel'));
    await click(findButton('Dismiss controlled panel'));
    expect(panel.dataset.open).toBe('false');
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(opener);
  });

  it('keeps closed SideBar content inert and enables it when opened', async () => {
    await render(<><button data-sidebar-open="inert-panel">Open panel</button>
      <SideBar id="inert-panel"><button data-close-menu>Close panel</button></SideBar></>);
    const panel = document.querySelector<HTMLElement>('.tmbk-sidebar')!;
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    await click(findButton('Open panel'));
    expect(panel.hasAttribute('inert')).toBe(false);
    expect(panel.getAttribute('aria-hidden')).toBe('false');
    await click(findButton('Close panel'));
    expect(panel.hasAttribute('inert')).toBe(true);
  });

  it('inherits scoped SideBar palette and restores body lock alongside Modal', async () => {
    function Fixture() {
      const [showModal, setShowModal] = useState(false);
      return <div style={{ '--tmbk-primary': '#f8c61e' } as React.CSSProperties}>
        <button data-sidebar-open="qa-theme">Open side panel</button>
        <button onClick={() => setShowModal(true)}>Open nested modal</button>
        <SideBar id="qa-theme" header="Product settings"><button data-close-menu>Close panel</button></SideBar>
        <Modal open={showModal} onOpenChange={setShowModal}><button onClick={() => setShowModal(false)}>Dismiss modal</button></Modal>
      </div>;
    }
    await render(<Fixture />);
    // jsdom does not resolve inherited CSS custom properties through
    // getComputedStyle. Emulate the browser's computed value at the source
    // anchor, while exercising the real portal-token transfer implementation.
    const sourceAnchor = host.querySelector<HTMLSpanElement>('span[hidden][aria-hidden="true"]');
    expect(sourceAnchor).not.toBeNull();
    expect(sourceAnchor!.parentElement?.style.getPropertyValue('--tmbk-primary')).toBe('#f8c61e');
    const nativeComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const computed = nativeComputedStyle(element);
      if (element !== sourceAnchor) return computed;
      return new Proxy(computed, {
        get(target, property) {
          if (property === 'getPropertyValue') {
            return (name: string) => name === '--tmbk-primary'
              ? '#f8c61e'
              : target.getPropertyValue(name);
          }
          return Reflect.get(target, property, target);
        },
      });
    });
    await click(findButton('Open side panel'));
    const panel = document.querySelector<HTMLElement>('.tmbk-sidebar')!;
    expect(panel.getAttribute('data-open')).toBe('true');
    expect(panel.style.getPropertyValue('--tmbk-primary').trim()).toBe('#f8c61e');
    expect(document.body.style.overflow).toBe('hidden');
    await click(findButton('Open nested modal'));
    expect(document.body.style.overflow).toBe('hidden');
    await click(findButton('Dismiss modal'));
    expect(document.body.style.overflow).toBe('hidden');
    await click(findButton('Close panel'));
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('exposes wide settings and compact confirmation fixtures in Gallery', async () => {
    await render(<Playground />);
    const overlays = [...document.querySelectorAll<HTMLButtonElement>('.workbench-nav-item')]
      .find(button => button.textContent === 'Overlays');
    expect(overlays).toBeDefined();
    await click(overlays!);
    await click(findButton('Settings modal'));
    const settings = document.querySelector<HTMLElement>('.tmbk-modal-panel');
    expect(settings?.dataset.size).toBe('xl');
    expect(settings?.querySelector('.tmbk-modal-body')).not.toBeNull();
    await click(findButton('Done'));
    await click(findButton('Confirm action'));
    expect(document.querySelector('.tmbk-modal-panel')?.getAttribute('data-size')).toBe('sm');
    await click(findButton('Cancel'));
    expect(document.querySelector('.tmbk-modal')).toBeNull();
  });

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

  it('uses one inset scrolling viewport for long Popover and Dropdown content', async () => {
    await render(<>
      <Popover trigger={<Button>Rich content</Button>}>
        <div>{Array.from({ length: 25 }, (_, i) => <p key={i}>Row {i}</p>)}</div>
      </Popover>
      <Dropdown trigger={<Button>Long menu</Button>} maxHeight={240}>
        <div>{Array.from({ length: 25 }, (_, i) => <button key={i}>Action {i}</button>)}</div>
      </Dropdown>
    </>);
    await click(findButton('Rich content'));
    const popover = document.querySelector<HTMLElement>('.tmbk-popover:not(.tmbk-dropdown)')!;
    expect(popover.querySelectorAll('.tmbk-popover-scroll')).toHaveLength(1);
    expect(popover.querySelector('.tmbk-popover-arrow')).not.toBeNull();
    expect(popover.style.overflowY).toBe('');
    await click(findButton('Long menu'));
    const dropdown = document.querySelector<HTMLElement>('.tmbk-dropdown')!;
    expect(dropdown.querySelectorAll('.tmbk-popover-scroll')).toHaveLength(1);
    expect(dropdown.style.getPropertyValue('--tmbk-popover-scroll-limit')).toBe('240px');
    expect(dropdown.querySelector('.tmbk-dropdown-wrap')).not.toBeNull();
    expect(dropdown.style.overflowY).toBe('');
  });

  it('renders accessible extra-small IconButton and disabled state', async () => {
    await render(<><IconButton size="xs" label="Edit" intent="neutral"><svg /></IconButton>
      <IconButton size="xs" label="Delete" disabled><svg /></IconButton></>);
    const edit = document.querySelector<HTMLButtonElement>('button[aria-label="Edit"]');
    const del = document.querySelector<HTMLButtonElement>('button[aria-label="Delete"]');
    expect(edit).not.toBeNull();
    expect(edit!.classList.contains('tmbk-btn--xs')).toBe(true);
    expect(del?.disabled).toBe(true);
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
    expect(rename!.getAttribute('data-close-popover')).toBe('false');
    expect(findButton('Delete').disabled).toBe(true);
    await click(rename!);
    expect(document.querySelector('.tmbk-dropdown')).not.toBeNull();
    await click(findButton('Duplicate'));
    expect(document.querySelector('.tmbk-dropdown')).toBeNull();
  });

  it('portaled Modal and Popover render with product theme source present', async () => {
    function Fixture() {
      const [open, setOpen] = useState(false);
      return <div data-theme="dark" style={{ '--tmbk-primary': '#f8c61e' } as React.CSSProperties}>
        <Button onClick={() => setOpen(true)}>Launch</Button>
        <Popover trigger={<Button>Options</Button>}><button>Action</button></Popover>
        <Modal open={open} onOpenChange={setOpen}><button>Close</button></Modal>
      </div>;
    }
    await render(<Fixture />);
    await click(findButton('Options'));
    expect(document.querySelector('.tmbk-popover')).not.toBeNull();
    await click(findButton('Launch'));
    expect(document.querySelector('.tmbk-modal')).not.toBeNull();
    expect(document.querySelector('.tmbk-modal')?.parentElement).toBe(document.body);
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
