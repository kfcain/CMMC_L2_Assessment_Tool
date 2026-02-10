// Vendor Logos Registry
// RULE: Where a company/vendor tool is concerned, a logo should ALWAYS be used.
// Usage: VendorLogos.get('aws') or VendorLogos.get('aws', 20) for custom size

const VendorLogos = {
    get: function(key, size) {
        size = size || 16;
        var logo = this.logos[key];
        if (!logo) return this._fallback(size);
        return logo.replace(/width="16"/g, 'width="' + size + '"').replace(/height="16"/g, 'height="' + size + '"');
    },
    has: function(key) { return !!this.logos[key]; },
    _fallback: function(s) {
        return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>';
    },
    // Helper: colored rounded-rect with text abbreviation
    _pill: function(bg, text, abbr) {
        return '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="' + bg + '"/><text x="128" y="' + (abbr.length > 2 ? '152' : '160') + '" text-anchor="middle" fill="' + (text || '#fff') + '" font-size="' + (abbr.length > 2 ? '64' : '100') + '" font-weight="bold" font-family="Arial,sans-serif">' + abbr + '</text></svg>';
    },
    logos: {}
};

// ── Cloud ──
VendorLogos.logos.aws = '<svg width="16" height="16" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M18.9 28.2c0 .8.1 1.5.3 2 .2.5.4 1 .7 1.6.1.2.2.3.2.5 0 .2-.1.4-.4.6l-1.4.9c-.2.1-.3.2-.5.2-.2 0-.4-.1-.6-.3-.3-.3-.5-.7-.7-1-.2-.4-.4-.8-.7-1.3-1.6 1.9-3.7 2.9-6.1 2.9-1.7 0-3.1-.5-4.2-1.5-1-.1-1.5-2.4-1.5-4 0-1.8.6-3.2 1.9-4.3 1.3-1.1 3-1.6 5.1-1.6.7 0 1.4.1 2.2.2.8.1 1.6.3 2.5.5v-1.5c0-1.6-.3-2.7-1-3.3-.7-.7-1.8-1-3.4-1-.7 0-1.5.1-2.2.3-.8.2-1.5.4-2.2.7-.3.1-.6.2-.7.3-.2 0-.3.1-.4.1-.4 0-.5-.3-.5-.8v-1.1c0-.4.1-.7.2-.9.1-.2.3-.4.6-.5.7-.4 1.6-.7 2.6-1 1-.3 2.1-.4 3.2-.4 2.5 0 4.3.6 5.4 1.7 1.1 1.1 1.7 2.8 1.7 5.1v6.7zm-8.4 3.2c.7 0 1.4-.1 2.1-.4.8-.3 1.4-.7 2-1.3.3-.4.6-.8.7-1.3.1-.5.2-1.1.2-1.8v-.9c-.6-.2-1.3-.3-2-.4-.7-.1-1.3-.1-2-.1-1.4 0-2.4.3-3.1.8-.7.6-1 1.4-1 2.4 0 1 .3 1.7.8 2.2.5.5 1.2.8 2.3.8zm16.6 2.2c-.5 0-.8-.1-1-.3-.2-.2-.4-.5-.5-1l-5-16.2c-.1-.3-.1-.5-.1-.7 0-.3.2-.5.5-.5h2.1c.5 0 .8.1 1 .3.2.2.3.5.4 1l3.5 13.8 3.3-13.8c.1-.5.2-.8.4-1 .2-.2.6-.3 1-.3h1.7c.5 0 .8.1 1 .3.2.2.4.5.4 1l3.3 14 3.6-14c.1-.5.3-.8.4-1 .2-.2.6-.3 1-.3h2c.3 0 .5.2.5.5 0 .1 0 .2-.1.3 0 .1-.1.3-.2.5l-5 16.2c-.1.5-.3.8-.5 1-.2.2-.6.3-1 .3h-1.8c-.5 0-.8-.1-1-.3-.2-.2-.4-.5-.4-1l-3.2-13.5-3.2 13.4c-.1.5-.2.8-.4 1-.2.2-.6.3-1 .3h-1.9zm26.6.6c-1.1 0-2.2-.1-3.2-.4-1-.3-1.8-.6-2.4-.9-.4-.2-.6-.5-.7-.7-.1-.2-.2-.5-.2-.7v-1.1c0-.5.2-.8.5-.8.1 0 .3 0 .4.1.1 0 .3.1.5.2.7.3 1.5.6 2.3.8.8.2 1.6.3 2.5.3 1.3 0 2.3-.2 3-.7.7-.5 1.1-1.1 1.1-2 0-.6-.2-1.1-.6-1.5-.4-.4-1.1-.7-2.1-1.1l-3-1c-1.5-.5-2.6-1.2-3.3-2.1-.7-.9-1-1.9-1-3 0-.9.2-1.6.6-2.3.4-.7.9-1.2 1.5-1.7.6-.5 1.4-.8 2.2-1 .8-.2 1.7-.4 2.7-.4.5 0 1 0 1.5.1.5.1 1 .2 1.4.3.5.1.9.3 1.3.4.4.1.7.3.9.4.3.2.5.3.6.5.1.2.2.4.2.7v1c0 .5-.2.8-.5.8-.2 0-.5-.1-.8-.3-1.2-.6-2.6-.9-4.1-.9-1.2 0-2.1.2-2.8.6-.7.4-1 1-1 1.8 0 .6.2 1.1.6 1.5.4.4 1.2.8 2.3 1.1l2.9.9c1.5.5 2.5 1.1 3.2 2 .7.9 1 1.8 1 2.9 0 .9-.2 1.7-.5 2.4-.4.7-.9 1.3-1.5 1.8-.6.5-1.4.9-2.3 1.2-.9.3-1.9.5-3 .5z" fill="#252F3E"/><path d="M50.4 40.8c-5.8 4.3-14.2 6.5-21.4 6.5-10.1 0-19.2-3.7-26.1-10 -.5-.5-.1-1.1.6-.8 7.4 4.3 16.6 6.9 26.1 6.9 6.4 0 13.4-1.3 19.9-4.1 1-.4 1.8.7.9 1.5zm2.3-2.6c-.7-1-4.9-.5-6.8-.2-.6.1-.7-.4-.1-.8 3.3-2.3 8.8-1.7 9.4-.9.6.8-.2 6.3-3.3 8.9-.5.4-.9.2-.7-.3.7-1.7 2.2-5.7 1.5-6.7z" fill="#FF9900"/></svg>';

