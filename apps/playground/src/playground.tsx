import { useEffect, useState } from 'react';
import { Button, Modal, Popover, Dropdown, IconButton, SideBar } from '@tembok/ui-react';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type Side = 'auto' | 'up' | 'down';

export function Playground() {
  const [page, setPage] = useState<'gallery' | 'qa'>('gallery');
  const [modalOpen, setModalOpen] = useState(false);
  const [showcaseTheme, setShowcaseTheme] = useState<'light' | 'dark'>('light');
  const [showcaseRadius, setShowcaseRadius] = useState(12);
  const [showcaseMotion, setShowcaseMotion] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#5aedea');
  const [section, setSection] = useState<'buttons' | 'overlays' | 'surfaces'>('buttons');
  useEffect(() => {
    // Portals mount under body, not inside the playground theme scope.
    // Scope this demo's theme on body and undo every mutation on unmount.
    if (page !== 'gallery') return;
    const body = document.body;
    const previousTheme = body.getAttribute('data-tmbk-preview-theme');
    const previousColor = body.style.getPropertyValue('--tmbk-preview-primary');
    body.setAttribute('data-tmbk-preview-theme', showcaseTheme);
    body.style.setProperty('--tmbk-preview-primary', primaryColor);
    return () => {
      if (previousTheme === null) body.removeAttribute('data-tmbk-preview-theme');
      else body.setAttribute('data-tmbk-preview-theme', previousTheme);
      if (previousColor) body.style.setProperty('--tmbk-preview-primary', previousColor);
      else body.style.removeProperty('--tmbk-preview-primary');
    };
  }, [showcaseTheme, primaryColor, page]);
  const [corner, setCorner] = useState<Corner>('bottom-right');
  const [side, setSide] = useState<Side>('down');
  const [tall, setTall] = useState(false);
  const [emptyModal, setEmptyModal] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [contextPoint, setContextPoint] = useState({ x: 120, y: 200 });
  const [lastDismissal, setLastDismissal] = useState('none');

  return (
    <div className="tmbk-theme playground" data-showcase-theme={showcaseTheme} data-motion={showcaseMotion ? "on" : "off"} style={{ ["--tmbk-radius-surface" as string]: `${showcaseRadius}px`, ["--tmbk-primary" as string]: primaryColor, ["--tmbk-motion-fast" as string]: showcaseMotion ? "140ms" : "0ms", ["--tmbk-motion-normal" as string]: showcaseMotion ? "220ms" : "0ms" }}>
      <header className="playground-header">
        <div><strong>Tembok UI</strong><span>React playground · local source</span></div>
        <nav aria-label="Playground sections">
          <Button type="button" intent={page === 'gallery' ? 'primary' : 'neutral'} onClick={() => setPage('gallery')}>Gallery</Button>
          <Button type="button" intent={page === 'qa' ? 'primary' : 'neutral'} onClick={() => setPage('qa')}>Overlay QA</Button>
        </nav>
      </header>
      {page === 'gallery' ? (
        <main className="workbench" aria-label="Component workbench">
          <aside className="workbench-nav" aria-label="Component navigation">
            <div className="workbench-nav-title">COMPONENTS</div>
            {(['buttons','overlays','surfaces'] as const).map(item =>
              <button key={item} className={section === item ? 'workbench-nav-item selected' : 'workbench-nav-item'} aria-current={section === item ? 'page' : undefined} onClick={() => setSection(item)}>
                {item === 'buttons' ? 'Buttons' : item === 'overlays' ? 'Overlays' : 'Surfaces'}
              </button>
            )}
            <div className="workbench-nav-title workbench-nav-tools">TOOLS</div>
            <button className="workbench-nav-item" onClick={() => setPage('qa')}>Overlay QA ↗</button>
          </aside>
          <div className="workbench-content">
            <div className="workbench-heading"><div><div className="workbench-breadcrumb">React / Components / {section}</div><h1>{section === 'buttons' ? 'Buttons' : section === 'overlays' ? 'Overlays' : 'Surfaces'}</h1><p>{section === 'buttons' ? 'Actions, sizes and states.' : section === 'overlays' ? 'Modal, popover and menu behavior.' : 'Appearance, depth and radius tokens.'}</p></div><span className="workbench-source">LOCAL SOURCE</span></div>
            <div className="workbench-preview">
              <div className="workbench-preview-top"><span>PREVIEW</span><span>Actual @tembok/ui-react components</span></div>
              <div className="workbench-stage">
                {section === 'buttons' && <div className="workbench-examples"><div className="workbench-example-label">Intents</div><div className="playground-actions"><Button intent="primary">Primary</Button><Button intent="neutral">Neutral</Button><Button intent="ghost">Ghost</Button><Button intent="danger">Danger</Button><Button disabled>Disabled</Button><IconButton label="Favorite"><span aria-hidden="true">✦</span></IconButton></div><div className="workbench-example-label">Sizes</div><div className="playground-actions"><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button></div></div>}
                {section === 'overlays' && <div className="workbench-examples"><div className="workbench-example-label">Floating components</div><div className="playground-actions"><Button onClick={() => setModalOpen(true)}>Open modal</Button><Popover trigger={<Button intent="neutral">Popover</Button>}><div className="fixture-content"><span>Popover content</span><button type="button">Focusable action</button></div></Popover><Dropdown trigger={<Button intent="neutral">Dropdown</Button>}><div className="fixture-content"><button type="button">Edit</button><button type="button">Duplicate</button></div></Dropdown></div><p className="workbench-hint">Try Escape, keyboard focus and clicking outside.</p></div>}
                {section === 'surfaces' && <div className="workbench-surface-example"><div className="workbench-surface-card"><small>STATUS</small><strong>Ready for review</strong><span>Semantic surface and elevation tokens.</span><Button size="sm">Review</Button></div></div>}
              </div>
              <div className="workbench-preview-bottom"><span>{section === 'buttons' ? 'Hover · Focus · Disabled' : section === 'overlays' ? 'Portals · Focus · Dismissal' : 'Colors · Radius · Elevation'}</span><span>PREVIEW / 01</span></div>
            </div>
            <div className="workbench-reference"><h2>Component notes</h2><p>{section === 'buttons' ? 'Use intent to communicate priority. Theme tokens define the appearance.' : section === 'overlays' ? 'Overlays mount in document.body. The preview applies appearance and accent to portals as well as the workbench.' : 'Adjust surface radius and appearance in the inspector. These values are configurable, not hard-coded into consumer apps.'}</p></div>
          </div>
          <aside className="workbench-inspector" aria-label="Preview inspector">
            <div className="workbench-inspector-title">PREVIEW SETTINGS</div>
            <label className="workbench-field">Appearance<select value={showcaseTheme} onChange={e => setShowcaseTheme(e.target.value as 'light' | 'dark')}><option value="light">Light</option><option value="dark">Dark</option></select></label>
            <div className="workbench-field"><label htmlFor="workbench-primary">Primary color</label><div className="workbench-color"><input id="workbench-primary" type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} /><output>{primaryColor.toUpperCase()}</output></div></div>
            <label className="workbench-field">Corner radius <div className="workbench-range"><input aria-label="Surface radius" type="range" min="4" max="24" step="2" value={showcaseRadius} onChange={e => setShowcaseRadius(Number(e.target.value))} /><output>{showcaseRadius}px</output></div></label>
            <label className="workbench-check"><input type="checkbox" checked={showcaseMotion} onChange={e => setShowcaseMotion(e.target.checked)} /> Enable motion</label>
            <p className="workbench-inspector-note">Preview only. No changes to package defaults.</p>
          </aside>
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
