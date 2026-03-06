import { HashRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./supabase/client";

import Builder from "./builder/Builder";
import SitePage from "./site/SitePage";


function readTokens() {
  const url = new URL(window.location.href);

  // 1) normal query
  let access_token = url.searchParams.get("access_token");
  let refresh_token = url.searchParams.get("refresh_token");

  // 2) tokens inside hash query (recommended)
  // Example: http://localhost:5174/#/builder/ORG?access_token=...&refresh_token=...
  if ((!access_token || !refresh_token) && window.location.hash.includes("?")) {
    const hashQuery = window.location.hash.split("?")[1] || "";
    const params = new URLSearchParams(hashQuery);
    access_token = access_token || params.get("access_token");
    refresh_token = refresh_token || params.get("refresh_token");
  }

  return { access_token, refresh_token };
}

function SessionHydrator({ children }) {
  useEffect(() => {
    (async () => {
      const { access_token, refresh_token } = readTokens();

      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });

        // clean tokens from BOTH search and hash
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("access_token");
        cleanUrl.searchParams.delete("refresh_token");

        if (window.location.hash.includes("?")) {
          cleanUrl.hash = window.location.hash.split("?")[0];
        }

        window.history.replaceState({}, "", cleanUrl.toString());
      }
    })();
  }, []);

  return children;
}

function BuilderWrapper() {
  const { orgId } = useParams();
  return <Builder orgId={orgId} />;
}

export default function App() {
  return (
    <HashRouter>
      <SessionHydrator>
        <Routes>
          {/* Builder */}
          <Route path="/" element={<Builder />} />
          <Route path="/builder/:orgId" element={<BuilderWrapper />} />

          {/* Public Website (DB-driven) */}
          <Route path="/site/:siteId" element={<SitePage />} />
          <Route path="/site/:siteId/:slug" element={<SitePage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionHydrator>
    </HashRouter>
  );
}