VendorLogos.logos.azure = '<svg width="16" height="16" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="azl1" x1="59" y1="7.4" x2="35" y2="93.9" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#114A8B"/><stop offset="1" stop-color="#0669BC"/></linearGradient><linearGradient id="azl2" x1="46.3" y1="3.8" x2="63.3" y2="90.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3CCBF4"/><stop offset="1" stop-color="#2892DF"/></linearGradient></defs><path d="M33.3 6.5h26L32.5 88.2a5.4 5.4 0 01-5.1 3.6H8.6a5.4 5.4 0 01-5.1-7.2L29.6 10.2a5.4 5.4 0 015.1-3.6h-1.4z" fill="url(#azl1)"/><path d="M71.2 60.3H29.9a2.5 2.5 0 00-1.7 4.3l26.6 24.9a5.4 5.4 0 003.7 1.5h23.4L71.2 60.3z" fill="#0078D4"/><path d="M33.3 6.5a5.4 5.4 0 00-5.1 3.8L2.6 84.5a5.4 5.4 0 005 7.3h19.4a5.6 5.6 0 004.4-3.8l5.1-14.7 17.7 16.6a5.5 5.5 0 003.5 1.2h23.3l-10.1-30.8-29.5 0 18.8-54.1H33.3z" fill="url(#azl2)"/></svg>';

VendorLogos.logos.gcp = '<svg width="16" height="16" viewBox="0 0 256 206" xmlns="http://www.w3.org/2000/svg"><path d="M170.3 56.8l23-23 1.5-9.7C175.4 5.6 149.2-3.2 121.3.9 93.4 4.9 69.4 22.5 56.9 47.6l8.2-1.2 46-7.6s2.3-3.9 3.5-3.6c16.1-17.6 43.3-20.5 62.7-6.4z" fill="#EA4335"/><path d="M224.2 73.9a100.3 100.3 0 00-30.2-48.7l-32.3 32.3a54.6 54.6 0 0120 43.3v5.5a27.4 27.4 0 010 54.7h-54.7l-5.5 5.5v32.8l5.5 5.5h54.7a73.3 73.3 0 0042.5-132.8z" fill="#4285F4"/><path d="M72.3 204.7h54.7v-43.8H72.3a27.2 27.2 0 01-11.3-2.5l-7.8 2.4-23.1 23-1.9 7.5a72.9 72.9 0 0043.9 13.3z" fill="#34A853"/><path d="M72.3 58.2a73.3 73.3 0 00-43.9 131.2l33-33a27.4 27.4 0 1136.2-36.2l33-33A73.2 73.2 0 0072.3 58.2z" fill="#FBBC05"/></svg>';

VendorLogos.logos.oracle = VendorLogos._pill('#F80000', '#fff', 'O');

VendorLogos.logos.nutanix = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><polygon points="128,16 240,128 128,240 16,128" fill="#024DA1"/><polygon points="128,56 200,128 128,200 56,128" fill="#69BE28"/><polygon points="128,96 160,128 128,160 96,128" fill="#fff"/></svg>';

