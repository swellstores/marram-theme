import type { CollectionData, Translate } from 'ui-kit';
import { Breadcrumbs, Container } from 'ui-kit';

// A collection's opening: the trail, its name large and light on the left, its description in a narrow column on the
// right, and its subcategories as a row of plain text links under a hairline. All from the store's collection (the
// page's own by default); without one, the heading and text set here, and nothing when those are empty too.
export const schema = {
  label: 'Collection intro',
  fields: [
    { id: 'collection', type: 'collection', label: 'Collection', default: 'current' },
    { id: 'heading', type: 'text', label: 'Heading (when there is no collection)' },
    { id: 'text', type: 'textarea', label: 'Text (when there is no collection)' },
    { id: 'show_children', type: 'select', label: 'Subcategory links', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

export const styles = `
& .mr-intro { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: var(--uk-space-5) clamp(32px, 8vw, 128px); align-items: end; }
& .mr-subs a { color: var(--uk-color-text-muted); text-decoration: none; }
& .mr-subs a:hover { color: var(--uk-color-ink); text-decoration: underline; text-underline-offset: 4px; }
@media (max-width: 900px) { & .mr-intro { grid-template-columns: minmax(0, 1fr); } }
`;

type Props = { t: Translate; collection?: CollectionData | null; heading?: string; text?: string; show_children?: string };

export default function CollectionIntro({ t, collection, heading, text, show_children }: Props) {
  const c = collection && typeof collection === 'object' ? collection : null;
  const name = c ? c.name : heading;
  const words = c ? (Array.isArray(c.description) ? c.description.map((b) => b.text).filter(Boolean) : []) : text ? [text] : [];
  const subs = c && show_children !== 'hide' && Array.isArray(c.children) ? c.children : [];
  if (!name && !words.length) return null;
  return (
    <section style={{ padding: 'clamp(40px, 7vw, 112px) 0 var(--uk-space-6)' }}>
      <Container>
        {c ? (
          <div style={{ marginBottom: 'var(--uk-space-6)', fontSize: 'var(--uk-text-xs)' }}>
            <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, c.parent, { name: c.name, url: c.url }]} label={t('navigation.breadcrumb')} />
          </div>
        ) : null}
        <div className="mr-intro">
          {name ? <h1 className="uk-heading uk-heading--display" style={{ margin: 0, letterSpacing: '-.035em' }}>{name}</h1> : <span />}
          {words.length ? (
            <div style={{ display: 'grid', gap: 'var(--uk-space-3)', paddingBottom: '.4em' }}>
              {words.map((w, i) => <p key={i} style={{ margin: 0, maxWidth: '44ch', color: 'var(--uk-color-text-muted)' }}>{w}</p>)}
            </div>
          ) : null}
        </div>
        {subs.length ? (
          <nav className="mr-subs" aria-label={t('collection.subcategories') || undefined} style={{ marginTop: 'var(--uk-space-7)' }}>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 28px', margin: 0, padding: 0, listStyle: 'none', fontSize: 'var(--uk-text-sm)' }}>
              {subs.map((s) => <li key={s.slug}><a href={s.url}>{s.name}</a></li>)}
            </ul>
          </nav>
        ) : null}
      </Container>
    </section>
  );
}
