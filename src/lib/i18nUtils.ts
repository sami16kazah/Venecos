/**
 * Unified Localization Helper for Venecos Platform
 * Safely parses and extracts localized strings from multi-language JSON objects, DB entries, or strings.
 */
export function getLocString(val: any, lang: string): string {
  if (val === null || val === undefined) return '';

  let targetObj: Record<string, string> | null = null;

  if (typeof val === 'object' && !Array.isArray(val)) {
    targetObj = val;
  } else if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        targetObj = JSON.parse(trimmed);
      } catch (e) {
        return val;
      }
    } else {
      return val;
    }
  } else {
    return String(val);
  }

  if (!targetObj) return String(val);

  // 1. Try requested language
  if (targetObj[lang] && typeof targetObj[lang] === 'string' && targetObj[lang].trim() !== '') {
    return targetObj[lang];
  }

  // 2. Try English fallback
  if (targetObj['en'] && typeof targetObj['en'] === 'string' && targetObj['en'].trim() !== '') {
    return targetObj['en'];
  }

  // 3. Try Arabic fallback
  if (targetObj['ar'] && typeof targetObj['ar'] === 'string' && targetObj['ar'].trim() !== '') {
    return targetObj['ar'];
  }

  // 4. Try French / German fallback
  if (targetObj['fr'] && typeof targetObj['fr'] === 'string' && targetObj['fr'].trim() !== '') {
    return targetObj['fr'];
  }
  if (targetObj['de'] && typeof targetObj['de'] === 'string' && targetObj['de'].trim() !== '') {
    return targetObj['de'];
  }

  // 5. First non-empty value
  const firstVal = Object.values(targetObj).find((v) => typeof v === 'string' && v.trim() !== '');
  return firstVal || '';
}

/**
 * Safely resolves array of localized strings (e.g., bullet points for terms/features)
 */
export function getLocArray(val: any, lang: string): string[] {
  if (!val) return [];

  if (Array.isArray(val)) {
    return val.map((item) => getLocString(item, lang)).filter(Boolean);
  }

  if (typeof val === 'object') {
    const arr = val[lang] || val['en'] || val['ar'] || val['fr'] || val['de'];
    if (Array.isArray(arr)) {
      return arr.map(String).filter(Boolean);
    }
  }

  return [];
}
