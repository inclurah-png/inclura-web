import { SUPPORTED_LANGUAGES } from "./supportedLanguages";

/**
 * Normalize language codes so every translation component
 * uses the same representation.
 */
function normalizeLanguageCode(code = "") {
  const normalized = String(code).trim().toLowerCase();

  if (
    normalized === "zh-tw" ||
    normalized === "zh_hant"
  ) {
    return "zh-TW";
  }

  return normalized;
}

/**
 * Find a supported language by code.
 */
function getSupportedLanguage(code) {
  const normalizedCode =
    normalizeLanguageCode(code);

  return (
    SUPPORTED_LANGUAGES.find(
      (language) =>
        normalizeLanguageCode(language.code) ===
        normalizedCode
    ) || null
  );
}

/**
 * Detect languages that have strong Unicode/script signals.
 *
 * These are much safer than guessing based on ordinary
 * words because the characters themselves provide useful
 * evidence.
 */
function detectScriptLanguage(text) {
  if (/[\u0600-\u06FF]/.test(text)) {
    return {
      code: "ar",
      language: "Arabic",
      confidence: 0.99,
    };
  }

  if (/[\u4E00-\u9FFF]/.test(text)) {
    return {
      code: "zh",
      language: "Chinese",
      confidence: 0.99,
    };
  }

  if (/[\u3040-\u30FF]/.test(text)) {
    return {
      code: "ja",
      language: "Japanese",
      confidence: 0.99,
    };
  }

  if (/[\uAC00-\uD7AF]/.test(text)) {
    return {
      code: "ko",
      language: "Korean",
      confidence: 0.99,
    };
  }

  return null;
}

/**
 * Detect languages that have distinctive orthographic
 * characters.
 *
 * These checks deliberately use distinctive characters
 * rather than common words such as "ina", "allah",
 * "dey", etc., which can occur in other languages.
 */
function detectDistinctiveCharacters(text) {
  const lower = text.toLowerCase();

  if (
    /[ẹọṣ]/.test(lower) ||
    /[àáèéìíòóùú]/.test(lower)
  ) {
    /**
     * Yoruba contains several orthographic combinations
     * and diacritics. This is intentionally moderate
     * confidence because accented Latin characters can
     * overlap with other languages.
     */
    if (
      /ẹ|ọ|ṣ/.test(lower)
    ) {
      return {
        code: "yo",
        language: "Yoruba",
        confidence: 0.92,
      };
    }
  }

  if (
    /[ịọụṅ]/.test(lower)
  ) {
    return {
      code: "ig",
      language: "Igbo",
      confidence: 0.92,
    };
  }

  return null;
}

/**
 * Lightweight word-pattern detection.
 *
 * Only distinctive multi-word patterns are used here.
 * Common single words are intentionally avoided because
 * they produce too many false positives.
 */
