import { useId } from 'react';
import type { ProductData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { ActiveFilters, Container, FilterForm, Icon, Image, Pagination, pricesHiddenFor, Price, QuickAdd, SignInForPrices, SortSelect, SwatchDot } from 'ui-kit';

// Products set on pale tiles with a wide margin of air around each photo, the name and the price on one quiet line
// beneath. On a collection or search page's own list it adds a slim bar with the count and the sort, a Filter
// disclosure (closed even while filters are chosen; the chosen ones show under it as removal links) and the pages, all
// plain links and forms. Any other list shows nothing without products. The theme's card settings decide the second
// photo on hover, the color dots and the quick add (site.theme_settings).
export const schema = {
  label: 'Product tiles',
  fields: [
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'intro', type: 'textarea', label: 'Short text under the heading' },
    { id: 'link_label', type: 'text', label: 'Link label' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/products' },
    { id: 'products', type: 'product_list', label: 'Store products', max: 24, filters: true, default: { from: 'all', sort: 'newest', limit: 8 } },
    { id: 'columns', type: 'select', label: 'Tiles per row on wide screens', options: ['3', '4', '2'], default: '3' },
    { id: 'frame', type: 'select', label: 'Photo framing', options: ['inset', 'edge'], default: 'inset' },
    { id: 'heading_place', type: 'select', label: 'Heading position', options: ['side', 'top'], default: 'top' },
    { id: 'show_count', type: 'select', label: 'Product count (a page\'s own list)', options: ['show', 'hide'], default: 'show' },
    { id: 'show_sort', type: 'select', label: 'Sort (a page\'s own list)', options: ['show', 'hide'], default: 'show' },
    { id: 'show_filters', type: 'select', label: 'Filters (a page\'s own list)', options: ['show', 'hide'], default: 'show' },
    { id: 'tone', type: 'select', label: 'Background', options: ['page', 'raised'], default: 'page' },
  ],
} as const;

export const styles = `
& .mr-tile { position: relative; display: block; background: var(--uk-color-surface); transition: background-color .3s ease; }
& .mr-tile--edge { background: transparent; }
& .mr-tile--inset { padding: clamp(14px, 2.6vw, 34px); }
& .mr-tile > .mr-alt { position: absolute; inset: 0; opacity: 0; transition: opacity .45s ease; }
& .mr-tile--inset > .mr-alt { inset: clamp(14px, 2.6vw, 34px); }
& .mr-name { margin: 0; font-family: var(--uk-font-body); font-size: var(--uk-text-sm); font-weight: 400; line-height: 1.45; color: var(--uk-color-ink); }
& .mr-head-side { position: sticky; top: calc(var(--uk-header-sticky, 0px) + var(--uk-space-5)); align-self: start; }
& .mr-card:hover .mr-alt, & .mr-card:focus-visible .mr-alt { opacity: 1; }
& .mr-card:hover .mr-tile { background: var(--uk-color-muted-bg); }
& .mr-card:focus-visible { outline: 1px solid var(--uk-color-ink); outline-offset: 6px; }
& .mr-dots { display: flex; gap: 6px; margin: 10px 0 0; }
& .mr-dots .uk-swatch { width: 10px; height: 10px; }
@media (max-width: 900px) {
  & .mr-tiles { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  & .mr-split { grid-template-columns: minmax(0, 1fr) !important; }
  & .mr-head-side { position: static; }
}
@media (max-width: 520px) { & .mr-tiles--2 { grid-template-columns: minmax(0, 1fr) !important; } }
`;

type Props = {
  t: Translate; site?: SiteInfo;
  heading?: string; intro?: string; link_label?: string; link_href?: string; products?: ProductList | null;
  columns?: string; frame?: string; heading_place?: string; show_count?: string; show_sort?: string; show_filters?: string; tone?: string;
};

function Dots({ item }: { item: ProductData }) {
  const option = (item.options ?? []).find((o) => (o.choices ?? []).some((c) => c.swatch));
  if (!option) return null;
  const marked = option.choices.filter((c) => c.swatch);
  return (
    <p className="mr-dots">
      {marked.slice(0, 6).map((c) => <SwatchDot key={c.id || c.name} swatch={c.swatch} />)}
      {marked.length > 6 ? <span aria-hidden="true" style={{ fontSize: 'var(--uk-text-xs)', lineHeight: '10px', color: 'var(--uk-color-text-muted)' }}>{`+${marked.length - 6}`}</span> : null}
      <span className="uk-visually-hidden">{`${option.name}: ${marked.map((c) => c.name).join(', ')}`}</span>
    </p>
  );
}

export default function ProductTiles(p: Props) {
  const { t } = p;
  const anchor = useId();
  const list = p.products && typeof p.products === 'object' ? p.products : null;
  const items = Array.isArray(list?.items) ? list.items.filter((x) => x && typeof x.id === 'string') : [];
  const own = !!list && Array.isArray(list.sort_options) && list.sort_options.length > 0;
  const picked = own && Array.isArray(list.active_filters) ? list.active_filters.length : 0;
  const empty = !items.length && !picked;
  if (empty && (!own || !t('collection.empty'))) return null;
  const cols = p.columns === '4' ? 4 : p.columns === '2' ? 2 : 3;
  const edge = p.frame === 'edge';
  const side = p.heading_place === 'side' && !own;
  const ts = p.site?.theme_settings ?? {};
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: ts.apply_page });
  const dots = ts.tile_color_dots !== false;
  const quick = ts.tile_add_button === true;
  const second = ts.tile_hover_photo !== false;
  const sizes = cols === 2 ? '(max-width: 520px) calc(100vw - 48px), (max-width: 900px) calc(50vw - 36px), 520px' : `(max-width: 900px) calc(50vw - 36px), ${cols === 4 ? 260 : 340}px`;
  const filtersOn = own && !empty && p.show_filters !== 'hide' && (list.filters.length > 0 || picked > 0) && !!t('filter.button');
  const count = own && p.show_count !== 'hide' ? t('collection.count', { count: list.total }) : '';
  const head = p.heading || p.intro || p.link_label ? (
    <div className={side ? 'mr-head-side' : 'mr-head'} style={{ display: side ? 'block' : 'grid', gridTemplateColumns: side ? undefined : 'minmax(0, 1fr) auto', alignItems: 'end', gap: 'var(--uk-space-3) var(--uk-space-6)', marginBottom: side ? 0 : 'var(--uk-space-7)' }}>
      <div>
        {p.heading ? <h2 className="uk-heading uk-heading--lg" style={{ margin: 0 }}>{p.heading}</h2> : null}
        {p.intro ? <p style={{ margin: 'var(--uk-space-3) 0 0', maxWidth: '38ch', color: 'var(--uk-color-text-muted)' }}>{p.intro}</p> : null}
      </div>
      {p.link_label && p.link_href ? (
        <a href={p.link_href} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: side ? 'var(--uk-space-5)' : 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-ink)', textDecoration: 'none', borderBottom: '1px solid currentColor', paddingBottom: 3 }}>
          {p.link_label}
          <Icon name="arrow" size={14} />
        </a>
      ) : null}
    </div>
  ) : null;
  const grid = items.length ? (
    <ul className={`mr-tiles mr-tiles--${cols}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 'clamp(40px, 5vw, 72px) clamp(14px, 2.4vw, 32px)', margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item, i) => {
        const alt = second && item.image ? (item.images ?? []).find((x) => x && x.url && x.url !== item.image?.url) : undefined;
        const sold = !!item.price && !item.available;
        const sub = !!p.heading || own;
        return (
          <li key={item.id}>
            <a className="mr-card" href={item.url} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
              <span className={edge ? 'mr-tile mr-tile--edge' : 'mr-tile mr-tile--inset'}>
                <span className="uk-media" style={{ display: 'block', aspectRatio: '1 / 1', background: edge ? 'var(--uk-color-surface)' : 'transparent' }}>
                  {item.image ? <Image image={item.image} alt="" sizes={sizes} priority={own && i < cols} /> : <span style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={36} /></span>}
                </span>
                {alt ? <span className="mr-alt uk-media" style={{ display: 'block' }}><Image image={alt} alt="" sizes={sizes} /></span> : null}
              </span>
              <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '2px 16px', marginTop: 16 }}>
                {sub ? <h3 className="mr-name">{item.name}</h3> : <h2 className="mr-name">{item.name}</h2>}
                <span style={{ flex: 'none', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {hidden ? null : <Price price={item.price} compare={item.compare_at} labels={{ was: t('product.was'), now: t('product.now') }} />}
                </span>
              </span>
              {sold && t('product.sold_out') ? <span style={{ display: 'block', marginTop: 4, fontSize: 'var(--uk-text-xs)', letterSpacing: '.04em', color: 'var(--uk-color-text-muted)' }}>{t('product.sold_out')}</span> : null}
              {dots ? <Dots item={item} /> : null}
            </a>
            {hidden ? <p style={{ margin: '6px 0 0', fontSize: 'var(--uk-text-xs)' }}><SignInForPrices pricesHidden={hidden} /></p> : null}
            {quick && !hidden ? (
              <div style={{ marginTop: 12 }}>
                <QuickAdd product={item} full labels={{ add: t('product.quick_add'), choose: t('product.choose'), was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  ) : !empty && t('filter.empty') ? <p style={{ margin: 0, color: 'var(--uk-color-text-muted)' }}>{t('filter.empty')}</p> : null;
  return (
    <section id={own ? anchor : undefined} style={{ padding: `${own ? 'var(--uk-space-5)' : 'var(--uk-section-md)'} 0 var(--uk-section-md)`, background: p.tone === 'raised' ? 'var(--uk-color-muted-bg)' : undefined }}>
      <Container>
        {own && !empty ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px 24px', marginBottom: filtersOn ? 0 : 'var(--uk-space-6)', paddingBottom: 'var(--uk-space-3)', borderBottom: '1px solid var(--uk-color-line)', fontSize: 'var(--uk-text-sm)' }}>
            {count ? <p style={{ margin: 0, color: 'var(--uk-color-text-muted)' }}>{count}</p> : <span />}
            {p.show_sort !== 'hide' ? (
              <SortSelect list={list} anchor={anchor} labels={{ label: t('sort.label'), apply: t('common.apply'), featured: t('sort.featured'), best_selling: t('sort.best_selling'), newest: t('sort.newest'), price_asc: t('sort.price_low'), price_desc: t('sort.price_high'), name: t('sort.name') }} />
            ) : null}
          </div>
        ) : null}
        {filtersOn ? (
          <div style={{ marginBottom: 'var(--uk-space-6)' }}>
            <details className="uk-disclosure">
              <summary style={{ fontSize: 'var(--uk-text-sm)', fontWeight: 400 }}>
                {picked ? `${t('filter.button')} (${picked})` : t('filter.button')}
                <Icon name="sliders" size={16} />
              </summary>
              <div style={{ maxWidth: 560 }}>
                <FilterForm list={list} labels={{ apply: t('common.apply'), min: t('filter.min'), max: t('filter.max'), count: t('filter.count_word'), remove: t('filter.remove') }} anchor={anchor} active={false} />
              </div>
            </details>
            <ActiveFilters list={list} labels={{ remove: t('filter.remove') }} anchor={anchor} />
          </div>
        ) : null}
        {empty ? <p style={{ margin: 0, color: 'var(--uk-color-text-muted)' }}>{t('collection.empty')}</p> : null}
        {side && head ? (
          <div className="mr-split" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)', gap: 'var(--uk-space-7) clamp(32px, 6vw, 96px)' }}>
            {head}
            {grid}
          </div>
        ) : (
          <>
            {head}
            {grid}
          </>
        )}
        {own && list.pages > 1 && (list.prev_url || list.next_url) ? (
          <div style={{ marginTop: 'var(--uk-section-sm)' }}>
            <Pagination list={list} prev={t('pagination.previous')} next={t('pagination.next')} label={t('pagination.label')} page={t('pagination.page')} of={t('pagination.of')} anchor={anchor} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
