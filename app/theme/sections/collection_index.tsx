import type { CollectionData, SiteInfo, Translate } from 'ui-kit';
import { Container, Icon, Image } from 'ui-kit';

// The store's categories as an index: each name large and light on its own hairline row, numbered, with its photo
// small at the row's end (when the category has one) and an arrow that moves on hover. Everything comes from the
// store's categories; nothing without any. On the categories page it can be the page's own list (its heading the
// page's h1), with the core's empty-state words when the store has none.
export const schema = {
  label: 'Collection index',
  fields: [
    { id: 'heading', type: 'text', label: 'Heading', default: 'Collections' },
    { id: 'link_label', type: 'text', label: 'Link label' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/categories' },
    { id: 'collections', type: 'collection_list', label: 'Store collections', max: 24, default: { from: 'top', limit: 5 } },
    { id: 'numbers', type: 'select', label: 'Numbers before the names', options: ['show', 'hide'], default: 'show' },
    { id: 'photos', type: 'select', label: 'Category photos', options: ['show', 'hide'], default: 'show' },
    { id: 'page_list', type: 'select', label: 'The categories page\'s own list (its heading is the page\'s)', options: ['no', 'yes'], default: 'no' },
  ],
} as const;

export const styles = `
& .mr-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: clamp(16px, 3vw, 40px); padding: clamp(18px, 2.6vw, 30px) 0; border-bottom: 1px solid var(--uk-color-line); color: inherit; text-decoration: none; }
& .mr-row:hover .mr-row-name, & .mr-row:focus-visible .mr-row-name { translate: 10px 0; }
& .mr-row-name { transition: translate .35s ease; }
& .mr-row:hover .mr-row-arrow { color: var(--uk-color-ink); }
@media (max-width: 600px) { & .mr-row-photo { display: none; } }
`;

type Props = {
  t: Translate; site?: SiteInfo;
  heading?: string; link_label?: string; link_href?: string; collections?: CollectionData[] | null; numbers?: string; photos?: string; page_list?: string;
};

export default function CollectionIndex(p: Props) {
  const { t } = p;
  const rows = (Array.isArray(p.collections) ? p.collections : []).filter((c) => c && typeof c.url === 'string' && c.name);
  const pageList = p.page_list === 'yes';
  if (!rows.length && !(pageList && t('collection.no_categories'))) return null;
  return (
    <section style={{ padding: 'var(--uk-section-md) 0' }}>
      <Container>
        {p.heading || p.link_label ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px 24px', paddingBottom: 'var(--uk-space-4)', borderBottom: '1px solid var(--uk-color-line-strong)' }}>
            {p.heading && pageList ? <h1 className="uk-heading uk-heading--xl" style={{ margin: 0 }}>{p.heading}</h1> : p.heading ? <h2 className="uk-heading uk-heading--sm" style={{ margin: 0 }}>{p.heading}</h2> : <span />}
            {p.link_label && p.link_href ? <a className="uk-link" href={p.link_href} style={{ fontSize: 'var(--uk-text-sm)' }}>{p.link_label}</a> : null}
          </div>
        ) : null}
        {rows.length ? (
          <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {rows.map((c, i) => (
              <li key={c.url}>
                <a className="mr-row" href={c.url}>
                  <span aria-hidden="true" style={{ minWidth: '2.2em', fontSize: 'var(--uk-text-xs)', color: 'var(--uk-color-text-subtle)', fontVariantNumeric: 'tabular-nums', visibility: p.numbers === 'hide' ? 'hidden' : undefined }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="mr-row-name" style={{ fontFamily: 'var(--uk-font-heading)', fontWeight: 300, fontSize: 'clamp(26px, 4vw, 52px)', lineHeight: 1.1, letterSpacing: '-.02em', color: 'var(--uk-color-heading)' }}>{c.name}</span>
                  {p.photos !== 'hide' && c.image ? (
                    <span className="mr-row-photo uk-media" style={{ display: 'block', width: 'clamp(72px, 9vw, 120px)', aspectRatio: '4 / 3' }}><Image image={c.image} alt="" sizes="120px" /></span>
                  ) : <span />}
                  <span className="mr-row-arrow" style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="arrow" size={20} /></span>
                </a>
              </li>
            ))}
          </ol>
        ) : <p style={{ margin: 'var(--uk-space-5) 0 0', color: 'var(--uk-color-text-muted)' }}>{t('collection.no_categories')}</p>}
      </Container>
    </section>
  );
}