function detectLatinLanguage(text) {
  const lower = text
    .toLowerCase()
    .replace(/[^\p{L}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!lower) {
    return null;
  }

  const patterns = [
    {
      code: "yo",
      language: "Yoruba",
      patterns: [
        /\bmo fẹ́\b/,
        /\bmo fe\b/,
        /\bmo ní\b/,
        /\bmo ni\b/,
        /\bẹ jọ̀wọ́\b/,
        /\be jowo\b/,
        /\bó ṣe\b/,
        /\bo se\b/,
      ],
      confidence: 0.88,
    },

    {
      code: "ig",
      language: "Igbo",
      patterns: [
        /\banyị\b/,
        /\banyị bụ\b/,
        /\banyị bu\b/,
        /\bị bụ\b/,
        /\i bu\b/,
        /\bkedụ\b/,
        /\bkedu\b/,
        /\bnọọ\b/,
        /\bnoo\b/,
      ],
      confidence: 0.88,
    },

    {
      code: "ha",
      language: "Hausa",
      patterns: [
        /\bina kwana\b/,
        /\bina yini\b/,
        /\bna gode\b/,
        /\bdon Allah\b/i,
        /\byaya kake\b/,
        /\byaya kike\b/,
      ],
      confidence: 0.86,
    },

    {
      code: "sw",
      language: "Swahili",
      patterns: [
        /\bhabari yako\b/,
        /\bhabari za\b/,
        /\bnaomba msaada\b/,
        /\basante sana\b/,
        /\btafadhali\b/,
        /\bkaribu sana\b/,
      ],
      confidence: 0.86,
    },

    {
      code: "pt",
      language: "Portuguese",
      patterns: [
        /\bom dia\b/,
        /\bboa tarde\b/,
        /\bboa noite\b/,
        /\bmuito obrigado\b/,
        /\bmuito obrigada\b/,
        /\bpor favor\b/,
      ],
      confidence: 0.84,
    },

    {
      code: "es",
      language: "Spanish",
      patterns: [
        /\bbuenos días\b/,
        /\bbuenas tardes\b/,
        /\bbuenas noches\b/,
        /\bmuchas gracias\b/,
        /\bpor favor\b/,
        /\bcómo estás\b/,
      ],
      confidence: 0.82,
    },

    {
      code: "fr",
      language: "French",
      patterns: [
        /\bbonjour\b/,
        /\bbonsoir\b/,
        /\bmerci beaucoup\b/,
        /\bs'il vous plaît\b/,
        /\bcomment allez[- ]vous\b/,
      ],
      confidence: 0.84,
    },

    {
      code: "de",
      language: "German",
      patterns: [
        /\bguten morgen\b/,
        /\bguten tag\b/,
        /\bguten abend\b/,
        /\bdanke schön\b/,
        /\bwie geht es dir\b/,
      ],
      confidence: 0.84,
    },

    {
      code: "it",
      language: "Italian",
      patterns: [
        /\bbuongiorno\b/,
        /\bbuonasera\b/,
        /\bgrazie mille\b/,
        /\bper favore\b/,
        /\bcome stai\b/,
      ],
      confidence: 0.84,
    },

    {
      code: "nl",
      language: "Dutch",
      patterns: [
        /\bgoedemorgen\b/,
        /\bgoedemiddag\b/,
        /\bgoedenavond\b/,
        /\bbedankt\b/,
        /\balsjeblieft\b/,
      ],
      confidence: 0.82,
    },

    {
      code: "tr",
      language: "Turkish",
      patterns: [
        /\bmerhaba\b/,
        /\bteşekkür ederim\b/,
        /\blütfen\b/,
        /\bnasılsın\b/,
      ],
      confidence: 0.84,
    },

    {
      code: "id",
      language: "Indonesian",
      patterns: [
        /\bselamat pagi\b/,
        /\bselamat siang\b/,
        /\bterima kasih\b/,
        /\bterima kasih banyak\b/,
        /\btolong\b/,
      ],
      confidence: 0.82,
    },

    {
      code: "ms",
      language: "Malay",
      patterns: [
        /\bselamat pagi\b/,
        /\bterima kasih\b/,
        /\bsila\b/,
        /\bapa khabar\b/,
      ],
      confidence: 0.80,
    },

    {
      code: "vi",
      language: "Vietnamese",
      patterns: [
        /\bxin chào\b/,
        /\bcảm ơn\b/,
        /\bcảm ơn bạn\b/,
        /\bxin vui lòng\b/,
      ],
      confidence: 0.86,
    },

    {
      code: "th",
      language: "Thai",
      patterns: [
        /\bสวัสดี\b/,
        /\bขอบคุณ\b/,
        /\bกรุณา\b/,
      ],
      confidence: 0.96,
    },
  ];

  for (const entry of patterns) {
    const matched = entry.patterns.some(
      (pattern) => pattern.test(lower)
    );

    if (matched) {
      return {
        code: entry.code,
        language: entry.language,
        confidence: entry.confidence,
      };
    }
  }

  return null;
}

/**
 * Detect language from text.
 *
 * This is intentionally a lightweight frontend detector.
 * A future SeamlessM4T/AI detector can replace this
 * implementation without changing the public API.
 */
export async function detectLanguage(text = "") {
  const sourceText =
    typeof text === "string"
      ? text.trim()
      : "";

  if (!sourceText) {
    return {
      code: "en",
      language: "English",
      confidence: 0,
    };
  }

  /**
   * Script detection has the strongest local signal.
   */
  const scriptResult =
    detectScriptLanguage(sourceText);

  if (scriptResult) {
    return scriptResult;
  }

  /**
   * Distinctive characters are the next strongest signal.
   */
  const characterResult =
    detectDistinctiveCharacters(sourceText);

  if (characterResult) {
    return characterResult;
  }

  /**
   * Finally check distinctive multi-word patterns.
   */
  const latinResult =
    detectLatinLanguage(sourceText);

  if (latinResult) {
    return latinResult;
  }

  /**
   * Unknown Latin text is not confidently identified.
   *
   * English is retained as the compatibility fallback,
   * but confidence is intentionally low so callers do
   * not treat the result as authoritative.
   */
  return {
    code: "en",
    language: "English",
    confidence: 0.1,
  };
}

/**
 * Check whether a language code is supported.
 *
 * Comparison is normalized so zh-tw and zh-TW are
 * treated consistently.
 */
export function isSupportedLanguage(code) {
  const normalizedCode =
    normalizeLanguageCode(code);

  if (!normalizedCode) {
    return false;
  }

  return Boolean(
    getSupportedLanguage(normalizedCode)
  );
}

/**
 * Return language metadata for a language code.
 */
export function getLanguageInfo(code) {
  return getSupportedLanguage(code);
}
