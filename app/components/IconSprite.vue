<script setup lang="ts">
// Rendered once in app.vue. Every <AppIcon name="..."> references a symbol
// here via <use>, exactly like the sprite in the original Planos HTML file.
</script>

<template>
  <svg style="display: none">
    <symbol id="i-menu" viewBox="0 0 24 24">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </symbol>
    <symbol id="i-sidebar" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <line x1="9.5" y1="4" x2="9.5" y2="20" />
    </symbol>
    <symbol id="i-close" viewBox="0 0 24 24">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </symbol>
    <symbol id="i-search" viewBox="0 0 24 24">
      <circle cx="10" cy="10" r="6" />
      <line x1="15" y1="15" x2="20" y2="20" />
    </symbol>
    <symbol id="i-bell" viewBox="0 0 24 24">
      <path d="M7 9a5 5 0 0 1 10 0v4l2 3H5l2-3z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </symbol>
    <symbol id="i-home" viewBox="0 0 24 24">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h5v-5h2v5h5v-9" />
    </symbol>
    <symbol id="i-box" viewBox="0 0 24 24">
      <path d="M4 7l8-4 8 4-8 4-8-4z" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </symbol>
    <symbol id="i-users" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3" />
      <path d="M4 20c0-3 2.3-5 5-5s5 2 5 5" />
      <circle cx="17" cy="9.5" r="2.4" />
      <path d="M15 20c.2-2 1.4-3.4 3-3.9" />
    </symbol>
    <symbol id="i-chart" viewBox="0 0 24 24">
      <path d="M3 3v18h18" />
      <path d="m7 14 3-3 3 3 4-5" />
    </symbol>
    <symbol id="i-gear" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.2" />
      <line x1="12" y1="3" x2="12" y2="6.2" />
      <line x1="12" y1="17.8" x2="12" y2="21" />
      <line x1="3" y1="12" x2="6.2" y2="12" />
      <line x1="17.8" y1="12" x2="21" y2="12" />
      <line x1="5.6" y1="5.6" x2="7.8" y2="7.8" />
      <line x1="16.2" y1="16.2" x2="18.4" y2="18.4" />
      <line x1="5.6" y1="18.4" x2="7.8" y2="16.2" />
      <line x1="16.2" y1="7.8" x2="18.4" y2="5.6" />
    </symbol>
    <symbol id="i-chevdown" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></symbol>
    <symbol id="i-chevright" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><polyline points="5 13 10 18 19 7" /></symbol>
    <symbol id="i-alert" viewBox="0 0 24 24">
      <path d="M12 4l9 16H3z" />
      <line x1="12" y1="10.5" x2="12" y2="14" />
      <circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none" />
    </symbol>
    <symbol id="i-info" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="8" r=".6" fill="currentColor" stroke="none" />
    </symbol>
    <symbol id="i-arrowright" viewBox="0 0 24 24">
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </symbol>
    <symbol id="i-sort" viewBox="0 0 24 24">
      <polyline points="8 10 12 6 16 10" />
      <polyline points="8 14 12 18 16 14" />
    </symbol>
    <symbol id="i-edit" viewBox="0 0 24 24"><path d="M4 20l1-4 11-11 3 3-11 11-4 1z" /></symbol>
    <symbol id="i-trash" viewBox="0 0 24 24">
      <path d="M5 7h14" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 13h8l1-13" />
    </symbol>
    <symbol id="i-dots" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </symbol>
    <symbol id="i-calendar" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </symbol>
    <symbol id="i-star" viewBox="0 0 24 24">
      <path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
    </symbol>
    <symbol id="i-droplet" viewBox="0 0 24 24">
      <path d="M12 3s7 8 7 12.5A7 7 0 0 1 5 15.5C5 11 12 3 12 3z" />
    </symbol>
    <symbol id="i-tag" viewBox="0 0 24 24">
      <path d="M12 3h6a2 2 0 0 1 2 2v6l-9 9-8-8 9-9z" />
      <circle cx="16" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </symbol>
    <symbol id="i-filter" viewBox="0 0 24 24">
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </symbol>
    <symbol id="i-download" viewBox="0 0 24 24">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </symbol>
    <symbol id="i-segmented" viewBox="0 0 24 24">
      <rect x="3" y="8" width="5" height="8" rx="1" />
      <rect x="9.5" y="8" width="5" height="8" rx="1" />
      <rect x="16" y="8" width="5" height="8" rx="1" />
    </symbol>
    <symbol id="i-logout" viewBox="0 0 24 24">
      <path d="M9 4H5v16h4" />
      <line x1="21" y1="12" x2="10" y2="12" />
      <polyline points="17 8 21 12 17 16" />
    </symbol>
    <symbol id="i-upload" viewBox="0 0 24 24">
      <path d="M12 15V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 20h16" />
    </symbol>
    <symbol id="i-file" viewBox="0 0 24 24">
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v4h4" />
    </symbol>
    <symbol id="i-trendup" viewBox="0 0 24 24">
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </symbol>
    <symbol id="i-trenddown" viewBox="0 0 24 24">
      <polyline points="3 7 9 13 13 9 21 17" />
      <polyline points="15 17 21 17 21 11" />
    </symbol>
    <symbol id="i-coin" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path
        d="M14.6 9.3A2.7 2.7 0 0 0 12 8c-1.5 0-2.7.8-2.7 2s1.2 1.8 2.7 2 2.7.9 2.7 2-1.2 2-2.7 2a2.7 2.7 0 0 1-2.6-1.3"
      />
    </symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
    <symbol id="i-eye" viewBox="0 0 24 24">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </symbol>
    <symbol id="i-chevron-right" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></symbol>
    <symbol id="i-chevron-down" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></symbol>
    <symbol id="i-settings" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.2" />
      <line x1="12" y1="3" x2="12" y2="6.2" />
      <line x1="12" y1="17.8" x2="12" y2="21" />
      <line x1="3" y1="12" x2="6.2" y2="12" />
      <line x1="17.8" y1="12" x2="21" y2="12" />
      <line x1="5.6" y1="5.6" x2="7.8" y2="7.8" />
      <line x1="16.2" y1="16.2" x2="18.4" y2="18.4" />
      <line x1="5.6" y1="18.4" x2="7.8" y2="16.2" />
      <line x1="16.2" y1="7.8" x2="18.4" y2="5.6" />
    </symbol>
    <symbol id="i-user" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </symbol>
    <symbol id="i-warning" viewBox="0 0 24 24">
      <path d="M12 4l9 16H3z" />
      <line x1="12" y1="10.5" x2="12" y2="14" />
      <circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none" />
    </symbol>
    <symbol id="i-danger" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <circle cx="12" cy="16.5" r=".6" fill="currentColor" stroke="none" />
    </symbol>
    <symbol id="i-minus" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </symbol>
    <symbol id="i-arrow-left" viewBox="0 0 24 24">
      <line x1="20" y1="12" x2="4" y2="12" />
      <polyline points="10 18 4 12 10 6" />
    </symbol>
    <symbol id="i-arrow-right" viewBox="0 0 24 24">
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </symbol>
    <symbol id="i-external" viewBox="0 0 24 24">
      <path d="M18 13v6H5V6h6" />
      <polyline points="15 4 20 4 20 9" />
      <line x1="10" y1="14" x2="20" y2="4" />
    </symbol>
    <symbol id="i-copy" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </symbol>
    <symbol id="i-sun" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="3" x2="12" y2="5.5" />
      <line x1="12" y1="18.5" x2="12" y2="21" />
      <line x1="3" y1="12" x2="5.5" y2="12" />
      <line x1="18.5" y1="12" x2="21" y2="12" />
      <line x1="5.6" y1="5.6" x2="7.4" y2="7.4" />
      <line x1="16.6" y1="16.6" x2="18.4" y2="18.4" />
      <line x1="5.6" y1="18.4" x2="7.4" y2="16.6" />
      <line x1="16.6" y1="7.4" x2="18.4" y2="5.6" />
    </symbol>
    <symbol id="i-moon" viewBox="0 0 24 24">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
    </symbol>
  </svg>
</template>