// ── Containers ──
VendorLogos.logos.kubernetes = '<svg width="16" height="16" viewBox="0 0 256 249" xmlns="http://www.w3.org/2000/svg"><path d="M128 0c-2.6 0-5.2.7-7.3 2L18.2 60.8a14.8 14.8 0 00-7.3 10.6L.1 186.4a14.8 14.8 0 003.2 12.6l68.2 82.7a14.8 14.8 0 0011.6 5.6h90.1a14.8 14.8 0 0011.6-5.6l68.2-82.7a14.8 14.8 0 003.2-12.6l-10.8-115a14.8 14.8 0 00-7.3-10.6L135.5 2A14.8 14.8 0 00128 0z" fill="#326CE5"/><circle cx="128" cy="128" r="34.5" fill="#fff"/></svg>';
VendorLogos.logos.docker = '<svg width="16" height="16" viewBox="0 0 256 185" xmlns="http://www.w3.org/2000/svg"><path d="M250.7 70.9c-5.3-3.6-17.5-4.9-26.8-3.1-1.2-9.1-6.4-17-15.8-24.1l-5.4-3.6-3.6 5.4c-4.6 6.8-7.3 16.4-6.5 25.7.3 3.4 1.5 9.6 5.2 14.9-3.6 2-10.8 4.7-20.3 4.5H.5c-2.9 16.7-.4 48.2 15.1 67 14.8 18.1 37 27.3 66 27.3 62.9 0 109.4-29 131.1-81.6 8.6.2 27 0 36.5-18.1l.2-.2 4.1-8.7-2.8-5.4zM141.6 0h-23.2v21.3h23.2V0zm0 25.5h-23.2v21.3h23.2V25.5zm-27.4 0H91v21.3h23.2V25.5zm-27.4 0H63.6v21.3h23.2V25.5zm-27.4 25.5H36.2v21.3h23.2V51zm27.4 0H63.6v21.3h23.2V51zm27.4 0H91v21.3h23.2V51zm27.4 0h-23.2v21.3h23.2V51zm27.4 0h-23.2v21.3h23.2V51z" fill="#2496ED"/></svg>';
VendorLogos.logos.openshift = VendorLogos._pill('#EE0000', '#fff', 'OS');
VendorLogos.logos.rancher = VendorLogos._pill('#0075A8', '#fff', 'R');
VendorLogos.logos.eks = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#FF9900"/><text x="128" y="156" text-anchor="middle" fill="#fff" font-size="80" font-weight="bold" font-family="Arial,sans-serif">EKS</text></svg>';
VendorLogos.logos.aks = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#0078D4"/><text x="128" y="156" text-anchor="middle" fill="#fff" font-size="80" font-weight="bold" font-family="Arial,sans-serif">AKS</text></svg>';
VendorLogos.logos.gke = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#4285F4"/><text x="128" y="156" text-anchor="middle" fill="#fff" font-size="80" font-weight="bold" font-family="Arial,sans-serif">GKE</text></svg>';
VendorLogos.logos.ecs = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#FF9900"/><text x="128" y="156" text-anchor="middle" fill="#fff" font-size="80" font-weight="bold" font-family="Arial,sans-serif">ECS</text></svg>';

// ── SaaS ──
VendorLogos.logos.microsoft365 = '<svg width="16" height="16" viewBox="0 0 256 256"><rect x="17" y="17" width="105" height="105" rx="8" fill="#F25022"/><rect x="134" y="17" width="105" height="105" rx="8" fill="#7FBA00"/><rect x="17" y="134" width="105" height="105" rx="8" fill="#00A4EF"/><rect x="134" y="134" width="105" height="105" rx="8" fill="#FFB900"/></svg>';
VendorLogos.logos.google_workspace = '<svg width="16" height="16" viewBox="0 0 256 262"><path d="M255.9 133.5c0-10.8-.9-18.8-2.8-27H130.6v49h71.9a63.6 63.6 0 01-27 42.2l39.2 30.3c24.9-23 39.7-56.9 39.7-96.4z" fill="#4285F4"/><path d="M130.6 261.1c35.2 0 64.8-11.6 86.4-31.6l-41.2-31.9c-11 7.7-25.9 13-45.2 13-34.5 0-63.8-23-74.3-54.8l-40.7 31.5c21.5 42.7 65.7 72.2 117 72.2z" fill="#34A853"/><path d="M56.3 155.8a81 81 0 010-52.2L15 72.1A131.2 131.2 0 000 129.7c0 21.2 5.1 41.3 14.1 59l42.2-32.9z" fill="#FBBC05"/><path d="M130.6 50.8c24.5 0 41 10.6 50.5 19.4l36.8-36A195.3 195.3 0 00130.6 0C79.2 0 35 29.4 13.7 72.2l42.5 33c10.6-31.8 39.9-54.4 74.4-54.4z" fill="#EB4335"/></svg>';
VendorLogos.logos.salesforce = VendorLogos._pill('#00A1E0', '#fff', 'SF');

