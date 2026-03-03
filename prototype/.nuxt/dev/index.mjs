import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, createError, getQuery as getQuery$1, readBody, getResponseStatus, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getRouterParam, getResponseStatusText } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/h3/dist/index.mjs';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import nodeCrypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { escapeHtml } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/@vue/shared/dist/shared.cjs.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/ufo/dist/index.mjs';
import destr, { destr as destr$1 } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/unstorage/drivers/fs.mjs';
import { digest, hash as hash$1 } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/scule/dist/index.mjs';
import { getContext } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/youch-core/build/index.js';
import { Youch } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { stringify, uneval } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/devalue/index.js';
import { captureRawStackTrace, parseRawStackTrace } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/errx/dist/index.js';
import { isVNode, isRef, toValue } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/vue/index.mjs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1, basename } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/pathe/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/unhead/dist/server.mjs';
import { renderToString } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/vue/server-renderer/index.mjs';
import { walkResolver } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/unhead/dist/utils.mjs';
import { getIcons } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/node_modules/@iconify/utils/lib/index.js';
import { collections } from 'file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/.nuxt/nuxt-icon-server-bundle.mjs';

const serverAssets = [{"baseName":"server","dir":"/Users/raissagabriella/Documents/projects/FMS PTBA/prototype/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/raissagabriella/Documents/projects/FMS PTBA/prototype","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/raissagabriella/Documents/projects/FMS PTBA/prototype/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/raissagabriella/Documents/projects/FMS PTBA/prototype/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/raissagabriella/Documents/projects/FMS PTBA/prototype/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/Users/raissagabriella/Documents/projects/FMS PTBA/prototype/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const defineAppConfig = (config) => config;

const appConfig0 = defineAppConfig({
  ui: {
    colors: {
      primary: "netra",
      neutral: "slate"
    }
  }
});

const inlineAppConfig = {
  "nuxt": {},
  "ui": {
    "colors": {
      "primary": "green",
      "secondary": "blue",
      "success": "green",
      "info": "blue",
      "warning": "yellow",
      "error": "red",
      "neutral": "slate"
    },
    "icons": {
      "arrowDown": "i-lucide-arrow-down",
      "arrowLeft": "i-lucide-arrow-left",
      "arrowRight": "i-lucide-arrow-right",
      "arrowUp": "i-lucide-arrow-up",
      "caution": "i-lucide-circle-alert",
      "check": "i-lucide-check",
      "chevronDoubleLeft": "i-lucide-chevrons-left",
      "chevronDoubleRight": "i-lucide-chevrons-right",
      "chevronDown": "i-lucide-chevron-down",
      "chevronLeft": "i-lucide-chevron-left",
      "chevronRight": "i-lucide-chevron-right",
      "chevronUp": "i-lucide-chevron-up",
      "close": "i-lucide-x",
      "copy": "i-lucide-copy",
      "copyCheck": "i-lucide-copy-check",
      "dark": "i-lucide-moon",
      "drag": "i-lucide-grip-vertical",
      "ellipsis": "i-lucide-ellipsis",
      "error": "i-lucide-circle-x",
      "external": "i-lucide-arrow-up-right",
      "eye": "i-lucide-eye",
      "eyeOff": "i-lucide-eye-off",
      "file": "i-lucide-file",
      "folder": "i-lucide-folder",
      "folderOpen": "i-lucide-folder-open",
      "hash": "i-lucide-hash",
      "info": "i-lucide-info",
      "light": "i-lucide-sun",
      "loading": "i-lucide-loader-circle",
      "menu": "i-lucide-menu",
      "minus": "i-lucide-minus",
      "panelClose": "i-lucide-panel-left-close",
      "panelOpen": "i-lucide-panel-left-open",
      "plus": "i-lucide-plus",
      "reload": "i-lucide-rotate-ccw",
      "search": "i-lucide-search",
      "stop": "i-lucide-square",
      "success": "i-lucide-circle-check",
      "system": "i-lucide-monitor",
      "tip": "i-lucide-lightbulb",
      "upload": "i-lucide-upload",
      "warning": "i-lucide-triangle-alert"
    },
    "tv": {
      "twMergeConfig": {}
    }
  },
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "cssLayer": "components",
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codex",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "cuida",
      "dashicons",
      "devicon",
      "devicon-plain",
      "dinkie-icons",
      "duo-icons",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fa7-brands",
      "fa7-regular",
      "fa7-solid",
      "fad",
      "famicons",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-color",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "garden",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "ix",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "lineicons",
      "logos",
      "ls",
      "lsicon",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-icon-theme",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "meteor-icons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "nrk",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "picon",
      "pixel",
      "pixelarticons",
      "prime",
      "proicons",
      "ps",
      "qlementine-icons",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "roentgen",
      "si",
      "si-glyph",
      "sidekickicons",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "stash",
      "streamline",
      "streamline-block",
      "streamline-color",
      "streamline-cyber",
      "streamline-cyber-color",
      "streamline-emojis",
      "streamline-flex",
      "streamline-flex-color",
      "streamline-freehand",
      "streamline-freehand-color",
      "streamline-kameleon-color",
      "streamline-logos",
      "streamline-pixel",
      "streamline-plump",
      "streamline-plump-color",
      "streamline-sharp",
      "streamline-sharp-color",
      "streamline-stickies-color",
      "streamline-ultimate",
      "streamline-ultimate-color",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "temaki",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};

const appConfig = defuFn(appConfig0, inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        },
        "cache": {
          "maxAge": 31536000
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {},
  "icon": {
    "serverKnownCssClasses": []
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  {
    return _sharedAppConfig;
  }
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

/**
* Nitro internal functions extracted from https://github.com/nitrojs/nitro/blob/v2/src/runtime/internal/utils.ts
*/
function isJsonRequest(event) {
	// If the client specifically requests HTML, then avoid classifying as JSON.
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		// let Nitro handle JSON errors
		return;
	}
	// invoke default Nitro error handler (which will log appropriately if required)
	const defaultRes = await defaultHandler(error, event, { json: true });
	// let Nitro handle redirect if appropriate
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
		// normalize to string format expected by nuxt `error.vue`
		defaultRes.body.stack = defaultRes.body.stack.join("\n");
	}
	const errorObject = defaultRes.body;
	// remove proto/hostname/port from URL
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	// add default server message (keep sanitized for unhandled errors)
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	// we will be rendering this error internally so we can pass along the error.data safely
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	// Access request headers
	const reqHeaders = getRequestHeaders(event);
	// Detect to avoid recursion in SSR rendering of errors
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
	// HTML response (via SSR)
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	// Fallback to static rendered error page
	if (!res) {
		const { template } = await Promise.resolve().then(function () { return error500; });
		{
			// TODO: Support `message` in template
			errorObject.description = errorObject.message;
		}
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	if (!globalThis._importMeta_.test && typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") {
			return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
		}
	}
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script$1 = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _HJz8NeBZ6T_qEvWJ1nSm6Cr6oFXZhiitKniSmVw7yoI = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script$1}<\/script>`);
  });
});

const rootDir = "/Users/raissagabriella/Documents/projects/FMS PTBA/prototype";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"},{"name":"description","content":"PT Bukit Asam CHT Hauling Web Portal"}],"link":[],"style":[],"script":[],"noscript":[],"title":"PTBA CHT Hauling Portal"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt","class":"isolate"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : undefined,
	URL: (data) => data instanceof URL ? data.toString() : undefined
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
const _tmnCdWao0xBihtJjSAzwz664Cdohq1k7h1Aaj4OVCoA = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
			return;
		}
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) {
				continue;
			}
			if (EXCLUDE_TRACE_RE.test(entry.source)) {
				continue;
			}
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			filename,
			stack: trace
		};
		// retain log to be include in the next render
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	// Pass any logs to the client
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
			console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/4.x/api/composables/use-nuxt-app#payload.`);
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"light\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _5b9j5Q9GK0lubOrymLyPPdj1en8eXWmbJpR7F0magw = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _HJz8NeBZ6T_qEvWJ1nSm6Cr6oFXZhiitKniSmVw7yoI,
_tmnCdWao0xBihtJjSAzwz664Cdohq1k7h1Aaj4OVCoA,
_5b9j5Q9GK0lubOrymLyPPdj1en8eXWmbJpR7F0magw
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_fonts/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const __xigBF = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
};

