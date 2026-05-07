import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/client";

import Builder from "./builder/Builder";
import SitePage from "./site/SitePage";
import TemplateLivePreview from "./site/TemplateLivePreview";

const DASHBOARD_LOGIN_URL =
  import.meta.env.VITE_DASHBOARD_LOGIN_URL || "http://localhost:3000";

function readTokens() {
  const url = new URL(window.location.href);

  let access_token = url.searchParams.get("access_token");
  let refresh_token = url.searchParams.get("refresh_token");

  if ((!access_token || !refresh_token) && window.location.hash.includes("?")) {
    const hashQuery = window.location.hash.split("?")[1] || "";
    const params = new URLSearchParams(hashQuery);
    access_token = access_token || params.get("access_token");
    refresh_token = refresh_token || params.get("refresh_token");
  }

  return { access_token, refresh_token };
}

function SessionHydrator({ children }) {
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    (async () => {
      const { access_token, refresh_token } = readTokens();

      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });

        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("access_token");
        cleanUrl.searchParams.delete("refresh_token");

        if (window.location.hash.includes("?")) {
          cleanUrl.hash = window.location.hash.split("?")[0];
        }

        window.history.replaceState({}, "", cleanUrl.toString());
      }

      setHydrating(false);
    })();
  }, []);

  if (hydrating) {
    return null;
  }

  return children;
}

function ProtectedBuilder({ children }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        window.location.href = DASHBOARD_LOGIN_URL;
        return;
      }

      setAllowed(true);
      setCheckingAuth(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        window.location.href = DASHBOARD_LOGIN_URL;
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (checkingAuth) {
    return null;
  }

  if (!allowed) {
    return null;
  }

  return children;
}

function BuilderWrapper() {
  const { orgId } = useParams();

  return (
    <ProtectedBuilder>
      <Builder orgId={orgId} />
    </ProtectedBuilder>
  );
}

function ProtectedBuilderHome() {
  return (
    <ProtectedBuilder>
      <Builder />
    </ProtectedBuilder>
  );
}

export default function App() {
  return (
    <HashRouter>
      <SessionHydrator>
        <Routes>
          {/* Default */}
          <Route path="/" element={<Navigate to="/builder" replace />} />

          {/* Builder */}
          <Route path="/builder" element={<ProtectedBuilderHome />} />
          <Route path="/builder/:orgId" element={<BuilderWrapper />} />

          {/* Public Website */}
          <Route path="/site/:siteId" element={<SitePage />} />
          <Route path="/site/:siteId/*" element={<SitePage />} />
          <Route
            path="/template-preview/:layoutKey/:templateKey/*"
            element={<TemplateLivePreview />}
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/builder" replace />} />
        </Routes>
      </SessionHydrator>
    </HashRouter>
  );
}
