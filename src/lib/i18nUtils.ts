/**
 * Unified Localization Helper for Venecos Platform
 * Safely parses and extracts localized strings from multi-language JSON objects, DB entries, or strings.
 */
const COMMON_DICTIONARY: Record<string, Record<string, string>> = {
  'طباعة 3D احترافية': { en: 'Professional 3D Printing', fr: 'Impression 3D Professionnelle', de: 'Professioneller 3D-Druck', ar: 'طباعة 3D احترافية' },
  'خدمة طباعة 3D احترافية': { en: 'Professional 3D Printing Service', fr: 'Service d\'Impression 3D', de: 'Professioneller 3D-Druckdienst', ar: 'خدمة طباعة 3D احترافية' },
  'باقة النماذج الأولية': { en: 'Prototyping Package', fr: 'Forfait Prototypage', de: 'Prototyping-Paket', ar: 'باقة النماذج الأولية' },
  'باقة الإنتاج التجاري': { en: 'Commercial Production Package', fr: 'Forfait Production Commerciale', de: 'Kommerzielle Produktion', ar: 'باقة الإنتاج التجاري' },
  'باقة التصميم الصناعي المعقد': { en: 'Complex Industrial Design Package', fr: 'Design Industriel Complexe', de: 'Industriedesign Paket', ar: 'باقة التصميم الصناعي المعقد' },
  'جاهز للتسليم في خلال 3-5 أيام عمل': { en: 'Deliverable in 3-5 business days', fr: 'Livrable en 3-5 jours ouvrables', de: 'Lieferbar in 3-5 Werktagen', ar: 'جاهز للتسليم في خلال 3-5 أيام عمل' },
  'جاهز للتسليم خلال 3-5 أيام عمل': { en: 'Deliverable in 3-5 business days', fr: 'Livrable en 3-5 jours ouvrables', de: 'Lieferbar in 3-5 Werktagen', ar: 'جاهز للتسليم خلال 3-5 أيام عمل' },
  '24 — 48 ساعة': { en: '24 — 48 Hours', fr: '24 — 48 Heures', de: '24 — 48 Stunden', ar: '24 — 48 ساعة' },
  '12 — 24 ساعة': { en: '12 — 24 Hours', fr: '12 — 24 Heures', de: '12 — 24 Stunden', ar: '12 — 24 ساعة' },
  'حماية وضمان ممتد للخدمة': { en: 'Extended Service Warranty & Protection', fr: 'Garantie et protection étendue', de: '24 Monate Produktschutz', ar: 'حماية وضمان ممتد للخدمة' },
  '24 شهر حماية وضمان ممتد للخدمة': { en: '24 Months Extended Warranty & Service Protection', fr: '24 Mois Garantie et protection étendue', de: '24 Monate Produktschutz & Garantie', ar: '24 شهر حماية وضمان ممتد للخدمة' },
  'يشمل السعر ما يصل إلى 3 جولات مراجعة.\nيُحسب وقت التسليم من استلام جميع المواد.': {
    en: 'Includes up to 3 revision rounds.\nDelivery time starts upon receiving all materials.',
    fr: 'Comprend jusqu\'à 3 tours de révision.\nLe délai commence à la réception des éléments.',
    de: 'Enthält bis zu 3 Überarbeitungsrunden.\nLieferzeit beginnt nach Erhalt aller Unterlagen.',
    ar: 'يشمل السعر ما يصل إلى 3 جولات مراجعة.\nيُحسب وقت التسليم من استلام جميع المواد.'
  },
  'يُدفع 50% مقدماً عند تأكيد الطلب.\nلا يُسترد المبلغ المقدم بعد بدء العمل.': {
    en: '50% deposit required upon order confirmation.\nDeposit is non-refundable once work begins.',
    fr: 'Acompte de 50% requis à la confirmation.\nAcompte non remboursable après le début des travaux.',
    de: '50% Anzahlung bei Auftragsbestätigung erforderlich.\nAnzahlung nach Arbeitsbeginn nicht erstattungsfähig.',
    ar: 'يُدفع 50% مقدماً عند تأكيد الطلب.\nلا يُسترد المبلغ المقدم بعد بدء العمل.'
  },
  'جودة عالية, حماية مضاعفة, جاهزية للتسليم': {
    en: 'High Quality, Extra Protection, Ready for Delivery',
    fr: 'Haute Qualité, Protection Réglable, Prêt à Livrer',
    de: 'Hohe Qualität, Extra Schutz, Lieferbereit',
    ar: 'جودة عالية, حماية مضاعفة, جاهزية للتسليم'
  }
};