function createSSRContext(event) {
	const ssrContext = {
		url: event.path,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: event.context.nuxt?.noSSR || (false),
		head: createHead(unheadOptions),
		error: false,
		nuxt: undefined,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

function buildAssetsDir() {
	// TODO: support passing event to `useRuntimeConfig`
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	// TODO: support passing event to `useRuntimeConfig`
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
// @ts-expect-error file will be produced after app build
const getServerEntry = () => import('file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/.nuxt//dist/server/server.mjs').then((r) => r.default || r);
// @ts-expect-error file will be produced after app build
const getClientManifest = () => import('file:///Users/raissagabriella/Documents/projects/FMS%20PTBA/prototype/.nuxt//dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
// -- SSR Renderer --
const getSSRRenderer = lazyCachedFunction(async () => {
	// Load server bundle
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) {
		throw new Error("Server bundle is not available");
	}
	// Load precomputed dependencies
	const precomputed = undefined ;
	// Create renderer
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		// In development with vite-node, the manifest is on-demand and will be available after rendering
		// eslint-disable-next-line no-restricted-globals
		if (process.env.NUXT_VITE_NODE_OPTIONS) {
			renderer.rendererContext.updateManifest(await getClientManifest());
		}
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});
// -- SPA Renderer --
const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = undefined ;
	// @ts-expect-error virtual file
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
			const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
			const appTemplate = APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG;
			const loaderTemplate = r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "";
			return appTemplate + loaderTemplate;
		}
	});
	// Create SPA renderer and cache the result for all requests
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) {
			res = fn().catch((err) => {
				res = null;
				throw err;
			});
		}
		return res;
	};
}
function getRenderer(ssrContext) {
	return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
// @ts-expect-error file will be produced after app build
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = new Set();
	for (const mod of usedModules) {
		if (mod in styleMap && styleMap[mod]) {
			for (const style of await styleMap[mod]()) {
				inlinedStyles.add(style);
			}
		}
	}
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

// @ts-expect-error virtual file
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
/**
* remove the root node from the html body
*/
function getServerComponentHTML(body) {
	const match = body.match(ROOT_NODE_REGEX);
	return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
		return undefined;
	}
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
		response[name] = {
			...slot,
			fallback: ssrContext.teleports?.[`island-fallback=${name}`]
		};
	}
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
		return undefined;
	}
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		// remove teleport anchor to avoid hydration issues
		const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) {
				continue;
			}
			slots[slot] = value;
		}
	}
	return slots;
}
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) {
		return html;
	}
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
		}
	}
	return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const _SxA8c9 = defineEventHandler(async (event) => {
	const nitroApp = useNitroApp();
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	// Render app
	const renderer = await getSSRRenderer();
	const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	// Handle errors
	if (ssrContext.payload?.error) {
		throw ssrContext.payload.error;
	}
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			// Do not add links to resources that are inlined (vite v5+)
			if ("inline" in getQuery(resource.file)) {
				continue;
			}
			// Add CSS links in <head> for CSS files
			// - in dev mode when rendering an island and the file has scoped styles and is not a page
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
				link.push({
					rel: "stylesheet",
					href: renderer.rendererContext.buildAssetsURL(resource.file),
					crossorigin: ""
				});
			}
		}
		if (link.length) {
			ssrContext.head.push({ link }, { mode: "server" });
		}
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) {
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
			const currentValue = islandHead[key];
			if (Array.isArray(currentValue)) {
				currentValue.push(...value);
			} else {
				islandHead[key] = value;
			}
		}
	}
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
});
async function getIslandContext(event) {
	// TODO: Strict validation for url
	let url = event.path || "";
	const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : undefined;
	const componentName = componentParts.join("_");
	// TODO: Validate context
	const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
	const ctx = {
		url: "/",
		...context,
		id: hashId,
		name: componentName,
		props: destr$1(context.props) || {},
		slots: {},
		components: {}
	};
	return ctx;
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

const units = [];
const locations = [];
const shifts = [];
const trips = [];
const assignments = [];
const issues = [];
const auditLogs = [];
const counters = {};
function nextId(prefix) {
  if (!counters[prefix]) counters[prefix] = 0;
  counters[prefix]++;
  return `${prefix}-${String(counters[prefix]).padStart(3, "0")}`;
}
const now = /* @__PURE__ */ new Date();
function ts$1(minutesOffset = 0) {
  return new Date(now.getTime() + minutesOffset * 6e4).toISOString();
}
let tickCount = 0;
function simulateTick() {
  tickCount++;
  const n = /* @__PURE__ */ new Date();
  const activeAsn = assignments.filter((a) => a.status === "IN_PROGRESS");
  if (activeAsn.length > 2 && tickCount % 3 === 0) {
    const a = activeAsn[tickCount % activeAsn.length];
    a.status = "COMPLETED";
    a.end_ts = n.toISOString();
  }
  const pendingTrips = trips.filter((t) => t.tonnage_status === "PENDING");
  if (pendingTrips.length > 0 && tickCount % 2 === 0) {
    const t = pendingTrips[tickCount % pendingTrips.length];
    t.tonnage_status = "CONFIRMED";
    t.tonnage_primary = Number((25 + Math.random() * 10).toFixed(2));
    t.tonnage_history.push({ source: "IOT", value: t.tonnage_primary, status: "CONFIRMED", recorded_at: n.toISOString() });
  }
  if (tickCount % 5 === 0 && issues.length < 60) {
    const types = ["PENDING_TOO_LONG", "DUPLICATE_TRIP", "TONNAGE_OUTLIER", "MISSING_TIMESTAMP", "STALE_UPDATE"];
    const sevs = ["HIGH", "MEDIUM", "LOW"];
    const u = units[tickCount % units.length];
    issues.push({
      issue_id: nextId("ISS"),
      issue_type: types[tickCount % types.length],
      severity: sevs[tickCount % sevs.length],
      status: "OPEN",
      linked_entity_type: "UNIT",
      linked_entity_id: u.unit_id,
      unit_id: u.unit_id,
      unit_name: u.unit_name,
      trip_id: null,
      detail: `Auto-detected anomaly for ${u.unit_id}`,
      evidence: { tick: tickCount },
      rule_threshold: "Auto",
      created_at: n.toISOString(),
      updated_at: n.toISOString(),
      resolved_by: null,
      resolved_at: null,
      resolution_note: null
    });
  }
  return { tick: tickCount, pendingResolved: tickCount % 2 === 0 ? 1 : 0 };
}
function seed() {
  for (let i = 1; i <= 10; i++) {
    units.push({ unit_id: `DT-0${i < 10 ? "0" + i : i}`, unit_name: `DT-${i < 10 ? "0" + i : i}`, unit_type: "DUMP_TRUCK", ownership: "OWN", vendor_name: null, capacity_ton: 30 + i % 2 * 5, is_active: true, notes: null });
  }
  for (let i = 11; i <= 20; i++) {
    units.push({ unit_id: `DT-${i}`, unit_name: `DT-${i}`, unit_type: "DUMP_TRUCK", ownership: "RENTAL", vendor_name: i % 2 === 0 ? "Vendor A" : "Vendor B", capacity_ton: 30, is_active: true, notes: null });
  }
  units.push(
    { unit_id: "LD-001", unit_name: "LD-001", unit_type: "LOADER", ownership: "OWN", vendor_name: null, capacity_ton: null, is_active: true, notes: null },
    { unit_id: "LD-002", unit_name: "LD-002", unit_type: "LOADER", ownership: "OWN", vendor_name: null, capacity_ton: null, is_active: true, notes: null },
    { unit_id: "LD-003", unit_name: "LD-003", unit_type: "LOADER", ownership: "RENTAL", vendor_name: "Vendor A", capacity_ton: null, is_active: true, notes: null },
    { unit_id: "SP-001", unit_name: "SP-001", unit_type: "SUPPORT", ownership: "OWN", vendor_name: null, capacity_ton: null, is_active: true, notes: "Fuel Truck" }
  );
  for (let i = 1; i <= 6; i++) {
    locations.push({ location_id: `PIT-0${i}`, location_name: `Pit Block ${String.fromCharCode(64 + i)}`, location_type: "LOADING", location_role: "LOADING", is_active: true });
  }
  locations.push(
    { location_id: "JETTY-01", location_name: "Jetty Point A", location_type: "JETTY", location_role: "DUMPING", is_active: true },
    { location_id: "JETTY-02", location_name: "Jetty Point B", location_type: "JETTY", location_role: "DUMPING", is_active: true }
  );
  for (let i = 1; i <= 10; i++) {
    locations.push({ location_id: `ROM-0${i < 10 ? i : i}`, location_name: `ROM Stockpile ${i}`, location_type: "STOCKPILE", location_role: "DUMPING", is_active: true });
  }
  shifts.push(
    { shift_id: "SHIFT-1", shift_name: "Shift 1 (Day)", start_time: "06:00", end_time: "18:00", timezone: "Asia/Jakarta", is_active: true },
    { shift_id: "SHIFT-2", shift_name: "Shift 2 (Night)", start_time: "18:00", end_time: "06:00", timezone: "Asia/Jakarta", is_active: true }
  );
  units.filter((u) => u.unit_type === "DUMP_TRUCK").forEach((u, idx) => {
    assignments.push({
      assignment_id: nextId("ASN"),
      unit_id: u.unit_id,
      operator_id: `OP-${100 + idx}`,
      shift_id: "SHIFT-1",
      start_ts: ts$1(-480),
      end_ts: null,
      status: idx < 15 ? "IN_PROGRESS" : "ASSIGNED",
      loading_location_id: locations[idx % 6].location_id,
      dumping_location_id: locations[6 + idx % 10].location_id,
      notes: idx % 4 === 0 ? "Priority load" : null
    });
  });
  let tCount = 0;
  while (tCount < 120) {
    const unit = units[tCount % 20];
    if (unit.unit_type !== "DUMP_TRUCK") {
      tCount++;
      continue;
    }
    const loadLoc = locations[Math.floor(Math.random() * 6)];
    const dumpLoc = locations[6 + Math.floor(Math.random() * 10)];
    const duration = 30 + Math.random() * 30;
    const finishOffset = -(tCount * 2);
    const startOffset = finishOffset - duration;
    const tonnageVal = 25 + Math.random() * 10;
    const rand = Math.random();
    let tStatus = "CONFIRMED";
    let tPrimary = Number(tonnageVal.toFixed(2));
    const tHistory = [];
    if (rand > 0.9) {
      tStatus = "MANUAL";
      tHistory.push({ source: "MANUAL_ENTRY", value: tPrimary, status: "MANUAL", recorded_at: ts$1(finishOffset), actor: "Dispatcher", reason: "Sensor Offline" });
    } else if (rand > 0.7) {
      tStatus = "PENDING";
      tPrimary = null;
      tHistory.push({ source: "IOT", value: null, status: "PENDING", recorded_at: ts$1(finishOffset) });
    } else {
      tHistory.push({ source: "IOT", value: tPrimary, status: "PENDING", recorded_at: ts$1(finishOffset - 5) });
      tHistory.push({ source: "IOT", value: tPrimary, status: "CONFIRMED", recorded_at: ts$1(finishOffset) });
    }
    trips.push({
      trip_id: nextId("TRP"),
      unit_id: unit.unit_id,
      unit_name: unit.unit_name,
      assignment_id: null,
      loading_location_id: loadLoc.location_id,
      dumping_location_id: dumpLoc.location_id,
      loading_location_name: loadLoc.location_name,
      dumping_location_name: dumpLoc.location_name,
      depart_load_ts: ts$1(startOffset),
      arrive_load_ts: ts$1(startOffset + 5),
      load_start_ts: ts$1(startOffset + 6),
      load_end_ts: ts$1(startOffset + 10),
      depart_dump_ts: ts$1(startOffset + 12),
      arrive_dump_ts: ts$1(finishOffset - 5),
      dump_start_ts: ts$1(finishOffset - 4),
      dump_end_ts: ts$1(finishOffset),
      tonnage_primary: tPrimary,
      tonnage_status: tStatus,
      tonnage_history: tHistory,
      is_duplicate_flagged: false
    });
    tCount++;
  }
  const issueTypes = ["PENDING_TOO_LONG", "DUPLICATE_TRIP", "TONNAGE_OUTLIER", "MISSING_TIMESTAMP", "STALE_UPDATE"];
  const severities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  const issStatuses = ["OPEN", "OPEN", "OPEN", "IN_REVIEW", "IN_REVIEW", "RESOLVED"];
  for (let i = 0; i < 25; i++) {
    const u = units[i % units.length];
    const t = trips[i % trips.length];
    const it = issueTypes[i % issueTypes.length];
    const sv = severities[i % severities.length];
    const st = issStatuses[i % issStatuses.length];
    issues.push({
      issue_id: nextId("ISS"),
      issue_type: it,
      severity: sv,
      status: st,
      linked_entity_type: it === "STALE_UPDATE" ? "UNIT" : "TRIP",
      linked_entity_id: it === "STALE_UPDATE" ? u.unit_id : t.trip_id,
      unit_id: u.unit_id,
      unit_name: u.unit_name,
      trip_id: it === "STALE_UPDATE" ? null : t.trip_id,
      detail: `${it.replace(/_/g, " ")} detected for ${u.unit_id}`,
      evidence: { value: 40 + i, threshold: 38 },
      rule_threshold: it === "TONNAGE_OUTLIER" ? "2 std dev" : "30 min",
      created_at: ts$1(-(i * 15)),
      updated_at: ts$1(-(i * 10)),
      resolved_by: st === "RESOLVED" ? "Supervisor" : null,
      resolved_at: st === "RESOLVED" ? ts$1(-(i * 5)) : null,
      resolution_note: st === "RESOLVED" ? "Verified and cleared" : null
    });
  }
  const actors = ["Dispatcher", "Supervisor", "System", "Checker"];
  for (let i = 0; i < 10; i++) {
    const a = assignments[i % assignments.length];
    auditLogs.push({ log_id: nextId("AUD"), timestamp: ts$1(-(i * 20)), actor: actors[i % 4], action: i < 5 ? "CREATE" : "UPDATE", entity_type: "ASSIGNMENT", entity_id: a.assignment_id, reason: i < 5 ? "New dispatch" : "Status update", payload_before: i < 5 ? null : { status: "ASSIGNED" }, payload_after: { status: i < 5 ? "ASSIGNED" : "IN_PROGRESS" } });
  }
  const manualTrips = trips.filter((t) => t.tonnage_status === "MANUAL");
  for (let i = 0; i < Math.min(8, manualTrips.length); i++) {
    const t = manualTrips[i];
    auditLogs.push({ log_id: nextId("AUD"), timestamp: ts$1(-(i * 25)), actor: "Checker", action: "UPDATE", entity_type: "TRIP", entity_id: t.trip_id, reason: "Manual tonnage - sensor offline", payload_before: { tonnage_status: "PENDING", tonnage_primary: null }, payload_after: { tonnage_status: "MANUAL", tonnage_primary: t.tonnage_primary } });
  }
  const resolved = issues.filter((i) => i.status === "RESOLVED");
  for (let i = 0; i < Math.min(7, resolved.length); i++) {
    const iss = resolved[i];
    auditLogs.push({ log_id: nextId("AUD"), timestamp: ts$1(-(i * 30)), actor: "Supervisor", action: "TRANSITION", entity_type: "ISSUE", entity_id: iss.issue_id, reason: "Issue resolved", payload_before: { status: "IN_REVIEW" }, payload_after: { status: "RESOLVED" } });
  }
  const confirmed = trips.filter((t) => t.tonnage_status === "CONFIRMED").slice(0, 10);
  for (let i = 0; i < confirmed.length; i++) {
    const t = confirmed[i];
    auditLogs.push({ log_id: nextId("AUD"), timestamp: ts$1(-(i * 12)), actor: "System", action: "UPDATE", entity_type: "TRIP", entity_id: t.trip_id, reason: "IOT confirmed", payload_before: { tonnage_status: "PENDING" }, payload_after: { tonnage_status: "CONFIRMED", tonnage_primary: t.tonnage_primary } });
  }
  auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  console.log(`[Store] Seeded ${units.length} units, ${locations.length} locations, ${trips.length} trips, ${issues.length} issues, ${auditLogs.length} audit logs.`);
}
seed();

function writeAudit(input) {
  var _a, _b, _c;
  const entry = {
    log_id: nextId("AUD"),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    actor: input.actor,
    action: input.action,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    reason: (_a = input.reason) != null ? _a : null,
    payload_before: (_b = input.payload_before) != null ? _b : null,
    payload_after: (_c = input.payload_after) != null ? _c : null
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 500) {
    auditLogs.pop();
  }
  return entry;
}

const PENDING_TOO_LONG_MIN = 120;
const TONNAGE_OUTLIER_PCT = 0.2;
const DUPLICATE_WINDOW_MIN = 10;
function rulePendingTooLong() {
  const now = Date.now();
  return trips.filter((t) => t.tonnage_status === "PENDING" && t.dump_end_ts).filter((t) => (now - new Date(t.dump_end_ts).getTime()) / 6e4 > PENDING_TOO_LONG_MIN).map((t) => ({
    type: "PENDING_TOO_LONG",
    severity: "HIGH",
    unit_id: t.unit_id,
    unit_name: t.unit_name,
    trip_id: t.trip_id,
    detail: `Trip pending for >${Math.round((now - new Date(t.dump_end_ts).getTime()) / 6e4)} min`,
    rule_threshold: `${PENDING_TOO_LONG_MIN} min`,
    evidence: { dump_end: t.dump_end_ts }
  }));
}
function ruleDuplicateTrip() {
  const results = [];
  for (let i = 0; i < trips.length; i++) {
    const t = trips[i];
    if (!t.dump_end_ts) continue;
    const others = trips.filter(
      (o, idx) => idx !== i && o.unit_id === t.unit_id && o.dumping_location_id === t.dumping_location_id && o.dump_end_ts && Math.abs(new Date(o.dump_end_ts).getTime() - new Date(t.dump_end_ts).getTime()) / 6e4 < DUPLICATE_WINDOW_MIN
    );
    if (others.length > 0) {
      results.push({
        type: "DUPLICATE_TRIP",
        severity: "HIGH",
        unit_id: t.unit_id,
        unit_name: t.unit_name,
        trip_id: t.trip_id,
        detail: `Potential duplicate with ${others.map((o) => o.trip_id).join(", ")}`,
        rule_threshold: `${DUPLICATE_WINDOW_MIN} min`,
        evidence: { others: others.map((o) => o.trip_id) }
      });
      t.is_duplicate_flagged = true;
    }
  }
  return results;
}
function ruleTonnageOutlier() {
  const results = [];
  for (const t of trips) {
    if (t.tonnage_primary === null) continue;
    const unit = units.find((u) => u.unit_id === t.unit_id);
    if (!unit || !unit.capacity_ton) continue;
    const cap = unit.capacity_ton;
    const min = cap * (1 - TONNAGE_OUTLIER_PCT);
    const max = cap * (1 + TONNAGE_OUTLIER_PCT);
    if (t.tonnage_primary < min || t.tonnage_primary > max) {
      results.push({
        type: "TONNAGE_OUTLIER",
        severity: "HIGH",
        unit_id: t.unit_id,
        unit_name: t.unit_name,
        trip_id: t.trip_id,
        detail: `Value ${t.tonnage_primary}t is outside [${min.toFixed(1)}, ${max.toFixed(1)}]`,
        rule_threshold: `+/- 20% of ${cap}t`,
        evidence: { capacity: cap, value: t.tonnage_primary }
      });
    }
  }
  return results;
}
function ruleMissingTimestamp() {
  return trips.filter((t) => !t.load_start_ts || !t.dump_end_ts).map((t) => {
    const missing = [];
    if (!t.load_start_ts) missing.push("load_start");
    if (!t.dump_end_ts) missing.push("dump_end");
    return {
      type: "MISSING_TIMESTAMP",
      severity: "MEDIUM",
      unit_id: t.unit_id,
      unit_name: t.unit_name,
      trip_id: t.trip_id,
      detail: `Missing: ${missing.join(", ")}`,
      rule_threshold: "All timestamps required",
      evidence: { missing }
    };
  });
}
function ruleStaleUpdate() {
  return [];
}
function evaluateAnomalies() {
  var _a;
  const detected = [
    ...rulePendingTooLong(),
    ...ruleDuplicateTrip(),
    ...ruleTonnageOutlier(),
    ...ruleMissingTimestamp(),
    ...ruleStaleUpdate()
  ];
  const key = (d) => {
    var _a2;
    return `${d.type}:${(_a2 = d.trip_id) != null ? _a2 : d.unit_id}`;
  };
  const existingKeys = new Set(issues.map((i) => {
    var _a2;
    return `${i.issue_type}:${(_a2 = i.trip_id) != null ? _a2 : i.unit_id}`;
  }));
  for (const d of detected) {
    if (!existingKeys.has(key(d))) {
      const newIssue = {
        issue_id: nextId("ISS"),
        issue_type: d.type,
        severity: d.severity,
        status: "OPEN",
        linked_entity_type: d.trip_id ? "TRIP" : "UNIT",
        linked_entity_id: (_a = d.trip_id) != null ? _a : d.unit_id,
        unit_id: d.unit_id,
        unit_name: d.unit_name,
        trip_id: d.trip_id,
        detail: d.detail,
        evidence: d.evidence,
        rule_threshold: d.rule_threshold,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString(),
        resolved_by: null,
        resolved_at: null,
        resolution_note: null
      };
      issues.push(newIssue);
      writeAudit({
        actor: "System (Anomaly Engine)",
        action: "CREATE",
        entity_type: "ISSUE",
        entity_id: newIssue.issue_id,
        reason: "Anomaly Detected",
        payload_after: newIssue
      });
    }
  }
  return issues;
}

const warnOnceSet = /* @__PURE__ */ new Set();
const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _4Y5HdJ = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url)
    return createError({ status: 400, message: "Invalid icon request" });
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = url.searchParams.get("icons")?.split(",");
  if (collection) {
    if (icons?.length) {
      const data = getIcons(
        collection,
        icons
      );
      consola$1.debug(`[Icon] serving ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
      return data;
    }
  } else {
    if (collectionName && !warnOnceSet.has(collectionName) && apiEndPoint === DEFAULT_ENDPOINT) {
      consola$1.warn([
        `[Icon] Collection \`${collectionName}\` is not found locally`,
        `We suggest to install it via \`npm i -D @iconify-json/${collectionName}\` to provide the best end-user experience.`
      ].join("\n"));
      warnOnceSet.add(collectionName);
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL("./" + basename(url.pathname) + url.search, apiEndPoint);
    consola$1.debug(`[Icon] fetching ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola$1.error(e);
      if (e.status === 404)
        return createError({ status: 404 });
      else
        return createError({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(getQuery$1(event).icons || "");
    return `${collection}_${icons.split(",")[0]}_${icons.length}_${hash$1(icons)}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

const _lazy_7_vBXa = () => Promise.resolve().then(function () { return audit_get$5; });
const _lazy_8UWnaH = () => Promise.resolve().then(function () { return availability_get$3; });
const _lazy_aVKNU3 = () => Promise.resolve().then(function () { return summary_get$3; });
const _lazy_9A3Mwh = () => Promise.resolve().then(function () { return summary_get$1; });
const _lazy_2cIN4z = () => Promise.resolve().then(function () { return audit_get$3; });
const _lazy_nWSOf1 = () => Promise.resolve().then(function () { return issues_get$1; });
const _lazy__Xqvad = () => Promise.resolve().then(function () { return _id__get$1; });
const _lazy_w56Z4e = () => Promise.resolve().then(function () { return _id__patch$3; });
const _lazy_ms7zPX = () => Promise.resolve().then(function () { return assignments_get$1; });
const _lazy_U2NlgT = () => Promise.resolve().then(function () { return assignments_post$1; });
const _lazy_SMCrDA = () => Promise.resolve().then(function () { return _id__patch$1; });
const _lazy__6dvTX = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_ZysLtN = () => Promise.resolve().then(function () { return fleet_get$1; });
const _lazy_SkjN1T = () => Promise.resolve().then(function () { return _unitId__get$1; });
const _lazy_wBfzfQ = () => Promise.resolve().then(function () { return health_get$1; });
const _lazy_K0AGdD = () => Promise.resolve().then(function () { return masterData_get$1; });
const _lazy_ED5Hqs = () => Promise.resolve().then(function () { return locations_get$1; });
const _lazy_fUdWH2 = () => Promise.resolve().then(function () { return shifts_get$1; });
const _lazy_K9QIj1 = () => Promise.resolve().then(function () { return units_get$1; });
const _lazy_UstEb2 = () => Promise.resolve().then(function () { return kpis_get$1; });
const _lazy_4ZWJwI = () => Promise.resolve().then(function () { return confirmFeed_post$1; });
const _lazy_ifdRo0 = () => Promise.resolve().then(function () { return manual_post$1; });
const _lazy_fdGsl_ = () => Promise.resolve().then(function () { return trips_get$1; });
const _lazy_8K6elZ = () => Promise.resolve().then(function () { return _tripId__get$1; });
const _lazy_Uk7nkv = () => Promise.resolve().then(function () { return analytics_get$1; });
const _lazy_Gr6dEp = () => Promise.resolve().then(function () { return audit_csv_get$1; });
const _lazy_dIaI9F = () => Promise.resolve().then(function () { return audit_get$1; });
const _lazy_wihdIa = () => Promise.resolve().then(function () { return availability_csv_get$1; });
const _lazy_26iBDk = () => Promise.resolve().then(function () { return availability_get$1; });
const _lazy_fLWxS1 = () => Promise.resolve().then(function () { return dataQuality_get$1; });
const _lazy_X9HBop = () => Promise.resolve().then(function () { return export_get$1; });
const _lazy_CB527u = () => Promise.resolve().then(function () { return issues_csv_get$1; });
const _lazy_a0nLtV = () => Promise.resolve().then(function () { return production_csv_get$1; });
const _lazy_1skFfn = () => Promise.resolve().then(function () { return production_get$1; });
const _lazy_qyBKvA = () => Promise.resolve().then(function () { return tick_post$1; });
const _lazy_w1in8v = () => Promise.resolve().then(function () { return users_get$1; });
const _lazy_yLMtC8 = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: __xigBF, lazy: false, middleware: true, method: undefined },
  { route: '/api/audit', handler: _lazy_7_vBXa, lazy: true, middleware: false, method: "get" },
  { route: '/api/availability', handler: _lazy_8UWnaH, lazy: true, middleware: false, method: "get" },
  { route: '/api/availability/summary', handler: _lazy_aVKNU3, lazy: true, middleware: false, method: "get" },
  { route: '/api/dashboard/summary', handler: _lazy_9A3Mwh, lazy: true, middleware: false, method: "get" },
  { route: '/api/data-quality/audit', handler: _lazy_2cIN4z, lazy: true, middleware: false, method: "get" },
  { route: '/api/data-quality/issues', handler: _lazy_nWSOf1, lazy: true, middleware: false, method: "get" },
  { route: '/api/data-quality/issues/:id', handler: _lazy__Xqvad, lazy: true, middleware: false, method: "get" },
  { route: '/api/data-quality/issues/:id', handler: _lazy_w56Z4e, lazy: true, middleware: false, method: "patch" },
  { route: '/api/dispatch/assignments', handler: _lazy_ms7zPX, lazy: true, middleware: false, method: "get" },
  { route: '/api/dispatch/assignments', handler: _lazy_U2NlgT, lazy: true, middleware: false, method: "post" },
  { route: '/api/dispatch/assignments/:id', handler: _lazy_SMCrDA, lazy: true, middleware: false, method: "patch" },
  { route: '/api/dispatch', handler: _lazy__6dvTX, lazy: true, middleware: false, method: "get" },
  { route: '/api/fleet', handler: _lazy_ZysLtN, lazy: true, middleware: false, method: "get" },
  { route: '/api/fleet/:unitId', handler: _lazy_SkjN1T, lazy: true, middleware: false, method: "get" },
  { route: '/api/health', handler: _lazy_wBfzfQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/master-data', handler: _lazy_K0AGdD, lazy: true, middleware: false, method: "get" },
  { route: '/api/master-data/locations', handler: _lazy_ED5Hqs, lazy: true, middleware: false, method: "get" },
  { route: '/api/master-data/shifts', handler: _lazy_fUdWH2, lazy: true, middleware: false, method: "get" },
  { route: '/api/master-data/units', handler: _lazy_K9QIj1, lazy: true, middleware: false, method: "get" },
  { route: '/api/production/kpis', handler: _lazy_UstEb2, lazy: true, middleware: false, method: "get" },
  { route: '/api/production/tonnage/confirm-feed', handler: _lazy_4ZWJwI, lazy: true, middleware: false, method: "post" },
  { route: '/api/production/tonnage/manual', handler: _lazy_ifdRo0, lazy: true, middleware: false, method: "post" },
  { route: '/api/production/trips', handler: _lazy_fdGsl_, lazy: true, middleware: false, method: "get" },
  { route: '/api/production/trips/:tripId', handler: _lazy_8K6elZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/analytics', handler: _lazy_Uk7nkv, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/audit.csv', handler: _lazy_Gr6dEp, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/audit', handler: _lazy_dIaI9F, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/availability.csv', handler: _lazy_wihdIa, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/availability', handler: _lazy_26iBDk, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/data-quality', handler: _lazy_fLWxS1, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/export', handler: _lazy_X9HBop, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/issues.csv', handler: _lazy_CB527u, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/production.csv', handler: _lazy_a0nLtV, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/production', handler: _lazy_1skFfn, lazy: true, middleware: false, method: "get" },
  { route: '/api/simulate/tick', handler: _lazy_qyBKvA, lazy: true, middleware: false, method: "post" },
  { route: '/api/users', handler: _lazy_w1in8v, lazy: true, middleware: false, method: "get" },
  { route: '/__nuxt_error', handler: _lazy_yLMtC8, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _4Y5HdJ, lazy: false, middleware: false, method: undefined },
  { route: '/_fonts/**', handler: _lazy_yLMtC8, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_yLMtC8, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = {
	"appName": "Nuxt",
	"status": 500,
	"statusText": "Internal server error",
	"description": "This page is temporarily unavailable.",
	"refresh": "Refresh this page"
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1.0,minimum-scale=1.0\" name=\"viewport\"><script>!function(){const e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(const e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(const o of e)if(\"childList\"===o.type)for(const e of o.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),\"use-credentials\"===e.crossOrigin?r.credentials=\"include\":\"anonymous\"===e.crossOrigin?r.credentials=\"omit\":r.credentials=\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script><style>*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:\"\"}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1,h2{font-size:inherit;font-weight:inherit}h1,h2,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.grid{display:grid}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-2{padding-left:.5rem;padding-right:.5rem}.text-center{text-align:center}.text-\\[80px\\]{font-size:80px}.text-2xl{font-size:1.5rem;line-height:2rem}.text-\\[\\#020420\\]{--un-text-opacity:1;color:rgb(2 4 32/var(--un-text-opacity))}.text-\\[\\#64748B\\]{--un-text-opacity:1;color:rgb(100 116 139/var(--un-text-opacity))}.font-semibold{font-weight:600}.leading-none{line-height:1}.tracking-wide{letter-spacing:.025em}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.tabular-nums{--un-numeric-spacing:tabular-nums;font-variant-numeric:var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media(prefers-color-scheme:dark){.dark\\:bg-\\[\\#020420\\]{--un-bg-opacity:1;background-color:rgb(2 4 32/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media(min-width:640px){.sm\\:text-\\[110px\\]{font-size:110px}.sm\\:text-3xl{font-size:1.875rem;line-height:2.25rem}}</style></head><body class=\"antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide\"><div class=\"max-w-520px text-center\"><h1 class=\"font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]\">" + escapeHtml(messages.status) + "</h1><h2 class=\"font-semibold mb-2 sm:text-3xl text-2xl\">" + escapeHtml(messages.statusText) + "</h2><p class=\"mb-4 px-2 text-[#64748B] text-md\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const audit_get$4 = defineEventHandler(() => {
  return {
    items: auditLogs,
    total: auditLogs.length
  };
});

const audit_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: audit_get$4
}, Symbol.toStringTag, { value: 'Module' }));

