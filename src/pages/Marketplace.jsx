import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/DashboardLayout";
import { useAccessibility } from "../context/AccessibilityProvider";
import { translateContent } from "../translation/translationEngine";
import { db } from "../firebase";
import { SUPPORTED_LANGUAGES } from "../translation/supportedLanguages";

const categories = [
  { id: "all", icon: "🛍️", label: "All listings" },
  { id: "products", icon: "📦", label: "Products" },
  { id: "accessibility", icon: "♿", label: "Accessibility equipment" },
  { id: "creators", icon: "🎨", label: "Creator stores" },
  { id: "services", icon: "🤝", label: "Services" },
];

// These are browse categories, not claims that products are currently in stock.
const accessibilityEquipmentTypes = [
  { id: "mobility", icon: "♿", title: "Mobility aids", description: "Manual and powered wheelchairs, walking frames, crutches, canes, rollators and mobility scooters.", keywords: ["wheelchair", "powered chair", "mobility scooter", "walking frame", "walker", "rollator", "crutch", "cane", "mobility aid"] },
  { id: "hearing", icon: "🦻", title: "Hearing support", description: "Hearing aids, cochlear accessories, assistive listening devices, amplified phones and alert systems.", keywords: ["hearing aid", "cochlear", "hearing loop", "listening device", "amplified phone", "alert system", "hearing support"] },
  { id: "vision", icon: "👁️", title: "Vision and Braille", description: "Braille displays, refreshable Braille devices, magnifiers, talking watches, screen-reading tools and accessible reading aids.", keywords: ["braille", "screen reader", "magnifier", "talking watch", "video magnifier", "blind", "low vision", "vision aid"] },
  { id: "communication", icon: "💬", title: "Communication aids", description: "AAC devices, speech-generating tools, communication boards, switches and text-to-speech devices.", keywords: ["aac", "communication board", "speech generating", "speech device", "switch access", "text to speech", "communication aid"] },
  { id: "technology", icon: "⌨️", title: "Accessible technology", description: "Adaptive keyboards, trackballs, alternative mice, switch interfaces, accessible phones and computer controls.", keywords: ["adaptive keyboard", "large key", "trackball", "alternative mouse", "switch interface", "accessible phone", "assistive technology", "computer access"] },
  { id: "daily-living", icon: "🏠", title: "Daily-living aids", description: "Dressing aids, reachers, adapted utensils, shower chairs, transfer benches and other independent-living equipment.", keywords: ["dressing aid", "reacher", "adapted utensil", "shower chair", "transfer bench", "daily living", "independent living", "bathroom aid"] },
  { id: "learning", icon: "📚", title: "Learning and sensory support", description: "Sensory tools, accessible learning materials, adapted writing aids and classroom support equipment.", keywords: ["sensory", "adapted writing", "learning aid", "accessible learning", "classroom support", "tactile"] },
];

function listingText(value) {
  if (Array.isArray(value)) return value.map((entry) => String(entry)).filter(Boolean).join(", ");
  if (typeof value === "string") return value.trim();
  return "";
}

