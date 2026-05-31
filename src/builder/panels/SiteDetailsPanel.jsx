import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

export default function SiteDetailsPanel({
  siteSettings = {},
  onUpdateSettings,
  organization = {},
  onUpdateOrganization,
  userRole,
  profile = {},
}) {
  const siteLogoUrl = siteSettings?.logo_url || "";
  const siteName = siteSettings?.site_name || "";
  const siteTagline = siteSettings?.tagline || "";
  const siteMotto = siteSettings?.motto || "";
  const siteEmail = siteSettings?.email || "";
  const sitePhone = siteSettings?.phone || "";

  const [databaseRole, setDatabaseRole] = useState("");

  const currentRole =
    userRole ||
    profile?.role ||
    databaseRole ||
    siteSettings?.user_role ||
    siteSettings?.current_user_role ||
    siteSettings?.profile_role ||
    "";

  const normalizedRole = String(currentRole || "")
    .trim()
    .toLowerCase();

  const hasResolvedRole = normalizedRole.length > 0;
  const canEditWebsiteDetails = hasResolvedRole && normalizedRole !== "user";
  const canShowOrganisationAddress =
    hasResolvedRole && normalizedRole !== "user";
  const canEditOrganisationAddress =
    hasResolvedRole && normalizedRole !== "user";

  const orgAddressLine1 =
    organization?.address_line1 || siteSettings?.address_line1 || "";

  const orgCity = organization?.city || siteSettings?.city || "";
  const orgProvince = organization?.province || siteSettings?.province || "";
  const orgPostalCode =
    organization?.postal_code || siteSettings?.postal_code || "";
  const orgCountry = organization?.country || siteSettings?.country || "";

  const [localSettings, setLocalSettings] = useState({
    ...(siteSettings || {}),
    logo_url: siteLogoUrl,
    site_name: siteName,
    tagline: siteTagline,
    motto: siteMotto,
    email: siteEmail,
    phone: sitePhone,
  });

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  const [detailsDraft, setDetailsDraft] = useState(() => ({
    site_name: siteName,
    tagline: siteTagline,
    motto: siteMotto,
    email: siteEmail,
    phone: sitePhone,
  }));

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [addressDraft, setAddressDraft] = useState(() => ({
    address_line1: orgAddressLine1,
    city: orgCity,
    province: orgProvince,
    postal_code: orgPostalCode,
    country: orgCountry,
  }));

  useEffect(() => {
    if (userRole || profile?.role) return undefined;

    let mounted = true;

    const timeout = window.setTimeout(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted || !user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (!error) {
        setDatabaseRole(data?.role || "");
      }
    }, 0);

    return () => {
      mounted = false;
      window.clearTimeout(timeout);
    };
  }, [userRole, profile?.role]);

  useEffect(() => {
    if (isEditingDetails) return undefined;

    const timeout = window.setTimeout(() => {
      const nextSettings = {
        ...(siteSettings || {}),
        logo_url: siteLogoUrl,
        site_name: siteName,
        tagline: siteTagline,
        motto: siteMotto,
        email: siteEmail,
        phone: sitePhone,
      };

      setLocalSettings((prev) => ({
        ...(prev || {}),
        ...nextSettings,
      }));

      setDetailsDraft({
        site_name: siteName,
        tagline: siteTagline,
        motto: siteMotto,
        email: siteEmail,
        phone: sitePhone,
      });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [
    isEditingDetails,
    siteSettings,
    siteLogoUrl,
    siteName,
    siteTagline,
    siteMotto,
    siteEmail,
    sitePhone,
  ]);

  useEffect(() => {
    if (isEditingAddress) return undefined;

    const timeout = window.setTimeout(() => {
      setAddressDraft({
        address_line1: orgAddressLine1,
        city: orgCity,
        province: orgProvince,
        postal_code: orgPostalCode,
        country: orgCountry,
      });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [
    isEditingAddress,
    orgAddressLine1,
    orgCity,
    orgProvince,
    orgPostalCode,
    orgCountry,
  ]);

  const updateDetailsDraft = (key, value) => {
    setDetailsDraft((prev) => ({
      ...(prev || {}),
      [key]: value,
    }));
  };

  const startEditingDetails = () => {
    if (!canEditWebsiteDetails) return;

    setDetailsDraft({
      site_name: localSettings?.site_name || "",
      tagline: localSettings?.tagline || "",
      motto: localSettings?.motto || "",
      email: localSettings?.email || "",
      phone: localSettings?.phone || "",
    });

    setIsEditingDetails(true);
  };

  const cancelEditingDetails = () => {
    setDetailsDraft({
      site_name: localSettings?.site_name || "",
      tagline: localSettings?.tagline || "",
      motto: localSettings?.motto || "",
      email: localSettings?.email || "",
      phone: localSettings?.phone || "",
    });

    setIsEditingDetails(false);
  };

  const saveWebsiteDetails = async () => {
    if (!canEditWebsiteDetails) return;

    const patch = {
      site_name: detailsDraft.site_name || "",
      tagline: detailsDraft.tagline || "",
      motto: detailsDraft.motto || "",
      email: detailsDraft.email || "",
      phone: detailsDraft.phone || "",
    };

    setIsSavingDetails(true);

    try {
      setLocalSettings((prev) => ({
        ...(prev || {}),
        ...patch,
      }));

      if (onUpdateSettings) {
        await onUpdateSettings(patch);
      }

      setIsEditingDetails(false);
    } finally {
      setIsSavingDetails(false);
    }
  };

  const updateAddressDraft = (key, value) => {
    setAddressDraft((prev) => ({
      ...(prev || {}),
      [key]: value,
    }));
  };

  const startEditingAddress = () => {
    if (!canEditOrganisationAddress) return;

    setAddressDraft({
      address_line1: orgAddressLine1,
      city: orgCity,
      province: orgProvince,
      postal_code: orgPostalCode,
      country: orgCountry,
    });

    setIsEditingAddress(true);
  };

  const cancelEditingAddress = () => {
    setAddressDraft({
      address_line1: orgAddressLine1,
      city: orgCity,
      province: orgProvince,
      postal_code: orgPostalCode,
      country: orgCountry,
    });

    setIsEditingAddress(false);
  };

  const saveOrganisationAddress = async () => {
    if (!canEditOrganisationAddress) return;

    const patch = {
      address_line1: addressDraft.address_line1 || "",
      city: addressDraft.city || "",
      province: addressDraft.province || "",
      postal_code: addressDraft.postal_code || "",
      country: addressDraft.country || "",
    };

    setIsSavingAddress(true);

    try {
      setLocalSettings((prev) => ({
        ...(prev || {}),
        ...patch,
      }));

      if (onUpdateOrganization) {
        await onUpdateOrganization(patch);
      } else if (onUpdateSettings) {
        await onUpdateSettings(patch);
      }

      setIsEditingAddress(false);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const openLogoCanvasEditor = () => {
    if (!canEditWebsiteDetails) return;

    const request = {
      type: "builder:open-media-editor",
      editorType: "logo",
      source: "site-details-panel",
    };

    /*
      Supports a template rendered directly inside the same builder document.
    */
    window.dispatchEvent(
      new CustomEvent("builder:open-media-editor", {
        detail: request,
      }),
    );

    /*
      Supports the live website preview rendered inside BuilderCanvas iframe.
      The navbar receives this request, selects the logo and opens Edit Logo.
    */
    if (window.previewFrame?.contentWindow) {
      window.previewFrame.contentWindow.postMessage(request, "*");
    }
  };

  const logoPreviewUrl = localSettings?.logo_url || siteLogoUrl || "";

  const fullAddressPreview = [
    addressDraft.address_line1,
    addressDraft.city,
    addressDraft.province,
    addressDraft.postal_code,
    addressDraft.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="section-block">
      <style>
        {`
          .enterprise-details-card,
          .enterprise-address-card {
            margin-top: 16px;
            border: 1px solid #dbeafe;
            background:
              linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(248, 250, 252, 0.98));
            border-radius: 18px;
            padding: 14px;
            box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
          }

          .enterprise-details-header,
          .enterprise-address-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 14px;
          }

          .enterprise-details-title,
          .enterprise-address-title {
            display: grid;
            gap: 4px;
          }

          .enterprise-details-title strong,
          .enterprise-address-title strong {
            color: #0f172a;
            font-size: 14px;
            font-weight: 950;
          }

          .enterprise-details-title span,
          .enterprise-address-title span {
            color: #64748b;
            font-size: 11px;
            font-weight: 750;
            line-height: 1.4;
          }

          .enterprise-details-actions,
          .enterprise-address-actions {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
          }

          .enterprise-btn {
            border: 1px solid #dbeafe;
            border-radius: 999px;
            padding: 8px 12px;
            font-size: 11px;
            font-weight: 900;
            cursor: pointer;
            transition:
              transform 160ms ease,
              box-shadow 160ms ease,
              opacity 160ms ease;
          }

          .enterprise-btn:hover {
            transform: translateY(-1px);
          }

          .enterprise-btn:disabled {
            opacity: 0.65;
            cursor: wait;
            transform: none;
          }

          .enterprise-btn.primary {
            border-color: #2563eb;
            background: #2563eb;
            color: #ffffff;
            box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
          }

          .enterprise-btn.primary:hover {
            background: #1d4ed8;
            border-color: #1d4ed8;
            color: #ffffff !important;
          }

          .enterprise-btn.primary:focus,
          .enterprise-btn.primary:focus-visible {
            color: #ffffff !important;
          }

          .enterprise-btn.secondary {
            background: #ffffff;
            color: #1d4ed8;
          }

          .enterprise-btn.secondary:hover {
            background: #eff6ff;
            color: #1d4ed8 !important;
          }

          .enterprise-btn.danger {
            background: #ffffff;
            border-color: #fecaca;
            color: #b91c1c;
          }

          .enterprise-btn.danger:hover {
            background: #fef2f2;
            color: #b91c1c !important;
          }

          .enterprise-logo-management {
            margin-bottom: 14px;
            padding: 12px;
            display: grid;
            grid-template-columns: 66px minmax(0, 1fr);
            align-items: center;
            gap: 12px;
            border: 1px solid #dbeafe;
            border-radius: 14px;
            background: #ffffff;
          }

          .enterprise-logo-preview {
            width: 66px;
            height: 66px;
            padding: 7px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background:
              linear-gradient(45deg, #f1f5f9 25%, transparent 25%),
              linear-gradient(-45deg, #f1f5f9 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f1f5f9 75%),
              linear-gradient(-45deg, transparent 75%, #f1f5f9 75%);
            background-position:
              0 0,
              0 8px,
              8px -8px,
              -8px 0;
            background-size: 16px 16px;
          }

          .enterprise-logo-preview img {
            display: block;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }

          .enterprise-logo-empty {
            color: #94a3b8;
            font-size: 10px;
            font-weight: 850;
            text-align: center;
            line-height: 1.3;
          }

          .enterprise-logo-info {
            min-width: 0;
            display: grid;
            gap: 5px;
          }

          .enterprise-logo-title-row {
            display: flex;
            align-items: center;
            gap: 7px;
            flex-wrap: wrap;
          }

          .enterprise-logo-title-row strong {
            color: #0f172a;
            font-size: 12px;
            font-weight: 950;
          }

          .enterprise-logo-badge {
            padding: 4px 7px;
            border-radius: 999px;
            background: #eff6ff;
            color: #2563eb;
            font-size: 9px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .enterprise-logo-info p {
            margin: 0;
            color: #64748b;
            font-size: 11px;
            font-weight: 750;
            line-height: 1.45;
          }

          .enterprise-logo-action {
            margin-top: 7px;
            display: flex;
            align-items: center;
          }

          .enterprise-logo-change-btn {
            appearance: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-height: 30px;
            padding: 0 11px;
            border: 1px solid #bfdbfe;
            border-radius: 999px;
            background: #eff6ff;
            color: #1d4ed8;
            font-size: 10px;
            font-weight: 950;
            line-height: 1;
            cursor: pointer;
            transition:
              transform 160ms ease,
              border-color 160ms ease,
              background 160ms ease,
              box-shadow 160ms ease;
          }

          .enterprise-logo-change-btn::before {
            content: "✎";
            font-size: 11px;
            line-height: 1;
          }

          .enterprise-logo-change-btn:hover {
            transform: translateY(-1px);
            border-color: #93c5fd;
            background: #dbeafe;
            box-shadow: 0 7px 16px rgba(37, 99, 235, 0.12);
          }

          .enterprise-logo-change-btn:focus-visible {
            outline: 3px solid rgba(37, 99, 235, 0.18);
            outline-offset: 2px;
          }

          .enterprise-details-grid,
          .enterprise-address-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .enterprise-address-preview {
            margin-top: 12px;
            padding: 12px;
            border-radius: 14px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
          }

          .enterprise-address-preview span {
            display: block;
            color: #64748b;
            font-size: 11px;
            font-weight: 850;
            margin-bottom: 5px;
          }

          .enterprise-address-preview strong {
            display: block;
            color: #0f172a;
            font-size: 12px;
            line-height: 1.5;
            font-weight: 850;
          }

          .enterprise-address-empty {
            color: #94a3b8 !important;
            font-style: italic;
            font-weight: 750 !important;
          }

          .enterprise-details-card input,
          .enterprise-address-card input,
          .enterprise-address-card textarea {
            background: #ffffff;
          }

          .enterprise-details-card input:disabled,
          .enterprise-address-card input:disabled,
          .enterprise-address-card textarea:disabled {
            background: #f8fafc;
            color: #475569;
            cursor: not-allowed;
          }

          .field textarea,
          textarea {
            min-height: 50px;
            resize: vertical;
          }

          @media (max-width: 720px) {
            .enterprise-details-header,
            .enterprise-address-header {
              flex-direction: column;
            }

            .enterprise-details-actions,
            .enterprise-address-actions {
              width: 100%;
              display: grid;
              grid-template-columns: 1fr 1fr;
            }

            .enterprise-details-actions .enterprise-btn,
            .enterprise-address-actions .enterprise-btn {
              width: 100%;
            }

            .enterprise-logo-management {
              grid-template-columns: 58px minmax(0, 1fr);
              gap: 10px;
              padding: 10px;
            }

            .enterprise-logo-preview {
              width: 58px;
              height: 58px;
            }

            .enterprise-details-grid,
            .enterprise-address-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <h4>Website Details</h4>

      <div className="enterprise-details-card">
        <div className="enterprise-details-header">
          <div className="enterprise-details-title">
            <strong>Website Information</strong>
            <span>
              Manage the public website name, slogan, motto and official contact
              details.
            </span>
          </div>

          {canEditWebsiteDetails && (
            <div className="enterprise-details-actions">
              {!isEditingDetails ? (
                <button
                  type="button"
                  className="enterprise-btn primary"
                  onClick={startEditingDetails}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="enterprise-btn secondary"
                    onClick={saveWebsiteDetails}
                    disabled={isSavingDetails}
                  >
                    {isSavingDetails ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    className="enterprise-btn danger"
                    onClick={cancelEditingDetails}
                    disabled={isSavingDetails}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="enterprise-logo-management">
          <div className="enterprise-logo-preview">
            {logoPreviewUrl ? (
              <img
                src={logoPreviewUrl}
                alt={`${localSettings?.site_name || "Website"} logo preview`}
              />
            ) : (
              <span className="enterprise-logo-empty">No logo</span>
            )}
          </div>

          <div className="enterprise-logo-info">
            <div className="enterprise-logo-title-row">
              <strong>Website Logo</strong>
              <span className="enterprise-logo-badge">Canvas editor</span>
            </div>

            <p>
              Select the logo in the website header preview to upload or link a
              replacement image.
            </p>

            {canEditWebsiteDetails && (
              <div className="enterprise-logo-action">
                <button
                  type="button"
                  className="enterprise-logo-change-btn"
                  onClick={openLogoCanvasEditor}
                  aria-label="Select logo and open logo editor"
                  title="Select logo and open logo editor"
                >
                  Change Logo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="field">
          <label>Website Name</label>
          <input
            value={detailsDraft.site_name || ""}
            onChange={(e) => updateDetailsDraft("site_name", e.target.value)}
            placeholder="Enter website name"
            disabled={!isEditingDetails || isSavingDetails}
          />
        </div>

        <div className="field">
          <label>Tagline / Slogan</label>
          <input
            value={detailsDraft.tagline || ""}
            onChange={(e) => updateDetailsDraft("tagline", e.target.value)}
            placeholder="Enter tagline or slogan"
            disabled={!isEditingDetails || isSavingDetails}
          />
        </div>

        <div className="field">
          <label>Motto</label>
          <input
            value={detailsDraft.motto || ""}
            onChange={(e) => updateDetailsDraft("motto", e.target.value)}
            placeholder="Eg: Discipline • Respect • Success"
            disabled={!isEditingDetails || isSavingDetails}
          />
        </div>

        <div className="field">
          <label>Official Email</label>
          <input
            type="email"
            value={detailsDraft.email || ""}
            onChange={(e) => updateDetailsDraft("email", e.target.value)}
            placeholder="info@example.com"
            disabled={!isEditingDetails || isSavingDetails}
          />
        </div>

        <div className="field">
          <label>Official Phone</label>
          <input
            value={detailsDraft.phone || ""}
            onChange={(e) => updateDetailsDraft("phone", e.target.value)}
            placeholder="+27 ..."
            disabled={!isEditingDetails || isSavingDetails}
          />
        </div>
      </div>

      {canShowOrganisationAddress && (
        <div className="enterprise-address-card">
          <div className="enterprise-address-header">
            <div className="enterprise-address-title">
              <strong>Organisation Address</strong>
              <span>
                Update the official location details shown on your website and
                map.
              </span>
            </div>

            {canEditOrganisationAddress && (
              <div className="enterprise-address-actions">
                {!isEditingAddress ? (
                  <button
                    type="button"
                    className="enterprise-btn primary"
                    onClick={startEditingAddress}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="enterprise-btn secondary"
                      onClick={saveOrganisationAddress}
                      disabled={isSavingAddress}
                    >
                      {isSavingAddress ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      className="enterprise-btn danger"
                      onClick={cancelEditingAddress}
                      disabled={isSavingAddress}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="field">
            <label>Address Line</label>
            <textarea
              value={addressDraft.address_line1 || ""}
              onChange={(e) =>
                updateAddressDraft("address_line1", e.target.value)
              }
              placeholder="Eg: 123 Main Road, Johannesburg"
              rows={3}
              disabled={!isEditingAddress || isSavingAddress}
            />
          </div>

          <div className="enterprise-address-grid">
            <div className="field">
              <label>City / Town</label>
              <input
                value={addressDraft.city || ""}
                onChange={(e) => updateAddressDraft("city", e.target.value)}
                placeholder="Eg: Johannesburg"
                disabled={!isEditingAddress || isSavingAddress}
              />
            </div>

            <div className="field">
              <label>Province</label>
              <input
                value={addressDraft.province || ""}
                onChange={(e) =>
                  updateAddressDraft("province", e.target.value)
                }
                placeholder="Eg: Gauteng"
                disabled={!isEditingAddress || isSavingAddress}
              />
            </div>
          </div>

          <div className="enterprise-address-grid">
            <div className="field">
              <label>Postal Code</label>
              <input
                value={addressDraft.postal_code || ""}
                onChange={(e) =>
                  updateAddressDraft("postal_code", e.target.value)
                }
                placeholder="Eg: 2000"
                disabled={!isEditingAddress || isSavingAddress}
              />
            </div>

            <div className="field">
              <label>Country</label>
              <input
                value={addressDraft.country || ""}
                onChange={(e) => updateAddressDraft("country", e.target.value)}
                placeholder="Eg: South Africa"
                disabled={!isEditingAddress || isSavingAddress}
              />
            </div>
          </div>

          <div className="enterprise-address-preview">
            <span>Full Address Preview</span>

            <strong
              className={!fullAddressPreview ? "enterprise-address-empty" : ""}
            >
              {fullAddressPreview || "No organisation address saved yet."}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}