const availability_get$2 = defineEventHandler(() => {
  return units.map((u) => {
    const isDown = !u.is_active;
    const isWorking = assignments.some((a) => a.unit_id === u.unit_id && (a.status === "ASSIGNED" || a.status === "IN_PROGRESS"));
    const totalMin = 600;
    let breakdown = isDown ? 600 : 0;
    let running = isWorking ? 450 : 0;
    let standby = !isDown && !isWorking ? 500 : 50;
    let delay = isWorking ? 100 : 50;
    if (isDown) {
      running = 0;
      standby = 0;
      delay = 0;
    }
    const pa = (totalMin - breakdown) / totalMin * 100;
    const ua = running / (totalMin - breakdown) * 100 || 0;
    return {
      unit_id: u.unit_id,
      unit_name: u.unit_name,
      running_min: running,
      standby_min: standby,
      delay_min: delay,
      breakdown_min: breakdown,
      pa_pct: Math.round(pa * 10) / 10,
      ua_pct: Math.round(ua * 10) / 10,
      completeness_pct: 95,
      completeness_label: "HIGH",
      is_manual_adjusted: false
    };
  });
});

const availability_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: availability_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const summary_get$2 = defineEventHandler(() => {
  const totalHours = 12;
  let totalPa = 0;
  let totalUa = 0;
  let totalRun = 0;
  let totalDown = 0;
  let totalStandby = 0;
  let activeUnitCount = 0;
  const rows = units.map((u) => {
    let running = 0;
    let breakdown = 0;
    let standby = 0;
    const activeAsn = assignments.find((a) => a.unit_id === u.unit_id && a.status === "IN_PROGRESS");
    if (!u.is_active) {
      breakdown = totalHours;
    } else if (activeAsn) {
      running = 10;
      standby = 2;
    } else {
      standby = totalHours;
    }
    const available = totalHours - breakdown;
    const pa = available / totalHours * 100;
    const ua = available > 0 ? running / available * 100 : 0;
    let completeness = "HIGH";
    if (!activeAsn && u.is_active) completeness = "MEDIUM";
    if (!u.is_active && !u.notes) completeness = "LOW";
    if (u.unit_type === "DUMP_TRUCK") {
      totalRun += running;
      totalDown += breakdown;
      totalStandby += standby;
      totalPa += pa;
      totalUa += ua;
      activeUnitCount++;
    }
    return {
      unitId: u.unit_id,
      unitName: u.unit_name,
      type: u.unit_type,
      paLike: Math.round(pa * 10) / 10,
      uaLike: Math.round(ua * 10) / 10,
      runningHours: running,
      breakdownHours: breakdown,
      standbyHours: standby,
      dataCompleteness: completeness
    };
  });
  const avgPa = activeUnitCount ? totalPa / activeUnitCount : 0;
  const avgUa = activeUnitCount ? totalUa / activeUnitCount : 0;
  const highCount = rows.filter((r) => r.dataCompleteness === "HIGH").length;
  const completenessScore = Math.round(highCount / rows.length * 100);
  return {
    aggregate: {
      paLike: Math.round(avgPa * 10) / 10,
      uaLike: Math.round(avgUa * 10) / 10,
      runningHours: totalRun,
      breakdownHours: totalDown,
      standbyHours: totalStandby,
      dataCompleteness: completenessScore
    },
    rows
  };
});

