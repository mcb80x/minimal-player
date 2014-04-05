(function(a, b, c) {
    (function(a) {
        "use strict", "function" == typeof define && define.amd ? define(["jquery"], a) : jQuery && !jQuery.fn.qtip && a(jQuery)
    })(function(d) {
        function f(a, b, c, e) {
            this.id = c, this.target = a, this.tooltip = D, this.elements = {
                target: a
            }, this._id = M + "-" + c, this.timers = {
                img: {}
            }, this.options = b, this.plugins = {}, this.cache = {
                event: {},
                target: d(),
                disabled: C,
                attr: e,
                onTooltip: C,
                lastClass: ""
            }, this.rendered = this.destroyed = this.disabled = this.waiting = this.hiddenDuringWait = this.positioning = this.triggering = C
        }

        function g(a) {
            return a === D || "object" !== d.type(a)
        }

        function h(a) {
            return !(d.isFunction(a) || a && a.attr || a.length || "object" === d.type(a) && (a.jquery || a.then))
        }

        function j(a) {
            var b, c, e, f;
            return g(a) ? C : (g(a.metadata) && (a.metadata = {
                type: a.metadata
            }), "content" in a && (b = a.content, g(b) || b.jquery || b.done ? b = a.content = {
                text: c = h(b) ? C : b
            } : c = b.text, "ajax" in b && (e = b.ajax, f = e && e.once !== C, delete b.ajax, b.text = function(a, b) {
                var g = c || d(this).attr(b.options.content.attr) || "Loading...",
                    h = d.ajax(d.extend({}, e, {
                        context: b
                    })).then(e.success, D, e.error).then(function(a) {
                        return a && f && b.set("content.text", a), a
                    }, function(a, c, d) {
                        b.destroyed || 0 === a.status || b.set("content.text", c + ": " + d)
                    });
                return f ? g : (b.set("content.text", g), h)
            }), "title" in b && (g(b.title) || (b.button = b.title.button, b.title = b.title.text), h(b.title || C) && (b.title = C))), "position" in a && g(a.position) && (a.position = {
                my: a.position,
                at: a.position
            }), "show" in a && g(a.show) && (a.show = a.show.jquery ? {
                target: a.show
            } : a.show === B ? {
                ready: B
            } : {
                event: a.show
            }), "hide" in a && g(a.hide) && (a.hide = a.hide.jquery ? {
                target: a.hide
            } : {
                event: a.hide
            }), "style" in a && g(a.style) && (a.style = {
                classes: a.style
            }), d.each(L, function() {
                this.sanitize && this.sanitize(a)
            }), a)
        }

        function k(a, b) {
            for (var c, d = 0, e = a, f = b.split("."); e = e[f[d++]];) f.length > d && (c = e);
            return [c || a, f.pop()]
        }

        function l(a, b) {
            var c, d, e;
            for (c in this.checks)
                for (d in this.checks[c])(e = RegExp(d, "i").exec(a)) && (b.push(e), ("builtin" === c || this.plugins[c]) && this.checks[c][d].apply(this.plugins[c] || this, b))
        }

        function m(a) {
            return P.concat("").join(a ? "-" + a + " " : " ")
        }

        function n(c) {
            return c && {
                type: c.type,
                pageX: c.pageX,
                pageY: c.pageY,
                target: c.target,
                relatedTarget: c.relatedTarget,
                scrollX: c.scrollX || a.pageXOffset || b.body.scrollLeft || b.documentElement.scrollLeft,
                scrollY: c.scrollY || a.pageYOffset || b.body.scrollTop || b.documentElement.scrollTop
            } || {}
        }

        function o(a, b) {
            return b > 0 ? setTimeout(d.proxy(a, this), b) : (a.call(this), c)
        }

        function p(a) {
            return this.tooltip.hasClass(W) ? C : (clearTimeout(this.timers.show), clearTimeout(this.timers.hide), this.timers.show = o.call(this, function() {
                this.toggle(B, a)
            }, this.options.show.delay), c)
        }

        function q(a) {
            if (this.tooltip.hasClass(W)) return C;
            var b = d(a.relatedTarget),
                c = b.closest(Q)[0] === this.tooltip[0],
                e = b[0] === this.options.show.target[0];
            if (clearTimeout(this.timers.show), clearTimeout(this.timers.hide), this !== b[0] && "mouse" === this.options.position.target && c || this.options.hide.fixed && /mouse(out|leave|move)/.test(a.type) && (c || e)) try {
                a.preventDefault(), a.stopImmediatePropagation()
            } catch (f) {} else this.timers.hide = o.call(this, function() {
                this.toggle(C, a)
            }, this.options.hide.delay, this)
        }

        function r(a) {
            return this.tooltip.hasClass(W) || !this.options.hide.inactive ? C : (clearTimeout(this.timers.inactive), this.timers.inactive = o.call(this, function() {
                this.hide(a)
            }, this.options.hide.inactive), c)
        }

        function s(a) {
            this.rendered && this.tooltip[0].offsetWidth > 0 && this.reposition(a)
        }

        function u(a, c, f) {
            d(b.body).delegate(a, (c.split ? c : c.join(bb + " ")) + bb, function() {
                var a = w.api[d.attr(this, O)];
                a && !a.disabled && f.apply(a, arguments)
            })
        }

        function v(a, c, g) {
            var h, i, k, l, m, n = d(b.body),
                o = a[0] === b ? n : a,
                p = a.metadata ? a.metadata(g.metadata) : D,
                q = "html5" === g.metadata.type && p ? p[g.metadata.name] : D,
                r = a.data(g.metadata.name || "qtipopts");
            try {
                r = "string" == typeof r ? d.parseJSON(r) : r
            } catch (s) {}
            if (l = d.extend(B, {}, w.defaults, g, "object" == typeof r ? j(r) : D, j(q || p)), i = l.position, l.id = c, "boolean" == typeof l.content.text) {
                if (k = a.attr(l.content.attr), l.content.attr === C || !k) return C;
                l.content.text = k
            }
            if (i.container.length || (i.container = n), i.target === C && (i.target = o), l.show.target === C && (l.show.target = o), l.show.solo === B && (l.show.solo = i.container.closest("body")), l.hide.target === C && (l.hide.target = o), l.position.viewport === B && (l.position.viewport = i.container), i.container = i.container.eq(0), i.at = new y(i.at, B), i.my = new y(i.my), a.data(M))
                if (l.overwrite) a.qtip("destroy", !0);
                else if (l.overwrite === C) return C;
            return a.attr(N, c), l.suppress && (m = a.attr("title")) && a.removeAttr("title").attr(Y, m).attr("title", ""), h = new f(a, l, c, !! k), a.data(M, h), a.one("remove.qtip-" + c + " removeqtip.qtip-" + c, function() {
                var a;
                (a = d(this).data(M)) && a.destroy(!0)
            }), h
        }
        "use strict";
        var w, x, y, z, A, B = !0,
            C = !1,
            D = null,
            E = "x",
            F = "y",
            G = "top",
            H = "left",
            I = "bottom",
            J = "right",
            K = "center",
            L = {}, M = "qtip",
            N = "data-hasqtip",
            O = "data-qtip-id",
            P = ["ui-widget", "ui-tooltip"],
            Q = "." + M,
            R = "click dblclick mousedown mouseup mousemove mouseleave mouseenter".split(" "),
            S = M + "-fixed",
            T = M + "-default",
            U = M + "-focus",
            V = M + "-hover",
            W = M + "-disabled",
            X = "_replacedByqTip",
            Y = "oldtitle",
            Z = {
                ie: function() {
                    for (var a = 3, c = b.createElement("div");
                        (c.innerHTML = "<!--[if gt IE " + ++a + "]><i></i><![endif]-->") && c.getElementsByTagName("i")[0];);
                    return a > 4 ? a : NaN
                }(),
                iOS: parseFloat(("" + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) || C
            };
        x = f.prototype, x._when = function(a) {
            return d.when.apply(d, a)
        }, x.render = function(a) {
            if (this.rendered || this.destroyed) return this;
            var b, c = this,
                e = this.options,
                f = this.cache,
                g = this.elements,
                h = e.content.text,
                i = e.content.title,
                j = e.content.button,
                k = e.position,
                l = ("." + this._id + " ", []);
            return d.attr(this.target[0], "aria-describedby", this._id), this.tooltip = g.tooltip = b = d("<div/>", {
                id: this._id,
                "class": [M, T, e.style.classes, M + "-pos-" + e.position.my.abbrev()].join(" "),
                width: e.style.width || "",
                height: e.style.height || "",
                tracking: "mouse" === k.target && k.adjust.mouse,
                role: "alert",
                "aria-live": "polite",
                "aria-atomic": C,
                "aria-describedby": this._id + "-content",
                "aria-hidden": B
            }).toggleClass(W, this.disabled).attr(O, this.id).data(M, this).appendTo(k.container).append(g.content = d("<div />", {
                "class": M + "-content",
                id: this._id + "-content",
                "aria-atomic": B
            })), this.rendered = -1, this.positioning = B, i && (this._createTitle(), d.isFunction(i) || l.push(this._updateTitle(i, C))), j && this._createButton(), d.isFunction(h) || l.push(this._updateContent(h, C)), this.rendered = B, this._setWidget(), d.each(L, function(a) {
                var b;
                "render" === this.initialize && (b = this(c)) && (c.plugins[a] = b)
            }), this._unassignEvents(), this._assignEvents(), this._when(l).then(function() {
                c._trigger("render"), c.positioning = C, c.hiddenDuringWait || !e.show.ready && !a || c.toggle(B, f.event, C), c.hiddenDuringWait = C
            }), w.api[this.id] = this, this
        }, x.destroy = function(a) {
            function b() {
                if (!this.destroyed) {
                    this.destroyed = B;
                    var a = this.target,
                        b = a.attr(Y);
                    this.rendered && this.tooltip.stop(1, 0).find("*").remove().end().remove(), d.each(this.plugins, function() {
                        this.destroy && this.destroy()
                    }), clearTimeout(this.timers.show), clearTimeout(this.timers.hide), this._unassignEvents(), a.removeData(M).removeAttr(O).removeAttr(N).removeAttr("aria-describedby"), this.options.suppress && b && a.attr("title", b).removeAttr(Y), this._unbind(a), this.options = this.elements = this.cache = this.timers = this.plugins = this.mouse = D, delete w.api[this.id]
                }
            }
            return this.destroyed ? this.target : (a === B && "hide" !== this.triggering || !this.rendered ? b.call(this) : (this.tooltip.one("tooltiphidden", d.proxy(b, this)), !this.triggering && this.hide()), this.target)
        }, z = x.checks = {
            builtin: {
                "^id$": function(a, b, c, e) {
                    var f = c === B ? w.nextid : c,
                        g = M + "-" + f;
                    f !== C && f.length > 0 && !d("#" + g).length ? (this._id = g, this.rendered && (this.tooltip[0].id = this._id, this.elements.content[0].id = this._id + "-content", this.elements.title[0].id = this._id + "-title")) : a[b] = e
                },
                "^prerender": function(a, b, c) {
                    c && !this.rendered && this.render(this.options.show.ready)
                },
                "^content.text$": function(a, b, c) {
                    this._updateContent(c)
                },
                "^content.attr$": function(a, b, c, d) {
                    this.options.content.text === this.target.attr(d) && this._updateContent(this.target.attr(c))
                },
                "^content.title$": function(a, b, d) {
                    return d ? (d && !this.elements.title && this._createTitle(), this._updateTitle(d), c) : this._removeTitle()
                },
                "^content.button$": function(a, b, c) {
                    this._updateButton(c)
                },
                "^content.title.(text|button)$": function(a, b, c) {
                    this.set("content." + b, c)
                },
                "^position.(my|at)$": function(a, b, c) {
                    "string" == typeof c && (a[b] = new y(c, "at" === b))
                },
                "^position.container$": function(a, b, c) {
                    this.rendered && this.tooltip.appendTo(c)
                },
                "^show.ready$": function(a, b, c) {
                    c && (!this.rendered && this.render(B) || this.toggle(B))
                },
                "^style.classes$": function(a, b, c, d) {
                    this.rendered && this.tooltip.removeClass(d).addClass(c)
                },
                "^style.(width|height)": function(a, b, c) {
                    this.rendered && this.tooltip.css(b, c)
                },
                "^style.widget|content.title": function() {
                    this.rendered && this._setWidget()
                },
                "^style.def": function(a, b, c) {
                    this.rendered && this.tooltip.toggleClass(T, !! c)
                },
                "^events.(render|show|move|hide|focus|blur)$": function(a, b, c) {
                    this.rendered && this.tooltip[(d.isFunction(c) ? "" : "un") + "bind"]("tooltip" + b, c)
                },
                "^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)": function() {
                    if (this.rendered) {
                        var a = this.options.position;
                        this.tooltip.attr("tracking", "mouse" === a.target && a.adjust.mouse), this._unassignEvents(), this._assignEvents()
                    }
                }
            }
        }, x.get = function(a) {
            if (this.destroyed) return this;
            var b = k(this.options, a.toLowerCase()),
                c = b[0][b[1]];
            return c.precedance ? c.string() : c
        };
        var $ = /^position\.(my|at|adjust|target|container|viewport)|style|content|show\.ready/i,
            _ = /^prerender|show\.ready/i;
        x.set = function(a, b) {
            if (this.destroyed) return this;
            var e, f = this.rendered,
                g = C,
                h = this.options;
            return this.checks, "string" == typeof a ? (e = a, a = {}, a[e] = b) : a = d.extend({}, a), d.each(a, function(b, e) {
                if (f && _.test(b)) return delete a[b], c;
                var j, l = k(h, b.toLowerCase());
                j = l[0][l[1]], l[0][l[1]] = e && e.nodeType ? d(e) : e, g = $.test(b) || g, a[b] = [l[0], l[1], e, j]
            }), j(h), this.positioning = B, d.each(a, d.proxy(l, this)), this.positioning = C, this.rendered && this.tooltip[0].offsetWidth > 0 && g && this.reposition("mouse" === h.position.target ? D : this.cache.event), this
        }, x._update = function(a, b) {
            var c = this,
                e = this.cache;
            return this.rendered && a ? (d.isFunction(a) && (a = a.call(this.elements.target, e.event, this) || ""), d.isFunction(a.then) ? (e.waiting = B, a.then(function(a) {
                return e.waiting = C, c._update(a, b)
            }, D, function(a) {
                return c._update(a, b)
            })) : a === C || !a && "" !== a ? C : (a.jquery && a.length > 0 ? b.empty().append(a.css({
                display: "block",
                visibility: "visible"
            })) : b.html(a), this._waitForContent(b).then(function(a) {
                a.images && a.images.length && c.rendered && c.tooltip[0].offsetWidth > 0 && c.reposition(e.event, !a.length)
            }))) : C
        }, x._waitForContent = function(a) {
            var b = this.cache;
            return b.waiting = B, (d.fn.imagesLoaded ? a.imagesLoaded() : d.Deferred().resolve([])).done(function() {
                b.waiting = C
            }).promise()
        }, x._updateContent = function(a, b) {
            this._update(a, this.elements.content, b)
        }, x._updateTitle = function(a, b) {
            this._update(a, this.elements.title, b) === C && this._removeTitle(C)
        }, x._createTitle = function() {
            var a = this.elements,
                b = this._id + "-title";
            a.titlebar && this._removeTitle(), a.titlebar = d("<div />", {
                "class": M + "-titlebar " + (this.options.style.widget ? m("header") : "")
            }).append(a.title = d("<div />", {
                id: b,
                "class": M + "-title",
                "aria-atomic": B
            })).insertBefore(a.content).delegate(".qtip-close", "mousedown keydown mouseup keyup mouseout", function(a) {
                d(this).toggleClass("ui-state-active ui-state-focus", "down" === a.type.substr(-4))
            }).delegate(".qtip-close", "mouseover mouseout", function(a) {
                d(this).toggleClass("ui-state-hover", "mouseover" === a.type)
            }), this.options.content.button && this._createButton()
        }, x._removeTitle = function(a) {
            var b = this.elements;
            b.title && (b.titlebar.remove(), b.titlebar = b.title = b.button = D, a !== C && this.reposition())
        }, x.reposition = function(c, f) {
            if (!this.rendered || this.positioning || this.destroyed) return this;
            this.positioning = B;
            var g, h, i = this.cache,
                j = this.tooltip,
                k = this.options.position,
                l = k.target,
                m = k.my,
                n = k.at,
                o = k.viewport,
                p = k.container,
                q = k.adjust,
                r = q.method.split(" "),
                s = j.outerWidth(C),
                u = j.outerHeight(C),
                v = 0,
                w = 0,
                x = j.css("position"),
                y = {
                    left: 0,
                    top: 0
                }, z = j[0].offsetWidth > 0,
                A = c && "scroll" === c.type,
                D = d(a),
                E = p[0].ownerDocument,
                F = this.mouse;
            if (d.isArray(l) && 2 === l.length) n = {
                x: H,
                y: G
            }, y = {
                left: l[0],
                top: l[1]
            };
            else if ("mouse" === l) n = {
                x: H,
                y: G
            }, !F || !F.pageX || !q.mouse && c && c.pageX ? c && c.pageX || ((!q.mouse || this.options.show.distance) && i.origin && i.origin.pageX ? c = i.origin : (!c || c && ("resize" === c.type || "scroll" === c.type)) && (c = i.event)) : c = F, "static" !== x && (y = p.offset()), E.body.offsetWidth !== (a.innerWidth || E.documentElement.clientWidth) && (h = d(b.body).offset()), y = {
                left: c.pageX - y.left + (h && h.left || 0),
                top: c.pageY - y.top + (h && h.top || 0)
            }, q.mouse && A && F && (y.left -= (F.scrollX || 0) - D.scrollLeft(), y.top -= (F.scrollY || 0) - D.scrollTop());
            else {
                if ("event" === l ? c && c.target && "scroll" !== c.type && "resize" !== c.type ? i.target = d(c.target) : c.target || (i.target = this.elements.target) : "event" !== l && (i.target = d(l.jquery ? l : this.elements.target)), l = i.target, l = d(l).eq(0), 0 === l.length) return this;
                l[0] === b || l[0] === a ? (v = Z.iOS ? a.innerWidth : l.width(), w = Z.iOS ? a.innerHeight : l.height(), l[0] === a && (y = {
                    top: (o || l).scrollTop(),
                    left: (o || l).scrollLeft()
                })) : L.imagemap && l.is("area") ? g = L.imagemap(this, l, n, L.viewport ? r : C) : L.svg && l && l[0].ownerSVGElement ? g = L.svg(this, l, n, L.viewport ? r : C) : (v = l.outerWidth(C), w = l.outerHeight(C), y = l.offset()), g && (v = g.width, w = g.height, h = g.offset, y = g.position), y = this.reposition.offset(l, y, p), (Z.iOS > 3.1 && 4.1 > Z.iOS || Z.iOS >= 4.3 && 4.33 > Z.iOS || !Z.iOS && "fixed" === x) && (y.left -= D.scrollLeft(), y.top -= D.scrollTop()), (!g || g && g.adjustable !== C) && (y.left += n.x === J ? v : n.x === K ? v / 2 : 0, y.top += n.y === I ? w : n.y === K ? w / 2 : 0)
            }
            return y.left += q.x + (m.x === J ? -s : m.x === K ? -s / 2 : 0), y.top += q.y + (m.y === I ? -u : m.y === K ? -u / 2 : 0), L.viewport ? (y.adjusted = L.viewport(this, y, k, v, w, s, u), h && y.adjusted.left && (y.left += h.left), h && y.adjusted.top && (y.top += h.top)) : y.adjusted = {
                left: 0,
                top: 0
            }, this._trigger("move", [y, o.elem || o], c) ? (delete y.adjusted, f === C || !z || isNaN(y.left) || isNaN(y.top) || "mouse" === l || !d.isFunction(k.effect) ? j.css(y) : d.isFunction(k.effect) && (k.effect.call(j, this, d.extend({}, y)), j.queue(function(a) {
                d(this).css({
                    opacity: "",
                    height: ""
                }), Z.ie && this.style.removeAttribute("filter"), a()
            })), this.positioning = C, this) : this
        }, x.reposition.offset = function(a, c, f) {
            function g(a, b) {
                c.left += b * a.scrollLeft(), c.top += b * a.scrollTop()
            }
            if (!f[0]) return c;
            var h, i, j, k, l = d(a[0].ownerDocument),
                m = !! Z.ie && "CSS1Compat" !== b.compatMode,
                n = f[0];
            do "static" !== (i = d.css(n, "position")) && ("fixed" === i ? (j = n.getBoundingClientRect(), g(l, -1)) : (j = d(n).position(), j.left += parseFloat(d.css(n, "borderLeftWidth")) || 0, j.top += parseFloat(d.css(n, "borderTopWidth")) || 0), c.left -= j.left + (parseFloat(d.css(n, "marginLeft")) || 0), c.top -= j.top + (parseFloat(d.css(n, "marginTop")) || 0), h || "hidden" === (k = d.css(n, "overflow")) || "visible" === k || (h = d(n))); while (n = n.offsetParent);
            return h && (h[0] !== l[0] || m) && g(h, 1), c
        };
        var ba = (y = x.reposition.Corner = function(a, b) {
            a = ("" + a).replace(/([A-Z])/, " $1").replace(/middle/gi, K).toLowerCase(), this.x = (a.match(/left|right/i) || a.match(/center/) || ["inherit"])[0].toLowerCase(), this.y = (a.match(/top|bottom|center/i) || ["inherit"])[0].toLowerCase(), this.forceY = !! b;
            var c = a.charAt(0);
            this.precedance = "t" === c || "b" === c ? F : E
        }).prototype;
        ba.invert = function(a, b) {
            this[a] = this[a] === H ? J : this[a] === J ? H : b || this[a]
        }, ba.string = function() {
            var a = this.x,
                b = this.y;
            return a === b ? a : this.precedance === F || this.forceY && "center" !== b ? b + " " + a : a + " " + b
        }, ba.abbrev = function() {
            var a = this.string().split(" ");
            return a[0].charAt(0) + (a[1] && a[1].charAt(0) || "")
        }, ba.clone = function() {
            return new y(this.string(), this.forceY)
        }, x.toggle = function(a, c) {
            var f = this.cache,
                g = this.options,
                h = this.tooltip;
            if (c) {
                if (/over|enter/.test(c.type) && /out|leave/.test(f.event.type) && g.show.target.add(c.target).length === g.show.target.length && h.has(c.relatedTarget).length) return this;
                f.event = n(c)
            }
            if (this.waiting && !a && (this.hiddenDuringWait = B), !this.rendered) return a ? this.render(1) : this;
            if (this.destroyed || this.disabled) return this;
            var i, j, k, l = a ? "show" : "hide",
                m = this.options[l],
                o = (this.options[a ? "hide" : "show"], this.options.position),
                p = this.options.content,
                q = this.tooltip.css("width"),
                r = this.tooltip[0].offsetWidth > 0,
                s = a || 1 === m.target.length,
                t = !c || 2 > m.target.length || f.target[0] === c.target;
            return (typeof a).search("boolean|number") && (a = !r), i = !h.is(":animated") && r === a && t, j = i ? D : !! this._trigger(l, [90]), this.destroyed ? this : (j !== C && a && this.focus(c), !j || i ? this : (d.attr(h[0], "aria-hidden", !a), a ? (f.origin = n(this.mouse), d.isFunction(p.text) && this._updateContent(p.text, C), d.isFunction(p.title) && this._updateTitle(p.title, C), !A && "mouse" === o.target && o.adjust.mouse && (d(b).bind("mousemove." + M, this._storeMouse), A = B), q || h.css("width", h.outerWidth(C)), this.reposition(c, arguments[2]), q || h.css("width", ""), m.solo && ("string" == typeof m.solo ? d(m.solo) : d(Q, m.solo)).not(h).not(m.target).qtip("hide", d.Event("tooltipsolo"))) : (clearTimeout(this.timers.show), delete f.origin, A && !d(Q + '[tracking="true"]:visible', m.solo).not(h).length && (d(b).unbind("mousemove." + M), A = C), this.blur(c)), k = d.proxy(function() {
                a ? (Z.ie && h[0].style.removeAttribute("filter"), h.css("overflow", ""), "string" == typeof m.autofocus && d(this.options.show.autofocus, h).focus(), this.options.show.target.trigger("qtip-" + this.id + "-inactive")) : h.css({
                    display: "",
                    visibility: "",
                    opacity: "",
                    left: "",
                    top: ""
                }), this._trigger(a ? "visible" : "hidden")
            }, this), m.effect === C || s === C ? (h[l](), k()) : d.isFunction(m.effect) ? (h.stop(1, 1), m.effect.call(h, this), h.queue("fx", function(a) {
                k(), a()
            })) : h.fadeTo(90, a ? 1 : 0, k), a && m.target.trigger("qtip-" + this.id + "-inactive"), this))
        }, x.show = function(a) {
            return this.toggle(B, a)
        }, x.hide = function(a) {
            return this.toggle(C, a)
        }, x.focus = function(a) {
            if (!this.rendered || this.destroyed) return this;
            var b = d(Q),
                c = this.tooltip,
                e = parseInt(c[0].style.zIndex, 10),
                f = w.zindex + b.length;
            return c.hasClass(U) || this._trigger("focus", [f], a) && (e !== f && (b.each(function() {
                this.style.zIndex > e && (this.style.zIndex = this.style.zIndex - 1)
            }), b.filter("." + U).qtip("blur", a)), c.addClass(U)[0].style.zIndex = f), this
        }, x.blur = function(a) {
            return !this.rendered || this.destroyed ? this : (this.tooltip.removeClass(U), this._trigger("blur", [this.tooltip.css("zIndex")], a), this)
        }, x.disable = function(a) {
            return this.destroyed ? this : ("toggle" === a ? a = this.rendered ? !this.tooltip.hasClass(W) : !this.disabled : "boolean" != typeof a && (a = B), this.rendered && this.tooltip.toggleClass(W, a).attr("aria-disabled", a), this.disabled = !! a, this)
        }, x.enable = function() {
            return this.disable(C)
        }, x._createButton = function() {
            var a = this,
                b = this.elements,
                c = b.tooltip,
                e = this.options.content.button,
                f = "string" == typeof e,
                g = f ? e : "Close tooltip";
            b.button && b.button.remove(), b.button = e.jquery ? e : d("<a />", {
                "class": "qtip-close " + (this.options.style.widget ? "" : M + "-icon"),
                title: g,
                "aria-label": g
            }).prepend(d("<span />", {
                "class": "ui-icon ui-icon-close",
                html: "&times;"
            })), b.button.appendTo(b.titlebar || c).attr("role", "button").click(function(b) {
                return c.hasClass(W) || a.hide(b), C
            })
        }, x._updateButton = function(a) {
            if (!this.rendered) return C;
            var b = this.elements.button;
            a ? this._createButton() : b.remove()
        }, x._setWidget = function() {
            var a = this.options.style.widget,
                b = this.elements,
                c = b.tooltip,
                d = c.hasClass(W);
            c.removeClass(W), W = a ? "ui-state-disabled" : "qtip-disabled", c.toggleClass(W, d), c.toggleClass("ui-helper-reset " + m(), a).toggleClass(T, this.options.style.def && !a), b.content && b.content.toggleClass(m("content"), a), b.titlebar && b.titlebar.toggleClass(m("header"), a), b.button && b.button.toggleClass(M + "-icon", !a)
        }, x._storeMouse = function(a) {
            (this.mouse = n(a)).type = "mousemove"
        }, x._bind = function(a, b, c, e, f) {
            var g = "." + this._id + (e ? "-" + e : "");
            b.length && d(a).bind((b.split ? b : b.join(g + " ")) + g, d.proxy(c, f || this))
        }, x._unbind = function(a, b) {
            d(a).unbind("." + this._id + (b ? "-" + b : ""))
        };
        var bb = "." + M;
        d(function() {
            u(Q, ["mouseenter", "mouseleave"], function(a) {
                var b = "mouseenter" === a.type,
                    c = d(a.currentTarget),
                    e = d(a.relatedTarget || a.target),
                    f = this.options;
                b ? (this.focus(a), c.hasClass(S) && !c.hasClass(W) && clearTimeout(this.timers.hide)) : "mouse" === f.position.target && f.hide.event && f.show.target && !e.closest(f.show.target[0]).length && this.hide(a), c.toggleClass(V, b)
            }), u("[" + O + "]", R, r)
        }), x._trigger = function(a, b, c) {
            var e = d.Event("tooltip" + a);
            return e.originalEvent = c && d.extend({}, c) || this.cache.event || D, this.triggering = a, this.tooltip.trigger(e, [this].concat(b || [])), this.triggering = C, !e.isDefaultPrevented()
        }, x._bindEvents = function(a, b, e, f, g, h) {
            if (f.add(e).length === f.length) {
                var j = [];
                b = d.map(b, function(b) {
                    var e = d.inArray(b, a);
                    return e > -1 ? (j.push(a.splice(e, 1)[0]), c) : b
                }), j.length && this._bind(e, j, function(a) {
                    var b = this.rendered ? this.tooltip[0].offsetWidth > 0 : !1;
                    (b ? h : g).call(this, a)
                })
            }
            this._bind(e, a, g), this._bind(f, b, h)
        }, x._assignInitialEvents = function(a) {
            function b(a) {
                return this.disabled || this.destroyed ? C : (this.cache.event = n(a), this.cache.target = a ? d(a.target) : [c], clearTimeout(this.timers.show), this.timers.show = o.call(this, function() {
                    this.render("object" == typeof a || e.show.ready)
                }, e.show.delay), c)
            }
            var e = this.options,
                f = e.show.target,
                g = e.hide.target,
                h = e.show.event ? d.trim("" + e.show.event).split(" ") : [],
                j = e.hide.event ? d.trim("" + e.hide.event).split(" ") : [];
            /mouse(over|enter)/i.test(e.show.event) && !/mouse(out|leave)/i.test(e.hide.event) && j.push("mouseleave"), this._bind(f, "mousemove", function(a) {
                this._storeMouse(a), this.cache.onTarget = B
            }), this._bindEvents(h, j, f, g, b, function() {
                clearTimeout(this.timers.show)
            }), (e.show.ready || e.prerender) && b.call(this, a)
        }, x._assignEvents = function() {
            var c = this,
                f = this.options,
                g = f.position,
                h = this.tooltip,
                i = f.show.target,
                j = f.hide.target,
                k = g.container,
                l = g.viewport,
                m = d(b),
                n = (d(b.body), d(a)),
                o = f.show.event ? d.trim("" + f.show.event).split(" ") : [],
                u = f.hide.event ? d.trim("" + f.hide.event).split(" ") : [];
            d.each(f.events, function(a, b) {
                c._bind(h, "toggle" === a ? ["tooltipshow", "tooltiphide"] : ["tooltip" + a], b, null, h)
            }), /mouse(out|leave)/i.test(f.hide.event) && "window" === f.hide.leave && this._bind(m, ["mouseout", "blur"], function(a) {
                /select|option/.test(a.target.nodeName) || a.relatedTarget || this.hide(a)
            }), f.hide.fixed ? j = j.add(h.addClass(S)) : /mouse(over|enter)/i.test(f.show.event) && this._bind(j, "mouseleave", function() {
                clearTimeout(this.timers.show)
            }), ("" + f.hide.event).indexOf("unfocus") > -1 && this._bind(k.closest("html"), ["mousedown", "touchstart"], function(a) {
                var b = d(a.target),
                    c = this.rendered && !this.tooltip.hasClass(W) && this.tooltip[0].offsetWidth > 0,
                    e = b.parents(Q).filter(this.tooltip[0]).length > 0;
                b[0] === this.target[0] || b[0] === this.tooltip[0] || e || this.target.has(b[0]).length || !c || this.hide(a)
            }), "number" == typeof f.hide.inactive && (this._bind(i, "qtip-" + this.id + "-inactive", r), this._bind(j.add(h), w.inactiveEvents, r, "-inactive")), this._bindEvents(o, u, i, j, p, q), this._bind(i.add(h), "mousemove", function(a) {
                if ("number" == typeof f.hide.distance) {
                    var b = this.cache.origin || {}, c = this.options.hide.distance,
                        d = Math.abs;
                    (d(a.pageX - b.pageX) >= c || d(a.pageY - b.pageY) >= c) && this.hide(a)
                }
                this._storeMouse(a)
            }), "mouse" === g.target && g.adjust.mouse && (f.hide.event && this._bind(i, ["mouseenter", "mouseleave"], function(a) {
                this.cache.onTarget = "mouseenter" === a.type
            }), this._bind(m, "mousemove", function(a) {
                this.rendered && this.cache.onTarget && !this.tooltip.hasClass(W) && this.tooltip[0].offsetWidth > 0 && this.reposition(a)
            })), (g.adjust.resize || l.length) && this._bind(d.event.special.resize ? l : n, "resize", s), g.adjust.scroll && this._bind(n.add(g.container), "scroll", s)
        }, x._unassignEvents = function() {
            var c = [this.options.show.target[0], this.options.hide.target[0], this.rendered && this.tooltip[0], this.options.position.container[0], this.options.position.viewport[0], this.options.position.container.closest("html")[0], a, b];
            this._unbind(d([]).pushStack(d.grep(c, function(a) {
                return "object" == typeof a
            })))
        }, w = d.fn.qtip = function(a, b, e) {
            var f = ("" + a).toLowerCase(),
                g = D,
                h = d.makeArray(arguments).slice(1),
                k = h[h.length - 1],
                l = this[0] ? d.data(this[0], M) : D;
            return !arguments.length && l || "api" === f ? l : "string" == typeof a ? (this.each(function() {
                var a = d.data(this, M);
                if (!a) return B;
                if (k && k.timeStamp && (a.cache.event = k), !b || "option" !== f && "options" !== f) a[f] && a[f].apply(a, h);
                else {
                    if (e === c && !d.isPlainObject(b)) return g = a.get(b), C;
                    a.set(b, e)
                }
            }), g !== D ? g : this) : "object" != typeof a && arguments.length ? c : (l = j(d.extend(B, {}, a)), this.each(function(a) {
                var b, e;
                return e = d.isArray(l.id) ? l.id[a] : l.id, e = !e || e === C || 1 > e.length || w.api[e] ? w.nextid++ : e, b = v(d(this), e, l), b === C ? B : (w.api[e] = b, d.each(L, function() {
                    "initialize" === this.initialize && this(b)
                }), b._assignInitialEvents(k), c)
            }))
        }, d.qtip = f, w.api = {}, d.each({
            attr: function(a, b) {
                if (this.length) {
                    var c = this[0],
                        e = "title",
                        f = d.data(c, "qtip");
                    if (a === e && f && "object" == typeof f && f.options.suppress) return 2 > arguments.length ? d.attr(c, Y) : (f && f.options.content.attr === e && f.cache.attr && f.set("content.text", b), this.attr(Y, b))
                }
                return d.fn["attr" + X].apply(this, arguments)
            },
            clone: function(a) {
                var b = (d([]), d.fn["clone" + X].apply(this, arguments));
                return a || b.filter("[" + Y + "]").attr("title", function() {
                    return d.attr(this, Y)
                }).removeAttr(Y), b
            }
        }, function(a, b) {
            if (!b || d.fn[a + X]) return B;
            var c = d.fn[a + X] = d.fn[a];
            d.fn[a] = function() {
                return b.apply(this, arguments) || c.apply(this, arguments)
            }
        }), d.ui || (d["cleanData" + X] = d.cleanData, d.cleanData = function(a) {
            for (var b, c = 0;
                (b = d(a[c])).length; c++)
                if (b.attr(N)) try {
                    b.triggerHandler("removeqtip")
                } catch (e) {}
                d["cleanData" + X].apply(this, arguments)
        }), w.version = "2.0.1-251", w.nextid = 0, w.inactiveEvents = R, w.zindex = 15e3, w.defaults = {
            prerender: C,
            id: C,
            overwrite: B,
            suppress: B,
            content: {
                text: B,
                attr: "title",
                title: C,
                button: C
            },
            position: {
                my: "top left",
                at: "bottom right",
                target: C,
                container: C,
                viewport: C,
                adjust: {
                    x: 0,
                    y: 0,
                    mouse: B,
                    scroll: B,
                    resize: B,
                    method: "flipinvert flipinvert"
                },
                effect: function(a, b) {
                    d(this).animate(b, {
                        duration: 200,
                        queue: C
                    })
                }
            },
            show: {
                target: C,
                event: "mouseenter",
                effect: B,
                delay: 90,
                solo: C,
                ready: C,
                autofocus: C
            },
            hide: {
                target: C,
                event: "mouseleave",
                effect: B,
                delay: 0,
                fixed: C,
                inactive: C,
                leave: "window",
                distance: C
            },
            style: {
                classes: "",
                widget: C,
                width: C,
                height: C,
                def: B
            },
            events: {
                render: D,
                move: D,
                show: D,
                hide: D,
                toggle: D,
                visible: D,
                hidden: D,
                focus: D,
                blur: D
            }
        }
    })
})(window, document);
var buzz = {
    defaults: {
        autoplay: !1,
        duration: 5e3,
        formats: [],
        loop: !1,
        placeholder: "--",
        preload: "metadata",
        volume: 80
    },
    types: {
        mp3: "audio/mpeg",
        ogg: "audio/ogg",
        wav: "audio/wav",
        aac: "audio/aac",
        m4a: "audio/x-m4a"
    },
    sounds: [],
    el: document.createElement("audio"),
    sound: function(a, b) {
        function g(a) {
            var b = [],
                c = a.length - 1;
            for (var d = 0; d <= c; d++) b.push({
                start: a.start(c),
                end: a.end(c)
            });
            return b
        }

        function h(a) {
            return a.split(".").pop()
        }

        function i(a, b) {
            var c = document.createElement("source");
            c.src = b, buzz.types[h(b)] && (c.type = buzz.types[h(b)]), a.appendChild(c)
        }
        b = b || {};
        var c = 0,
            d = [],
            e = {}, f = buzz.isSupported();
        this.load = function() {
            return f ? (this.sound.load(), this) : this
        }, this.play = function() {
            return f ? (this.sound.play(), this) : this
        }, this.togglePlay = function() {
            return f ? (this.sound.paused ? this.sound.play() : this.sound.pause(), this) : this
        }, this.pause = function() {
            return f ? (this.sound.pause(), this) : this
        }, this.isPaused = function() {
            return f ? this.sound.paused : null
        }, this.stop = function() {
            return f ? (this.setTime(0), this.sound.pause(), this) : this
        }, this.isEnded = function() {
            return f ? this.sound.ended : null
        }, this.loop = function() {
            return f ? (this.sound.loop = "loop", this.bind("ended.buzzloop", function() {
                this.currentTime = 0, this.play()
            }), this) : this
        }, this.unloop = function() {
            return f ? (this.sound.removeAttribute("loop"), this.unbind("ended.buzzloop"), this) : this
        }, this.mute = function() {
            return f ? (this.sound.muted = !0, this) : this
        }, this.unmute = function() {
            return f ? (this.sound.muted = !1, this) : this
        }, this.toggleMute = function() {
            return f ? (this.sound.muted = !this.sound.muted, this) : this
        }, this.isMuted = function() {
            return f ? this.sound.muted : null
        }, this.setVolume = function(a) {
            return f ? (a < 0 && (a = 0), a > 100 && (a = 100), this.volume = a, this.sound.volume = a / 100, this) : this
        }, this.getVolume = function() {
            return f ? this.volume : this
        }, this.increaseVolume = function(a) {
            return this.setVolume(this.volume + (a || 1))
        }, this.decreaseVolume = function(a) {
            return this.setVolume(this.volume - (a || 1))
        }, this.setTime = function(a) {
            return f ? (this.whenReady(function() {
                this.sound.currentTime = a
            }), this) : this
        }, this.getTime = function() {
            if (!f) return null;
            var a = Math.round(this.sound.currentTime * 100) / 100;
            return isNaN(a) ? buzz.defaults.placeholder : a
        }, this.setPercent = function(a) {
            return f ? this.setTime(buzz.fromPercent(a, this.sound.duration)) : this
        }, this.getPercent = function() {
            if (!f) return null;
            var a = Math.round(buzz.toPercent(this.sound.currentTime, this.sound.duration));
            return isNaN(a) ? buzz.defaults.placeholder : a
        }, this.setSpeed = function(a) {
            if (!f) return this;
            this.sound.playbackRate = a
        }, this.getSpeed = function() {
            return f ? this.sound.playbackRate : null
        }, this.getDuration = function() {
            if (!f) return null;
            var a = Math.round(this.sound.duration * 100) / 100;
            return isNaN(a) ? buzz.defaults.placeholder : a
        }, this.getPlayed = function() {
            return f ? g(this.sound.played) : null
        }, this.getBuffered = function() {
            return f ? g(this.sound.buffered) : null
        }, this.getSeekable = function() {
            return f ? g(this.sound.seekable) : null
        }, this.getErrorCode = function() {
            return f && this.sound.error ? this.sound.error.code : 0
        }, this.getErrorMessage = function() {
            if (!f) return null;
            switch (this.getErrorCode()) {
                case 1:
                    return "MEDIA_ERR_ABORTED";
                case 2:
                    return "MEDIA_ERR_NETWORK";
                case 3:
                    return "MEDIA_ERR_DECODE";
                case 4:
                    return "MEDIA_ERR_SRC_NOT_SUPPORTED";
                default:
                    return null
            }
        }, this.getStateCode = function() {
            return f ? this.sound.readyState : null
        }, this.getStateMessage = function() {
            if (!f) return null;
            switch (this.getStateCode()) {
                case 0:
                    return "HAVE_NOTHING";
                case 1:
                    return "HAVE_METADATA";
                case 2:
                    return "HAVE_CURRENT_DATA";
                case 3:
                    return "HAVE_FUTURE_DATA";
                case 4:
                    return "HAVE_ENOUGH_DATA";
                default:
                    return null
            }
        }, this.getNetworkStateCode = function() {
            return f ? this.sound.networkState : null
        }, this.getNetworkStateMessage = function() {
            if (!f) return null;
            switch (this.getNetworkStateCode()) {
                case 0:
                    return "NETWORK_EMPTY";
                case 1:
                    return "NETWORK_IDLE";
                case 2:
                    return "NETWORK_LOADING";
                case 3:
                    return "NETWORK_NO_SOURCE";
                default:
                    return null
            }
        }, this.set = function(a, b) {
            return f ? (this.sound[a] = b, this) : this
        }, this.get = function(a) {
            return f ? a ? this.sound[a] : this.sound : null
        }, this.bind = function(a, b) {
            if (!f) return this;
            a = a.split(" ");
            var c = this,
                e = function(a) {
                    b.call(c, a)
                };
            for (var g = 0; g < a.length; g++) {
                var h = a[g],
                    i = h;
                h = i.split(".")[0], d.push({
                    idx: i,
                    func: e
                }), this.sound.addEventListener(h, e, !0)
            }
            return this
        }, this.unbind = function(a) {
            if (!f) return this;
            a = a.split(" ");
            for (var b = 0; b < a.length; b++) {
                var c = a[b],
                    e = c.split(".")[0];
                for (var g = 0; g < d.length; g++) {
                    var h = d[g].idx.split(".");
                    if (d[g].idx == c || h[1] && h[1] == c.replace(".", "")) this.sound.removeEventListener(e, d[g].func, !0), d.splice(g, 1)
                }
            }
            return this
        }, this.bindOnce = function(a, b) {
            if (!f) return this;
            var d = this;
            e[c++] = !1, this.bind(a + "." + c, function() {
                e[c] || (e[c] = !0, b.call(d)), d.unbind(a + "." + c)
            })
        }, this.trigger = function(a) {
            if (!f) return this;
            a = a.split(" ");
            for (var b = 0; b < a.length; b++) {
                var c = a[b];
                for (var e = 0; e < d.length; e++) {
                    var g = d[e].idx.split(".");
                    if (d[e].idx == c || g[0] && g[0] == c.replace(".", "")) {
                        var h = document.createEvent("HTMLEvents");
                        h.initEvent(g[0], !1, !0), this.sound.dispatchEvent(h)
                    }
                }
            }
            return this
        }, this.fadeTo = function(a, b, c) {
            function h() {
                setTimeout(function() {
                    d < a && g.volume < a ? (g.setVolume(g.volume += 1), h()) : d > a && g.volume > a ? (g.setVolume(g.volume -= 1), h()) : c instanceof Function && c.apply(g)
                }, e)
            }
            if (!f) return this;
            b instanceof Function ? (c = b, b = buzz.defaults.duration) : b = b || buzz.defaults.duration;
            var d = this.volume,
                e = b / Math.abs(d - a),
                g = this;
            return this.play(), this.whenReady(function() {
                h()
            }), this
        }, this.fadeIn = function(a, b) {
            return f ? this.setVolume(0).fadeTo(100, a, b) : this
        }, this.fadeOut = function(a, b) {
            return f ? this.fadeTo(0, a, b) : this
        }, this.fadeWith = function(a, b) {
            return f ? (this.fadeOut(b, function() {
                this.stop()
            }), a.play().fadeIn(b), this) : this
        }, this.whenReady = function(a) {
            if (!f) return null;
            var b = this;
            this.sound.readyState === 0 ? this.bind("canplay.buzzwhenready", function() {
                a.call(b)
            }) : a.call(b)
        };
        if (f && a) {
            for (var j in buzz.defaults) buzz.defaults.hasOwnProperty(j) && (b[j] = b[j] || buzz.defaults[j]);
            this.sound = document.createElement("audio");
            if (a instanceof Array)
                for (var k in a) a.hasOwnProperty(k) && i(this.sound, a[k]);
            else if (b.formats.length)
                for (var l in b.formats) b.formats.hasOwnProperty(l) && i(this.sound, a + "." + b.formats[l]);
            else i(this.sound, a);
            b.loop && this.loop(), b.autoplay && (this.sound.autoplay = "autoplay"), b.preload === !0 ? this.sound.preload = "auto" : b.preload === !1 ? this.sound.preload = "none" : this.sound.preload = b.preload, this.setVolume(b.volume), buzz.sounds.push(this)
        }
    },
    group: function(a) {
        function b() {
            var b = c(null, arguments),
                d = b.shift();
            for (var e = 0; e < a.length; e++) a[e][d].apply(a[e], b)
        }

        function c(a, b) {
            return a instanceof Array ? a : Array.prototype.slice.call(b)
        }
        a = c(a, arguments), this.getSounds = function() {
            return a
        }, this.add = function(b) {
            b = c(b, arguments);
            for (var d = 0; d < b.length; d++) a.push(b[d])
        }, this.remove = function(b) {
            b = c(b, arguments);
            for (var d = 0; d < b.length; d++)
                for (var e = 0; e < a.length; e++)
                    if (a[e] == b[d]) {
                        a.splice(e, 1);
                        break
                    }
        }, this.load = function() {
            return b("load"), this
        }, this.play = function() {
            return b("play"), this
        }, this.togglePlay = function() {
            return b("togglePlay"), this
        }, this.pause = function(a) {
            return b("pause", a), this
        }, this.stop = function() {
            return b("stop"), this
        }, this.mute = function() {
            return b("mute"), this
        }, this.unmute = function() {
            return b("unmute"), this
        }, this.toggleMute = function() {
            return b("toggleMute"), this
        }, this.setVolume = function(a) {
            return b("setVolume", a), this
        }, this.increaseVolume = function(a) {
            return b("increaseVolume", a), this
        }, this.decreaseVolume = function(a) {
            return b("decreaseVolume", a), this
        }, this.loop = function() {
            return b("loop"), this
        }, this.unloop = function() {
            return b("unloop"), this
        }, this.setTime = function(a) {
            return b("setTime", a), this
        }, this.set = function(a, c) {
            return b("set", a, c), this
        }, this.bind = function(a, c) {
            return b("bind", a, c), this
        }, this.unbind = function(a) {
            return b("unbind", a), this
        }, this.bindOnce = function(a, c) {
            return b("bindOnce", a, c), this
        }, this.trigger = function(a) {
            return b("trigger", a), this
        }, this.fade = function(a, c, d, e) {
            return b("fade", a, c, d, e), this
        }, this.fadeIn = function(a, c) {
            return b("fadeIn", a, c), this
        }, this.fadeOut = function(a, c) {
            return b("fadeOut", a, c), this
        }
    },
    all: function() {
        return new buzz.group(buzz.sounds)
    },
    isSupported: function() {
        return !!buzz.el.canPlayType
    },
    isOGGSupported: function() {
        return !!buzz.el.canPlayType && buzz.el.canPlayType('audio/ogg; codecs="vorbis"')
    },
    isWAVSupported: function() {
        return !!buzz.el.canPlayType && buzz.el.canPlayType('audio/wav; codecs="1"')
    },
    isMP3Supported: function() {
        return !!buzz.el.canPlayType && buzz.el.canPlayType("audio/mpeg;")
    },
    isAACSupported: function() {
        return !!buzz.el.canPlayType && (buzz.el.canPlayType("audio/x-m4a;") || buzz.el.canPlayType("audio/aac;"))
    },
    toTimer: function(a, b) {
        var c, d, e;
        return c = Math.floor(a / 3600), c = isNaN(c) ? "--" : c >= 10 ? c : "0" + c, d = b ? Math.floor(a / 60 % 60) : Math.floor(a / 60), d = isNaN(d) ? "--" : d >= 10 ? d : "0" + d, e = Math.floor(a % 60), e = isNaN(e) ? "--" : e >= 10 ? e : "0" + e, b ? c + ":" + d + ":" + e : d + ":" + e
    },
    fromTimer: function(a) {
        var b = a.toString().split(":");
        return b && b.length == 3 && (a = parseInt(b[0], 10) * 3600 + parseInt(b[1], 10) * 60 + parseInt(b[2], 10)), b && b.length == 2 && (a = parseInt(b[0], 10) * 60 + parseInt(b[1], 10)), a
    },
    toPercent: function(a, b, c) {
        var d = Math.pow(10, c || 0);
        return Math.round(a * 100 / b * d) / d
    },
    fromPercent: function(a, b, c) {
        var d = Math.pow(10, c || 0);
        return Math.round(b / 100 * a * d) / d
    }
}, lessonplan = {};
((function() {
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A = {}.hasOwnProperty,
        B = function(a, b) {
            function d() {
                this.constructor = a
            }
            for (var c in b) A.call(b, c) && (a[c] = b[c]);
            return d.prototype = b.prototype, a.prototype = new d, a.__super__ = b.prototype, a
        }, C = [].indexOf || function(a) {
            for (var b = 0, c = this.length; b < c; b++)
                if (b in this && this[b] === a) return b;
            return -1
        }, D = [].slice;
    lessonplan.PropsEnabled = function() {
        function a() {
            this.allProps = []
        }
        return a.prototype.prop = function(a, b) {
            var c, d, e;
            return e = this, d = ko.observable(a), b != null && d.subscribe(b), d.bindVisisble = function(a) {
                return bindVisisble
            }, c = function(a) {
                return a != null ? (a.subscribe != null ? (d = a, b != null && d.subscribe(b)) : d(a), e) : d()
            }, c.observable = d, c.subscribe = function(a) {
                return d.subscribe(a)
            }, this.allProps.push(c), c
        }, a.prototype.defineProps = function(a, b) {
            var c, d, e, f;
            f = [];
            for (d = 0, e = a.length; d < e; d++) c = a[d], f.push(this[c] = this.prop(b));
            return f
        }, a.prototype.updateAllProps = function() {
            var a, b, c, d, e;
            d = this.allProps, e = [];
            for (b = 0, c = d.length; b < c; b++) a = d[b], e.push(a(a()));
            return e
        }, a
    }(), lessonplan.ViewModel = function(a) {
        function b() {
            b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.inheritProperties = function(a, b) {
            var c, d, e, f, g, h;
            b == null && (b = function() {
                var b;
                b = [];
                for (c in a) e = a[c], e.subscribe != null && b.push(c);
                return b
            }()), $.isArray(b) || (b = [b]), h = [];
            for (f = 0, g = b.length; f < g; f++) {
                c = b[f], d = a[c];
                if (!$.isFunction(d)) throw "Unsupported parameter to inherit: " + c;
                d.observable != null ? h.push(this[c] = d.observable) : h.push(this[c] = ko.computed({
                    read: function() {
                        return d()
                    },
                    write: function(a) {
                        return d(a)
                    }
                }))
            }
            return h
        }, b
    }(lessonplan.PropsEnabled), m = [], x = {
        showBackdrop: function(a) {
            return a ? $(".backdrop").css("opacity", 1) : $(".backdrop").css("opacity", 0)
        },
        showTitleBanner: function(a, b) {
            var c;
            return $(".lower-third-title").text(a), $("#title-banner").show("slide", {
                direction: "down"
            }), c = function() {
                return $("#title-banner").hide("slide", {
                    direction: "down"
                })
            }, setTimeout(c, b)
        },
        bringToFront: function(a) {
            return console.log("bringToFront"), console.log(a), $(a).css("z-index", 100), $(a).siblings().css("z-index", 50)
        },
        indicateLoading: function(a, b) {
            var c, d, e;
            return b == null && (b = 1e3), e = $("#loading-indicator"), c = $.Deferred(), d = function() {
                return a || e.css("display", "none"), c.resolve()
            }, a ? (console.log("showing veil"), e.css("display", "inline"), e.fadeIn(b, d)) : (console.log("hiding veil"), e.fadeOut(b, d)), c
        },
        indicateLoadFail: function(a, b) {
            var c, d, e;
            return b == null && (b = 1e3), e = $("#load-fail-indicator"), c = $.Deferred(), d = function() {
                return a || e.css("display", "none"), c.resolve()
            }, a ? (e.css("display", "inline"), e.fadeIn(b, d)) : e.fadeOut(b, d), c
        },
        hideElement: function(a, b, c) {
            c == null && (c = !1), console.log("hiding element");
            try {
                if (a[0][0].nodeType === 3) return
            } catch (d) {
                console.log("Cannot assess node type while hiding element: pressing on anyways")
            }
            return b === void 0 ? (a.attr("opacity", 0), c ? (a.attr("display", "inline"), a.attr("pointer-events", "none"), a.attr("visibility", "hidden")) : a.attr("display", "none")) : a.transition().attr("opacity", 0).duration(b).each("end", function() {
                return c ? (a.attr("pointer-events", "none"), a.attr("display", "inline"), a.attr("visibility", "hidden")) : a.attr("display", "none")
            })
        },
        showElement: function(a, b, c) {
            return c == null && (c = !1), a.attr("visibility", "visible"), a.attr("display", "inline"), a.attr("pointer-events", "inherit"), b === void 0 ? a.attr("opacity", 1) : a.transition().attr("opacity", 1).duration(b)
        },
        showSVGElement: function(a, b) {
            return this.showElement(a, b, !0)
        },
        hideSVGElement: function(a, b) {
            return this.hideElement(a, b, !0)
        },
        transitionGroups: function(a, b, c) {
            var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A;
            n = [
                function() {
                    var b, c, d, e;
                    d = a[0][0].childNodes, e = [];
                    for (b = 0, c = d.length; b < c; b++) v = d[b], v.nodeType !== 3 && e.push(d3.select(v));
                    return e
                }()
            ][0], s = [
                function() {
                    var a, c, d, e;
                    d = b[0][0].childNodes, e = [];
                    for (a = 0, c = d.length; a < c; a++) v = d[a], v.nodeType !== 3 && e.push(d3.select(v));
                    return e
                }()
            ][0], m = [
                function() {
                    var a, b, c;
                    c = [];
                    for (a = 0, b = n.length; a < b; a++) i = n[a], i != null && i.attr != null && c.push("#" + i.attr("id"));
                    return c
                }()
            ][0], r = [
                function() {
                    var a, b, c;
                    c = [];
                    for (a = 0, b = s.length; a < b; a++) i = s[a], i != null && i.attr != null && c.push("#" + i.attr("id"));
                    return c
                }()
            ][0], l = [
                function() {
                    var a, b, c;
                    c = [];
                    for (a = 0, b = m.length; a < b; a++) j = m[a], c.push(j.split("-")[0]);
                    return c
                }()
            ][0], q = [
                function() {
                    var a, b, c;
                    c = [];
                    for (a = 0, b = r.length; a < b; a++) j = r[a], c.push(j.split("-")[0]);
                    return c
                }()
            ][0], console.log(q);
            for (t = z = 0, A = l.length; z < A; t = ++z) {
                f = l[t], console.log("Child ID: "), k = d3.select(m[t]);
                if (k == null) {
                    console.log("ERROR: bad g1Child in transition"), console.log(a), console.log(b);
                    continue
                }
                console.log(f);
                if (C.call(q, f) >= 0) {
                    p = r[q.indexOf(f)], o = d3.select(p);
                    if (o == null) {
                        console.log("ERROR: bad g2child in transition: " + p), console.log(a), console.log(b);
                        continue
                    }
                    console.log("move " + f), console.log(o.attr("id")), console.log(k.attr("id"));
                    if (k.attr("transform")) o.attr("display", "none"), k.transition().duration(1e3).attr("transform", o.attr("transform"));
                    else {
                        try {
                            d = k[0][0].getBBox(), e = o[0][0].getBBox()
                        } catch (B) {
                            d = k[0][0].getBoundingClientRect(), e = o[0][0].getBoundingClientRect()
                        }
                        g = e.x - d.x, h = e.y - d.y, x = e.width / d.width, w = e.height / d.height, u = "translate(0 0) scale(1 1)", y = "translate(" + e.x + " " + e.y + ") scale(" + x + " " + w + ") translate(" + -d.x + " " + -d.y + ")", o.attr("display", "none"), k.attr("transform", u), k.transition().duration(1e3).attr("transform", y)
                    }
                } else console.log("fade out " + f), k.transition().duration(1e3).attr("opacity", 0)
            }
            return b.attr("opacity", 0), b.attr("display", "inline"), b.transition().duration(1e3).attr("opacity", 1)
        },
        floatOverRect: function(a, b, c) {
            var d, e, f, g, h, i, j, k, l;
            i = d3.select(a).node(), g = d3.select(b).node(), d = d3.select(c), d.style("position", "fixed"), d3.select(b).attr("opacity", 0), f = i.createSVGPoint(), h = function() {
                var a, b;
                return a = {}, b = g.getScreenCTM(), f.x = g.x.animVal.value, f.y = g.y.animVal.value, a.nw = f.matrixTransform(b), f.x += g.width.animVal.value, a.ne = f.matrixTransform(b), f.y += g.height.animVal.value, a.se = f.matrixTransform(b), f.x -= g.width.animVal.value, a.sw = f.matrixTransform(b), d.style("width", a.ne.x - a.nw.x), d.style("height", a.se.y - a.ne.y), d.style("top", a.nw.y), d.style("left", a.nw.x)
            }, m.push(h), l = [];
            for (j = 0, k = m.length; j < k; j++) e = m[j], l.push(e());
            return l
        },
        maintainAspect: function(a) {
            var b, c, d, e, f, g, h, i, j, k, l, m, n;
            return h = 16 / 9, m = Number(window.innerWidth), f = Number(window.innerHeight), $("#player-wrapper").hasClass("tight-wrapper") ? g = 0 : g = 30, d = m - 2 * g, e = 50, i = 60, j = !1, $("#subtitle-container").css("display") !== "none" && (j = !0, e += i), $("#stage").css("bottom", e), c = f - e - 2 * g, b = d / c, b < h ? ($("#player-wrapper").css("left", g), $("#player-wrapper").css("right", g), l = d / h, k = l + e, $("#player-wrapper").css("top", g), $("#player-wrapper").css("bottom", f - k)) : ($("#player-wrapper").css("bottom", g), $("#player-wrapper").css("top", g), n = (m - c * h) / 2, $("#player-wrapper").css("left", n), $("#player-wrapper").css("right", n))
        },
        loadScript: function(a, b) {
            var c;
            return console.log("Loading external script from URL: " + a), c = document.createElement("script"), c.type = "text/javascript", c.id = "sceneCode", c.readyState ? c.onreadystatechange = function() {
                if (c.readyState === "loaded" || c.readyState === "complete") return c.onreadystatechange = null, b()
            } : c.onload = function() {
                return b()
            }, console.log("setting script src"), c.src = a, console.log("set script src"), document.getElementsByTagName("head")[0].appendChild(c)
        },
        padNumber: function(a, b) {
            var c;
            c = "" + a;
            while (c.length < b) c = "0" + c;
            return c
        }
    }, n = typeof window != "undefined" && window !== null ? window : exports, n.util = x, window.onresize = function() {
        var a, b, c, d;
        x.maintainAspect(), d = [];
        for (b = 0, c = m.length; b < c; b++) a = m[b], d.push(a());
        return d
    }, n = typeof window != "undefined" && window !== null ? window : exports, i = {
        logInteraction: function(a, b, c) {
            var d, e, f;
            try {
                return d = (f = n.path_hash) != null ? f : "?", e = {
                    type: a,
                    target: b,
                    value: c,
                    path_hash: d
                }, $.ajax({
                    url: "/log-interaction",
                    type: "POST",
                    data: JSON.stringify(e),
                    dataType: "json",
                    contentType: "application/json"
                })
            } catch (g) {
                return console.log("Unable to log interaction")
            }
        }
    }, n.logging = i, j = {
        setMilestone: function(a, b, c) {
            var d;
            return c == null && (c = 1), d = window.app_base_url + "/progress/" + a, $.ajax({
                url: d,
                type: "PUT",
                data: "value=" + c,
                success: function() {
                    return console.log("boogie")
                },
                failure: function() {
                    return console.log("failed to set milestone")
                }
            })
        },
        completeMilestone: function(a, b) {
            return console.log("called completeMilstone[" + a + " , " + b + "]"), this.setMilestone(a, b, 1)
        },
        resetMilestone: function(a, b) {
            return this.setMilestone(a, b, 0)
        }
    }, n = typeof window != "undefined" && window !== null ? window : exports, n.lessonplan.milestones = j, l = {
        getStatus: function(a, b) {
            var c;
            return c = window.app_base_url + "/status/" + a, $.ajax({
                url: c,
                type: "GET",
                success: function(c) {
                    return console.log("get status[" + a + " ]"), console.log(c), c === 1 ? b("available") : c === 0 ? b("blocked") : b("unavailable")
                }
            })
        },
        getProgress: function(a, b) {
            var c;
            return c = window.app_base_url + "/progress/" + a, $.ajax({
                url: c,
                type: "GET",
                success: function(c) {
                    return console.log("get progress[" + a + " ]"), b(c)
                }
            })
        }
    }, n = typeof window != "undefined" && window !== null ? window : exports, n.progress = l, h = i.logInteraction, ko.bindingHandlers.slider = {
        init: function(a, b, c) {
            var d;
            return d = c().sliderOptions || {}, $(a).slider(d), ko.utils.registerEventHandler(a, "slidechange", function(a, c) {
                var d;
                return console.log("slidechange from ko"), d = b(), d(c.value)
            }), ko.utils.domNodeDisposal.addDisposeCallback(a, function() {
                return console.log("domNodeDisposal"), $(a).slider("destroy")
            }), ko.utils.registerEventHandler(a, "slide", function(a, c) {
                var d;
                return console.log("slide event, from ko"), d = b(), d(c.value)
            })
        },
        update: function(a, b) {
            var c;
            return console.log("called update on slide ko binding"), c = ko.utils.unwrapObservable(b()), isNaN(c) && (c = 0), $(a).slider("value", c)
        }
    }, this.manualOutputBindings = [], u = {
        batchBindVisible: function(a, b, c) {
            var d, e, f, g, h;
            g = Object.keys(b), h = [];
            for (e = 0, f = g.length; e < f; e++) d = g[e], h.push(this.bindVisible(a, d, b, c));
            return h
        },
        bindVisible: function(a, b, c, d) {
            var e, f, g;
            return d === void 0 && (d = 500), e = a.select(b), g = this, f = function(a) {
                return a ? x.showSVGElement(e, d) : x.hideSVGElement(e, d)
            }, c.subscribe(f), f(c())
        },
        bindAttr: function(a, b, c, d, e) {
            var f, g;
            return f = a.select(b), g = function(a) {
                return f.attr(c, e(a))
            }, d.subscribe(g), g(d())
        },
        bindText: function(a, b, c, d) {
            var e, f, g, h, i, j;
            g = a.select(b);
            try {
                e = g.node().getBBox()
            } catch (k) {
                g.style("display") === "none" ? (g.attr("visibility", "hidden"), g.style("display", "inline"), e = g.node().getBBox()) : e = g.node().getBoundingClientRect()
            }
            return d ? (f = [e.x + e.width / 2, e.y + e.height / 2], h = g.attr("transform"), i = function(a) {
                var b, c, d;
                try {
                    b = a.node().getBBox()
                } catch (e) {
                    b = a.node().getBoundingClientRect()
                }
                return c = [b.x + b.width / 2, b.y + b.height / 2], d = h, d += "translate(" + f[0] + ", " + f[1] + ") ", d += "translate(" + -1 * c[0] + ", " + -1 * c[1] + ") ", a.attr("transform", d)
            }) : i = function(a) {}, j = function(a) {
                return g.text(a), i(g)
            }, c.subscribe(j), j(c())
        },
        bindMultiState: function(a, b, c, d) {
            var e, f, g, h, i, j;
            return d === void 0 && (d = 10), g = Object.keys(b), j = function() {
                var a, c, d;
                d = [];
                for (a = 0, c = g.length; a < c; a++) f = g[a], d.push(b[f]);
                return d
            }(), e = function() {
                var b, c, d;
                d = [];
                for (b = 0, c = g.length; b < c; b++) h = g[b], d.push(a.select(h));
                return d
            }(), i = function(b) {
                var c, d, f, i, k, l, m, n, o;
                for (k = 0, m = e.length; k < m; k++) c = e[k], x.hideElement(c);
                i = function() {
                    var a, c, e;
                    e = [];
                    for (d = a = 0, c = g.length; 0 <= c ? a <= c : a >= c; d = 0 <= c ? ++a : --a) j[d] === b && e.push(g[d]);
                    return e
                }(), f = function() {
                    var b, c, d;
                    d = [];
                    for (b = 0, c = i.length; b < c; b++) h = i[b], d.push(a.select(h));
                    return d
                }(), o = [];
                for (l = 0, n = f.length; l < n; l++) c = f[l], o.push(x.showElement(c));
                return o
            }, c.subscribe(i), i(c())
        },
        bindAsToggle: function(a, b, c, d) {
            var e, f, g, i, j, k;
            f = {}, f[b] = !0, f[c] = !1, this.bindMultiState(a, f, d), j = Object.keys(f), k = [];
            for (g = 0, i = j.length; g < i; g++) e = j[g], k.push(a.select(e).on("click", function() {
                return console.log("toggle evt: " + e), d(!d()), h("toggle", {
                    on: b,
                    off: c
                }, d())
            }));
            return k
        },
        bindAsMomentaryButton: function(a, b, c, d) {
            var e, f, g, i, j, k;
            f = {}, f[b] = !0, f[c] = !1, this.bindMultiState(a, f, d), j = Object.keys(f), k = [];
            for (g = 0, i = j.length; g < i; g++) e = j[g], a.selectAll(e).on("mousedown", function() {
                return d(!0), h("momentary-down", {
                    on: b,
                    off: c
                }, d())
            }), a.selectAll(e).on("mouseup", function() {
                return d(!1), h("momentary-up", {
                    on: b,
                    off: c
                }, d())
            }), a.selectAll(e).on("touchstart", function() {
                return d(!0), h("momentary-down", {
                    on: b,
                    off: c
                }, d())
            }), k.push(a.selectAll(e).on("touchend", function() {
                return d(!1), h("momentary-up", {
                    on: b,
                    off: c
                }, d())
            }));
            return k
        },
        bindMultipleChoice: function(a, b, c) {
            var d, e, f, g, i, j, k, l;
            k = Object.keys(b), l = [];
            for (i = 0, j = k.length; i < j; i++) f = k[i], d = a.select(f), g = b[f], c.extend({
                notify: "always"
            }), e = function(a) {
                return d.on("click", function() {
                    return c(a), h("multiple-choice", {
                        selectors: b
                    }, c())
                })
            }, l.push(e(g));
            return l
        },
        bindSlider: function(a, b, c, d, e, f) {
            var g, i, j, k, l, m, n, o, p, q, r, s, t;
            return f === void 0 && (f = d3.scale.linear().domain([0, 1]).range([0, 1])), o = f, s = f.invert, k = a.select(b), g = a.select(c), window.box = g, g == null && console.log("Couldn't find " + c), m = 0, d === "h" ? (l = m + g.node().width.animVal.value, q = d3.scale.linear().domain([m, l]).range([0, 1]).clamp(!0)) : (l = m - g.node().height.animVal.value, q = d3.scale.linear().domain([m, l]).range([0, 1]).clamp(!0)), n = q.invert, r = function(a) {
                return o(q(a))
            }, t = function(a) {
                return n(s(a))
            }, p = function(a, b) {
                var c, e;
                return e = t(a.value), c = [0, 0], d === "h" ? c[0] = e - Number(k.attr("r")) : c[1] = e, "translate(" + c + ")"
            }, j = d3.behavior.drag().on("drag", function(a, c) {
                var f;
                return d === "h" ? f = d3.event.x - g.node().x.animVal.value : f = d3.event.y - g.node().y.animVal.value - g.node().height.animVal.value, a.value = r(f), e(a.value), h("slider-drag", b, e())
            }), i = {
                value: e()
            }, k.data([i]).attr("transform", p).call(j), e.subscribe(function(a) {
                return k.data([{
                    value: a
                }]).attr("transform", p).call(j)
            })
        },
        bindScale: function(a, b, c, d, e) {
            var f, g, h, i;
            h = a.select(b);
            try {
                g = h.node().getBBox()
            } catch (j) {
                console.log("failed to get bbox"), console.log(h), window.el = h, h.style("display") === "none" ? (h.attr("visibility", "hidden"), h.style("display", "inline"), g = h.node().getBBox()) : g = h.node().getBoundingClientRect()
            }
            return e === "sw" ? f = [g.x, g.y + g.height] : e === "nw" ? f = [g.x, g.y + g.height] : e === "ne" ? f = [g.x + g.width, g.y + g.height] : e === "se" ? f = [g.x, g.y] : f = [g.x + g.width / 2, g.y + g.height / 2], i = function(a) {
                var b, c;
                return b = d(a), c = "", c += "translate(" + f[0] + ", " + f[1] + ") ", c += "scale(" + b + ") ", c += "translate(" + -1 * f[0] + ", " + -1 * f[1] + ") ", c
            }, this.bindAttr(a, b, "transform", c, i)
        }
    }, n = typeof window != "undefined" && window !== null ? window : exports, n.svgbind = u, n = typeof window != "undefined" && window !== null ? window : exports, n.registry = [], n.scenes = {}, n.stages = {}, e = -1, w = function() {
        return e += 1, "element_assigned_id_" + e
    }, c = -1, v = function() {
        return c += 1, c
    }, p = !1, k = n.module_id + "/" + n.lesson_id + "/" + n.segment_id, b = n.audio_base_url + "/" + k, q = n.audio_base_url + "/soundtracks", lessonplan.LessonElement = function() {
        function a(a) {
            this.elementId = a, this.elementId == null && (this.elementId = w()), registry[this.elementId] = this, this.children = [], this.childIndexLookup = {}, this.childLookup = {}, this.parent = void 0, this.parentScene = void 0, this.currentChild = 0
        }
        return a.prototype.addChild = function(a) {
            return a.parent = this, a.parentScene = this.parentScene, this.children.push(a), this.childIndexLookup[a.elementId] != null && alert("Dupicate script element name.  Unpredictable behavior will ensue"), this.childIndexLookup[a.elementId] = this.children.length - 1, this.childLookup[a.elementId] = a
        }, a.prototype.init = function() {
            var a, b, c, d;
            if (this.children != null) {
                d = this.children;
                for (b = 0, c = d.length; b < c; b++) a = d[b], a.init()
            }
            return !0
        }, a.prototype.nextAfterChild = function(a) {
            var b, c;
            return b = a.elementId, this.children == null || this.children.length === 0 ? (console.log("weirdness"), void 0) : (c = this.childIndexLookup[b], this.nextAfterIndex(c))
        }, a.prototype.nextAfterIndex = function(a) {
            var b;
            return b = a + 1, this.children[b] != null ? this.children[b] : this.parent != null ? (this.finish(), this.parent.nextAfterChild(this)) : (console.log("nextAfterIndex: no parent to yield to..."), console.log(this), void 0)
        }, a.prototype.seek = function(a) {
            var b;
            return b = $.Deferred().resolve(), b
        }, a.prototype.willYieldOnNext = function() {
            return this.children != null && this.children.length && this.currentChild < this.children.length ? !1 : !0
        }, a.prototype.next = function() {
            return this.children != null && this.children.length && this.currentChild < this.children.length ? (this.currentChild += 1, this.children[this.currentChild - 1]) : this.parent != null ? this.parent.nextAfterChild(this) : (console.log("no parent, yielding undefined"), void 0)
        }, a.prototype.stage = function(a) {
            if (a == null && this.parent != null && this.parent !== this) return this.parent.stage()
        }, a.prototype.run = function(a) {
            return a == null && (a = !1), !0
        }, a.prototype.reset = function(a) {
            var b, c, d, e, f, g;
            this.currentChild = 0, c = [], g = this.children;
            for (e = 0, f = g.length; e < f; e++) b = g[e], d = b.reset(), c.push(d);
            return $.when.apply($, c)
        }, a.prototype.stop = function() {
            var a;
            return $.when.apply($, [
                function() {
                    var b, c, d, e;
                    d = this.children, e = [];
                    for (b = 0, c = d.length; b < c; b++) a = d[b], e.push(a.stop());
                    return e
                }.call(this)
            ])
        }, a.prototype.pause = function() {}, a.prototype.resume = function() {}, a.prototype.finish = function() {}, a.prototype.ready = function() {
            return !0
        }, a.prototype.cleanup = function() {
            var a;
            return $.when.apply($, [
                function() {
                    var b, c, d, e;
                    d = this.children, e = [];
                    for (b = 0, c = d.length; b < c; b++) a = d[b], e.push(a.cleanup());
                    return e
                }.call(this)
            ])
        }, a
    }(), a = lessonplan.LessonElement, lessonplan.Scene = function(a) {
        function b(a, c) {
            this.title = a, c == null && (c = this.title), b.__super__.constructor.call(this, c), scenes[c] = this, this.parentScene = this, this.currentSegment = ko.observable(void 0), this.currentTime = ko.observable(void 0)
        }
        return B(b, a), b.prototype.run = function(a) {
            var c = this;
            return a == null && (a = !1), console.log("scene[" + this.elementId + "]"), $.when(x.showTitleBanner(this.title, 5e3)).then(function() {
                return c.init()
            }).then(function() {
                return b.__super__.run.call(c)
            })
        }, b.prototype.init = function() {
            return console.log("=================="), console.log("SCENE INIT"), b.__super__.init.call(this)
        }, b
    }(a), lessonplan.Message = function(a) {
        function b(a) {
            this.msg = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function() {
            return console.log(this.msg)
        }, b
    }(a), lessonplan.Interactive = function(a) {
        function b(a) {
            this.duration = ko.observable(1), this.soundtrackFile = void 0, this.soundtrackLoaded = !1, this.hasSoundtrack = !1, this.justSeeked = !1, b.__super__.constructor.call(this, a)
        }
        return B(b, a), b.prototype.stage = function(a) {
            return a != null ? this.stageObj = a : this.stageObj
        }, b.prototype.soundtrack = function(a) {
            if (a != null) this.soundtrackFile = a, this.hasSoundtrack = !0;
            else return this.soundtrackFile;
            return this.loadSoundtrack(a)
        }, b.prototype.loadSoundtrack = function(a) {}, b.prototype.finish = function() {
            var a, b;
            return this.soundtrackAudio != null && this.soundtrackAudio.stop(), b = !0, a = !0, this.stageObj != null && this.stageObj.stop != null && (b = this.stageObj.stop()), this.stageObj != null && this.stageObj.hide != null && (a = this.stageObj.hide()), $.when(b, a)
        }, b.prototype.playSoundtrack = function() {
            this.soundtrackAudio != null && this.soundtrackAudio.load();
            if (this.soundtrackAudio != null) return this.soundtrackAudio.play().setVolume(6)
        }, b.prototype.show = function() {
            return $("#interactive").css("z-index", 100)
        }, b.prototype.run = function(a) {
            return a == null && (a = !1), a ? !0 : this.stageObj != null && !this.justSeeked ? this.stageObj.show() : (this.justSeeked && (this.justSeeked = !1), b.__super__.run.call(this))
        }, b.prototype.reset = function() {
            var a, c, d = this;
            return this.soundtrackAudio != null && this.soundtrackAudio.stop(), c = !0, a = $.Deferred(), this.stage() != null ? $.when(this.stage().stop()).then(function() {
                return d.stage().reset()
            }).then(function() {
                return a.resolve()
            }) : console.log("no stage"), $.when(a, b.__super__.reset.call(this))
        }, b.prototype.stop = function() {
            var a, c;
            return this.soundtrackAudio != null && this.soundtrackAudio.stop(), c = !0, a = !0, this.stage() && this.stage().stop != null && (c = this.stage().stop()), this.stage() && this.stage().hide != null && (a = this.stage().hide()), $.when(c, a, b.__super__.stop.call(this))
        }, b.prototype.findElement = function(a, b, c, d) {
            var e, f, g, h, i;
            b == null && (b = this);
            if (b.elementId === a && d(b)) return b;
            c && b.run(!0), i = b.children;
            for (g = 0, h = i.length; g < h; g++) {
                e = i[g], f = this.findElement(a, e, c, d);
                if (f != null) return f
            }
        }, b.prototype.findMilestone = function(a, b, c) {
            return c == null && (c = !1), this.findElement(a, b, c, function(a) {
                return a instanceof lessonplan.MilestoneAction
            })
        }, b.prototype.findSeekable = function(a, b, c) {
            return c == null && (c = !1), this.findElement(a, b, c, function(a) {
                return a instanceof lessonplan.Line || a instanceof lessonplan.WaitForChoice || a instanceof lessonplan.MilestoneAction
            })
        }, b.prototype.findElements = function(a, b, c) {
            var d, e, f, g;
            a == null && (a = this), b == null && (b = []), c(a) && b.push(a), g = a.children;
            for (e = 0, f = g.length; e < f; e++) d = g[e], this.findElements(d, b, c);
            return b
        }, b.prototype.findMilestones = function(a, b) {
            return this.findElements(a, b, function(a) {
                return a instanceof lessonplan.MilestoneAction
            })
        }, b.prototype.findSeekables = function(a, b) {
            return this.findElements(a, b, function(a) {
                return a instanceof lessonplan.Line || a instanceof lessonplan.WaitForChoice || a instanceof lessonplan.MilestoneAction
            })
        }, b.prototype.seek = function(a) {
            var b, c, d = this;
            return a == null || this.findSeekable(a, this) == null ? (console.log("could not find seekable in interactive"), console.log(a), !0) : (console.log("found seekable, now let's go there..."), b = $.Deferred(), this.stageObj != null ? c = this.stageObj.show() : c = !0, $.when(c).then(function() {
                var c;
                c = d.findSeekable(a, d, !0);
                if (c != null) {
                    c.disarm != null && c.disarm(), d.currentChild = d.children.indexOf(c);
                    if (d.currentChild == null || d.currentChild < 0) d.currentChild = 0
                }
                return b.resolve(), d.justSeeked = !0
            }), b)
        }, b
    }(a), lessonplan.runChained = function(a, b) {
        var c, d, e;
        return b == null && (b = !1), e = $.Deferred(), c = a.slice(0), d = function(a) {
            var c;
            if (a.length === 0) {
                e.resolve();
                return
            }
            return c = a.shift().run(b), $.when(c).then(function() {
                return e.state() !== "rejected" ? d(a) : console.log("rejected")
            })
        }, d(c), e
    }, lessonplan.Line = function(a) {
        function c(a, b) {
            this.audioFile = a, this.text = b, this.errorState = 0, c.__super__.constructor.call(this)
        }
        return B(c, a), c.prototype.init = function() {
            return this.loadAudio(this.audioFile), this.subtitleContainer = $("#interactive-subtitles"), c.__super__.init.call(this)
        }, c.prototype.loadAudio = function(a) {
            var c, d, e = this;
            return console.log("loading: " + a), d = a.split("."), d.pop(), d, a = d.join("."), a[0] === "/" ? (c = n.audio_base_url + a, console.log("here: " + c)) : c = b + "/" + a, this.audio = new buzz.sound([c + ".mp3", c + ".ogg"], {
                preload: !0
            }), this.audio.bind("empty error", function() {
                return console.log("Audio error [" + e.audioFile + "]: " + e.audio.getErrorMessage()), e.errorState = e.audio.getErrorCode()
            }), this.audio.load()
        }, c.prototype.reset = function() {
            var a = this;
            return $.when(this.stop()).then(function() {
                return a.childDeferred && (a.childDeferred = void 0), c.__super__.reset.call(a)
            })
        }, c.prototype.stage = function() {
            return this.parent.stage()
        }, c.prototype.pause = function() {
            var a, b = this;
            return a = [], this.childDeferred != null && (this.childDeferred.reject(), $.when(this.childDeferred).then(function() {
                var c, d, e, f, g, h;
                g = b.children, h = [];
                for (e = 0, f = g.length; e < f; e++) c = g[e], d = c.reset(), h.push(a.push(d));
                return h
            })), this.children != null && this.children.length && this.audio != null ? a.push(this.audio.stop()) : a.push(this.audio.pause()), $.when.apply($, a)
        }, c.prototype.resume = function() {
            var a = this;
            return $.when(this.reset()).then(function() {
                return a.run()
            })
        }, c.prototype.stop = function() {
            return this.audio && this.audio.stop(), this.audio.unbind("ended"), c.__super__.stop.call(this)
        }, c.prototype.next = function() {
            return this.parent != null ? this.parent.nextAfterChild(this) : void 0
        }, c.prototype.run = function(a) {
            var c, d = this;
            return a == null && (a = !1), this.childDeferred = $.Deferred().resolve(), this.children != null && this.children.length && (this.childDeferred = lessonplan.runChained(this.children, a)), a ? !0 : (c = $.Deferred(), this.errorState === 0 && this.audio.getNetworkStateCode() !== 3 ? (this.audio.bind("empty.run error.run", function() {
                return console.log("Audio error [" + d.audioFile + "]: " + d.audio.getErrorMessage()), d.errorState = d.audio.getErrorCode(), c.resolve()
            }), this.audio.bind("ended", function() {
                return c.resolve()
            })) : (console.log("Audio [" + this.audioFile + "] will not play"), c.resolve()), this.audio.bind("ended", function() {
                return c.resolve()
            }), console.log("playing audio: " + b + "/" + this.audioFile), this.audio.play(), this.text != null && (this.subtitleContainer.empty(), this.subtitleContainer.append('<div class="interactive-subtitle">' + this.text + "</div>")), $.when(c, this.childDeferred))
        }, c
    }(a), lessonplan.ShowSubtitleAction = function(a) {
        function b(a) {
            this.text = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.init = function() {
            return b.__super__.init.call(this)
        }, b.prototype.run = function() {
            this.subtitleContainer = $("#interactive-subtitles");
            if (this.text != null && this.subtitleContainer != null) return this.subtitleContainer.empty(), this.subtitleContainer.append('<div class="interactive-subtitle">' + this.text + "</div>")
        }, b
    }(a), lessonplan.ShowAction = function(a) {
        function b(a) {
            this.selectors = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c, d, e, f, g;
            a == null && (a = !1), c = this.parent.stage(), f = this.selectors, g = [];
            for (d = 0, e = f.length; d < e; d++) b = f[d], g.push(c.showElement("#" + b));
            return g
        }, b
    }(a), lessonplan.HideAction = function(a) {
        function b(a) {
            this.selectors = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c, d, e, f, g;
            a == null && (a = !1), c = this.parent.stage(), f = this.selectors, g = [];
            for (d = 0, e = f.length; d < e; d++) b = f[d], g.push(c.hideElement("#" + b));
            return g
        }, b
    }(a), lessonplan.HideAllAction = function(a) {
        function b() {
            b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b;
            return a == null && (a = !1), b = this.parent.stage(), b.hideAllElements()
        }, b
    }(a), lessonplan.GlowAction = function(a) {
        function b(a) {
            this.selectors = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c, d, e, f, g;
            a == null && (a = !1), c = this.parent.stage(), f = this.selectors, g = [];
            for (d = 0, e = f.length; d < e; d++) b = f[d], g.push(c.glowElement("#" + b));
            return g
        }, b
    }(a), lessonplan.UnglowAction = function(a) {
        function b(a) {
            this.selectors = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c, d, e, f, g;
            a == null && (a = !1), c = this.parent.stage(), f = this.selectors, g = [];
            for (d = 0, e = f.length; d < e; d++) b = f[d], g.push(c.unglowElement("#" + b));
            return g
        }, b
    }(a), lessonplan.BoxHighlightAction = function(a) {
        function b(a, c) {
            this.color = a, this.selectors = c, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c, d, e, f, g;
            a == null && (a = !1), c = this.parent.stage(), f = this.selectors, g = [];
            for (d = 0, e = f.length; d < e; d++) b = f[d], g.push(c.boxAroundElement("#" + b, this.color));
            return g
        }, b
    }(a), lessonplan.BoxUnhighlightAction = function(a) {
        function b(a) {
            this.selectors = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c, d, e, f, g;
            a == null && (a = !1), c = this.parent.stage(), f = this.selectors, g = [];
            for (d = 0, e = f.length; d < e; d++) b = f[d], console.log(b), g.push(c.unboxElement("#" + b));
            return g
        }, b
    }(a), lessonplan.XHighlightAction = function(a) {
        function b(a) {
            this.selectors = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c, d, e, f, g;
            a == null && (a = !1), c = this.parent.stage(), console.log("x-ing!"), f = this.selectors, g = [];
            for (d = 0, e = f.length; d < e; d++) b = f[d], g.push(c.xHighlightElement("#" + b));
            return g
        }, b
    }(a), lessonplan.XUnhighlightAction = function(a) {
        function b(a) {
            this.selectors = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c, d, e, f, g;
            a == null && (a = !1), c = this.parent.stage(), console.log("un-x-ing!"), f = this.selectors, g = [];
            for (d = 0, e = f.length; d < e; d++) b = f[d], g.push(c.xUnhighlightElement("#" + b));
            return g
        }, b
    }(a), lessonplan.GroupTransitionAction = function(a) {
        function b(a, c) {
            this.fromSel = a, this.toSel = c, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b;
            return a == null && (a = !1), b = this.parent.stage(), a ? (console.log("Hiding: #" + this.fromSel), b.hideElement("#" + this.fromSel), b.showElement("#" + this.toSel)) : b.transitionGroups(this.fromSel, this.toSel)
        }, b
    }(a), lessonplan.MultipleChoiceQuestion = function(a) {
        function b(a) {
            this.varname = a, this.observable = ko.observable("none"), b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.mapping = function(a) {
            var b, c, d, e, f;
            this.map = {}, e = Object.keys(a), f = [];
            for (c = 0, d = e.length; c < d; c++) b = e[c], f.push(this.map["#" + b] = a[b]);
            return f
        }, b.prototype.run = function(a) {
            var b;
            return a == null && (a = !1), b = this.parent.stage(), b[this.varname] = this.observable, u.bindMultipleChoice(b.svg, this.map, this.observable)
        }, b
    }(a), lessonplan.SetAction = function(a) {
        function b(a, c, d) {
            this.property = a, this.value = c, this.time = d, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c, d, e;
            return a == null && (a = !1), d = this.parent.stage(), this.time === 0 ? d[this.property](this.value) : (e = {
                v: d[this.property]()
            }, b = {
                v: this.value
            }, c = d[this.property], $(e).animate(b, {
                duration: this.time,
                step: function() {
                    return c(this.v)
                }
            }))
        }, b
    }(a), lessonplan.MilestoneAction = function(a) {
        function b(a, c) {
            this.name = a, this.title = c, this.title == null && (this.title = this.name), this.disarmed = !1, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.disarm = function() {
            return this.disarmed = !0
        }, b.prototype.run = function(a) {
            var b;
            a == null && (a = !1);
            if (a) return !0;
            if (this.disarmed) {
                this.disarmed = !1;
                return
            }
            return b = n.module_id + "/" + n.lesson_id + "/" + n.segment_id + "/" + this.name, console.log("calling completeMilestone"), lessonplan.milestones.completeMilestone(b, this.name), !0
        }, b
    }(a), lessonplan.PlayAction = function(a) {
        function b(a) {
            this.stageId = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            return a == null && (a = !1), this.parent.stage().play()
        }, b
    }(a), lessonplan.PlayUntilAction = function(a) {
        function b(a) {
            this.t = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            return a == null && (a = !1), this.parent.stage().playUntil != null ? this.parent.stage().playUntil(this.t, a) : (console.log("failing over"), this.parent.stage().play(), !0)
        }, b
    }(a), lessonplan.StopAndResetAction = function(a) {
        function b(a) {
            this.stageId = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            return a == null && (a = !1), this.parent.stage().stop()
        }, b
    }(a), lessonplan.WaitAction = function(a) {
        function b(a) {
            this.delay = a, b.__super__.constructor.call(this)
        }
        return B(b, a), b.prototype.run = function(a) {
            var b, c = this;
            return a == null && (a = !1), a ? !0 : (console.log("waiting " + this.delay + " ms..."), this.dfrd = $.Deferred(), b = function() {
                return c.dfrd.resolve()
            }, setTimeout(b, this.delay), this.dfrd)
        }, b
    }(a), lessonplan.WaitForChoice = function(a) {
        function b(a) {
            this.observableName = a, b.__super__.constructor.call(this), this.options = []
        }
        return B(b, a), b.prototype.addOption = function(a) {
            return a.parent = this, this.options.push(a)
        }, b.prototype.init = function() {
            var a, c, d, e;
            e = this.options;
            for (c = 0, d = e.length; c < d; c++) a = e[c], a.init();
            return b.__super__.init.call(this)
        }, b.prototype.reset = function() {
            return this.children = []
        }, b.prototype.run = function(a) {
            var b, c, d = this;
            a == null && (a = !1);
            if (a) return;
            return c = this.parent.stage(), b = this.parent.stage()[this.observableName], console.log("stage = " + c + ", obs = " + b), console.log(c), console.log("installing waitForChoice subscription on " + this.observableName), this.dfrd = $.Deferred(), this.subs = b.subscribe(function(a) {
                var b, c, e, f;
                console.log("waitForChoice yielding"), console.log(a), d.subs.dispose(), f = d.options;
                for (c = 0, e = f.length; c < e; c++) {
                    b = f[c], console.log(b);
                    if (C.call(b.value, a) >= 0) {
                        console.log("opt.value = " + b), console.log(b);
                        if (b.children != null) {
                            d.children = b.children, d.dfrd.resolve();
                            return
                        }
                        break
                    }
                }
                return d.dfrd.resolve()
            }), this.dfrd
        }, b
    }(a), lessonplan.FSM = function(b) {
        function c(b) {
            var e, f, g, h;
            this.states = b, c.__super__.constructor.call(this), this.currentState = "initial", this.delay = 500, this.startTime = void 0, this.statesDfrd = $.Deferred().resolve(), this.stopping = !1, h = this.states;
            for (f in h) g = h[f], e = new a, d.pushCurrent(e), g.action != null && g.action(), d.popCurrent(), this.states[f].action = e, this.addChild(e)
        }
        return B(c, b), c.prototype.init = function() {
            return c.__super__.init.call(this)
        }, c.prototype.getElapsedTime = function() {
            var a;
            return a = (new Date).getTime(), a - this.startTime
        }, c.prototype.run = function(a) {
            var b, c = this;
            return a == null && (a = !1), a ? !0 : (this.statesDfrd = $.Deferred(), b = function() {
                return c.runState("initial")
            }, setTimeout(b, 0), this.statesDfrd)
        }, c.prototype.runState = function(a, b) {
            var c, d = this;
            return console.log("ACTION: state: " + a), this.startTime = (new Date).getTime(), c = $.Deferred(), c.done(function() {
                return console.log("runState"), d.transitionState(a)
            }), this.states[a].action != null && this.states[a].action.children.length ? $.when(lessonplan.runChained(this.states[a].action.children)).then(function() {
                return c.resolve()
            }) : c.resolve()
        }, c.prototype.transitionState = function(a) {
            var b, c, d, e = this;
            console.log("transitionState: " + a);
            if (this.stopping) {
                console.log("stopping"), this.stopping = !1, this.statesDfrd.resolve();
                return
            }
            return b = this.states[a], b.elapsedTime = this.getElapsedTime(), b.stage = this.stage(), d = b.transition(), console.log("transitionTo: "), console.log(d), d != null ? d === "continue" ? (console.log("yielding..."), this.statesDfrd.resolve()) : this.runState(d) : (c = function() {
                return e.transitionState(a)
            }, setTimeout(c, this.delay))
        }, c.prototype.next = function() {
            return this.parent != null ? this.parent.nextAfterChild(this) : void 0
        }, c.prototype.stop = function() {
            if (this.statesDfrd.state() === "pending") return this.stopping = !0
        }, c
    }(a), n = typeof window != "undefined" && window !== null ? window : exports, y = "#video", f = "#interactive", lessonplan.Video = function(a) {
        function b(a, c) {
            this.inserted = c != null ? c : !1, this.preferredFormat = "mp4", this.broken = !1, this.duration = ko.observable(1), this.mediaUrlDict = {}, this.mediaUrls = {}, this.cues = [], this.videoQuality = "sd", this.playerReady = $.Deferred(), this.loaded = !1, this.inited = !1, b.__super__.constructor.call(this, a)
        }
        return B(b, a), b.prototype.quality = function(a) {
            return a != null ? this.videoQuality = a : this.videoQuality
        }, b.prototype.qualities = function() {
            return keys(this.mediaUrlDict)
        }, b.prototype.media = function(a, b, c) {
            var d, e;
            c == null && (c = "sd");
            if (b == null) return this.mediaUrlDict[c] != null ? this.mediaUrlDict[c][a] : null;
            this.mediaUrls[c] == null && (this.mediaUrls[c] = []), this.mediaUrls[c].push(b);
            if (a !== "mp4" || c !== "sd" || !b.indexOf("vimeo")) return console.log("did not find vimeo link"), console.log(a), console.log(c), console.log(b);
            console.log("found vimeo link"), e = /\/(\d+)\./, d = b.match(e);
            if (d != null && d.length === 2) return this.vimeo_id = d[1]
        }, b.prototype.mediaTypes = function(a) {
            var b;
            return a == null && (a = "default"), this.mediaUrlDict[a] != null ? [
                function() {
                    var c;
                    c = [];
                    for (b in this.mediaUrlDict[a]) c.push(b);
                    return c
                }.call(this)
            ] : []
        }, b.prototype.subtitles = function(a) {
            var b = this;
            return this.subtitlesFile = a, this.subtitlesDfrd = $.Deferred(), $.getJSON(this.subtitlesFile, function(a) {
                var c, d, e, f, g, h, i, j;
                if (a == null) {
                    console.log("no data for file: "), console.log(b.subtitlesFile);
                    return
                }
                j = a.data;
                for (h = 0, i = j.length; h < i; h++) d = j[h], g = d.footnote.text, e = d.footnote.start, e === 0 && (e += .1), c = new lessonplan.LessonElement, f = new lessonplan.ShowSubtitleAction(g), c.children.push(f), b.cue(e, c);
                return b.subtitlesDfrd.resolve()
            }).fail(function() {
                return console.log("subtitles failed to load"), b.subtitlesDfrd.resolve()
            }), this.subtitlesDfrd
        }, b.prototype.init = function() {
            return b.__super__.init.call(this)
        }, b.prototype.justInTimeInit = function() {
            var a, b, c = this;
            return console.log("video init called"), $(y).attr("style", "opacity: 0.0;"), this.playerSelector = void 0, b = $.when(this.load()), b.fail(function() {
                return c.broken = !0, c.subtitlesDfrd != null && c.subtitlesDfrd.reject(), x.indicateLoadFail(!0)
            }), $.when(this.subtitlesDfrd).then(function() {
                var a, b, d, e, f;
                e = c.cues, f = [];
                for (b = 0, d = e.length; b < d; b++) a = e[b], a.init != null ? f.push(a.init()) : f.push(void 0);
                return f
            }), this.vimeo_id != null ? (console.log("adding alt player link"), $(".alt-player-link").empty(), $(".alt-player-link").append('Trouble viewing this video? Try <a href="/alt_video/' + this.vimeo_id + '" target="alt_player">here</a>')) : console.log("no vimeo id"), a = this.init(), $.when(a, b).then(function() {
                return c.inited = !0
            })
        }, b.prototype.reset = function(a) {
            if (this.broken) return;
            return console.log("Resetting video"), a == null && (a = 0), this.seek(a), this.hide(), b.__super__.reset.call(this)
        }, b.prototype.lookupMilestone = function(a) {
            var b, c, d, e, f, g, h, i, j;
            i = this.cues;
            for (e = 0, g = i.length; e < g; e++) {
                j = i[e], d = j[0], c = j[1];
                for (f = 0, h = c.length; f < h; f++) {
                    b = c[f];
                    if (b instanceof lessonplan.Milestone && b.name === a) return d
                }
            }
            return null
        }, b.prototype.seek = function(a) {
            var b, c, d = this;
            return console.log("seeking video to " + a), b = $.Deferred(), c = function() {
                var c;
                if (typeof a != "number") {
                    a = d.lookupMilestone(a);
                    if (a == null) return b.reject(), b
                }
                d.pop.pause();
                try {
                    return d.pop.currentTime(a), c = function() {
                        return d.pop.seeking() ? setTimeout(c, 100) : b.resolve()
                    }, c()
                } catch (e) {}
            }, this.inited ? c() : $.when(this.justInTimeInit()).then(function() {
                return c()
            }), b
        }, b.prototype.show = function() {
            return console.log("[ video show ]"), this.inserted && (console.log("do not load"), $("#interactive").css("z-index", 50)), console.log("disappear the video tags"), $("#video video").css("display", "none"), console.log("================="), console.log(">>>>>>>>>>>>>>>>>"), console.log($("#video video")), $(y).css("z-index", 100), this.playerNode.setAttribute("style", "display: inline; opacity: 1.0;"), d3.select(y).style("display", "inline"), d3.select(y).transition().style("opacity", 1).duration(1e3), $("#interactive-subtitles").empty(), this.inserted || x.showBackdrop(!0), !0
        }, b.prototype.hide = function() {
            var a = this;
            return console.log("[ video hide ]"), d3.select(y).transition().style("opacity", 0).duration(1e3).each("end", function() {
                d3.select(y).style("display", "none");
                if (a.playerNode != null) return a.playerNode.setAttribute("style", "opacity: 0.0; display: none")
            })
        }, b.prototype.cleanup = function() {
            return this.playerNode != null && this.playerNode.remove != null && (console.log("cleaning up"), this.playerNode.remove()), this.playerNode = void 0
        }, b.prototype.load = function(a) {
            var b, c, d, e = this;
            return console.log("[ video load ]"), a == null && (a = $.Deferred()), this.mediaUrls[this.videoQuality] != null ? d = this.mediaUrls[this.videoQuality] : this.mediaUrls["default"] != null ? (this.videoQuality = "default", d = this.mediaUrls[this.videoQuality]) : a.reject(), d.sort(), d.reverse(), this.avoidMP4 && (d = function() {
                var a, b, e;
                e = [];
                for (a = 0, b = d.length; a < b; a++) c = d[a], c.indexOf("mp4") < 0 && e.push(c);
                return e
            }(), console.log("culled urls: " + d)), console.log(d), console.log(y), this.pop = Popcorn.smart(y, d), $("#video-download-link").attr("href", d[0]), $("#video-download-link").css("display", "inline"), this.playerNode != null && (console.log("removing preexisitng node..."), this.playerNode.remove()), this.playerNode = this.pop.video, this.playerNode.hasAttribute("controls") && this.playerNode.removeAttribute("controls"), this.playerNode.setAttribute("style", "opacity: 0;"), this.playerNode.setAttribute("style", "display:none;"), this.playerReady.resolve(), this.pop.on("durationchange", function() {
                var a;
                return console.log("duration changed!:" + e.pop.duration()), a = e.pop.duration(), e.duration(a)
            }), this.pop.on("canplaythrough", function() {
                return console.log("canplaythrough event triggered, resolving deferred"), a.resolve()
            }), console.log(this.pop), this.pop.on("error", function() {
                return e.avoidMP4 != null && e.avoidMP4 ? (console.log("failed even after avoiding mp4"), a.reject()) : (e.avoidMP4 = !0, console.log("attempt to load again"), e.load(a))
            }), b = function(a, b) {
                return e.pop.cue(a, function() {
                    return console.log("running cued actions"), console.log(b.children), lessonplan.runChained(b.children)
                })
            }, $.when(this.subtitlesDfrd).then(function() {
                var a, c, d, f, g, h;
                g = e.cues;
                for (d = 0, f = g.length; d < f; d++) h = g[d], c = h[0], a = h[1], b(c, a);
                return e.loaded = !0
            }), console.log("pop load called"), this.pop.load(), $.when(this.subtitlesDfrd).then(function() {
                return console.log("load all resolved")
            })
        }, b.prototype.finish = function() {
            return console.log("[ video finish ]"), this.pop.off("ended"), this.pop.off("timeupdate"), this.pop.off("error"), this.pop.off("canplaythrough"), this.hide()
        }, b.prototype.run = function(a) {
            var b, c, d = this;
            a == null && (a = !1);
            if (a) return;
            return window.video_playing = this, console.log("[ video run ]"), console.log("video run called"), b = $.Deferred(), window.mcb80x_pop = this.pop, c = function() {
                console.log("runIt called"), $.when(d.playerReady).then(function() {
                    if (d.broken) {
                        console.log("Unable to play video"), b.reject();
                        return
                    }
                    return console.log("playing video"), d.inserted || (d.updateTimeCb = function() {
                        var a;
                        return a = d.pop.currentTime(), d.parentScene.currentTime(a)
                    }, d.pop.on("timeupdate", d.updateTimeCb)), d.yieldCb = function() {
                        return console.log("video finished cb"), b.resolve()
                    }, d.pop.on("ended", d.yieldCb), d.pop.volume(.95), console.log("called video play"), d.pop.play()
                });
                if (d.inserted) return b.done(function() {
                    return console.log("hiding"), d.hide()
                })
            }, this.inited ? $.when(this.show()).then(function() {
                return c()
            }) : (console.log("video was not inited"), $.when(this.justInTimeInit()).then(function() {
                return d.show()
            }).then(function() {
                return c()
            })), b
        }, b.prototype.pause = function() {
            var a, b, c = this;
            return this.pop == null ? !0 : (b = $.Deferred(), a = function() {
                if (c.pop.paused()) {
                    b.resolve();
                    if (c.checkIfPausedInterval != null) return clearInterval(c.checkIfPausedInterval)
                }
            }, this.checkIfPausedInterval = setInterval(a, 100), this.pop.on("pause", function() {
                return b.resolve()
            }), this.pop.paused() || this.pop.pause(), b)
        }, b.prototype.resume = function() {
            var a;
            return console.log("video resuming"), a = $.Deferred(), this.yieldCb = function() {
                return console.log("video finished cb"), a.resolve()
            }, this.pop.on("ended", this.yieldCb), this.pop && this.pop.play(), a
        }, b.prototype.stop = function() {
            return this.pop && this.pop.pause(), this.hide(), b.__super__.stop.call(this)
        }, b.prototype.ready = function() {
            return this.pop != null ? this.pop.readyState() === 4 : !1
        }, b.prototype.cue = function(a, b) {
            return this.cues.push([a, b])
        }, b.prototype.cueRaw = function(a, b) {
            var c, d;
            return c = new lessonplan.LessonElement, c.run = function() {
                return b()
            }, d = new lessonplan.LessonElement, d.addChild(c), console.log("cueing raw cb"), this.cue(a, d)
        }, b
    }(lessonplan.LessonElement), n = typeof window != "undefined" && window !== null ? window : exports, g = [n.module_id, n.lesson_id].join("/"), o = [n.module_id, n.lesson_id, n.segment_id].join("/"), t = n.static_base_url + "/slides", z = n.webm_base_url + "/" + o, s = n.static_base_url + "/subtitles/" + o, r = "json", d = {
        currentStack: [],
        currentObj: void 0
    }, d.pushCurrent = function(a) {
        return d.currentStack.push(d.currentObj), d.currentObj = a
    }, d.popCurrent = function() {
        return d.currentObj = d.currentStack.pop()
    }, n.scene = function(a, b) {
        var c;
        return c = new lessonplan.Scene(a, b),
        function(a) {
            return d.currentObj = c, a()
        }
    }, n.message = function(a) {
        var b;
        return b = new lessonplan.Message(a), d.currentObj.addChild(b)
    }, n.interactive = function(a) {
        var b;
        return b = new lessonplan.Interactive(a), d.currentObj.addChild(b),
        function(a) {
            return d.pushCurrent(b), a(), d.popCurrent()
        }
    }, n.stage = function(a, b) {
        var c, e, f, g, h, i;
        stages[a] != null ? (console.log("loading registered interactive svg object: " + a), f = stages[a]()) : (c = t + "/" + a, console.log("loading interactive svg by filename: " + c), f = new lessonplan.InteractiveSVG(c)), console.log("name: " + a), console.log("propertiesMap: " + b);
        if (b != null) {
            i = Object.keys(b);
            for (g = 0, h = i.length; g < h; g++) e = i[g], console.log("setting " + e + " on " + f + " to " + b[e]), f[e] != null && f[e](b[e])
        }
        return d.currentObj.stage(f)
    }, n.soundtrack = function(a) {
        return d.currentObj.soundtrack(a)
    }, n.line = function(a, b, c) {
        var e;
        return e = new lessonplan.Line(a, b), c != null && (d.pushCurrent(e), c(), d.popCurrent()), d.currentObj.addChild(e)
    }, n.lines = line, n.sfx = function(a) {
        var b;
        return b = new lessonplan.Line(a), d.currentObj.addChild(b)
    }, n.show = function() {
        var a, b;
        return a = 1 <= arguments.length ? D.call(arguments, 0) : [], b = new lessonplan.ShowAction(a), d.currentObj.addChild(b)
    }, n.hide = function() {
        var a, b;
        return b = 1 <= arguments.length ? D.call(arguments, 0) : [], b.length === 1 && b[0] === "*" ? a = new lessonplan.HideAllAction : a = new lessonplan.HideAction(b), d.currentObj.addChild(a)
    }, n.set_property = function(a, b, c) {
        var e;
        return c == null && (c = 0), e = new lessonplan.SetAction(a, b, c), d.currentObj.addChild(e)
    }, n.m4v = function(a, b) {
        return b == null && (b = "sd"), d.currentObj.media("m4v", a, b)
    }, n.mp4 = function(a, b) {
        return b == null && (b = "sd"), d.currentObj.media("mp4", a, b)
    }, n.webm = function(a, b) {
        return b == null && (b = "sd"), d.currentObj.media("webm", z + "/" + a, b)
    }, n.ogv = function(a, b) {
        return b == null && (b = "sd"), d.currentObj.media("ogv", a, b)
    }, n.vimeo = function(a, b) {
        return b == null && (b = "sd"), d.currentObj.media("vimeo", a, b)
    }, n.youtube = function(a, b) {
        return b == null && (b = "sd"), d.currentObj.media("youtube", a, b)
    }, n.video = function(a) {
        var b;
        return b = new lessonplan.Video(a), d.currentObj.addChild(b),
        function(a) {
            return d.pushCurrent(b), a(), d.popCurrent()
        }
    }, n.subtitles = function(a) {
        return console.log("adding subtitles: " + a), d.currentObj.subtitles(s + "/" + a + "." + r)
    }, n.duration = function(a) {
        if (d.currentObj.duration != null) return d.currentObj.duration(a)
    }, n.cue = function(a, b) {
        var c;
        return c = new lessonplan.LessonElement, b != null && (d.pushCurrent(c), b(), d.popCurrent()), d.currentObj.cue(a, c)
    }, n.at = function(a) {
        var b;
        return b = function(a) {
            return function(b) {
                return n.cue(a, b)
            }
        }, b(a)
    }, n.milestone = function(a) {
        var b;
        return b = new lessonplan.MilestoneAction(a), d.currentObj.addChild(b)
    }, n.play = function(a) {
        var b;
        return b = new lessonplan.PlayAction(a), d.currentObj.addChild(b)
    }, n.play_until = function(a) {
        var b;
        return b = new lessonplan.PlayUntilAction(a), d.currentObj.addChild(b)
    }, n.wait = function(a) {
        var b;
        return b = new lessonplan.WaitAction(a), d.currentObj.addChild(b)
    }, n.stop_and_reset = function(a) {
        var b;
        return b = new lessonplan.StopAndResetAction(a), d.currentObj.addChild(b)
    }, n.goal = function(a) {
        var b;
        return b = new lessonplan.FSM(a()), d.currentObj.addChild(b)
    }, n.multiple_choice = function(a) {
        var b, c;
        return b = new lessonplan.MultipleChoiceQuestion(a), d.currentObj.addChild(b), c = function(a) {
            return b.mapping(a())
        }, c
    }, n.choice = function(a) {
        var b, c;
        return b = new lessonplan.WaitForChoice(a), d.currentObj.addChild(b), c = function(a) {
            if (a != null) return d.pushCurrent(b), a(), d.popCurrent()
        }, c
    }, n.option = function() {
        var a, b, c;
        return c = 1 <= arguments.length ? D.call(arguments, 0) : [], a = new lessonplan.LessonElement, a.value = c, d.currentObj.addOption != null && d.currentObj.addOption(a), b = function(b) {
            if (b != null) return d.pushCurrent(a), b(), d.popCurrent()
        }, b
    }, n.glow = function() {
        var a, b;
        return b = 1 <= arguments.length ? D.call(arguments, 0) : [], a = new lessonplan.GlowAction(b), d.currentObj.addChild(a)
    }, n.unglow = function() {
        var a, b;
        return a = 1 <= arguments.length ? D.call(arguments, 0) : [], b = new lessonplan.UnglowAction(a), d.currentObj.addChild(b)
    }, n.box_highlight = function() {
        var a, b, c;
        return b = arguments[0], c = 2 <= arguments.length ? D.call(arguments, 1) : [], a = new lessonplan.BoxHighlightAction(b, c), d.currentObj.addChild(a)
    }, n.box_unhighlight = function() {
        var a, b;
        return a = 1 <= arguments.length ? D.call(arguments, 0) : [], b = new lessonplan.BoxUnhighlightAction(a), d.currentObj.addChild(b)
    }, n.x_highlight = function() {
        var a, b;
        return a = 1 <= arguments.length ? D.call(arguments, 0) : [], b = new lessonplan.XHighlightAction(a), d.currentObj.addChild(b)
    }, n.x_unhighlight = function() {
        var a, b;
        return a = 1 <= arguments.length ? D.call(arguments, 0) : [], b = new lessonplan.XUnhighlightAction(a), d.currentObj.addChild(b)
    }, n.transition = function(a, b) {
        var c;
        return c = new lessonplan.GroupTransitionAction(a, b), console.log("-------======"), console.log(c), d.currentObj.addChild(c)
    }, n.video_insert = function(a) {
        var b;
        return b = new lessonplan.Video(a, !0), d.currentObj.addChild(b),
        function(a) {
            return d.pushCurrent(b), a(), d.popCurrent()
        }
    }, n.fsm = goal, n.dsl = d, window.interactiveSVGCounter = 0, lessonplan.InteractiveSVG = function(a) {
        function b(a) {
            this.svgFileName = a, b.__super__.constructor.call(this), this.svg = void 0, this.svgId = "svg" + interactiveSVGCounter, interactiveSVGCounter += 1, this.svgDiv = void 0
        }
        return B(b, a), b.prototype.svgDocumentReady = function(a, b) {
            var c, d, e, f, g;
            f = document.importNode(a.documentElement, !0), this.svgDiv == null && (this.svgDiv = d3.select("#interactive").append("div").attr("id", this.svgId)), $(this.svgDiv.node()).empty(), this.svgDiv.node().appendChild(f), this.svg = d3.select(f), this.svg.attr("width", "100%"), this.svg.attr("height", "100%"), this.svgDiv.style("display", "none"), this.svgDiv.style("opacity", 0), this.svgDiv.style("position", "absolute"), this.svgDiv.style("width", "100%"), this.svgDiv.style("height", "100%"), g = 5, c = "0 0 0 1.0 0 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 1 0", d = this.svg.append("defs"), e = d.append("filter").attr("id", "glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%").call(function() {
                return this.append("feColorMatrix").attr("type", "matrix").attr("values", c), this.append("feGaussianBlur").attr("stdDeviation", g).attr("result", "coloredBlur")
            }), e.append("feMerge").call(function() {
                return this.append("feMergeNode").attr("in", "coloredBlur"), this.append("feMergeNode").attr("in", "SourceGraphic")
            }), this.init();
            if (b != null) return b()
        }, b.prototype.play = function() {}, b.prototype.stop = function() {}, b.prototype.init = function() {}, b.prototype.showElement = function(a) {
            try {
                return x.showSVGElement(this.svg.select(a), 250)
            } catch (b) {
                return console.log("Could not show SVG element " + a)
            }
        }, b.prototype.hideElement = function(a) {
            try {
                return x.hideSVGElement(this.svg.select(a), 250)
            } catch (b) {
                return console.log("Could not hide SVG element " + a)
            }
        }, b.prototype.hideAllElements = function(a) {
            var b, c, d, e, f, g;
            console.log("hiding all elements"), d = this.svg.node(), window.svgNode = d, c = this.svg.node().children, c == null && (c = this.svg.node().childNodes), console.log(c), g = [];
            for (e = 0, f = c.length; e < f; e++) b = c[e], g.push(x.hideSVGElement(d3.select(b)));
            return g
        }, b.prototype.transitionGroups = function(a, b, c) {
            var d, e;
            console.log("[ transitioning " + a + " to " + b + " ]"), d = this.svg.select("#" + a), e = this.svg.select("#" + b);
            if (d == null) {
                console.log("ERROR: bad transitionGroup:"), console.log("Invalid selector: " + a);
                return
            }
            if (e == null) {
                console.log("ERROR: bad transitionGroup:"), console.log("Invalid selector: " + b);
                return
            }
            return x.transitionGroups(d, e, c)
        }, b.prototype.glowElement = function(a) {
            var b;
            return console.log("Glowing " + a), this.svg.select(a).style("filter", "url(#glow)"), b = this.svg.select("filter#glow"), b.attr("id", "glow1"), b.attr("id", "glow")
        }, b.prototype.unglowElement = function(a) {
            return this.svg.select(a).style("filter", "")
        }, b.prototype.boxAroundElement = function(a, b) {
            var c, d, e, f;
            c = this.svg.select(a);
            try {
                f = c.node().getBBox()
            } catch (g) {
                f = c.node().getBoundingClientRect()
            }
            return c.parent != null ? e = c.parent : e = this.svg, d = 5, e.append("rect").attr("x", f.x - d).attr("y", f.y - d).attr("width", f.width + 2 * d).attr("height", f.height + 2 * d).style("fill", "none").style("stroke-width", 2).style("stroke", b).attr("id", a.slice(1) + "-highlight-box")
        }, b.prototype.unboxElement = function(a) {
            return this.svg.select(a + "-highlight-box").remove()
        }, b.prototype.xHighlightElement = function(a) {
            var b, c, d, e;
            b = this.svg.select(a);
            try {
                e = b.node().getBBox()
            } catch (f) {
                e = b.node().getBoundingClientRect()
            }
            return b.parent != null ? d = b.parent : d = this.svg, c = 5, d.append("text").attr("x", Math.abs(e.x + e.width / 2) - 15).attr("y", Math.abs(e.y + e.height / 2) + 18).style("font-family", "Lato, sans-serif").style("font-size", "40px").style("font-weight", "700").attr("fill", "#a00").attr("id", a.slice(1) + "-highlight-x").text("X")
        }, b.prototype.xUnhighlightElement = function(a) {
            return console.log("removing: " + a + "-highlight-x"), this.svg.select(a + "-highlight-x").remove()
        }, b.prototype.show = function() {
            var a, b, c = this;
            return a = $.Deferred(), x.showBackdrop(!1), this.svg == null ? b = this.loadSvg() : b = !0, $.when(b).then(function() {
                return c.svgDiv.style("display", "inline").transition().style("opacity", 1).duration(1e3).each(function() {
                    return a.resolve()
                })
            }), a
        }, b.prototype.loadSvg = function() {
            var a, b = this;
            return a = $.Deferred(), $.ajax({
                url: this.svgFileName,
                dataType: "xml"
            }).success(function(c) {
                return b.svgDocumentReady(c, function() {
                    return a.resolve()
                })
            }).fail(function() {
                return alert("SVG would not load: " + b.svgFileName)
            }), a
        }, b.prototype.hide = function() {
            var a, b = this;
            return a = $.Deferred(), this.runSimulation = !1, this.svgDiv != null ? this.svgDiv.transition().style("opacity", 0).duration(1e3).each("end", function() {
                return b.svgDiv.style("display", "none"), a.resolve()
            }) : a.resolve(), a
        }, b.prototype.reset = function() {
            var a, b = this;
            return a = $.Deferred(), $.when(this.loadSvg()).then(function() {
                return b.hide()
            }).then(function() {
                return a.resolve()
            }), a
        }, b.prototype.attr = function(a, b) {
            return this[a] = b
        }, b
    }(lessonplan.ViewModel), n = typeof window != "undefined" && window !== null ? window : exports, lessonplan.SceneController = function() {
        function a(a) {
            var b, c, d, e, f;
            this.sceneList = a, this.idling = !1, this.shouldSeek = !1, this.seeking = !1, this.targetSegment = void 0, this.targetTime = void 0, this.shouldStop = !1, this.stopping = !1, this.stopped = !0, this.stopDfrd = void 0, this.shouldPause = !1, this.pausing = !1, this.paused = !0, this.pauseDfrd = void 0, this.shouldResume = !1, this.shouldBuffer = !1, this.buffering = !1, this.shouldRun = !1, this.running = !1, this.runningDfrd = void 0, this.stallCount = 0, this.stallCountThreshold = 30, this.currentElement = void 0, this.runLoopActive = !0, this.sceneIndex = 0, this.selectedSceneIndex = 0, this.currentLessonElement = ko.observable(void 0), this.currentTime = ko.observable(void 0), this.currentScene = ko.observable(void 0), this.currentSceneIndex = ko.observable(void 0), this.playingObservable = ko.observable(!1), this.pausedObservable = ko.observable(!1);
            if (n.segment_id != null) {
                f = this.sceneList;
                for (b = d = 0, e = f.length; d < e; b = ++d) {
                    c = f[b];
                    if (c.name === n.segment_id) {
                        this.sceneIndex = b;
                        break
                    }
                }
            }
            this.loadScene(this.sceneIndex), this.interval = 10, this.exitTarget = "/course"
        }
        return a.prototype.punt = function(a) {
            var b, c = this;
            return a || (a = this.interval), b = function() {
                return c.runLoop()
            }, setTimeout(b, a)
        }, a.prototype.stopRunLoop = function() {
            return this.runLoopActive = !1
        }, a.prototype.startRunLoop = function() {
            return this.runLoopActive = !0, this.pausedObservable(!0), n.lessonplan_autoplay ? this.shouldRun = !0 : (this.idling = !0, this.pausedObservable(!0)), this.punt(0)
        }, a.prototype.runLoop = function() {
            var a, b, c = this;
            a = function(a) {
                return console.log(a)
            };
            if (!this.runLoopActive) {
                console.log("run loop inactive: " + this.runLoopActive);
                return
            }
            this.shouldStop && (console.log("[ shouldStop ]"), this.shouldStop = !1, this.stopping = !0, this.stopDfrd = $.when(this.scene.stop()).then(function() {
                return $.when(c.scene.reset()).then(function() {
                    return c.stopping = !1, c.stopped = !0, c.running = !1
                })
            }));
            if (this.stopping) {
                console.log("[ stopping ]"), this.punt();
                return
            }
            this.shouldSeek && (console.log("[ shouldSeek ]"), i.logInteraction("timeline", "seek", this.targetSegment.elementId), this.shouldSeek = !1, this.shouldBuffer = !1, this.buffering = !1, this.seeking = !0, a("> stopping..."), b = void 0, this.targetSegment !== this.currentElement ? b = this.scene.stop() : b = this.currentElement.pause(), this.seekDfrd = $.Deferred(), $.when(b).then(function() {
                return x.indicateLoading(!0)
            }).then(function() {
                var b;
                return a("> resetting"), c.targetSegment === c.currentElement ? !0 : (b = c.scene.reset(), b)
            }).then(function() {
                return a("> seeking..."), c.currentElement = c.targetSegment, c.currentElement.seek(c.targetTime)
            }).then(function() {
                return x.indicateLoading(!1)
            }).then(function() {
                c.seekDfrd.resolve(), c.seeking = !1;
                if (!c.shouldPause) return c.shouldRun = !0
            }));
            if (this.seeking) {
                console.log("[ seeking ]"), this.punt();
                return
            }
            this.shouldPause && (console.log("[ shouldPause ]"), i.logInteraction("timeline", "pause", !0), this.shouldPause = !1, this.pausing = !0, this.pauseDfrd = this.currentElement.pause());
            if (this.pausing) {
                console.log("[ pausing ]"), $.when(this.pauseDfrd).then(function() {
                    return c.paused = !0, c.pausedObservable(!0), c.playingObservable(!1), c.pausing = !1
                }), this.punt();
                return
            }
            this.shouldBuffer && (console.log("[ shouldBuffer ]"), this.shouldBuffer = !1, this.buffering = !0, $.when(function() {
                return console.log("pausing to buffer"), c.currentElement.pause()
            }).then(function() {
                return x.indicateLoading(!0)
            }));
            if (this.buffering) {
                console.log("[ buffering ]"), this.currentElement.ready() && (console.log("buffered enough..."), this.buffering = !1, this.shouldBuffer = !1, x.indicateLoading(!1), this.shouldRun = !0), this.punt();
                return
            }
            if (this.shouldResume) {
                console.log("[ shouldResume ]"), i.logInteraction("timeline", "resume", !0), this.shouldResume = !1;
                if (this.currentElement.resume == null || this.idling) this.idling = !1, this.shouldRun = !0;
                else {
                    this.running = !0, this.playingObservable(!0), this.pausedObservable(!1), this.runningDfrd = this.currentElement.resume(), this.stallCount = 0, this.punt();
                    return
                }
            }
            if (this.shouldRun) {
                console.log("[ shouldRun ]"), i.logInteraction("timeline", "play", !0), this.shouldRun = !1, this.running = !0, this.playingObservable(!0), this.pausedObservable(!1), x.indicateLoading(!1), this.runningDfrd = this.currentElement.run(), this.stallCount = 0, this.punt();
                return
            }
            if (this.shouldAdvanceScene) {
                this.sceneIndex += 1;
                if (this.sceneIndex >= this.sceneList.length) {
                    this.stopped = !0;
                    return
                }
                this.advancingSceneDfrd = this.loadScene(this.sceneIndex, !0), this.shouldAdvanceScene = !1, this.advancingScence = !0
            }
            this.shouldSelectScene && (this.advancingSceneDfrd = this.loadScene(this.selectedSceneIndex, !0), this.shouldSelectScene = !1, this.advancingScence = !0);
            if (this.advancingScene && $.when(this.advancingSceneDfrd).state() === "resolved") {
                this.advancingScene = !1, this.shouldRun = !0, this.punt();
                return
            }
            if (this.running) {
                if ($.when(this.runningDfrd).state() === "resolved") {
                    this.running = !1, this.currentElement.willYieldOnNext() && this.currentElement.finish(), this.currentElement = this.currentElement.next();
                    if (this.currentElement === void 0) {
                        this.running = !1, this.shouldAdvanceScene = !0, this.punt();
                        return
                    }
                    this.currentTime(0), this.currentLessonElement(this.currentElement), this.runningDfrd = this.currentElement.run(), this.running = !0, this.playingObservable(!0), this.pausedObservable(!1)
                }
                this.currentElement.ready || (this.stallCount += 1), this.stallCount > this.stallCountThreshold && (console.log("stalled"), this.running = !1, this.shouldBuffer = !0), this.punt();
                return
            }
            return this.punt()
        }, a.prototype.advance = function() {
            return this.currentElement.run()
        }, a.prototype.seek = function(a, b) {
            return this.shouldSeek = !0, this.targetSegment = a, this.targetTime = b
        }, a.prototype.pause = function() {
            return this.shouldPause = !0
        }, a.prototype.resume = function() {
            return this.shouldResume = !0
        }, a.prototype.run = function() {
            return this.shouldRun = !0
        }, a.prototype.stop = function() {
            return this.shouldRun = !1, this.shouldStop = !0
        }, a.prototype.unloadScene = function() {
            var a = this;
            return this.scene != null && $.when(function() {
                return a.scene.stop()
            }).then(function() {
                return a.scene.cleanup()
            }), $("#sceneCode").remove()
        }, a.prototype.selectScene = function(a) {
            return this.selectedSceneIndex = a, this.shouldStop = !0, this.shouldSelectScene = !0
        }, a.prototype.loadScene = function(a, b) {
            var c, d, e, f, g = this;
            b == null && (b = !1), d = this.sceneList[a].name, e = window.module_id + "/" + window.lesson_id;
            if (b) {
                window.location.href = "/course/" + e + "/" + d;
                return
            }
            return this.unloadScene(), f = window.static_base_url + "/lesson_plans/" + e + "/" + d + ".js", console.log("Loading code: " + f), c = $.Deferred(), x.loadScript(f, function() {
                return console.log("... code ran successfully"), c.resolve()
            }), $.when(c).then(function() {
                return g.scene = window.scenes[d], g.scene == null && console.log("Could not find scene named: " + d), g.currentElement = g.scene, g.sceneIndex = a, g.scene.currentTime = g.currentTime, g.scene.currentSegment = g.currentSegment, g.currentScene(g.scene), g.currentSceneIndex(a), g.startRunLoop()
            })
        }, a
    }(), lessonplan.Timeline = function() {
        function a(a, b) {
            var c, d, e = this;
            this.sceneController = b, this.paused = this.sceneController.pausedObservable, this.playing = this.sceneController.playingObservable, this.onDeckCBs = [], this.timelineCallbacks = [], this.self = ko.observable(this), this.markerSmall = "5", this.markerLarge = "7", this.progressbarTop = "30%", this.progressbarHeight = "35%", this.progressbarCenter = "50%", this.parentDiv = d3.select(a), this.markers = void 0, this.submarkers = void 0, this.div = this.parentDiv.select("#timeline"), this.svg = this.div.append("svg").attr("id", "timeline-svg").attr("class", "timeline-svg"), c = this.svg.append("svg:defs"), c.append("svg:pattern").attr("id", "patstripes").attr("width", 15).attr("height", 15).attr("x", 0).attr("y", 0).attr("patternUnits", "userSpaceOnUse").append("svg:image").attr("width", 15).attr("height", 15).attr("x", 0).attr("y", 0).attr("xlink:href", static_base_url + "/images/stripes.png"), this.bgRect = this.svg.append("rect").attr("width", "100%").attr("height", "100%").attr("class", "timeline-background-rect"), this.progressbarBackground = this.svg.append("rect").attr("width", "100%").attr("height", this.progressbarHeight).attr("x", "0").attr("y", this.progressbarTop).attr("class", "timeline-progressbar-background"), this.progressbar = this.svg.append("rect").attr("width", 0).attr("height", this.progressbarHeight).attr("x", "0").attr("y", this.progressbarTop).attr("class", "timeline-progressbar"), this.activebar = this.svg.append("rect").attr("width", 0).attr("height", this.progressbarHeight).attr("x", "0").attr("y", this.progressbarTop).attr("class", "timeline-activebar").attr("fill", "url(#patstripes)"), this.sceneIndicatorDiv = d3.select("#scene-indicator"), this.sceneIndicatorSVG = this.sceneIndicatorDiv.append("svg").attr("class", "scene-indicator-group"), this.currentTime = 0, this.sceneController.currentTime.subscribe(function(a) {
                return e.update(e.sceneController.currentElement, a)
            }), this.sceneController.currentLessonElement.subscribe(function(a) {
                console.log(e.sceneController.currentTime), console.log(e.sceneController.currentTime());
                if (e.sceneController.currentTime != null) return e.update(e.sceneController.currentElement, e.sceneController.currentTime())
            }), this.sceneController.currentScene.subscribe(function(a) {
                return e.loadScene(a), e.setupTiming(), e.setupSceneIndicator()
            }), this.sceneController.currentSceneIndex.subscribe(function(a) {
                return e.updateSceneIndicator(a)
            }), d = this, this.svg.on("click", function() {
                var a, b, c;
                return console.log("timeline click"), c = d3.mouse(this), a = c[0], b = c[1], d.seekToX(a)
            }), ko.applyBindings(this, this.parentDiv.node())
        }
        return a.prototype.loadScene = function(a) {
            var b, c, d, e, f, g, h, i, k, l, m, n, o, p, q, r, s, t, u, v = this;
            this.scene = a, this.orderedSubsegments = [], this.subsegmentLookup = {}, this.allMilestones = [], this.milestoneLookup = {}, this.allSeekables = [], this.seekableLookup = {}, s = this.scene.children;
            for (m = 0, p = s.length; m < p; m++) {
                i = s[m], i.findMilestones != null ? j = i.findMilestones() : j = [], b = 0, l = 0, i.duration != null && i.duration.subscribe != null ? i.duration.subscribe(function() {
                    return v.setupTiming()
                }) : j.length ? (b = 0, l = i.duration()) : (b = i.duration(), l = b), h = i.elementId, g = {
                    id: h,
                    title: h,
                    duration: b,
                    obj: i,
                    milestones: [],
                    seekables: []
                }, this.orderedSubsegments.push(g), this.subsegmentLookup[h] = g, console.log("subsegment.findSeekables"), console.log(i.findSeekables);
                if (i.findSeekables != null) {
                    f = i.findSeekables(), console.log("found these seekables:"), console.log(f);
                    for (n = 0, q = f.length; n < q; n++) c = f[n], e = c.elementId, d = {
                        id: e,
                        title: c.title,
                        duration: l / f.length,
                        obj: c,
                        parent: i
                    }, console.log(c), c instanceof lessonplan.MilestoneAction && (console.log("> found milestone action"), g.milestones.push(d), this.allMilestones.push(d), this.milestoneLookup[e] = d), g.seekables.push(d), this.allSeekables.push(d), this.seekableLookup[e] = d
                }
            }
            t = this.timelineCallbacks, u = [];
            for (o = 0, r = t.length; o < r; o++) k = t[o], u.push(this.installTimelineCallback(k[0], k[1]));
            return u
        }, a.prototype.setupTiming = function() {
            var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x = this;
            console.log("[timeline]: adjusting timing...");
            if (this.orderedSubsegments == null) return;
            j = 0, s = this.orderedSubsegments;
            for (k = 0, o = s.length; k < o; k++) {
                i = s[k], i.duration = i.obj.duration(), i.startTime = j, j += i.duration, console.log("subsegment"), console.log(i), d = i.seekables.length, f = i.duration / d, h = 0, t = i.seekables;
                for (l = 0, p = t.length; l < p; l++) g = t[l], g.duration = f, g.startTime = h, g.absoluteStartTime = g.startTime + i.startTime, h += g.duration
            }
            this.totalDuration = j, console.log("[timeline]: total duration = " + this.totalDuration), console.log("[timeline]: drawing timeline..."), this.tScale = d3.scale.linear().domain([0, this.totalDuration]).range([0, 100]), u = this.orderedSubsegments;
            for (m = 0, q = u.length; m < q; m++) i = u[m], i.startX = this.tScale(i.startTime), i.tScale = this.tScale;
            this.seekableMarkers = this.svg.selectAll(".timeline-seekable-markers").data(this.allSeekables), this.seekableMarkers.enter().append("rect").attr("y", this.progressbarTop).attr("x", function(a) {
                return x.tScale(a.absoluteStartTime) + "%"
            }).attr("width", function(a) {
                return x.tScale(a.duration) + "%"
            }).attr("height", this.progressbarHeight).attr("class", "seekable-marker").attr("opacity", .001).attr("timelinetooltip", function(a) {
                return a.obj != null && a.obj.text != null ? a.obj.text : ""
            }), $(".seekable-marker").qtip({
                content: {
                    attr: "timelinetooltip"
                },
                position: {
                    my: "bottom center",
                    at: "top center",
                    target: "mouse",
                    adjust: {
                        y: -20
                    }
                },
                style: {
                    classes: "qtip-light qtip-shadow"
                },
                show: {
                    delay: 0
                },
                hide: {
                    delay: 0
                }
            }), this.markers = this.svg.selectAll(".timeline-subsegment-marker").data(this.orderedSubsegments), this.markers.enter().append("circle").attr("cy", this.progressbarCenter).attr("cx", function(a) {
                return console.log("marker at: " + x.tScale(a.startTime)), x.tScale(a.startTime) + "%"
            }).attr("r", this.markerSmall).attr("class", "timeline-subsegment-marker").attr("timelinetooltip", function(a) {
                return a.title
            }), this.markers.exit().remove(), c = this.markerSmall, b = this.markerLarge, this.markers.on("mouseover", function(a) {
                return d3.select(this).transition().attr("r", b).duration(250)
            }), this.markers.on("mouseout", function(a) {
                return d3.select(this).transition().attr("r", c).duration(250)
            }), console.log("[timeline]: installing click handlers..."), console.log("Installing tooltips..."), $(".timeline-segment-marker").qtip({
                content: {
                    attr: "timelinetooltip"
                },
                position: {
                    my: "bottom center",
                    at: "top center"
                },
                style: {
                    classes: "qtip-tipsy qtip-shadow"
                },
                show: {
                    solo: !0
                }
            }), this.milestoneMarkers = this.svg.selectAll(".timeline-milestone-marker").data(this.allMilestones), this.milestoneMarkers.enter().append("circle").attr("cy", this.progressbarCenter).attr("cx", function(a) {
                return console.log(a), console.log("milestone marker at: " + x.tScale(a.absoluteStartTime)), x.tScale(a.absoluteStartTime) + "%"
            }).attr("r", this.markerSmall).attr("class", "timeline-milestone-marker").attr("timelinetooltip", function(a) {
                return a.title
            }), this.milestoneMarkers.exit().remove(), this.milestoneMarkers.on("mouseover", function(a) {
                return d3.select(this).transition().attr("r", b).duration(250), console.log("here!")
            }), this.milestoneMarkers.on("mouseout", function(a) {
                return d3.select(this).transition().attr("r", c).duration(250)
            }), $(".timeline-milestone-marker").qtip({
                content: {
                    attr: "timelinetooltip"
                },
                position: {
                    my: "bottom center",
                    at: "top center",
                    target: "mouse"
                },
                style: {
                    classes: "qtip-tipsy qtip-rounded qtip-shadow"
                },
                show: {
                    solo: !0,
                    event: "click mouseover"
                }
            }), console.log("Done setting up timeline."), v = this.onDeckCBs, w = [];
            for (n = 0, r = v.length; n < r; n++) a = v[n], e = this.getOnDeckURIs(), console.log(a), a != null ? w.push(a(e)) : w.push(void 0);
            return w
        }, a.prototype.setupSceneIndicator = function() {
            var a, b, c, d, e, f, g = this;
            b = this.sceneController.sceneList.length, this.sceneMarkers = [], this.sceneBlockWidth = .02, this.sceneBlockHeight = 1, this.sceneBlockSpacing = .005, this.sceneBlockLineHeight = .2, this.sceneIndicatorSVG.append("rect").attr("width", 100 * (b * this.sceneBlockWidth + (b - 1) * this.sceneBlockSpacing) + "%").attr("height", 100 * this.sceneBlockLineHeight + "%").attr("y", (.5 - this.sceneBlockLineHeight / 2) * 100 + "%").attr("x", "0%").attr("class", "scene-indicator-inactive"), f = [];
            for (c = d = 0, e = b - 1; 0 <= e ? d <= e : d >= e; c = 0 <= e ? ++d : --d) a = this.sceneIndicatorSVG.append("rect").attr("width", this.sceneBlockWidth * 100 + "%").attr("height", this.sceneBlockHeight * 100 + "%").attr("y", "0%").attr("x", c * (this.sceneBlockWidth + this.sceneBlockSpacing) * 100 + "%").attr("class", "scene-indicator-inactive"), this.sceneMarkers[c] = a, f.push(function(a, b) {
                var c;
                return a.on("click", function() {
                    return window.location.href = "/course/" + [module_id, lesson_id, g.sceneController.sceneList[b].name].join("/")
                }), c = g.sceneController.sceneList[b].title, $(a.node()).qtip({
                    content: {
                        text: c
                    },
                    position: {
                        my: "bottom center",
                        at: "top center"
                    },
                    style: {
                        classes: "qtip-tipsy qtip-shadow"
                    }
                })
            }(a, c));
            return f
        }, a.prototype.updateSceneIndicator = function(a) {
            var b, c, d, e;
            e = this.sceneMarkers;
            for (c = 0, d = e.length; c < d; c++) b = e[c], b.attr("class", "scene-indicator-inactive");
            return this.sceneMarkers[a].attr("class", "scene-indicator-active")
        }, a.prototype.currentTimelineURI = function() {
            return this.currentSubsegment.elementId + "/" + this.currentTime
        }, a.prototype.installTimelineCallback = function(a, b) {
            var c, d, e, f;
            return f = a.split("/"), e = f.pop(), d = f.pop(), console.log(this.subsegmentLookup), c = this.subsegmentLookup[d].obj, console.log("~~~~~~~~~~~~~~~~ registering..."), console.log(e), console.log(b), console.log(c), c.cueRaw(e, b)
        }, a.prototype.atTimelineURI = function(a, b) {
            return this.subsegmentLookup != null ? this.installTimelineCallback(a, b) : this.timelineCallbacks.push([a, b])
        }, a.prototype.timelineURItoX = function(a) {
            var b, c, d, e, f;
            return e = a.split("/"), d = e.pop(), c = e.pop(), b = this.segmentLookup[c], d = Number(d), f = b.startX + b.tScale(d)
        }, a.prototype.onNewOnDeckURIs = function(a) {
            return this.onDeckCBs.push(a), this.setupTiming()
        }, a.prototype.getOnDeckURIs = function() {
            var a, b, c, d, e;
            b = [], e = this.orderedSubsegments;
            for (c = 0, d = e.length; c < d; c++) a = e[c], b.push(a.segId);
            return b
        }, a.prototype.update = function(a, b) {
            var c, d, e, f, g, h, i, j, k;
            this.currentSubsegment = a, this.currentTime = b;
            if (a == null) {
                console.log("[timeline]: warning: empty segment in timeline");
                return
            }
            isNaN(b) && (b = void 0), g = a.elementId, k = this.subsegmentLookup[g], k == null && (f = this.seekableLookup[g], f != null && (k = this.subsegmentLookup[f.parent.elementId], b = f.startTime));
            if (k == null) {
                console.log("segment lookup failed: "), console.log(a), console.log(g), console.log(this.segmentLookup), this.currentTime = void 0;
                return
            }
            this.displayedSegment = k;
            if (this.tScale == null) {
                console.log("[timeline]: no time scale defined");
                return
            }
            if (this.displayedSegment == null) {
                console.log("warning: no segment to display");
                return
            }
            return this.currentTime == null ? (e = this.tScale(this.displayedSegment.startTime), c = this.tScale(this.displayedSegment.duration), this.progressbar.attr("width", e + "%"), this.activebar.attr("x", e + "%"), this.activebar.attr("width", c + "%"), console.log("setting activebar width: " + c + "%")) : (d = this.tScale(this.displayedSegment.startTime + this.currentTime), this.progressbar.attr("width", d + "%"), this.activebar.attr("x", "0%"), this.activebar.attr("width", "0%"), h = this.totalDuration - this.currentTime, i = Math.floor(h / 60), j = Math.floor(h - 60 * i), $("#clock-text").text(x.padNumber(i, 2) + ":" + x.padNumber(j, 2)))
        }, a.prototype.seekToX = function(a) {
            var b, c, d, e, f, g, h, i, j, k, l, m;
            if (this.tScale == null) return console.log("[timeline]: no time scale defined"), [void 0, void 0];
            try {
                d = this.svg.node().getBBox().width
            } catch (n) {
                d = this.svg.node().getBoundingClientRect().width
            }
            e = this.tScale.invert(100 * (a / d)), g = void 0, l = this.orderedSubsegments;
            for (h = 0, j = l.length; h < j; h++) {
                c = l[h], console.log(c);
                if (c.startTime > e) break;
                c.startTime < e && (g = c)
            }
            g == null && console.log("[timeline]: no sensible segment to match"), b = e - g.startTime, console.log("[timeline]: seeking to " + g.id + ":" + b);
            if (g.seekables != null) {
                f = void 0, m = g.seekables;
                for (i = 0, k = m.length; i < k; i++) {
                    c = m[i], console.log(c);
                    if (c.startTime > b) break;
                    c.startTime < b && (f = c)
                }
                f != null && (b = f.id)
            } else console.log("no seekables");
            console.log("[timeline]: seeking to " + g.id + ":" + b);
            if (g == null) return;
            return this.update(g, b), this.sceneController.seek(g.obj, b)
        }, a.prototype.play = function() {
            return console.log("[timeline]: play"), this.sceneController.resume()
        }, a.prototype.pause = function() {
            return console.log("[timeline]: pause"), this.sceneController.pause()
        }, a
    }()
})).call(this)