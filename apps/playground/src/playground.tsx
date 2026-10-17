import { useState } from 'react';
import { Button, Modal, Popover, Dropdown, IconButton, SideBar } from '@tembok/ui-react';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type Side = 'auto' | 'up' | 'down';

export function Playground() {
  const [page, setPage] = useState<'gallery' | 'qa'>('gallery');
  const [modalOpen, setModalOpen] = useState(false);
  const [showcaseTheme, setShowcaseTheme] = useState<'light' | 'dark'>('light');
  const [showcaseRadius, setShowcaseRadius] = useState(12);
  const [showcaseMotion, setShowcaseMotion] = useState(true);
  const [corner, setCorner] = useState<Corner>('bottom-right');
  const [side, setSide] = useState<Side>('down');
  const [tall, setTall] = useState(false);
  const [emptyModal, setEmptyModal] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [contextPoint, setContextPoint] = useState({ x: 120, y: 200 });
  const [lastDismissal, setLastDismissal] = useState('none');

  return (
    <div className="tmbk-theme playground" data-showcase-theme={showcaseTheme} data-motion={showcaseMotion ? "on" : "off"} style={{ ["--tmbk-radius-surface" as string]: `${showcaseRadius}px` }}>
      <header className="playground-header">
        <div><strong>Tembok UI</strong><span>React playground · local source</span></div>
        <nav aria-label="Playground sections">
          <Button type="button" intent={page === 'gallery' ? 'primary' : 'neutral'} onClick={() => setPage('gallery')}>Gallery</Button>
          <Button type="button" intent={page === 'qa' ? 'primary' : 'neutral'} onClick={() => setPage('qa')}>Overlay QA</Button>
        </nav>
      </header>
      {page === 'gallery' ? (
        <main className="playground-main showcase">
          <section className="showcase-hero">
            <div className="showcase-eyebrow">TEMBOK / DESIGN SYSTEM / REACT</div>
            <div className="showcase-heading">
              <div><h1>Interfaces with intention.</h1><p>Refined foundations. Flexible composition. Real components, ready for real products.</p></div>
              <span className="showcase-version">FOUNDATIONS / 01</span>
            </div>
            <div className="showcase-metrics"><span>01 <b>Surface language</b></span><span>02 <b>Interaction</b></span><span>03 <b>Motion</b></span></div>
          </section>
          <section className="showcase-panel showcase-config" aria-label="Showcase theme controls">
            <div><div className="showcase-kicker">LIVE CONTROLS</div><h2>Make it yours.</h2><p>Try presentation settings without modifying any component.</p></div>
            <div className="showcase-controls">
              <label>Appearance <select value={showcaseTheme} onChange={e => setShowcaseTheme(e.target.value as 'light' | 'dark')}><option value="light">Light</option><option value="dark">Dark</option></select></label>
              <label>Surface radius <input aria-label="Surface radius" type="range" min="4" max="24" step="2" value={showcaseRadius} onChange={e => setShowcaseRadius(Number(e.target.value))} /><span>{showcaseRadius}px</span></label>
              <label className="showcase-toggle"><input type="checkbox" checked={showcaseMotion} onChange={e => setShowcaseMotion(e.target.checked)} /> Motion enabled</label>
            </div>
          </section>
          <div className="showcase-grid">
            <section className="showcase-panel"><div className="showcase-kicker">01 / ACTIONS</div><h2>Clear hierarchy.</h2><p>Actions stay identifiable without unnecessary decoration.</p>
              <div className="playground-actions"><Button intent="primary">Continue <span aria-hidden="true">↗</span></Button><Button intent="neutral">Secondary</Button><Button intent="ghost">Ghost</Button><Button intent="danger">Delete</Button><IconButton label="Favorite"><span aria-hidden="true">✦</span></IconButton><Button disabled>Disabled</Button></div>
            </section>
            <section className="showcase-panel"><div className="showcase-kicker">02 / FLOATING UI</div><h2>Focused interactions.</h2><p>Portaled overlays with tested keyboard and dismissal behavior.</p>
              <div className="playground-actions"><Button onClick={() => setModalOpen(true)}>Open modal</Button><Popover trigger={<Button intent="neutral">Popover</Button>}><div className="fixture-content">A focused surface <button type="button">Focusable action</button></div></Popover><Dropdown trigger={<Button intent="neutral">Dropdown</Button>}><div className="fixture-content"><button type="button">Edit</button><button type="button">Duplicate</button></div></Dropdown></div>
            </section>
            <section className="showcase-panel showcase-surface"><div className="showcase-kicker">03 / SURFACES</div><h2>Quiet depth.</h2><p>Semantic surfaces, borders and elevation build the composition.</p><div className="showcase-surface-demo"><div className="showcase-mini-card"><span className="showcase-status">● SYSTEM HEALTHY</span><strong>Everything in place.</strong><small>Tokens carry the design language.</small></div></div></section>
            <section className="showcase-panel"><div className="showcase-kicker">04 / MOTION</div><h2>Purpose, not noise.</h2><p>Subtle feedback responds to interaction. Reduced-motion preferences remain respected.</p><div className="showcase-motion-demo"><div className="showcase-motion-tile" tabIndex={0}><span>Hover or focus</span><strong>↗</strong></div><span className="showcase-footnote">Demo-only motion · not a package component</span></div></section>
          </div>
          <div className="showcase-footer"><span>BUILT WITH ACTUAL @TEMBOK/UI-REACT COMPONENTS</span><span>Overlay QA remains available for functional stress testing.</span></div>
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
            <Button data-sidebar-open="qa-sidebar" intent="neutral">Open sidebar</Button>
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
      <SideBar id="qa-sidebar" closeOnEscape={false} showClose header={<strong>QA sidebar (Escape disabled)</strong>}>
        <div className="fixture-content">
          <button data-close-menu type="button">Close sidebar</button>
          <Popover trigger={<Button intent="neutral">Sidebar popover</Button>}>
            <div className="fixture-content"><button type="button">Sidebar nested action</button></div>
          </Popover>
        </div>
      </SideBar>
      <Modal open={modalOpen} onOpenChange={setModalOpen}
        header={<h2>QA modal</h2>}
        footer={emptyModal ? undefined : <Button onClick={() => setModalOpen(false)}>Close modal</Button>}>
        {!emptyModal && <div className="modal-fixture"><label>Modal input <input aria-label="Modal input" /></label><button type="button" disabled>Disabled (skip)</button><a href="#focus-check" onClick={event => event.preventDefault()}>Modal link</a><Popover trigger={<Button type="button" intent="neutral">Nested popover</Button>}><div className="fixture-content"><button type="button">Nested action</button></div></Popover></div>}
      </Modal>
    </div>
  );
}