const summary_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: summary_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const summary_get = defineEventHandler(() => {
  evaluateAnomalies();
  const now = /* @__PURE__ */ new Date();
  const activeUnits = units.filter((u) => u.is_active).length;
  const totalUnits = units.length;
  const pendingTrips = trips.filter((t) => t.tonnage_status === "PENDING").length;
  const confirmedTrips = trips.filter((t) => t.tonnage_status === "CONFIRMED").length;
  const manualTrips = trips.filter((t) => t.tonnage_status === "MANUAL").length;
  const totalTrips = trips.length;
  const openIssues = issues.filter((i) => i.status === "OPEN").length;
  const criticalIssues = issues.filter((i) => i.severity === "CRITICAL" && i.status !== "RESOLVED").length;
  const activeAssignments = assignments.filter((a) => a.status === "ASSIGNED" || a.status === "IN_PROGRESS").length;
  const completedAssignments = assignments.filter((a) => a.status === "COMPLETED").length;
  const confirmedTonnage = trips.filter((t) => t.tonnage_status === "CONFIRMED" && t.tonnage_primary != null).reduce((s, t) => {
    var _a;
    return s + ((_a = t.tonnage_primary) != null ? _a : 0);
  }, 0);
  const pendingTonnage = trips.filter((t) => t.tonnage_status === "PENDING" && t.tonnage_primary != null).reduce((s, t) => {
    var _a;
    return s + ((_a = t.tonnage_primary) != null ? _a : 0);
  }, 0);
  const manualTonnage = trips.filter((t) => t.tonnage_status === "MANUAL" && t.tonnage_primary != null).reduce((s, t) => {
    var _a;
    return s + ((_a = t.tonnage_primary) != null ? _a : 0);
  }, 0);
  const kpis = {
    activeUnits,
    totalUnits,
    pendingTrips,
    confirmedTrips,
    manualTrips,
    totalTrips,
    openIssues,
    criticalIssues,
    activeAssignments,
    completedAssignments,
    confirmedTonnage: Math.round(confirmedTonnage),
    pendingTonnage: Math.round(pendingTonnage),
    manualTonnage: Math.round(manualTonnage),
    totalTonnage: Math.round(confirmedTonnage + pendingTonnage + manualTonnage)
  };
  const pendingTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(d.getHours() - i * 4);
    const label = `${String(d.getHours()).padStart(2, "0")}:00`;
    const baseCount = pendingTrips;
    const noise = Math.floor(Math.random() * 6) - 3;
    const count = Math.max(0, baseCount + noise + (6 - i));
    const avgAge = Math.round(15 + (6 - i) * 8 + Math.random() * 10);
    pendingTrend.push({ label, count, avgAge });
  }
  const reasonCounts = {};
  const pendingReasons = [
    "MISSING_IOT_READING",
    "SENSOR_TIMEOUT",
    "AWAITING_MANUAL_ENTRY",
    "SYSTEM_DELAY",
    "CALIBRATION_MISMATCH"
  ];
  const pendingList = trips.filter((t) => t.tonnage_status === "PENDING");
  pendingList.forEach((t, idx) => {
    const reason = pendingReasons[idx % pendingReasons.length];
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });
  if (Object.keys(reasonCounts).length === 0) {
    pendingReasons.forEach((r, i) => {
      reasonCounts[r] = 3 + i * 2;
    });
  }
  const pendingBreakdown = Object.entries(reasonCounts).map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
  const pendingQueue = pendingList.slice(0, 15).map((t, idx) => ({
    trip_id: t.trip_id,
    unit_id: t.unit_id,
    loading_location: t.loading_location_name || t.loading_location_id,
    dumping_location: t.dumping_location_name || t.dumping_location_id,
    tonnage_value: t.tonnage_primary,
    pending_reason: pendingReasons[idx % pendingReasons.length],
    pending_since: new Date(now.getTime() - (10 + idx * 12) * 6e4).toISOString(),
    age_minutes: 10 + idx * 12
  }));
  const openIssuesList = issues.filter((i) => i.status === "OPEN").sort((a, b) => {
    var _a, _b;
    const sevOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return ((_a = sevOrder[a.severity]) != null ? _a : 4) - ((_b = sevOrder[b.severity]) != null ? _b : 4);
  }).slice(0, 15).map((i) => ({
    issue_id: i.issue_id,
    issue_type: i.issue_type,
    severity: i.severity,
    unit_id: i.unit_id,
    detail: i.detail.length > 60 ? i.detail.slice(0, 60) + "..." : i.detail,
    created_at: i.created_at
  }));
  const latestAudits = [...auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15).map((a) => ({
    log_id: a.log_id,
    action: a.action,
    entity_type: a.entity_type,
    entity_id: a.entity_id,
    actor: a.actor,
    reason: a.reason,
    timestamp: a.timestamp
  }));
  const unitTripCounts = {};
  trips.forEach((t) => {
    var _a;
    if (!unitTripCounts[t.unit_id]) unitTripCounts[t.unit_id] = { count: 0, tonnage: 0 };
    unitTripCounts[t.unit_id].count++;
    unitTripCounts[t.unit_id].tonnage += (_a = t.tonnage_primary) != null ? _a : 0;
  });
  const topUnits = Object.entries(unitTripCounts).map(([unit_id, data]) => {
    var _a, _b, _c, _d;
    return {
      unit_id,
      trip_count: data.count,
      total_tonnage: Math.round(data.tonnage),
      unit_type: (_b = (_a = units.find((u) => u.unit_id === unit_id)) == null ? void 0 : _a.unit_type) != null ? _b : "UNKNOWN",
      ownership: (_d = (_c = units.find((u) => u.unit_id === unit_id)) == null ? void 0 : _c.ownership) != null ? _d : "UNKNOWN"
    };
  }).sort((a, b) => b.trip_count - a.trip_count).slice(0, 15);
  return {
    kpis,
    pendingTrend,
    pendingBreakdown,
    pendingQueue,
    openIssues: openIssuesList,
    latestAudits,
    topUnits
  };
});

