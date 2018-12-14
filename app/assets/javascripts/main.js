var TAXES = ['Self Assessment (SA)', 'Submit VAT Returns', 'Corporation Tax (CT)'];

function interpolate(t, o, s) {
  var m = (!s) ? /{([^{}]*)}/g : s;
  if (s) m = s;
  return t.replace(m, function (a, b) {
    var newLine = b.indexOf('|');
    b = newLine > -1 ? b.split('|')[0] : b;
    var r = o[b];
    if (Array.isArray(r)) {
      return newLine > -1 ? r.join('<br/>') : r;
    } else if (typeof r === 'string' || typeof r === 'number' || typeof r === 'boolean')
      return r;
    else return a;
  });
}

function getQueryParams() {
  var params = [];
  var hash = location.search.replace('?', '');
  if (hash.length > -1) {
    hash.split('&').forEach(function (param) {
      if (param) {
        var parts = param.split('=');
        var value = parts[1];
        if (value.indexOf('[') > -1 && value.indexOf(']') > -1) {
          value = value.replace('[', '').replace(']', '').split(',');
        }
        params.push({name: parts[0], value: value});
      }
    });
  }
  return params;
}

function formParam(paramName) {
  var queryParams = getQueryParams();
  for (var i = 0; i < queryParams.length; i++) {
    if (queryParams[i].name === paramName) {
      return uriDecodePreserveNewLines(queryParams[i].value);
    }
  }
}

function uriDecodePreserveNewLines(value) {
  return decodeURI(value)
      .replace(/\+/g, ' ')
      .replace(/\n/g, '<br/>');
}

function toQueryParams(array) {
  if (!array) return '';
  if (!Array.isArray(array)) array = [array];
  return array.map(function (item) {
      return item.name + '=' + item.value;
    }).join('&');
}

function toObject(array) {
  return array.reduce(function (acc, item) {
    var prop = acc[item.name];
    if (prop) {
      if (Array.isArray(prop)) {
        prop.push(item.value);
      } else {
        acc[item.name] = [prop, item.value];
      }
    } else {
      acc[item.name] = item.value;
    }
    return acc;
  }, {});
}

function serializeFormArray(formName) {
  formName = formName || 'aspnetForm';
  return $('form[name=' + formName + ']').serializeArray();
}

function redirectTo(nextUrl, params) {
  
  var newUrl,
    $forms = $('form[name="aspnetForm"]'),
    parts = location.pathname.split('/');

  parts.pop();

  queryParams = toQueryParams(params);
  newUrl = location.origin + parts.join('/') + '/' + nextUrl + (nextUrl.indexOf('?') === -1 ? '?' + queryParams : queryParams);
  if ($forms.length > 0) $forms.off('submit');
  location = newUrl;
  return false;
}

function postTo(nextUrl, formName) {
  var params = getQueryParams();
  params = params.concat(serializeFormArray(formName));
  return redirectTo(nextUrl, params);
}

function createService(nextUrl) {
  var record = toObject(serializeFormArray());
  localStorage.setItem('services', JSON.stringify(record));
  return redirectTo(nextUrl);
}

function removeService(nextUrl) {
  var formData = toObject(serializeFormArray());
  var store = localStorage.getItem('services');
  var record = store ? JSON.parse(store) : {data: []};
  record.data.splice(formData.index, 1);
  localStorage.setItem('services', JSON.stringify(record));
  return redirectTo(nextUrl);
}

function getId() {
  return Math.floor(Math.random() * 9000) + 1000;
}