function hasArabic(str: string): boolean {
  return /[\u0600-\u06FF]/.test(str);
}

export function getLocString(val: any, lang: string): string {
  if (val === null || val === undefined) return '';

  const cleanLang = (lang || 'ar').toLowerCase();

  let targetObj: Record<string, string> | null = null;
  let rawStr = '';

  if (typeof val === 'object' && !Array.isArray(val)) {
    targetObj = val;
  } else if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        targetObj = JSON.parse(trimmed);
      } catch (e) {
        rawStr = val;
      }
    } else {
      rawStr = val;
    }
  } else {
    rawStr = String(val);
  }

  // Check common dictionary if rawStr exists
  if (rawStr && COMMON_DICTIONARY[rawStr]) {
    return COMMON_DICTIONARY[rawStr][cleanLang] || COMMON_DICTIONARY[rawStr]['en'] || rawStr;
  }

  if (rawStr) {
    // If raw string is Arabic but requested lang is non-Arabic, don't display raw Arabic string
    if (cleanLang !== 'ar' && hasArabic(rawStr)) {
      return '';
    }
    return rawStr;
  }

  if (!targetObj) return '';

  // 1. Direct requested language match
  const requestedVal = targetObj[cleanLang];
  if (typeof requestedVal === 'string' && requestedVal.trim() !== '') {
    if (cleanLang !== 'ar' && hasArabic(requestedVal)) {
      // Contaminated key from old bad save; check dictionary or fallback
      if (COMMON_DICTIONARY[requestedVal]) {
        return COMMON_DICTIONARY[requestedVal][cleanLang] || COMMON_DICTIONARY[requestedVal]['en'] || '';
      }
      // If targetObj['en'] is clean, use it
      if (cleanLang !== 'en' && targetObj['en'] && !hasArabic(targetObj['en'])) {
        return targetObj['en'];
      }
      return '';
    }
    return requestedVal;
  }

  // 2. English fallback (if clean)
  if (targetObj['en'] && typeof targetObj['en'] === 'string' && targetObj['en'].trim() !== '') {
    if (cleanLang === 'ar' || !hasArabic(targetObj['en'])) {
      return targetObj['en'];
    }
  }

  // 3. Arabic fallback (only if cleanLang === 'ar' or no other clean string)
  if (cleanLang === 'ar' && targetObj['ar'] && typeof targetObj['ar'] === 'string') {
    return targetObj['ar'];
  }

  // 4. Other language fallbacks
  for (const l of ['fr', 'de', 'ar']) {
    if (targetObj[l] && typeof targetObj[l] === 'string' && targetObj[l].trim() !== '') {
      if (cleanLang !== 'ar' && hasArabic(targetObj[l])) continue;
      return targetObj[l];
    }
  }

  return '';
}

/**
 * Safely resolves array of localized strings (e.g., bullet points for terms/features)
 */
