const SHOPIFY_DOMAIN = 'annabellabridal-3.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = 'f57ad36a98ea4c2764860b4e35161ce2';

const NORMALIZATION_MAP = {
  style: {
    'minimal & sade': ['minimal', 'clean', 'simple', 'modern'],
    'prenses & kabarık': ['princess', 'ballgown', 'voluminous', 'romantic'],
    'modern & cesur': ['modern', 'bold', 'statement', 'avantgarde'],
    'vintage & romantik': ['vintage', 'romantic', 'lace', 'classic']
  },
  fabric: {
    'pürüzsüz saten': ['satin', 'mikado', 'silk'],
    'romantik dantel': ['lace', 'guipure', 'chantilly'],
    'uçuşan tül': ['tulle', 'softtulle', 'airy'],
    'dokulu jakar': ['jacquard', 'textured', 'brocade']
  },
  budget: {
    '40-60k': [40000, 60000],
    '60-80k': [60000, 80000],
    '80-120k': [80000, 120000],
    'limitim yok': [0, Number.POSITIVE_INFINITY]
  }
};

export async function fetchShopifyProducts() {
  const query = `{
    products(first: 100) {
      edges {
        node {
          title
          handle
          tags
          images(first: 1) { edges { node { url altText } } }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
    }
  }`;

  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN
      },
      body: JSON.stringify({ query })
    });

    const json = await response.json();
    if (!json?.data?.products?.edges) {
      console.error('Shopify response malformed', json?.errors || json);
      return [];
    }

    return json.data.products.edges.map(({ node }) => ({
      name: node.title || 'İsimsiz Ürün',
      handle: node.handle,
      url: `https://${SHOPIFY_DOMAIN}/products/${node.handle}`,
      img: node.images.edges?.[0]?.node?.url || '',
      imgAlt: node.images.edges?.[0]?.node?.altText || node.title || 'Annabella Gelinlik',
      price: Number.parseFloat(node.priceRange?.minVariantPrice?.amount || '0'),
      currencyCode: node.priceRange?.minVariantPrice?.currencyCode || 'TRY',
      traits: (node.tags || []).map((t) => t.trim().toLowerCase())
    }));
  } catch (error) {
    console.error('Shopify fetch error', error);
    return [];
  }
}

function scoreByTagIntersection(productTraits, targetTags) {
  if (!targetTags.length) return 0;
  let score = 0;
  for (const tag of targetTags) {
    if (productTraits.some((trait) => trait.includes(tag) || tag.includes(trait))) {
      score += 1;
    }
  }
  return score;
}

function scoreByBudget(price, budgetSelection) {
  const normalized = budgetSelection?.toLowerCase?.();
  const [min, max] = NORMALIZATION_MAP.budget[normalized] || [0, Number.POSITIVE_INFINITY];
  if (price >= min && price <= max) return 3;
  if (price > max && price <= max * 1.2) return 1;
  if (price < min && price >= min * 0.85) return 1;
  return 0;
}

export function selectBestMatches(products, userChoices, limit = 3) {
  const selectedStyle = userChoices?.style?.toLowerCase?.() || '';
  const selectedFabric = userChoices?.fabric?.toLowerCase?.() || '';
  const styleTags = NORMALIZATION_MAP.style[selectedStyle] || [];
  const fabricTags = NORMALIZATION_MAP.fabric[selectedFabric] || [];

  const scored = products
    .map((product) => {
      const styleScore = scoreByTagIntersection(product.traits, styleTags) * 2;
      const fabricScore = scoreByTagIntersection(product.traits, fabricTags) * 2;
      const budgetScore = scoreByBudget(product.price, userChoices?.budget);
      const totalScore = styleScore + fabricScore + budgetScore;
      return { ...product, score: totalScore };
    })
    .filter((product) => product.score > 0)
    .sort((a, b) => b.score - a.score || a.price - b.price);

  if (scored.length >= limit) return scored.slice(0, limit);

  const fallback = products
    .filter((p) => !scored.find((s) => s.handle === p.handle))
    .sort((a, b) => a.price - b.price)
    .slice(0, limit - scored.length)
    .map((p) => ({ ...p, score: 0 }));

  return [...scored, ...fallback].slice(0, limit);
}