const summary_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: summary_get
}, Symbol.toStringTag, { value: 'Module' }));

const audit_get$2 = defineEventHandler(() => {
  return auditLogs;
});

const audit_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: audit_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const issues_get = defineEventHandler(() => {
  evaluateAnomalies();
  const sorted = [...issues].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return {
    items: sorted,
    total: sorted.length
  };
});

const issues_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: issues_get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__get = defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  const issue = issues.find((i) => i.issue_id === id);
  if (!issue) {
    throw createError({ statusCode: 404, statusMessage: "Issue not found" });
  }
  const issueAudit = auditLogs.filter((a) => a.entity_id === id && a.entity_type === "ISSUE").sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return {
    issue,
    audit: issueAudit
  };
});

const _id__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__patch$2 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const issue = issues.find((i) => i.issue_id === id);
  if (!issue) {
    throw createError({ statusCode: 404, statusMessage: "Issue not found" });
  }
  if (!body.status || !body.reason || !body.actor) {
    throw createError({ statusCode: 400, statusMessage: "status, reason, and actor are required" });
  }
  const previousStatus = issue.status;
  issue.status = body.status;
  issue.updated_at = (/* @__PURE__ */ new Date()).toISOString();
  if (body.status === "RESOLVED") {
    issue.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
    issue.resolved_by = body.actor;
    issue.resolution_note = body.reason;
  } else {
    issue.resolved_at = null;
    issue.resolved_by = null;
  }
  writeAudit({
    actor: body.actor,
    action: "TRANSITION",
    entity_type: "ISSUE",
    entity_id: issue.issue_id,
    reason: body.reason,
    payload_before: { status: previousStatus },
    payload_after: { status: issue.status, note: body.reason }
  });
  return { success: true, issue };
});

const _id__patch$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__patch$2
}, Symbol.toStringTag, { value: 'Module' }));

const assignments_get = defineEventHandler(() => {
  return assignments.map((a) => {
    var _a, _b, _c;
    const dumpLoc = locations.find((l) => l.location_id === a.dumping_location_id);
    const loadLoc = locations.find((l) => l.location_id === a.loading_location_id);
    return {
      assignment_id: a.assignment_id,
      unit_id: a.unit_id,
      operator_id: a.operator_id,
      shift_id: a.shift_id,
      start_ts: a.start_ts,
      end_ts: a.end_ts,
      status: a.status,
      loading_location_id: a.loading_location_id,
      dumping_location_id: a.dumping_location_id,
      loading_location_name: (_a = loadLoc == null ? void 0 : loadLoc.location_name) != null ? _a : null,
      dumping_location_name: (_b = dumpLoc == null ? void 0 : dumpLoc.location_name) != null ? _b : null,
      notes: (_c = a.notes) != null ? _c : null
    };
  });
});

const assignments_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: assignments_get
}, Symbol.toStringTag, { value: 'Module' }));

const assignments_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.unitId || !body.loadingLoc || !body.dumpingLoc || !body.shiftId) {
    throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
  }
  const unit = units.find((u) => u.unit_id === body.unitId);
  if (!unit) throw createError({ statusCode: 404, statusMessage: "Unit not found" });
  const newAssignment = {
    assignment_id: nextId("ASN"),
    unit_id: body.unitId,
    operator_id: body.operatorId || null,
    shift_id: body.shiftId,
    start_ts: (/* @__PURE__ */ new Date()).toISOString(),
    end_ts: null,
    status: "ASSIGNED",
    loading_location_id: body.loadingLoc,
    dumping_location_id: body.dumpingLoc
    // Note: 'notes' field is not in the store interface currently for Assignment, 
    // strictly following store.ts. If needed, we'd add it to store.ts first.
    // For M3, we will stick to store.ts schema.
  };
  assignments.unshift(newAssignment);
  writeAudit({
    actor: "Dispatcher",
    // Mock user
    action: "CREATE",
    entity_type: "ASSIGNMENT",
    entity_id: newAssignment.assignment_id,
    reason: "New Dispatch",
    payload_before: null,
    payload_after: newAssignment
  });
  return { success: true, assignment: newAssignment };
});

const assignments_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: assignments_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__patch = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const assignment = assignments.find((a) => a.assignment_id === id);
  if (!assignment) {
    throw createError({ statusCode: 404, statusMessage: "Assignment not found" });
  }
  const payloadBefore = { ...assignment };
  if (body.status) assignment.status = body.status;
  if (body.dumpingLoc) assignment.dumping_location_id = body.dumpingLoc;
  if (body.loadingLoc) assignment.loading_location_id = body.loadingLoc;
  if (body.status === "COMPLETED" && !assignment.end_ts) {
    assignment.end_ts = (/* @__PURE__ */ new Date()).toISOString();
  }
  writeAudit({
    actor: "Dispatcher",
    action: "UPDATE",
    entity_type: "ASSIGNMENT",
    entity_id: assignment.assignment_id,
    reason: body.note || "Status/Location Update",
    payload_before: payloadBefore,
    payload_after: assignment
  });
  return { success: true, assignment };
});

const _id__patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__patch
}, Symbol.toStringTag, { value: 'Module' }));

const index_get = defineEventHandler(() => assignments);

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

const fleet_get = defineEventHandler(() => {
  const now = /* @__PURE__ */ new Date();
  const unitRows = units.map((u) => {
    var _a;
    const activeAsn = assignments.find((a) => a.unit_id === u.unit_id && (a.status === "ASSIGNED" || a.status === "IN_PROGRESS"));
    const isStale = !u.is_active && parseInt(u.unit_id.replace(/\D/g, "")) > 18;
    let current_assignment = null;
    if (activeAsn) {
      const dumpLoc = ((_a = locations.find((l) => l.location_id === activeAsn.dumping_location_id)) == null ? void 0 : _a.location_name) || activeAsn.dumping_location_id;
      current_assignment = { dumping_location_name: dumpLoc };
    }
    const data_status = isStale ? "STALE" : u.is_active ? "OK" : "NO_DATA";
    return {
      unit_id: u.unit_id,
      unit_name: u.unit_name,
      unit_type: u.unit_type,
      ownership: u.ownership,
      last_activity: activeAsn ? "HAULING" : u.is_active ? "IDLE" : "STANDBY",
      last_update_ts: activeAsn ? now.toISOString() : new Date(now.getTime() - 1e3 * 60 * (isStale ? 20 : 5)).toISOString(),
      current_assignment,
      data_status
    };
  });
  return unitRows;
});

const fleet_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: fleet_get
}, Symbol.toStringTag, { value: 'Module' }));

const _unitId__get = defineEventHandler((event) => {
  const unitId = getRouterParam(event, "unitId");
  const unit = units.find((u) => u.unit_id === unitId);
  if (!unit) {
    throw createError({ statusCode: 404, statusMessage: "Unit not found" });
  }
  const unitTrips = trips.filter((t) => t.unit_id === unitId).sort((a, b) => new Date(b.dump_end_ts || "").getTime() - new Date(a.dump_end_ts || "").getTime()).slice(0, 5);
  const unitIssues = issues.filter((i) => i.unit_id === unitId && i.status !== "RESOLVED");
  const timeline = [
    { time: (/* @__PURE__ */ new Date()).toISOString(), label: "System Check", status: "OK" },
    ...unitTrips.map((t) => ({
      time: t.dump_end_ts,
      label: `Trip Completed: ${t.tonnage_value}t`,
      status: "COMPLETED"
    }))
  ].slice(0, 5);
  return {
    unit,
    timeline,
    recentTrips: unitTrips,
    openIssues: unitIssues
  };
});

const _unitId__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _unitId__get
}, Symbol.toStringTag, { value: 'Module' }));

const health_get = defineEventHandler(() => {
  return {
    ok: true,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
});

const health_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: health_get
}, Symbol.toStringTag, { value: 'Module' }));

const masterData_get = defineEventHandler(() => ({ units, locations, shifts }));

const masterData_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: masterData_get
}, Symbol.toStringTag, { value: 'Module' }));

const locations_get = defineEventHandler(() => {
  return locations;
});

const locations_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: locations_get
}, Symbol.toStringTag, { value: 'Module' }));

const shifts_get = defineEventHandler(() => {
  return shifts;
});

const shifts_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: shifts_get
}, Symbol.toStringTag, { value: 'Module' }));

const units_get = defineEventHandler(() => {
  return units;
});

const units_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: units_get
}, Symbol.toStringTag, { value: 'Module' }));

