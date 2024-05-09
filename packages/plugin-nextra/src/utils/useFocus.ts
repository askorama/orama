import { useRouter } from "next/router.js";
import React, { useEffect, useState } from "react";

export const useFocus = ({ inputRef }) => {
  const { asPath } = useRouter();
  const [hasFocus, setHasFocus] = useState(false);
  // If the user presses ESC, we close the search box
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      setHasFocus(true);
    } else {
      setHasFocus(false);
    }
  }, []);

  useEffect(() => {
    const onKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current?.focus();
        setHasFocus(true);
      }
    };
    window.addEventListener("keydown", onKeyDownHandler);

    return () => {
      window.removeEventListener("keydown", onKeyDownHandler);
    };
  }, []);

  // If the path changes, we close the search box
  useEffect(() => {
    setHasFocus(false);
  }, [asPath]);

  return {
    hasFocus,
    setHasFocus,
  };
};
