import { useState } from 'react';
import { Button, Modal, Popover, Dropdown, IconButton } from '@tembok/ui-react';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type Side = 'auto' | 'up' | 'down';

export function Playground() {
  const [page, setPage] = useState<'gallery' | 'qa'>('gallery');
  const [modalOpen, setModalOpen] = useState(false);
  const [corner, setCorner] = useState<Corner>('bottom-right');
  const [side, setSide] = useState<Side>('down');
  const [tall, setTall] = useState(false);
  const [emptyModal, setEmptyModal] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [contextPoint, setContextPoint] = useState({ x: 120, y: 200 });
  const [lastDismissal, setLastDismissal] = useState('none');

  return (
    <div className="tmbk-theme playground">
      <header className="playground-header">
        <div><strong>Tembok UI</strong><span>React playground · local source</span></div>
        <nav aria-label="Playground sections">
          <Button type="button" intent={page === 'gallery' ? 'primary' : 'neutral'} onClick={() => setPage('gallery')}>Gallery</Button>
          <Button type="button" intent={page === 'qa' ? 'primary' : 'neutral'} onClick={() => setPage('qa')}>Overlay QA</Button>
        </nav>
      </header>
      {page === 'gallery' ? (
        <main className="playground-main">
          <h1>Component gallery</h1>
          <p>Examples render actual local React components. Changes hot reload.</p>
          <section className="playground-card">
            <h2>Buttons</h2>
            <div className="playground-actions">
              <Button intent="primary">Primary</Button>
              <Button intent="secondary">Secondary</Button>
              <Button intent="ghost">Ghost</Button>
              <Button intent="danger">Danger</Button>
              <Button disabled>Disabled</Button>
              <IconButton label="Example icon action"><span aria-hidden="true">✦</span></IconButton>
            </div>
          </section>
          <section className="playground-card">
            <h2>Overlays</h2>
            <div className="playground-actions">
              <Button onClick={() => setModalOpen(true)}>Open modal</Button>
              <Popover trigger={<Button intent="neutral">Popover</Button>}>
                <div className="fixture-content">Popover content <button type="button">Focusable action</button></div>
              </Popover>
              <Dropdown trigger={<Button intent="neutral">Dropdown</Button>}>
                <div className="fixture-content"><button type="button">Action one</button><button type="button">Action two</button></div>
              </Dropdown>
            </div>
          </section>
        </main>
      ) : (
        <main className="playground-main">
          <h1>Overlay QA</h1>
          <p>Inspect the package, not custom overlay replacements. Native test controls are intentional.</p>
          <div className="qa-controls">
            <label>Anchor <select value={corner} onChange={event => setCorner(event.target.value as Corner)}>
              <option value="top-left">top-left</option><option value="top-right">top-right</option>
              <option value="bottom-left">bottom-left</option><option value="bottom-right">bottom-right</option>
            </select></label>
            <label>Preferred side <select value={side} onChange={event => setSide(event.target.value as Side)}>
              <option value="auto">auto</option><option value="up">up</option><option value="down">down</option>
            </select></label>
            <label><input type="checkbox" checked={tall} onChange={event => setTall(event.target.checked)} /> Tall menu</label>
            <label><input type="checkbox" checked={emptyModal} onChange={event => setEmptyModal(event.target.checked)} /> Modal without focusables</label>
            <Button onClick={() => setModalOpen(true)}>Open modal</Button>
            <button type="button">Outside focus target</button>
          </div>
          <p className="qa-note">Tab through each overlay, press Escape, verify focus returns to its trigger. Test at 375, 900 and 1280px.</p>
          <section className="playground-card">
            <h2>Controlled context menu</h2>
            <p>Right-click in the dashed region, or use the keyboard button to open without a synthetic trigger click.</p>
            <div data-testid="context-zone" tabIndex={0}
              onContextMenu={event => {
                event.preventDefault();
                setContextPoint({ x: event.clientX, y: event.clientY });
                setContextOpen(true);
              }}
              style={{ border: '1px dashed currentColor', padding: 24 }}>
              Right-click here
            </div>
            <Button type="button" onClick={() => { setContextPoint({ x: 120, y: 240 }); setContextOpen(true); }}>Open context menu by keyboard</Button>
            <p data-testid="dismissal-reason">Last dismissal: {lastDismissal}</p>
            <Dropdown open={contextOpen} onOpenChange={(next, reason) => {
              setContextOpen(next);
              if (!next) setLastDismissal(reason);
            }} anchorRect={contextPoint} ariaLabel="Context actions" side="auto">
              <div className="fixture-content" data-testid="context-menu">
                <button type="button">Rename</button>
                <button type="button" data-close-popover="false">Keep open</button>
              </div>
            </Dropdown>
          </section>
          <div className={`qa-anchors qa-${corner}`}>
            <Popover key={`popover-${corner}-${side}-${tall}`} trigger={<Button intent="neutral">Open popover</Button>} side={side} align="end">
              <div className="fixture-content" data-testid="popover-content">
                <label>Popover input <input aria-label="Popover input" /></label>
                {tall && <div className="fixture-tall">{Array.from({ length: 25 }, (_, i) => <p key={i}>Item {i + 1}</p>)}</div>}
              </div>
            </Popover>
            <Dropdown key={`dropdown-${corner}-${side}-${tall}`} trigger={<Button intent="neutral">Open dropdown</Button>} side={side} align="end">
              <div className="fixture-content" data-testid="dropdown-content">
                <button type="button">Action one</button><button type="button">Action two</button>
                {tall && <div className="fixture-tall">{Array.from({ length: 25 }, (_, i) => <button key={i} type="button">Action {i + 3}</button>)}</div>}
              </div>
            </Dropdown>
          </div>
        </main>
      )}
      <Modal open={modalOpen} onOpenChange={setModalOpen}
        header={<h2>QA modal</h2>}
        footer={emptyModal ? undefined : <Button onClick={() => setModalOpen(false)}>Close modal</Button>}>
        {!emptyModal && <div className="modal-fixture"><label>Modal input <input aria-label="Modal input" /></label><button type="button" disabled>Disabled (skip)</button><a href="#focus-check" onClick={event => event.preventDefault()}>Modal link</a><Popover trigger={<Button type="button" intent="neutral">Nested popover</Button>}><div className="fixture-content"><button type="button">Nested action</button></div></Popover></div>}
      </Modal>
    </div>
  );
}