// ── Databases ──
VendorLogos.logos.postgresql = '<svg width="16" height="16" viewBox="0 0 256 264"><path d="M255 218c-.9-5.9-5.6-10.1-13-11.9-2.2-.5-7.1-.6-9-.3-3 .6-5.6 1.9-7.5 3.6-2.6 2.3-4.1 5.3-5.6 11.1-2 7.5-3.4 10.4-5.7 11.8-1.3.8-2.9 1.1-5.3 1-4.6-.2-8-2.2-11.4-6.7-4.2-5.4-7.6-13.5-10.2-24.3-.8-3.3-1.1-4.8-1.1-5.5 0-.7.1-.9.6-1.5.5-.6 1.5-1.3 3.6-2.6 8.5-5.3 14.3-11.4 18.3-19.4 4.9-9.7 6.4-20.6 4-30.6-2.3-9.7-8.2-17.8-16.3-22.3-3.7-2-7.6-3.3-12.3-3.9l-2.3-.3-.2-3.2c-.9-14.5-4.2-27.2-10-37.9-6.6-12.2-16.3-21.6-27.9-27.3-6.1-3-12.5-4.9-19.7-5.9-3.3-.5-12.2-.5-15.5 0-12.9 1.8-23.7 6.7-32.7 15-1.1 1-2.2 1.9-2.4 1.9-.2 0-1.6-.6-3.2-1.2-7.9-3.4-15.1-5.1-23.4-5.4-12.1-.4-22.5 3.1-31.1 10.5C17.2 80.5 10.3 94.3 7.1 112.4c-1.2 6.8-2.1 15.9-2.1 21.1v2.5l-1.9 1.1C-3.9 141.2-9.4 147.6-12.3 155.2c-2.3 6-3 10.7-3 19.5 0 7.7.5 12.5 1.9 18.3 3.6 14.9 12.3 27.3 23.7 33.7 4.2 2.4 9.6 4.2 14.7 5 2.5.4 9.4.4 11.9 0 9.2-1.4 17.1-5.3 23.2-11.4l2.2-2.2 1.1 1c4.4 4 10.3 7.2 16.4 8.8 3.3.9 5.5 1.1 11 1.1s7.7-.2 11-1.1c6.1-1.6 12-4.8 16.4-8.8l1.1-1 2.2 2.2c6.1 6.1 14 10 23.2 11.4 2.5.4 9.4.4 11.9 0 5.1-.8 10.5-2.6 14.7-5 4.3-2.4 8.5-5.9 12-10l1.5-1.7.5 1.7c2.3 7.5 6.5 14.1 11.4 17.8 5.3 4 12.1 5.6 18.3 4.3z" fill="#336791"/></svg>';
VendorLogos.logos.mysql = '<svg width="16" height="16" viewBox="0 0 256 252"><path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0z" fill="#00758F"/><path d="M128 32c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96z" fill="#F29111"/></svg>';
VendorLogos.logos.sqlserver = VendorLogos._pill('#CC2927', '#fff', 'SQL');
VendorLogos.logos.mongodb = VendorLogos._pill('#47A248', '#fff', 'M');

// ── Operating Systems ──
VendorLogos.logos.windows = '<svg width="16" height="16" viewBox="0 0 256 256"><path d="M0 36.4l104.6-14.4v100.6H0V36.4z" fill="#00ADEF"/><path d="M117.5 20.2L256 1v121.5H117.5V20.2z" fill="#00ADEF"/><path d="M117.5 134.5H256V255l-138.5-19.2V134.5z" fill="#00ADEF"/><path d="M0 134.5h104.6v99.4L0 219.6V134.5z" fill="#00ADEF"/></svg>';
VendorLogos.logos.linux = '<svg width="16" height="16" viewBox="0 0 256 305"><path d="M128 0C93.3 0 76.3 37.8 76.3 68.6c0 16.4 3.9 30.2 8.4 44.6 5.2 16.7 10.9 34.1 10.9 52.9 0 7.5-1.3 14.7-3.5 21.6-4.4 13.5-12.3 25.4-22.6 34.4-5.9 5.2-12.7 9.5-17.5 15.8-4.8 6.4-7.5 14.6-5.3 23.2 2.2 8.6 8.7 15.3 16.6 19.5 7.9 4.2 17 6.1 26 7.1 18.1 2 36.6.5 54.8.5s36.7 1.5 54.8-.5c9-1 18.1-2.9 26-7.1 7.9-4.2 14.4-10.9 16.6-19.5 2.2-8.6-.5-16.8-5.3-23.2-4.8-6.3-11.6-10.6-17.5-15.8-10.3-9-18.2-20.9-22.6-34.4-2.2-6.9-3.5-14.1-3.5-21.6 0-18.8 5.7-36.2 10.9-52.9 4.5-14.4 8.4-28.3 8.4-44.6C179.9 37.8 162.9 0 128 0z" fill="#333"/><circle cx="104" cy="68" r="13" fill="#fff"/><circle cx="152" cy="68" r="13" fill="#fff"/></svg>';
VendorLogos.logos.macos = '<svg width="16" height="16" viewBox="0 0 256 315"><path d="M213.8 167c-.4-44.3 36.1-65.5 37.7-66.5-20.5-30-52.5-34.2-63.9-34.6-27.2-2.8-53.2 16-67 16s-35.2-15.6-57.9-15.2c-29.8.4-57.2 17.3-72.6 44-30.9 53.7-7.9 133.2 22.2 176.8 14.7 21.3 32.3 45.2 55.3 44.4 22.2-.9 30.6-14.4 57.4-14.4s34.4 14.4 57.8 13.9c23.9-.4 39.1-21.7 53.7-43.1 16.9-24.7 23.9-48.7 24.3-49.9-.5-.2-46.7-17.9-47.1-71.1z" fill="#000"/><path d="M176.1 40.4C188.3 25.8 196.6 5.6 194.4 0c-17.3.7-38.3 11.5-50.7 26.1-11.1 12.9-20.9 33.5-18.3 53.2 19.3 1.5 39-9.8 50.7-24.9z" fill="#000"/></svg>';