const kpis_get = defineEventHandler(() => {
  const valid = trips.filter((t) => !t.is_duplicate_flagged);
  const confirmed = valid.filter((t) => t.tonnage_status === "CONFIRMED");
  const pending = valid.filter((t) => t.tonnage_status === "PENDING");
  const manual = valid.filter((t) => t.tonnage_status === "MANUAL");
  const totalConfirmed = confirmed.reduce((sum, t) => sum + (t.tonnage_primary || 0), 0);
  const totalManual = manual.reduce((sum, t) => sum + (t.tonnage_primary || 0), 0);
  const totalPending = pending.reduce((sum, t) => sum + (t.tonnage_primary || 0), 0);
  const withTonnageCount = confirmed.length + manual.length;
  const coveragePct = valid.length ? Math.round(withTonnageCount / valid.length * 1e3) / 10 : 0;
  return {
    total_trips: valid.length,
    tonnage: {
      confirmed: totalConfirmed,
      manual: totalManual,
      pending: totalPending,
      total: totalConfirmed + totalManual
      // Pending doesn't count towards 'actual' moved yet usually
    },
    coverage: {
      percent: coveragePct,
      description: `${withTonnageCount} of ${valid.length} trips have tonnage`
    }
  };
});

const kpis_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: kpis_get
}, Symbol.toStringTag, { value: 'Module' }));

const confirmFeed_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.tripId || !body.confirmedTonnage) {
    throw createError({ statusCode: 400, statusMessage: "tripId and confirmedTonnage required" });
  }
  const trip = trips.find((t) => t.trip_id === body.tripId);
  if (!trip) throw createError({ statusCode: 404, statusMessage: "Trip not found" });
  const previousTonnage = trip.tonnage_primary;
  const previousStatus = trip.tonnage_status;
  trip.tonnage_primary = Number(body.confirmedTonnage);
  trip.tonnage_status = "CONFIRMED";
  trip.tonnage_history.push({
    source: "IOT",
    value: Number(body.confirmedTonnage),
    status: "CONFIRMED",
    recorded_at: (/* @__PURE__ */ new Date()).toISOString(),
    actor: "SYSTEM",
    reason: "Weighbridge Confirmation"
  });
  writeAudit({
    actor: "SYSTEM",
    action: "UPDATE",
    entity_type: "TRIP",
    entity_id: trip.trip_id,
    reason: "Confirmed Feed Reconcilliation",
    payload_before: { tonnage: previousTonnage, status: previousStatus },
    payload_after: { tonnage: trip.tonnage_primary, status: trip.tonnage_status }
  });
  return { success: true, tripId: trip.trip_id, status: "CONFIRMED" };
});

const confirmFeed_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: confirmFeed_post
}, Symbol.toStringTag, { value: 'Module' }));

const manual_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.tripId || !body.tonnage || !body.reason || !body.actor) {
    throw createError({ statusCode: 400, statusMessage: "tripId, tonnage, reason, and actor are required" });
  }
  const trip = trips.find((t) => t.trip_id === body.tripId);
  if (!trip) throw createError({ statusCode: 404, statusMessage: "Trip not found" });
  const previousTonnage = trip.tonnage_primary;
  const previousStatus = trip.tonnage_status;
  trip.tonnage_primary = Number(body.tonnage);
  trip.tonnage_status = "MANUAL";
  trip.tonnage_history.push({
    source: "MANUAL_ENTRY",
    value: Number(body.tonnage),
    status: "MANUAL",
    recorded_at: (/* @__PURE__ */ new Date()).toISOString(),
    actor: body.actor,
    reason: body.reason
  });
  writeAudit({
    actor: body.actor,
    action: "UPDATE",
    entity_type: "TRIP",
    entity_id: trip.trip_id,
    reason: body.reason,
    payload_before: { tonnage: previousTonnage, status: previousStatus },
    payload_after: { tonnage: trip.tonnage_primary, status: trip.tonnage_status }
  });
  evaluateAnomalies();
  return { success: true, tripId: trip.trip_id };
});

const manual_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: manual_post
}, Symbol.toStringTag, { value: 'Module' }));

const trips_get = defineEventHandler((event) => {
  const query = getQuery$1(event);
  const statusFilter = query.status;
  const search = (query.search || "").toLowerCase();
  let result = trips.filter((t) => !t.is_duplicate_flagged);
  if (statusFilter && statusFilter !== "ALL") {
    result = result.filter((t) => t.tonnage_status === statusFilter);
  }
  if (search) {
    result = result.filter(
      (t) => t.unit_id.toLowerCase().includes(search) || t.trip_id.toLowerCase().includes(search)
    );
  }
  result.sort((a, b) => new Date(b.dump_end_ts || "").getTime() - new Date(a.dump_end_ts || "").getTime());
  return result.map((t) => {
    const tripIssues = issues.filter((i) => i.trip_id === t.trip_id && i.status !== "RESOLVED");
    return {
      tripId: t.trip_id,
      unitId: t.unit_id,
      route: `${t.loading_location_name} \u2192 ${t.dumping_location_name}`,
      dumpTime: t.dump_end_ts,
      tonnage: t.tonnage_primary,
      status: t.tonnage_status,
      // CONFIRMED, PENDING, MANUAL
      issues: tripIssues.map((i) => i.issue_type)
      // List of issue types
    };
  });
});

const trips_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: trips_get
}, Symbol.toStringTag, { value: 'Module' }));

const _tripId__get = defineEventHandler((event) => {
  const tripId = getRouterParam(event, "tripId");
  const trip = trips.find((t) => t.trip_id === tripId);
  if (!trip) {
    throw createError({ statusCode: 404, statusMessage: "Trip not found" });
  }
  const tripIssues = issues.filter((i) => i.trip_id === tripId);
  const tripAudit = auditLogs.filter((a) => a.entity_id === tripId && a.entity_type === "TRIP").sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return {
    trip,
    history: trip.tonnage_history.sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()),
    audit: tripAudit,
    issues: tripIssues
  };
});

const _tripId__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _tripId__get
}, Symbol.toStringTag, { value: 'Module' }));

const analytics_get = defineEventHandler(() => {
  const confirmed = trips.filter((t) => t.tonnage_status === "CONFIRMED");
  const pending = trips.filter((t) => t.tonnage_status === "PENDING");
  const manual = trips.filter((t) => t.tonnage_status === "MANUAL");
  const tonnageByStatus = {
    confirmed: { count: confirmed.length, total: confirmed.reduce((s, t) => {
      var _a;
      return s + ((_a = t.tonnage_primary) != null ? _a : 0);
    }, 0) },
    pending: { count: pending.length, total: 0 },
    manual: { count: manual.length, total: manual.reduce((s, t) => {
      var _a;
      return s + ((_a = t.tonnage_primary) != null ? _a : 0);
    }, 0) }
  };
  const issuesByType = {};
  issues.forEach((i) => {
    issuesByType[i.issue_type] = (issuesByType[i.issue_type] || 0) + 1;
  });
  const activeUnits = units.filter((u) => u.is_active && u.unit_type === "DUMP_TRUCK").length;
  const totalDT = units.filter((u) => u.unit_type === "DUMP_TRUCK").length;
  const availabilityBreakdown = {
    running: Math.round(activeUnits * 0.65),
    standby: Math.round(activeUnits * 0.15),
    breakdown: Math.round(totalDT * 0.1),
    delay: Math.round(totalDT * 0.1)
  };
  const asnActive = assignments.filter((a) => a.status === "ASSIGNED" || a.status === "IN_PROGRESS").length;
  const asnCompleted = assignments.filter((a) => a.status === "COMPLETED").length;
  return {
    tonnageByStatus,
    issuesByType,
    availabilityBreakdown,
    assignmentSummary: { active: asnActive, completed: asnCompleted, total: assignments.length },
    totalTrips: trips.length,
    totalUnits: units.length
  };
});

const analytics_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: analytics_get
}, Symbol.toStringTag, { value: 'Module' }));

const audit_csv_get = defineEventHandler((event) => {
  let csv = "LogID,Timestamp,Actor,Action,Entity,EntityID,Reason,Changes\n";
  const sorted = [...auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  for (const log of sorted) {
    const line = [
      log.log_id,
      log.timestamp,
      log.actor,
      log.action,
      log.entity_type,
      log.entity_id,
      log.reason || "",
      `Changed ${Object.keys(log.payload_after || {}).join(", ")}`
    ].map((v) => `"${v}"`).join(",");
    csv += line + "\n";
  }
  setResponseHeader(event, "Content-Type", "text/csv");
  setResponseHeader(event, "Content-Disposition", 'attachment; filename="audit_log.csv"');
  return csv;
});

const audit_csv_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: audit_csv_get
}, Symbol.toStringTag, { value: 'Module' }));

function toCsv$4(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => {
      const v = row[h];
      if (v === null || v === void 0) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
  }
  return lines.join("\n");
}
const audit_get = defineEventHandler((event) => {
  const q = getQuery$1(event);
  const action = q.action || "";
  const actor = q.actor || "";
  const entityType = q.entity_type || "";
  let filtered = [...auditLogs];
  if (action) filtered = filtered.filter((l) => l.action === action);
  if (actor) filtered = filtered.filter((l) => l.actor.toLowerCase().includes(actor.toLowerCase()));
  if (entityType) filtered = filtered.filter((l) => l.entity_type.toLowerCase().includes(entityType.toLowerCase()));
  const byAction = {};
  filtered.forEach((l) => {
    byAction[l.action] = (byAction[l.action] || 0) + 1;
  });
  const logsByAction = Object.entries(byAction).sort((a, b) => b[1] - a[1]).map(([action2, count]) => ({ action: action2, count }));
  const byEntity = {};
  filtered.forEach((l) => {
    byEntity[l.entity_type] = (byEntity[l.entity_type] || 0) + 1;
  });
  const logsByEntity = Object.entries(byEntity).sort((a, b) => b[1] - a[1]).map(([entity_type, count]) => ({ entity_type, count }));
  const byActor = {};
  filtered.forEach((l) => {
    byActor[l.actor] = (byActor[l.actor] || 0) + 1;
  });
  const logsByActor = Object.entries(byActor).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([actor2, count]) => ({ actor: actor2, count }));
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const rows = sorted.map((l) => ({
    log_id: l.log_id,
    timestamp: l.timestamp,
    actor: l.actor,
    action: l.action,
    entity_type: l.entity_type,
    entity_id: l.entity_id,
    reason: l.reason || ""
  }));
  if (q.export === "csv") {
    const parts = [action, actor, entityType].filter(Boolean).join("_") || "all";
    return {
      csv: toCsv$4(rows),
      filename: `audit_log_${parts}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`
    };
  }
  return {
    metrics: {
      totalLogs: filtered.length,
      creates: filtered.filter((l) => l.action === "CREATE").length,
      updates: filtered.filter((l) => l.action === "UPDATE").length,
      deletes: filtered.filter((l) => l.action === "DELETE").length,
      transitions: filtered.filter((l) => l.action === "TRANSITION").length
    },
    charts: { logsByAction, logsByEntity, logsByActor },
    rows
  };
});

const audit_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: audit_get
}, Symbol.toStringTag, { value: 'Module' }));

const availability_csv_get = defineEventHandler((event) => {
  let csv = "UnitID,CurrentStatus,MetricsPA (Approx),MetricsUA (Approx)\n";
  const totalHours = 12;
  for (const u of units) {
    let running = 0;
    let breakdown = 0;
    const activeAsn = assignments.find((a) => a.unit_id === u.unit_id && a.status === "IN_PROGRESS");
    if (!u.is_active) {
      breakdown = totalHours;
    } else if (activeAsn) {
      running = 10;
    }
    const available = totalHours - breakdown;
    const pa = available / totalHours * 100;
    const ua = available > 0 ? running / available * 100 : 0;
    const line = [
      u.unit_id,
      u.is_active ? "Active" : "Breakdown",
      Math.round(pa * 10) / 10 + "%",
      Math.round(ua * 10) / 10 + "%"
    ].map((v) => `"${v}"`).join(",");
    csv += line + "\n";
  }
  setResponseHeader(event, "Content-Type", "text/csv");
  setResponseHeader(event, "Content-Disposition", 'attachment; filename="availability_report.csv"');
  return csv;
});

