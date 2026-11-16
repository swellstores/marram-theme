import type { ReactElement } from 'react';
import type { ProductData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { Breadcrumbs, Container, Icon, Image, pricesHiddenFor, ProductForm, RichText, SellList } from 'ui-kit';

// The product page, kept spare: a slim column of photo links at the far left, the chosen photo large on a pale plinth
// in the middle, and a narrow column of details on the right that stays in view (trail, name, rating from a reviews
// app, the add-to-cart form with every option and purchase choice, the merchant's text blocks, the up-sells, the
// description, a bundle's items, the attributes as a ruled table and the merchant's own notes). On a phone: the photo,
// the photo links in a row, then the details. Everything about the product is the store's; nothing without one.
export const schema = {
  label: 'Product focus',
  fields: [
    { id: 'product', type: 'product', label: 'Product', default: 'current' },
    { id: 'plinth', type: 'select', label: 'Photo background', options: ['pale', 'none'], default: 'pale' },
    { id: 'pairs', type: 'product_list', label: 'Goes with (the product\'s up-sells)', max: 4, default: { from: 'up_sells', limit: 3 } },
    { id: 'show_attributes', type: 'select', label: 'Product attributes table', options: ['show', 'hide'], default: 'show' },
    {
      id: 'fine_print', type: 'list', label: 'Notes on every product (shipping, returns, care)', max: 5,
      item: [
        { id: 'name', type: 'text', label: 'Title' },
        { id: 'words', type: 'textarea', label: 'Text' },
      ],
    },
  ],
  blocks: { types: ['text'], max: 4 },
} as const;

export const styles = `
& .mr-focus { display: grid; grid-template-columns: 72px minmax(0, 7fr) minmax(0, 4fr); gap: var(--uk-space-6) clamp(20px, 3.4vw, 56px); align-items: start; }
& .mr-thumbs { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; position: sticky; top: calc(var(--uk-header-sticky, 0px) + var(--uk-space-5)); }
& .mr-thumbs a { display: block; aspect-ratio: 1 / 1; background: var(--uk-color-surface); outline: 1px solid transparent; outline-offset: 3px; transition: outline-color .2s ease; }
& .mr-thumbs a[aria-current="true"], & .mr-thumbs a:hover { outline-color: var(--uk-color-line-strong); }
& .mr-side { position: sticky; top: calc(var(--uk-header-sticky, 0px) + var(--uk-space-5)); display: grid; gap: var(--uk-space-6); }
& .mr-facts { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); margin: 0; font-size: var(--uk-text-sm); }
& .mr-facts dt, & .mr-facts dd { margin: 0; padding: 10px 0; border-top: 1px solid var(--uk-color-line); }
& .mr-facts dt { color: var(--uk-color-text-muted); }
@media (max-width: 900px) {
  & .mr-focus { grid-template-columns: minmax(0, 1fr); }
  & .mr-focus > .mr-stage { order: -1; }
  & .mr-thumbs { position: static; grid-auto-flow: column; grid-auto-columns: 64px; overflow-x: auto; padding: 4px; }
  & .mr-side { position: static; }
  & .mr-focus > :first-child:empty { display: none; }
}
`;

type Props = {
  blocks?: ReactElement[]; // core text blocks, under the buy box
  t: Translate; site?: SiteInfo;
  product?: ProductData | null; plinth?: string; pairs?: ProductList | null; show_attributes?: string; fine_print?: { name?: string; words?: string }[];
};

// ProductForm's words, from the core Store text (an empty word leaves its part out)
function formWords(t: Translate, quantity: boolean) {
  const plain = Object.fromEntries(
    ([['add', 'add_to_cart'], ['sold_out', 'sold_out'], ['unavailable', 'unavailable'], ['preorder', 'preorder'], ['backorder', 'backorder'], ['was', 'was'], ['now', 'now'],
      ['purchase', 'purchase_options'], ['one_time', 'one_time'], ['subscribe', 'subscribe'], ['trial', 'trial'], ['promise', 'promise']] as const).map(([k, key]) => [k, t(`product.${key}`)]),
  );
  return {
    ...plain,
    quantity: quantity ? t('common.quantity') : '',
    save: (percent: number) => t('product.save', { percent }),
    delivered: (every: string) => t('product.delivered', { every }),
    billed: (every: string) => t('product.billed', { every }),
    payments: (count: number) => t('product.payments', { count }),
    trial_then: (days: string, price: string) => t('product.trial_then', { days, price }),
  };
}

export default function ProductFocus(p: Props) {
  const { t } = p;
  const item = p.product && typeof p.product === 'object' ? p.product : null;
  if (!item) return <>{p.blocks}</>;
  const own = p.site?.page.kind === 'product' && item.url === p.site.page.path;
  const lead = item.selected?.image ?? item.image;
  const photos = (Array.isArray(item.images) ? item.images : []).filter((x) => x && x.url);
  const facts = p.show_attributes === 'hide' ? [] : item.attributes.filter((a) => a.values.length);
  const notes = (p.fine_print ?? []).filter((n) => n && (n.name || n.words));
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page });
  const stars = item.rating && t('product.rating') ? item.rating : null;
  const pale = p.plinth !== 'none';
  return (
    <section style={{ padding: 'var(--uk-space-6) 0 var(--uk-section-md)' }}>
      <Container>
        <div className="mr-focus">
          <div>
            {photos.length > 1 ? (
              <ul className="mr-thumbs" aria-label={t('product_info.photos') || undefined}>
                {photos.map((ph, i) => (
                  <li key={ph.url}>
                    <a href={ph.url} data-site-photo="" aria-current={ph.url === lead?.url ? 'true' : undefined} className="uk-media">
                      <Image image={ph} alt={ph.alt && ph.alt !== item.name ? ph.alt : t('product.photo', { number: i + 1 }) || `${item.name} ${i + 1}`} sizes="72px" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="mr-stage" style={{ padding: pale ? 'clamp(20px, 5vw, 80px)' : 0, background: pale ? 'var(--uk-color-surface)' : undefined }}>
            <div className="uk-media" style={{ aspectRatio: '1 / 1' }}>
              {lead ? <Image image={lead} sizes="(max-width: 900px) calc(100vw - 88px), 560px" priority variantImage /> : <span style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={64} /></span>}
            </div>
          </div>
          <div className="mr-side">
            <div>
              <div style={{ marginBottom: 'var(--uk-space-5)', fontSize: 'var(--uk-text-xs)' }}>
                <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, item.category, { name: item.name, url: item.url }]} label={t('navigation.breadcrumb')} />
              </div>
              {own ? <h1 className="uk-heading uk-heading--lg" style={{ margin: 0 }}>{item.name}</h1> : <h2 className="uk-heading uk-heading--lg" style={{ margin: 0 }}>{item.name}</h2>}
              {stars ? (
                <p style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 'var(--uk-space-3) 0 0', fontSize: 'var(--uk-text-xs)', color: 'var(--uk-color-text-muted)' }}>
                  <span aria-hidden="true" style={{ display: 'inline-flex', color: 'var(--uk-color-highlight)' }}>
                    {Array.from({ length: Math.round(Math.min(5, Math.max(0, stars.average))) }, (_, i) => <Icon key={i} name="star" size={12} />)}
                  </span>
                  {t('product.rating', { average: String(Math.round(stars.average * 10) / 10), count: String(stars.count) })}
                </p>
              ) : null}
            </div>
            <ProductForm product={item} labels={formWords(t, p.site?.theme_settings?.product_quantity !== false)} primary={own} locale={p.site?.locale} pricesHidden={hidden} />
            {p.blocks}
            {p.pairs?.items?.length ? (
              <div>
                {t('product.pairs_with') ? <h2 style={{ margin: '0 0 var(--uk-space-3)', fontFamily: 'var(--uk-font-body)', fontSize: 'var(--uk-text-sm)', fontWeight: 500, color: 'var(--uk-color-heading)' }}>{t('product.pairs_with')}</h2> : null}
                <SellList list={p.pairs} pricesHidden={hidden} labels={{ add: t('product.quick_add'), choose: t('product.choose'), was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }} />
              </div>
            ) : null}
            {item.description.length ? <div style={{ fontSize: 'var(--uk-text-sm)', lineHeight: 1.75, color: 'var(--uk-color-text-muted)' }}><RichText value={item.description} /></div> : null}
            {item.bundle.length && t('product.bundle') ? (
              <div>
                <h2 style={{ margin: '0 0 var(--uk-space-2)', fontFamily: 'var(--uk-font-body)', fontSize: 'var(--uk-text-sm)', fontWeight: 500, color: 'var(--uk-color-heading)' }}>{t('product.bundle')}</h2>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 'var(--uk-text-sm)', lineHeight: 1.9 }}>
                  {item.bundle.map((b, i) => <li key={i}>{b.quantity} × {b.url ? <a href={b.url} style={{ color: 'inherit' }}>{b.name}</a> : b.name}</li>)}
                </ul>
              </div>
            ) : null}
            {facts.length ? (
              <div>
                {t('product_info.details') ? <h2 style={{ margin: '0 0 var(--uk-space-2)', fontFamily: 'var(--uk-font-body)', fontSize: 'var(--uk-text-sm)', fontWeight: 500, color: 'var(--uk-color-heading)' }}>{t('product_info.details')}</h2> : null}
                <dl className="mr-facts">
                  {facts.map((a) => [<dt key={`${a.id}-n`}>{a.name}</dt>, <dd key={`${a.id}-v`}>{a.values.join(', ')}</dd>])}
                </dl>
              </div>
            ) : null}
            {notes.length ? (
              <div style={{ borderTop: '1px solid var(--uk-color-line)' }}>
                {notes.map((n, i) => (
                  <details key={i} className="uk-disclosure">
                    <summary style={{ fontSize: 'var(--uk-text-sm)', fontWeight: 400 }}>{n.name}<Icon name="chevron" size={14} /></summary>
                    {String(n.words ?? '').split(/\n\s*\n/).filter((x) => x.trim()).map((x, j) => <p key={j} style={{ fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{x.trim()}</p>)}
                  </details>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
