async function getAlgoliaFetchParams(
  query: string,
  appId: string,
  apiKey: string,
  indexName: string,
  hits: number,
  additionalParams: object = {},
) {
  const res = await fetch(
    `https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
      method: "POST",
      headers: {
        "X-Algolia-Application-Id": appId,
        "X-Algolia-API-Key": apiKey,
      },
      body: JSON.stringify({
        params: `query=${query}&hitsPerPage=${hits}`,
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
        ...additionalParams,
      }),
    },
  );

  const data = await res.json();

  return data;
}

export function getDarkcordDocsResults(query: string) {
  return getAlgoliaFetchParams(
    query,
    "9ZV7KCZOK0",
    "1a7df25595a5c1fcd7172853eb29160c",
    "darkcord",
    10,
  );
}

type AlgoliaHighlight = {
  value: string;
};

export type AlgoliaItemHierarchy<T> = {
  lvl0?: T | null;
  lvl1?: T | null;
  lvl2?: T | null;
  lvl3?: T | null;
  lvl4?: T | null;
  lvl5?: T | null;
  lvl6?: T | null;
};

export type AlgoliaItemType = {
  objectID: string;
  firstname: string;
  lastname: string;
  zip_code: number;
  _highlightResult: {
    content: AlgoliaHighlight | null;
    hierarchy: AlgoliaItemHierarchy<AlgoliaHighlight>;
  };
};
