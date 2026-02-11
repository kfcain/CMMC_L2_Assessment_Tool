// Comprehensive Guidance UI Module
// Renders per-technology dropdown guidance for assessment objectives

const ComprehensiveGuidanceUI = {

    // SVG icons for each technology platform (16x16 inline)
    icons: {
        // Cloud
        aws: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M6.76 10.04c0 .3.03.53.09.71.06.18.14.37.26.58.04.06.06.13.06.18 0 .08-.05.16-.15.24l-.5.34a.38.38 0 01-.21.07c-.08 0-.16-.04-.24-.11a2.5 2.5 0 01-.29-.38 6 6 0 01-.25-.47c-.62.73-1.4 1.1-2.35 1.1-.67 0-1.2-.19-1.6-.57-.39-.39-.59-.9-.59-1.54 0-.68.24-1.23.73-1.64.49-.42 1.13-.62 1.96-.62.27 0 .55.02.85.06.3.04.6.1.92.18v-.58c0-.61-.13-1.03-.38-1.28-.25-.25-.69-.37-1.3-.37-.28 0-.57.03-.86.1-.3.07-.58.16-.86.27a2.3 2.3 0 01-.28.1.49.49 0 01-.13.03c-.11 0-.17-.08-.17-.25v-.39c0-.13.02-.22.06-.28a.6.6 0 01.22-.17c.28-.14.62-.26 1-.36a4.8 4.8 0 011.25-.15c.95 0 1.64.22 2.09.65.44.43.66 1.08.66 1.96v2.59zm-3.24 1.21c.26 0 .53-.05.82-.14.29-.1.54-.27.76-.51.13-.15.22-.32.27-.51.05-.19.08-.42.08-.7v-.33a6.7 6.7 0 00-.74-.14 6 6 0 00-.75-.05c-.54 0-.93.1-1.19.32-.26.22-.39.52-.39.92 0 .37.1.65.3.84.19.2.47.3.84.3zm6.41.86c-.14 0-.24-.02-.3-.08-.07-.05-.12-.16-.17-.31l-1.87-6.17a1.4 1.4 0 01-.08-.32c0-.13.07-.2.2-.2h.78c.15 0 .26.03.31.08.07.05.11.16.16.31l1.34 5.28 1.25-5.28c.04-.16.09-.26.15-.31a.55.55 0 01.32-.08h.64c.15 0 .26.03.32.08.06.05.12.16.15.31l1.26 5.35 1.38-5.35c.05-.16.1-.26.16-.31a.52.52 0 01.31-.08h.74c.13 0 .2.07.2.2 0 .04 0 .08-.02.13a1.1 1.1 0 01-.05.2l-1.92 6.17c-.05.16-.1.26-.17.31a.51.51 0 01-.3.08h-.69c-.15 0-.26-.02-.32-.08-.06-.06-.12-.16-.15-.32l-1.24-5.15-1.23 5.14c-.04.16-.09.27-.15.32-.07.06-.18.08-.32.08zm10.26.22c-.42 0-.83-.05-1.23-.14-.4-.1-.71-.2-.92-.32-.13-.07-.22-.15-.25-.22a.56.56 0 01-.05-.22v-.41c0-.17.07-.25.18-.25.05 0 .1 0 .15.02.05.02.12.05.2.08.27.12.57.22.88.28.32.06.63.1.95.1.5 0 .9-.09 1.17-.27.28-.18.43-.44.43-.78 0-.23-.07-.42-.22-.57-.15-.15-.43-.28-.83-.41l-1.2-.37c-.6-.19-1.04-.46-1.3-.83a1.97 1.97 0 01-.4-1.2c0-.34.08-.65.23-.92.15-.27.35-.5.61-.69.26-.19.55-.33.9-.43.34-.1.7-.14 1.09-.14.19 0 .39.01.6.04.2.03.39.07.57.11.18.05.35.1.5.16.16.06.28.12.37.18a.73.73 0 01.26.25c.05.08.07.18.07.31v.38c0 .17-.07.25-.18.25a.83.83 0 01-.3-.1 3.6 3.6 0 00-1.52-.31c-.46 0-.82.07-1.07.23-.25.15-.38.39-.38.72 0 .23.08.43.25.59.16.16.47.32.91.46l1.17.37c.59.19 1.01.45 1.27.79.25.34.37.72.37 1.14 0 .35-.07.67-.22.96-.15.29-.36.54-.62.74-.27.2-.58.35-.95.46-.38.1-.78.16-1.2.16z" fill="#F90"/><path d="M21.72 16.61c-2.69 2-6.59 3.06-9.95 3.06-4.7 0-8.95-1.74-12.15-4.64-.25-.23-.03-.54.28-.36 3.46 2.01 7.74 3.22 12.17 3.22 2.98 0 6.26-.62 9.28-1.9.46-.2.84.3.37.62z" fill="#F90"/><path d="M22.94 15.17c-.34-.44-2.28-.21-3.15-.1-.26.03-.3-.2-.07-.37 1.55-1.09 4.08-.77 4.37-.41.3.37-.08 2.93-1.53 4.15-.22.19-.44.09-.34-.16.33-.82 1.06-2.67.72-3.11z" fill="#F90"/></svg>',
        azure: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M13.05 4.24L6.56 18.05l.02.02h5.74l2.18-4.38L8.86 18.07h8.58L13.05 4.24z" fill="#0078D4"/><path d="M13.05 4.24L8.86 18.07H3.12L13.05 4.24z" fill="#0078D4"/><path d="M17.44 18.07h3.44L15.23 4.24l-2.18 4.38 4.39 9.45z" fill="#0078D4"/></svg>',
        gcp: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M15.65 8.35h1.2l3.4-3.4.17-1.44A10.94 10.94 0 0012 1C7.39 1 3.43 3.8 1.73 7.84l1.22-.17 4.08-.67s.21-.35.32-.33a6.85 6.85 0 018.3 1.68z" fill="#EA4335"/><path d="M20.49 7.84a10.96 10.96 0 00-3.31-5.33l-3.53 3.53a6.85 6.85 0 012.52 5.44v.68c1.9 0 3.43 1.54 3.43 3.43s-1.54 3.43-3.43 3.43H12l-.68.69v4.11l.68.68h4.17A7.52 7.52 0 0020.49 7.84z" fill="#4285F4"/><path d="M7.83 24.5h4.17v-5.48H7.83a3.4 3.4 0 01-1.42-.31l-.98.3-2.8 2.8-.24.96A7.47 7.47 0 007.83 24.5z" fill="#34A853"/><path d="M7.83 9.47A7.52 7.52 0 002.39 22.77l4.02-4.02a3.43 3.43 0 111.42-6.55V8.12l-.68-.68H7.83v2.03z" fill="#FBBC05"/></svg>',
        oracle: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M8.13 16.87h7.74a4.87 4.87 0 100-9.74H8.13a4.87 4.87 0 100 9.74zm.35-7.7h7.04a2.83 2.83 0 110 5.66H8.48a2.83 2.83 0 110-5.66z" fill="#F80000"/></svg>',
        nutanix: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><polygon points="12,2 22,12 12,22 2,12" fill="#024DA1"/><polygon points="12,6 18,12 12,18 6,12" fill="#69BE28"/><polygon points="12,9 15,12 12,15 9,12" fill="#fff"/></svg>',
        // Containers
        kubernetes: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 1.5l-9.5 5.5v11L12 23.5l9.5-5.5V7L12 1.5z" fill="#326CE5" stroke="#fff" stroke-width=".5"/><path d="M12 6v12M7 8.9l10 5.2M17 8.9L7 14.1" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><circle cx="12" cy="6" r="1.2" fill="#fff"/><circle cx="12" cy="18" r="1.2" fill="#fff"/><circle cx="7" cy="8.9" r="1.2" fill="#fff"/><circle cx="17" cy="8.9" r="1.2" fill="#fff"/><circle cx="7" cy="14.1" r="1.2" fill="#fff"/><circle cx="17" cy="14.1" r="1.2" fill="#fff"/></svg>',
        docker: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M13.98 11.08h2.12v-1.9h-2.12v1.9zm-2.54 0h2.12v-1.9h-2.12v1.9zm-2.54 0h2.12v-1.9H8.9v1.9zm-2.54 0h2.12v-1.9H6.36v1.9zm2.54-2.32h2.12V6.86H8.9v1.9zm2.54 0h2.12V6.86h-2.12v1.9zm2.54 0h2.12V6.86h-2.12v1.9zm-2.54-2.32h2.12V4.54h-2.12v1.9zm2.54 0h2.12V4.54h-2.12v1.9z" fill="#2496ED"/><path d="M23.5 11.18c-.55-.47-1.8-.64-2.76-.41-.13-.93-.66-1.74-1.3-2.41l-.44-.37-.38.43c-.48.57-.76 1.36-.68 2.13.03.28.13.79.44 1.23-.31.17-.93.4-1.74.39H.5c-.17.99-.17 4.08 2.34 6.46 1.9 1.8 4.72 2.72 8.38 2.72 7.97 0 13.87-3.67 16.64-10.33.54.01 1.72.01 2.32-1.15l.12-.23-.38-.22-.44-.24z" fill="#2496ED"/></svg>',
        openshift: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M18.44 12.56l3.07-1.12a10 10 0 00-1.8-3.98l-3.07 1.12a6.8 6.8 0 011.8 3.98z" fill="#DB212E"/><path d="M12 2a10 10 0 00-7.71 3.64l3.07 1.12A6.8 6.8 0 0112 5.2a6.8 6.8 0 016.64 5.24l3.07-1.12A10 10 0 0012 2z" fill="#DB212E"/><path d="M5.56 11.44l-3.07 1.12a10 10 0 001.8 3.98l3.07-1.12a6.8 6.8 0 01-1.8-3.98z" fill="#DB212E"/><path d="M12 22a10 10 0 007.71-3.64l-3.07-1.12A6.8 6.8 0 0112 18.8a6.8 6.8 0 01-6.64-5.24l-3.07 1.12A10 10 0 0012 22z" fill="#DB212E"/></svg>',
        rancher: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#0075A8"/><path d="M8 10h2v4H8v-4zm3 0h2v6h-2v-6zm3 0h2v4h-2v-4z" fill="#fff"/></svg>',
        eks: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#F90"/><path d="M12 7l-4 2.5v5L12 17l4-2.5v-5L12 7z" fill="#fff"/></svg>',
        aks: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#0078D4"/><path d="M12 7l-4 2.5v5L12 17l4-2.5v-5L12 7z" fill="#fff"/></svg>',
        gke: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#4285F4"/><path d="M12 7l-4 2.5v5L12 17l4-2.5v-5L12 7z" fill="#fff"/></svg>',
        ecs: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#F90"/><text x="12" y="14" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold">ECS</text></svg>',
        // SaaS
        microsoft365: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="9.5" height="9.5" rx="1" fill="#F25022"/><rect x="12.5" y="2" width="9.5" height="9.5" rx="1" fill="#7FBA00"/><rect x="2" y="12.5" width="9.5" height="9.5" rx="1" fill="#00A4EF"/><rect x="12.5" y="12.5" width="9.5" height="9.5" rx="1" fill="#FFB900"/></svg>',
        google_workspace: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09a6.97 6.97 0 010-4.17V7.08H2.18a11 11 0 000 9.84l3.66-2.83z" fill="#FBBC05"/><path d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.16 6.16-4.16z" fill="#EA4335"/></svg>',
        salesforce: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M10.05 4.5a4.5 4.5 0 013.9 2.25 3.75 3.75 0 015.55 3.25 3.75 3.75 0 01-1.5 7.25H5.25a3.38 3.38 0 01-.75-6.67A4.5 4.5 0 0110.05 4.5z" fill="#00A1E0"/></svg>',
        // Databases
        postgresql: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M17.13 2.77A8.3 8.3 0 0012.5 1.5c-1.7 0-3.3.42-4.63 1.27C6.53 3.62 5.5 4.9 4.9 6.5c-.6 1.6-.6 3.3 0 5 .4 1.1 1.1 2.1 2 2.9l-.1 3.6c0 .5.1 1 .4 1.4.3.4.7.7 1.2.8.5.1 1 0 1.4-.3l2-1.5c.6.1 1.2.2 1.8.2 1.7 0 3.3-.4 4.6-1.3 1.3-.8 2.4-2.1 3-3.7.6-1.6.6-3.3 0-5-.4-1.1-1.1-2.1-2-2.9l.1-2.6c0-.5-.1-1-.4-1.4-.3-.4-.7-.7-1.2-.8-.2-.1-.4-.1-.5-.1z" fill="#336791"/><path d="M12.5 7a2 2 0 100 4 2 2 0 000-4z" fill="#fff"/></svg>',
        mysql: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 3C7.03 3 3 5.69 3 9v6c0 3.31 4.03 6 9 6s9-2.69 9-6V9c0-3.31-4.03-6-9-6z" fill="#00758F"/><ellipse cx="12" cy="9" rx="9" ry="4" fill="#F29111"/><path d="M12 13c-4.97 0-9-1.79-9-4v6c0 2.21 4.03 4 9 4s9-1.79 9-4V9c0 2.21-4.03 4-9 4z" fill="#00758F"/></svg>',
        sqlserver: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" fill="#CC2927"/><text x="12" y="14" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">SQL</text></svg>',
        mongodb: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2c-.5 2-1.5 3.5-3 5-1.5 1.5-2 3.5-2 5.5 0 3.5 2.5 6.5 5 8.5.5-2 .5-3 .5-3s2.5-2 2.5-5.5c0-2-.5-4-2-5.5C11.5 5.5 12.5 4 12 2z" fill="#47A248"/></svg>',
        // Operating Systems
        windows: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M2 4.5l8.5-1.2v8.2H2V4.5z" fill="#00ADEF"/><path d="M11.5 3.2L22 1.5v10H11.5V3.2z" fill="#00ADEF"/><path d="M2 12.5h8.5v8.2L2 19.5v-7z" fill="#00ADEF"/><path d="M11.5 12.5H22v10l-10.5-1.7v-8.3z" fill="#00ADEF"/></svg>',
        linux: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2C9.5 2 8 4.5 8 7.5c0 1.5.5 3 1 4.5-.5 1-1.5 2-3 3-.5.5-1 1.5-.5 2.5s1.5 1.5 2.5 1.5h8c1 0 2-.5 2.5-1.5s0-2-.5-2.5c-1.5-1-2.5-2-3-3 .5-1.5 1-3 1-4.5C16 4.5 14.5 2 12 2z" fill="#333"/><circle cx="10.5" cy="7" r="1" fill="#fff"/><circle cx="13.5" cy="7" r="1" fill="#fff"/><path d="M10 10c.5.5 1.5 1 2 1s1.5-.5 2-1" stroke="#FFC107" stroke-width="1" fill="none" stroke-linecap="round"/></svg>',
        macos: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.81-1.31.05-2.3-1.32-3.14-2.53C4.25 16.76 3 12.55 4.78 9.75a4.69 4.69 0 013.95-2.4c1.3-.03 2.52.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83l.1-.47z" fill="#555"/><path d="M15.5 2.5c.78-.94 1.31-2.24 1.17-3.5-1.13.05-2.5.75-3.31 1.7-.73.84-1.37 2.18-1.2 3.46 1.26.1 2.54-.64 3.34-1.66z" fill="#555"/></svg>',
        // Network
        paloalto: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#FA582D"/><path d="M12 8l-3 1.7v3.4L12 15l3-1.7V9.7L12 8z" fill="#fff"/></svg>',
        cisco: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="4" y="8" width="2" height="8" rx="1" fill="#049FD9"/><rect x="8" y="5" width="2" height="14" rx="1" fill="#049FD9"/><rect x="12" y="8" width="2" height="8" rx="1" fill="#049FD9"/><rect x="16" y="5" width="2" height="14" rx="1" fill="#049FD9"/><rect x="20" y="8" width="2" height="8" rx="1" fill="#049FD9"/></svg>',
        fortinet: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#DA291C"/><text x="12" y="14" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">FN</text></svg>',
        firewall: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>',
        // Application / Languages
        nodejs: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 1.5l-9.5 5.5v11L12 23.5l9.5-5.5V7L12 1.5z" fill="#339933"/><text x="12" y="14.5" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">JS</text></svg>',
        python: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M11.92 2c-3.15 0-2.95 1.37-2.95 1.37l.003 1.42h3v.43H6.4S4 4.88 4 8.08s2.1 3.08 2.1 3.08h1.25V9.7s-.07-2.1 2.07-2.1h3.56s2-.03 2-1.94V3.94S15.3 2 11.92 2z" fill="#3776AB"/><circle cx="9.6" cy="4.3" r=".7" fill="#fff"/><path d="M12.08 22c3.15 0 2.95-1.37 2.95-1.37l-.003-1.42h-3v-.43h5.58S20 19.12 20 15.92s-2.1-3.08-2.1-3.08h-1.25v1.46s.07 2.1-2.07 2.1h-3.56s-2 .03-2 1.94v1.72S8.7 22 12.08 22z" fill="#FFC331"/><circle cx="14.4" cy="19.7" r=".7" fill="#fff"/></svg>',
        java: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M8.85 18.56s-.98.57.7.76c2.03.23 3.06.2 5.3-.22 0 0 .59.37 1.41.69-5.01 2.15-11.34-.12-7.41-1.23z" fill="#5382A1"/><path d="M8.29 15.89s-1.1.81.58.98c2.18.22 3.87.24 6.83-.32 0 0 .41.42 1.06.65-6.06 1.77-12.81.14-8.47-1.31z" fill="#5382A1"/><path d="M13.47 11.34c1.24 1.43-.33 2.71-.33 2.71s3.15-1.62 1.7-3.66c-1.35-1.9-2.38-2.84 3.22-6.09 0 0-8.8 2.2-4.59 7.04z" fill="#E76F00"/></svg>',
        dotnet: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#512BD4"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold">.N</text></svg>',
        general: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
        // XDR / EDR
        sentinelone: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="#6C2EB9"/><path d="M12 6l-4 2v4c0 3.33 2.3 6.44 4 7.2 1.7-.76 4-3.87 4-7.2V8l-4-2z" fill="#fff"/></svg>',
        crowdstrike: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#FF0000"/><path d="M7 8c2 0 4 2 5 4 1-2 3-4 5-4-1 3-3 5-5 8-2-3-4-5-5-8z" fill="#fff"/></svg>',
        carbon_black: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#1A1A1A"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">CB</text></svg>',
        huntress: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#00B67A"/><path d="M12 6l-4 4h3v4h2v-4h3l-4-4z" fill="#fff"/></svg>',
        sophos: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#003366"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">S</text></svg>',
        // RMM
        ninjaone: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#00AEEF"/><path d="M8 8h3v8H8V8zm5 3h3v5h-3v-5z" fill="#fff"/></svg>',
        datto_rmm: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#199ED9"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">D</text></svg>',
        connectwise: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0072CE"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">CW</text></svg>',
        nable: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#E8500E"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">N</text></svg>',
        // Security Tools
        splunk: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 6l8 5-8 5V6z" fill="#65A637"/><path d="M20 6l-8 5 8 5V6z" fill="#65A637"/></svg>',
        splunk_es: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 6l8 5-8 5V6z" fill="#65A637"/><path d="M20 6l-8 5 8 5V6z" fill="#65A637"/><circle cx="18" cy="6" r="3" fill="#F90"/></svg>',
        elk: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#005571"/><text x="12" y="14" text-anchor="middle" fill="#F8B700" font-size="5.5" font-weight="bold">ELK</text></svg>',
        elastic_siem: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#005571"/><path d="M12 6a6 6 0 100 12 6 6 0 000-12z" fill="#F8B700"/><path d="M12 9a3 3 0 100 6 3 3 0 000-6z" fill="#fff"/></svg>',
        sentinel: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#0078D4"/><path d="M12 6a6 6 0 100 12 6 6 0 000-12z" fill="#50E6FF"/><path d="M12 9a3 3 0 100 6 3 3 0 000-6z" fill="#fff"/></svg>',
        chronicle: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4285F4"/><path d="M8 10h8v2H8v-2zm2 3h4v2h-4v-2z" fill="#fff"/></svg>',
        qradar: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#054ADA"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">QR</text></svg>',
        logrhythm: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#00A4E4"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">LR</text></svg>',
        exabeam: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#1A1F71"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">EX</text></svg>',
        securonix: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#FF6600"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">SX</text></svg>',
        arctic_wolf: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#1B365D"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">AW</text></svg>',
        sumo_logic: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#000099"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">SL</text></svg>',
        blumira: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#2D5BFF"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">B</text></svg>',
        cortex_xsoar: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#FA582D"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="4" font-weight="bold">XSOAR</text></svg>',
        splunk_soar: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 6l8 5-8 5V6z" fill="#65A637"/><path d="M20 6l-8 5 8 5V6z" fill="#65A637"/><circle cx="18" cy="18" r="4" fill="#F90"/></svg>',
        tines: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#8B5CF6"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
        swimlane: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0EA5E9"/><path d="M6 9c2-2 4 2 6 0s4 2 6 0M6 15c2-2 4 2 6 0s4 2 6 0" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
        // Vulnerability Management
        tenable: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><circle cx="12" cy="12" r="10" fill="#00B1E1"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        qualys: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#ED2E26"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">Q</text></svg>',
        rapid7: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#E8542E"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">R7</text></svg>',
        openvas: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><circle cx="12" cy="12" r="10" fill="#66C430"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        // IAM / PAM
        okta: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#007DC1"/><circle cx="12" cy="12" r="5" fill="#fff"/><circle cx="12" cy="12" r="2.5" fill="#007DC1"/></svg>',
        cyberark: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#00336B"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">CA</text></svg>',
        delinea: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0066CC"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">D</text></svg>',
        beyondtrust: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#FF6600"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">BT</text></svg>',
        jumpcloud: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#38B449"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">JC</text></svg>',
        duo: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#6DC04B"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">D</text></svg>',
        keeper: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0A2E50"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">K</text></svg>',
        // Email Security
        proofpoint: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0A3761"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">PP</text></svg>',
        mimecast: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#1D4F91"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">MC</text></svg>',
        abnormal: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#4F46E5"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">AB</text></svg>',
        // Security Awareness
        knowbe4: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#E8451C"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">K4</text></svg>',
        ninjio: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#1A1A2E"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">NJ</text></svg>',
        // DLP & Data Protection
        purview: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0078D4"/><path d="M12 6l-6 4v4l6 4 6-4v-4l-6-4z" fill="#fff" opacity="0.9"/></svg>',
        netskope: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#00A1DE"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">NS</text></svg>',
        code42: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#00B140"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">C42</text></svg>',
        zscaler: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0090D1"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">ZS</text></svg>',
        // MDM / UEM
        intune: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0078D4"/><path d="M8 7h8v10H8V7z" fill="#fff" opacity="0.9"/><path d="M10 10h4v1h-4v-1zm0 2h4v1h-4v-1z" fill="#0078D4"/></svg>',
        jamf: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#1E1E1E"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="4.5" font-weight="bold">JAMF</text></svg>',
        kandji: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#5856D6"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">K</text></svg>',
        workspace_one: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#78BE20"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">W1</text></svg>',
        // Backup & Recovery
        veeam: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#00B336"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">V</text></svg>',
        druva: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#FF6B00"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">D</text></svg>',
        datto_bcdr: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#199ED9"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="4" font-weight="bold">BCDR</text></svg>',
        acronis: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#C5202E"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">A</text></svg>',
        // GRC & Compliance
        vanta: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#5850EC"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">V</text></svg>',
        drata: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#4F46E5"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold">D</text></svg>',
        secureframe: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#6366F1"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">SF</text></svg>',
        archer: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#C41230"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">AR</text></svg>',
        servicenow: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#81B5A1"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">SN</text></svg>',
        intelligrc: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#2563EB"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="4" font-weight="bold">iGRC</text></svg>',
        // NDR / Network Detection
        darktrace: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#FF6B00"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">DT</text></svg>',
        vectra: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#00A4EF"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">VA</text></svg>',
        // CSPM / Cloud Security
        prisma_cloud: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#FA582D"/><path d="M12 6l-6 3.5v5L12 18l6-3.5v-5L12 6z" fill="#fff" opacity="0.9"/></svg>',
        wiz: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#2D7FF9"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">WIZ</text></svg>',
        orca: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0EA5E9"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="4.5" font-weight="bold">ORCA</text></svg>',
        // Physical Security
        verkada: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#1A1A1A"/><circle cx="12" cy="11" r="4" fill="#fff"/><circle cx="12" cy="11" r="2" fill="#1A1A1A"/><rect x="9" y="16" width="6" height="2" rx="1" fill="#fff"/></svg>',
        brivo: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#00B4D8"/><path d="M8 11V9a4 4 0 018 0v2" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><rect x="7" y="11" width="10" height="7" rx="1.5" fill="#fff"/></svg>',
        // Ticketing / ITSM
        jira: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M11.53 2H4.27C3.57 2 3 2.57 3 3.27v7.26c0 .7.57 1.27 1.27 1.27h7.26c.7 0 1.27-.57 1.27-1.27V3.27C12.8 2.57 12.23 2 11.53 2z" fill="#2684FF"/><path d="M19.73 10.2h-7.26c-.7 0-1.27.57-1.27 1.27v7.26c0 .7.57 1.27 1.27 1.27h7.26c.7 0 1.27-.57 1.27-1.27v-7.26c0-.7-.57-1.27-1.27-1.27z" fill="#2684FF" opacity="0.7"/></svg>',
        freshservice: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#0CAA56"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">FS</text></svg>',
        // Secure Communications
        teams_gcc: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#6264A7"/><path d="M16 8a2 2 0 100-4 2 2 0 000 4z" fill="#fff"/><path d="M11 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="#fff"/><path d="M14.5 10H7.5C6.67 10 6 10.67 6 11.5V16h10v-4.5c0-.83-.67-1.5-1.5-1.5z" fill="#fff"/><path d="M18 10h-3v6h4.5v-4.5c0-.83-.67-1.5-1.5-1.5z" fill="#fff" opacity="0.7"/></svg>',
        slack_grid: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M6 15a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2h2v2z" fill="#E01E5A"/><path d="M7 15a2 2 0 012-2 2 2 0 012 2v5a2 2 0 01-2 2 2 2 0 01-2-2v-5z" fill="#E01E5A"/><path d="M9 7a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2v2H9z" fill="#36C5F0"/><path d="M9 8a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2 2 2 0 012-2h5z" fill="#36C5F0"/><path d="M17 10a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-2v-2z" fill="#2EB67D"/><path d="M16 10a2 2 0 01-2 2 2 2 0 01-2-2V5a2 2 0 012-2 2 2 0 012 2v5z" fill="#2EB67D"/><path d="M14 18a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2v-2h2z" fill="#ECB22E"/><path d="M14 17a2 2 0 01-2-2 2 2 0 012-2h5a2 2 0 012 2 2 2 0 01-2 2h-5z" fill="#ECB22E"/></svg>',
        // Mobile
        ios: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.81-1.31.05-2.3-1.32-3.14-2.53C4.25 16.76 3 12.55 4.78 9.75a4.69 4.69 0 013.95-2.4c1.3-.03 2.52.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83l.1-.47z" fill="#555"/></svg>',
        android: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M6 10v6a1 1 0 001 1h1v3.5a1.5 1.5 0 003 0V17h2v3.5a1.5 1.5 0 003 0V17h1a1 1 0 001-1v-6H6z" fill="#3DDC84"/><path d="M3.5 10a1.5 1.5 0 00-1.5 1.5v5a1.5 1.5 0 003 0v-5A1.5 1.5 0 003.5 10zm17 0a1.5 1.5 0 00-1.5 1.5v5a1.5 1.5 0 003 0v-5a1.5 1.5 0 00-1.5-1.5z" fill="#3DDC84"/><path d="M6 10a6 6 0 0112 0H6z" fill="#3DDC84"/><circle cx="9.5" cy="7" r=".75" fill="#fff"/><circle cx="14.5" cy="7" r=".75" fill="#fff"/><path d="M7.5 3l1.5 2M16.5 3l-1.5 2" stroke="#3DDC84" stroke-width=".75" stroke-linecap="round"/></svg>',
        // Access Review Program
        access_review_program: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
        // Industry / Misc
        manufacturing: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20M5 20V8l5 4V8l5 4V4l5 4v12"/></svg>',
        small_business: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/></svg>',
        physical: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1"/></svg>',
        process: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        software: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
    },

    // Display names for technology keys
    techNames: {
        aws: 'Amazon Web Services (AWS)',
        azure: 'Microsoft Azure',
        gcp: 'Google Cloud Platform',
        oracle: 'Oracle Cloud',
        nutanix: 'Nutanix',
        kubernetes: 'Kubernetes',
        docker: 'Docker',
        openshift: 'Red Hat OpenShift',
        rancher: 'Rancher',
        eks: 'Amazon EKS',
        aks: 'Azure AKS',
        gke: 'Google GKE',
        ecs: 'Amazon ECS',
        microsoft365: 'Microsoft 365',
        google_workspace: 'Google Workspace',
        salesforce: 'Salesforce',
        postgresql: 'PostgreSQL',
        mysql: 'MySQL',
        sqlserver: 'SQL Server',
        mongodb: 'MongoDB',
        windows: 'Windows',
        linux: 'Linux',
        macos: 'macOS',
        paloalto: 'Palo Alto Networks',
        cisco: 'Cisco',
        fortinet: 'Fortinet',
        firewall: 'Firewall',
        nodejs: 'Node.js',
        python: 'Python',
        java: 'Java',
        dotnet: '.NET',
        general: 'General',
        sentinelone: 'SentinelOne',
        crowdstrike: 'CrowdStrike Falcon',
        carbon_black: 'Broadcom Carbon Black',
        huntress: 'Huntress',
        sophos: 'Sophos',
        ninjaone: 'NinjaOne',
        datto_rmm: 'Datto RMM (Kaseya)',
        connectwise: 'ConnectWise Automate',
        nable: 'N-able',
        splunk: 'Splunk',
        splunk_es: 'Splunk Enterprise Security',
        elk: 'Elastic Stack (ELK)',
        elastic_siem: 'Elastic Security (SIEM)',
        sentinel: 'Microsoft Sentinel',
        chronicle: 'Google SecOps (fka Chronicle)',
        qradar: 'IBM QRadar',
        logrhythm: 'LogRhythm SIEM',
        sumo_logic: 'Sumo Logic',
        exabeam: 'Exabeam New-Scale SIEM',
        securonix: 'Securonix UEBA/SIEM',
        arctic_wolf: 'Arctic Wolf MDR',
        blumira: 'Blumira',
        tenable: 'Tenable',
        qualys: 'Qualys',
        rapid7: 'Rapid7 InsightVM',
        openvas: 'OpenVAS',
        okta: 'Okta',
        cyberark: 'CyberArk',
        delinea: 'Delinea Secret Server',
        beyondtrust: 'BeyondTrust',
        jumpcloud: 'JumpCloud',
        duo: 'Cisco Duo',
        keeper: 'Keeper Security',
        proofpoint: 'Proofpoint',
        mimecast: 'Mimecast',
        abnormal: 'Abnormal Security',
        knowbe4: 'KnowBe4',
        ninjio: 'Ninjio',
        purview: 'Microsoft Purview',
        netskope: 'Netskope',
        code42: 'Code42 Incydr',
        zscaler: 'Zscaler',
        veeam: 'Veeam',
        druva: 'Druva',
        datto_bcdr: 'Datto BCDR (Kaseya)',
        acronis: 'Acronis',
        vanta: 'Vanta',
        drata: 'Drata',
        secureframe: 'Secureframe',
        archer: 'Archer IRM',
        servicenow: 'ServiceNow',
        intelligrc: 'IntelliGRC',
        intune: 'Microsoft Intune',
        jamf: 'Jamf Pro',
        kandji: 'Kandji',
        workspace_one: 'Omnissa Workspace ONE',
        darktrace: 'Darktrace',
        vectra: 'Vectra AI',
        prisma_cloud: 'Palo Alto Prisma Cloud',
        wiz: 'Wiz',
        orca: 'Orca Security',
        cortex_xsoar: 'Palo Alto Cortex XSOAR',
        splunk_soar: 'Splunk SOAR',
        tines: 'Tines',
        swimlane: 'Swimlane',
        verkada: 'Verkada',
        brivo: 'Brivo',
        jira: 'Jira Service Management',
        freshservice: 'Freshservice',
        teams_gcc: 'Microsoft Teams (GCC High)',
        slack_grid: 'Slack Enterprise Grid',
        ios: 'Apple iOS',
        android: 'Android',
        access_review_program: 'Access Review Program',
        manufacturing: 'Manufacturing',
        small_business: 'Small Business',
        physical: 'Physical Security',
        process: 'Process / Policy',
        software: 'Software / Code'
    },

    // Category groupings for ordering
    categories: {
        'Cloud Platforms': ['aws', 'azure', 'gcp', 'oracle', 'nutanix'],
        'Containers & Orchestration': ['kubernetes', 'docker', 'openshift', 'rancher', 'eks', 'aks', 'gke', 'ecs'],
        'SaaS Platforms': ['microsoft365', 'google_workspace', 'salesforce'],
        'Identity & Access (IAM/PAM)': ['okta', 'cyberark', 'delinea', 'beyondtrust', 'jumpcloud', 'duo', 'keeper'],
        'XDR / EDR': ['sentinelone', 'crowdstrike', 'carbon_black', 'huntress', 'sophos'],
        'SIEM & Monitoring': ['splunk', 'splunk_es', 'elk', 'elastic_siem', 'sentinel', 'chronicle', 'qradar', 'logrhythm', 'sumo_logic', 'exabeam', 'securonix', 'blumira'],
        'MDR / Managed SOC': ['arctic_wolf'],
        'SOAR / Automation': ['cortex_xsoar', 'splunk_soar', 'tines', 'swimlane'],
        'Vulnerability Management': ['tenable', 'qualys', 'rapid7', 'openvas'],
        'Firewalls & Network': ['paloalto', 'cisco', 'fortinet', 'zscaler', 'firewall'],
        'Email Security': ['proofpoint', 'mimecast', 'abnormal'],
        'DLP & Data Protection': ['purview', 'netskope', 'code42'],
        'Security Awareness': ['knowbe4', 'ninjio'],
        'RMM & Endpoint Mgmt': ['ninjaone', 'datto_rmm', 'connectwise', 'nable'],
        'MDM / UEM': ['intune', 'jamf', 'kandji', 'workspace_one'],
        'Backup & Recovery': ['veeam', 'druva', 'datto_bcdr', 'acronis'],
        'GRC & Compliance': ['vanta', 'drata', 'secureframe', 'intelligrc', 'archer', 'servicenow'],
        'NDR / Network Detection': ['darktrace', 'vectra'],
        'CSPM / Cloud Security': ['prisma_cloud', 'wiz', 'orca'],
        'Physical Security': ['verkada', 'brivo'],
        'Ticketing / ITSM': ['jira', 'freshservice'],
        'Secure Communications': ['teams_gcc', 'slack_grid'],
        'Operating Systems': ['windows', 'linux', 'macos'],
        'Databases': ['postgresql', 'mysql', 'sqlserver', 'mongodb'],
        'Application & Code': ['nodejs', 'python', 'java', 'dotnet', 'general', 'software'],
        'Mobile': ['ios', 'android'],
        'Access Review': ['access_review_program'],
        'Industry & Business': ['manufacturing', 'small_business', 'physical', 'process']
    },

    // Render comprehensive guidance for an objective
    renderGuidance: function(objectiveId, container) {
        try {
            const guidance = this.getGuidanceForObjective(objectiveId);
            if (!guidance) return;

            const techs = this.extractTechnologies(guidance);
            if (techs.length === 0) return;

            const guidanceDiv = document.createElement('div');
            guidanceDiv.className = 'cg-root';

            var uid = 'cg-' + objectiveId.replace(/[^a-zA-Z0-9]/g, '-');

            // Header with FedRAMP baseline badges
            var topHtml = '<div class="cg-header"><span class="cg-title">Implementation Guidance</span>';
            // FedRAMP baseline tags
            var controlId = objectiveId.replace(/\[.*\]$/, '');
            var fedrampBaselines = (typeof FEDRAMP_BASELINE_MAP !== 'undefined') ? FEDRAMP_BASELINE_MAP[controlId] : null;
            var is20xLow = (typeof FEDRAMP_20X_LOW_CONTROLS !== 'undefined') ? FEDRAMP_20X_LOW_CONTROLS.indexOf(controlId) !== -1 : false;
            if (fedrampBaselines || is20xLow) {
                topHtml += '<span class="cg-fedramp-badges">';
                if (is20xLow) topHtml += '<span class="cg-fedramp-badge cg-fedramp-20x">20x Low</span>';
                if (fedrampBaselines) {
                    for (var bi = 0; bi < fedrampBaselines.length; bi++) {
                        var bl = fedrampBaselines[bi];
                        var cls = bl === 'High' ? 'cg-fedramp-high' : bl === 'Moderate' ? 'cg-fedramp-mod' : 'cg-fedramp-low';
                        topHtml += '<span class="cg-fedramp-badge ' + cls + '">' + bl + '</span>';
                    }
                }
                topHtml += '</span>';
            }
            topHtml += '</div>';

            // Objective summary (always visible)
            if (guidance.objective) {
                topHtml += '<p class="cg-objective-summary">' + guidance.objective + '</p>';
            }
            if (guidance.summary) {
                topHtml += '<p class="cg-approach">' + guidance.summary + '</p>';
            }

            // Tab bar
            topHtml += '<div class="cg-tab-bar" data-uid="' + uid + '">';
            topHtml += '<button class="cg-tab active" data-tab="quickstart">Quick Start</button>';
            topHtml += '<button class="cg-tab" data-tab="evidence">Evidence & Policy</button>';
            topHtml += '<button class="cg-tab" data-tab="platforms">Platforms <span class="cg-count">' + techs.length + '</span></button>';
            topHtml += '</div>';

            // Tab panels
            topHtml += '<div class="cg-tab-panels" data-uid="' + uid + '">';

            // === Tab 1: Quick Start ===
            topHtml += '<div class="cg-tab-panel active" data-panel="quickstart">';
            topHtml += this.renderQuickStartTab(objectiveId, guidance);
            topHtml += '</div>';

            // === Tab 2: Evidence & Policy ===
            topHtml += '<div class="cg-tab-panel" data-panel="evidence">';
            topHtml += this.renderEvidenceTab(objectiveId, guidance, techs);
            topHtml += '</div>';

            // === Tab 3: Platforms ===
            topHtml += '<div class="cg-tab-panel" data-panel="platforms">';
            topHtml += this.renderPlatformsTab(techs, objectiveId);
            topHtml += '</div>';

            topHtml += '</div>'; // end tab-panels

            guidanceDiv.innerHTML = topHtml;
            container.appendChild(guidanceDiv);

            // Bind tab switching
            this.bindTabEvents(guidanceDiv, uid);
            // Bind platform filter/search
            this.bindPlatformFilters(guidanceDiv);
        } catch (error) {
            console.error('[ComprehensiveGuidanceUI] Error rendering guidance for', objectiveId, error);
        }
    },

    // Bind tab click events
    bindTabEvents: function(root, uid) {
        var tabs = root.querySelectorAll('.cg-tab-bar[data-uid="' + uid + '"] .cg-tab');
        var panels = root.querySelectorAll('.cg-tab-panels[data-uid="' + uid + '"] > .cg-tab-panel');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var target = tab.dataset.tab;
                tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === target); });
                panels.forEach(function(p) { p.classList.toggle('active', p.dataset.panel === target); });
            });
        });
    },

    // Bind platform category filter pills and search
    bindPlatformFilters: function(root) {
        var searchInput = root.querySelector('.cg-platform-search');
        var filterPills = root.querySelectorAll('.cg-cat-pill');
        var techDropdowns = root.querySelectorAll('.cg-tech-dropdown');
        if (!techDropdowns.length) return;

        var activeCategory = 'all';

        function applyFilters() {
            var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            var visibleCount = 0;
            techDropdowns.forEach(function(dd) {
                var techKey = dd.dataset.tech || '';
                var techName = (dd.querySelector('.cg-tech-name') || {}).textContent || '';
                var techCat = dd.dataset.category || '';
                var matchesCat = activeCategory === 'all' || techCat === activeCategory;
                var matchesSearch = !query || techName.toLowerCase().indexOf(query) !== -1 || techKey.toLowerCase().indexOf(query) !== -1;
                var show = matchesCat && matchesSearch;
                dd.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });
            var noResults = root.querySelector('.cg-no-results');
            if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
        filterPills.forEach(function(pill) {
            pill.addEventListener('click', function() {
                activeCategory = pill.dataset.category;
                filterPills.forEach(function(p) { p.classList.toggle('active', p.dataset.category === activeCategory); });
                applyFilters();
            });
        });
    },

    // === TAB 1: Quick Start ===
    renderQuickStartTab: function(objectiveId, guidance) {
        var html = '';

        // GCC High / cloud-agnostic guidance
        var gccGuidance = null;
        if (typeof getGCCHighGuidance === 'function') {
            gccGuidance = getGCCHighGuidance(objectiveId);
        }
        if (gccGuidance && gccGuidance.automation && gccGuidance.automation !== 'Automation guidance not yet available for this objective. Check Microsoft Learn documentation.') {
            html += '<div class="cg-unified-section cg-unified-automation">';
            html += '<div class="cg-unified-section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> Automation Approach</div>';
            html += '<p>' + gccGuidance.automation + '</p>';
            if (gccGuidance.azureService) {
                html += '<div class="cg-tags"><span class="cg-tag">' + gccGuidance.azureService.split(',').map(function(s) { return s.trim(); }).join('</span><span class="cg-tag">') + '</span></div>';
            }
            html += '</div>';

            if (gccGuidance.humanIntervention) {
                html += '<div class="cg-unified-section cg-unified-human">';
                html += '<div class="cg-unified-section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Human Intervention Required</div>';
                html += '<p>' + gccGuidance.humanIntervention + '</p>';
                html += '</div>';
            }
        }

        // Implementation steps
        var implNotes = null;
        if (typeof getImplNotes === 'function') {
            implNotes = getImplNotes(objectiveId, 'azure') || getImplNotes(objectiveId, 'aws') || getImplNotes(objectiveId, 'gcp');
        }
        if (implNotes) {
            if (implNotes.steps && implNotes.steps.length > 0) {
                html += '<div class="cg-unified-section">';
                html += '<div class="cg-unified-section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Technical Implementation Steps</div>';
                html += '<ol class="cg-unified-steps">';
                for (var i = 0; i < implNotes.steps.length; i++) {
                    html += '<li>' + implNotes.steps[i] + '</li>';
                }
                html += '</ol>';
                if (implNotes.quickWin) {
                    html += '<div class="cg-quick-win"><strong>Quick Win:</strong> ' + implNotes.quickWin + '</div>';
                }
                html += '</div>';
            }

            if (implNotes.humanInTheLoop && implNotes.humanInTheLoop.length > 0) {
                html += '<div class="cg-unified-section cg-unified-human-loop">';
                html += '<div class="cg-unified-section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Human-in-the-Loop Requirements</div>';
                html += '<ul>';
                for (var h = 0; h < implNotes.humanInTheLoop.length; h++) {
                    html += '<li>' + implNotes.humanInTheLoop[h] + '</li>';
                }
                html += '</ul></div>';
            }
        }

        // CLI commands
        if (gccGuidance && gccGuidance.cliCommands && gccGuidance.cliCommands.length > 0) {
            html += '<details class="cg-unified-cli-section">';
            html += '<summary class="cg-unified-section-title cg-clickable"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> Verification Commands</summary>';
            html += '<div class="cg-unified-cli-list">';
            for (var cl = 0; cl < gccGuidance.cliCommands.length; cl++) {
                html += '<div class="cg-unified-cli-item"><code>' + this.escapeHtml(gccGuidance.cliCommands[cl]) + '</code></div>';
            }
            html += '</div></details>';
        }

        // Documentation link
        if (gccGuidance && gccGuidance.docLink) {
            html += '<div class="cg-unified-doclink"><a href="' + gccGuidance.docLink + '" target="_blank" rel="noopener noreferrer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Microsoft Learn Documentation</a></div>';
        }

        // Mobile Profiles (MDM/MAM)
        if (guidance.mobile_profiles && typeof guidance.mobile_profiles === 'object') {
            html += this.renderMobileProfiles(guidance.mobile_profiles);
        }

        // Small business guidance
        if (guidance.small_business && typeof guidance.small_business === 'object' && guidance.small_business.approach) {
            html += '<div class="cg-unified-section cg-unified-smallbiz">';
            html += '<div class="cg-unified-section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> Small Business Guidance</div>';
            html += '<p>' + guidance.small_business.approach + '</p>';
            if (guidance.small_business.cost_estimate) {
                html += '<span class="cg-badge cg-badge-cost">' + guidance.small_business.cost_estimate + '</span> ';
            }
            if (guidance.small_business.effort_hours) {
                html += '<span class="cg-badge cg-badge-effort">' + guidance.small_business.effort_hours + 'h</span>';
            }
            html += '</div>';
        }

        if (!html) html = '<p class="cg-empty">No quick start guidance available for this objective.</p>';
        return html;
    },

    // === TAB 2: Evidence & Policy ===
    renderEvidenceTab: function(objectiveId, guidance, techs) {
        var html = '';
        var self = this;
        var implNotes = null;
        if (typeof getImplNotes === 'function') {
            implNotes = getImplNotes(objectiveId, 'azure') || getImplNotes(objectiveId, 'aws') || getImplNotes(objectiveId, 'gcp');
        }

        // --- Section 1: Policy & Procedural Evidence (from implNotes) ---
        if (implNotes) {
            if (implNotes.policyEvidence && implNotes.policyEvidence.length > 0) {
                html += '<div class="cg-unified-section cg-unified-policy">';
                html += '<div class="cg-unified-section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Policy &amp; Procedural Evidence</div>';
                html += '<ul>';
                for (var p = 0; p < implNotes.policyEvidence.length; p++) {
                    html += '<li>' + implNotes.policyEvidence[p] + '</li>';
                }
                html += '</ul></div>';
            }

            if (implNotes.manualEvidence && implNotes.manualEvidence.length > 0) {
                html += '<div class="cg-unified-section cg-unified-manual">';
                html += '<div class="cg-unified-section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg> Manual Evidence Collection</div>';
                html += '<ul>';
                for (var m = 0; m < implNotes.manualEvidence.length; m++) {
                    html += '<li>' + implNotes.manualEvidence[m] + '</li>';
                }
                html += '</ul></div>';
            }

            if (implNotes.evidenceMethodology) {
                html += '<div class="cg-unified-section cg-unified-methodology">';
                html += '<div class="cg-unified-section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Evidence Collection Methodology</div>';
                html += '<p>' + implNotes.evidenceMethodology + '</p>';
                html += '</div>';
            }

            if (implNotes.evidenceArtifact) {
                html += '<div class="cg-unified-artifact"><strong>Machine-Readable Artifact:</strong> <code>' + implNotes.evidenceArtifact + '</code></div>';
            }
        }

        // --- Section 2: Platform Verification (grouped by category, deduplicated) ---
        if (techs && techs.length > 0) {
            // Collect verification/evidence/pitfalls from all platforms, grouped by category
            var catGroups = {};  // { categoryName: { verification: [], evidence: [], pitfalls: [], platforms: [] } }
            var seenVerify = {};
            var seenEvidence = {};
            var seenPitfalls = {};

            for (var ti = 0; ti < techs.length; ti++) {
                var tech = techs[ti];
                var data = tech.data;
                var impl = data.implementation || data;
                var cat = self.getCategoryForTech(tech.key);
                var name = self.techNames[tech.key] || tech.key.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); });

                if (!catGroups[cat]) {
                    catGroups[cat] = { verification: [], evidence: [], pitfalls: [], platforms: [] };
                }
                if (catGroups[cat].platforms.indexOf(name) === -1) {
                    catGroups[cat].platforms.push(name);
                }

                // Deduplicate verification items across platforms
                if (impl.verification && impl.verification.length > 0) {
                    for (var vi = 0; vi < impl.verification.length; vi++) {
                        var vItem = impl.verification[vi];
                        var vKey = vItem.toLowerCase().replace(/\s+/g, ' ').trim();
                        if (!seenVerify[vKey]) {
                            seenVerify[vKey] = true;
                            catGroups[cat].verification.push({ text: vItem, platform: name });
                        }
                    }
                }

                // Deduplicate evidence artifacts
                if (data.evidenceArtifacts && data.evidenceArtifacts.length > 0) {
                    for (var ei = 0; ei < data.evidenceArtifacts.length; ei++) {
                        var eItem = data.evidenceArtifacts[ei];
                        var eKey = eItem.toLowerCase().replace(/\s+/g, ' ').trim();
                        if (!seenEvidence[eKey]) {
                            seenEvidence[eKey] = true;
                            catGroups[cat].evidence.push({ text: eItem, platform: name });
                        }
                    }
                }

                // Deduplicate pitfalls
                if (data.pitfalls && data.pitfalls.length > 0) {
                    for (var pi = 0; pi < data.pitfalls.length; pi++) {
                        var pItem = data.pitfalls[pi];
                        var pKey = pItem.toLowerCase().replace(/\s+/g, ' ').trim();
                        if (!seenPitfalls[pKey]) {
                            seenPitfalls[pKey] = true;
                            catGroups[cat].pitfalls.push({ text: pItem, platform: name });
                        }
                    }
                }
            }

            // Render grouped verification by category
            var catKeys = Object.keys(catGroups);
            var hasAnyVerification = false;
            for (var ci = 0; ci < catKeys.length; ci++) {
                var g = catGroups[catKeys[ci]];
                if (g.verification.length > 0 || g.evidence.length > 0 || g.pitfalls.length > 0) {
                    hasAnyVerification = true;
                    break;
                }
            }

            if (hasAnyVerification) {
                html += '<div class="cg-ev-grouped">';
                html += '<div class="cg-ev-grouped-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Platform Verification &amp; Evidence</div>';
                html += '<p class="cg-ev-grouped-desc">Verification steps grouped by platform category. Expand a category to see platform-specific checks.</p>';

                for (var ck = 0; ck < catKeys.length; ck++) {
                    var catName = catKeys[ck];
                    var group = catGroups[catName];
                    var totalItems = group.verification.length + group.evidence.length + group.pitfalls.length;
                    if (totalItems === 0) continue;

                    html += '<details class="cg-ev-cat-group">';
                    html += '<summary class="cg-ev-cat-summary">';
                    html += '<span class="cg-ev-cat-name">' + catName + '</span>';
                    html += '<span class="cg-ev-cat-platforms">' + group.platforms.slice(0, 3).join(', ') + (group.platforms.length > 3 ? ' +' + (group.platforms.length - 3) + ' more' : '') + '</span>';
                    html += '<span class="cg-count">' + totalItems + '</span>';
                    html += '<svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
                    html += '</summary>';
                    html += '<div class="cg-ev-cat-body">';

                    // Verification checks
                    if (group.verification.length > 0) {
                        html += '<div class="cg-ev-subsection">';
                        html += '<div class="cg-ev-subsection-title"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Verification Checks</div>';
                        html += '<ul class="cg-ev-list">';
                        for (var vj = 0; vj < group.verification.length; vj++) {
                            html += '<li>' + self.formatVerifyText(group.verification[vj].text) + '</li>';
                        }
                        html += '</ul></div>';
                    }

                    // Evidence artifacts
                    if (group.evidence.length > 0) {
                        html += '<div class="cg-ev-subsection">';
                        html += '<div class="cg-ev-subsection-title"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Evidence Artifacts</div>';
                        html += '<ul class="cg-ev-list">';
                        for (var ej = 0; ej < group.evidence.length; ej++) {
                            html += '<li>' + self.formatVerifyText(group.evidence[ej].text) + '</li>';
                        }
                        html += '</ul></div>';
                    }

                    // Pitfalls
                    if (group.pitfalls.length > 0) {
                        html += '<div class="cg-ev-subsection">';
                        html += '<div class="cg-ev-subsection-title"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Common Pitfalls</div>';
                        html += '<ul class="cg-ev-list">';
                        for (var pj = 0; pj < group.pitfalls.length; pj++) {
                            html += '<li>' + self.formatVerifyText(group.pitfalls[pj].text) + '</li>';
                        }
                        html += '</ul></div>';
                    }

                    html += '</div>'; // end cat-body
                    html += '</details>';
                }

                html += '</div>'; // end ev-grouped
            }
        }

        if (!html) html = '<p class="cg-empty">No specific evidence guidance available. Check the Platforms tab for platform-specific evidence artifacts.</p>';
        return html;
    },

    // === TAB 3: Platforms (with category filters + search) ===
    renderPlatformsTab: function(techs, objectiveId) {
        var html = '';

        // Determine which categories are present
        var self = this;
        var presentCategories = {};
        var techsWithCategory = techs.map(function(tech) {
            var cat = self.getCategoryForTech(tech.key);
            if (cat) presentCategories[cat] = true;
            return { tech: tech, category: cat };
        });

        // Search bar
        html += '<div class="cg-platform-toolbar">';
        html += '<input type="text" class="cg-platform-search" placeholder="Search platforms..." spellcheck="false" autocomplete="off">';
        html += '</div>';

        // Category filter pills
        var catKeys = Object.keys(presentCategories);
        if (catKeys.length > 1) {
            html += '<div class="cg-cat-pills">';
            html += '<button class="cg-cat-pill active" data-category="all">All <span class="cg-count">' + techs.length + '</span></button>';
            for (var ci = 0; ci < catKeys.length; ci++) {
                var catCount = techsWithCategory.filter(function(t) { return t.category === catKeys[ci]; }).length;
                html += '<button class="cg-cat-pill" data-category="' + catKeys[ci] + '">' + catKeys[ci] + ' <span class="cg-count">' + catCount + '</span></button>';
            }
            html += '</div>';
        }

        // Platform dropdowns
        html += '<div class="cg-techs">';
        for (var ti = 0; ti < techsWithCategory.length; ti++) {
            var tech = techsWithCategory[ti].tech;
            var cat = techsWithCategory[ti].category || '';
            var icon = (typeof VendorLogos !== 'undefined' && VendorLogos.has(tech.key)) ? VendorLogos.get(tech.key) : (this.icons[tech.key] || this.icons.general);
            var name = this.techNames[tech.key] || tech.key.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); });
            var fedrampBadge = (typeof FedRAMPMarketplace !== 'undefined' && FedRAMPMarketplace.loaded) ? FedRAMPMarketplace.renderBadge(tech.key) : '';
            html += '<details class="cg-tech-dropdown" data-tech="' + tech.key + '" data-category="' + cat + '">';
            html += '<summary class="cg-tech-summary"><span class="cg-tech-icon">' + icon + '</span><span class="cg-tech-name">' + name + '</span>' + this.renderBadges(tech.data) + fedrampBadge + '<svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></summary>';
            html += '<div class="cg-tech-body">' + this.renderTechContent(tech) + '</div>';
            html += '</details>';
        }
        html += '<p class="cg-no-results" style="display:none;color:var(--text-muted);font-size:0.78rem;padding:12px 0">No platforms match your search.</p>';
        html += '</div>';

        return html;
    },

    // Get the display category name for a tech key
    getCategoryForTech: function(techKey) {
        for (var cat in this.categories) {
            if (this.categories[cat].indexOf(techKey) !== -1) return cat;
        }
        return 'Other';
    },

    // Get guidance data for an objective
    getGuidanceForObjective: function(objectiveId) {
        const controlId = objectiveId.replace(/\[.*\]$/, '');
        const families = ['AC','AT','AU','CM','IA','IR','MA','MP','PE','PS','RE','RA','CA','SC','SI','SA','SR','PL','PM'];
        const levels = ['L1','L2','L3'];
        const guidanceKeys = [];
        for (const fam of families) {
            for (const lvl of levels) {
                guidanceKeys.push(fam + '.' + lvl + '-' + controlId);
            }
        }

        // For Rev 3 IDs (03.XX.YY format), also try the mapped Rev 2 ID
        const isRev3 = /^0\d\.\d{2}\.\d{2}/.test(controlId);
        if (isRev3) {
            // Map Rev 3 ID back to Rev 2 ID for existing guidance lookup
            var rev2Id = null;
            if (typeof REV3_TO_REV2_MAP !== 'undefined' && REV3_TO_REV2_MAP[controlId]) {
                rev2Id = REV3_TO_REV2_MAP[controlId];
            } else if (typeof REV2_TO_REV3_MIGRATION !== 'undefined') {
                for (var r2 in REV2_TO_REV3_MIGRATION) {
                    if (REV2_TO_REV3_MIGRATION[r2].rev3Id === controlId) {
                        rev2Id = r2;
                        break;
                    }
                }
            }
            if (rev2Id) {
                for (const fam of families) {
                    for (const lvl of levels) {
                        guidanceKeys.push(fam + '.' + lvl + '-' + rev2Id);
                    }
                }
            }
        }

        const dataSources = [
            typeof COMPREHENSIVE_GUIDANCE !== 'undefined' ? COMPREHENSIVE_GUIDANCE : null,
            typeof COMPREHENSIVE_GUIDANCE_PART2 !== 'undefined' ? COMPREHENSIVE_GUIDANCE_PART2 : null,
            typeof COMPREHENSIVE_GUIDANCE_PART3 !== 'undefined' ? COMPREHENSIVE_GUIDANCE_PART3 : null,
            typeof COMPREHENSIVE_GUIDANCE_PART4 !== 'undefined' ? COMPREHENSIVE_GUIDANCE_PART4 : null,
            typeof COMPREHENSIVE_GUIDANCE_PART5 !== 'undefined' ? COMPREHENSIVE_GUIDANCE_PART5 : null,
            typeof COMPREHENSIVE_GUIDANCE_L3 !== 'undefined' ? COMPREHENSIVE_GUIDANCE_L3 : null,
            typeof COMPREHENSIVE_GUIDANCE_L3_EXPANDED !== 'undefined' ? COMPREHENSIVE_GUIDANCE_L3_EXPANDED : null,
            typeof COMPREHENSIVE_GUIDANCE_R3 !== 'undefined' ? COMPREHENSIVE_GUIDANCE_R3 : null,
            typeof COMPREHENSIVE_GUIDANCE_R3_EXPANDED !== 'undefined' ? COMPREHENSIVE_GUIDANCE_R3_EXPANDED : null,
            typeof COMPREHENSIVE_GUIDANCE_R3_NEW !== 'undefined' ? COMPREHENSIVE_GUIDANCE_R3_NEW : null,
            typeof COMPREHENSIVE_GUIDANCE_R3_NEW2 !== 'undefined' ? COMPREHENSIVE_GUIDANCE_R3_NEW2 : null,
            typeof COMPREHENSIVE_GUIDANCE_GRC !== 'undefined' ? COMPREHENSIVE_GUIDANCE_GRC : null,
            typeof COMPREHENSIVE_GUIDANCE_SPA !== 'undefined' ? COMPREHENSIVE_GUIDANCE_SPA : null,
            typeof COMPREHENSIVE_GUIDANCE_SOC !== 'undefined' ? COMPREHENSIVE_GUIDANCE_SOC : null,
            typeof COMPREHENSIVE_GUIDANCE_NUTANIX !== 'undefined' ? COMPREHENSIVE_GUIDANCE_NUTANIX : null,
            typeof COMPREHENSIVE_GUIDANCE_MDM_MAM !== 'undefined' ? COMPREHENSIVE_GUIDANCE_MDM_MAM : null,
            typeof ACCESS_REVIEW_GUIDE !== 'undefined' ? ACCESS_REVIEW_GUIDE : null
        ];

        // Merge guidance from all sources (SPA data supplements existing guidance)
        var merged = null;
        for (const source of dataSources) {
            if (!source || !source.objectives) continue;
            for (const key of guidanceKeys) {
                if (source.objectives[key]) {
                    if (!merged) {
                        merged = Object.assign({}, source.objectives[key]);
                    } else {
                        // Merge section-level keys (cloud, firewalls, iam_pam, siem, etc.)
                        var extra = source.objectives[key];
                        for (var sk in extra) {
                            if (sk === 'objective') continue;
                            if (!merged[sk]) {
                                merged[sk] = extra[sk];
                            } else if (typeof merged[sk] === 'object' && typeof extra[sk] === 'object') {
                                // Merge tech keys within section
                                for (var tk in extra[sk]) {
                                    if (!merged[sk][tk]) merged[sk][tk] = extra[sk][tk];
                                }
                            }
                        }
                    }
                    break; // only one key per source
                }
            }
        }
        return merged;
    },

    // Extract all individual technology entries from a guidance object
    extractTechnologies: function(guidance) {
        const techs = [];
        const sectionMap = {
            cloud: null,
            containers: null,
            saas: null,
            custom_app: null,
            custom_apps: null,
            database: null,
            operating_system: null,
            network: null,
            firewalls: null,
            xdr_edr: null,
            rmm: null,
            vuln_mgmt: null,
            iam_pam: null,
            siem: null,
            soar: null,
            email_security: null,
            dlp: null,
            security_awareness: null,
            mdm_uem: null,
            backup: null,
            grc: null,
            ndr: null,
            cspm: null,
            physical_security: null,
            itsm: null,
            secure_comms: null,
            application: null,
            mobile: null,
            security_tools: null,
            industry_specific: null,
            access_review: null
        };

        for (const section of Object.keys(sectionMap)) {
            if (!guidance[section]) continue;
            const sectionData = guidance[section];
            for (const techKey of Object.keys(sectionData)) {
                const data = sectionData[techKey];
                if (data && typeof data === 'object') {
                    techs.push({ key: techKey, data: data, section: section });
                }
            }
        }

        // Small business as a standalone entry
        if (guidance.small_business && typeof guidance.small_business === 'object') {
            techs.push({ key: 'small_business', data: guidance.small_business, section: 'small_business' });
        }

        // Implementation/general as standalone
        if (guidance.implementation && typeof guidance.implementation === 'object') {
            if (guidance.implementation.general) {
                techs.push({ key: 'general', data: guidance.implementation.general, section: 'implementation' });
            } else if (guidance.implementation.steps) {
                techs.push({ key: 'process', data: guidance.implementation, section: 'implementation' });
            }
        }

        return techs;
    },

    // Render all technology dropdowns
    renderTechDropdowns: function(techs, objectiveId) {
        let html = '<div class="cg-techs">';
        for (const tech of techs) {
            const icon = (typeof VendorLogos !== 'undefined' && VendorLogos.has(tech.key)) ? VendorLogos.get(tech.key) : (this.icons[tech.key] || this.icons.general);
            const name = this.techNames[tech.key] || tech.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const uid = objectiveId + '-' + tech.key;
            const fedrampBadge = (typeof FedRAMPMarketplace !== 'undefined' && FedRAMPMarketplace.loaded) ? FedRAMPMarketplace.renderBadge(tech.key) : '';
            html += '<details class="cg-tech-dropdown" data-tech="' + tech.key + '">';
            html += '<summary class="cg-tech-summary"><span class="cg-tech-icon">' + icon + '</span><span class="cg-tech-name">' + name + '</span>' + this.renderBadges(tech.data) + fedrampBadge + '<svg class="cg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></summary>';
            html += '<div class="cg-tech-body">' + this.renderTechContent(tech) + '</div>';
            html += '</details>';
        }
        html += '</div>';
        return html;
    },

    // Render cost/effort/FedRAMP/SPA badges on the summary line
    renderBadges: function(data) {
        const impl = data.implementation || data;
        let html = '<span class="cg-badges">';
        if (data.fedrampStatus && data.fedrampStatus !== 'N/A') {
            var fc = data.fedrampStatus === 'High' ? 'cg-badge-fedramp-high' : data.fedrampStatus === 'Moderate' ? 'cg-badge-fedramp-mod' : 'cg-badge-fedramp-ip';
            html += '<span class="cg-badge ' + fc + '">FedRAMP ' + data.fedrampStatus + '</span>';
        }
        if (data.assetType) {
            var ac = data.assetType === 'Security Protection Asset' ? 'cg-badge-spa' : data.assetType === 'CUI Asset' ? 'cg-badge-cui' : 'cg-badge-crma';
            var label = data.assetType === 'Security Protection Asset' ? 'SPA' : data.assetType === 'CUI Asset' ? 'CUI Asset' : 'CRMA';
            html += '<span class="cg-badge ' + ac + '">' + label + '</span>';
        }
        if (impl.cost_estimate) {
            html += '<span class="cg-badge cg-badge-cost">' + impl.cost_estimate + '</span>';
        }
        if (impl.effort_hours) {
            html += '<span class="cg-badge cg-badge-effort">' + impl.effort_hours + 'h</span>';
        }
        html += '</span>';
        return html;
    },

    // Render the content inside a technology dropdown
    renderTechContent: function(tech) {
        const data = tech.data;
        const impl = data.implementation || data;
        let html = '';

        // Services / Features tags
        if (data.services && data.services.length) {
            html += '<div class="cg-tags">' + data.services.map(function(s) { return '<span class="cg-tag">' + s + '</span>'; }).join('') + '</div>';
        }
        if (data.features && data.features.length) {
            html += '<div class="cg-tags">' + data.features.map(function(s) { return '<span class="cg-tag">' + s + '</span>'; }).join('') + '</div>';
        }

        // Summary / approach
        if (data.recommended_approach) {
            html += '<p class="cg-approach">' + data.recommended_approach + '</p>';
        }
        if (data.approach) {
            html += '<p class="cg-approach">' + data.approach + '</p>';
        }
        if (data.budget_tier) {
            html += '<p class="cg-approach"><strong>Budget Tier:</strong> ' + data.budget_tier.replace(/_/g, ' ') + '</p>';
        }

        // Implementation steps
        if (impl.steps && impl.steps.length > 0) {
            html += '<div class="cg-steps"><div class="cg-steps-title">Implementation Steps</div><ol>';
            for (var i = 0; i < impl.steps.length; i++) {
                html += '<li>' + impl.steps[i] + '</li>';
            }
            html += '</ol></div>';
        }

        // Tools list (small business / industry)
        if (impl.tools && impl.tools.length > 0) {
            html += '<div class="cg-steps"><div class="cg-steps-title">Recommended Tools</div><ul>';
            for (var t = 0; t < impl.tools.length; t++) {
                var tool = impl.tools[t];
                if (typeof tool === 'string') {
                    html += '<li>' + tool + '</li>';
                } else {
                    html += '<li><strong>' + tool.name + '</strong> &mdash; ' + tool.cost + (tool.purpose ? ' (' + tool.purpose + ')' : '') + '</li>';
                }
            }
            html += '</ul></div>';
        }

        // Code examples
        var codeExamples = [
            ['terraform_example', 'Terraform'],
            ['yaml_example', 'YAML'],
            ['yaml_examples', 'YAML'],
            ['azure_cli_example', 'Azure CLI'],
            ['gcloud_example', 'gcloud CLI'],
            ['powershell_example', 'PowerShell'],
            ['sql_example', 'SQL'],
            ['code_example', 'Code'],
            ['cli_example', 'CLI'],
            ['cli_commands', 'CLI Commands'],
            ['oci_cli_example', 'OCI CLI'],
            ['panos_cli_example', 'PAN-OS CLI'],
            ['nutanix_cli_example', 'Nutanix CLI'],
            ['api_example', 'API Example'],
            ['script_example', 'Script'],
            ['docker_example', 'Docker'],
            ['daemon_config', 'Daemon Config'],
            ['kubectl_commands', 'kubectl Commands'],
            ['oc_commands', 'OpenShift CLI'],
            ['scc_example', 'SCC Example'],
            ['apex_example', 'Apex'],
            ['javascript_example', 'JavaScript'],
            ['filebeat_yml', 'Filebeat Config'],
            ['inputs_conf', 'Splunk inputs.conf'],
            ['splunk_inputs_conf', 'Splunk inputs.conf'],
            ['indexes_conf', 'Splunk indexes.conf'],
            ['spl_query', 'SPL Query'],
            ['kql_query', 'KQL Query'],
            ['yara_l_rule', 'YARA-L Rule'],
            ['policy_example', 'Policy'],
            ['custom_role_yaml', 'Custom Role YAML'],
            ['role_example', 'Role YAML'],
            ['conditional_access_example', 'Conditional Access'],
            ['context_aware_access_example', 'Context-Aware Access'],
            ['audit_policy_yaml', 'Audit Policy YAML'],
            ['kube_apiserver_flags', 'API Server Flags'],
            ['banner_template', 'Banner Template'],
            ['ilm_policy', 'ILM Policy']
        ];
        for (var c = 0; c < codeExamples.length; c++) {
            var key = codeExamples[c][0], label = codeExamples[c][1];
            var val = impl[key];
            if (!val) continue;
            if (Array.isArray(val)) val = val.join('\n');
            html += '<details class="cg-code"><summary><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> ' + label + '</summary><pre><code>' + this.escapeHtml(val) + '</code></pre></details>';
        }

        // Verification, Evidence Artifacts, and Pitfalls are consolidated
        // in the Evidence & Policy tab — not repeated per-platform dropdown.

        // Cost & Effort (detailed, inside body)
        if (impl.cost_estimate || data.total_cost_estimate || data.cost_estimate) {
            html += '<div class="cg-meta-row"><span class="cg-meta cg-meta-cost">Cost: ' + (impl.cost_estimate || data.total_cost_estimate || data.cost_estimate) + '</span></div>';
        }

        return html;
    },

    // Format verification/evidence text: detect CLI commands and wrap in <code>
    formatVerifyText: function(text) {
        if (!text) return '';
        // Pattern: "Description: command --flags here" or "Description: path/to/thing"
        // Split on the LAST colon that precedes something that looks like a command
        var cmdPatterns = /:\s+((?:aws |az |gcloud |kubectl |docker |oc |git |curl |wget |pip |npm |node |python |terraform |ansible |helm |vault |ssh |scp |openssl |certutil |gpg |chmod |chown |systemctl |journalctl |grep |cat |ls |find |sudo |nmap |nikto |nessus|show |set |configure |test |get-|new-|remove-|enable-|disable-|add-|import-|export-|invoke-|connect-|disconnect-|start-|stop-|restart-|verify |check |run |confirm |review ).+)$/i;
        var match = text.match(cmdPatterns);
        if (match) {
            var cmdStart = text.lastIndexOf(match[1]);
            var desc = text.substring(0, cmdStart).replace(/:\s*$/, '');
            var cmd = match[1].trim();
            return desc + ': <code class="cg-inline-cmd">' + this.escapeHtml(cmd) + '</code>';
        }

        // Detect inline code-like fragments: paths, flags, variable references
        // Wrap things that look like: file.ext, --flag, $VAR, /path/to, key=value commands
        var inlineCode = text.replace(
            /(?:^|\s)((?:\/[\w.\-]+){2,}[\w.\-]*|(?:[\w.\-]+\.(?:json|yaml|yml|xml|conf|cfg|log|txt|ps1|sh|py|tf|hcl|csv|pem|crt|key))\b|--[\w][\w\-]+=?[\w.\-/]*|\$\{?[\w]+\}?|(?:[\w\-]+:\/\/[\w.\-/:@]+))/g,
            function(full, code) {
                var leading = full.charAt(0) === ' ' || full.charAt(0) === '\t' ? full.charAt(0) : '';
                return leading + '<code class="cg-inline-cmd">' + code + '</code>';
            }
        );

        return inlineCode;
    },

    // Render MDM/MAM mobile configuration profiles section
    renderMobileProfiles: function(profiles) {
        var self = this;
        var html = '<div class="cg-unified-section cg-mobile-profiles">';
        html += '<div class="cg-unified-section-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Mobile Device Profiles (MDM / MAM)</div>';
        if (profiles.description) {
            html += '<p class="cg-mobile-desc">' + profiles.description + '</p>';
        }

        // MDM Corporate section
        if (profiles.mdm_corporate) {
            html += '<details class="cg-mobile-detail" open>';
            html += '<summary class="cg-mobile-summary"><span class="cg-badge cg-badge-mdm">MDM</span> Corporate Device Policy</summary>';
            if (profiles.mdm_corporate.description) {
                html += '<p class="cg-mobile-subdesc">' + profiles.mdm_corporate.description + '</p>';
            }
            html += self._renderMobilePlatforms(profiles.mdm_corporate.platforms);
            html += '</details>';
        }

        // MAM BYOD section
        if (profiles.mam_byod) {
            html += '<details class="cg-mobile-detail">';
            html += '<summary class="cg-mobile-summary"><span class="cg-badge cg-badge-mam">MAM</span> BYOD App Protection</summary>';
            if (profiles.mam_byod.description) {
                html += '<p class="cg-mobile-subdesc">' + profiles.mam_byod.description + '</p>';
            }
            html += self._renderMobilePlatforms(profiles.mam_byod.platforms);
            html += '</details>';
        }

        html += '</div>';
        return html;
    },

    // Render platform-specific mobile profile cards
    _renderMobilePlatforms: function(platforms) {
        if (!platforms) return '';
        var self = this;
        var platformOrder = ['ios', 'android', 'windows', 'linux'];
        var platformLabels = { ios: 'iOS / iPadOS', android: 'Android', windows: 'Windows', linux: 'Linux' };
        var platformIcons = {
            ios: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.81-1.31.05-2.3-1.32-3.14-2.53C4.25 16.76 3 12.55 4.78 9.75a4.69 4.69 0 013.95-2.4c1.3-.03 2.52.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" fill="currentColor"/></svg>',
            android: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.98 5.98 0 006 7h12c0-2.21-1.2-4.15-2.97-5.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" fill="#3DDC84"/></svg>',
            windows: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 4.5l8.5-1.2v8.2H2V4.5z" fill="#00ADEF"/><path d="M11.5 3.2L22 1.5v10H11.5V3.2z" fill="#00ADEF"/><path d="M2 12.5h8.5v8.2L2 19.5v-7z" fill="#00ADEF"/><path d="M11.5 12.5H22v10l-10.5-1.7v-8.3z" fill="#00ADEF"/></svg>',
            linux: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C9.5 2 8 4.5 8 7.5c0 1.5.5 3 1 4.5-.5 1-1.5 2-3 3-.5.5-1 1.5-.5 2.5s1.5 1.5 2.5 1.5h8c1 0 2-.5 2.5-1.5s0-2-.5-2.5c-1.5-1-2.5-2-3-3 .5-1.5 1-3 1-4.5C16 4.5 14.5 2 12 2z" fill="#333"/></svg>'
        };
        var html = '<div class="cg-mobile-platforms">';
        for (var i = 0; i < platformOrder.length; i++) {
            var pk = platformOrder[i];
            var pdata = platforms[pk];
            if (!pdata) continue;
            var label = platformLabels[pk] || pk;
            var icon = platformIcons[pk] || '';
            html += '<details class="cg-mobile-platform">';
            html += '<summary class="cg-mobile-platform-summary">' + icon + ' <strong>' + label + '</strong>';
            if (pdata.profile_name) html += ' <code class="cg-mobile-profile-name">' + pdata.profile_name + '</code>';
            if (pdata.cis_benchmark) html += ' <span class="cg-badge cg-badge-cis">CIS</span>';
            html += '</summary>';
            html += '<div class="cg-mobile-platform-body">';

            if (pdata.cis_benchmark) {
                html += '<div class="cg-mobile-cis"><strong>CIS Benchmark:</strong> ' + pdata.cis_benchmark + '</div>';
            }
            if (pdata.cmmc_alignment) {
                html += '<div class="cg-mobile-cmmc"><strong>CMMC Alignment:</strong> ' + pdata.cmmc_alignment + '</div>';
            }

            // Render JSON payload
            if (pdata.payload) {
                html += '<details class="cg-code" open><summary><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Configuration Profile JSON</summary>';
                html += '<pre><code>' + self.escapeHtml(JSON.stringify(pdata.payload, null, 2)) + '</code></pre></details>';
            }

            html += '</div></details>';
        }
        html += '</div>';
        return html;
    },

    // Escape HTML to prevent XSS
    escapeHtml: function(text) {
        if (!text) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ComprehensiveGuidanceUI = ComprehensiveGuidanceUI;
}

console.log('[ComprehensiveGuidanceUI] Module loaded');