function createUser(nextUrl, forwardParams, formName) {
  var queryparams = getActionFromQueryParam();
  var store = localStorage.getItem('users');
  var data = store ? JSON.parse(store) : [];
  var record = toObject(serializeFormArray(formName));
  record.id = [getId(), getId(), getId()].join(' ');
  record.twofactor = 'false';
  record.loggedIn = 'false';
  record.services = TAXES;
  data.push(record);
  localStorage.setItem('users', JSON.stringify(data));

  if (queryparams.length === 0) queryparams = [{name: 'action', value: 'create'}];
  queryparams.push({name: 'id', value: record.id});

  if (forwardParams) {
    if (!Array.isArray(forwardParams)) forwardParams = [forwardParams];
    forwardParams.forEach(function (param) {
      queryparams.push({name: param, value: record[param]});
    });
  }

  return redirectTo(nextUrl, queryparams);
}

function updateUser(nextUrl, forwardParams, isService) {
  var queryparams = getActionFromQueryParam();
  var store = localStorage.getItem('users');
  var data = store ? JSON.parse(store) : [];
  var record = toObject(serializeFormArray());
  if (isService) {
    record.services = record.services || [];
  }
  if (record.services && !Array.isArray(record.services)) {
    record.services = [record.services];
  }
  if (record.id && data.length > 0) {
    data.some(function (rec) {
      if (rec.id == record.id) {
        $.extend(rec, record);
        return true;
      }
      return false;
    });
  }
  localStorage.setItem('users', JSON.stringify(data));

  if (queryparams.length === 0) queryparams = [{name: 'action', value: 'update'}];
  queryparams.push({name: 'id', value: record.id});

  if (forwardParams) {
    if (!Array.isArray(forwardParams)) forwardParams = [forwardParams];
    forwardParams.forEach(function (param) {
      queryparams.push({name: param, value: record[param]});
    });
  }
  return redirectTo(nextUrl, queryparams);
}

function deleteUser(nextUrl, forwardParams, formName) {
  var queryparams = [];
  var store = localStorage.getItem('users');
  var data = store ? JSON.parse(store) : [];
  var record = toObject(serializeFormArray(formName));
  if (record.id && data.length > 0) {
    var recIndex = -1;
    data.some(function (rec, index) {
      if (rec.id == record.id) {
        recIndex = index;
        return true;
      }
      return false;
    });
    if (recIndex > -1) data.splice(recIndex, 1);
  }

  localStorage.setItem('users', JSON.stringify(data));

  if (queryparams.length === 0) queryparams = [{name: 'action', value: 'delete'}];
  queryparams.push({name: 'id', value: record.id});

  if (forwardParams) {
    if (!Array.isArray(forwardParams)) forwardParams = [forwardParams];
    forwardParams.forEach(function (param) {
      queryparams.push({name: param, value: record[param]});
    });
  }

  return redirectTo(nextUrl, queryparams);
}

function resetSecurity(nextUrl, forwardParams, formName) {
  var queryparams = [];
  var store = localStorage.getItem('users');
  var data = store ? JSON.parse(store) : [];
  var record = toObject(serializeFormArray(formName));
  if (record.id && data.length > 0) {
    data.some(function (rec, index) {
      if (rec.id == record.id) {
        rec.twofactor = 'false';
        return true;
      }
      return false;
    });
  }

  localStorage.setItem('users', JSON.stringify(data));

  if (queryparams.length === 0) queryparams = [{name: 'action', value: 'reset-security'}];
  queryparams.push({name: 'id', value: record.id});

  if (forwardParams) {
    if (!Array.isArray(forwardParams)) forwardParams = [forwardParams];
    forwardParams.forEach(function (param) {
      queryparams.push({name: param, value: record[param]});
    });
  }

  return redirectTo(nextUrl, queryparams);
}

function conditionalNavigation(input, value, nextUrl, alternativeUrl) {
  var form = serializeFormArray();
  var strUrl = alternativeUrl;
  form.forEach(function (item) {
    if (item.name === input) {
      if (item.value == value) {
        strUrl = nextUrl;
      }
    }
  });
  return redirectTo(strUrl, form);
}

