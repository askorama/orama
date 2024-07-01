import { useEffect, useState } from "react";
import { OramaClient } from "@oramacloud/client";
import { SearchBox, SearchButton } from "@orama/searchbox";
import "@orama/searchbox/dist/index.css";

export const client = new OramaClient({
  api_key: "P9buEfpy8rWvT265McikCG1tP4pT6cBg",
  endpoint: "https://cloud.orama.run/v1/indexes/askorama-ai-development-uc6oxa",
});

export function Search() {
  const [theme, setTheme] = useState();

  function initSearchBox() {
    try {
      setTheme(document.documentElement.dataset.theme);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    initSearchBox();
  }, []);

  useEffect(() => {

    function callback(mutationList) {
      for (const mutation of mutationList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName == "data-theme"
        ) {
          setTheme(document.documentElement.dataset.theme);
        }
      }
    }

    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!theme) return null;

  return (
    <>
      <SearchBox
        {...{
          oramaInstance: client,
          backdrop: true,
          colorScheme: theme,
          resultsMap: {
            description: "content",
          },
          setResultTitle: (doc) => doc.title.split("| Orama Docs")[0],
        }}
      />
      <SearchButton colorScheme={theme} themeConfig={{
        dark: {
          '--search-btn-background-color': '#201c27',
          '--search-btn-background-color-hover': '#201c27',
        }
      }} />
    </>
  );
};
