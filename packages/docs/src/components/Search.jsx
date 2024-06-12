import { useEffect, useState } from "react";
import { SearchBox, SearchButton } from "@orama/searchbox";
import "@orama/searchbox/dist/index.css";
import { getOramaDB } from "../../plugins/client";

export const Search = () => {
  const [theme, setTheme] = useState();
  const [client, setClient] = useState();

  const initSearchBox = async () => {
    try {
      setTheme(document.documentElement.dataset.theme);
      const db = await getOramaDB("docs");
      setClient(db);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initSearchBox();
  }, []);

  useEffect(() => {
    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName == "data-theme"
        ) {
          setTheme(document.documentElement.dataset.theme);
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return client ? (
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
      <SearchButton colorScheme={theme} />
    </>
  ) : null;
};
