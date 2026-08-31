(function () {
  'use strict';

  var STORAGE_KEY = 'seen_catalog_v1';
  var PROJECTS = [
    'primaria-salonta',
    'oradea-experience',
    'nuestra',
    'fleetkeeper',
    'radical-football',
    'ymiyba',
    'tool',
    'amidamaru',
    'service-24-bdd',
    'ardt',
    'edu-events',
    'nexus-learning-lab',
    'bdd-logspeed'
  ];
  var TOOLS = ['compress', 'convert', 'qr', 'password', 'secret'];

  function loadSeen() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : {};
      return {
        projects: Array.isArray(data.projects) ? data.projects : [],
        tools: Array.isArray(data.tools) ? data.tools : []
      };
    } catch (e) {
      return { projects: [], tools: [] };
    }
  }

  function saveSeen(seen) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        projects: seen.projects,
        tools: seen.tools
      }));
    } catch (e) { /* private browsing */ }
  }

  function wrapNavLabel(link) {
    if (!link || link.querySelector('.nav-link-label')) return;
    var labelEl = document.createElement('span');
    labelEl.className = 'nav-link-label';
    var node = link.firstChild;
    while (node) {
      var next = node.nextSibling;
      if (node.nodeType === 3) labelEl.appendChild(node);
      node = next;
    }
    if (labelEl.childNodes.length) link.insertBefore(labelEl, link.firstChild);
  }

  function remaining(kind, seen) {
    var catalog = kind === 'tools' ? TOOLS : PROJECTS;
    var list = seen[kind] || [];
    return catalog.filter(function (id) { return list.indexOf(id) === -1; }).length;
  }

  function markSeen(kind, id) {
    if (!id) return;
    var catalog = kind === 'tools' ? TOOLS : PROJECTS;
    if (catalog.indexOf(id) === -1) return;
    var seen = loadSeen();
    if (seen[kind].indexOf(id) !== -1) return;
    seen[kind].push(id);
    saveSeen(seen);
    renderBadges(seen);
    clearPipFor(kind, id);
  }

  function projectSlugFromHref(href) {
    var match = String(href || '').match(/\/projects\/([^/?#]+)/i);
    if (!match) return '';
    return match[1].replace(/\.html$/i, '');
  }

  function toolIdFromHref(href) {
    try {
      return new URL(href, location.origin).hostname.split('.')[0] || '';
    } catch (e) {
      return '';
    }
  }

  function currentProjectSlug() {
    var path = location.pathname.replace(/\/+$/, '');
    return projectSlugFromHref(path);
  }

  function renderBadges(seen) {
    seen = seen || loadSeen();
    [
      { kind: 'projects', href: '/projects', noun: 'project' },
      { kind: 'tools', href: '/tools', noun: 'tool' }
    ].forEach(function (item) {
      var count = remaining(item.kind, seen);
      var links = document.querySelectorAll('a.nav-link[href="' + item.href + '"], a.nav-link[href="' + item.href + '.html"]');
      links.forEach(function (link) {
        wrapNavLabel(link);
        var badge = link.querySelector('.nav-unseen-count');
        if (count <= 0) {
          if (badge) badge.remove();
          if (link.getAttribute('data-unseen-label')) {
            link.removeAttribute('aria-label');
            link.removeAttribute('data-unseen-label');
          }
          return;
        }
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'nav-unseen-count';
          badge.setAttribute('aria-hidden', 'true');
          link.appendChild(badge);
        }
        badge.textContent = String(count);
        var label = item.noun + (count === 1 ? '' : 's');
        var name = item.kind === 'tools' ? 'Tools' : 'Projects';
        link.setAttribute('aria-label', name + ', ' + count + ' unvisited ' + label);
        link.setAttribute('data-unseen-label', 'true');
      });
    });
  }

  function addPip(el, mount) {
    var host = mount || el;
    if (host.querySelector('.unseen-pip') || el.querySelector('.unseen-pip')) return;
    var pip = document.createElement('span');
    pip.className = 'unseen-pip';
    pip.setAttribute('aria-hidden', 'true');
    host.appendChild(pip);
  }

  function clearPipFor(kind, id) {
    if (kind === 'projects') {
      document.querySelectorAll('.project-single-item.is-unseen').forEach(function (card) {
        var link = card.querySelector('a.project-link[href*="/projects/"]');
        if (link && projectSlugFromHref(link.getAttribute('href')) === id) {
          card.classList.remove('is-unseen');
          var pip = card.querySelector('.unseen-pip');
          if (pip) pip.remove();
        }
      });
    }
    if (kind === 'tools') {
      document.querySelectorAll('#open-tools .tools-row.is-unseen').forEach(function (row) {
        if (toolIdFromHref(row.href) === id) {
          row.classList.remove('is-unseen');
          var pip = row.querySelector('.unseen-pip');
          if (pip) pip.remove();
        }
      });
    }
  }

  function decorateProjectCards(seen) {
    var onList = /\/projects\/?$/.test(location.pathname) || location.pathname === '/' || location.pathname === '/index.html';
    if (!onList) return;
    document.querySelectorAll('.project-single-item').forEach(function (card) {
      var link = card.querySelector('a.project-link[href*="/projects/"]');
      if (!link) return;
      var id = projectSlugFromHref(link.getAttribute('href'));
      if (!id || PROJECTS.indexOf(id) === -1) return;
      if (seen.projects.indexOf(id) !== -1) return;
      card.classList.add('is-unseen');
      addPip(card, card.querySelector('.project-item-title'));
    });
  }

  function decorateToolRows(seen) {
    document.querySelectorAll('#open-tools .tools-row').forEach(function (row) {
      var id = toolIdFromHref(row.href);
      if (!id || TOOLS.indexOf(id) === -1) return;
      if (seen.tools.indexOf(id) === -1) {
        row.classList.add('is-unseen');
        addPip(row);
      }
      row.addEventListener('click', function () {
        markSeen('tools', id);
      });
    });
  }

  function init() {
    document.querySelectorAll('a.nav-link').forEach(wrapNavLabel);
    var seen = loadSeen();
    var slug = currentProjectSlug();
    if (slug) markSeen('projects', slug);
    seen = loadSeen();
    renderBadges(seen);
    decorateProjectCards(seen);
    decorateToolRows(seen);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) renderBadges();
  });
})();