// ── Network / Firewalls ──
VendorLogos.logos.paloalto = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#FA582D"/><path d="M128 48L68 82.6v69.2L128 186l60-34.6V82.6L128 48zm0 20l40 23.1v46.2L128 160.4l-40-23.1V91.1L128 68z" fill="#fff"/></svg>';
VendorLogos.logos.cisco = '<svg width="16" height="16" viewBox="0 0 256 130"><rect x="32" y="20" width="16" height="90" rx="8" fill="#049FD9"/><rect x="64" y="0" width="16" height="130" rx="8" fill="#049FD9"/><rect x="96" y="20" width="16" height="90" rx="8" fill="#049FD9"/><rect x="128" y="0" width="16" height="130" rx="8" fill="#049FD9"/><rect x="160" y="20" width="16" height="90" rx="8" fill="#049FD9"/><rect x="192" y="0" width="16" height="130" rx="8" fill="#049FD9"/></svg>';
VendorLogos.logos.fortinet = VendorLogos._pill('#DA291C', '#fff', 'F');

// ── XDR / EDR ──
VendorLogos.logos.sentinelone = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#6C2EB9"/><path d="M128 40L72 72v56c0 37.3 25.6 72 56 80 30.4-8 56-42.7 56-80V72l-56-32zm0 24l36 20.6v41.4c0 26.1-17.9 50.4-36 56-18.1-5.6-36-29.9-36-56V84.6L128 64z" fill="#fff"/></svg>';
VendorLogos.logos.crowdstrike = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#FC0000"/><path d="M128 40c-28 12-52 36-64 72 16-12 36-20 56-20 8 0 16 2 24 4 24 8 44 28 52 52 4-20 0-44-16-64-16-24-36-40-52-44z" fill="#fff"/><path d="M80 152c12 20 32 36 56 40 28-8 48-32 52-60-12 16-32 28-56 28-20 0-38-4-52-8z" fill="#fff" opacity="0.8"/></svg>';
VendorLogos.logos.carbon_black = VendorLogos._pill('#1A1A1A', '#fff', 'CB');
VendorLogos.logos.huntress = VendorLogos._pill('#00B67A', '#fff', 'H');
VendorLogos.logos.sophos = VendorLogos._pill('#003366', '#fff', 'S');

// ── RMM & Endpoint Mgmt ──
VendorLogos.logos.ninjaone = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#00AEEF"/><path d="M80 72h32v112H80V72zm48 32h32v80h-32v-80z" fill="#fff"/></svg>';
VendorLogos.logos.datto_rmm = VendorLogos._pill('#199ED9', '#fff', 'D');
VendorLogos.logos.connectwise = VendorLogos._pill('#0072CE', '#fff', 'CW');
VendorLogos.logos.nable = VendorLogos._pill('#E8500E', '#fff', 'N');

