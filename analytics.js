/**
 * MrMikes Simple Analytics
 * Lightweight client-side page view tracking using localStorage.
 * Automatically runs on page load - no configuration needed.
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'mrmikes_analytics';
  var VISITOR_KEY = 'mrmikes_visitor_id';
  var SESSION_KEY = 'mrmikes_session';
  var MAX_EVENTS = 10000;
  var SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  function getVisitorId() {
    var id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  }

  function getSessionId() {
    var session = null;
    try {
      session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch (e) {}

    var now = Date.now();
    if (session && (now - session.lastActivity) < SESSION_TIMEOUT) {
      session.lastActivity = now;
      session.pageCount++;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session.id;
    }

    // New session
    var newSession = {
      id: generateId(),
      startTime: now,
      lastActivity: now,
      pageCount: 1
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    return newSession.id;
  }

  function getPageName() {
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '') || 'index';
  }

  function getDeviceType() {
    return window.innerWidth <= 768 ? 'mobile' : 'desktop';
  }

  function getBrowser() {
    var ua = navigator.userAgent;
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) return 'Chrome';
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
    if (ua.indexOf('Edg') > -1) return 'Edge';
    return 'Other';
  }

  function getReferrer() {
    var ref = document.referrer;
    if (!ref) return 'direct';
    try {
      var hostname = new URL(ref).hostname;
      if (hostname === window.location.hostname) return 'internal';
      return hostname;
    } catch (e) {
      return 'unknown';
    }
  }

  function trackPageView() {
    var events = [];
    try {
      events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      events = [];
    }

    var event = {
      page: getPageName(),
      timestamp: Date.now(),
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      referrer: getReferrer(),
      device: getDeviceType(),
      browser: getBrowser()
    };

    events.push(event);

    // Cap at MAX_EVENTS to prevent localStorage bloat
    if (events.length > MAX_EVENTS) {
      events = events.slice(events.length - MAX_EVENTS);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      // localStorage full - trim more aggressively
      events = events.slice(events.length - Math.floor(MAX_EVENTS / 2));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      } catch (e2) {}
    }
  }

  // Track on page load
  trackPageView();
})();