function multiNavigation(input, values, urls) {

    var form = serializeFormArray();
    form.forEach(function (item) {
        if (item.name === input) {
            for(var i = 0; i < values.length; i++) {
  console.log( item.value );
  console.log( values[i] );
              if (item.value == values[i]) {
                return redirectTo(urls[i], form);
              }
            }
        }
    });
}

function validateForm(event) {
  event.preventDefault();
  var noErrors = true;
  var summary = $('[name=aspnetForm] .error-summary');
  if (summary.length > 0) return $('[name=aspnetForm]').valid();

  $('[name=aspnetForm] input').each(function () {
    var input = $(this);
    var name = input.attr('name');
    if (!input.val().length) {
      input.closest('.form-field').addClass('form-field--error');
      input.addClass('error-field');
      noErrors = false;
    } else {
      input.closest('.form-field').removeClass('form-field--error');
      input.removeClass('error-field');
    }
  });

  return !!noErrors;
}

function getActionFromQueryParam() {
  return getQueryParams().filter(function (param) {
    return param.name === 'action';
  });
}

function checkMode(mode) {
  return getQueryParams().some(function (param) {
    return param.name === 'mode' && param.value === mode;
  });
}

function addUser(record) {
  var store = localStorage.getItem('users');
  var data = store ? JSON.parse(store) : [];
  var exist = data.some(function (rec) {
    return rec.id == record.id;
  });
  if (!exist) {
    data.push(record);
    localStorage.setItem('users', JSON.stringify(data));
  }
}

// populate query params into document
$(function () {
  document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
  var params = getQueryParams();
  params.forEach(function (param) {

    // populate query params into document
    $('#' + param.name).text(param.value).val(param.value);
    $('.' + param.name).text(param.value).val(param.value);
    $('[name=' + param.name + ']').text(param.value).val(param.value);

    // toggle UI elements based on query params
    var toggleParams = $('[data-query-toggle-name=' + param.name + ']');
    toggleParams.each(function (index, toggleParam) {
      toggleParam = $(toggleParam);
      if (param.value == toggleParam.data('query-toggle-value')) {
        toggleParam.toggleClass('hidden');
      }
    });
  });
});

// bootstrap default user
$(function () {
  addUser({
    'fullname': 'Alex Fisher',
    'email': 'alex.fisher@gmail.com',
    'password': 'qwerty',
    'confirmPassword': 'qwerty',
    'id': '1889 5673 9873',
    'permission': 'administrator',
    'services': TAXES,
    'loggedIn': 'true',
    'twofactor': 'true'
  });

  if (location.pathname.indexOf('manage-users-reset2sv') > -1) {
    addUser({
      'fullname': 'James May',
      'email': 'james.may@gmail.com',
      'password': 'qwerty',
      'confirmPassword': 'qwerty',
      'id': '1889 5673 9871',
      'permission': 'administrator',
      'services': TAXES,
      'loggedIn': 'false',
      'twofactor': 'true'
    });
  }
});

// render local storage data
$(function () {
  var target = $('[data-render-storage]');
  var templateEl = target.find('[data-render-template]');
  var template = templateEl.prop('outerHTML');
  var storeName = target.data('render-storage');
  var store = localStorage.getItem(storeName);
  var records = store ? JSON.parse(store) : [];
  templateEl.addClass('hidden');

  if (Array.isArray(records)) {
    records.forEach(function (record) {
      target.append($(interpolate(template, record)).removeAttr('data-render-template'));
    });
  } else {
    records.data.forEach(function (record, index) {
      target.append($(interpolate(template, {'@key': record, '@index': index})).removeAttr('data-render-template'));
    });
  }

  $('[data-if]').each(function (index, element) {
    element = $(element);
    if (element.parents('[data-render-template]').length === 0) {
      if (eval(element.data('if'))) {
        element.show();
      } else {
        element.hide();
      }
    }
  });
});

$(function () {
  $('#dismissExtraSecurity').click(function (e) {
    $('#extraSecurity').hide();

    $('#mod').show();
    e.preventDefault()
  });
});