// ── SIEM & Monitoring ──
VendorLogos.logos.splunk = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#000"/><path d="M40 64l88 56-88 56V64z" fill="#65A637"/><path d="M216 64l-88 56 88 56V64z" fill="#65A637"/></svg>';
VendorLogos.logos.splunk_es = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#000"/><path d="M40 64l88 56-88 56V64z" fill="#65A637"/><path d="M216 64l-88 56 88 56V64z" fill="#65A637"/><circle cx="210" cy="56" r="28" fill="#F90"/></svg>';
VendorLogos.logos.elk = VendorLogos._pill('#005571', '#F8B700', 'ELK');
VendorLogos.logos.elastic_siem = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#005571"/><circle cx="128" cy="128" r="56" fill="#F8B700"/><circle cx="128" cy="128" r="28" fill="#fff"/></svg>';
VendorLogos.logos.sentinel = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#0078D4"/><circle cx="128" cy="128" r="56" fill="#50E6FF"/><circle cx="128" cy="128" r="28" fill="#fff"/></svg>';
VendorLogos.logos.chronicle = VendorLogos._pill('#4285F4', '#fff', 'GS');
VendorLogos.logos.qradar = VendorLogos._pill('#054ADA', '#fff', 'QR');
VendorLogos.logos.logrhythm = VendorLogos._pill('#00A4E4', '#fff', 'LR');
VendorLogos.logos.sumo_logic = VendorLogos._pill('#000099', '#fff', 'SL');
VendorLogos.logos.exabeam = VendorLogos._pill('#1A1F71', '#fff', 'EX');
VendorLogos.logos.securonix = VendorLogos._pill('#FF6600', '#fff', 'SX');
VendorLogos.logos.arctic_wolf = VendorLogos._pill('#1B365D', '#fff', 'AW');
VendorLogos.logos.blumira = VendorLogos._pill('#2D5BFF', '#fff', 'B');

// ── Vulnerability Management ──
VendorLogos.logos.tenable = '<svg width="16" height="16" viewBox="0 0 256 256"><circle cx="128" cy="128" r="120" fill="#00B1E1"/><path d="M80 128l32 32 64-64" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
VendorLogos.logos.qualys = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#ED2E26"/><circle cx="120" cy="120" r="60" fill="none" stroke="#fff" stroke-width="20"/><line x1="160" y1="160" x2="208" y2="208" stroke="#fff" stroke-width="22" stroke-linecap="round"/></svg>';
VendorLogos.logos.rapid7 = VendorLogos._pill('#E8542E', '#fff', 'R7');
VendorLogos.logos.openvas = VendorLogos._pill('#66C430', '#fff', 'OV');

// ── IAM / PAM ──
VendorLogos.logos.okta = VendorLogos._pill('#007DC1', '#fff', 'O');
VendorLogos.logos.cyberark = VendorLogos._pill('#00336B', '#fff', 'CA');
VendorLogos.logos.delinea = VendorLogos._pill('#0066CC', '#fff', 'D');
VendorLogos.logos.beyondtrust = VendorLogos._pill('#FF6600', '#fff', 'BT');
VendorLogos.logos.jumpcloud = VendorLogos._pill('#38B449', '#fff', 'JC');
VendorLogos.logos.duo = VendorLogos._pill('#6DC04B', '#fff', 'D');
VendorLogos.logos.keeper = VendorLogos._pill('#0A2E50', '#fff', 'K');

// ── Email Security ──
VendorLogos.logos.proofpoint = VendorLogos._pill('#0A3E6C', '#fff', 'PP');
VendorLogos.logos.mimecast = VendorLogos._pill('#1D1D1D', '#fff', 'M');
VendorLogos.logos.abnormal = VendorLogos._pill('#4F46E5', '#fff', 'AB');

// ── Security Awareness ──
VendorLogos.logos.knowbe4 = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#C8102E"/><path d="M72 56v144M72 128l56-56M72 128l56 56M168 56v144" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
VendorLogos.logos.ninjio = VendorLogos._pill('#FF4500', '#fff', 'NJ');

// ── DLP ──
VendorLogos.logos.purview = VendorLogos._pill('#0078D4', '#fff', 'PV');
VendorLogos.logos.netskope = VendorLogos._pill('#24B5A5', '#fff', 'NS');
VendorLogos.logos.code42 = VendorLogos._pill('#00B050', '#fff', 'C42');
VendorLogos.logos.zscaler = VendorLogos._pill('#0090D0', '#fff', 'ZS');

// ── Backup ──
VendorLogos.logos.veeam = VendorLogos._pill('#00B336', '#fff', 'V');
VendorLogos.logos.druva = VendorLogos._pill('#0066CC', '#fff', 'D');
VendorLogos.logos.datto_bcdr = VendorLogos._pill('#199ED9', '#fff', 'D');

// ── GRC ──
VendorLogos.logos.drata = VendorLogos._pill('#6366F1', '#fff', 'D');
VendorLogos.logos.vanta = VendorLogos._pill('#5850EC', '#fff', 'V');

// ── SaaS / Productivity ──
VendorLogos.logos.salesforce_shield = VendorLogos._pill('#00A1E0', '#fff', 'SS');

// ── Mobile ──
VendorLogos.logos.ios = VendorLogos.logos.macos;
VendorLogos.logos.android = '<svg width="16" height="16" viewBox="0 0 256 300"><path d="M48 120v72a12 12 0 0012 12h12v42a18 18 0 0036 0v-42h24v42a18 18 0 0036 0v-42h12a12 12 0 0012-12v-72H48z" fill="#3DDC84"/><path d="M18 120a18 18 0 00-18 18v60a18 18 0 0036 0v-60a18 18 0 00-18-18zm220 0a18 18 0 00-18 18v60a18 18 0 0036 0v-60a18 18 0 00-18-18z" fill="#3DDC84"/><path d="M48 120a80 80 0 01160 0H48z" fill="#3DDC84"/><circle cx="100" cy="84" r="9" fill="#fff"/><circle cx="156" cy="84" r="9" fill="#fff"/></svg>';

