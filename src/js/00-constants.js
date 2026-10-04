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
