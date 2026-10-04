/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ USERSCRIPT UI COMPONENTS                                                     │
└──────────────────────────────────────────────────────────────────────────────┘
*/

/*
 * Dependency-free DOM components for userscripts in this repository.
 *
 * Pair with styles/base.css. The stylesheet owns presentation; this library owns
 * reusable markup, icons and small generic behaviors. Site-specific selectors,
 * application logic and target-specific behavior stay inside individual scripts.
 */

(function(global) {

  'use strict';


  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ CONSTANTS AND CONFIGURATION                                                  │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const NAMESPACE =
    'UserscriptUI';

  const API_VERSION =
    '0.2.3';

  const LOW_LEVEL_APIS =
    Object.freeze([
      'appendChildren',
      'element',
      'icon',
      'iconSlot',
      'focusableElements',
      'focusInitial',
      'trapFocus',
      'formatBytes',
      'fileMatchesAccept',
      'textNodesInRange',
      'positionFloating'
    ]);

  const EXPERIMENTAL_APIS =
    Object.freeze([
      'assetCarousel',
      'openAssetCarousel',
      'attachAssetHoverTray',
      'annotateTextRange',
      'clearTextAnnotations',
      'createTextQuoteAnchor',
      'resolveTextQuoteAnchor',
      'textSelectionToolbar',
      'attachTextSelectionToolbar',
      'annotationModeControl',
      'attachPageAnnotationMode',
      'draggableWindow',
      'openDraggableWindow',
      'openNotepad',
      'uploadQueue',
      'sourceInspector'
    ]);

  const DEPRECATED_APIS =
    Object.freeze([]);

  const ICONS = Object.freeze({

    DOWNLOAD:
      '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',

    UPLOAD:
      '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/>',

    SCREENSHOT:
      '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 6l1.5-2h5L16 6"/><circle cx="12" cy="12.5" r="3"/>',

    CROP:
      '<path d="M6 2v16a2 2 0 0 0 2 2h14"/><path d="M2 6h14a2 2 0 0 1 2 2v14"/>',

    CROSSHAIR:
      '<circle cx="12" cy="12" r="7"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/>',

    EYE_OFF:
      '<path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-2.1 3.1"/><path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 3.8-.8"/>',

    LOCK:
      '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',

    UNLOCK:
      '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.5-2"/>',

    TRASH:
      '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M7 7l1 14h8l1-14"/><path d="M10 11v6"/><path d="M14 11v6"/>',

    RESTORE:
      '<path d="M4 4v6h6"/><path d="M5.5 15a8 8 0 1 0 1-8.5L4 10"/>',

    EDIT:
      '<path d="M4 20h4l11-11-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',

    CODE:
      '<path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/>',

    DATABASE:
      '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',

    DOCUMENT:
      '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/><path d="M9 12h6"/><path d="M9 16h6"/>',

    IMAGE:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 2-2 5 5"/>',

    MOVE:
      '<path d="M12 2v20"/><path d="m8 6 4-4 4 4"/><path d="m8 18 4 4 4-4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/><path d="m18 8 4 4-4 4"/>',

    PIN:
      '<path d="m9 3 6 6"/><path d="m7 9 8 8"/><path d="M8 4h7l2 2v7l-4 1-5-5z"/><path d="m10 14-6 6"/>',

    UNPIN:
      '<path d="m3 3 18 18"/><path d="M8 4h7l2 2v7l-2 .5"/><path d="m10 14-6 6"/>',

    HISTORY:
      '<path d="M4 4v6h6"/><path d="M5 15a8 8 0 1 0 1-8"/><path d="M12 8v5l3 2"/>',

    DIFF:
      '<path d="M7 4v16"/><path d="M4 7h6"/><path d="M4 17h6"/><path d="M14 7h6"/><path d="M17 4v6"/><path d="M14 17h6"/>',

    INFO:
      '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7h.01"/>',

    PLUS:
      '<path d="M12 5v14"/><path d="M5 12h14"/>',

    MINUS:
      '<path d="M5 12h14"/>',

    CHEVRON_LEFT:
      '<path d="m15 18-6-6 6-6"/>',

    CHEVRON_UP:
      '<path d="m6 15 6-6 6 6"/>',

    CHEVRON_DOWN:
      '<path d="m6 9 6 6 6-6"/>',

    MORE:
      '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',

    LINK:
      '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.2-1.2"/>',

    BRACES:
      '<path d="M9 4H7a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h2"/><path d="M15 4h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-2"/>',



    EXTERNAL:
      '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',

    COPY:
      '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',

    SEARCH:
      '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',

    REFRESH:
      '<path d="M20 6v6h-6"/><path d="M4 18v-6h6"/><path d="M18.5 9A7 7 0 0 0 6 6.5L4 8"/><path d="M5.5 15A7 7 0 0 0 18 17.5L20 16"/>',

    CLOSE:
      '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',

    PLAY:
      '<path d="m8 5 11 7-11 7z"/>',

    PAUSE:
      '<path d="M9 5v14"/><path d="M15 5v14"/>',

    VOLUME:
      '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15 9a4 4 0 0 1 0 6"/><path d="M17.5 6.5a8 8 0 0 1 0 11"/>',

    MUTE:
      '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6"/><path d="m21 9-5 6"/>',

    LAYERS:
      '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',

    FULLSCREEN:
      '<path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M16 21h5v-5"/>',

    TERMINAL:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3"/><path d="M13 15h4"/>',

    HOME:
      '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',

    SETTINGS:
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8a1.7 1.7 0 0 0-.34-1.88L4.2 6.06 7.03 3.23l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 16 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.2.36.5.7.9 1 .33.23.71.37 1.1.4H21v4h-.09A1.7 1.7 0 0 0 19.4 15z"/>',

    ACTIVITY:
      '<path d="M3 12h4l2-6 4 12 2-6h6"/>',

    REQUESTS:
      '<path d="M7 7h11l-3-3"/><path d="m18 7-3 3"/><path d="M17 17H6l3 3"/><path d="m6 17 3-3"/>',

    MEDIA:
      '<path d="m9 7 8 5-8 5z"/>',

    LOGS:
      '<path d="M5 6h14"/><path d="M5 12h14"/><path d="M5 18h14"/>',

    TARGET:
      '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',

    SHIELD:
      '<path d="M12 3 5 6v5c0 4.4 2.8 8.3 7 10 4.2-1.7 7-5.6 7-10V6z"/>',

    FILTER:
      '<path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/>',

    EYE:
      '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',

    CHEVRON_RIGHT:
      '<path d="m9 18 6-6-6-6"/>',

    ALERT:
      '<path d="M12 3 2 21h20z"/><path d="M12 9v5"/><path d="M12 18h.01"/>',


    CHECK:
      '<path d="m5 12 4 4L19 6"/>',

    FOLDER:
      '<path d="M3 6h7l2 2h9v11H3z"/>',

    FILE:
      '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/>',

    GRIP:
      '<circle cx="9" cy="7" r="1"/><circle cx="15" cy="7" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="17" r="1"/><circle cx="15" cy="17" r="1"/>',

    UNDERLINE:
      '<path d="M7 4v7a5 5 0 0 0 10 0V4"/><path d="M5 21h14"/>',

    HIGHLIGHT:
      '<path d="m6 16 8-8 4 4-8 8H6z"/><path d="m13 9 4 4"/><path d="M3 21h18"/>',

  });


  /*
   * Semantic action vocabulary.
   *
   * Actions deliberately reuse a conservative icon set. Concepts such as XPath,
   * selectors, z-index and datasets keep their text labels instead of inventing
   * obscure glyphs.
   */
  const ACTIONS = Object.freeze({

    COPY:
      Object.freeze({
        group: 'Basic',
        icon: 'COPY',
        label: 'Copy'
      }),

    OPEN:
      Object.freeze({
        group: 'Basic',
        icon: 'EXTERNAL',
        label: 'Open'
      }),

    DOWNLOAD:
      Object.freeze({
        group: 'Basic',
        icon: 'DOWNLOAD',
        label: 'Download'
      }),

    UPLOAD:
      Object.freeze({
        group: 'Basic',
        icon: 'UPLOAD',
        label: 'Upload'
      }),

    REFRESH:
      Object.freeze({
        group: 'Basic',
        icon: 'REFRESH',
        label: 'Refresh'
      }),

    CLOSE:
      Object.freeze({
        group: 'Basic',
        icon: 'CLOSE',
        label: 'Close'
      }),

    MORE:
      Object.freeze({
        group: 'Basic',
        icon: 'MORE',
        label: 'More'
      }),

    SETTINGS:
      Object.freeze({
        group: 'Basic',
        icon: 'SETTINGS',
        label: 'Settings'
      }),

    INFO:
      Object.freeze({
        group: 'Basic',
        icon: 'INFO',
        label: 'Info'
      }),

    ADD:
      Object.freeze({
        group: 'Basic',
        icon: 'PLUS',
        label: 'Add'
      }),

    MINUS:
      Object.freeze({
        group: 'Basic',
        icon: 'MINUS',
        label: 'Decrease'
      }),

    CHECK:
      Object.freeze({
        group: 'Basic',
        icon: 'CHECK',
        label: 'Select all'
      }),

    NOTEPAD:
      Object.freeze({
        group: 'Basic',
        icon: 'DOCUMENT',
        label: 'Notepad'
      }),

    UNDERLINE_TEXT:
      Object.freeze({
        group: 'Text',
        icon: 'UNDERLINE',
        label: 'Underline'
      }),

    HIGHLIGHT_TEXT:
      Object.freeze({
        group: 'Text',
        icon: 'HIGHLIGHT',
        label: 'Highlight'
      }),

    ADD_NOTE:
      Object.freeze({
        group: 'Text',
        icon: 'DOCUMENT',
        label: 'Add note'
      }),

    CLEAR_ANNOTATION:
      Object.freeze({
        group: 'Text',
        icon: 'RESTORE',
        label: 'Clear annotation'
      }),

    BACK:
      Object.freeze({
        group: 'Navigation',
        icon: 'CHEVRON_LEFT',
        label: 'Back'
      }),

    FORWARD:
      Object.freeze({
        group: 'Navigation',
        icon: 'CHEVRON_RIGHT',
        label: 'Forward'
      }),

    UP:
      Object.freeze({
        group: 'Navigation',
        icon: 'CHEVRON_UP',
        label: 'Up'
      }),

    DOWN:
      Object.freeze({
        group: 'Navigation',
        icon: 'CHEVRON_DOWN',
        label: 'Down'
      }),

    OPEN_LINK:
      Object.freeze({
        group: 'Links',
        icon: 'EXTERNAL',
        label: 'Open link'
      }),

    COPY_LINK:
      Object.freeze({
        group: 'Links',
        icon: 'COPY',
        label: 'Copy link'
      }),

    INSPECT_LINK:
      Object.freeze({
        group: 'Links',
        icon: 'LINK',
        label: 'Inspect link'
      }),

    CAPTURE_VIEWPORT:
      Object.freeze({
        group: 'Capture',
        icon: 'SCREENSHOT',
        label: 'Screenshot page'
      }),

    CAPTURE_ELEMENT:
      Object.freeze({
        group: 'Capture',
        icon: 'CROSSHAIR',
        label: 'Screenshot element'
      }),

    CAPTURE_REGION:
      Object.freeze({
        group: 'Capture',
        icon: 'CROP',
        label: 'Screenshot region'
      }),

    SAVE_IMAGE:
      Object.freeze({
        group: 'Images',
        icon: 'DOWNLOAD',
        label: 'Save image'
      }),

    OPEN_IMAGE:
      Object.freeze({
        group: 'Images',
        icon: 'EXTERNAL',
        label: 'Open image'
      }),

    COPY_IMAGE_URL:
      Object.freeze({
        group: 'Images',
        icon: 'COPY',
        label: 'Copy image URL'
      }),

    INSPECT_IMAGE:
      Object.freeze({
        group: 'Images',
        icon: 'IMAGE',
        label: 'Inspect image'
      }),

    PICK_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'CROSSHAIR',
        label: 'Pick element'
      }),

    INSPECT_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'SEARCH',
        label: 'Inspect element'
      }),

    COPY_SELECTOR:
      Object.freeze({
        group: 'DOM',
        icon: 'TARGET',
        label: 'Copy selector'
      }),

    COPY_XPATH:
      Object.freeze({
        group: 'DOM',
        icon: 'CODE',
        label: 'Copy XPath'
      }),

    COPY_HTML:
      Object.freeze({
        group: 'DOM',
        icon: 'CODE',
        label: 'Copy HTML'
      }),

    EDIT_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'EDIT',
        label: 'Edit element'
      }),

    MOVE_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'MOVE',
        label: 'Move element'
      }),

    SHOW_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'EYE',
        label: 'Show element'
      }),

    HIDE_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'EYE_OFF',
        label: 'Hide element'
      }),

    REMOVE_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'TRASH',
        label: 'Remove element'
      }),

    RESTORE_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'RESTORE',
        label: 'Restore element'
      }),

    LOCK_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'LOCK',
        label: 'Lock'
      }),

    UNLOCK_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'UNLOCK',
        label: 'Unlock'
      }),

    PIN_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'PIN',
        label: 'Pin'
      }),

    UNPIN_ELEMENT:
      Object.freeze({
        group: 'DOM',
        icon: 'UNPIN',
        label: 'Unpin'
      }),

    INSPECT_LAYERS:
      Object.freeze({
        group: 'DOM',
        icon: 'LAYERS',
        label: 'Inspect layers'
      }),

    INSPECT_STYLES:
      Object.freeze({
        group: 'CSS',
        icon: 'CODE',
        label: 'Inspect styles'
      }),

    EDIT_STYLES:
      Object.freeze({
        group: 'CSS',
        icon: 'EDIT',
        label: 'Edit styles'
      }),

    RESET_STYLES:
      Object.freeze({
        group: 'CSS',
        icon: 'RESTORE',
        label: 'Reset styles'
      }),

    SHOW_VISIBILITY:
      Object.freeze({
        group: 'CSS',
        icon: 'EYE',
        label: 'Force visible'
      }),

    REMOVE_FILTER:
      Object.freeze({
        group: 'CSS',
        icon: 'EYE',
        label: 'Remove filter'
      }),

    UNLOCK_SCROLL:
      Object.freeze({
        group: 'CSS',
        icon: 'UNLOCK',
        label: 'Unlock scroll'
      }),

    PLAY:
      Object.freeze({
        group: 'Media',
        icon: 'PLAY',
        label: 'Play'
      }),

    PAUSE:
      Object.freeze({
        group: 'Media',
        icon: 'PAUSE',
        label: 'Pause'
      }),

    VOLUME:
      Object.freeze({
        group: 'Media',
        icon: 'VOLUME',
        label: 'Volume'
      }),

    MUTE:
      Object.freeze({
        group: 'Media',
        icon: 'MUTE',
        label: 'Mute'
      }),

    FULLSCREEN:
      Object.freeze({
        group: 'Media',
        icon: 'FULLSCREEN',
        label: 'Fullscreen'
      }),

    INSPECT_MEDIA:
      Object.freeze({
        group: 'Media',
        icon: 'MEDIA',
        label: 'Inspect media'
      }),

    MEDIA_VARIANTS:
      Object.freeze({
        group: 'Media',
        icon: 'LAYERS',
        label: 'Variants'
      }),

    SAVE_MEDIA:
      Object.freeze({
        group: 'Media',
        icon: 'DOWNLOAD',
        label: 'Save media'
      }),

    COPY_MEDIA_URL:
      Object.freeze({
        group: 'Media',
        icon: 'COPY',
        label: 'Copy media URL'
      }),

    REQUESTS:
      Object.freeze({
        group: 'Network',
        icon: 'REQUESTS',
        label: 'Requests'
      }),

    FILTER_REQUESTS:
      Object.freeze({
        group: 'Network',
        icon: 'FILTER',
        label: 'Filter requests'
      }),

    PAUSE_CAPTURE:
      Object.freeze({
        group: 'Network',
        icon: 'PAUSE',
        label: 'Pause capture'
      }),

    RESUME_CAPTURE:
      Object.freeze({
        group: 'Network',
        icon: 'PLAY',
        label: 'Resume capture'
      }),

    REFRESH_REQUESTS:
      Object.freeze({
        group: 'Network',
        icon: 'REFRESH',
        label: 'Refresh requests'
      }),

    REQUEST_HISTORY:
      Object.freeze({
        group: 'Network',
        icon: 'HISTORY',
        label: 'Request history'
      }),

    DIFF_REQUESTS:
      Object.freeze({
        group: 'Network',
        icon: 'DIFF',
        label: 'Diff requests'
      }),

    STORAGE:
      Object.freeze({
        group: 'Data',
        icon: 'DATABASE',
        label: 'Storage'
      }),

    DOCUMENT:
      Object.freeze({
        group: 'Data',
        icon: 'DOCUMENT',
        label: 'Document'
      }),

    STRUCTURED_DATA:
      Object.freeze({
        group: 'Data',
        icon: 'BRACES',
        label: 'Structured data'
      }),

    SEARCH_DATA:
      Object.freeze({
        group: 'Data',
        icon: 'SEARCH',
        label: 'Search data'
      }),

    ACTIVITY:
      Object.freeze({
        group: 'Diagnostics',
        icon: 'ACTIVITY',
        label: 'Activity'
      }),

    HISTORY:
      Object.freeze({
        group: 'Diagnostics',
        icon: 'HISTORY',
        label: 'History'
      }),

    DIFF:
      Object.freeze({
        group: 'Diagnostics',
        icon: 'DIFF',
        label: 'Diff'
      }),

    ALERT:
      Object.freeze({
        group: 'Diagnostics',
        icon: 'ALERT',
        label: 'Alert'
      }),

    SHIELD:
      Object.freeze({
        group: 'Diagnostics',
        icon: 'SHIELD',
        label: 'Status'
      }),

    COPY_COMMAND:
      Object.freeze({
        group: 'Developer',
        icon: 'TERMINAL',
        label: 'Copy command'
      }),

    VIEW_CODE:
      Object.freeze({
        group: 'Developer',
        icon: 'CODE',
        label: 'View code'
      }),

    VIEW_LOGS:
      Object.freeze({
        group: 'Developer',
        icon: 'LOGS',
        label: 'Logs'
      })

  });

  const STATUS_CLASSES = Object.freeze({

    INFO: 'us-status-info',
    OK: 'us-status-ok',
    WARN: 'us-status-warn',
    ERROR: 'us-status-error'

  });

  const TONE_CLASSES = Object.freeze({

    NEUTRAL: 'us-tone-neutral',
    PAGE: 'us-tone-page',
    INPUT: 'us-tone-input',
    ACCENT: 'us-tone-accent',

    TRACE: 'us-tone-trace',
    DEBUG: 'us-tone-debug',
    INFO: 'us-tone-info',
    SUCCESS: 'us-tone-success',
    WARNING: 'us-tone-warning',
    WARN: 'us-tone-warning',
    ERROR: 'us-tone-error',
    DANGER: 'us-tone-error',
    CRITICAL: 'us-tone-critical'

  });

  const BADGE_CLASSES = Object.freeze({

    ACCENT: 'us-badge-accent',
    INFO: 'us-badge-info',
    SUCCESS: 'us-badge-success',
    WARNING: 'us-badge-warning',
    DANGER: 'us-badge-danger'

  });

  const CALLOUT_CLASSES = Object.freeze({

    INFO: 'us-callout-info',
    SUCCESS: 'us-callout-success',
    WARNING: 'us-callout-warning',
    DANGER: 'us-callout-danger'

  });
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ DOM PRIMITIVES                                                               │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function appendChildren(parent, children) {

    for (const child of children.flat(Infinity)) {

      if (child == null || child === false) {
        continue;
      }

      if (child instanceof Node) {

        parent.appendChild(child);
        continue;

      }

      parent.appendChild(
        document.createTextNode(
          String(child)
        )
      );

    }

    return parent;

  }

  function element(tagName, options = {}, ...children) {

    const node =
      document.createElement(tagName);

    if (options.className) {
      node.className = options.className;
    }

    if (options.text != null) {
      node.textContent = String(options.text);
    }

    if (options.title) {
      node.title = options.title;
    }

    if (options.id) {
      node.id = options.id;
    }

    if (options.attrs) {

      for (const [name, value] of Object.entries(options.attrs)) {

        if (value == null || value === false) {
          continue;
        }

        node.setAttribute(
          name,
          value === true
            ? ''
            : String(value)
        );

      }

    }

    if (options.dataset) {

      for (const [name, value] of Object.entries(options.dataset)) {

        if (value != null) {
          node.dataset[name] = String(value);
        }

      }

    }

    if (options.style) {

      if (typeof options.style === 'string') {

        node.setAttribute(
          'style',
          options.style
        );

      } else {

        Object.assign(
          node.style,
          options.style
        );

      }

    }

    if (options.on) {

      for (const [eventName, listener] of Object.entries(options.on)) {

        if (typeof listener === 'function') {
          node.addEventListener(eventName, listener);
        }

      }

    }

    appendChildren(
      node,
      children
    );

    return node;

  }

  function icon(name, options = {}) {

    const svg =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );

    svg.setAttribute(
      'class',
      [
        'us-icon',
        options.className || ''
      ].filter(Boolean).join(' ')
    );

    svg.setAttribute(
      'viewBox',
      options.viewBox || '0 0 24 24'
    );

    svg.setAttribute(
      'width',
      String(
        options.width ||
        24
      )
    );

    svg.setAttribute(
      'height',
      String(
        options.height ||
        24
      )
    );

    svg.setAttribute(
      'fill',
      'none'
    );

    svg.setAttribute(
      'stroke',
      options.stroke || 'currentColor'
    );

    svg.setAttribute(
      'stroke-width',
      String(
        options.strokeWidth ||
        2
      )
    );

    svg.setAttribute(
      'stroke-linecap',
      'round'
    );

    svg.setAttribute(
      'stroke-linejoin',
      'round'
    );

    svg.setAttribute(
      'aria-hidden',
      'true'
    );

    svg.innerHTML =
      ICONS[name] || '';

    return svg;

  }

  function iconSlot(name, options = {}) {

    return element(
      'span',
      {
        className: [
          'us-icon-slot',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          'aria-hidden':
            'true'
        }
      },
      icon(
        name,
        options.iconOptions || {}
      )
    );

  }


  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function focusableElements(root) {

    if (!(root instanceof Element)) {
      return [];
    }

    return Array.from(
      root.querySelectorAll(
        FOCUSABLE_SELECTOR
      )
    ).filter(
      (node) =>
        !node.hidden &&
        node.getAttribute('aria-hidden') !== 'true' &&
        node.getClientRects().length > 0
    );

  }

  function focusInitial(root, preferred = null) {

    const target =
      preferred instanceof Element &&
      root.contains(preferred)
        ? preferred
        : focusableElements(root)[0] ||
          root;

    if (
      target instanceof HTMLElement &&
      typeof target.focus === 'function'
    ) {
      target.focus({
        preventScroll: true
      });
    }

    return target;

  }

  function trapFocus(event, root) {

    if (
      event.key !== 'Tab' ||
      !(root instanceof Element)
    ) {
      return false;
    }

    const focusable =
      focusableElements(root);

    if (!focusable.length) {
      event.preventDefault();
      focusInitial(root);
      return true;
    }

    const first =
      focusable[0];

    const last =
      focusable[
        focusable.length - 1
      ];

    const active =
      document.activeElement;

    if (
      event.shiftKey &&
      (
        active === first ||
        !root.contains(active)
      )
    ) {
      event.preventDefault();
      last.focus({
        preventScroll: true
      });
      return true;
    }

    if (
      !event.shiftKey &&
      (
        active === last ||
        !root.contains(active)
      )
    ) {
      event.preventDefault();
      first.focus({
        preventScroll: true
      });
      return true;
    }

    return false;

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ BASIC COMPONENTS                                                            │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function button(options = {}) {

    const classes = [
      'us-button'
    ];

    if (options.variant === 'primary') {
      classes.push('us-button-primary');
    }

    if (options.variant === 'danger') {
      classes.push('us-button-danger');
    }

    if (options.size === 'xs') {
      classes.push('us-button-xs');
    }

    if (options.className) {
      classes.push(options.className);
    }

    return element(
      'button',
      {
        className: classes.join(' '),
        title: options.title,
        attrs: {
          type: options.type || 'button',
          disabled: options.disabled || null,
          'aria-label': options.ariaLabel || null
        },
        dataset: options.dataset,
        on: options.onClick
          ? {
            click: options.onClick
          }
          : null
      },
      options.icon
        ? iconSlot(
          options.icon,
          {
            className:
              options.iconClassName,
            iconOptions:
              options.iconOptions
          }
        )
        : null,
      options.label || null
    );

  }

  function iconButton(iconName, options = {}) {

    const classes = [
      'us-icon-button-xs',
      'us-action-button'
    ];

    if (options.danger) {
      classes.push('us-action-button-danger');
    }

    if (options.command) {
      classes.push('us-command-action');
    }

    if (options.className) {
      classes.push(options.className);
    }

    return button({
      icon: iconName,
      title: options.title,
      ariaLabel:
        options.ariaLabel ||
        options.title,
      className: classes.join(' '),
      dataset: options.dataset,
      onClick: options.onClick
    });

  }

  function action(actionName, options = {}) {

    const preset =
      ACTIONS[actionName];

    if (!preset) {
      throw new Error(
        `Unknown action: ${actionName}`
      );
    }

    return Object.freeze({
      action:
        actionName,
      icon:
        options.icon ||
        preset.icon,
      label:
        options.label ||
        preset.label,
      title:
        options.title ||
        options.label ||
        preset.label,
      group:
        preset.group,
      danger:
        Boolean(options.danger),
      disabled:
        Boolean(options.disabled),
      onClick:
        options.onClick ||
        options.run ||
        null
    });

  }

  function resolveAction(
    actionNameOrDescriptor,
    options = {}
  ) {

    if (
      actionNameOrDescriptor &&
      actionNameOrDescriptor.nodeType
    ) {
      return actionNameOrDescriptor;
    }

    if (
      typeof actionNameOrDescriptor === 'string'
    ) {

      return action(
        actionNameOrDescriptor,
        options
      );

    }

    if (
      actionNameOrDescriptor &&
      actionNameOrDescriptor.action
    ) {

      return {
        ...action(
          actionNameOrDescriptor.action,
          actionNameOrDescriptor
        ),
        ...actionNameOrDescriptor,
        ...options
      };

    }

    return {
      ...actionNameOrDescriptor,
      ...options
    };

  }

  function actionButton(actionNameOrDescriptor, options = {}) {

    const descriptor =
      resolveAction(
        actionNameOrDescriptor,
        options
      );

    return iconButton(
      descriptor.icon,
      {
        ...descriptor,
        title:
          descriptor.title ||
          descriptor.label,
        ariaLabel:
          descriptor.ariaLabel ||
          descriptor.label,
        danger:
          descriptor.danger,
        onClick:
          descriptor.onClick
      }
    );

  }

  function toneClass(tone = 'NEUTRAL') {

    const key =
      String(
        tone ||
        'NEUTRAL'
      ).toUpperCase();

    return (
      TONE_CLASSES[key] ||
      TONE_CLASSES.NEUTRAL
    );

  }

  function pill(text, tone = 'NEUTRAL', options = {}) {

    const tagName =
      typeof options.onClick === 'function'
        ? 'button'
        : 'span';

    return element(
      tagName,
      {
        className: [
          'us-pill',
          toneClass(tone),
          options.className || ''
        ].filter(Boolean).join(' '),
        title:
          options.title,
        attrs:
          tagName === 'button'
            ? {
              type:
                'button',
              'aria-label':
                options.ariaLabel ||
                options.title ||
                String(text)
            }
            : null,
        on:
          typeof options.onClick === 'function'
            ? {
              click:
                options.onClick
            }
            : null
      },
      options.dot === false
        ? null
        : element(
          'span',
          {
            className:
              'us-pill-dot'
          }
        ),
      text
    );

  }

  function alertBox(options = {}) {

    const tone =
      options.tone ||
      options.level ||
      'INFO';

    const root =
      element(
        'div',
        {
          className: [
            'us-alert',
            toneClass(tone),
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              options.role ||
              (
                ['ERROR', 'DANGER', 'CRITICAL']
                  .includes(
                    String(tone).toUpperCase()
                  )
                  ? 'alert'
                  : 'status'
              )
          }
        }
      );

    const iconName =
      options.icon ||
      (
        ['ERROR', 'DANGER', 'CRITICAL', 'WARNING', 'WARN']
          .includes(
            String(tone).toUpperCase()
          )
          ? 'ALERT'
          : 'INFO'
      );

    root.appendChild(
      element(
        'span',
        {
          className:
            'us-alert-icon'
        },
        icon(iconName)
      )
    );

    root.appendChild(
      element(
        'div',
        {
          className:
            'us-alert-content'
        },
        options.title
          ? element(
            'div',
            {
              className:
                'us-alert-title',
              text:
                options.title
            }
          )
          : null,
        options.message instanceof Node
          ? options.message
          : options.message != null
            ? element(
              'div',
              {
                className:
                  'us-alert-message',
                text:
                  options.message
              }
            )
            : null
      )
    );

    const actions = [];

    if (Array.isArray(options.actions)) {
      actions.push(...options.actions);
    }

    if (
      options.closable ||
      typeof options.onClose === 'function'
    ) {

      actions.push(
        iconButton(
          'CLOSE',
          {
            title:
              'Dismiss',
            onClick: () => {

              root.remove();

              if (typeof options.onClose === 'function') {
                options.onClose();
              }

            }
          }
        )
      );

    }

    if (actions.length) {

      root.appendChild(
        element(
          'div',
          {
            className:
              'us-alert-actions'
          },
          actions
        )
      );

    } else {

      root.appendChild(
        element(
          'span'
        )
      );

    }

    return root;

  }

  function showAlert(options = {}) {

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let stack =
      root.querySelector(
        '.us-alert-stack'
      );

    if (!stack) {

      stack =
        element(
          'div',
          {
            className:
              'us-alert-stack',
            attrs: {
              'aria-live':
                'polite'
            }
          }
        );

      root.appendChild(
        stack
      );

    }

    const item =
      alertBox({
        ...options,
        closable:
          options.closable !== false
      });

    stack.appendChild(
      item
    );

    const remove = () => {
      item.remove();
    };

    if (options.duration !== 0) {

      global.setTimeout(
        remove,
        options.duration ?? 4200
      );

    }

    return Object.freeze({

      element:
        item,

      remove

    });

  }

  function openAlertDialog(options = {}) {

    let controller = null;

    const dismiss =
      button({
        label:
          options.dismissLabel ||
          'Dismiss',
        variant:
          ['CRITICAL', 'ERROR', 'DANGER']
            .includes(
              String(
                options.tone ||
                options.level ||
                ''
              ).toUpperCase()
            )
            ? 'danger'
            : 'primary',
        onClick: () => {

          if (controller) {
            controller.close();
          }

        }
      });

    controller =
      openModal({
        root:
          options.root,
        theme:
          options.theme,
        title:
          options.dialogTitle ||
          options.title ||
          'Alert',
        closeOnBackdrop:
          options.closeOnBackdrop,
        children: [

          alertBox({
            tone:
              options.tone ||
              options.level ||
              'INFO',
            title:
              options.title,
            message:
              options.message,
            actions:
              options.actions,
            closable:
              false
          })

        ],
        footer: [
          ...(options.footer || []),
          dismiss
        ],
        onClose:
          options.onClose
      });

    return controller;

  }

  function actionMenuItem(
    actionNameOrDescriptor,
    options = {}
  ) {

    const descriptor =
      resolveAction(
        actionNameOrDescriptor,
        options
      );

    const buttonNode =
      element(
        'button',
        {
          className: [
            'us-action-menu-item',
            descriptor.danger
              ? 'us-action-menu-item-danger'
              : ''
          ].filter(Boolean).join(' '),
          attrs: {
            type:
              'button',
            role:
              'menuitem',
            disabled:
              descriptor.disabled,
            'aria-label':
              descriptor.ariaLabel ||
              descriptor.label
          },
          on: {
            click: (event) => {

              if (descriptor.disabled) {
                return;
              }

              if (
                typeof descriptor.onClick === 'function'
              ) {

                descriptor.onClick(
                  event,
                  descriptor
                );

              }

              if (
                typeof options.onSelect === 'function'
              ) {

                options.onSelect(
                  descriptor,
                  event
                );

              }

            }
          }
        },
        descriptor.icon
          ? element(
            'span',
            {
              className:
                'us-action-menu-icon'
            },
            icon(
              descriptor.icon
            )
          )
          : null,
        element(
          'span',
          {
            className:
              'us-action-menu-label',
            text:
              descriptor.label ||
              descriptor.title ||
              ''
          }
        ),
        (
          descriptor.shortcut ||
          descriptor.hint
        )
          ? element(
            'span',
            {
              className:
                'us-action-menu-hint',
              text:
                descriptor.shortcut ||
                descriptor.hint
            }
          )
          : null
      );

    return buttonNode;

  }

  function actionMenu(actions = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-action-menu',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role:
            'menu',
          'aria-label':
            options.ariaLabel ||
            'Actions'
        }
      },
      actions.map(
        (item) => {

          if (
            item &&
            item.nodeType
          ) {
            return item;
          }

          return actionMenuItem(
            item,
            {
              onSelect:
                options.onSelect
            }
          );

        }
      )
    );

  }

  function badge(text, type = null) {

    return element(
      'span',
      {
        className: [
          'us-badge',
          type
            ? BADGE_CLASSES[type]
            : ''
        ].filter(Boolean).join(' '),
        text
      }
    );

  }

  function status(text, type = 'OK') {

    return element(
      'span',
      {
        className: [
          'us-status',
          STATUS_CLASSES[type] || ''
        ].filter(Boolean).join(' '),
        text
      }
    );

  }

  function callout(content, type = null) {

    return element(
      'div',
      {
        className: [
          'us-callout',
          type
            ? CALLOUT_CLASSES[type]
            : ''
        ].filter(Boolean).join(' ')
      },
      content
    );

  }

  function divider() {

    return element(
      'div',
      {
        className: 'us-divider'
      }
    );

  }

  function toolbar(children = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-toolbar',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      children
    );

  }

  function stack(children = [], options = {}) {

    const node =
      element(
        options.tag ||
        'div',
        {
          className: [
            'us-stack',
            options.tight
              ? 'us-stack-tight'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        },
        children
      );

    if (options.gap != null) {

      node.style.setProperty(
        '--us-stack-gap',
        typeof options.gap === 'number'
          ? `${options.gap}px`
          : String(options.gap)
      );

    }

    return node;

  }

  function cluster(children = [], options = {}) {

    const node =
      element(
        options.tag ||
        'div',
        {
          className: [
            'us-cluster',
            options.tight
              ? 'us-cluster-tight'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        },
        children
      );

    if (options.gap != null) {

      node.style.setProperty(
        '--us-cluster-gap',
        typeof options.gap === 'number'
          ? `${options.gap}px`
          : String(options.gap)
      );

    }

    return node;

  }

  function field(label, control, options = {}) {

    return element(
      'label',
      {
        className: [
          'us-field',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      element(
        'span',
        {
          className: 'us-field-label',
          text: label
        }
      ),
      control,
      options.hint
        ? element(
          'span',
          {
            className:
              'us-field-hint',
            text:
              options.hint
          }
        )
        : null
    );

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FORM COMPONENTS                                                             │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function inputControl(options = {}) {

    const type =
      options.type ||
      'text';

    const node =
      element(
        'input',
        {
          className: [
            'us-input',
            options.size === 'xs'
              ? 'us-input-xs'
              : '',
            options.mono
              ? 'us-input-mono'
              : '',
            type === 'date'
              ? 'us-input-date'
              : '',
            options.tone
              ? toneClass(options.tone)
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            type,
            name:
              options.name,
            id:
              options.id,
            placeholder:
              options.placeholder,
            min:
              options.min,
            max:
              options.max,
            step:
              options.step,
            pattern:
              options.pattern,
            inputmode:
              options.inputMode,
            autocomplete:
              options.autocomplete,
            accept:
              options.accept,
            capture:
              options.capture,
            webkitdirectory:
              options.directory,
            multiple:
              options.multiple,
            readonly:
              options.readOnly,
            disabled:
              options.disabled,
            required:
              options.required,
            list:
              options.list,
            'aria-label':
              options.ariaLabel
          },
          on:
            options.on
        }
      );

    if (options.value != null) {
      node.value = String(options.value);
    }

    if (options.checked != null) {
      node.checked = Boolean(options.checked);
    }

    if (typeof options.onInput === 'function') {

      node.addEventListener(
        'input',
        (event) => {
          options.onInput(
            event,
            node
          );
        }
      );

    }

    if (typeof options.onChange === 'function') {

      node.addEventListener(
        'change',
        (event) => {
          options.onChange(
            event,
            node
          );
        }
      );

    }

    return node;

  }

  function textareaControl(options = {}) {

    const node =
      element(
        'textarea',
        {
          className: [
            'us-textarea',
            options.mono
              ? 'us-input-mono'
              : '',
            options.tone
              ? toneClass(options.tone)
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            name:
              options.name,
            id:
              options.id,
            placeholder:
              options.placeholder,
            rows:
              options.rows,
            cols:
              options.cols,
            maxlength:
              options.maxLength,
            readonly:
              options.readOnly,
            disabled:
              options.disabled,
            required:
              options.required,
            'aria-label':
              options.ariaLabel
          },
          on:
            options.on
        }
      );

    if (options.value != null) {
      node.value = String(options.value);
    }

    if (typeof options.onInput === 'function') {

      node.addEventListener(
        'input',
        (event) => {
          options.onInput(
            event,
            node
          );
        }
      );

    }

    if (typeof options.onChange === 'function') {

      node.addEventListener(
        'change',
        (event) => {
          options.onChange(
            event,
            node
          );
        }
      );

    }

    return node;

  }

  function selectControl(options = {}) {

    const node =
      element(
        'select',
        {
          className: [
            'us-select',
            options.size === 'xs'
              ? 'us-select-xs'
              : '',
            options.mono
              ? 'us-input-mono'
              : '',
            options.tone
              ? toneClass(options.tone)
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            name:
              options.name,
            id:
              options.id,
            multiple:
              options.multiple,
            disabled:
              options.disabled,
            required:
              options.required,
            size:
              options.visibleRows,
            'aria-label':
              options.ariaLabel
          }
        }
      );

    const selectedValues =
      new Set(
        Array.isArray(options.value)
          ? options.value.map(String)
          : options.value != null
            ? [String(options.value)]
            : []
      );

    for (const item of options.options || []) {

      const normalized =
        Array.isArray(item)
          ? {
            value:
              item[0],
            label:
              item[1]
          }
          : item;

      const option =
        element(
          'option',
          {
            text:
              normalized.label ??
              normalized.value,
            attrs: {
              value:
                normalized.value,
              disabled:
                normalized.disabled
            }
          }
        );

      if (
        selectedValues.has(
          String(normalized.value)
        )
      ) {
        option.selected = true;
      }

      node.appendChild(
        option
      );

    }

    if (typeof options.onChange === 'function') {

      node.addEventListener(
        'change',
        (event) => {
          options.onChange(
            event,
            node
          );
        }
      );

    }

    return node;

  }

  function choiceControl(options = {}) {

    const input =
      inputControl({
        type:
          options.type === 'radio'
            ? 'radio'
            : 'checkbox',
        name:
          options.name,
        value:
          options.value,
        checked:
          options.checked,
        disabled:
          options.disabled,
        ariaLabel:
          options.ariaLabel ||
          options.label,
        onChange:
          options.onChange
      });

    input.className =
      '';

    return element(
      'label',
      {
        className: [
          'us-choice',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      input,
      element(
        'span',
        {
          className:
            'us-choice-copy'
        },
        element(
          'span',
          {
            text:
              options.label ||
              ''
          }
        ),
        options.description
          ? element(
            'span',
            {
              className:
                'us-choice-description',
              text:
                options.description
            }
          )
          : null
      )
    );

  }

  function checkboxControl(options = {}) {

    return choiceControl({
      ...options,
      type:
        'checkbox'
    });

  }

  function radioControl(options = {}) {

    return choiceControl({
      ...options,
      type:
        'radio'
    });

  }

  function radioGroup(options = {}) {

    return element(
      'div',
      {
        className:
          'us-choice-group',
        attrs: {
          role:
            'radiogroup',
          'aria-label':
            options.ariaLabel ||
            options.label ||
            'Options'
        }
      },
      (options.items || []).map(
        (item) => radioControl({
          ...item,
          name:
            options.name,
          checked:
            item.value === options.value ||
            item.checked,
          onChange:
            options.onChange
        })
      )
    );

  }

  function inputGroup(options = {}) {

    return element(
      'div',
      {
        className: [
          'us-input-group',
          options.tone
            ? toneClass(options.tone)
            : '',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      options.prefix != null
        ? element(
          'span',
          {
            className:
              'us-input-affix us-input-prefix',
            text:
              options.prefix
          }
        )
        : null,
      options.control ||
        inputControl(
          options.input || {}
        ),
      options.suffix != null
        ? element(
          'span',
          {
            className:
              'us-input-affix us-input-suffix',
            text:
              options.suffix
          }
        )
        : null
    );

  }

  function utilityGroup(options = {}) {

    return element(
      'div',
      {
        className:
          'us-utility-group'
      },
      options.label
        ? element(
          'span',
          {
            className:
              'us-utility-label',
            text:
              options.label
          }
        )
        : null,
      options.children || []
    );

  }

  function utilityBar(options = {}) {

    return element(
      options.tagName || 'div',
      {
        className: [
          'us-utility-bar',
          options.fixed
            ? 'us-utility-bar-fixed'
            : '',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role:
            options.role ||
            'toolbar',
          'aria-label':
            options.ariaLabel ||
            options.label ||
            'Userscript utility bar'
        }
      },
      options.children || []
    );

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ SETTINGS COMPONENTS                                                         │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function rangeControl(options = {}) {

    const input =
      element(
        'input',
        {
          className: 'us-range',
          attrs: {
            type: 'range',
            min:
              options.min ?? 0,
            max:
              options.max ?? 100,
            step:
              options.step ?? 1,
            value:
              options.value ?? 50,
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Range'
          }
        }
      );

    const output =
      element(
        'output',
        {
          className:
            'us-range-value'
        }
      );

    const format =
      typeof options.format === 'function'
        ? options.format
        : (value) => {

          if (options.suffix) {
            return `${value}${options.suffix}`;
          }

          return String(value);

        };

    const update = () => {

      output.value =
        format(
          input.value
        );

      output.textContent =
        output.value;

      if (typeof options.onInput === 'function') {

        options.onInput(
          Number(input.value),
          input
        );

      }

    };

    input.addEventListener(
      'input',
      update
    );

    if (typeof options.onChange === 'function') {

      input.addEventListener(
        'change',
        () => {

          options.onChange(
            Number(input.value),
            input
          );

        }
      );

    }

    update();

    return element(
      'div',
      {
        className:
          'us-range-wrap'
      },
      input,
      output
    );

  }

  function switchControl(options = {}) {

    const input =
      element(
        'input',
        {
          className:
            'us-switch-input',
          attrs: {
            type: 'checkbox',
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Toggle'
          }
        }
      );

    input.checked =
      Boolean(
        options.checked
      );

    if (typeof options.onChange === 'function') {

      input.addEventListener(
        'change',
        () => {

          options.onChange(
            input.checked,
            input
          );

        }
      );

    }

    return element(
      'label',
      {
        className:
          'us-switch'
      },
      input,
      element(
        'span',
        {
          className:
            'us-switch-track'
        },
        element(
          'span',
          {
            className:
              'us-switch-thumb'
          }
        )
      )
    );

  }

  function segmentedControl(options = {}) {

    const root =
      element(
        'div',
        {
          className:
            'us-segmented',
          attrs: {
            role: 'group',
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Options'
          }
        }
      );

    let value =
      options.value ??
      options.items?.[0]?.value ??
      null;

    const buttons = [];

    const sync = () => {

      for (const item of buttons) {

        const active =
          item.dataset.value ===
          String(value);

        item.classList.toggle(
          'us-segmented-option-active',
          active
        );

        item.setAttribute(
          'aria-pressed',
          active
            ? 'true'
            : 'false'
        );

      }

    };

    for (const item of options.items || []) {

      const buttonNode =
        element(
          'button',
          {
            className:
              'us-segmented-option',
            text:
              item.label,
            attrs: {
              type: 'button'
            },
            dataset: {
              value:
                item.value
            },
            on: {
              click: () => {

                value =
                  item.value;

                sync();

                if (typeof options.onChange === 'function') {

                  options.onChange(
                    value,
                    root
                  );

                }

              }
            }
          }
        );

      buttons.push(
        buttonNode
      );

      root.appendChild(
        buttonNode
      );

    }

    sync();

    return root;

  }

  function settingRow(options = {}) {

    return element(
      'div',
      {
        className:
          'us-setting-row'
      },
      element(
        'div',
        {
          className:
            'us-setting-copy'
        },
        element(
          'div',
          {
            className:
              'us-setting-label',
            text:
              options.label ||
              ''
          }
        ),
        options.description
          ? element(
            'div',
            {
              className:
                'us-setting-description',
              text:
                options.description
            }
          )
          : null
      ),
      element(
        'div',
        {
          className:
            'us-setting-control'
        },
        options.control || null
      )
    );

  }

  function settingsGroup(options = {}) {

    return element(
      'section',
      {
        className:
          'us-settings-group'
      },
      options.title
        ? element(
          'div',
          {
            className:
              'us-settings-group-title',
            text:
              options.title
          }
        )
        : null,
      options.children || []
    );

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ PANEL COMPONENTS                                                            │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function panel(options = {}) {

    const root =
      element(
        options.tagName || 'section',
        {
          id: options.id,
          className: [
            'us-panel',
            options.selected
              ? 'us-panel-selected'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        }
      );

    if (
      options.title ||
      options.subtitle ||
      options.actions?.length
    ) {

      const heading =
        element(
          'div',
          {
            className: 'us-panel-heading'
          }
        );

      if (options.title) {

        heading.appendChild(
          element(
            'div',
            {
              className: 'us-panel-title',
              text: options.title
            }
          )
        );

      }

      if (options.subtitle) {

        heading.appendChild(
          element(
            'div',
            {
              className: 'us-panel-subtitle',
              text: options.subtitle
            }
          )
        );

      }

      root.appendChild(
        element(
          'header',
          {
            className: 'us-panel-header'
          },
          heading,
          options.actions?.length
            ? element(
              'div',
              {
                className: 'us-panel-actions'
              },
              options.actions
            )
            : null
        )
      );

    }

    root.appendChild(
      element(
        'div',
        {
          className: [
            'us-panel-body',
            options.compact
              ? 'us-panel-body-compact'
              : ''
          ].filter(Boolean).join(' ')
        },
        options.children || []
      )
    );

    return root;

  }

  function pageHeader(options = {}) {

    return element(
      'div',
      {
        className: 'us-page-header'
      },
      element(
        'div',
        {
          className: 'us-page-header-main'
        },
        options.kicker
          ? element(
            'div',
            {
              className: 'us-page-kicker',
              text: options.kicker
            }
          )
          : null,
        element(
          'div',
          {
            className: 'us-page-title',
            text: options.title || ''
          }
        ),
        options.description
          ? element(
            'div',
            {
              className: 'us-page-description',
              text: options.description
            }
          )
          : null
      ),
      options.actions?.length
        ? element(
          'div',
          {
            className: 'us-row us-row-wrap'
          },
          options.actions
        )
        : null
    );

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ DATA COMPONENTS                                                             │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function metricStrip(metrics = []) {

    return element(
      'div',
      {
        className: 'us-metric-strip'
      },
      metrics.map((metric) => {

        const valueClasses = [
          'us-metric-value'
        ];

        if (metric.mono) {
          valueClasses.push(
            'us-metric-value-mono'
          );
        }

        return element(
          'div',
          {
            className: 'us-metric'
          },
          element(
            'div',
            {
              className: 'us-metric-label',
              text: metric.label
            }
          ),
          element(
            'div',
            {
              className: valueClasses.join(' ')
            },
            metric.value instanceof Node
              ? metric.value
              : String(metric.value ?? '')
          )
        );

      })
    );

  }

  function keyValueList(items = []) {

    const children = [];

    for (const item of items) {

      children.push(
        element(
          'div',
          {
            className: 'us-kv-key',
            text: item.label
          }
        )
      );

      children.push(
        element(
          'div',
          {
            className: [
              'us-kv-value',
              item.mono
                ? 'us-kv-value-mono'
                : ''
            ].filter(Boolean).join(' ')
          },
          item.value instanceof Node
            ? item.value
            : String(item.value ?? '')
        )
      );

    }

    return element(
      'div',
      {
        className: 'us-kv-list'
      },
      children
    );

  }

  function dataTable(options = {}) {

    const table =
      element(
        'table',
        {
          className: [
            'us-table',
            options.mono
              ? 'us-table-mono'
              : ''
          ].filter(Boolean).join(' ')
        }
      );

    const head =
      element(
        'thead',
        {}
      );

    const headerRow =
      element(
        'tr',
        {}
      );

    for (const column of options.columns || []) {

      headerRow.appendChild(
        element(
          'th',
          {
            text: column.label,
            attrs: column.width
              ? {
                style:
                  `width: ${column.width};`
              }
              : null
          }
        )
      );

    }

    head.appendChild(
      headerRow
    );

    table.appendChild(
      head
    );

    const body =
      element(
        'tbody',
        {}
      );

    for (const row of options.rows || []) {

      const tr =
        element(
          'tr',
          {}
        );

      for (const column of options.columns || []) {

        const value =
          row[column.key];

        tr.appendChild(
          element(
            'td',
            {},
            value instanceof Node
              ? value
              : String(value ?? '')
          )
        );

      }

      body.appendChild(
        tr
      );

    }

    table.appendChild(
      body
    );

    return element(
      'div',
      {
        className: 'us-table-wrap'
      },
      table
    );

  }

  function tabs(items = [], active = null, onChange = null) {

    return element(
      'div',
      {
        className: 'us-tabs',
        attrs: {
          role: 'tablist'
        }
      },
      items.map((item) => {

        const key =
          item.key ?? item.label;

        return element(
          'button',
          {
            className: [
              'us-tab',
              key === active
                ? 'us-tab-active'
                : ''
            ].filter(Boolean).join(' '),
            text: item.label,
            attrs: {
              type: 'button',
              role: 'tab',
              'aria-selected':
                key === active
                  ? 'true'
                  : 'false'
            },
            on: onChange
              ? {
                click: () => {
                  onChange(key);
                }
              }
              : null
          }
        );

      })
    );

  }

  function logList(entries = []) {

    return element(
      'div',
      {
        className: 'us-log-list'
      },
      entries.map((entry) => {

        return element(
          'div',
          {
            className: 'us-log-row'
          },
          element(
            'span',
            {
              className: 'us-log-time',
              text: entry.time || ''
            }
          ),
          element(
            'span',
            {
              className: 'us-log-kind',
              text: entry.kind || ''
            }
          ),
          element(
            'span',
            {
              className: 'us-log-message',
              text: entry.message || ''
            }
          )
        );

      })
    );

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ ACTION COMPONENTS                                                           │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function actionStrip(actions = [], options = {}) {

    return element(
      'div',
      {
        className: 'us-action-strip',
        attrs: {
          role: 'group',
          'aria-label':
            options.ariaLabel ||
            'Actions'
        }
      },
      actions.map((item) => {

        if (item instanceof Node) {
          return item;
        }

        if (typeof item === 'string') {
          return actionButton(item);
        }

        if (item.custom instanceof Node) {
          return item.custom;
        }

        if (item.action) {
          return actionButton(item);
        }

        return iconButton(
          item.icon,
          item
        );

      })
    );

  }

  async function copyText(value) {

    if (navigator.clipboard?.writeText) {

      await navigator.clipboard.writeText(value);
      return;

    }

    const textarea =
      document.createElement('textarea');

    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    document.body.appendChild(
      textarea
    );

    textarea.select();

    document.execCommand(
      'copy'
    );

    textarea.remove();

  }

  function shellQuote(value) {

    return `'${String(value).replaceAll("'", "'\\\"'\\\"'")}'`;

  }

  function copyCommandButton(options = {}) {

    const getCommand =
      typeof options.command === 'function'
        ? options.command
        : () => String(options.command || '');

    const action =
      iconButton(
        options.icon || 'TERMINAL',
        {
          title: options.title || 'Copy command',
          command: true,
          onClick: async () => {

            const command =
              getCommand();

            if (!command) {
              return;
            }

            await copyText(
              command
            );

            action.dataset.copied = 'true';
            action.title = command;

            setTimeout(() => {

              delete action.dataset.copied;

              action.title =
                options.title ||
                'Copy command';

            }, options.feedbackMs || 1400);

          }
        }
      );

    return action;

  }

  function commandBlock(command, options = {}) {

    const getCommand =
      typeof command === 'function'
        ? command
        : () => String(command || '');

    return element(
      'div',
      {
        className: 'us-command'
      },
      element(
        'code',
        {
          className: 'us-command-code',
          text: getCommand()
        }
      ),
      copyCommandButton({
        command: getCommand,
        title:
          options.title ||
          'Copy command'
      })
    );

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ FILES / PROGRESS / ASSET TRAYS                                               │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function formatBytes(bytes = 0) {

    const value =
      Number(bytes) || 0;

    if (value < 1024) {
      return `${value} B`;
    }

    const units = [
      'KB',
      'MB',
      'GB',
      'TB'
    ];

    let size =
      value / 1024;

    let unitIndex = 0;

    while (
      size >= 1024 &&
      unitIndex < units.length - 1
    ) {

      size /= 1024;
      unitIndex += 1;

    }

    return `${size.toFixed(
      size >= 10
        ? 1
        : 2
    )} ${units[unitIndex]}`;

  }

  function fileMatchesAccept(file, accept = '') {

    if (!accept) {
      return true;
    }

    const rules =
      String(accept)
        .split(',')
        .map(
          (rule) => rule.trim().toLowerCase()
        )
        .filter(Boolean);

    if (!rules.length) {
      return true;
    }

    const name =
      String(
        file?.name ||
        ''
      ).toLowerCase();

    const type =
      String(
        file?.type ||
        ''
      ).toLowerCase();

    return rules.some(
      (rule) => {

        if (rule.startsWith('.')) {
          return name.endsWith(rule);
        }

        if (rule.endsWith('/*')) {

          return type.startsWith(
            rule.slice(0, -1)
          );

        }

        return type === rule;

      }
    );

  }

  function progressBar(value = 0, options = {}) {

    const minimum =
      Number(
        options.min ??
        0
      );

    const maximum =
      Math.max(
        minimum + Number.EPSILON,
        Number(
          options.max ??
          100
        )
      );

    const clampValue =
      (nextValue) => Math.max(
        minimum,
        Math.min(
          maximum,
          Number(nextValue) || 0
        )
      );

    let currentValue =
      value == null
        ? null
        : clampValue(value);

    let indeterminate =
      Boolean(
        options.indeterminate ||
        value == null
      );

    const labelNode =
      element(
        'span',
        {
          className:
            'us-progress-label',
          text:
            options.label ||
            ''
        }
      );

    const valueNode =
      element(
        'span',
        {
          className:
            'us-progress-text'
        }
      );

    const fill =
      element(
        'span',
        {
          className:
            'us-progress-fill'
        }
      );

    const track =
      element(
        'div',
        {
          className:
            'us-progress-track',
          attrs: {
            role:
              'progressbar',
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Progress',
            'aria-valuemin':
              minimum,
            'aria-valuemax':
              maximum
          }
        },
        fill
      );

    const root =
      element(
        'div',
        {
          className: [
            'us-progress',
            toneClass(
              options.tone ||
              'ACCENT'
            ),
            options.compact
              ? 'us-progress-compact'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        },
        (
          options.label ||
          options.showValue !== false
        )
          ? element(
            'div',
            {
              className:
                'us-progress-header'
            },
            labelNode,
            valueNode
          )
          : null,
        track
      );

    const sync = () => {

      root.classList.toggle(
        'us-progress-indeterminate',
        indeterminate
      );

      if (indeterminate) {

        track.removeAttribute(
          'aria-valuenow'
        );

        valueNode.textContent =
          options.indeterminateLabel ||
          '…';

        fill.style.width =
          '';

        return;

      }

      track.setAttribute(
        'aria-valuenow',
        String(currentValue)
      );

      const percentage =
        (
          (
            currentValue -
            minimum
          ) /
          (
            maximum -
            minimum
          )
        ) * 100;

      fill.style.width =
        `${percentage}%`;

      valueNode.textContent =
        typeof options.formatValue === 'function'
          ? options.formatValue(
            currentValue,
            {
              min:
                minimum,
              max:
                maximum,
              percentage
            }
          )
          : `${Math.round(percentage)}%`;

    };

    root.setValue =
      (nextValue) => {

        currentValue =
          clampValue(
            nextValue
          );

        indeterminate = false;

        sync();

      };

    root.setIndeterminate =
      (next = true) => {

        indeterminate =
          Boolean(next);

        sync();

      };

    root.setLabel =
      (nextLabel) => {

        labelNode.textContent =
          nextLabel || '';

      };

    sync();

    return root;

  }

  function progressGroup(items = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-progress-group',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      items.map(
        (item) => {

          if (
            item &&
            item.nodeType
          ) {
            return item;
          }

          return progressBar(
            item.value,
            item
          );

        }
      )
    );

  }

  function spinner(options = {}) {

    return element(
      'span',
      {
        className: [
          'us-spinner',
          toneClass(
            options.tone ||
            'ACCENT'
          ),
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role:
            'status',
          'aria-label':
            options.ariaLabel ||
            options.label ||
            'Loading'
        }
      },
      element(
        'span',
        {
          className:
            'us-visually-hidden',
          text:
            options.label ||
            'Loading'
        }
      )
    );

  }

  function skeleton(options = {}) {

    const variant =
      options.variant ||
      (
        options.lines
          ? 'text'
          : 'block'
      );

    const root =
      element(
        'div',
        {
          className: [
            'us-skeleton',
            `us-skeleton-${variant}`,
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            'aria-hidden':
              'true'
          }
        }
      );

    if (options.width) {
      root.style.width =
        typeof options.width === 'number'
          ? `${options.width}px`
          : String(options.width);
    }

    if (options.height) {
      root.style.height =
        typeof options.height === 'number'
          ? `${options.height}px`
          : String(options.height);
    }

    if (variant === 'text') {

      const lines =
        Math.max(
          1,
          Number(options.lines) || 3
        );

      for (
        let index = 0;
        index < lines;
        index += 1
      ) {

        root.appendChild(
          element(
            'span',
            {
              className:
                'us-skeleton-line'
            }
          )
        );

      }

    } else if (variant === 'card') {

      root.append(
        element(
          'span',
          {
            className:
              'us-skeleton-card-media'
          }
        ),
        element(
          'span',
          {
            className:
              'us-skeleton-card-line'
          }
        ),
        element(
          'span',
          {
            className:
              'us-skeleton-card-line us-skeleton-card-line-short'
          }
        )
      );

    } else if (variant === 'table') {

      const rows =
        Math.max(
          1,
          Number(options.rows) || 4
        );

      const columns =
        Math.max(
          1,
          Number(options.columns) || 3
        );

      root.style.setProperty(
        '--us-skeleton-columns',
        String(columns)
      );

      for (
        let rowIndex = 0;
        rowIndex < rows;
        rowIndex += 1
      ) {

        const row =
          element(
            'span',
            {
              className:
                'us-skeleton-table-row'
            }
          );

        for (
          let columnIndex = 0;
          columnIndex < columns;
          columnIndex += 1
        ) {
          row.appendChild(
            element(
              'span',
              {
                className:
                  'us-skeleton-table-cell'
              }
            )
          );
        }

        root.appendChild(row);

      }

    }

    return root;

  }
  function segmentedProgress(segments = [], options = {}) {

    let currentSegments =
      Array.isArray(segments)
        ? [...segments]
        : [];

    const labelNode =
      element(
        'span',
        {
          className:
            'us-progress-label',
          text:
            options.label ||
            ''
        }
      );

    const valueNode =
      element(
        'span',
        {
          className:
            'us-progress-text'
        }
      );

    const track =
      element(
        'div',
        {
          className:
            'us-segmented-progress-track',
          attrs: {
            role:
              'progressbar',
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Segmented progress',
            'aria-valuemin':
              0
          }
        }
      );

    const legend =
      element(
        'div',
        {
          className:
            'us-segmented-progress-legend'
        }
      );

    const root =
      element(
        'div',
        {
          className: [
            'us-segmented-progress',
            options.compact
              ? 'us-segmented-progress-compact'
              : '',
            options.className ||
              ''
          ].filter(Boolean).join(' ')
        },
        (
          options.label ||
          options.showValue !== false
        )
          ? element(
            'div',
            {
              className:
                'us-progress-header'
            },
            labelNode,
            valueNode
          )
          : null,
        track,
        options.legend === false
          ? null
          : legend
      );

    const normalize =
      (segment, index) => {

        if (
          typeof segment === 'number'
        ) {

          return {
            value:
              Math.max(
                0,
                segment
              ),
            label:
              `Segment ${index + 1}`,
            tone:
              'ACCENT'
          };

        }

        return {
          ...segment,
          value:
            Math.max(
              0,
              Number(
                segment?.value
              ) || 0
            ),
          label:
            segment?.label ||
            `Segment ${index + 1}`,
          tone:
            segment?.tone ||
            'ACCENT'
        };

      };

    const render =
      () => {

        track.replaceChildren();
        legend.replaceChildren();

        const normalized =
          currentSegments.map(
            normalize
          );

        const total =
          normalized.reduce(
            (
              sum,
              segment
            ) =>
              sum +
              segment.value,
            0
          );

        const maximum =
          Math.max(
            Number(
              options.max ??
              total ??
              100
            ) || 0,
            Number.EPSILON
          );

        track.setAttribute(
          'aria-valuemax',
          String(maximum)
        );

        track.setAttribute(
          'aria-valuenow',
          String(
            Math.min(
              total,
              maximum
            )
          )
        );

        valueNode.textContent =
          typeof options.formatValue ===
            'function'
            ? options.formatValue(
              total,
              {
                max:
                  maximum,
                percentage:
                  (
                    Math.min(
                      total,
                      maximum
                    ) /
                    maximum
                  ) * 100
              }
            )
            : `${Math.round(
              (
                Math.min(
                  total,
                  maximum
                ) /
                maximum
              ) * 100
            )}%`;

        for (
          const [
            index,
            segment
          ] of normalized.entries()
        ) {

          const width =
            (
              Math.min(
                segment.value,
                maximum
              ) /
              maximum
            ) * 100;

          const segmentNode =
            element(
              'span',
              {
                className: [
                  'us-segmented-progress-segment',
                  toneClass(
                    segment.tone
                  )
                ].join(' '),
                title:
                  segment.title ||
                  `${segment.label}: ${segment.value}`,
                attrs: {
                  'aria-hidden':
                    'true'
                }
              }
            );

          segmentNode.style.width =
            `${width}%`;

          if (segment.color) {

            segmentNode.style.setProperty(
              '--us-segment-color',
              segment.color
            );

          }

          track.appendChild(
            segmentNode
          );

          if (
            options.legend !== false
          ) {

            legend.appendChild(
              element(
                'span',
                {
                  className:
                    'us-segmented-progress-legend-item'
                },
                element(
                  'span',
                  {
                    className: [
                      'us-segmented-progress-swatch',
                      toneClass(
                        segment.tone
                      )
                    ].join(' ')
                  }
                ),
                element(
                  'span',
                  {
                    text:
                      segment.label
                  }
                ),
                options.showLegendValues === false
                  ? null
                  : element(
                    'span',
                    {
                      className:
                        'us-segmented-progress-legend-value',
                      text:
                        typeof options.formatSegmentValue ===
                          'function'
                          ? options.formatSegmentValue(
                            segment.value,
                            segment,
                            index
                          )
                          : String(
                            segment.value
                          )
                    }
                  )
              )
            );

          }

        }

      };

    root.setSegments =
      (nextSegments = []) => {

        currentSegments =
          Array.isArray(nextSegments)
            ? [...nextSegments]
            : [];

        render();

        return root;

      };

    root.getSegments =
      () => [...currentSegments];

    root.setLabel =
      (nextLabel) => {

        labelNode.textContent =
          nextLabel ||
          '';

        return root;

      };

    render();

    return root;

  }
  function filePicker(options = {}) {

    let files = [];

    const input =
      inputControl({
        type:
          'file',
        accept:
          options.accept,
        capture:
          options.capture,
        directory:
          options.directory,
        multiple:
          options.directory
            ? true
            : options.multiple !== false,
        disabled:
          options.disabled,
        ariaLabel:
          options.ariaLabel ||
          options.label ||
          'Choose files'
      });

    input.classList.add(
      'us-file-picker-input'
    );

    const list =
      element(
        'div',
        {
          className:
            'us-file-picker-list',
          attrs: {
            'aria-live':
              'polite'
          }
        }
      );

    const summary =
      element(
        'span',
        {
          className:
            'us-file-picker-summary',
          text:
            options.emptyText ||
            'No files selected'
        }
      );

    const clearButton =
      actionButton(
        'CLOSE',
        {
          title:
            'Clear files'
        }
      );

    const footer =
      element(
        'div',
        {
          className:
            'us-file-picker-footer'
        },
        summary,
        clearButton
      );

    const browse =
      button({
        label:
          options.buttonLabel ||
          'Browse',
        size:
          'xs',
        variant:
          'primary'
      });

    const dropZone =
      element(
        'div',
        {
          className:
            'us-file-picker-drop',
          attrs: {
            role:
              'button',
            tabindex:
              options.disabled
                ? -1
                : 0,
            'aria-label':
              options.ariaLabel ||
              options.label ||
              'Choose or drop files'
          }
        },
        element(
          'span',
          {
            className:
              'us-file-picker-icon'
          },
          icon(
            'UPLOAD'
          )
        ),
        element(
          'div',
          {
            className:
              'us-file-picker-copy'
          },
          element(
            'strong',
            {
              text:
                options.label ||
                'Drop files here'
            }
          ),
          element(
            'span',
            {
              text:
                options.description ||
                (
                  options.accept
                    ? `Accepted: ${options.accept}`
                    : 'Choose files or drag them into this area.'
                )
            }
          )
        ),
        browse
      );

    const root =
      element(
        'section',
        {
          className: [
            'us-file-picker',
            options.disabled
              ? 'us-file-picker-disabled'
              : '',
            options.className || ''
          ].filter(Boolean).join(' ')
        },
        input,
        dropZone,
        list,
        footer
      );

    const notifyChange = () => {

      if (
        typeof options.onChange === 'function'
      ) {

        options.onChange(
          [...files],
          root
        );

      }

    };

    const render = () => {

      list.replaceChildren();

      for (
        const [index, file] of
        files.entries()
      ) {

        const type =
          String(
            file.type ||
            ''
          );

        const iconName =
          type.startsWith('image/')
            ? 'IMAGE'
            : type.startsWith('video/')
              ? 'MEDIA'
              : 'FILE';

        const removeButton =
          actionButton(
            'CLOSE',
            {
              title:
                `Remove ${file.name}`,
              onClick: () => {

                files.splice(
                  index,
                  1
                );

                render();
                notifyChange();

              }
            }
          );

        list.appendChild(
          element(
            'div',
            {
              className:
                'us-file-picker-item'
            },
            element(
              'span',
              {
                className:
                  'us-file-picker-item-icon'
              },
              icon(
                iconName
              )
            ),
            element(
              'div',
              {
                className:
                  'us-file-picker-item-main'
              },
              element(
                'span',
                {
                  className:
                    'us-file-picker-item-name',
                  text:
                    file.name ||
                    `File ${index + 1}`
                }
              ),
              metaLine([
                type ||
                'file',
                formatBytes(
                  file.size
                )
              ])
            ),
            removeButton
          )
        );

      }

      const totalBytes =
        files.reduce(
          (sum, file) => sum + (
            Number(file.size) || 0
          ),
          0
        );

      summary.textContent =
        files.length
          ? `${files.length} file${files.length === 1 ? '' : 's'} · ${formatBytes(totalBytes)}`
          : (
            options.emptyText ||
            'No files selected'
          );

      footer.hidden =
        files.length === 0;

    };

    const addFiles =
      (incoming) => {

        const next =
          Array.from(
            incoming || []
          );

        const accepted = [];
        const rejected = [];

        for (const file of next) {

          const tooLarge =
            options.maxSize != null &&
            Number(file.size) >
              Number(options.maxSize);

          const wrongType =
            !fileMatchesAccept(
              file,
              options.accept
            );

          if (
            tooLarge ||
            wrongType
          ) {

            rejected.push({
              file,
              reason:
                tooLarge
                  ? 'size'
                  : 'type'
            });

            continue;

          }

          accepted.push(file);

        }

        if (rejected.length) {

          if (
            typeof options.onReject === 'function'
          ) {

            options.onReject(
              rejected,
              root
            );

          }

        }

        if (!accepted.length) {
          return;
        }

        if (options.multiple === false) {

          files = [
            accepted[0]
          ];

        } else {

          files.push(
            ...accepted
          );

        }

        if (options.maxFiles != null) {

          files =
            files.slice(
              0,
              Math.max(
                0,
                Number(options.maxFiles) || 0
              )
            );

        }

        render();
        notifyChange();

      };

    const openPicker = () => {

      if (
        options.disabled
      ) {
        return;
      }

      input.click();

    };

    input.addEventListener(
      'change',
      () => {

        addFiles(
          input.files
        );

        input.value =
          '';

      }
    );

    browse.addEventListener(
      'click',
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        openPicker();

      }
    );

    dropZone.addEventListener(
      'click',
      (event) => {

        if (
          event.target.closest(
            '.us-button'
          )
        ) {
          return;
        }

        openPicker();

      }
    );

    dropZone.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {

          event.preventDefault();
          openPicker();

        }

      }
    );

    dropZone.addEventListener(
      'dragenter',
      (event) => {

        event.preventDefault();

        dropZone.classList.add(
          'us-file-picker-drop-active'
        );

      }
    );

    dropZone.addEventListener(
      'dragover',
      (event) => {

        event.preventDefault();

        if (event.dataTransfer) {
          event.dataTransfer.dropEffect =
            'copy';
        }

      }
    );

    dropZone.addEventListener(
      'dragleave',
      (event) => {

        if (
          event.relatedTarget &&
          dropZone.contains(
            event.relatedTarget
          )
        ) {
          return;
        }

        dropZone.classList.remove(
          'us-file-picker-drop-active'
        );

      }
    );

    dropZone.addEventListener(
      'drop',
      (event) => {

        event.preventDefault();

        dropZone.classList.remove(
          'us-file-picker-drop-active'
        );

        addFiles(
          event.dataTransfer?.files
        );

      }
    );

    clearButton.addEventListener(
      'click',
      () => {

        files = [];

        render();
        notifyChange();

      }
    );

    root.getFiles =
      () => [...files];

    root.addFiles =
      addFiles;

    root.clear =
      () => {

        files = [];

        render();
        notifyChange();

      };

    render();

    return root;

  }
  function uploadQueue(files = [], options = {}) {

    const items = [];
    const upload = options.upload;
    const concurrency = Math.max(1, Math.floor(Number(options.concurrency ?? 2) || 1));
    let running = null;

    const list = element('div', {
      className: 'us-upload-queue-list',
      attrs: { 'aria-live': 'polite' }
    });

    const summary = element('span', {
      className: 'us-upload-queue-summary'
    });

    const aggregate = progressBar(0, {
      label: options.aggregateLabel || 'Overall',
      max: 100
    });

    const startButton = button({
      icon: 'UPLOAD',
      label: options.startLabel || 'Start',
      size: 'xs',
      variant: 'primary'
    });

    const retryButton = button({
      icon: 'REFRESH',
      label: 'Retry failed',
      size: 'xs'
    });

    const cancelButton = button({
      icon: 'CLOSE',
      label: 'Cancel all',
      size: 'xs'
    });

    const root = element(
      'section',
      {
        className: [
          'us-upload-queue',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      options.title
        ? element('div', {
          className: 'us-upload-queue-title',
          text: options.title
        })
        : null,
      aggregate,
      list,
      element(
        'div',
        { className: 'us-upload-queue-footer' },
        summary,
        element(
          'div',
          { className: 'us-upload-queue-actions' },
          startButton,
          retryButton,
          cancelButton
        )
      )
    );

    const toneFor = (status) => ({
      success: 'SUCCESS',
      error: 'ERROR',
      uploading: 'INFO',
      cancelled: 'WARNING'
    }[status] || 'NEUTRAL');

    const labelFor = (status) => ({
      success: 'Complete',
      error: 'Failed',
      uploading: 'Uploading',
      cancelled: 'Cancelled'
    }[status] || 'Queued');

    const sync = () => {

      const total = items.reduce(
        (sum, item) => sum + Math.max(1, item.total),
        0
      );

      const loaded = items.reduce(
        (sum, item) => sum + Math.min(item.loaded, Math.max(1, item.total)),
        0
      );

      const percentage = total
        ? (loaded / total) * 100
        : 0;

      aggregate.setValue(percentage);

      const counts = items.reduce((result, item) => {
        result[item.status] = (result[item.status] || 0) + 1;
        return result;
      }, {});

      summary.textContent =
        String(items.length) +
        ' file' +
        (items.length === 1 ? '' : 's') +
        ' · ' +
        String(counts.success || 0) +
        ' complete · ' +
        String(counts.error || 0) +
        ' failed';

      startButton.disabled =
        Boolean(running) ||
        !items.some((item) => item.status === 'queued');

      retryButton.disabled =
        !items.some((item) => item.status === 'error');

      cancelButton.disabled =
        !items.some(
          (item) =>
            item.status === 'queued' ||
            item.status === 'uploading'
        );

      if (typeof options.onChange === 'function') {
        options.onChange(root.getState(), root);
      }

    };

    const updateItem = (item) => {

      item.statusNode.textContent = labelFor(item.status);
      item.statusNode.className = [
        'us-pill',
        toneClass(toneFor(item.status)),
        'us-upload-queue-status'
      ].join(' ');

      item.progress.setIndeterminate(
        item.status === 'uploading' &&
        !item.hasProgress
      );

      if (item.status !== 'uploading' || item.hasProgress) {
        item.progress.setValue(item.loaded);
      }

      item.cancelButton.hidden = item.status !== 'uploading';
      item.retryButton.hidden =
        item.status !== 'error' &&
        item.status !== 'cancelled';

      item.errorNode.hidden = !item.error;
      item.errorNode.textContent = item.error
        ? (item.error.message || String(item.error))
        : '';

      item.row.classList.toggle(
        'us-upload-queue-item-active',
        item.status === 'uploading'
      );

      item.row.classList.toggle(
        'us-upload-queue-item-error',
        item.status === 'error'
      );

      sync();

    };

    const createItem = (file) => {

      const total = Math.max(1, Number(file?.size) || 1);
      const progress = progressBar(0, {
        max: total,
        compact: true
      });

      const statusNode = pill('Queued', 'NEUTRAL', {
        dot: false,
        className: 'us-upload-queue-status'
      });

      const errorNode = element('span', {
        className: 'us-upload-queue-error'
      });

      errorNode.hidden = true;

      const item = {
        file,
        status: 'queued',
        loaded: 0,
        total,
        hasProgress: false,
        error: null,
        result: null,
        abortController: null,
        progress,
        statusNode,
        errorNode,
        cancelButton: null,
        retryButton: null,
        row: null
      };

      const cancelItem = actionButton('CLOSE', {
        title: 'Cancel ' + (file?.name || 'upload')
      });

      const retryItem = actionButton('REFRESH', {
        title: 'Retry ' + (file?.name || 'upload')
      });

      cancelItem.addEventListener('click', () => {
        const index = items.indexOf(item);
        if (index >= 0) root.cancel(index);
      });

      retryItem.addEventListener('click', () => {
        const index = items.indexOf(item);
        if (index >= 0) root.retry(index, true);
      });

      item.cancelButton = cancelItem;
      item.retryButton = retryItem;

      item.row = element(
        'article',
        { className: 'us-upload-queue-item' },
        element(
          'div',
          { className: 'us-upload-queue-item-header' },
          element(
            'div',
            { className: 'us-upload-queue-item-copy' },
            element('strong', {
              className: 'us-upload-queue-item-name',
              text: file?.name || 'File'
            }),
            metaLine([
              file?.type || 'file',
              formatBytes(file?.size)
            ])
          ),
          statusNode,
          element(
            'div',
            { className: 'us-upload-queue-item-actions' },
            cancelItem,
            retryItem
          )
        ),
        progress,
        errorNode
      );

      return item;

    };

    const runItem = async (item) => {

      if (item.status !== 'queued') return;

      if (typeof upload !== 'function') {
        item.status = 'error';
        item.error = new Error(
          'uploadQueue requires options.upload(file, context)'
        );
        updateItem(item);
        return;
      }

      item.status = 'uploading';
      item.error = null;
      item.hasProgress = false;
      item.abortController = new AbortController();
      updateItem(item);

      const reportProgress = (
        loaded,
        total = item.total
      ) => {

        item.total = Math.max(1, Number(total) || item.total);
        item.loaded = Math.max(
          0,
          Math.min(item.total, Number(loaded) || 0)
        );
        item.hasProgress = true;
        updateItem(item);

        options.onItemProgress?.(
          item.file,
          {
            loaded: item.loaded,
            total: item.total,
            percentage: (item.loaded / item.total) * 100
          },
          items.indexOf(item)
        );

      };

      try {

        options.onItemStart?.(
          item.file,
          items.indexOf(item)
        );

        item.result = await upload(item.file, {
          signal: item.abortController.signal,
          reportProgress,
          index: items.indexOf(item),
          item
        });

        if (item.abortController.signal.aborted) {
          throw new DOMException('Upload cancelled', 'AbortError');
        }

        item.loaded = item.total;
        item.hasProgress = true;
        item.status = 'success';
        updateItem(item);

        options.onItemComplete?.(
          item.file,
          item.result,
          items.indexOf(item)
        );

      } catch (error) {

        if (
          error?.name === 'AbortError' ||
          item.abortController?.signal.aborted
        ) {
          item.status = 'cancelled';
        } else {
          item.status = 'error';
          item.error = error;
        }

        updateItem(item);

        if (item.status === 'error') {
          options.onItemError?.(
            item.file,
            error,
            items.indexOf(item)
          );
        }

      } finally {

        item.abortController = null;

      }

    };

    root.addFiles = (incoming = []) => {

      for (const file of Array.from(incoming || [])) {
        const item = createItem(file);
        items.push(item);
        list.appendChild(item.row);
        updateItem(item);
      }

      if (options.autoStart && !running) {
        root.start();
      }

      return root;

    };

    root.start = async () => {

      if (running) return running;

      const pending = items.filter(
        (item) => item.status === 'queued'
      );

      if (!pending.length) return root.getState();

      running = (async () => {

        let cursor = 0;

        const worker = async () => {
          while (cursor < pending.length) {
            const item = pending[cursor];
            cursor += 1;
            await runItem(item);
          }
        };

        await Promise.all(
          Array.from(
            {
              length: Math.min(
                concurrency,
                pending.length
              )
            },
            () => worker()
          )
        );

        const state = root.getState();
        options.onComplete?.(state, root);
        return state;

      })();

      sync();

      try {
        return await running;
      } finally {
        running = null;
        sync();
      }

    };

    root.cancel = (index) => {

      const item = items[index];
      if (!item) return false;

      if (item.status === 'uploading') {
        item.abortController?.abort();
        return true;
      }

      if (item.status === 'queued') {
        item.status = 'cancelled';
        updateItem(item);
        return true;
      }

      return false;

    };

    root.cancelAll = () => {
      items.forEach((item, index) => {
        if (
          item.status === 'queued' ||
          item.status === 'uploading'
        ) {
          root.cancel(index);
        }
      });
      return root;
    };

    root.retry = (
      index,
      startNow = false
    ) => {

      const item = items[index];

      if (
        !item ||
        (
          item.status !== 'error' &&
          item.status !== 'cancelled'
        )
      ) {
        return false;
      }

      item.status = 'queued';
      item.error = null;
      item.loaded = 0;
      item.hasProgress = false;
      updateItem(item);

      if (startNow) root.start();
      return true;

    };

    root.retryFailed = (
      startNow = false
    ) => {

      items.forEach((item, index) => {
        if (item.status === 'error') {
          root.retry(index, false);
        }
      });

      if (startNow) root.start();
      return root;

    };

    root.getState = () =>
      items.map((item, index) => ({
        index,
        file: item.file,
        status: item.status,
        loaded: item.loaded,
        total: item.total,
        error: item.error,
        result: item.result
      }));

    startButton.addEventListener(
      'click',
      () => root.start()
    );

    retryButton.addEventListener(
      'click',
      () => root.retryFailed(true)
    );

    cancelButton.addEventListener(
      'click',
      () => root.cancelAll()
    );

    root.addFiles(files);
    sync();

    return root;

  }
  const ASSET_SELECTION_STATE = new WeakMap();

  function assetItem(item = {}, index = 0, options = {}) {

    const type =
      String(
        item.type ||
        'file'
      ).toLowerCase();

    const selected =
      Boolean(
        item &&
        typeof item === 'object' &&
        ASSET_SELECTION_STATE.has(item)
          ? ASSET_SELECTION_STATE.get(item)
          : item.selected
      );

    const checkbox =
      inputControl({
        type:
          'checkbox',
        checked:
          selected,
        ariaLabel:
          `Select ${item.name || `asset ${index + 1}`}`
      });

    checkbox.className =
      'us-asset-select';

    const preview =
      element(
        typeof options.onActivate === 'function'
          ? 'button'
          : 'div',
        {
          className: [
            'us-asset-preview',
            typeof options.onActivate === 'function'
              ? 'us-asset-preview-button'
              : ''
          ].filter(Boolean).join(' '),
          attrs:
            typeof options.onActivate === 'function'
              ? {
                type:
                  'button',
                'aria-label':
                  `Open ${item.name || `asset ${index + 1}`}`
              }
              : null
        }
      );

    if (
      type === 'video' &&
      item.previewUrl
    ) {

      preview.appendChild(
        element(
          'video',
          {
            className:
              'us-asset-preview-video',
            attrs: {
              src:
                item.previewUrl,
              poster:
                item.thumbnail,
              muted:
                true,
              playsinline:
                true,
              preload:
                item.preload ||
                'metadata'
            }
          }
        )
      );

    } else if (
      item.thumbnail ||
      (
        type === 'image' &&
        item.url
      )
    ) {

      preview.appendChild(
        element(
          'img',
          {
            className:
              'us-asset-preview-image',
            attrs: {
              src:
                item.thumbnail ||
                item.url,
              alt:
                item.alt ||
                ''
            }
          }
        )
      );

    } else {

      preview.appendChild(
        element(
          'span',
          {
            className:
              'us-asset-preview-placeholder'
          },
          icon(
            type === 'video'
              ? 'MEDIA'
              : type === 'image'
                ? 'IMAGE'
                : 'FILE'
          )
        )
      );

    }

    if (type === 'video') {

      preview.appendChild(
        element(
          'span',
          {
            className:
              'us-asset-type-icon',
            title:
              'Video'
          },
          icon(
            'PLAY'
          )
        )
      );

    }

    const actions = [];

    if (
      item.url &&
      options.open !== false
    ) {

      actions.push(
        actionButton(
          'OPEN',
          {
            title:
              'Open asset',
            onClick: (event) => {

              event.stopPropagation();

              if (
                typeof options.onOpen === 'function'
              ) {

                options.onOpen(
                  item,
                  index
                );

                return;

              }

              global.open(
                item.url,
                '_blank',
                'noopener'
              );

            }
          }
        )
      );

    }

    if (
      item.url &&
      options.download !== false
    ) {

      actions.push(
        actionButton(
          'DOWNLOAD',
          {
            title:
              'Download asset',
            onClick: (event) => {

              event.stopPropagation();

              if (
                typeof options.onDownload === 'function'
              ) {

                options.onDownload(
                  item,
                  index
                );

                return;

              }

              const link =
                document.createElement(
                  'a'
                );

              link.href =
                item.url;

              link.download =
                item.downloadName ||
                item.name ||
                '';

              link.rel =
                'noopener';

              link.click();

            }
          }
        )
      );

    }

    for (
      const actionItem of
      item.actions || []
    ) {

      actions.push(
        actionItem instanceof Node
          ? actionItem
          : actionButton(
            actionItem
          )
      );

    }

    const root =
      element(
        'article',
        {
          className:
            'us-asset-item',
          dataset: {
            index
          },
          attrs: {
            'aria-label':
              item.name ||
              `asset ${index + 1}`
          }
        },
        options.selectable === false
          ? null
          : element(
            'label',
            {
              className:
                'us-asset-select-wrap',
              title:
                'Select asset'
            },
            checkbox
          ),
        preview,
        element(
          'div',
          {
            className:
              'us-asset-item-body'
          },
          element(
            'span',
            {
              className:
                'us-asset-item-name',
              text:
                item.name ||
                `${type} ${index + 1}`
            }
          ),
          metaLine(
            [
              type,
              ...(
                Array.isArray(item.meta)
                  ? item.meta
                  : item.meta
                    ? [item.meta]
                    : []
              )
            ].filter(Boolean)
          )
        ),
        actions.length
          ? element(
            'div',
            {
              className:
                'us-asset-item-actions'
            },
            actions
          )
          : null
      );

    root.getSelected =
      () => checkbox.checked;

    root.setSelected =
      (next) => {

        const value =
          Boolean(next);

        checkbox.checked =
          value;

        if (
          item &&
          typeof item === 'object'
        ) {
          item.selected =
            value;

          ASSET_SELECTION_STATE.set(
            item,
            value
          );
        }

      };

    checkbox.addEventListener(
      'change',
      () => {

        if (
          item &&
          typeof item === 'object'
        ) {
          item.selected =
            checkbox.checked;

          ASSET_SELECTION_STATE.set(
            item,
            checkbox.checked
          );
        }

        if (
          typeof options.onSelectionChange === 'function'
        ) {

          options.onSelectionChange(
            checkbox.checked,
            item,
            index,
            root
          );

        }

      }
    );

    if (
      typeof options.onActivate === 'function'
    ) {

      preview.addEventListener(
        'click',
        () => {

          options.onActivate(
            item,
            index,
            root
          );

        }
      );

    }

    return root;

  }

  function assetTray(items = [], options = {}) {

    const normalizedItems =
      Array.from(
        items || []
      );

    const grid =
      element(
        'div',
        {
          className:
            'us-asset-grid'
        }
      );

    const root =
      element(
        'section',
        {
          className: [
            'us-asset-tray',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            'aria-label':
              options.ariaLabel ||
              options.title ||
              'Assets',
            'data-pinned':
              options.pinned
                ? 'true'
                : 'false'
          }
        }
      );

    const itemNodes = [];

    const syncSelection = () => {

      const selected =
        root.getSelected();

      if (countNode) {

        countNode.textContent =
          selected.length
            ? `${selected.length}/${normalizedItems.length}`
            : String(
              normalizedItems.length
            );

      }

      if (selectAllButton) {

        const allSelected =
          normalizedItems.length > 0 &&
          selected.length ===
            normalizedItems.length;

        selectAllButton.textContent =
          allSelected
            ? 'Clear all'
            : 'Select all';

      }

      if (
        typeof options.onSelectionChange === 'function'
      ) {

        options.onSelectionChange(
          selected,
          root
        );

      }

    };

    const countNode =
      pill(
        String(
          normalizedItems.length
        ),
        'PAGE',
        {
          dot:
            false
        }
      );

    const headerActions = [];

    if (
      typeof options.onTogglePin === 'function'
    ) {

      headerActions.push(
        button({
          icon:
            options.pinned
              ? 'UNPIN'
              : 'PIN',
          label:
            options.pinned
              ? 'Unpin'
              : 'Pin',
          size:
            'xs',
          variant:
            options.pinned
              ? 'primary'
              : null,
          className:
            'us-asset-pin-button',
          ariaLabel:
            options.pinned
              ? 'Unpin asset tray'
              : 'Pin asset tray',
          onClick: () => {

            options.onTogglePin(
              !options.pinned,
              root
            );

          }
        })
      );

    }

    let selectAllButton = null;

    if (
      typeof options.onDownloadSelected === 'function'
    ) {

      headerActions.push(
        actionButton(
          'DOWNLOAD',
          {
            title:
              'Download selected',
            onClick: () => {

              options.onDownloadSelected(
                root.getSelected(),
                root
              );

            }
          }
        )
      );

    }

    if (
      options.selectable !== false &&
      normalizedItems.length > 1
    ) {

      selectAllButton =
        button({
          label:
            'Select all',
          size:
            'xs',
          onClick: () => {

            const shouldSelect =
              root.getSelected().length !==
              normalizedItems.length;

            for (
              const node of
              itemNodes
            ) {

              node.setSelected(
                shouldSelect
              );

            }

            syncSelection();

          }
        });

      selectAllButton.classList.add(
        'us-asset-select-all'
      );

      headerActions.push(
        selectAllButton
      );

    }

    root.appendChild(
      element(
        'header',
        {
          className:
            'us-asset-tray-header'
        },
        element(
          'div',
          {
            className:
              'us-asset-tray-title'
          },
          options.icon
            ? icon(
              options.icon
            )
            : icon(
              'IMAGE'
            ),
          element(
            'span',
            {
              text:
                options.title ||
                'Assets'
            }
          ),
          countNode,
          options.pinned
            ? pill(
              'PINNED',
              'ACCENT',
              {
                dot:
                  false
              }
            )
            : null
        ),
        headerActions.length
          ? element(
            'div',
            {
              className:
                'us-asset-tray-actions'
            },
            headerActions
          )
          : null
      )
    );

    for (
      const [index, item] of
      normalizedItems.entries()
    ) {

      const node =
        assetItem(
          item,
          index,
          {
            ...options,
            onSelectionChange: () => {
              syncSelection();
            }
          }
        );

      itemNodes.push(
        node
      );

      grid.appendChild(
        node
      );

    }

    root.appendChild(
      grid
    );

    if (!normalizedItems.length) {

      root.appendChild(
        element(
          'div',
          {
            className:
              'us-asset-empty'
          },
          icon(
            'IMAGE'
          ),
          element(
            'span',
            {
              text:
                options.emptyText ||
                'No assets'
            }
          )
        )
      );

    }

    root.getSelected =
      () => itemNodes
        .map(
          (node, index) => ({
            node,
            item:
              normalizedItems[index]
          })
        )
        .filter(
          ({ node }) => node.getSelected()
        )
        .map(
          ({ item }) => item
        );

    return root;

  }
  function assetCarousel(items = [], options = {}) {

    const normalizedItems =
      Array.from(
        items || []
      );

    let index =
      Math.max(
        0,
        Math.min(
          normalizedItems.length - 1,
          Number(
            options.index ??
            0
          ) || 0
        )
      );

    const stage =
      element(
        'div',
        {
          className:
            'us-asset-carousel-stage'
        }
      );

    const titleNode =
      element(
        'span',
        {
          className:
            'us-asset-carousel-title'
        }
      );

    const indexNode =
      pill(
        '',
        'PAGE',
        {
          dot:
            false
        }
      );

    const previous =
      actionButton(
        'BACK',
        {
          title:
            'Previous asset'
        }
      );

    const next =
      actionButton(
        'FORWARD',
        {
          title:
            'Next asset'
        }
      );

    const openButton =
      actionButton(
        'OPEN',
        {
          title:
            'Open asset'
        }
      );

    const downloadButton =
      actionButton(
        'DOWNLOAD',
        {
          title:
            'Download asset'
        }
      );

    const root =
      element(
        'section',
        {
          className:
            'us-asset-carousel',
          attrs: {
            role:
              'dialog',
            'aria-label':
              options.ariaLabel ||
              'Asset carousel',
            tabindex:
              -1
          }
        },
        element(
          'header',
          {
            className:
              'us-asset-carousel-header'
          },
          titleNode,
          indexNode,
          element(
            'div',
            {
              className:
                'us-spacer'
            }
          ),
          openButton,
          downloadButton,
          actionButton(
            'CLOSE',
            {
              title:
                'Close carousel',
              onClick: () => {

                if (
                  typeof options.onClose === 'function'
                ) {
                  options.onClose();
                }

              }
            }
          )
        ),
        stage,
        element(
          'footer',
          {
            className:
              'us-asset-carousel-footer'
          },
          previous,
          element(
            'div',
            {
              className:
                'us-asset-carousel-dots',
              attrs: {
                role:
                  'tablist',
                'aria-label':
                  'Asset positions'
              }
            }
          ),
          next
        )
      );

    const dots =
      root.querySelector(
        '.us-asset-carousel-dots'
      );

    const activateExternal =
      (item) => {

        if (!item?.url) {
          return;
        }

        if (
          typeof options.onOpen === 'function'
        ) {

          options.onOpen(
            item,
            index
          );

          return;

        }

        global.open(
          item.url,
          '_blank',
          'noopener'
        );

      };

    const downloadCurrent =
      (item) => {

        if (!item?.url) {
          return;
        }

        if (
          typeof options.onDownload === 'function'
        ) {

          options.onDownload(
            item,
            index
          );

          return;

        }

        const link =
          document.createElement(
            'a'
          );

        link.href =
          item.url;

        link.download =
          item.downloadName ||
          item.name ||
          '';

        link.rel =
          'noopener';

        link.click();

      };

    const render = () => {

      const item =
        normalizedItems[index];

      stage.replaceChildren();
      dots.replaceChildren();

      if (!item) {

        titleNode.textContent =
          'No assets';

        indexNode.textContent =
          '0/0';

        previous.disabled = true;
        next.disabled = true;
        openButton.disabled = true;
        downloadButton.disabled = true;

        stage.appendChild(
          element(
            'div',
            {
              className:
                'us-asset-carousel-empty',
              text:
                options.emptyText ||
                'No assets'
            }
          )
        );

        return;

      }

      titleNode.textContent =
        item.name ||
        `Asset ${index + 1}`;

      indexNode.textContent =
        `${index + 1}/${normalizedItems.length}`;

      const type =
        String(
          item.type ||
          'file'
        ).toLowerCase();

      if (
        type === 'video' &&
        (
          item.previewUrl ||
          (
            item.url &&
            !item.thumbnail
          )
        )
      ) {

        stage.appendChild(
          element(
            'video',
            {
              className:
                'us-asset-carousel-media',
              attrs: {
                src:
                  item.previewUrl ||
                  item.url,
                poster:
                  item.thumbnail,
                controls:
                  true,
                playsinline:
                  true,
                preload:
                  'metadata'
              }
            }
          )
        );

      } else if (
        (
          type === 'image' ||
          type === 'video'
        ) &&
        (
          item.url ||
          item.thumbnail
        )
      ) {

        stage.appendChild(
          element(
            'img',
            {
              className:
                'us-asset-carousel-media',
              attrs: {
                src:
                  item.url ||
                  item.thumbnail,
                alt:
                  item.alt ||
                  item.name ||
                  ''
              }
            }
          )
        );

      } else {

        stage.appendChild(
          element(
            'div',
            {
              className:
                'us-asset-carousel-placeholder'
            },
            icon(
              type === 'video'
                ? 'MEDIA'
                : type === 'image'
                  ? 'IMAGE'
                  : 'FILE'
            ),
            element(
              'span',
              {
                text:
                  item.name ||
                  'Asset'
              }
            )
          )
        );

      }

      previous.disabled =
        normalizedItems.length <= 1;

      next.disabled =
        normalizedItems.length <= 1;

      openButton.disabled =
        !item.url;

      downloadButton.disabled =
        !item.url;

      openButton.onclick =
        () => activateExternal(item);

      downloadButton.onclick =
        () => downloadCurrent(item);

      normalizedItems.forEach(
        (asset, dotIndex) => {

          const dot =
            element(
              'button',
              {
                className: [
                  'us-asset-carousel-dot',
                  dotIndex === index
                    ? 'us-asset-carousel-dot-active'
                    : ''
                ].filter(Boolean).join(' '),
                title:
                  asset.name ||
                  `Asset ${dotIndex + 1}`,
                attrs: {
                  type:
                    'button',
                  role:
                    'tab',
                  'aria-selected':
                    dotIndex === index
                      ? 'true'
                      : 'false',
                  'aria-label':
                    `Show asset ${dotIndex + 1}`
                },
                on: {
                  click: () => {

                    index =
                      dotIndex;

                    render();

                  }
                }
              }
            );

          dots.appendChild(
            dot
          );

        }
      );

      if (
        typeof options.onChange === 'function'
      ) {

        options.onChange(
          item,
          index,
          root
        );

      }

    };

    const move =
      (delta) => {

        if (
          normalizedItems.length <= 1
        ) {
          return;
        }

        index =
          (
            index +
            delta +
            normalizedItems.length
          ) %
          normalizedItems.length;

        render();

      };

    previous.addEventListener(
      'click',
      () => move(-1)
    );

    next.addEventListener(
      'click',
      () => move(1)
    );

    root.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key === 'ArrowLeft'
        ) {

          event.preventDefault();
          move(-1);

        } else if (
          event.key === 'ArrowRight'
        ) {

          event.preventDefault();
          move(1);

        } else if (
          event.key === 'Escape' &&
          typeof options.onClose === 'function'
        ) {

          event.preventDefault();
          options.onClose();

        }

      }
    );

    root.getIndex =
      () => index;

    root.setIndex =
      (nextIndex) => {

        index =
          Math.max(
            0,
            Math.min(
              normalizedItems.length - 1,
              Number(nextIndex) || 0
            )
          );

        render();

      };

    render();

    return root;

  }

  function openAssetCarousel(items = [], options = {}) {

    const overlayRoot =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    let surface = null;

    const close = () => {

      if (!surface) {
        return;
      }

      global.removeEventListener(
        'keydown',
        onKeyDown,
        true
      );

      surface.remove();
      surface = null;

      if (
        options.restoreFocus !== false &&
        previousFocus?.isConnected
      ) {
        previousFocus.focus({
          preventScroll: true
        });
      }

      if (
        typeof options.onClose === 'function'
      ) {
        options.onClose();
      }

    };

    const carousel =
      assetCarousel(
        items,
        {
          ...options,
          onClose:
            close
        }
      );

    surface =
      element(
        'div',
        {
          className:
            'us-asset-carousel-backdrop'
        },
        carousel
      );

    const onKeyDown =
      (event) => {

        if (
          event.key === 'Escape'
        ) {

          event.preventDefault();
          close();
          return;

        }

        trapFocus(
          event,
          carousel
        );

      };

    surface.addEventListener(
      'pointerdown',
      (event) => {

        if (
          event.target === surface
        ) {
          close();
        }

      }
    );

    global.addEventListener(
      'keydown',
      onKeyDown,
      true
    );

    overlayRoot.appendChild(
      surface
    );

    focusInitial(
      carousel,
      options.initialFocus
    );

    return Object.freeze({

      element:
        surface,

      carousel,

      close

    });

  }
  function attachAssetHoverTray(
    target,
    itemsOrGetter,
    options = {}
  ) {

    if (!(target instanceof Element)) {
      return null;
    }

    const overlayRoot =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const shell =
      element(
        'div',
        {
          className:
            'us-asset-hover'
        }
      );

    shell.hidden =
      true;

    overlayRoot.appendChild(
      shell
    );

    const pinTrigger =
      actionButton(
        'PIN_ELEMENT',
        {
          title:
            'Pin asset tray'
        }
      );

    pinTrigger.classList.add(
      'us-asset-pin-trigger'
    );

    pinTrigger.hidden =
      true;

    overlayRoot.appendChild(
      pinTrigger
    );

    let hideTimer = null;
    let currentTray = null;
    let carouselController = null;

    let pinned =
      Boolean(
        options.pinned
      );

    let targetActive = false;
    let shellActive = false;

    let pin = null;
    let unpin = null;

    const getItems =
      typeof itemsOrGetter === 'function'
        ? itemsOrGetter
        : () => itemsOrGetter;

    const update = () => {

      if (shell.hidden) {
        return;
      }

      const placement =
        options.placement ||
        'bottom';

      shell.dataset.placement =
        placement;

      shell.style.setProperty(
        '--us-hover-bridge',
        `${(
          Number(
            options.offset ??
            8
          ) || 0
        ) + 5}px`
      );

      positionFloating(
        target,
        shell,
        {
          placement,
          offset:
            options.offset ??
            8,
          viewportPadding:
            options.viewportPadding ??
            8
        }
      );

      const targetRect =
        target.getBoundingClientRect();

      pinTrigger.style.left =
        `${Math.max(
          8,
          Math.min(
            global.innerWidth - 43,
            targetRect.right - 39
          )
        )}px`;

      pinTrigger.style.top =
        `${Math.max(
          8,
          targetRect.top + 4
        )}px`;

    };

    const render = () => {

      const nextItems =
        getItems() ||
        [];

      const openCarousel =
        (
          item,
          index
        ) => {

          if (
            typeof options.onActivate === 'function'
          ) {

            options.onActivate(
              item,
              index,
              currentTray
            );

            return;

          }

          carouselController?.close();

          carouselController =
            openAssetCarousel(
              nextItems,
              {
                root:
                  overlayRoot,
                theme:
                  options.theme,
                index,
                onOpen:
                  options.onOpen,
                onDownload:
                  options.onDownload,
                onClose: () => {
                  carouselController = null;
                }
              }
            );

        };

      currentTray =
        assetTray(
          nextItems,
          {
            ...options,
            pinned,
            onActivate:
              openCarousel,
            onTogglePin:
              (nextPinned) => {

                if (nextPinned) {
                  pin();
                } else {
                  unpin();
                }

              }
          }
        );

      shell.replaceChildren(
        currentTray
      );

    };

    const cancelHide = () => {

      if (hideTimer) {

        global.clearTimeout(
          hideTimer
        );

        hideTimer = null;

      }

    };

    const syncPinTrigger = () => {

      pinTrigger.replaceChildren(
        iconSlot(
          pinned
            ? 'UNPIN'
            : 'PIN'
        )
      );

      pinTrigger.title =
        pinned
          ? 'Unpin asset tray'
          : 'Pin asset tray';

      pinTrigger.setAttribute(
        'aria-label',
        pinTrigger.title
      );

      pinTrigger.classList.toggle(
        'us-asset-pin-trigger-active',
        pinned
      );

    };

    pin =
      () => {

        pinned = true;

        cancelHide();
        syncPinTrigger();

        show(false);
        render();

        if (
          typeof options.onPinChange === 'function'
        ) {

          options.onPinChange(
            true,
            shell
          );

        }

      };

    unpin =
      (
        hideImmediately = false
      ) => {

        pinned = false;

        cancelHide();
        syncPinTrigger();
        render();

        if (
          typeof options.onPinChange === 'function'
        ) {

          options.onPinChange(
            false,
            shell
          );

        }

        if (
          hideImmediately ||
          (
            !targetActive &&
            !shellActive &&
            !target.matches(':focus-within') &&
            !shell.matches(':focus-within')
          )
        ) {

          shell.hidden =
            true;

          pinTrigger.hidden =
            true;

          return;

        }

        hide();

      };

    const show = (
      refresh = true
    ) => {

      cancelHide();

      if (
        refresh ||
        shell.hidden ||
        !currentTray
      ) {
        render();
      }

      shell.hidden =
        false;

      pinTrigger.hidden =
        false;

      requestAnimationFrame(
        update
      );

    };

    const hide = () => {

      cancelHide();

      hideTimer =
        global.setTimeout(
          () => {

            const targetFocused =
              target.matches(
                ':focus-within'
              );

            const shellFocused =
              shell.matches(
                ':focus-within'
              );

            if (
              pinned ||
              targetActive ||
              shellActive ||
              targetFocused ||
              shellFocused
            ) {
              return;
            }

            shell.hidden =
              true;

            pinTrigger.hidden =
              true;

          },
          options.hideDelay ??
          360
        );

    };

    const targetEnter = () => {

      targetActive = true;
      show(true);

    };

    const targetLeave = () => {

      targetActive = false;
      hide();

    };

    const shellEnter = () => {

      shellActive = true;
      cancelHide();

    };

    const shellLeave = () => {

      shellActive = false;
      hide();

    };

    const targetFocusIn = () => {

      targetActive = true;
      show(true);

    };

    const targetFocusOut = () => {

      targetActive = false;
      hide();

    };

    const shellFocusIn = () => {

      shellActive = true;
      cancelHide();

    };

    const shellFocusOut = () => {

      shellActive = false;
      hide();

    };

    syncPinTrigger();

    target.addEventListener(
      'pointerenter',
      targetEnter
    );

    target.addEventListener(
      'pointerleave',
      targetLeave
    );

    target.addEventListener(
      'focusin',
      targetFocusIn
    );

    target.addEventListener(
      'focusout',
      targetFocusOut
    );

    shell.addEventListener(
      'pointerenter',
      shellEnter
    );

    shell.addEventListener(
      'pointerleave',
      shellLeave
    );

    shell.addEventListener(
      'focusin',
      shellFocusIn
    );

    shell.addEventListener(
      'focusout',
      shellFocusOut
    );

    pinTrigger.addEventListener(
      'pointerenter',
      cancelHide
    );

    pinTrigger.addEventListener(
      'pointerleave',
      hide
    );

    pinTrigger.addEventListener(
      'click',
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        if (pinned) {
          unpin(false);
        } else {
          pin();
        }

      }
    );

    const onKeyDown =
      (event) => {

        if (
          event.key !== 'Escape'
        ) {
          return;
        }

        if (carouselController) {

          carouselController.close();
          carouselController = null;

          return;

        }

        if (
          !shell.hidden ||
          pinned
        ) {

          event.preventDefault();

          pinned = false;
          cancelHide();
          syncPinTrigger();

          shell.hidden =
            true;

          pinTrigger.hidden =
            true;

          if (
            typeof options.onPinChange === 'function'
          ) {

            options.onPinChange(
              false,
              shell
            );

          }

        }

      };

    global.addEventListener(
      'keydown',
      onKeyDown,
      true
    );

    global.addEventListener(
      'scroll',
      update,
      true
    );

    global.addEventListener(
      'resize',
      update
    );

    return Object.freeze({

      element:
        shell,

      get tray() {
        return currentTray;
      },

      get pinned() {
        return pinned;
      },

      show,

      hide,

      pin,

      unpin,

      togglePin() {

        if (pinned) {
          unpin(false);
        } else {
          pin();
        }

      },

      update,

      refresh() {

        render();

        if (!shell.hidden) {
          requestAnimationFrame(
            update
          );
        }

      },

      destroy() {

        if (hideTimer) {
          global.clearTimeout(
            hideTimer
          );
        }

        target.removeEventListener(
          'pointerenter',
          targetEnter
        );

        target.removeEventListener(
          'pointerleave',
          targetLeave
        );

        target.removeEventListener(
          'focusin',
          targetFocusIn
        );

        target.removeEventListener(
          'focusout',
          targetFocusOut
        );

        shell.removeEventListener(
          'pointerenter',
          shellEnter
        );

        shell.removeEventListener(
          'pointerleave',
          shellLeave
        );

        shell.removeEventListener(
          'focusin',
          shellFocusIn
        );

        shell.removeEventListener(
          'focusout',
          shellFocusOut
        );

        global.removeEventListener(
          'scroll',
          update,
          true
        );

        global.removeEventListener(
          'resize',
          update
        );

        global.removeEventListener(
          'keydown',
          onKeyDown,
          true
        );

        carouselController?.close();

        pinTrigger.removeEventListener(
          'pointerenter',
          cancelHide
        );

        pinTrigger.removeEventListener(
          'pointerleave',
          hide
        );

        pinTrigger.remove();
        shell.remove();

      }

    });

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ MEDIA COMPONENTS                                                            │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function mediaProgress(value = 0, options = {}) {

    const progress =
      Math.max(
        0,
        Math.min(
          100,
          Number(value) || 0
        )
      );

    const root =
      element(
        'div',
        {
          className: 'us-media-progress',
          title:
            options.title ||
            'Media progress',
          attrs: {
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': progress
          }
        }
      );

    root.style.setProperty(
      '--us-media-progress',
      `${progress}%`
    );

    root.appendChild(
      element(
        'span',
        {
          className: 'us-media-progress-value'
        }
      )
    );

    return root;

  }

  function qualitySelect(qualities = [], current = 'Auto', onChange = null) {

    const select =
      element(
        'select',
        {
          className: 'us-select us-select-xs',
          attrs: {
            'aria-label': 'Quality'
          }
        }
      );

    for (const quality of qualities) {

      const option =
        element(
          'option',
          {
            text: quality,
            attrs: {
              value: quality
            }
          }
        );

      if (quality === current) {
        option.selected = true;
      }

      select.appendChild(
        option
      );

    }

    if (onChange) {
      select.addEventListener(
        'change',
        onChange
      );
    }

    return select;

  }

  function mediaSource(options = {}) {

    const urlGetter =
      typeof options.url === 'function'
        ? options.url
        : () => options.url;

    const actions = [];

    if (options.copy !== false) {

      actions.push(
        iconButton(
          'COPY',
          {
            title: 'Copy URL',
            onClick: () => {
              copyText(urlGetter());
            }
          }
        )
      );

    }

    if (options.open !== false) {

      actions.push(
        iconButton(
          'EXTERNAL',
          {
            title: 'Open in new tab',
            onClick: () => {

              const url =
                urlGetter();

              if (url) {

                global.open(
                  url,
                  '_blank',
                  'noopener,noreferrer'
                );

              }

            }
          }
        )
      );

    }

    if (options.command) {

      actions.push(
        copyCommandButton({
          command:
            options.command,
          title:
            options.commandTitle ||
            'Copy command'
        })
      );

    }

    if (options.download) {

      actions.push(
        iconButton(
          'DOWNLOAD',
          {
            title: 'Download',
            onClick:
              options.download
          }
        )
      );

    }

    return element(
      'div',
      {
        className: 'us-media-source-row'
      },
      element(
        'div',
        {
          className: 'us-media-source-main'
        },
        element(
          'span',
          {
            className: 'us-media-source-label',
            text:
              options.label ||
              'Media source'
          }
        ),
        element(
          'span',
          {
            className: 'us-media-source-url',
            text:
              urlGetter() || ''
          }
        )
      ),
      actionStrip(
        actions.map((action) => {

          return {
            icon: null,
            custom: action
          };

        })
      )
    );

  }

  function mediaControls(options = {}) {

    const urlGetter =
      typeof options.url === 'function'
        ? options.url
        : () => options.url;

    const actionGroup =
      element(
        'div',
        {
          className:
            'us-media-controls-actions'
        },
        iconButton(
          'LAYERS',
          {
            title: 'Inspect options',
            onClick: options.onVariants
          }
        ),
        iconButton(
          'REFRESH',
          {
            title: 'Reload source',
            onClick: options.onReload
          }
        ),
        options.command
          ? copyCommandButton({
            command:
              options.command,
            title:
              options.commandTitle ||
              'Copy command'
          })
          : null,
        iconButton(
          'FULLSCREEN',
          {
            title: 'Fullscreen',
            onClick: options.onFullscreen
          }
        )
      );

    return element(
      'div',
      {
        className: 'us-media-controls',
        attrs: {
          'aria-label':
            options.ariaLabel ||
            'Media controls'
        }
      },
      iconButton(
        options.playing
          ? 'PAUSE'
          : 'PLAY',
        {
          title:
            options.playing
              ? 'Pause'
              : 'Play',
          onClick: options.onPlay
        }
      ),
      iconButton(
        options.muted
          ? 'MUTE'
          : 'VOLUME',
        {
          title:
            options.muted
              ? 'Unmute'
              : 'Mute',
          onClick: options.onMute
        }
      ),
      mediaProgress(
        options.progress || 0,
        {
          title:
            options.progressTitle ||
            'Progress'
        }
      ),
      options.time
        ? element(
          'span',
          {
            className: 'us-media-time',
            text: options.time
          }
        )
        : null,
      qualitySelect(
        options.qualities || ['Auto'],
        options.quality || 'Auto',
        options.onQuality
      ),
      actionGroup
    );

  }

  function sourceInspector(options = {}) {

    const url =
      options.url || '';

    const sourceActions = [];

    sourceActions.push({
      icon: 'COPY',
      title: 'Copy URL',
      onClick: () => {
        copyText(url);
      }
    });

    sourceActions.push({
      icon: 'EXTERNAL',
      title: 'Open in new tab',
      onClick: () => {

        if (url) {

          global.open(
            url,
            '_blank',
            'noopener,noreferrer'
          );

        }

      }
    });

    if (options.command) {

      sourceActions.push(
        copyCommandButton({
          command:
            options.command,
          title:
            options.commandTitle ||
            'Copy command'
        })
      );

    }

    const children = [
      element(
        'div',
        {
          className: 'us-media-source-row'
        },
        element(
          'div',
          {
            className: 'us-media-source-main'
          },
          element(
            'span',
            {
              className: 'us-media-source-label',
              text:
                options.sourceLabel ||
                'Resolved source'
            }
          ),
          element(
            'span',
            {
              className: 'us-media-source-url',
              text: url
            }
          )
        ),
        actionStrip(
          sourceActions
        )
      ),

      element(
        'div',
        {
          className: 'us-row us-row-wrap'
        },
        options.active
          ? badge('ACTIVE', 'SUCCESS')
          : null,
        options.type
          ? badge(options.type)
          : null,
        options.size
          ? badge(options.size)
          : null,
        options.state
          ? badge(options.state, 'ACCENT')
          : null
      ),

      mediaControls({
        url,
        playing: options.playing,
        muted: options.muted,
        progress: options.progress,
        time: options.time,
        qualities: options.qualities,
        quality: options.quality,
        onPlay: options.onPlay,
        onMute: options.onMute,
        onQuality: options.onQuality,
        onVariants: options.onVariants,
        onReload: options.onReload,
        onFullscreen: options.onFullscreen
      })
    ];

    if (options.variants?.length) {

      children.push(
        dataTable({
          mono: true,
          columns: [
            {
              key: 'quality',
              label: 'Option',
              width: '110px'
            },
            {
              key: 'size',
              label: 'Size',
              width: '90px'
            },
            {
              key: 'type',
              label: 'Type',
              width: '110px'
            },
            {
              key: 'path',
              label: 'Path'
            }
          ],
          rows: options.variants
        })
      );

    }

    return panel({
      title:
        options.title ||
        'Stream inspector',
      subtitle:
        options.subtitle ||
        'Resolved media and rendition state',
      actions:
        options.actions || [],
      selected:
        options.selected !== false,
      children
    });

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ PAGE-OVERLAY COMPONENTS                                                      │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  /*
   * Most userscripts augment an existing page. These helpers create scoped roots
   * and detached overlay controls without requiring a full application shell.
   */

  function createRoot(options = {}) {

    const root =
      element(
        options.tagName || 'div',
        {
          id: options.id,
          className: [
            options.overlay
              ? 'us-overlay-root'
              : '',
            options.inline
              ? 'us-inline-root'
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            'data-userscript-root': '',
            'data-us-theme':
              options.theme ||
              'dark'
          }
        },
        options.children || []
      );

    return root;

  }

  function setTheme(root, theme) {

    if (!(root instanceof HTMLElement)) {
      return;
    }

    root.setAttribute(
      'data-us-theme',
      theme === 'light'
        ? 'light'
        : 'dark'
    );

  }

  function ensureOverlayRoot(options = {}) {

    const id =
      options.id ||
      'userscript-overlay-root';

    let root =
      document.getElementById(id);

    if (root) {

      setTheme(
        root,
        options.theme ||
        root.getAttribute('data-us-theme') ||
        'dark'
      );

      return root;

    }

    root =
      createRoot({
        id,
        theme:
          options.theme ||
          'dark',
        overlay:
          true
      });

    (
      document.body ||
      document.documentElement
    ).appendChild(root);

    return root;

  }

  function positionFloating(anchor, floating, options = {}) {

    if (
      !(anchor instanceof Element) ||
      !(floating instanceof HTMLElement)
    ) {
      return;
    }

    const placement =
      options.placement ||
      'top';

    const offset =
      Number(options.offset ?? 8);

    const padding =
      Number(options.viewportPadding ?? 8);

    const anchorRect =
      anchor.getBoundingClientRect();

    const floatingRect =
      floating.getBoundingClientRect();

    let left =
      anchorRect.left;

    let top =
      anchorRect.top -
      floatingRect.height -
      offset;

    if (placement === 'bottom') {

      top =
        anchorRect.bottom +
        offset;

    }

    if (placement === 'left') {

      left =
        anchorRect.left -
        floatingRect.width -
        offset;

      top =
        anchorRect.top +
        (
          anchorRect.height -
          floatingRect.height
        ) / 2;

    }

    if (placement === 'right') {

      left =
        anchorRect.right +
        offset;

      top =
        anchorRect.top +
        (
          anchorRect.height -
          floatingRect.height
        ) / 2;

    }

    if (
      placement === 'top' ||
      placement === 'bottom'
    ) {

      left =
        anchorRect.left +
        (
          anchorRect.width -
          floatingRect.width
        ) / 2;

    }

    left =
      Math.max(
        padding,
        Math.min(
          left,
          global.innerWidth -
          floatingRect.width -
          padding
        )
      );

    top =
      Math.max(
        padding,
        Math.min(
          top,
          global.innerHeight -
          floatingRect.height -
          padding
        )
      );

    floating.style.left =
      `${Math.round(left)}px`;

    floating.style.top =
      `${Math.round(top)}px`;

  }

  function floatingAction(options = {}) {

    return element(
      'button',
      {
        className: [
          'us-floating-action',
          options.label
            ? 'us-floating-action-labeled'
            : '',
          `us-floating-action-${options.position || 'bottom-right'}`,
          options.className || ''
        ].filter(Boolean).join(' '),
        title: options.title,
        attrs: {
          type: 'button',
          'aria-label':
            options.ariaLabel ||
            options.title ||
            options.label ||
            'Userscript action'
        },
        on: options.onClick
          ? {
            click:
              options.onClick
          }
          : null
      },
      options.icon
        ? iconSlot(
          options.icon,
          {
            className:
              options.iconClassName,
            iconOptions:
              options.iconOptions
          }
        )
        : null,
      options.label || null
    );

  }

  function hoverToolbar(actions = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-hover-toolbar',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role: 'toolbar',
          'aria-label':
            options.ariaLabel ||
            'Userscript actions'
        }
      },
      options.label
        ? element(
          'span',
          {
            className:
              'us-hover-toolbar-label',
            text:
              options.label
          }
        )
        : null,
      actionStrip(actions)
    );

  }

  function attachHoverToolbar(target, actions = [], options = {}) {

    if (!(target instanceof Element)) {
      return null;
    }

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const control =
      hoverToolbar(
        actions,
        options
      );

    control.hidden = true;

    root.appendChild(
      control
    );

    let hideTimer = null;

    const update = () => {

      if (control.hidden) {
        return;
      }

      positionFloating(
        target,
        control,
        {
          placement:
            options.placement ||
            'top',
          offset:
            options.offset ?? 7
        }
      );

    };

    const show = () => {

      if (hideTimer) {
        global.clearTimeout(hideTimer);
      }

      control.hidden = false;

      requestAnimationFrame(
        update
      );

    };

    const hide = () => {

      hideTimer =
        global.setTimeout(
          () => {
            control.hidden = true;
          },
          options.hideDelay ?? 120
        );

    };

    target.addEventListener(
      'pointerenter',
      show
    );

    target.addEventListener(
      'pointerleave',
      hide
    );

    control.addEventListener(
      'pointerenter',
      show
    );

    control.addEventListener(
      'pointerleave',
      hide
    );

    global.addEventListener(
      'scroll',
      update,
      true
    );

    global.addEventListener(
      'resize',
      update
    );

    return Object.freeze({

      element:
        control,

      show,

      hide,

      update,

      destroy() {

        if (hideTimer) {
          global.clearTimeout(hideTimer);
        }

        target.removeEventListener(
          'pointerenter',
          show
        );

        target.removeEventListener(
          'pointerleave',
          hide
        );

        control.removeEventListener(
          'pointerenter',
          show
        );

        control.removeEventListener(
          'pointerleave',
          hide
        );

        global.removeEventListener(
          'scroll',
          update,
          true
        );

        global.removeEventListener(
          'resize',
          update
        );

        control.remove();

      }

    });

  }

  function popover(options = {}) {

    const root =
      element(
        'section',
        {
          className: [
            'us-popover',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              options.role ||
              'dialog',
            'aria-label':
              options.ariaLabel ||
              options.title ||
              'Userscript popover'
          }
        }
      );

    if (
      options.title ||
      options.actions?.length
    ) {

      root.appendChild(
        element(
          'header',
          {
            className:
              'us-popover-header'
          },
          element(
            'div',
            {
              className:
                'us-popover-title',
              text:
                options.title ||
                ''
            }
          ),
          ...(options.actions || [])
        )
      );

    }

    root.appendChild(
      element(
        'div',
        {
          className:
            'us-popover-body'
        },
        options.children || []
      )
    );

    if (options.footer?.length) {

      root.appendChild(
        element(
          'footer',
          {
            className:
              'us-popover-footer'
          },
          options.footer
        )
      );

    }

    return root;

  }

  function attachPopover(anchor, content, options = {}) {

    if (!(anchor instanceof Element)) {
      return null;
    }

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const surface =
      content instanceof Node
        ? content
        : popover(content || {});

    surface.hidden = true;

    root.appendChild(
      surface
    );

    const update = () => {

      if (surface.hidden) {
        return;
      }

      positionFloating(
        anchor,
        surface,
        {
          placement:
            options.placement ||
            'bottom',
          offset:
            options.offset ?? 8
        }
      );

    };

    const open = () => {

      surface.hidden = false;

      requestAnimationFrame(
        update
      );

    };

    const close = () => {
      surface.hidden = true;
    };

    const toggle = () => {

      if (surface.hidden) {
        open();
      } else {
        close();
      }

    };

    if (options.trigger !== false) {

      anchor.addEventListener(
        'click',
        toggle
      );

    }

    global.addEventListener(
      'scroll',
      update,
      true
    );

    global.addEventListener(
      'resize',
      update
    );

    return Object.freeze({

      element:
        surface,

      open,

      close,

      toggle,

      update,

      destroy() {

        if (options.trigger !== false) {

          anchor.removeEventListener(
            'click',
            toggle
          );

        }

        global.removeEventListener(
          'scroll',
          update,
          true
        );

        global.removeEventListener(
          'resize',
          update
        );

        surface.remove();

      }

    });

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ TEXT SELECTION / ANNOTATION                                                  │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const DEFAULT_HIGHLIGHT_COLORS =
    Object.freeze([
      Object.freeze({
        name:
          'Yellow',
        value:
          '#ffe66d'
      }),
      Object.freeze({
        name:
          'Pink',
        value:
          '#ff8ac4'
      }),
      Object.freeze({
        name:
          'Green',
        value:
          '#8ee6a8'
      }),
      Object.freeze({
        name:
          'Blue',
        value:
          '#8bc7ff'
      }),
      Object.freeze({
        name:
          'Orange',
        value:
          '#ffb86c'
      })
    ]);

  function textNodesInRange(range) {

    if (!(range instanceof Range)) {
      return [];
    }

    const common =
      range.commonAncestorContainer;

    if (
      common.nodeType ===
      Node.TEXT_NODE
    ) {

      return range.toString()
        ? [common]
        : [];

    }

    const walker =
      document.createTreeWalker(
        common,
        NodeFilter.SHOW_TEXT
      );

    const nodes = [];

    let node =
      walker.nextNode();

    while (node) {

      try {

        if (
          node.nodeValue &&
          range.intersectsNode(node)
        ) {
          nodes.push(node);
        }

      } catch (error) {

        // Ignore detached/transient nodes.

      }

      node =
        walker.nextNode();

    }

    return nodes;

  }

  function annotateTextRange(
    range,
    options = {}
  ) {

    if (
      !(range instanceof Range) ||
      range.collapsed
    ) {
      return [];
    }

    const type =
      options.type === 'underline'
        ? 'underline'
        : options.type === 'note'
          ? 'note'
          : 'highlight';

    const color =
      options.color ||
      DEFAULT_HIGHLIGHT_COLORS[0].value;

    const nodes =
      textNodesInRange(range);

    const wrappers = [];

    for (const originalNode of nodes) {

      if (!originalNode.isConnected) {
        continue;
      }

      let start =
        originalNode === range.startContainer
          ? range.startOffset
          : 0;

      let end =
        originalNode === range.endContainer
          ? range.endOffset
          : originalNode.nodeValue.length;

      start =
        Math.max(
          0,
          Math.min(
            originalNode.nodeValue.length,
            start
          )
        );

      end =
        Math.max(
          start,
          Math.min(
            originalNode.nodeValue.length,
            end
          )
        );

      if (start === end) {
        continue;
      }

      let selectedNode =
        originalNode;

      if (
        end <
        selectedNode.nodeValue.length
      ) {

        selectedNode.splitText(
          end
        );

      }

      if (start > 0) {

        selectedNode =
          selectedNode.splitText(
            start
          );

      }

      const wrapper =
        document.createElement(
          'span'
        );

      wrapper.className = [
        'us-text-annotation',
        type === 'underline'
          ? 'us-text-annotation-underline'
          : type === 'note'
            ? 'us-text-annotation-note'
            : 'us-text-annotation-highlight'
      ].join(' ');

      wrapper.dataset.usAnnotation =
        type;

      if (
        options.id != null
      ) {

        wrapper.dataset.usAnnotationId =
          String(options.id);

      }

      if (type === 'underline') {

        wrapper.style.textDecorationLine =
          'underline';

        wrapper.style.textDecorationThickness =
          options.thickness ||
          '2px';

        wrapper.style.textUnderlineOffset =
          options.offset ||
          '0.16em';

        wrapper.style.textDecorationColor =
          options.underlineColor ||
          'currentColor';

      } else if (type === 'note') {

        const note =
          String(
            options.note ||
            ''
          );

        wrapper.dataset.usAnnotationNote =
          note;

        wrapper.tabIndex =
          0;

        wrapper.style.textDecorationLine =
          'underline';

        wrapper.style.textDecorationStyle =
          'dotted';

        wrapper.style.textDecorationThickness =
          options.thickness ||
          '2px';

        wrapper.style.textUnderlineOffset =
          options.offset ||
          '0.18em';

        wrapper.style.textDecorationColor =
          options.noteColor ||
          options.underlineColor ||
          '#ff5ca8';

        wrapper.style.cursor =
          'help';

      } else {

        wrapper.dataset.usHighlightColor =
          color;

        wrapper.style.backgroundColor =
          color;

        wrapper.style.color =
          options.highlightTextColor ||
          '#111111';

        wrapper.style.boxDecorationBreak =
          'clone';

        wrapper.style.webkitBoxDecorationBreak =
          'clone';

      }

      selectedNode.parentNode.insertBefore(
        wrapper,
        selectedNode
      );

      wrapper.appendChild(
        selectedNode
      );

      wrappers.push(
        wrapper
      );

    }

    return wrappers;

  }

  function clearTextAnnotations(range) {

    if (!(range instanceof Range)) {
      return [];
    }

    const candidates =
      new Set();

    const commonElement =
      range.commonAncestorContainer.nodeType ===
        Node.ELEMENT_NODE
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement;

    if (commonElement) {

      const enclosing =
        commonElement.closest?.(
          '[data-us-annotation]'
        );

      if (enclosing) {
        candidates.add(enclosing);
      }

      for (
        const node of
        commonElement.querySelectorAll?.(
          '[data-us-annotation]'
        ) ||
        []
      ) {

        try {

          if (
            range.intersectsNode(node)
          ) {
            candidates.add(node);
          }

        } catch (error) {

          // Ignore detached/transient nodes.

        }

      }

    }

    const removed = [];

    for (const wrapper of candidates) {

      if (!wrapper.isConnected) {
        continue;
      }

      const parent =
        wrapper.parentNode;

      if (!parent) {
        continue;
      }

      wrapper._usAnnotationTooltip
        ?.destroy?.();

      while (
        wrapper.firstChild
      ) {

        parent.insertBefore(
          wrapper.firstChild,
          wrapper
        );

      }

      wrapper.remove();

      parent.normalize?.();

      removed.push(
        wrapper
      );

    }

    return removed;

  }

  function textOffsetRange(
    root,
    start,
    end
  ) {

    if (
      !(root instanceof Node) ||
      start < 0 ||
      end < start
    ) {
      return null;
    }

    const walker =
      document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT
      );

    let position = 0;
    let startNode = null;
    let startOffset = 0;
    let endNode = null;
    let endOffset = 0;
    let node =
      root.nodeType === Node.TEXT_NODE
        ? root
        : walker.nextNode();

    while (node) {

      const length =
        node.nodeValue?.length ||
        0;

      const next =
        position +
        length;

      if (
        !startNode &&
        start >= position &&
        start <= next
      ) {

        startNode =
          node;

        startOffset =
          Math.min(
            length,
            start - position
          );

      }

      if (
        startNode &&
        end >= position &&
        end <= next
      ) {

        endNode =
          node;

        endOffset =
          Math.min(
            length,
            end - position
          );

        break;

      }

      position =
        next;

      node =
        root.nodeType === Node.TEXT_NODE
          ? null
          : walker.nextNode();

    }

    if (
      !startNode ||
      !endNode
    ) {
      return null;
    }

    const range =
      document.createRange();

    range.setStart(
      startNode,
      startOffset
    );

    range.setEnd(
      endNode,
      endOffset
    );

    return range;

  }

  function createTextQuoteAnchor(
    range,
    root = document.body,
    options = {}
  ) {

    if (
      !(range instanceof Range) ||
      range.collapsed ||
      !(root instanceof Node)
    ) {
      return null;
    }

    const exact =
      range.toString();

    if (!exact) {
      return null;
    }

    const before =
      document.createRange();

    before.selectNodeContents(
      root
    );

    try {

      before.setEnd(
        range.startContainer,
        range.startOffset
      );

    } catch (error) {

      return null;

    }

    const start =
      before.toString().length;

    const fullText =
      root.textContent ||
      '';

    const end =
      start +
      exact.length;

    const context =
      Math.max(
        0,
        Number(
          options.context ??
          40
        ) || 0
      );

    return Object.freeze({

      exact,

      prefix:
        fullText.slice(
          Math.max(
            0,
            start - context
          ),
          start
        ),

      suffix:
        fullText.slice(
          end,
          end + context
        ),

      start

    });

  }

  function resolveTextQuoteAnchor(
    anchor,
    root = document.body
  ) {

    if (
      !anchor ||
      typeof anchor.exact !== 'string' ||
      !anchor.exact ||
      !(root instanceof Node)
    ) {
      return null;
    }

    const text =
      root.textContent ||
      '';

    const candidates = [];

    let index =
      text.indexOf(
        anchor.exact
      );

    while (index !== -1) {

      const prefix =
        String(
          anchor.prefix ||
          ''
        );

      const suffix =
        String(
          anchor.suffix ||
          ''
        );

      let prefixScore = 0;
      let suffixScore = 0;

      const before =
        text.slice(
          Math.max(
            0,
            index - prefix.length
          ),
          index
        );

      const after =
        text.slice(
          index +
          anchor.exact.length,
          index +
          anchor.exact.length +
          suffix.length
        );

      const prefixLimit =
        Math.min(
          prefix.length,
          before.length
        );

      for (
        let offset = 1;
        offset <= prefixLimit;
        offset += 1
      ) {

        if (
          prefix[
            prefix.length - offset
          ] !==
          before[
            before.length - offset
          ]
        ) {
          break;
        }

        prefixScore += 1;

      }

      const suffixLimit =
        Math.min(
          suffix.length,
          after.length
        );

      for (
        let offset = 0;
        offset < suffixLimit;
        offset += 1
      ) {

        if (
          suffix[offset] !==
          after[offset]
        ) {
          break;
        }

        suffixScore += 1;

      }

      const positionDistance =
        Number.isFinite(
          Number(anchor.start)
        )
          ? Math.abs(
            index -
            Number(anchor.start)
          )
          : 0;

      candidates.push({

        index,

        score:
          prefixScore +
          suffixScore,

        positionDistance

      });

      index =
        text.indexOf(
          anchor.exact,
          index + 1
        );

    }

    if (!candidates.length) {
      return null;
    }

    candidates.sort(
      (
        left,
        right
      ) => {

        if (
          right.score !==
          left.score
        ) {

          return (
            right.score -
            left.score
          );

        }

        return (
          left.positionDistance -
          right.positionDistance
        );

      }
    );

    const selected =
      candidates[0];

    const range =
      textOffsetRange(
        root,
        selected.index,
        selected.index +
          anchor.exact.length
      );

    if (
      !range ||
      range.toString() !==
        anchor.exact
    ) {
      return null;
    }

    return range;

  }
  function textSelectionToolbar(options = {}) {

    const colors =
      options.colors?.length
        ? options.colors
        : DEFAULT_HIGHLIGHT_COLORS;

    let activeColor =
      options.color ||
      (
        typeof colors[0] === 'string'
          ? colors[0]
          : colors[0]?.value
      ) ||
      '#ffe66d';

    const root =
      element(
        'div',
        {
          className: [
            'us-selection-toolbar',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              'toolbar',
            'aria-label':
              options.ariaLabel ||
              'Text selection tools'
          }
        }
      );

    const tools =
      element(
        'div',
        {
          className:
            'us-selection-tools'
        }
      );

    const tool =
      (
        iconName,
        label,
        onClick,
        extraClass = ''
      ) =>
        button({
          icon:
            iconName,
          label,
          size:
            'xs',
          className: [
            'us-selection-tool',
            extraClass
          ].filter(Boolean).join(' '),
          onClick
        });

    if (
      options.copy !== false
    ) {

      tools.appendChild(
        tool(
          'COPY',
          'Copy',
          options.onCopy
        )
      );

    }

    tools.appendChild(
      tool(
        'UNDERLINE',
        'Underline',
        options.onUnderline
      )
    );

    const highlightButton =
      tool(
        'HIGHLIGHT',
        'Highlight',
        () => {

          options.onHighlight?.(
            activeColor
          );

        },
        'us-selection-tool-highlight'
      );

    tools.appendChild(
      highlightButton
    );

    const colorButtons = [];

    const syncColors = () => {

      for (
        const entry of
        colorButtons
      ) {

        const active =
          entry.color ===
          activeColor;

        entry.node.classList.toggle(
          'us-selection-color-active',
          active
        );

        entry.node.setAttribute(
          'aria-pressed',
          String(active)
        );

      }

      highlightButton.style.setProperty(
        '--us-selection-active-color',
        activeColor
      );

    };

    for (
      const entry of
      colors
    ) {

      const color =
        typeof entry === 'string'
          ? entry
          : entry.value;

      const label =
        typeof entry === 'string'
          ? entry
          : (
            entry.name ||
            entry.label ||
            entry.value
          );

      const colorButton =
        element(
          'button',
          {
            className:
              'us-selection-tool us-selection-color',
            title:
              `Highlight ${label}`,
            attrs: {
              type:
                'button',
              'aria-label':
                `Highlight ${label}`,
              'aria-pressed':
                'false'
            },
            on: {
              click: () => {

                activeColor =
                  color;

                syncColors();

                if (
                  options.applyColorImmediately !==
                    false
                ) {

                  options.onHighlight?.(
                    color
                  );

                }

              }
            }
          },
          element(
            'span',
            {
              className:
                'us-selection-color-swatch',
              attrs: {
                'aria-hidden':
                  'true'
              },
              style: {
                backgroundColor:
                  color
              }
            }
          ),
          element(
            'span',
            {
              className:
                'us-selection-tool-label',
              text:
                label
            }
          )
        );

      colorButtons.push({
        color,
        node:
          colorButton
      });

      tools.appendChild(
        colorButton
      );

    }

    let noteComposer = null;
    let noteInput = null;

    if (
      options.note !== false
    ) {

      const noteButton =
        tool(
          'DOCUMENT',
          'Add note',
          () => {

            const open =
              noteComposer.hidden;

            noteComposer.hidden =
              !open;

            noteButton.setAttribute(
              'aria-expanded',
              String(open)
            );

            if (open) {

              requestAnimationFrame(
                () =>
                  noteInput.focus()
              );

            }

          },
          'us-selection-tool-note'
        );

      noteButton.setAttribute(
        'aria-expanded',
        'false'
      );

      tools.appendChild(
        noteButton
      );

      noteInput =
        textareaControl({
          className:
            'us-selection-note-input',
          rows:
            3,
          placeholder:
            options.notePlaceholder ||
            'Annotation note…',
          ariaLabel:
            'Annotation note'
        });

      const closeComposer =
        () => {

          noteComposer.hidden =
            true;

          noteButton.setAttribute(
            'aria-expanded',
            'false'
          );

        };

      const saveNote =
        () => {

          const note =
            noteInput.value.trim();

          if (!note) {
            return;
          }

          options.onNote?.(
            note
          );

          noteInput.value =
            '';

          closeComposer();

        };

      noteComposer =
        element(
          'div',
          {
            className:
              'us-selection-note-composer'
          },
          noteInput,
          element(
            'div',
            {
              className:
                'us-selection-note-actions'
            },
            button({
              label:
                'Cancel',
              size:
                'xs',
              onClick:
                closeComposer
            }),
            button({
              label:
                'Save note',
              size:
                'xs',
              variant:
                'primary',
              onClick:
                saveNote
            })
          )
        );

      noteComposer.hidden =
        true;

      noteInput.addEventListener(
        'keydown',
        (event) => {

          if (
            (
              event.ctrlKey ||
              event.metaKey
            ) &&
            event.key === 'Enter'
          ) {

            event.preventDefault();
            saveNote();

          } else if (
            event.key === 'Escape'
          ) {

            event.preventDefault();
            closeComposer();

          }

        }
      );

    }

    if (
      options.clear !== false
    ) {

      tools.appendChild(
        tool(
          'RESTORE',
          'Clear',
          options.onClear
        )
      );

    }

    root.appendChild(
      tools
    );

    if (noteComposer) {

      root.appendChild(
        noteComposer
      );

    }

    syncColors();

    return root;

  }

  function attachTextSelectionToolbar(options = {}) {

    const target =
      options.target ||
      document.body;

    if (!(target instanceof Element)) {
      return null;
    }

    const overlayRoot =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let activeRange = null;
    let activeText = '';

    let enabled =
      options.enabled !== false;

    const finishAction = () => {

      if (
        options.clearSelectionAfterAction !== false
      ) {

        global.getSelection?.()
          ?.removeAllRanges();

      }

      hide();

    };

    const getUsableSelection =
      () => {

        const selection =
          global.getSelection?.();

        if (
          !selection ||
          selection.rangeCount === 0 ||
          selection.isCollapsed
        ) {
          return null;
        }

        const range =
          selection.getRangeAt(0);

        const container =
          range.commonAncestorContainer.nodeType ===
            Node.ELEMENT_NODE
            ? range.commonAncestorContainer
            : range.commonAncestorContainer.parentElement;

        if (
          !container ||
          !target.contains(container) ||
          container.closest(
            '[data-userscript-root]'
          ) ||
          (
            typeof options.exclude === 'string' &&
            container.closest(
              options.exclude
            )
          ) ||
          (
            typeof options.shouldIgnoreSelection === 'function' &&
            options.shouldIgnoreSelection(
              range,
              container
            )
          )
        ) {
          return null;
        }

        const text =
          selection.toString();

        if (!text.trim()) {
          return null;
        }

        return {
          range:
            range.cloneRange(),
          text
        };

      };

    const toolbar =
      textSelectionToolbar({
        ...options,
        onCopy: async () => {

          if (!activeText) {
            return;
          }

          await copyText(
            activeText
          );

          if (
            typeof options.onCopy === 'function'
          ) {

            options.onCopy(
              activeText,
              activeRange
            );

          }

          finishAction();

        },
        onUnderline: () => {

          if (!activeRange) {
            return;
          }

          const wrappers =
            annotateTextRange(
              activeRange,
              {
                type:
                  'underline'
              }
            );

          if (
            typeof options.onAnnotate === 'function'
          ) {

            options.onAnnotate(
              {
                type:
                  'underline',
                text:
                  activeText,
                wrappers,
                range:
                  activeRange
              }
            );

          }

          finishAction();

        },
        onHighlight: (color) => {

          if (!activeRange) {
            return;
          }

          const wrappers =
            annotateTextRange(
              activeRange,
              {
                type:
                  'highlight',
                color
              }
            );

          if (
            typeof options.onAnnotate === 'function'
          ) {

            options.onAnnotate(
              {
                type:
                  'highlight',
                color,
                text:
                  activeText,
                wrappers,
                range:
                  activeRange
              }
            );

          }

          finishAction();

        },
        onNote: (note) => {

          if (
            !activeRange ||
            !note
          ) {
            return;
          }

          const noteColor =
            getComputedStyle(
              overlayRoot
            )
              .getPropertyValue(
                '--us-accent'
              )
              .trim() ||
            '#ff5ca8';

          const wrappers =
            annotateTextRange(
              activeRange,
              {
                type:
                  'note',
                note,
                noteColor
              }
            );

          for (
            const wrapper of
            wrappers
          ) {

            wrapper._usAnnotationTooltip =
              attachTooltip(
                wrapper,
                note,
                {
                  root:
                    overlayRoot,
                  theme:
                    options.theme ||
                    'dark',
                  placement:
                    options.noteTooltipPlacement ||
                    'top'
                }
              );

          }

          if (
            typeof options.onAnnotate === 'function'
          ) {

            options.onAnnotate(
              {
                type:
                  'note',
                note,
                text:
                  activeText,
                wrappers,
                range:
                  activeRange
              }
            );

          }

          finishAction();

        },
        onClear: () => {

          if (!activeRange) {
            return;
          }

          const removed =
            clearTextAnnotations(
              activeRange
            );

          if (
            typeof options.onClear === 'function'
          ) {

            options.onClear(
              {
                text:
                  activeText,
                removed,
                range:
                  activeRange
              }
            );

          }

          finishAction();

        }
      });

    const shell =
      element(
        'div',
        {
          className:
            'us-selection-toolbar-shell'
        },
        toolbar
      );

    shell.hidden =
      true;

    overlayRoot.appendChild(
      shell
    );

    const position = () => {

      if (
        shell.hidden ||
        !activeRange
      ) {
        return;
      }

      let rect =
        activeRange.getBoundingClientRect();

      if (
        !rect.width &&
        !rect.height
      ) {

        const rects =
          activeRange.getClientRects();

        rect =
          rects[
            rects.length - 1
          ];

      }

      if (!rect) {
        return;
      }

      if (
        rect.bottom < 0 ||
        rect.top > global.innerHeight ||
        rect.right < 0 ||
        rect.left > global.innerWidth
      ) {

        shell.hidden =
          true;

        return;

      }

      const shellRect =
        shell.getBoundingClientRect();

      const padding =
        8;

      const gap =
        options.offset ??
        8;

      let left =
        rect.left +
        (
          rect.width -
          shellRect.width
        ) / 2;

      left =
        Math.max(
          padding,
          Math.min(
            global.innerWidth -
              shellRect.width -
              padding,
            left
          )
        );

      const maxTop =
        Math.max(
          padding,
          global.innerHeight -
            shellRect.height -
            padding
        );

      const clampTop =
        (value) =>
          Math.max(
            padding,
            Math.min(
              maxTop,
              value
            )
          );

      const aboveTop =
        clampTop(
          rect.top -
            shellRect.height -
            gap
        );

      const belowTop =
        clampTop(
          rect.bottom +
            gap
        );

      const obstacles =
        Array.from(
          overlayRoot.querySelectorAll(
            '.us-floating-window, .us-annotation-mode-bar'
          )
        ).filter(
          (node) =>
            !node.hidden &&
            node !== shell
        );

      const collides =
        (candidateTop) =>
          obstacles.some(
            (node) => {

              const obstacle =
                node.getBoundingClientRect();

              return !(
                left +
                  shellRect.width <=
                    obstacle.left ||
                left >=
                  obstacle.right ||
                candidateTop +
                  shellRect.height <=
                    obstacle.top ||
                candidateTop >=
                  obstacle.bottom
              );

            }
          );

      const aboveFits =
        rect.top -
          shellRect.height -
          gap >=
            padding;

      const belowFits =
        rect.bottom +
          gap +
          shellRect.height <=
            global.innerHeight -
              padding;

      let top =
        aboveTop;

      if (
        !aboveFits ||
        collides(
          aboveTop
        )
      ) {

        if (
          belowFits ||
          !collides(
            belowTop
          )
        ) {

          top =
            belowTop;

        }

      }

      shell.style.left =
        `${left}px`;

      shell.style.top =
        `${top}px`;

    };

    const showForSelection = () => {

      if (!enabled) {
        hide();
        return;
      }

      const usable =
        getUsableSelection();

      if (!usable) {

        if (
          !shell.matches(
            ':hover'
          ) &&
          !shell.matches(
            ':focus-within'
          )
        ) {
          hide();
        }

        return;

      }

      activeRange =
        usable.range;

      activeText =
        usable.text;

      shell.hidden =
        false;

      requestAnimationFrame(
        position
      );

    };

    const hide = () => {

      shell.hidden =
        true;

      activeRange =
        null;

      activeText =
        '';

    };

    /*
     * Prevent toolbar controls from collapsing the document selection before
     * their click handlers can act on the cloned range.
     */
    shell.addEventListener(
      'pointerdown',
      (event) => {

        if (
          event.target.closest(
            'button'
          )
        ) {
          event.preventDefault();
        }

      }
    );

    const onPointerUp =
      () => {

        if (!enabled) {
          return;
        }

        global.setTimeout(
          showForSelection,
          0
        );

      };

    const onKeyUp =
      (event) => {

        if (
          event.key === 'Escape'
        ) {

          hide();
          return;

        }

        if (!enabled) {
          return;
        }

        global.setTimeout(
          showForSelection,
          0
        );

      };

    const onKeyDown =
      (event) => {

        if (
          event.key === 'Escape' &&
          !shell.hidden
        ) {

          event.preventDefault();
          hide();

        }

      };

    target.addEventListener(
      'pointerup',
      onPointerUp
    );

    target.addEventListener(
      'keyup',
      onKeyUp
    );

    global.addEventListener(
      'keydown',
      onKeyDown,
      true
    );

    global.addEventListener(
      'scroll',
      position,
      true
    );

    global.addEventListener(
      'resize',
      position
    );

    return Object.freeze({

      element:
        shell,

      get range() {
        return activeRange;
      },

      get text() {
        return activeText;
      },

      get enabled() {
        return enabled;
      },

      setEnabled(next) {

        enabled =
          Boolean(next);

        if (!enabled) {
          hide();
        }

        if (
          typeof options.onEnabledChange === 'function'
        ) {

          options.onEnabledChange(
            enabled
          );

        }

        return enabled;

      },

      toggleEnabled() {

        return this.setEnabled(
          !enabled
        );

      },

      show:
        showForSelection,

      hide,

      destroy() {

        target.removeEventListener(
          'pointerup',
          onPointerUp
        );

        target.removeEventListener(
          'keyup',
          onKeyUp
        );

        global.removeEventListener(
          'keydown',
          onKeyDown,
          true
        );

        global.removeEventListener(
          'scroll',
          position,
          true
        );

        global.removeEventListener(
          'resize',
          position
        );

        shell.remove();

      }

    });

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ PAGE ANNOTATION MODE                                                        │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function annotationModeControl(options = {}) {

    const placement =
      options.placement ||
      'floating';

    const label =
      options.label ||
      'Annotate page';

    let enabled =
      Boolean(
        options.enabled
      );

    const notify =
      (next) => {

        if (
          typeof options.onToggle === 'function'
        ) {

          options.onToggle(
            next
          );

        }

      };

    if (placement === 'floating') {

      const control =
        floatingAction({
          icon:
            'HIGHLIGHT',
          title:
            enabled
              ? 'Disable page annotation'
              : 'Enable page annotation',
          ariaLabel:
            enabled
              ? 'Disable page annotation'
              : 'Enable page annotation',
          position:
            options.position ||
            'top-right',
          className: [
            'us-annotation-mode-floating',
            options.className ||
              ''
          ].filter(Boolean).join(' '),
          onClick: () => {

            control.setEnabled(
              !enabled
            );

            notify(
              enabled
            );

          }
        });

      control.setAttribute(
        'aria-pressed',
        String(enabled)
      );

      control.setEnabled =
        (next) => {

          enabled =
            Boolean(next);

          control.classList.toggle(
            'us-annotation-mode-active',
            enabled
          );

          control.setAttribute(
            'aria-pressed',
            String(enabled)
          );

          control.title =
            enabled
              ? 'Disable page annotation'
              : 'Enable page annotation';

          control.setAttribute(
            'aria-label',
            control.title
          );

          return enabled;

        };

      control.setEnabled(
        enabled
      );

      return control;

    }

    const statusNode =
      pill(
        enabled
          ? 'ON'
          : 'OFF',
        enabled
          ? 'SUCCESS'
          : 'NEUTRAL',
        {
          dot:
            false,
          className:
            'us-annotation-mode-status'
        }
      );

    const toggleButton =
      button({
        icon:
          'HIGHLIGHT',
        label:
          enabled
            ? 'Disable'
            : 'Enable',
        size:
          'xs',
        variant:
          enabled
            ? 'primary'
            : null,
        className:
          'us-annotation-mode-toggle'
      });

    const control =
      element(
        'div',
        {
          className: [
            'us-annotation-mode-bar',
            placement === 'header'
              ? 'us-annotation-mode-bar-top'
              : 'us-annotation-mode-bar-bottom',
            options.className ||
              ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              'toolbar',
            'aria-label':
              options.ariaLabel ||
              'Page annotation mode'
          }
        },
        element(
          'div',
          {
            className:
              'us-annotation-mode-identity'
          },
          icon(
            'HIGHLIGHT'
          ),
          element(
            'span',
            {
              className:
                'us-annotation-mode-title',
              text:
                label
            }
          ),
          statusNode
        ),
        element(
          'span',
          {
            className:
              'us-annotation-mode-help',
            text:
              options.helpText ||
              'Select text anywhere on the page'
          }
        ),
        toggleButton
      );

    control.setEnabled =
      (next) => {

        enabled =
          Boolean(next);

        control.classList.toggle(
          'us-annotation-mode-active',
          enabled
        );

        statusNode.textContent =
          enabled
            ? 'ON'
            : 'OFF';

        statusNode.className = [
          'us-pill',
          toneClass(
            enabled
              ? 'SUCCESS'
              : 'NEUTRAL'
          ),
          'us-annotation-mode-status'
        ].join(' ');

        toggleButton.classList.toggle(
          'us-button-primary',
          enabled
        );

        toggleButton.lastChild.textContent =
          enabled
            ? 'Disable'
            : 'Enable';

        toggleButton.setAttribute(
          'aria-pressed',
          String(enabled)
        );

        return enabled;

      };

    toggleButton.addEventListener(
      'click',
      () => {

        control.setEnabled(
          !enabled
        );

        notify(
          enabled
        );

      }
    );

    control.setEnabled(
      enabled
    );

    return control;

  }

  function attachPageAnnotationMode(options = {}) {

    const target =
      options.target ||
      document.body;

    if (!(target instanceof Element)) {
      return null;
    }

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let enabled =
      Boolean(
        options.enabled
      );

    const selectionController =
      attachTextSelectionToolbar({
        ...options,
        target,
        root,
        enabled
      });

    const control =
      annotationModeControl({
        placement:
          options.placement ||
          'floating',
        position:
          options.position,
        label:
          options.label,
        helpText:
          options.helpText,
        ariaLabel:
          options.ariaLabel,
        className:
          options.controlClassName,
        enabled,
        onToggle:
          (next) => {

            setEnabled(
              next
            );

          }
      });

    root.appendChild(
      control
    );

    const setEnabled =
      (next) => {

        enabled =
          Boolean(next);

        selectionController.setEnabled(
          enabled
        );

        control.setEnabled?.(
          enabled
        );

        if (
          typeof options.onModeChange === 'function'
        ) {

          options.onModeChange(
            enabled
          );

        }

        return enabled;

      };

    setEnabled(
      enabled
    );

    return Object.freeze({

      control,

      selection:
        selectionController,

      get enabled() {
        return enabled;
      },

      setEnabled,

      toggle() {

        return setEnabled(
          !enabled
        );

      },

      destroy() {

        selectionController.destroy();

        control.remove();

      }

    });

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ STORAGE / DRAGGABLE WINDOWS / NOTEPAD                                       │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function storageAdapter(options = {}) {

    const get =
      options.get ||
      (
        async (
          key,
          fallback = null
        ) => fallback
      );

    const set =
      options.set ||
      (
        async () => {}
      );

    const remove =
      options.remove ||
      options.delete ||
      (
        async () => {}
      );

    return Object.freeze({

      async get(
        key,
        fallback = null
      ) {

        const value =
          await Promise.resolve(
            get(
              key,
              fallback
            )
          );

        return value == null
          ? fallback
          : value;

      },

      async set(
        key,
        value
      ) {

        return Promise.resolve(
          set(
            key,
            value
          )
        );

      },

      async remove(key) {

        return Promise.resolve(
          remove(key)
        );

      }

    });

  }
    function draggableWindow(options = {}) {

    const body =
      element(
        'div',
        {
          className:
            'us-floating-window-body'
        },
        options.children || []
      );

    const footer =
      options.footer?.length
        ? element(
          'footer',
          {
            className:
              'us-floating-window-footer'
          },
          options.footer
        )
        : null;

    let minimized = false;
    let maximized = false;
    let restoreRect = null;
    let drag = null;
    let resize = null;

    const closeButton =
      actionButton(
        'CLOSE',
        {
          title:
            'Close',
          onClick:
            options.onClose
        }
      );

    const minimizeButton =
      options.minimizable === false
        ? null
        : iconButton(
          'MINUS',
          {
            title:
              'Minimize'
          }
        );

    const maximizeButton =
      options.maximizable === false
        ? null
        : iconButton(
          'FULLSCREEN',
          {
            title:
              'Maximize'
          }
        );

    const headerActions =
      [
        ...(options.actions || []),
        minimizeButton,
        maximizeButton,
        closeButton
      ].filter(Boolean);

    const header =
      element(
        'header',
        {
          className:
            'us-floating-window-header'
        },
        element(
          'span',
          {
            className:
              'us-floating-window-grip',
            attrs: {
              'aria-hidden':
                'true'
            }
          },
          icon(
            'GRIP'
          )
        ),
        element(
          'div',
          {
            className:
              'us-floating-window-title',
            text:
              options.title ||
              ''
          }
        ),
        element(
          'div',
          {
            className:
              'us-floating-window-actions'
          },
          headerActions
        )
      );

    const resizeHandle =
      options.resizable === false
        ? null
        : element(
          'button',
          {
            className:
              'us-floating-window-resize',
            title:
              'Resize window',
            attrs: {
              type:
                'button',
              'aria-label':
                'Resize window'
            }
          }
        );

    const root =
      element(
        'section',
        {
          className: [
            'us-floating-window',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            role:
              'dialog',
            'aria-label':
              options.ariaLabel ||
              options.title ||
              'Floating window',
            tabindex:
              -1
          }
        },
        header,
        body,
        footer,
        resizeHandle
      );

    const px =
      (value) =>
        typeof value === 'number'
          ? String(value) + 'px'
          : String(value);

    if (options.width) {
      root.style.width =
        px(
          options.width
        );
    }

    if (options.height) {
      root.style.height =
        px(
          options.height
        );
    }

    const getRect =
      () => {

        const rect =
          root.getBoundingClientRect();

        return {
          left:
            rect.left,
          top:
            rect.top,
          width:
            rect.width,
          height:
            rect.height
        };

      };

    const clampSize =
      (
        width,
        height
      ) => {

        const minWidth =
          Math.min(
            Number(
              options.minWidth ??
              280
            ) || 280,
            global.innerWidth - 16
          );

        const minHeight =
          Math.min(
            Number(
              options.minHeight ??
              120
            ) || 120,
            global.innerHeight - 16
          );

        return {
          width:
            Math.max(
              minWidth,
              Math.min(
                global.innerWidth - 16,
                Number(width) ||
                  minWidth
              )
            ),
          height:
            Math.max(
              minHeight,
              Math.min(
                global.innerHeight - 16,
                Number(height) ||
                  minHeight
              )
            )
        };

      };

    const setSize =
      (
        width,
        height
      ) => {

        if (maximized) {
          return getRect();
        }

        const next =
          clampSize(
            width,
            height
          );

        root.style.width =
          String(
            next.width
          ) +
          'px';

        root.style.height =
          String(
            next.height
          ) +
          'px';

        return next;

      };

    const clampPosition =
      (
        left,
        top
      ) => {

        const rect =
          root.getBoundingClientRect();

        const padding =
          8;

        return {
          left:
            Math.max(
              padding,
              Math.min(
                global.innerWidth -
                  rect.width -
                  padding,
                Number(left) ||
                  0
              )
            ),
          top:
            Math.max(
              padding,
              Math.min(
                global.innerHeight -
                  Math.min(
                    rect.height,
                    global.innerHeight -
                      padding * 2
                  ) -
                  padding,
                Number(top) ||
                  0
              )
            )
        };

      };

    const setPosition =
      (
        left,
        top
      ) => {

        if (maximized) {
          return getRect();
        }

        const next =
          clampPosition(
            left,
            top
          );

        root.style.left =
          String(
            next.left
          ) +
          'px';

        root.style.top =
          String(
            next.top
          ) +
          'px';

        root.style.right =
          'auto';

        root.style.bottom =
          'auto';

        return next;

      };

    const notifyState =
      () => {

        if (
          typeof options.onStateChange ===
            'function'
        ) {

          options.onStateChange(
            {
              minimized,
              maximized,
              rect:
                getRect()
            },
            root
          );

        }

      };

    const rememberRect =
      () => {

        if (
          !minimized &&
          !maximized
        ) {

          restoreRect =
            getRect();

        }

      };

    const restore =
      () => {

        const previous =
          restoreRect;

        minimized = false;
        maximized = false;

        root.classList.remove(
          'us-floating-window-minimized',
          'us-floating-window-maximized'
        );

        if (previous) {

          const nextSize =
            clampSize(
              previous.width,
              previous.height
            );

          root.style.width =
            String(
              nextSize.width
            ) +
            'px';

          root.style.height =
            String(
              nextSize.height
            ) +
            'px';

          setPosition(
            previous.left,
            previous.top
          );

        }

        if (maximizeButton) {

          maximizeButton.title =
            'Maximize';

          maximizeButton.setAttribute(
            'aria-label',
            'Maximize'
          );

          maximizeButton.querySelector(
            'svg'
          )?.replaceWith(
            icon(
              'FULLSCREEN'
            )
          );

        }

        notifyState();

        return root;

      };

    const minimize =
      () => {

        if (minimized) {
          return restore();
        }

        rememberRect();

        if (maximized) {

          maximized = false;

          root.classList.remove(
            'us-floating-window-maximized'
          );

        }

        minimized = true;

        root.classList.add(
          'us-floating-window-minimized'
        );

        notifyState();

        return root;

      };

    const maximize =
      () => {

        if (maximized) {
          return restore();
        }

        rememberRect();

        minimized = false;
        maximized = true;

        root.classList.remove(
          'us-floating-window-minimized'
        );

        root.classList.add(
          'us-floating-window-maximized'
        );

        root.style.left =
          '8px';

        root.style.top =
          '8px';

        root.style.right =
          'auto';

        root.style.bottom =
          'auto';

        root.style.width =
          String(
            Math.max(
              1,
              global.innerWidth -
                16
            )
          ) +
          'px';

        root.style.height =
          String(
            Math.max(
              1,
              global.innerHeight -
                16
            )
          ) +
          'px';

        if (maximizeButton) {

          maximizeButton.title =
            'Restore';

          maximizeButton.setAttribute(
            'aria-label',
            'Restore'
          );

          maximizeButton.querySelector(
            'svg'
          )?.replaceWith(
            icon(
              'RESTORE'
            )
          );

        }

        notifyState();

        return root;

      };

    const onPointerMove =
      (event) => {

        if (!drag) {
          return;
        }

        setPosition(
          drag.left +
            event.clientX -
            drag.x,
          drag.top +
            event.clientY -
            drag.y
        );

      };

    const endDrag =
      () => {

        if (!drag) {
          return;
        }

        drag = null;

        root.classList.remove(
          'us-floating-window-dragging'
        );

        global.removeEventListener(
          'pointermove',
          onPointerMove
        );

        global.removeEventListener(
          'pointerup',
          endDrag
        );

        global.removeEventListener(
          'pointercancel',
          endDrag
        );

        if (
          typeof options.onMove ===
            'function'
        ) {

          const rect =
            getRect();

          options.onMove(
            {
              left:
                rect.left,
              top:
                rect.top
            },
            root
          );

        }

      };

    const onResizeMove =
      (event) => {

        if (!resize) {
          return;
        }

        setSize(
          resize.width +
            event.clientX -
            resize.x,
          resize.height +
            event.clientY -
            resize.y
        );

      };

    const endResize =
      () => {

        if (!resize) {
          return;
        }

        resize = null;

        root.classList.remove(
          'us-floating-window-resizing'
        );

        global.removeEventListener(
          'pointermove',
          onResizeMove
        );

        global.removeEventListener(
          'pointerup',
          endResize
        );

        global.removeEventListener(
          'pointercancel',
          endResize
        );

        options.onResize?.(
          root.getSize(),
          root
        );

      };

    header.addEventListener(
      'pointerdown',
      (event) => {

        if (
          maximized ||
          minimized ||
          event.button !== 0 ||
          event.target.closest(
            'button, a, input, select, textarea'
          )
        ) {
          return;
        }

        const rect =
          getRect();

        drag = {
          x:
            event.clientX,
          y:
            event.clientY,
          left:
            rect.left,
          top:
            rect.top
        };

        root.classList.add(
          'us-floating-window-dragging'
        );

        global.addEventListener(
          'pointermove',
          onPointerMove
        );

        global.addEventListener(
          'pointerup',
          endDrag
        );

        global.addEventListener(
          'pointercancel',
          endDrag
        );

        event.preventDefault();

      }
    );

    header.addEventListener(
      'dblclick',
      (event) => {

        if (
          options.maximizable === false ||
          event.target.closest(
            'button, a, input, select, textarea'
          )
        ) {
          return;
        }

        maximize();

      }
    );

    resizeHandle?.addEventListener(
      'pointerdown',
      (event) => {

        if (
          event.button !== 0 ||
          maximized ||
          minimized
        ) {
          return;
        }

        const rect =
          getRect();

        restoreRect =
          rect;

        resize = {
          x:
            event.clientX,
          y:
            event.clientY,
          width:
            rect.width,
          height:
            rect.height
        };

        root.classList.add(
          'us-floating-window-resizing'
        );

        global.addEventListener(
          'pointermove',
          onResizeMove
        );

        global.addEventListener(
          'pointerup',
          endResize
        );

        global.addEventListener(
          'pointercancel',
          endResize
        );

        event.preventDefault();

      }
    );

    minimizeButton?.addEventListener(
      'click',
      minimize
    );

    maximizeButton?.addEventListener(
      'click',
      maximize
    );

    root.setPosition =
      setPosition;

    root.getPosition =
      () => {

        const rect =
          getRect();

        return {
          left:
            rect.left,
          top:
            rect.top
        };

      };

    root.setSize =
      setSize;

    root.getSize =
      () => {

        const rect =
          getRect();

        return {
          width:
            rect.width,
          height:
            rect.height
        };

      };

    root.minimize =
      minimize;

    root.maximize =
      maximize;

    root.restore =
      restore;

    root.toggleMaximize =
      maximize;

    root.fitToViewport =
      () => {

        if (maximized) {

          root.style.left =
            '8px';

          root.style.top =
            '8px';

          root.style.width =
            String(
              Math.max(
                1,
                global.innerWidth -
                  16
              )
            ) +
            'px';

          root.style.height =
            String(
              Math.max(
                1,
                global.innerHeight -
                  16
              )
            ) +
            'px';

          return;

        }

        const rect =
          getRect();

        if (!minimized) {

          setSize(
            rect.width,
            rect.height
          );

        }

        setPosition(
          rect.left,
          rect.top
        );

      };

    root.destroyInteractions =
      () => {

        endDrag();
        endResize();

      };

    Object.defineProperties(
      root,
      {
        minimized: {
          get:
            () => minimized
        },
        maximized: {
          get:
            () => maximized
        }
      }
    );

    return root;

  }


  function openDraggableWindow(options = {}) {

    const overlayRoot =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let surface = null;

    const close = () => {

      if (!surface) {
        return;
      }

      surface.destroyInteractions?.();

      global.removeEventListener(
        'resize',
        onResize
      );

      if (
        options.closeOnEscape !== false
      ) {

        global.removeEventListener(
          'keydown',
          onKeyDown,
          true
        );

      }

      surface.remove();
      surface = null;

      if (
        typeof options.onClose === 'function'
      ) {
        options.onClose();
      }

    };

    surface =
      draggableWindow({
        ...options,
        onClose:
          close
      });

    const onResize =
      () => {

        if (!surface) {
          return;
        }

        surface.fitToViewport?.();

      };

    const onKeyDown =
      (event) => {

        if (
          event.key === 'Escape'
        ) {

          event.preventDefault();
          close();

        }

      };

    overlayRoot.appendChild(
      surface
    );

    const initialLeft =
      options.left ??
      Math.max(
        12,
        global.innerWidth -
          surface.getBoundingClientRect().width -
          24
      );

    const initialTop =
      options.top ??
      56;

    surface.setPosition(
      initialLeft,
      initialTop
    );

    global.addEventListener(
      'resize',
      onResize
    );

    if (
      options.closeOnEscape !== false
    ) {

      global.addEventListener(
        'keydown',
        onKeyDown,
        true
      );

    }

    requestAnimationFrame(
      () => surface?.focus()
    );

    return Object.freeze({

      get element() {
        return surface;
      },

      close,

      setPosition(
        left,
        top
      ) {

        surface?.setPosition(
          left,
          top
        );

      },

      getPosition() {

        return surface?.getPosition() ||
          null;

      },

      setSize(
        width,
        height
      ) {

        return surface?.setSize(
          width,
          height
        ) || null;

      },

      getSize() {

        return surface?.getSize() ||
          null;

      },

      minimize() {

        return surface?.minimize() ||
          null;

      },

      maximize() {

        return surface?.maximize() ||
          null;

      },

      restore() {

        return surface?.restore() ||
          null;

      },

      toggleMaximize() {

        return surface?.toggleMaximize() ||
          null;

      },

      get minimized() {
        return Boolean(
          surface?.minimized
        );
      },

      get maximized() {
        return Boolean(
          surface?.maximized
        );
      }

    });

  }
  function openNotepad(options = {}) {

    const storage =
      options.storage ||
      storageAdapter();

    const key =
      options.key ||
      'userscript:notepad';

    const textarea =
      textareaControl({
        className:
          'us-notepad-textarea',
        rows:
          options.rows ||
          12,
        placeholder:
          options.placeholder ||
          'Write notes here…',
        ariaLabel:
          options.ariaLabel ||
          'Notepad'
      });

    const statusNode =
      element(
        'span',
        {
          className:
            'us-notepad-status',
          text:
            'Loading…',
          attrs: {
            'aria-live':
              'polite'
          }
        }
      );

    const clearButton =
      button({
        label:
          'Clear',
        size:
          'xs'
      });

    let saveTimer = null;
    let closed = false;

    const save =
      async () => {

        if (closed) {
          return;
        }

        if (saveTimer) {

          global.clearTimeout(
            saveTimer
          );

          saveTimer = null;

        }

        statusNode.textContent =
          'Saving…';

        try {

          await storage.set(
            key,
            textarea.value
          );

          statusNode.textContent =
            'Saved';

          if (
            typeof options.onSave === 'function'
          ) {

            options.onSave(
              textarea.value
            );

          }

        } catch (error) {

          statusNode.textContent =
            'Save failed';

          if (
            typeof options.onError === 'function'
          ) {

            options.onError(
              error
            );

          }

        }

      };

    const scheduleSave =
      () => {

        if (saveTimer) {

          global.clearTimeout(
            saveTimer
          );

        }

        statusNode.textContent =
          'Unsaved';

        saveTimer =
          global.setTimeout(
            save,
            options.saveDelay ??
            350
          );

      };

    textarea.addEventListener(
      'input',
      scheduleSave
    );

    textarea.addEventListener(
      'keydown',
      (event) => {

        if (
          (
            event.ctrlKey ||
            event.metaKey
          ) &&
          event.key.toLowerCase() === 's'
        ) {

          event.preventDefault();
          save();

        }

      }
    );

    clearButton.addEventListener(
      'click',
      async () => {

        textarea.value =
          '';

        await save();

        textarea.focus();

      }
    );

    const controller =
      openDraggableWindow({
        root:
          options.root,
        theme:
          options.theme,
        title:
          options.title ||
          'Notepad',
        width:
          options.width ||
          460,
        height:
          options.height,
        left:
          options.left,
        top:
          options.top,
        closeOnEscape:
          options.closeOnEscape,
        className:
          'us-notepad-window',
        children: [
          textarea
        ],
        footer: [
          statusNode,
          element(
            'div',
            {
              className:
                'us-spacer'
            }
          ),
          clearButton,
          button({
            label:
              'Save',
            size:
              'xs',
            variant:
              'primary',
            onClick:
              save
          })
        ],
        onMove:
          (
            position,
            root
          ) => {

            if (
              options.persistPosition !== false
            ) {

              Promise.resolve(
                storage.set(
                  `${key}:position`,
                  position
                )
              ).catch(
                () => {}
              );

            }

            if (
              typeof options.onMove === 'function'
            ) {

              options.onMove(
                position,
                root
              );

            }

          },
        onClose: () => {

          if (saveTimer) {

            global.clearTimeout(
              saveTimer
            );

            saveTimer = null;

            Promise.resolve(
              storage.set(
                key,
                textarea.value
              )
            ).catch(
              () => {}
            );

          }

          closed = true;

          if (
            typeof options.onClose === 'function'
          ) {
            options.onClose();
          }

        }
      });

    const ready =
      Promise.all([
        Promise.resolve(
          storage.get(
            key,
            options.defaultValue ||
            ''
          )
        ),
        options.persistPosition === false
          ? Promise.resolve(null)
          : Promise.resolve(
            storage.get(
              `${key}:position`,
              null
            )
          )
      ])
        .then(
          (
            [
              value,
              position
            ]
          ) => {

            if (closed) {
              return;
            }

            textarea.value =
              String(
                value ??
                ''
              );

            if (
              position &&
              Number.isFinite(
                Number(position.left)
              ) &&
              Number.isFinite(
                Number(position.top)
              )
            ) {

              controller.setPosition(
                Number(position.left),
                Number(position.top)
              );

            }

            statusNode.textContent =
              'Saved';

          }
        )
        .catch(
          (error) => {

            if (closed) {
              return;
            }

            statusNode.textContent =
              'Load failed';

            if (
              typeof options.onError === 'function'
            ) {

              options.onError(
                error
              );

            }

          }
        );

    return Object.freeze({

      ...controller,

      textarea,

      storage,

      key,

      ready,

      save,

      getValue() {
        return textarea.value;
      },

      setValue(
        value,
        saveNow = true
      ) {

        textarea.value =
          String(
            value ??
            ''
          );

        if (saveNow) {
          return save();
        }

        statusNode.textContent =
          'Unsaved';

        return Promise.resolve();

      }

    });

  }
  function modal(options = {}) {

    const closeButton =
      iconButton(
        'CLOSE',
        {
          title:
            'Close',
          onClick:
            options.onClose
        }
      );

    const card =
      element(
        'section',
        {
          className:
            'us-modal',
          attrs: {
            role: 'dialog',
            'aria-modal': 'true',
            tabindex: -1,
            'aria-label':
              options.ariaLabel ||
              options.title ||
              'Userscript dialog'
          }
        },
        element(
          'header',
          {
            className:
              'us-modal-header'
          },
          element(
            'div',
            {
              className:
                'us-modal-title',
              text:
                options.title ||
                ''
            }
          ),
          closeButton
        ),
        element(
          'div',
          {
            className:
              'us-modal-body'
          },
          options.children || []
        ),
        options.footer?.length
          ? element(
            'footer',
            {
              className:
                'us-modal-footer'
            },
            options.footer
          )
          : null
      );

    const backdrop =
      element(
        'div',
        {
          className:
            'us-modal-backdrop'
        },
        card
      );

    return backdrop;

  }

  function openModal(options = {}) {

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    let surface = null;
    let card = null;

    const onKeyDown =
      (event) => {

        if (!surface || !card) {
          return;
        }

        if (
          event.key === 'Escape' &&
          options.closeOnEscape !== false
        ) {
          event.preventDefault();
          close();
          return;
        }

        trapFocus(
          event,
          card
        );

      };

    const close = () => {

      if (!surface) {
        return;
      }

      global.removeEventListener(
        'keydown',
        onKeyDown,
        true
      );

      surface.remove();
      surface = null;
      card = null;

      if (
        options.restoreFocus !== false &&
        previousFocus?.isConnected
      ) {
        previousFocus.focus({
          preventScroll: true
        });
      }

      if (typeof options.onClose === 'function') {
        options.onClose();
      }

    };

    surface =
      modal({
        ...options,
        onClose:
          close
      });

    card =
      surface.querySelector(
        '.us-modal'
      );

    surface.addEventListener(
      'pointerdown',
      (event) => {

        if (
          event.target === surface &&
          options.closeOnBackdrop !== false
        ) {
          close();
        }

      }
    );

    root.appendChild(
      surface
    );

    global.addEventListener(
      'keydown',
      onKeyDown,
      true
    );

    focusInitial(
      card,
      options.initialFocus
    );

    return Object.freeze({

      element:
        surface,

      dialog:
        card,

      close

    });

  }

  function drawer(options = {}) {

    const closeButton =
      iconButton(
        'CLOSE',
        {
          title:
            'Close',
          onClick:
            options.onClose
        }
      );

    return element(
      'aside',
      {
        className: [
          'us-drawer',
          options.side === 'left'
            ? 'us-drawer-left'
            : 'us-drawer-right',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role: 'dialog',
          'aria-label':
            options.ariaLabel ||
            options.title ||
            'Userscript drawer'
        }
      },
      element(
        'header',
        {
          className:
            'us-drawer-header'
        },
        element(
          'div',
          {
            className:
              'us-drawer-title',
            text:
              options.title ||
              ''
          }
        ),
        closeButton
      ),
      element(
        'div',
        {
          className:
            'us-drawer-body'
        },
        options.children || []
      )
    );

  }

  function openDrawer(options = {}) {

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let surface = null;

    const close = () => {

      if (!surface) {
        return;
      }

      surface.remove();
      surface = null;

      if (typeof options.onClose === 'function') {
        options.onClose();
      }

    };

    surface =
      drawer({
        ...options,
        onClose:
          close
      });

    root.appendChild(
      surface
    );

    return Object.freeze({

      element:
        surface,

      close

    });

  }

  function toast(options = {}) {

    const actionDescriptor =
      options.action
        ? resolveAction(
          options.action,
          options.actionOptions || {}
        )
        : null;

    const toastIcon =
      options.icon ||
      actionDescriptor?.icon ||
      null;

    const toastTitle =
      options.title ||
      actionDescriptor?.label ||
      null;

    return element(
      'div',
      {
        className: [
          'us-toast',
          toneClass(
            options.tone ||
            options.level ||
            'NEUTRAL'
          )
        ].join(' '),
        attrs: {
          role:
            options.role ||
            'status'
        }
      },
      toastIcon
        ? element(
          'span',
          {
            className:
              'us-toast-icon'
          },
          icon(
            toastIcon
          )
        )
        : null,
      element(
        'div',
        {
          className:
            'us-column us-column-tight'
        },
        toastTitle
          ? element(
            'div',
            {
              className:
                'us-toast-title',
              text:
                toastTitle
            }
          )
          : null,
        options.message
          ? element(
            'div',
            {
              className:
                'us-toast-message',
              text:
                options.message
            }
          )
          : null
      )
    );

  }

  function showActionToast(
    actionNameOrDescriptor,
    options = {}
  ) {

    return showToast({
      ...options,
      action:
        actionNameOrDescriptor
    });

  }

  function showToast(options = {}) {

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    let stack =
      root.querySelector(
        '.us-toast-stack'
      );

    if (!stack) {

      stack =
        element(
          'div',
          {
            className:
              'us-toast-stack'
          }
        );

      root.appendChild(
        stack
      );

    }

    const item =
      toast(options);

    stack.appendChild(
      item
    );

    const remove = () => {
      item.remove();
    };

    if (options.duration !== 0) {

      global.setTimeout(
        remove,
        options.duration ?? 2600
      );

    }

    return Object.freeze({

      element:
        item,

      remove

    });

  }

  function tooltip(text, options = {}) {

    return element(
      'div',
      {
        className:
          'us-tooltip',
        attrs: {
          role: 'tooltip'
        },
        text
      }
    );

  }

  function attachTooltip(target, text, options = {}) {

    if (!(target instanceof Element)) {
      return null;
    }

    const root =
      options.root ||
      ensureOverlayRoot({
        theme:
          options.theme ||
          'dark'
      });

    const tip =
      tooltip(
        text,
        options
      );

    tip.hidden = true;

    root.appendChild(
      tip
    );

    const update = () => {

      if (tip.hidden) {
        return;
      }

      positionFloating(
        target,
        tip,
        {
          placement:
            options.placement ||
            'top',
          offset:
            options.offset ?? 6
        }
      );

    };

    const show = () => {

      tip.hidden = false;

      requestAnimationFrame(
        update
      );

    };

    const hide = () => {
      tip.hidden = true;
    };

    target.addEventListener(
      'pointerenter',
      show
    );

    target.addEventListener(
      'pointerleave',
      hide
    );

    target.addEventListener(
      'focus',
      show
    );

    target.addEventListener(
      'blur',
      hide
    );

    return Object.freeze({

      element:
        tip,

      show,

      hide,

      destroy() {

        target.removeEventListener(
          'pointerenter',
          show
        );

        target.removeEventListener(
          'pointerleave',
          hide
        );

        target.removeEventListener(
          'focus',
          show
        );

        target.removeEventListener(
          'blur',
          hide
        );

        tip.remove();

      }

    });

  }

  function inlineRoot(options = {}) {

    return createRoot({
      tagName:
        options.tagName ||
        'span',
      theme:
        options.theme ||
        'dark',
      inline:
        true,
      className:
        options.className,
      children:
        options.children
    });

  }

  function inlineInspector(actions = [], options = {}) {

    return element(
      'span',
      {
        className:
          'us-inline-inspector',
        attrs: {
          role: 'group',
          'aria-label':
            options.ariaLabel ||
            'Userscript inline controls'
        }
      },
      actionStrip(actions)
    );

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ TOOL NAVIGATION                                                             │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function toolNav(options = {}) {

    const root =
      element(
        'nav',
        {
          className:
            'us-tool-nav',
          attrs: {
            'aria-label':
              options.ariaLabel ||
              'Tool sections'
          }
        }
      );

    let active =
      options.active ??
      options.items?.[0]?.key ??
      null;

    const buttons = [];

    const sync = () => {

      for (const item of buttons) {

        const isActive =
          item.dataset.key ===
          String(active);

        item.classList.toggle(
          'us-tool-nav-item-active',
          isActive
        );

        item.setAttribute(
          'aria-current',
          isActive
            ? 'page'
            : 'false'
        );

      }

    };

    for (
      const [index, item] of
      (options.items || []).entries()
    ) {

      const key =
        item.key ??
        item.label;

      const buttonNode =
        element(
          'button',
          {
            className:
              'us-tool-nav-item',
            attrs: {
              type:
                'button'
            },
            dataset: {
              key
            },
            on: {
              click: () => {

                active =
                  key;

                sync();

                if (typeof options.onChange === 'function') {

                  options.onChange(
                    key,
                    item,
                    root
                  );

                }

              }
            }
          },
          element(
            'span',
            {
              className:
                'us-tool-nav-index',
              text:
                String(
                  index + 1
                ).padStart(
                  2,
                  '0'
                )
            }
          ),
          item.icon
            ? element(
              'span',
              {
                className:
                  'us-tool-nav-icon'
              },
              icon(
                item.icon
              )
            )
            : null,
          element(
            'span',
            {
              className:
                'us-tool-nav-label',
              text:
                item.label
            }
          ),
          item.badge instanceof Node
            ? item.badge
            : null
        );

      buttons.push(
        buttonNode
      );

      root.appendChild(
        buttonNode
      );

    }

    sync();

    return root;

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ TERMINAL / FLAT UTILITY COMPONENTS                                           │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function terminalLabel(text, options = {}) {

    return element(
      options.tagName || 'span',
      {
        className: [
          'us-terminal-label',
          options.cursor
            ? 'us-terminal-label-cursor'
            : '',
          options.className || ''
        ].filter(Boolean).join(' '),
        text,
        title:
          options.title
      }
    );

  }

  function metaLine(items = [], options = {}) {

    return element(
      'div',
      {
        className: [
          'us-meta-line',
          options.className || ''
        ].filter(Boolean).join(' ')
      },
      items.map(
        (item) => {

          if (item instanceof Node) {
            return item;
          }

          return element(
            'span',
            {
              text:
                String(item)
            }
          );

        }
      )
    );

  }

  function chromeStrip(children = [], options = {}) {

    return element(
      options.tagName || 'div',
      {
        className: [
          'us-chrome-strip',
          options.className || ''
        ].filter(Boolean).join(' '),
        attrs: {
          role:
            options.role,
          'aria-label':
            options.ariaLabel
        }
      },
      children
    );

  }

  function offsetCard(options = {}) {

    const tagName =
      options.href
        ? 'a'
        : typeof options.onClick === 'function'
          ? 'button'
          : 'div';

    const node =
      element(
        tagName,
        {
          className: [
            'us-offset-card',
            (
              options.href ||
              typeof options.onClick === 'function'
            )
              ? 'us-offset-card-interactive'
              : '',
            options.external
              ? 'us-external-cue'
              : '',
            options.className || ''
          ].filter(Boolean).join(' '),
          attrs: {
            href:
              options.href,
            target:
              options.external
                ? '_blank'
                : null,
            rel:
              options.external
                ? 'noopener noreferrer'
                : null,
            type:
              tagName === 'button'
                ? 'button'
                : null
          },
          on:
            typeof options.onClick === 'function'
              ? {
                click:
                  options.onClick
              }
              : null
        }
      );

    const body =
      element(
        'div',
        {
          className:
            'us-column us-column-tight'
        }
      );

    if (options.title) {

      body.appendChild(
        element(
          'strong',
          {
            text:
              options.title
          }
        )
      );

    }

    if (options.description) {

      body.appendChild(
        element(
          'span',
          {
            className:
              'us-secondary',
            text:
              options.description
          }
        )
      );

    }

    if (options.meta?.length) {

      body.appendChild(
        metaLine(
          options.meta
        )
      );

    }

    if (options.icon) {

      node.appendChild(
        element(
          'span',
          {
            className:
              'us-offset-card-icon'
          },
          icon(
            options.icon
          )
        )
      );

    }

    node.appendChild(
      body
    );

    return node;

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ APPLICATION SHELL COMPONENTS                                                 │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  function header(options = {}) {

    return element(
      'header',
      {
        className:
          'us-app-header us-header'
      },
      element(
        'div',
        {
          className: 'us-header-brand'
        },
        element(
          'span',
          {
            className: 'us-header-mark',
            text: options.mark || 'US'
          }
        ),
        element(
          'span',
          {
            className: 'us-header-title',
            text:
              options.title ||
              'Userscript'
          }
        )
      ),
      options.context
        ? element(
          'span',
          {
            className: 'us-header-context',
            text: options.context
          }
        )
        : null,
      element(
        'div',
        {
          className: 'us-spacer'
        }
      ),
      options.search
        ? element(
          'label',
          {
            className: 'us-header-search'
          },
          icon('SEARCH'),
          element(
            'input',
            {
              attrs: {
                type: 'search',
                placeholder:
                  options.search.placeholder ||
                  'Search',
                'aria-label':
                  options.search.ariaLabel ||
                  'Search'
              },
              on: options.search.onInput
                ? {
                  input:
                    options.search.onInput
                }
                : null
            }
          )
        )
        : null,
      ...(options.actions || [])
    );

  }

  function sidebarSection(options = {}) {

    const root =
      element(
        'section',
        {
          className: 'us-sidebar-section'
        },
        options.title
          ? element(
            'div',
            {
              className: 'us-sidebar-title',
              text: options.title
            }
          )
          : null
      );

    if (options.items?.length) {

      const list =
        element(
          'ul',
          {
            className: 'us-side-nav'
          }
        );

      for (const item of options.items) {

        list.appendChild(
          element(
            'li',
            {},
            element(
              item.href
                ? 'a'
                : 'button',
              {
                className: [
                  'us-side-nav-link',
                  item.active
                    ? 'us-side-nav-link-active'
                    : ''
                ].filter(Boolean).join(' '),
                attrs: item.href
                  ? {
                    href: item.href
                  }
                  : {
                    type: 'button'
                  },
                on: item.onClick
                  ? {
                    click: item.onClick
                  }
                  : null
              },
              item.icon
                ? element(
                  'span',
                  {
                    className: 'us-side-nav-icon'
                  },
                  icon(item.icon)
                )
                : null,
              item.label
            )
          )
        );

      }

      root.appendChild(
        list
      );

    }

    appendChildren(
      root,
      options.children || []
    );

    return root;

  }

  function sidebar(side, sections = []) {

    return element(
      'aside',
      {
        className: [
          side === 'right'
            ? 'us-app-right'
            : 'us-app-left',
          'us-sidebar',
          side === 'right'
            ? 'us-sidebar-right'
            : 'us-sidebar-left'
        ].join(' ')
      },
      element(
        'div',
        {
          className: 'us-sidebar-inner'
        },
        sections.map(
          sidebarSection
        )
      )
    );

  }

  function footer(options = {}) {

    return element(
      'footer',
      {
        className:
          'us-app-footer us-footer'
      },
      ...(options.left || []),
      element(
        'div',
        {
          className: 'us-spacer'
        }
      ),
      ...(options.right || [])
    );

  }

  function appShell(options = {}) {

    return element(
      'div',
      {
        className: 'us-app',
        attrs: {
          'data-userscript-root': ''
        }
      },
      options.header ||
        header(
          options.headerOptions || {}
        ),
      options.left ||
        sidebar(
          'left',
          options.leftSections || []
        ),
      element(
        'main',
        {
          className:
            'us-app-main'
        },
        options.main || []
      ),
      options.right ||
        sidebar(
          'right',
          options.rightSections || []
        ),
      options.footer ||
        footer(
          options.footerOptions || {}
        )
    );

  }
  /*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ EXPORT                                                                       │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const api = Object.freeze({

    API_VERSION,
    LOW_LEVEL_APIS,
    EXPERIMENTAL_APIS,
    DEPRECATED_APIS,

    ICONS,
    ACTIONS,
    TONE_CLASSES,

    element,
    icon,
    iconSlot,
    focusableElements,
    focusInitial,
    trapFocus,

    button,
    iconButton,
    action,
    resolveAction,
    actionButton,
    actionMenuItem,
    actionMenu,
    toneClass,
    pill,
    alertBox,
    showAlert,
    openAlertDialog,
    badge,
    status,
    callout,
    divider,
    toolbar,
    stack,
    cluster,
    field,
    inputControl,
    textareaControl,
    selectControl,
    choiceControl,
    checkboxControl,
    radioControl,
    radioGroup,
    inputGroup,
    utilityGroup,
    utilityBar,
    rangeControl,
    switchControl,
    segmentedControl,
    settingRow,
    settingsGroup,

    panel,
    pageHeader,

    metricStrip,
    keyValueList,
    dataTable,
    tabs,
    logList,

    actionStrip,

    copyText,
    shellQuote,
    copyCommandButton,
    commandBlock,

    formatBytes,
    fileMatchesAccept,
    progressBar,
    progressGroup,
    segmentedProgress,
    spinner,
    skeleton,
    filePicker,
    uploadQueue,
    DEFAULT_HIGHLIGHT_COLORS,
    textNodesInRange,
    annotateTextRange,
    clearTextAnnotations,
    createTextQuoteAnchor,
    resolveTextQuoteAnchor,
    textSelectionToolbar,
    attachTextSelectionToolbar,
    annotationModeControl,
    attachPageAnnotationMode,
    assetItem,
    assetTray,
    assetCarousel,
    openAssetCarousel,
    attachAssetHoverTray,

    mediaProgress,
    qualitySelect,
    mediaSource,
    mediaControls,
    sourceInspector,

    createRoot,
    setTheme,
    ensureOverlayRoot,
    positionFloating,
    floatingAction,
    hoverToolbar,
    attachHoverToolbar,
    popover,
    attachPopover,
    storageAdapter,
    draggableWindow,
    openDraggableWindow,
    openNotepad,
    modal,
    openModal,
    drawer,
    openDrawer,
    toast,
    showActionToast,
    showToast,
    tooltip,
    attachTooltip,
    inlineRoot,
    inlineInspector,
    toolNav,
    terminalLabel,
    metaLine,
    chromeStrip,
    offsetCard,

    header,
    sidebarSection,
    sidebar,
    footer,
    appShell

  });

  Object.defineProperty(
    global,
    NAMESPACE,
    {
      value: api,
      configurable: false,
      enumerable: true,
      writable: false
    }
  );

})(globalThis);