const availability_csv_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: availability_csv_get
}, Symbol.toStringTag, { value: 'Module' }));

function toCsv$3(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => {
      const v = row[h];
      if (v === null || v === void 0) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
  }
  return lines.join("\n");
}
const availability_get = defineEventHandler((event) => {
  const q = getQuery$1(event);
  const unitType = q.unit_type || "";
  const ownership = q.ownership || "";
  const totalHours = 12;
  let filtered = [...units];
  if (unitType) filtered = filtered.filter((u) => u.unit_type === unitType);
  if (ownership) filtered = filtered.filter((u) => u.ownership === ownership);
  const rows = filtered.map((u) => {
    let running = 0, standby = 0, breakdown = 0, delay = 0;
    const activeAsn = assignments.find((a) => a.unit_id === u.unit_id && (a.status === "IN_PROGRESS" || a.status === "ASSIGNED"));
    if (!u.is_active) {
      breakdown = totalHours;
    } else if (activeAsn) {
      running = 9 + Math.random() * 2;
      standby = 1 + Math.random();
      delay = Math.max(0, totalHours - running - standby - breakdown);
    } else {
      standby = totalHours * 0.7;
      delay = totalHours * 0.3;
    }
    const available = totalHours - breakdown;
    const pa = Math.round(available / totalHours * 100 * 10) / 10;
    const ua = available > 0 ? Math.round(running / available * 100 * 10) / 10 : 0;
    return {
      unit_id: u.unit_id,
      unit_type: u.unit_type,
      ownership: u.ownership,
      status: u.is_active ? activeAsn ? "RUNNING" : "STANDBY" : "BREAKDOWN",
      running_hours: Math.round(running * 10) / 10,
      standby_hours: Math.round(standby * 10) / 10,
      breakdown_hours: Math.round(breakdown * 10) / 10,
      delay_hours: Math.round(delay * 10) / 10,
      pa_pct: pa,
      ua_pct: ua
    };
  });
  const activeRows = rows.filter((r) => r.status !== "BREAKDOWN");
  const breakdownRows = rows.filter((r) => r.status === "BREAKDOWN");
  const runningRows = rows.filter((r) => r.status === "RUNNING");
  const avgPA = rows.length ? Math.round(rows.reduce((s, r) => s + r.pa_pct, 0) / rows.length * 10) / 10 : 0;
  const avgUA = rows.length ? Math.round(rows.reduce((s, r) => s + r.ua_pct, 0) / rows.length * 10) / 10 : 0;
  const paBuckets = [
    { label: "\u226595%", count: rows.filter((r) => r.pa_pct >= 95).length },
    { label: "85\u201394%", count: rows.filter((r) => r.pa_pct >= 85 && r.pa_pct < 95).length },
    { label: "70\u201384%", count: rows.filter((r) => r.pa_pct >= 70 && r.pa_pct < 85).length },
    { label: "<70%", count: rows.filter((r) => r.pa_pct < 70).length }
  ];
  const statusBreakdown = [
    { label: "Running", count: runningRows.length },
    { label: "Standby", count: activeRows.length - runningRows.length },
    { label: "Breakdown", count: breakdownRows.length }
  ];
  const byType = {};
  rows.forEach((r) => {
    if (!byType[r.unit_type]) byType[r.unit_type] = { sum: 0, count: 0 };
    byType[r.unit_type].sum += r.pa_pct;
    byType[r.unit_type].count++;
  });
  const paByUnitType = Object.entries(byType).map(([type, d]) => ({
    unit_type: type,
    avg_pa: Math.round(d.sum / d.count * 10) / 10
  }));
  if (q.export === "csv") {
    const parts = [unitType, ownership].filter(Boolean).join("_") || "all";
    return {
      csv: toCsv$3(rows),
      filename: `availability_report_${parts}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`
    };
  }
  return {
    metrics: {
      totalUnits: rows.length,
      activeUnits: activeRows.length,
      breakdownUnits: breakdownRows.length,
      runningUnits: runningRows.length,
      avgPA,
      avgUA
    },
    charts: { paBuckets, statusBreakdown, paByUnitType },
    rows
  };
});

const availability_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: availability_get
}, Symbol.toStringTag, { value: 'Module' }));

function toCsv$2(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => {
      const v = row[h];
      if (v === null || v === void 0) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
  }
  return lines.join("\n");
}
const dataQuality_get = defineEventHandler((event) => {
  const q = getQuery$1(event);
  const severity = q.severity || "";
  const status = q.status || "";
  const unitId = q.unit_id || "";
  let filtered = [...issues];
  if (severity) filtered = filtered.filter((i) => i.severity === severity);
  if (status) filtered = filtered.filter((i) => i.status === status);
  if (unitId) filtered = filtered.filter((i) => i.unit_id.toLowerCase().includes(unitId.toLowerCase()));
  const open = filtered.filter((i) => i.status === "OPEN");
  const inReview = filtered.filter((i) => i.status === "IN_REVIEW");
  const resolved = filtered.filter((i) => i.status === "RESOLVED");
  const critical = filtered.filter((i) => i.severity === "CRITICAL");
  const high = filtered.filter((i) => i.severity === "HIGH");
  const byType = {};
  filtered.forEach((i) => {
    byType[i.issue_type] = (byType[i.issue_type] || 0) + 1;
  });
  const issuesByType = Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([type, count]) => ({ type, count }));
  const bySeverity = [
    { label: "CRITICAL", count: critical.length },
    { label: "HIGH", count: high.length },
    { label: "MEDIUM", count: filtered.filter((i) => i.severity === "MEDIUM").length },
    { label: "LOW", count: filtered.filter((i) => i.severity === "LOW").length }
  ];
  const byStatus = [
    { label: "OPEN", count: open.length },
    { label: "IN_REVIEW", count: inReview.length },
    { label: "RESOLVED", count: resolved.length }
  ];
  const rows = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((i) => ({
    issue_id: i.issue_id,
    issue_type: i.issue_type,
    severity: i.severity,
    status: i.status,
    unit_id: i.unit_id,
    detail: i.detail,
    rule_threshold: i.rule_threshold,
    created_at: i.created_at,
    resolved_at: i.resolved_at || "",
    resolved_by: i.resolved_by || ""
  }));
  if (q.export === "csv") {
    const parts = [severity, status].filter(Boolean).join("_") || "all";
    return {
      csv: toCsv$2(rows),
      filename: `data_quality_report_${parts}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`
    };
  }
  return {
    metrics: {
      totalIssues: filtered.length,
      openIssues: open.length,
      inReview: inReview.length,
      resolved: resolved.length,
      critical: critical.length,
      high: high.length
    },
    charts: { issuesByType, bySeverity, byStatus },
    rows
  };
});

const dataQuality_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dataQuality_get
}, Symbol.toStringTag, { value: 'Module' }));

function toCsv$1(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => {
      const v = row[h];
      if (v === null || v === void 0) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
  }
  return lines.join("\n");
}
const export_get = defineEventHandler((event) => {
  var _a;
  const query = getQuery$1(event);
  const type = (_a = query.type) != null ? _a : "trips";
  let data;
  switch (type) {
    case "trips":
      data = trips;
      break;
    case "issues":
      data = issues;
      break;
    case "audit":
      data = auditLogs;
      break;
    default:
      data = trips;
  }
  return toCsv$1(data);
});

const export_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: export_get
}, Symbol.toStringTag, { value: 'Module' }));

const issues_csv_get = defineEventHandler((event) => {
  let csv = "IssueID,Type,Severity,Status,Detail,LinkedEntity,Created,ResolvedBy\n";
  const sorted = [...issues].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  for (const i of sorted) {
    const line = [
      i.issue_id,
      i.issue_type,
      i.severity,
      i.status,
      i.detail,
      `${i.linked_entity_type}:${i.linked_entity_id}`,
      i.created_at,
      i.resolved_by || ""
    ].map((v) => `"${v}"`).join(",");
    csv += line + "\n";
  }
  setResponseHeader(event, "Content-Type", "text/csv");
  setResponseHeader(event, "Content-Disposition", 'attachment; filename="issues_report.csv"');
  return csv;
});

const issues_csv_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: issues_csv_get
}, Symbol.toStringTag, { value: 'Module' }));

const production_csv_get = defineEventHandler((event) => {
  let csv = "TripID,Unit,Loading,Dumping,Departure,Arrival,Tonnage,Status,Source\n";
  const sorted = [...trips].sort((a, b) => new Date(b.dump_end_ts || "").getTime() - new Date(a.dump_end_ts || "").getTime());
  for (const t of sorted) {
    const line = [
      t.trip_id,
      t.unit_id,
      t.loading_location_name,
      t.dumping_location_name,
      t.depart_load_ts || "",
      t.arrive_dump_ts || "",
      t.tonnage_primary || 0,
      t.tonnage_status,
      t.tonnage_status === "MANUAL" ? "Manual Entry" : "IoT"
    ].map((v) => `"${v}"`).join(",");
    csv += line + "\n";
  }
  setResponseHeader(event, "Content-Type", "text/csv");
  setResponseHeader(event, "Content-Disposition", 'attachment; filename="production_report.csv"');
  return csv;
});

const production_csv_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: production_csv_get
}, Symbol.toStringTag, { value: 'Module' }));

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => {
      const v = row[h];
      if (v === null || v === void 0) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
  }
  return lines.join("\n");
}
const production_get = defineEventHandler((event) => {
  const q = getQuery$1(event);
  const shift = q.shift || "";
  const unitType = q.unit_type || "";
  const ownership = q.ownership || "";
  const location = q.location || "";
  let filtered = [...trips];
  if (unitType) {
    const validUnits = new Set(units.filter((u) => u.unit_type === unitType).map((u) => u.unit_id));
    filtered = filtered.filter((t) => validUnits.has(t.unit_id));
  }
  if (ownership) {
    const validUnits = new Set(units.filter((u) => u.ownership === ownership).map((u) => u.unit_id));
    filtered = filtered.filter((t) => validUnits.has(t.unit_id));
  }
  if (location) {
    filtered = filtered.filter(
      (t) => {
        var _a, _b;
        return ((_a = t.loading_location_name) == null ? void 0 : _a.toLowerCase().includes(location.toLowerCase())) || ((_b = t.dumping_location_name) == null ? void 0 : _b.toLowerCase().includes(location.toLowerCase()));
      }
    );
  }
  const confirmed = filtered.filter((t) => t.tonnage_status === "CONFIRMED");
  const pending = filtered.filter((t) => t.tonnage_status === "PENDING");
  const manual = filtered.filter((t) => t.tonnage_status === "MANUAL");
  const confirmedTonnage = confirmed.reduce((s, t) => {
    var _a;
    return s + ((_a = t.tonnage_primary) != null ? _a : 0);
  }, 0);
  const manualTonnage = manual.reduce((s, t) => {
    var _a;
    return s + ((_a = t.tonnage_primary) != null ? _a : 0);
  }, 0);
  const totalTonnage = confirmedTonnage + manualTonnage;
  const tonnageByStatus = [
    { label: "CONFIRMED", count: confirmed.length, tonnage: Math.round(confirmedTonnage) },
    { label: "PENDING", count: pending.length, tonnage: 0 },
    { label: "MANUAL", count: manual.length, tonnage: Math.round(manualTonnage) }
  ];
  const perUnit = {};
  filtered.forEach((t) => {
    perUnit[t.unit_id] = (perUnit[t.unit_id] || 0) + 1;
  });
  const tripsPerUnit = Object.entries(perUnit).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([unit_id, count]) => ({ unit_id, count }));
  const perLocation = {};
  filtered.forEach((t) => {
    var _a;
    if (t.loading_location_name) {
      perLocation[t.loading_location_name] = (perLocation[t.loading_location_name] || 0) + ((_a = t.tonnage_primary) != null ? _a : 0);
    }
  });
  const tonnageByLocation = Object.entries(perLocation).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([location2, tonnage]) => ({ location: location2, tonnage: Math.round(tonnage) }));
  const rows = filtered.sort((a, b) => new Date(b.dump_end_ts || "").getTime() - new Date(a.dump_end_ts || "").getTime()).map((t) => {
    var _a;
    return {
      trip_id: t.trip_id,
      unit_id: t.unit_id,
      loading_location: t.loading_location_name,
      dumping_location: t.dumping_location_name,
      departure: t.depart_load_ts || "",
      arrival: t.arrive_dump_ts || "",
      tonnage: (_a = t.tonnage_primary) != null ? _a : "",
      tonnage_status: t.tonnage_status,
      source: t.tonnage_status === "MANUAL" ? "Manual Entry" : "IoT"
    };
  });
  if (q.export === "csv") {
    const parts = [shift, unitType, ownership].filter(Boolean).join("_") || "all";
    return {
      csv: toCsv(rows),
      filename: `production_report_${parts}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`
    };
  }
  return {
    metrics: {
      totalTrips: filtered.length,
      confirmedTrips: confirmed.length,
      pendingTrips: pending.length,
      manualTrips: manual.length,
      totalTonnage: Math.round(totalTonnage),
      confirmedTonnage: Math.round(confirmedTonnage),
      manualTonnage: Math.round(manualTonnage)
    },
    charts: { tonnageByStatus, tripsPerUnit, tonnageByLocation },
    rows
  };
});