// ── Languages / Frameworks ──
VendorLogos.logos.nodejs = '<svg width="16" height="16" viewBox="0 0 256 289"><path d="M128 0L0 73.9v144.8L128 289l128-70.3V73.9L128 0z" fill="#339933"/><text x="128" y="170" text-anchor="middle" fill="#fff" font-size="90" font-weight="bold" font-family="Arial,sans-serif">JS</text></svg>';
VendorLogos.logos.python = '<svg width="16" height="16" viewBox="0 0 256 255"><path d="M126.9.1C62.5-.4 33.6 26.6 33.6 26.6s-17 18.3-17 76.2v28h82v9.5H29.4S0 135.8 0 198.2s25.6 60 25.6 60h30.4v-28.9s-1.6-30.4 29.9-30.4h51.5s29 .5 29-28.1V62.5s4.4-62.4-59.5-62.4zM92.8 36.7c9.4 0 17 7.6 17 17s-7.6 17-17 17-17-7.6-17-17 7.6-17 17-17z" fill="#366C9C"/><path d="M129.1 254.9c64.4.5 93.3-26.2 93.3-26.2s17-18.3 17-76.2v-28h-82v-9.5h69.2s29.4 4.5 29.4-58 -25.6-60-25.6-60h-30.4v28.9s1.6 30.4-29.9 30.4h-51.5s-29-.5-29 28.1v108.3s-4.4 62.4 59.5 62.4zm34.1-36.6c-9.4 0-17-7.6-17-17s7.6-17 17-17 17 7.6 17 17-7.6 17-17 17z" fill="#FFC836"/></svg>';
VendorLogos.logos.java = VendorLogos._pill('#5382A1', '#fff', 'J');
VendorLogos.logos.dotnet = VendorLogos._pill('#512BD4', '#fff', '.N');

// ── SOAR ──
VendorLogos.logos.cortex_xsoar = VendorLogos._pill('#FA582D', '#fff', 'XS');
VendorLogos.logos.splunk_soar = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#000"/><path d="M40 64l88 56-88 56V64z" fill="#65A637"/><path d="M216 64l-88 56 88 56V64z" fill="#65A637"/><circle cx="210" cy="56" r="28" fill="#A855F7"/></svg>';

// ── MDM / UEM ──
VendorLogos.logos.intune = VendorLogos._pill('#0078D4', '#fff', 'IN');
VendorLogos.logos.jamf = VendorLogos._pill('#1A1A1A', '#fff', 'J');
VendorLogos.logos.workspace_one = VendorLogos._pill('#78BE20', '#fff', 'W1');

// ── NDR ──
VendorLogos.logos.darktrace = VendorLogos._pill('#FF6B00', '#fff', 'DT');
VendorLogos.logos.vectra = VendorLogos._pill('#00A4E4', '#fff', 'V');
VendorLogos.logos.extrahop = VendorLogos._pill('#00B4D8', '#fff', 'EH');

// ── CSPM ──
VendorLogos.logos.prisma_cloud = VendorLogos._pill('#FA582D', '#fff', 'PC');
VendorLogos.logos.wiz = VendorLogos._pill('#4F46E5', '#fff', 'W');
VendorLogos.logos.orca = VendorLogos._pill('#0066FF', '#fff', 'OR');

// ── Physical Security ──
VendorLogos.logos.verkada = VendorLogos._pill('#1A1A1A', '#fff', 'VK');
VendorLogos.logos.genetec = VendorLogos._pill('#0066CC', '#fff', 'G');

// ── ITSM ──
VendorLogos.logos.servicenow = VendorLogos._pill('#81B5A1', '#fff', 'SN');
VendorLogos.logos.jira = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#0052CC"/><path d="M210 123L133 46l-5-5-5 5-72 72a7 7 0 000 10l67 67 5 5 5-5 72-72a7 7 0 000-10zM128 160l-32-32 32-32 32 32-32 32z" fill="#fff"/></svg>';