function Marketplace() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { highContrast = false, reducedMotion = false } = useAccessibility();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("");
  const [translations, setTranslations] = useState({});
  const [translating, setTranslating] = useState({});
  const [translationErrors, setTranslationErrors] = useState({});

  const activeLanguage = String(i18n.language || "en").trim();
  const [targetLanguage, setTargetLanguage] = useState(activeLanguage);

  useEffect(() => {
    setTargetLanguage(activeLanguage);
  }, [activeLanguage]);

  async function loadListings() {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "marketplaceListings"));
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Marketplace listings load failed:", e);
      setError("Marketplace listings could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadListings(); }, []);

  function categoryFor(item) {
    const category = String(item.category || item.type || item.subcategory || item.equipmentType || "").toLowerCase();
    const searchable = [
      category, item.title, item.name, item.description, item.brand,
      item.accessibilityFeatures, item.accessibilityInfo, item.accessibilityNotes,
      item.accessibilityNeeds, item.tags, item.keywords, item.accessibilityCategory,
    ].map(listingText).join(" ").toLowerCase();
    if (/accessib|wheelchair|assistive|mobility|hearing|braille|blind|low vision|hearing aid|communication aid|adaptive keyboard|daily living|sensory support/.test(searchable)) return "accessibility";
    if (/creator|artwork|digital content|store/.test(searchable)) return "creators";
    if (/service|consult|care|lesson|repair/.test(searchable)) return "services";
    return "products";
  }

  const visibleListings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return listings.filter((item) => {
      const matchesCategory = activeCategory === "all" || categoryFor(item) === activeCategory;
      const haystack = [
        item.title, item.name, item.description, item.category, item.type,
        item.subcategory, item.equipmentType, item.brand, item.tags, item.keywords,
        item.accessibilityCategory, item.accessibilityFeatures, item.accessibilityInfo,
        item.accessibilityNotes, item.accessibilityNeeds,
      ].map(listingText).join(" ").toLowerCase();
      const equipmentType = accessibilityEquipmentTypes.find((entry) => entry.id === selectedEquipmentType);
      const matchesEquipmentType = !equipmentType || equipmentType.keywords.some((keyword) => haystack.includes(keyword));
      return matchesCategory && matchesEquipmentType && (!term || haystack.includes(term));
    });
  }, [listings, search, activeCategory, selectedEquipmentType]);

  async function translateListing(item) {
    const title = String(item.title || item.name || "Untitled listing");
    const description = String(item.description || "No description provided.");
    const accessibilityDetails = listingText(item.accessibilityFeatures || item.accessibilityInfo || item.accessibilityNotes || item.accessibilityNeeds);
    setTranslating((current) => ({ ...current, [item.id]: true }));
    setTranslationErrors((current) => ({ ...current, [item.id]: "" }));
    try {
      const [translatedTitle, translatedDescription, translatedAccessibility] = await Promise.all([
        translateContent({
          sourceId: `marketplace-listing-${item.id}-title`,
          sourceType: "marketplace-listing",
          text: title,
          targetLanguage,
        }),
        translateContent({
          sourceId: `marketplace-listing-${item.id}-description`,
          sourceType: "marketplace-listing",
          text: description,
          targetLanguage,
        }),
        accessibilityDetails
          ? translateContent({
              sourceId: `marketplace-listing-${item.id}-accessibility`,
              sourceType: "marketplace-listing",
              text: accessibilityDetails,
              targetLanguage,
            })
          : Promise.resolve(null),
      ]);
      if (!translatedTitle?.translatedText || !translatedDescription?.translatedText) {
        throw new Error("The translation service returned an incomplete listing translation.");
      }
      setTranslations((current) => ({
        ...current,
        [item.id]: {
          language: targetLanguage,
          title: translatedTitle.translatedText,
          description: translatedDescription.translatedText,
          accessibilityDetails: translatedAccessibility?.translatedText || accessibilityDetails,
        },
      }));
    } catch (translationError) {
      console.error("Marketplace listing translation failed:", translationError);
      setTranslationErrors((current) => ({
        ...current,
        [item.id]: "Translation is unavailable right now. The original listing is still shown.",
      }));
    } finally {
      setTranslating((current) => ({ ...current, [item.id]: false }));
    }
  }

  function contactSeller(item) {
    const sellerCandidate = item.sellerId || item.sellerUid || item.ownerId || item.createdBy || item.userId;
    const sellerId = typeof sellerCandidate === "string" ? sellerCandidate : "";
    if (!sellerId) return;
    navigate("/messages", {
      state: {
        recipientId: sellerId,
        listingId: item.id,
        listingTitle: item.title || item.name || "Marketplace listing",
      },
    });
  }

  return (
    <DashboardLayout>
      <main className={`inclura-marketplace${highContrast ? " high-contrast" : ""}${reducedMotion ? " reduced-motion" : ""}`} style={{ ...page, ...(highContrast ? highContrastPage : {}) }}>
        <h1 id="marketplace-heading">🛒 Marketplace</h1>
        <p style={muted}>Browse Inclura listings. Search and filter listings, translate descriptions, review accessibility information and contact sellers.</p>

        <div style={toolbar}>
          <label htmlFor="marketplace-search" style={srOnly}>Search marketplace listings</label>
          <input id="marketplace-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products, equipment, stores or services..." style={searchInput} autoComplete="off" />
          <button type="button" onClick={loadListings} disabled={loading} style={button} aria-label="Refresh marketplace listings">
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        <nav style={categoryGrid} aria-label="Marketplace categories">
          {categories.map((category) => (
            <button key={category.id} type="button" onClick={() => { setActiveCategory(category.id); setSelectedEquipmentType(""); }} aria-pressed={activeCategory === category.id} style={{ ...categoryCard, ...(activeCategory === category.id ? selectedCategory : {}) }}>
              <span aria-hidden="true" style={{ fontSize: 24 }}>{category.icon}</span>
              <strong>{category.label}</strong>
            </button>
          ))}
        </nav>

        {activeCategory === "accessibility" && (
          <section style={equipmentDirectory} aria-labelledby="accessibility-equipment-heading">
            <h2 id="accessibility-equipment-heading" style={equipmentHeading}>Browse accessibility equipment</h2>
            <p style={muted}>Choose an equipment type to find matching seller listings. These categories are a guide; products only appear below when a seller has published a matching listing.</p>
            <div style={equipmentGrid}>
              {accessibilityEquipmentTypes.map((equipment) => (
                <button
                  key={equipment.id}
                  type="button"
                  onClick={() => { setSelectedEquipmentType(equipment.id); setSearch(""); }}
                  aria-pressed={selectedEquipmentType === equipment.id}
                  style={{ ...equipmentCard, ...(selectedEquipmentType === equipment.id ? selectedEquipmentCard : {}) }}
                >
                  <span aria-hidden="true" style={{ fontSize: 25 }}>{equipment.icon}</span>
                  <strong>{equipment.title}</strong>
                  <span style={equipmentDescription}>{equipment.description}</span>
                  <span style={equipmentBrowse}>Browse matching listings →</span>
                </button>
              ))}
            </div>
            {selectedEquipmentType && (
              <button type="button" style={clearEquipmentButton} onClick={() => setSelectedEquipmentType("")}>
                Show all accessibility equipment
              </button>
            )}
          </section>
        )}

        {error && <div role="alert" style={errorStyle}>{error}</div>}
        {loading && <p role="status" aria-live="polite" style={muted}>Loading marketplace listings...</p>}

        {!loading && !error && visibleListings.length === 0 && (
          <div style={empty} role="status">
            <h2>{listings.length ? "No matching listings yet" : "No seller listings yet"}</h2>
            <p style={muted}>
              {selectedEquipmentType
                ? "There are no published seller listings matching this equipment type yet. Try another equipment type or check back as sellers add products."
                : listings.length
                  ? "Try another category or search term."
                  : activeCategory === "accessibility"
                    ? "The equipment guide above is ready to browse, but sellers have not published matching equipment listings yet."
                    : "Published marketplace items will appear here."}
            </p>
            {(search || activeCategory !== "all" || selectedEquipmentType) && <button type="button" style={secondaryButton} onClick={() => { setSearch(""); setActiveCategory("all"); setSelectedEquipmentType(""); }}>Clear filters</button>}
          </div>
        )}

        <div style={translationToolbar}>
          <label htmlFor="marketplace-translate-language" style={translationLabel}>Translate listings to</label>
          <select
            id="marketplace-translate-language"
            value={targetLanguage}
            onChange={(event) => {
              setTargetLanguage(event.target.value);
              setTranslations({});
              setTranslationErrors({});
            }}
            style={languageSelect}
            aria-label="Choose the language for marketplace listing translations"
          >
            {SUPPORTED_LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.nativeName} ({language.name})
              </option>
            ))}
          </select>
          <p style={translationHelp}>Choose a language, then tap “Translate listing” on any listing.</p>
        </div>

        <section style={grid} aria-label="Marketplace listings" aria-live="polite">
          {visibleListings.map((item) => {
            const originalTitle = String(item.title || item.name || "Untitled listing");
            const originalDescription = String(item.description || "No description provided.");
            const savedTranslation = translations[item.id];
            const translated = savedTranslation?.language === targetLanguage ? savedTranslation : null;
            const title = translated?.title || originalTitle;
            const description = translated?.description || originalDescription;
            const originalAccessibilityDetails = listingText(item.accessibilityFeatures || item.accessibilityInfo || item.accessibilityNotes || item.accessibilityNeeds);
            const accessibilityDetails = translated?.accessibilityDetails || originalAccessibilityDetails;
            const sellerCandidate = item.sellerId || item.sellerUid || item.ownerId || item.createdBy || item.userId;
            const sellerId = typeof sellerCandidate === "string" ? sellerCandidate : "";
            const listingId = `marketplace-listing-${String(item.id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;

            return (
              <article key={item.id} style={card} aria-labelledby={`${listingId}-title`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.imageAlt || `${originalTitle}. ${originalDescription}`} loading="lazy" style={image} />
                ) : (
                  <div role="img" aria-label="No listing image provided" style={imagePlaceholder}>No image provided</div>
                )}

                <h2 id={`${listingId}-title`} style={{ fontSize: "1.15em", margin: "8px 0" }}>{title}</h2>
                <p id={`${listingId}-description`} style={muted}>{description}</p>
                {translated && <p role="status" style={translatedNotice}>Translated into {targetLanguage}. Product details and prices should be confirmed with the seller.</p>}

                <div style={{ fontWeight: 800 }} aria-label={item.price != null ? `Price ${item.currency || "Naira"} ${Number(item.price).toLocaleString()}` : "Price not specified"}>
                  {item.price != null ? (item.currency || "₦") + Number(item.price).toLocaleString() : "Price not specified"}
                </div>
                <div style={status} aria-label={`Listing status: ${item.status || "published"}`}>{item.status || "published"}</div>

                <section style={accessibilityPanel} aria-label={`Accessibility information for ${originalTitle}`}>
                  <h3 style={accessibilityHeading}>♿ Accessibility information</h3>
                  {accessibilityDetails ? (
                    <p style={muted}>{accessibilityDetails}</p>
                  ) : (
                    <p style={muted}>The seller has not provided accessibility details for this listing yet. Contact the seller to ask about access needs, compatibility and support.</p>
                  )}
                </section>

                <div style={actions}>
                  <button type="button" onClick={() => translated ? setTranslations((current) => ({ ...current, [item.id]: null })) : translateListing(item)} disabled={Boolean(translating[item.id])} aria-describedby={`${listingId}-description`} style={secondaryButton}>
                    {translating[item.id] ? "Translating..." : translated ? "Show original" : `Translate listing to ${SUPPORTED_LANGUAGES.find((language) => language.code === targetLanguage)?.nativeName || targetLanguage}`}
                  </button>
                  {sellerId && <button type="button" onClick={() => contactSeller(item)} style={contactButton}>💬 Contact seller</button>}
                </div>

                {translationErrors[item.id] && <p role="status" style={translationError}>{translationErrors[item.id]}</p>}
                {sellerId && <p style={sellerLanguageHint}>Messages support translation into your selected Inclura language.</p>}
              </article>
            );
          })}
        </section>

        <p style={footnote}>Purchases and checkout are not enabled yet. No payment will be requested from these listings. Contact sellers to ask questions before any transaction.</p>
      </main>

      <style>{`
        .inclura-marketplace button:focus-visible,
        .inclura-marketplace input:focus-visible,
        .inclura-marketplace select:focus-visible {
          outline: 3px solid #facc15;
          outline-offset: 3px;
        }
        .inclura-marketplace.reduced-motion * {
          scroll-behavior: auto !important;
          transition: none !important;
          animation: none !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .inclura-marketplace * { scroll-behavior: auto !important; transition: none !important; animation: none !important; }
        }
        .inclura-marketplace.high-contrast p,
        .inclura-marketplace.high-contrast label { color: #ffffff !important; }
        .inclura-marketplace.high-contrast article,
        .inclura-marketplace.high-contrast section { border-color: #ffffff !important; }
      `}</style>
    </DashboardLayout>
  );
}

const page = { color: "white", maxWidth: "1100px", margin: "0 auto", paddingBottom: 32 };
const muted = { color: "#cbd5e1", lineHeight: 1.6 };
const errorStyle = { color: "#fecaca", background: "#450a0a", border: "1px solid #f87171", borderRadius: 10, padding: 12, margin: "12px 0", lineHeight: 1.5 };
const toolbar = { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", margin: "14px 0" };
const translationToolbar = { display: "grid", gap: 8, margin: "16px 0", padding: 14, border: "1px solid #d4af37", borderRadius: 14, background: "#102b25" };
const translationLabel = { color: "white", fontWeight: 800 };
const languageSelect = { width: "100%", minHeight: 48, padding: "10px 12px", borderRadius: 10, border: "1px solid #d4af37", background: "#0f172a", color: "white", fontSize: 16 };
const translationHelp = { color: "#cbd5e1", margin: 0, fontSize: 13, lineHeight: 1.5 };
const searchInput = { flex: "1 1 240px", minWidth: 0, background: "#0f172a", border: "1px solid #64748b", borderRadius: 10, padding: "12px", color: "white", fontSize: 16 };
const button = { border: "1px solid #d4af37", background: "#064e3b", color: "white", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer", minHeight: 44 };
const categoryGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 10, marginBottom: 18 };
const categoryCard = { display: "flex", alignItems: "center", gap: 10, textAlign: "left", background: "#0f172a", border: "1px solid #64748b", color: "white", padding: 14, borderRadius: 14, cursor: "pointer", minHeight: 64, font: "inherit" };
const selectedCategory = { border: "2px solid #facc15", background: "#123b32" };
const equipmentDirectory = { margin: "8px 0 22px", padding: 16, borderRadius: 16, background: "#102b25", border: "1px solid #d4af37" };
const equipmentHeading = { margin: "0 0 8px", fontSize: "1.2em" };
const equipmentGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10, marginTop: 14 };
const equipmentCard = { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, textAlign: "left", minHeight: 175, padding: 14, borderRadius: 12, background: "#0f172a", color: "white", border: "1px solid #64748b", cursor: "pointer", font: "inherit" };
const selectedEquipmentCard = { border: "2px solid #facc15", background: "#123b32" };
const equipmentDescription = { color: "#cbd5e1", fontSize: 13, lineHeight: 1.5 };
const equipmentBrowse = { color: "#fde68a", fontSize: 13, fontWeight: 700, marginTop: "auto" };
const clearEquipmentButton = { ...secondaryButton, marginTop: 12 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 };
const card = { background: "#0f172a", border: "1px solid #475569", padding: 18, borderRadius: 16, minWidth: 0, overflowWrap: "anywhere" };
const image = { width: "100%", height: 170, objectFit: "cover", borderRadius: 12, background: "#1e293b" };
const imagePlaceholder = { ...image, display: "grid", placeItems: "center", color: "#cbd5e1", border: "1px dashed #64748b" };
const status = { display: "inline-block", marginTop: 10, padding: "4px 8px", borderRadius: 8, background: "#064e3b", color: "#ecfdf5", fontSize: 12 };
const empty = { ...card, marginTop: 10 };
const secondaryButton = { background: "#1e293b", color: "white", border: "1px solid #94a3b8", borderRadius: 10, padding: "10px 14px", cursor: "pointer", minHeight: 44, font: "inherit" };
const contactButton = { ...secondaryButton, background: "#064e3b", border: "1px solid #d4af37", fontWeight: 700 };
const actions = { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 };
const accessibilityPanel = { marginTop: 16, padding: 12, borderRadius: 12, background: "#111c2e", border: "1px solid #475569" };
const accessibilityHeading = { margin: "0 0 8px", fontSize: 14 };
const translatedNotice = { color: "#bbf7d0", fontSize: 12, lineHeight: 1.5 };
const translationError = { color: "#fecaca", fontSize: 13 };
const sellerLanguageHint = { color: "#94a3b8", fontSize: 12, marginBottom: 0 };
const footnote = { color: "#cbd5e1", fontSize: 13, marginTop: 20, lineHeight: 1.6 };
const srOnly = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 };
const highContrastPage = { color: "#ffffff" };
export default Marketplace;