const production_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: production_get
}, Symbol.toStringTag, { value: 'Module' }));

const tick_post = defineEventHandler(() => {
  return simulateTick();
});

const tick_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: tick_post
}, Symbol.toStringTag, { value: 'Module' }));

function ts(daysAgo, hoursAgo = 0) {
  const d = /* @__PURE__ */ new Date("2026-02-19T20:20:00+07:00");
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}
const users = [
  { id: "USR-001", name: "Andi Wirawan", email: "andi.wirawan@ptba.co.id", role: "Admin", status: "Active", last_seen: ts(0, 0) },
  { id: "USR-002", name: "Siti Rahayu", email: "siti.rahayu@ptba.co.id", role: "Dispatcher", status: "Active", last_seen: ts(0, 1) },
  { id: "USR-003", name: "Budi Santoso", email: "budi.santoso@ptba.co.id", role: "Dispatcher", status: "Active", last_seen: ts(0, 2) },
  { id: "USR-004", name: "Dewi Kurniawati", email: "dewi.kurniawati@ptba.co.id", role: "Checker", status: "Active", last_seen: ts(0, 3) },
  { id: "USR-005", name: "Eko Prasetyo", email: "eko.prasetyo@ptba.co.id", role: "Checker", status: "Active", last_seen: ts(0, 4) },
  { id: "USR-006", name: "Fitri Handayani", email: "fitri.handayani@ptba.co.id", role: "Checker", status: "Active", last_seen: ts(1, 0) },
  { id: "USR-007", name: "Gunawan Susilo", email: "gunawan.susilo@ptba.co.id", role: "Dispatcher", status: "Active", last_seen: ts(1, 2) },
  { id: "USR-008", name: "Hesti Wulandari", email: "hesti.wulandari@ptba.co.id", role: "Dispatcher", status: "Active", last_seen: ts(1, 5) },
  { id: "USR-009", name: "Irwan Maulana", email: "irwan.maulana@ptba.co.id", role: "Checker", status: "Inactive", last_seen: ts(3, 0) },
  { id: "USR-010", name: "Joko Widodo", email: "joko.widodo@ptba.co.id", role: "Dispatcher", status: "Active", last_seen: ts(0, 6) },
  { id: "USR-011", name: "Kartika Sari", email: "kartika.sari@ptba.co.id", role: "Checker", status: "Active", last_seen: ts(2, 0) },
  { id: "USR-012", name: "Lukman Hakim", email: "lukman.hakim@ptba.co.id", role: "Dispatcher", status: "Inactive", last_seen: ts(7, 0) },
  { id: "USR-013", name: "Maya Indriati", email: "maya.indriati@ptba.co.id", role: "Checker", status: "Active", last_seen: ts(0, 8) },
  { id: "USR-014", name: "Nurul Hidayah", email: "nurul.hidayah@ptba.co.id", role: "Admin", status: "Active", last_seen: ts(1, 1) },
  { id: "USR-015", name: "Okta Permana", email: "okta.permana@ptba.co.id", role: "Dispatcher", status: "Active", last_seen: ts(0, 9) },
  { id: "USR-016", name: "Putri Ayu", email: "putri.ayu@ptba.co.id", role: "Checker", status: "Inactive", last_seen: ts(14, 0) },
  { id: "USR-017", name: "Rizki Fauzan", email: "rizki.fauzan@ptba.co.id", role: "Dispatcher", status: "Active", last_seen: ts(0, 10) },
  { id: "USR-018", name: "Sri Wahyuni", email: "sri.wahyuni@ptba.co.id", role: "Checker", status: "Active", last_seen: ts(2, 3) },
  { id: "USR-019", name: "Teguh Prasetya", email: "teguh.prasetya@ptba.co.id", role: "Dispatcher", status: "Active", last_seen: ts(0, 11) },
  { id: "USR-020", name: "Umar Faruq", email: "umar.faruq@ptba.co.id", role: "Checker", status: "Inactive", last_seen: ts(30, 0) },
  { id: "USR-021", name: "Vina Marlina", email: "vina.marlina@ptba.co.id", role: "Dispatcher", status: "Active", last_seen: ts(3, 2) },
  { id: "USR-022", name: "Wahyu Setiawan", email: "wahyu.setiawan@ptba.co.id", role: "Admin", status: "Active", last_seen: ts(0, 0) },
  { id: "USR-023", name: "Xenia Putri", email: "xenia.putri@ptba.co.id", role: "Checker", status: "Active", last_seen: ts(4, 0) },
  { id: "USR-024", name: "Yusuf Ananta", email: "yusuf.ananta@ptba.co.id", role: "Dispatcher", status: "Inactive", last_seen: ts(21, 0) },
  { id: "USR-025", name: "Zahra Nurfitri", email: "zahra.nurfitri@ptba.co.id", role: "Checker", status: "Active", last_seen: ts(1, 3) }
];
const users_get = defineEventHandler(() => {
  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const inactive = users.filter((u) => u.status === "Inactive").length;
  const byRole = {
    Admin: users.filter((u) => u.role === "Admin").length,
    Dispatcher: users.filter((u) => u.role === "Dispatcher").length,
    Checker: users.filter((u) => u.role === "Checker").length
  };
  return { summary: { total, active, inactive, byRole }, users };
});

const users_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: users_get
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
	return {
		body: stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"]) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const contents = opts.data ? stringify(opts.data, opts.ssrContext["~payloadReducers"]) : "";
	const payload = {
		"type": "application/json",
		"innerHTML": contents,
		"data-nuxt-data": appId,
		"data-ssr": !(opts.ssrContext.noSSR)
	};
	{
		payload.id = "__NUXT_DATA__";
	}
	if (opts.src) {
		payload["data-src"] = opts.src;
	}
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, ...initial } = ssrContext.payload;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload: {
			data,
			prerenderedAt
		}
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":true};

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const renderer = defineRenderHandler(async (event) => {
	const nitroApp = useNitroApp();
	// Whether we're rendering an error page
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) {
		throw createError({
			status: 404,
			statusText: "Page Not Found: /__nuxt_error",
			message: "Page Not Found: /__nuxt_error"
		});
	}
	// Initialize ssr context
	const ssrContext = createSSRContext(event);
	// needed for hash hydration plugin to work
	const headEntryOptions = { mode: "server" };
	ssrContext.head.push(appHead, headEntryOptions);
	if (ssrError) {
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		const status = ssrError.status || ssrError.statusCode;
		if (status) {
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			ssrError.status = ssrError.statusCode = Number.parseInt(status);
		}
		if (typeof ssrError.data === "string") {
			try {
				ssrError.data = destr(ssrError.data);
			} catch {}
		}
		setSSRError(ssrContext, ssrError);
	}
	// Get route options (for `ssr: false`, `isr`, `cache` and `noScripts`)
	const routeOptions = getRouteRules(event);
	// Whether we are prerendering route or using ISR/SWR caching
	const _PAYLOAD_EXTRACTION = !ssrContext.noSSR && ((routeOptions.isr || routeOptions.cache));
	const isRenderingPayload = (_PAYLOAD_EXTRACTION || routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
		ssrContext.url = url;
		event._path = event.node.req.url = url;
	}
	if (routeOptions.ssr === false) {
		ssrContext.noSSR = true;
	}
	const payloadURL = _PAYLOAD_EXTRACTION ? joinURL(ssrContext.runtimeConfig.app.cdnURL || ssrContext.runtimeConfig.app.baseURL, ssrContext.url.replace(/\?.*$/, ""), PAYLOAD_FILENAME) + "?" + ssrContext.runtimeConfig.app.buildId : undefined;
	// Render app
	const renderer = await getRenderer(ssrContext);
	const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
		// We use error to bypass full render if we have an early response we can make
		// TODO: remove _renderResponse in nuxt v5
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") {
			return {};
		}
		// Use explicitly thrown error in preference to subsequent rendering errors
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	// Render inline styles
	// TODO: remove _renderResponse in nuxt v5
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) {
		// TODO: remove _renderResponse in nuxt v5
		return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	}
	// Handle errors
	if (ssrContext.payload?.error && !ssrError) {
		throw ssrContext.payload.error;
	}
	// Directly render payload routes
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	// Setup head
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	// 1. Preload payloads and app manifest
	if (_PAYLOAD_EXTRACTION && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			crossorigin: "anonymous",
			href: payloadURL
		} ] }, headEntryOptions);
	}
	if (ssrContext["~preloadManifest"] && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			fetchpriority: "low",
			crossorigin: "anonymous",
			href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`)
		}] }, {
			...headEntryOptions,
			tagPriority: "low"
		});
	}
	// 2. Styles
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	const link = [];
	for (const resource of Object.values(styles)) {
		// Do not add links to resources that are inlined (vite v5+)
		if ("inline" in getQuery(resource.file)) {
			continue;
		}
		// Add CSS links in <head> for CSS files
		// - in production
		// - in dev mode when not rendering an island
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) {
		ssrContext.head.push({ link }, headEntryOptions);
	}
	if (!NO_SCRIPTS) {
		// 4. Resource Hints
		// Remove lazy hydrated modules from ssrContext.modules so they don't get preloaded
		// (CSS links are already added above, this only affects JS preloads)
		if (ssrContext["~lazyHydratedModules"]) {
			for (const id of ssrContext["~lazyHydratedModules"]) {
				ssrContext.modules?.delete(id);
			}
		}
		ssrContext.head.push({ link: getPreloadLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		ssrContext.head.push({ link: getPrefetchLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		// 5. Payloads
		ssrContext.head.push({ script: _PAYLOAD_EXTRACTION ? renderPayloadJsonScript({
			ssrContext,
			data: splitPayload(ssrContext).initial,
			src: payloadURL
		})  : renderPayloadJsonScript({
			ssrContext,
			data: ssrContext.payload
		})  }, {
			...headEntryOptions,
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	// 6. Scripts
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			tagPosition,
			crossorigin: ""
		})) }, headEntryOptions);
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	// Create render context
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	// Allow hooking into the rendered result
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	// Construct HTML response
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
});
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) {
			result.push(chunk);
		}
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) {
		return "";
	}
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return "<!DOCTYPE html>" + `<html${joinAttrs(html.htmlAttrs)}>` + `<head>${joinTags(html.head)}</head>` + `<body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>` + "</html>";
}

const renderer$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: renderer
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
