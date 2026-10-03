"use client";

import { useEffect } from "react";

/**
 * Prevents text selection, copy, cut and context-menu across the entire page.
 * Inputs/textareas remain selectable via the CSS override in globals.css.
 */
export function CopyGuard() {
  useEffect(() => {
    function block(e: Event) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
    }
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("contextmenu", block);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  return null;
}
