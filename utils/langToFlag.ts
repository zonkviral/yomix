export const langToCountry: Record<string, string> = {
    en: "gb",
    ru: "ru",
    ja: "jp",
    fr: "fr",
    es: "es",
    "es-la": "mx",
    "pt-br": "br",
    pt: "pt",
    de: "de",
    it: "it",
    pl: "pl",
    uk: "ua",
    zh: "cn",
    "zh-hk": "hk",
    ko: "kr",
    vi: "vn",
    id: "id",
    tr: "tr",
    th: "th",
    ar: "sa",
    jv: "id",
    fa: "ir",
    cs: "cz",
    kk: "kz",
    el: "gr",
    ur: "pk",
    hi: "in",
    ka: "ge",
    he: "il",
    ta: "in",
    te: "in",
}

export const getFlagUrl = (lang: string) => {
    const countryCode = langToCountry[lang.toLowerCase()] || lang
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
}