// ── Integrations Hub providers ──
VendorLogos.logos.entra = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#0078D4"/><path d="M80 200H48L96 48h40l20 52-44 100z" fill="#fff"/><path d="M148 200h36L152 100h-36z" fill="#50E6FF"/></svg>';
VendorLogos.logos.m365 = VendorLogos.logos.microsoft365;
VendorLogos.logos.defender = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#0078D4"/><path d="M128 40l72 32v56c0 48-30 88-72 104-42-16-72-56-72-104V72l72-32z" fill="none" stroke="#fff" stroke-width="14"/><path d="M108 132l20 20 40-40" fill="none" stroke="#50E6FF" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>';
VendorLogos.logos.s3 = '<svg width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" rx="28" fill="#569A31"/><text x="128" y="156" text-anchor="middle" fill="#fff" font-size="80" font-weight="bold" font-family="Arial,sans-serif">S3</text></svg>';
VendorLogos.logos.notion = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#000"/><path d="M56 48h96l48 40v120a8 8 0 01-8 8H56a8 8 0 01-8-8V56a8 8 0 018-8z" fill="#fff"/><path d="M80 80v96M80 80l64 96M144 80v96" stroke="#000" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';

// ── GRC & Compliance ──
VendorLogos.logos.drata = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#1A1A2E"/><path d="M128 48c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80zm0 130c-27.6 0-50-22.4-50-50s22.4-50 50-50 50 22.4 50 50-22.4 50-50 50z" fill="#6C63FF"/><circle cx="128" cy="128" r="20" fill="#6C63FF"/></svg>';
VendorLogos.logos.vanta = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#1B1464"/><path d="M128 56l60 144H68L128 56z" fill="#fff"/></svg>';
VendorLogos.logos.secureframe = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#6366F1"/><path d="M128 48l72 40v48c0 42-30 81-72 96-42-15-72-54-72-96V88l72-40z" fill="none" stroke="#fff" stroke-width="16"/><polyline points="100,128 120,148 156,112" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>';
VendorLogos.logos.intelligrc = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#0D47A1"/><text x="128" y="155" text-anchor="middle" fill="#fff" font-size="56" font-weight="bold" font-family="Arial,sans-serif">iGRC</text></svg>';
VendorLogos.logos.archer = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#C62828"/><circle cx="128" cy="128" r="60" fill="none" stroke="#fff" stroke-width="12"/><circle cx="128" cy="128" r="30" fill="none" stroke="#fff" stroke-width="12"/><circle cx="128" cy="128" r="6" fill="#fff"/></svg>';
VendorLogos.logos.servicenow = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#81B5A1"/><circle cx="128" cy="128" r="56" fill="none" stroke="#fff" stroke-width="16"/><circle cx="128" cy="128" r="20" fill="#fff"/></svg>';

// ── Missing vendors ──
VendorLogos.logos.acronis = VendorLogos._pill('#C5202E', '#fff', 'A');
VendorLogos.logos.kandji = VendorLogos._pill('#5856D6', '#fff', 'K');
VendorLogos.logos.tines = VendorLogos._pill('#8B5CF6', '#fff', 'T');
VendorLogos.logos.swimlane = VendorLogos._pill('#0EA5E9', '#fff', 'SW');
VendorLogos.logos.brivo = VendorLogos._pill('#00B4D8', '#fff', 'BR');
VendorLogos.logos.freshservice = VendorLogos._pill('#0CAA56', '#fff', 'FS');
VendorLogos.logos.teams_gcc = VendorLogos._pill('#6264A7', '#fff', 'TG');
VendorLogos.logos.slack_grid = VendorLogos._pill('#4A154B', '#fff', 'SG');

// ── Integration Hub extras ──
VendorLogos.logos.oscal = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#1A237E"/><path d="M96 40H64a16 16 0 00-16 16v144a16 16 0 0016 16h128a16 16 0 0016-16V104L144 40H96z" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><polyline points="144,40 144,104 208,104" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><text x="128" y="175" text-anchor="middle" fill="#7C4DFF" font-size="44" font-weight="bold" font-family="Arial,sans-serif">OSCAL</text></svg>';
VendorLogos.logos.gdrive = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M88 24l-80 144h80l80-144z" fill="#0DA960"/><path d="M168 24l80 144H168L88 24z" fill="#FBBC04"/><path d="M8 168l40 72h160l40-72z" fill="#4285F4"/></svg>';
VendorLogos.logos.granola = '<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="28" fill="#7C3AED"/><path d="M128 48v160M80 80l96 96M176 80l-96 96" stroke="#fff" stroke-width="18" stroke-linecap="round"/><circle cx="128" cy="128" r="24" fill="#fff"/></svg>';

// ── Generic categories (non-vendor, use icon fallbacks) ──
VendorLogos.logos.firewall = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>';
VendorLogos.logos.general = VendorLogos._fallback(16);
VendorLogos.logos.access_review_program = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>';
VendorLogos.logos.manufacturing = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20M5 20V8l5 4V8l5 4V4l5 4v12"/></svg>';
VendorLogos.logos.small_business = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>';
VendorLogos.logos.physical = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1"/></svg>';
VendorLogos.logos.process = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
VendorLogos.logos.software = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';

if (typeof window !== 'undefined') window.VendorLogos = VendorLogos;
console.log('[VendorLogos] Registry loaded —', Object.keys(VendorLogos.logos).length, 'logos');
