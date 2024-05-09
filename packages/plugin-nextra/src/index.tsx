import { useRouter } from "next/compat/router.js";
import React, { useEffect, useState } from "react";
import { createOramaIndex } from "./utils/index.js";
import { SearchBox, SearchButton } from "@orama/searchbox/dist/index.js";

export type OramaSearchProps = {
  limitResults: number;
  boost: {
    title: number;
    description: number;
    content: number;
  };
};

const indexes = {};

const defaultProps: OramaSearchProps = {
  limitResults: 30,
  boost: {
    title: 2,
    description: 1,
    content: 1,
  },
};

export function OramaSearch(props = defaultProps) {
  const router = useRouter();

  return router?.isReady ? (
    <OramaSearchPlugin {...props} router={router} />
  ) : null;
}

function OramaSearchPlugin({ router, ...props }) {
  const [, setIndexing] = useState(false);

  const { basePath, locale = "en-US", asPath } = router;

  // As soon as the page loads, we create the index on the client-side
  useEffect(() => {
    setIndexing(true);

    createOramaIndex(basePath, locale).then((index) => {
      indexes[locale] = index;
      setIndexing(false);
    });
  }, []);

  // If the locale changes, we create the index on the client-side
  useEffect(() => {
    if (!(locale in indexes)) {
      setIndexing(true);
      createOramaIndex(basePath, locale).then((index) => {
        indexes[locale] = index;
        setIndexing(false);
      });
    }
  }, [basePath, locale]);

  return indexes[locale] ? (
    <div>
      <SearchBox
        oramaInstance={indexes[locale]}
        backdrop
        colorScheme="system"
        resultsMap={{
          path: "url",
          description: "content",
        }}
      />
      <SearchButton colorScheme="system" />
    </div>
  ) : null;
}
