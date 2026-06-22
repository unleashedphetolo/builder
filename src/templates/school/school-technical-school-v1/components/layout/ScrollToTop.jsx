import { useEffect } from "react";

export default function ScrollToTop() {

  useEffect(() => {

    function scrollTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });
    }

    /* builder navigation */
    window.addEventListener("builder:navigate", scrollTop);

    /* iframe navigation */
    window.addEventListener("message", (e) => {
      if (e.data?.type === "navigate") {
        scrollTop();
      }
    });

    return () => {
      window.removeEventListener("builder:navigate", scrollTop);
    };

  }, []);

  return null;
}