export function getLocArray(val: any, lang: string): string[] {
  if (!val) return [];

  const cleanLang = (lang || 'ar').toLowerCase();

  if (Array.isArray(val)) {
    return val.map((item) => getLocString(item, cleanLang)).filter(Boolean);
  }

  if (typeof val === 'object') {
    const arr = val[cleanLang];
    if (Array.isArray(arr)) {
      return arr.map((item) => getLocString(item, cleanLang)).filter(Boolean);
    }
    // Fallback to English array if clean
    if (cleanLang !== 'en' && Array.isArray(val['en'])) {
      const enRes = val['en'].map((item) => getLocString(item, cleanLang)).filter(Boolean);
      if (enRes.length > 0) return enRes;
    }
    // Fallback to Arabic array only if cleanLang is 'ar'
    if (cleanLang === 'ar' && Array.isArray(val['ar'])) {
      return val['ar'].map(String).filter(Boolean);
    }
  }

  return [];
}

/**
 * Combines subServices from all 4 locale documents (ar, en, fr, de) into unified multi-language subService objects.
 */
export function combineMultiLangSubServices(items: any[]): any[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  
  const docByLoc: Record<string, any> = {};
  items.forEach(doc => {
    if (doc && doc.locale) docByLoc[doc.locale] = doc;
  });

  const primaryDoc = docByLoc['ar'] || docByLoc['en'] || items[0];
  const primarySubServices = primaryDoc?.subServices || [];

  return primarySubServices.map((baseSub: any, idx: number) => {
    const titles: Record<string, string> = {};
    const descriptions: Record<string, string> = {};
    const badges: Record<string, string> = {};
    const durations: Record<string, string> = {};
    const estimates: Record<string, string> = {};
    const deliveryRules: Record<string, string[]> = {};
    const rightsRules: Record<string, string[]> = {};
    const highlightRules: Record<string, string[]> = {};
    const warrantyTitles: Record<string, string> = {};

    ['ar', 'en', 'fr', 'de'].forEach(loc => {
      const locDoc = docByLoc[loc];
      const locSub = locDoc?.subServices?.[idx] || (baseSub.title?.[loc] ? baseSub : null);
      
      titles[loc] = typeof locSub?.title === 'object' ? (locSub.title[loc] || locSub.title.ar || '') : (locSub?.title || (typeof baseSub.title === 'object' ? baseSub.title[loc] : ''));
      descriptions[loc] = typeof locSub?.description === 'object' ? (locSub.description[loc] || '') : (locSub?.description || '');
      badges[loc] = typeof locSub?.badge === 'object' ? (locSub.badge[loc] || '') : (locSub?.badge || '');
      durations[loc] = typeof locSub?.deliveryDuration === 'object' ? (locSub.deliveryDuration[loc] || '') : (locSub?.deliveryDuration || '');
      estimates[loc] = typeof locSub?.deliveryEstimate === 'object' ? (locSub.deliveryEstimate[loc] || '') : (locSub?.deliveryEstimate || '');

      deliveryRules[loc] = Array.isArray(locSub?.deliveryAndRevisions) 
        ? locSub.deliveryAndRevisions 
        : (locSub?.deliveryAndRevisions?.[loc] || []);
      
      rightsRules[loc] = Array.isArray(locSub?.ownershipAndRights) 
        ? locSub.ownershipAndRights 
        : (locSub?.ownershipAndRights?.[loc] || []);

      highlightRules[loc] = Array.isArray(locSub?.highlights) 
        ? locSub.highlights 
        : (locSub?.highlights?.[loc] || []);

      const addon = locSub?.addons?.[0] || baseSub?.addons?.[0];
      warrantyTitles[loc] = typeof addon?.title === 'object' ? (addon.title[loc] || '') : (addon?.title || '');
    });

    return {
      ...baseSub,
      title: titles,
      description: descriptions,
      badge: badges,
      deliveryDuration: durations,
      deliveryEstimate: estimates,
      deliveryAndRevisions: deliveryRules,
      ownershipAndRights: rightsRules,
      highlights: highlightRules,
      addons: [{
        title: warrantyTitles,
        price: baseSub?.addons?.[0]?.price || 41.99
      }]
    };
  });
}