// service manual
!function (t) {
  "use strict";
  var e = t.jQuery, n = t.GOVUK || {}, o = {
    _hasScrolled: !1,
    _scrollTimeout: !1,
    _hasResized: !1,
    _resizeTimeout: !1,
    getWindowDimensions: function () {
      return {height: e(t).height(), width: e(t).width()}
    },
    getWindowPositions: function () {
      return {scrollTop: e(t).scrollTop()}
    },
    getElementOffset: function (t) {
      return t.offset()
    },
    init: function () {
      var i = e(".js-stick-at-top-when-scrolling");
      i.length > 0 && (o.$els = i, o._scrollTimeout === !1 && (e(t).scroll(o.onScroll), o._scrollTimeout = t.setInterval(o.checkScroll, 50)), o._resizeTimeout === !1 && (e(t).resize(o.onResize), o._resizeTimeout = t.setInterval(o.checkResize, 50))), n.stopScrollingAtFooter && i.each(function (o, i) {
        var s = e(i).find("img");
        if (s.length > 0) {
          var r = new t.Image;
          r.onload = function () {
            n.stopScrollingAtFooter.addEl(e(i), e(i).outerHeight())
          }, r.src = s.attr("src")
        } else n.stopScrollingAtFooter.addEl(e(i), e(i).outerHeight())
      })
    },
    onScroll: function () {
      o._hasScrolled = !0
    },
    onResize: function () {
      o._hasResized = !0
    },
    checkScroll: function () {
      if (o._hasScrolled === !0) {
        o._hasScrolled = !1;
        var t = o.getWindowPositions().scrollTop, n = o.getWindowDimensions();
        o.$els.each(function (i, s) {
          var r = e(s), a = r.data("scrolled-from");
          a && a > t ? o.release(r) : n.width > 768 && t >= o.getElementOffset(r).top && o.stick(r)
        })
      }
    },
    checkResize: function () {
      if (o._hasResized === !0) {
        o._hasResized = !1;
        var t = o.getWindowDimensions();
        o.$els.each(function (n, i) {
          var s = e(i), r = s.hasClass("js-sticky-resize");
          if (r) {
            var a = e(".shim"), c = s.parent("div"), u = c.width();
            a.css("width", u), s.css("width", u)
          }
          t.width <= 768 && o.release(s)
        })
      }
    },
    stick: function (t) {
      if (!t.hasClass("content-fixed")) {
        t.data("scrolled-from", o.getElementOffset(t).top);
        var e = Math.max(t.height(), 1);
        t.before('<div class="shim" style="width: ' + t.width() + "px; height: " + e + 'px">&nbsp;</div>'), t.css("width", t.width() + "px").addClass("content-fixed")
      }
    },
    release: function (t) {
      t.hasClass("content-fixed") && (t.data("scrolled-from", !1), t.removeClass("content-fixed").css("width", ""), t.siblings(".shim").remove())
    }
  };
  n.stickAtTopWhenScrolling = o, t.GOVUK = n
}(window), function (t) {
  "use strict";
  var e = t.jQuery, n = t.GOVUK || {}, o = {
    _pollingId: null,
    _isPolling: !1,
    _hasScrollEvt: !1,
    _els: [],
    addEl: function (n, i) {
      var s;
      if (n.length) {
        s = parseInt(n.css("top"), 10), s = isNaN(s) ? 0 : s, o.updateFooterTop(), e(t).on("govuk.pageSizeChanged", o.updateFooterTop);
        var r = e("<div></div>");
        r.insertBefore(n);
        var a = r.offset().top - r.position().top;
        r.remove();
        var c = {$fixedEl: n, height: i + s, fixedTop: i + a, state: "fixed"};
        o._els.push(c), o.initTimeout()
      }
    },
    updateFooterTop: function () {
      var t = e(".js-footer:eq(0)");
      return 0 === t.length ? 0 : void(o.footerTop = t.offset().top - 10)
    },
    initTimeout: function () {
      o._hasScrollEvt === !1 && (e(window).scroll(o.onScroll), o._hasScrollEvt = !0)
    },
    onScroll: function () {
      o._isPolling === !1 && o.startPolling()
    },
    startPolling: function () {
      return window.requestAnimationFrame ? function () {
        var t = function () {
          o.checkScroll(), o._isPolling === !0 && o.startPolling()
        };
        o._pollingId = window.requestAnimationFrame(t), o._isPolling = !0
      } : function () {
        o._pollingId = window.setInterval(o.checkScroll, 16), o._isPolling = !0
      }
    }(),
    stopPolling: function () {
      return window.requestAnimationFrame ? function () {
        window.cancelAnimationFrame(o._pollingId), o._isPolling = !1
      } : function () {
        window.clearInterval(o._pollingId), o._isPolling = !1
      }
    }(),
    checkScroll: function () {
      var t = e(window).scrollTop();
      return t < o.cachedScrollTop + 2 && t > o.cachedScrollTop - 2 ? void o.stopPolling() : (o.cachedScrollTop = t, void e.each(o._els, function (e, n) {
        var i = t + n.height;
        i > o.footerTop ? o.stick(n) : o.unstick(n)
      }))
    },
    stick: function (t) {
      "fixed" === t.state && "fixed" === t.$fixedEl.css("position") && (t.$fixedEl.css({
        position: "absolute",
        top: o.footerTop - t.fixedTop
      }), t.state = "absolute")
    },
    unstick: function (t) {
      "absolute" === t.state && (t.$fixedEl.css({position: "", top: ""}), t.state = "fixed")
    }
  };
  n.stopScrollingAtFooter = o, e(t).load(function () {
    e(t).trigger("govuk.pageSizeChanged")
  }), t.GOVUK = n
}(window), function (t) {
  "use strict";
  t.GOVUK = t.GOVUK || {}, t.GOVUK.getCurrentLocation = function () {
    return t.location
  }
}(window), function (t, e) {
  "use strict";
  e.GOVUK = e.GOVUK || {}, GOVUK.Modules = GOVUK.Modules || {}, GOVUK.modules = {
    find: function (e) {
      var n, o = "[data-module]", e = e || t("body");
      return n = e.find(o), e.is(o) && (n = n.add(e)), n
    }, start: function (e) {
      function n(t) {
        return i(o(t))
      }

      function o(t) {
        return t.replace(/-([a-z])/g, function (t) {
          return t[1].toUpperCase()
        })
      }

      function i(t) {
        return t.charAt(0).toUpperCase() + t.slice(1)
      }

      for (var s = this.find(e), r = 0, a = s.length; a > r; r++) {
        var c, u = t(s[r]), l = n(u.data("module")), d = u.data("module-started");
        "function" != typeof GOVUK.Modules[l] || d || (c = new GOVUK.Modules[l], c.start(u), u.data("module-started", !0))
      }
    }
  }
}(jQuery, window), function (t) {
  "use strict";
  t.AccordionWithDescriptions = function () {
    this.start = function (t) {
      function e() {
        return $("h1").text()
      }

      function n(t) {
        return t.replace(/\s+/g, "_")
      }

      function o() {
        var t = e();
        return t = n(t), t = t.toLowerCase(), "GOVUK_service_manual_" + t + "_"
      }

      function i() {
        t.prepend('<div class="subsection-controls js-subsection-controls"><button aria-expanded="false">Open all</button></div>')
      }

      function s() {
        var e = t.find(".subsection__title");
        e.each(function (t) {
          $(this).wrapInner('<button class="subsection__button js-subsection-button" aria-expanded="false" aria-controls="subsection_content_' + t + '"></a>')
        })
      }

      function r() {
        F.append('<span class="subsection__icon"></span>')
      }

      function a() {
        for (var e = "", n = 0; P > n; n++)e += "subsection_content_" + n + " ";
        C = t.find(".js-subsection-controls button"), C.attr("aria-controls", e)
      }

      function c() {
        var e = t.find(".subsection__content");
        S(e)
      }

      function u() {
        var e, n = l();
        n.length && (e = t.find(n).parents(".subsection").find(".subsection__content"), e.length && _(e))
      }

      function l() {
        return GOVUK.getCurrentLocation().hash
      }

      function d() {
        var e = t.find(".subsection__content");
        e.each(function (t) {
          var e = $(this).attr("id");
          sessionStorage.getItem(U + e) && m($("#" + e))
        }), v()
      }

      function f() {
        var t = $(".subsection--is-open").length;
        if (t) {
          var e = $(".subsection--is-open");
          e.each(function (t) {
            var e = $(this).find(".subsection__content").attr("id");
            sessionStorage.setItem(U + e, "Opened")
          })
        }
      }

      function h() {
        var t = $(".subsection").length;
        if (t) {
          var e = $(".subsection");
          e.each(function (t) {
            var e = $(this).find(".subsection__content").attr("id");
            sessionStorage.removeItem(U + e, e)
          })
        }
      }

      function g() {
        F.on("click", function (t) {
          return b($(this).next()), k($(this)), w($(this).find(".subsection__button")), v(), f(), h(), !1
        }), I.on("click", function (t) {
          return b($(this).parent().parent().next()), k($(this).parent().parent()), w($(this)), v(), f(), h(), !1
        })
      }

      function p() {
        C = t.find(".js-subsection-controls button"), C.on("click", function (e) {
          var n = "";
          return "Open all" == C.text() ? (C.text("Close all"), C.attr("aria-expanded", "true"), n = "open") : (C.text("Open all"), C.attr("aria-expanded", "false"), n = "close"), t.find(".js-subsection").each(function () {
            var t = $(this), e = t.find(".js-subsection-button"), o = t.find(".js-subsection-content");
            "open" == n ? (e.attr("aria-expanded", "true"), o.removeClass("js-hidden"), t.removeClass("subsection"), t.addClass("subsection--is-open")) : (e.attr("aria-expanded", "false"), o.addClass("js-hidden"), t.addClass("subsection"), t.removeClass("subsection--is-open"))
          }), f(), h(), !1
        })
      }

      function m(t) {
        b(t), k(t), w(t.parent().find(".subsection__button")), v()
      }

      function v() {
        var t = $(".subsection--is-open").length;
        t === P ? C.text("Close all") : C.text("Open all")
      }

      function b(t) {
        $(t).hasClass("js-hidden") ? _(t) : S(t)
      }

      function k(t) {
        $(t).parent().hasClass("subsection--is-open") ? (t.parent().removeClass("subsection--is-open"), t.parent().addClass("subsection")) : (t.parent().removeClass("subsection"), t.parent().addClass("subsection--is-open"))
      }

      function w(t) {
        "true" == $(t).attr("aria-expanded") ? t.attr("aria-expanded", "false") : t.attr("aria-expanded", "true")
      }

      function _(t) {
        t.removeClass("js-hidden")
      }

      function S(t) {
        t.addClass("js-hidden")
      }

      t.addClass("js-accordion-with-descriptions"), t.removeClass("js-hidden");
      var C, I = t.find(".subsection__button"), F = t.find(".subsection__header"), P = t.find(".subsection__content").length, U = o();
      i(), s(), r(), a(), c(), d(), u(), g(), p()
    }
  }
}(window.GOVUK.Modules), function (t, e) {
  "use strict";
  var n = e.$, o = n(e);
  t.HighlightActiveSectionHeading = function () {
    var t = this, e = !0, i = !0, s = 50, r = [];
    t.getWindowDimensions = function () {
      return {height: o.height(), width: o.width()}
    }, t.getWindowPositions = function () {
      return {scrollTop: o.scrollTop()}
    }, t.getElementOffset = function (t) {
      return t.offset()
    }, t.start = function (e) {
      o.resize(t.hasResized), o.scroll(t.hasScrolled), setInterval(t.checkResize, s), setInterval(t.checkScroll, s), t.$anchors = e.find(".js-page-contents a"), t.getAnchors(), t.checkResize(), t.checkScroll()
    }, t.hasResized = function () {
      return e = !0
    }, t.hasScrolled = function () {
      return i = !0
    }, t.checkResize = function () {
      e && (e = !1, i = !0)
    }, t.checkScroll = function () {
      if (i) {
        i = !1;
        var e = t.getWindowDimensions();
        e.width <= 768 ? t.removeActiveItem() : t.updateActiveNavItem()
      }
    }, t.getAnchors = function () {
      n.each(t.$anchors, function (t) {
        var e = n(this).attr("href");
        r.push(e)
      })
    }, t.getHeadingPosition = function (t) {
      return t.offset()
    }, t.getNextHeadingPosition = function (t) {
      return t.offset()
    }, t.getFooterPosition = function (t) {
      return t.offset()
    }, t.getDistanceBetweenHeadings = function (t, e) {
      var n = e - t;
      return n
    }, t.updateActiveNavItem = function () {
      var e = t.getWindowPositions().scrollTop, o = t.getFooterPosition(n("#footer"));
      n.each(t.$anchors, function (i) {
        var s = r[i], a = r[i + 1], c = n(s), u = n(a), l = t.getHeadingPosition(c);
        if (l) {
          if (l = l.top, l -= 53, a)var d = t.getNextHeadingPosition(u).top;
          var f = t.getDistanceBetweenHeadings(l, d);
          if (f)var h = e >= l && l + f > e; else var h = e >= l && e < o.top;
          h && t.setActiveItem(s)
        }
      })
    }, t.setActiveItem = function (e) {
      t.$anchors.removeClass("active"), t.$anchors.filter("[href='" + e + "']").addClass("active")
    }, t.removeActiveItem = function () {
      t.$anchors.removeClass("active")
    }
  }
}(window.GOVUK.Modules, window), function (t) {
  "use strict";
  function e() {
    this.controller = null, this.view = null, this.start = function (t) {
      this.view = new n(t), this.controller = new o(this.view), this.controller.init()
    }
  }

  function n(t) {
    function e(t) {
      return function (e) {
        e.preventDefault(), t()
      }
    }

    var n = this;
    this.$pageIsUsefulButton = t.find(".js-page-is-useful"), this.$pageIsNotUsefulButton = t.find(".js-page-is-not-useful"), this.$somethingIsWrongButton = t.find(".js-something-is-wrong"), this.$feedbackFormContainer = t.find(".js-feedback-form"), this.$feedbackForm = n.$feedbackFormContainer.find("form"), this.$feedbackFormSubmitButton = n.$feedbackFormContainer.find("[type=submit]"), this.$prompt = t.find(".js-prompt"), this.onPageIsUsefulButtonClicked = function (t) {
      n.$pageIsUsefulButton.on("click", e(t))
    }, this.onPageIsNotUsefulButtonClicked = function (t) {
      n.$pageIsNotUsefulButton.on("click", e(t))
    }, this.onSomethingIsWrongButtonClicked = function (t) {
      n.$somethingIsWrongButton.on("click", e(t))
    }, this.onSubmitFeedbackForm = function (t) {
      n.$feedbackForm.on("submit", e(t))
    }, this.replaceWithSuccess = function () {
      t.html("Thanks for your feedback.")
    }, this.replaceWithGenericError = function () {
      t.html('Sorry, we\u2019re unable to receive your message right now. We have other ways for you to provide feedback on the <a href="/contact/govuk">contact page</a>.')
    }, this.showFeedbackForm = function () {
      n.$prompt.addClass("js-hidden"), n.$feedbackFormContainer.removeClass("js-hidden")
    }, this.feedbackFormContainerData = function () {
      return n.$feedbackFormContainer.find("input, textarea").serialize()
    }, this.feedbackFormContainerTrackEventParams = function () {
      return n.getTrackEventParams(n.$feedbackFormContainer)
    }, this.pageIsUsefulTrackEventParams = function () {
      return n.getTrackEventParams(n.$pageIsUsefulButton)
    }, this.pageIsNotUsefulTrackEventParams = function () {
      return n.getTrackEventParams(n.$pageIsNotUsefulButton)
    }, this.somethingIsWrongTrackEventParams = function () {
      return n.getTrackEventParams(n.$somethingIsWrongButton)
    }, this.getTrackEventParams = function (t) {
      return {category: t.data("track-category"), action: t.data("track-action")}
    }, this.renderErrors = function (t) {
      n.$feedbackFormContainer.find(".js-error").remove(), $.each(t, function (t, e) {
        $.each(e, function (e, o) {
          var i = $("<div/>", {
            "class": "improve-this-page__error js-error",
            text: t + " " + o + "."
          }), s = n.$feedbackFormContainer.find('[name="' + t + '"]');
          s.length ? s.before(i) : n.$feedbackFormContainer.find(".js-errors").append(i)
        })
      })
    }, this.disableSubmitFeedbackButton = function () {
      n.$feedbackFormSubmitButton.prop("disabled", !0)
    }, this.enableSubmitFeedbackButton = function () {
      n.$feedbackFormSubmitButton.removeAttr("disabled")
    }
  }

  function o(t) {
    var e = this;
    this.init = function () {
      e.bindPageIsUsefulButton(), e.bindPageIsNotUsefulButton(), e.bindSomethingIsWrongButton(), e.bindSubmitFeedbackButton()
    }, this.bindPageIsUsefulButton = function () {
      var n = function () {
        e.trackEvent(t.pageIsUsefulTrackEventParams()), t.replaceWithSuccess()
      };
      t.onPageIsUsefulButtonClicked(n)
    }, this.bindPageIsNotUsefulButton = function () {
      var n = function () {
        e.trackEvent(t.pageIsNotUsefulTrackEventParams()), t.showFeedbackForm()
      };
      t.onPageIsNotUsefulButtonClicked(n)
    }, this.bindSomethingIsWrongButton = function () {
      var n = function () {
        e.trackEvent(t.somethingIsWrongTrackEventParams()), t.showFeedbackForm()
      };
      t.onSomethingIsWrongButtonClicked(n)
    }, this.bindSubmitFeedbackButton = function () {
      t.onSubmitFeedbackForm(e.handleSubmitFeedback)
    }, this.handleSubmitFeedback = function () {
      $.ajax({
        type: "POST",
        url: "/contact/govuk/page_improvements",
        data: t.feedbackFormContainerData(),
        beforeSend: t.disableSubmitFeedbackButton
      }).done(function () {
        e.trackEvent(t.feedbackFormContainerTrackEventParams()), t.replaceWithSuccess()
      }).fail(function (e) {
        422 == e.status ? (t.renderErrors(e.responseJSON.errors), t.enableSubmitFeedbackButton()) : t.replaceWithGenericError()
      })
    }, this.trackEvent = function (t) {
      GOVUK.analytics && GOVUK.analytics.trackEvent && GOVUK.analytics.trackEvent(t.category, t.action)
    }
  }

  t.ImproveThisPage = e
}(window.GOVUK.Modules), $(document).ready(function () {
  GOVUK.modules.start()
}), window.GOVUK.stickAtTopWhenScrolling.init(), window.GOVUK.stopScrollingAtFooter.addEl($(".js-stick-at-top-when-scrolling"));
