"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Editor: () => Editor_default,
  LiveContext: () => LiveContext_default,
  LiveEditor: () => LiveEditor,
  LiveError: () => LiveError,
  LivePreview: () => LivePreview_default,
  LiveProvider: () => LiveProvider_default,
  generateElement: () => generateElement,
  renderElementAsync: () => renderElementAsync,
  withLive: () => withLive
});
module.exports = __toCommonJS(src_exports);

// src/components/Editor/index.tsx
var import_prism_react_renderer = require("prism-react-renderer");
var import_react2 = require("react");

// src/components/Editor/useEditable.ts
var import_react = require("react");
var observerSettings = {
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true
};
var SHADOW_HOST_ID = "";
var getSelection = () => {
  if (!SHADOW_HOST_ID)
    return window.getSelection();
  const shadowHost = document.querySelector(`#${SHADOW_HOST_ID}`);
  const shadowRoot = shadowHost == null ? void 0 : shadowHost.shadowRoot;
  return shadowRoot == null ? void 0 : shadowRoot.getSelection();
};
var getCurrentRange = () => getSelection().getRangeAt(0);
var setCurrentRange = (range) => {
  const selection = getSelection();
  selection.empty();
  selection.addRange(range);
};
var isUndoRedoKey = (event) => (event.metaKey || event.ctrlKey) && !event.altKey && event.code === "KeyZ";
var toString = (element) => {
  const queue = [element.firstChild];
  let content = "";
  let node;
  while (node = queue.pop()) {
    if (node.nodeType === Node.TEXT_NODE) {
      content += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") {
      content += "\n";
    }
    if (node.nextSibling)
      queue.push(node.nextSibling);
    if (node.firstChild)
      queue.push(node.firstChild);
  }
  if (content[content.length - 1] !== "\n")
    content += "\n";
  return content;
};
var setStart = (range, node, offset) => {
  if (offset < node.textContent.length) {
    range.setStart(node, offset);
  } else {
    range.setStartAfter(node);
  }
};
var setEnd = (range, node, offset) => {
  if (offset < node.textContent.length) {
    range.setEnd(node, offset);
  } else {
    range.setEndAfter(node);
  }
};
var getPosition = (element) => {
  const range = getCurrentRange();
  const extent = !range.collapsed ? range.toString().length : 0;
  const untilRange = document.createRange();
  untilRange.setStart(element, 0);
  untilRange.setEnd(range.startContainer, range.startOffset);
  let content = untilRange.toString();
  const position = content.length;
  const lines = content.split("\n");
  const line = lines.length - 1;
  content = lines[line];
  return { position, extent, content, line };
};
var makeRange = (element, start, end) => {
  if (start <= 0)
    start = 0;
  if (!end || end < 0)
    end = start;
  const range = document.createRange();
  const queue = [element.firstChild];
  let current = 0;
  let node;
  let position = start;
  while (node = queue[queue.length - 1]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const length = node.textContent.length;
      if (current + length >= position) {
        const offset = position - current;
        if (position === start) {
          setStart(range, node, offset);
          if (end !== start) {
            position = end;
            continue;
          } else {
            break;
          }
        } else {
          setEnd(range, node, offset);
          break;
        }
      }
      current += node.textContent.length;
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") {
      if (current + 1 >= position) {
        if (position === start) {
          setStart(range, node, 0);
          if (end !== start) {
            position = end;
            continue;
          } else {
            break;
          }
        } else {
          setEnd(range, node, 0);
          break;
        }
      }
      current++;
    }
    queue.pop();
    if (node.nextSibling)
      queue.push(node.nextSibling);
    if (node.firstChild)
      queue.push(node.firstChild);
  }
  return range;
};
var useEditable = (elementRef, onChange, opts, shadowHostId) => {
  if (!opts)
    opts = {};
  SHADOW_HOST_ID = shadowHostId || "";
  const unblock = (0, import_react.useState)([])[1];
  const state = (0, import_react.useState)(() => {
    const state2 = {
      observer: null,
      disconnected: false,
      onChange,
      queue: [],
      history: [],
      historyAt: -1,
      position: null
    };
    if (typeof MutationObserver !== "undefined") {
      state2.observer = new MutationObserver((batch) => {
        state2.queue.push(...batch);
      });
    }
    return state2;
  })[0];
  const edit = (0, import_react.useMemo)(
    () => ({
      update(content) {
        const { current: element } = elementRef;
        if (element) {
          const position = getPosition(element);
          const prevContent = toString(element);
          position.position += content.length - prevContent.length;
          state.position = position;
          state.onChange(content, position);
        }
      },
      insert(append, deleteOffset) {
        const { current: element } = elementRef;
        if (element) {
          let range = getCurrentRange();
          range.deleteContents();
          range.collapse();
          const position = getPosition(element);
          const offset = deleteOffset || 0;
          const start = position.position + (offset < 0 ? offset : 0);
          const end = position.position + (offset > 0 ? offset : 0);
          range = makeRange(element, start, end);
          range.deleteContents();
          if (append)
            range.insertNode(document.createTextNode(append));
          setCurrentRange(makeRange(element, start + append.length));
        }
      },
      move(pos) {
        const { current: element } = elementRef;
        if (element) {
          element.focus();
          let position = 0;
          if (typeof pos === "number") {
            position = pos;
          } else {
            const lines = toString(element).split("\n").slice(0, pos.row);
            if (pos.row)
              position += lines.join("\n").length + 1;
            position += pos.column;
          }
          setCurrentRange(makeRange(element, position));
        }
      },
      getState() {
        const { current: element } = elementRef;
        const text = toString(element);
        const position = getPosition(element);
        return { text, position };
      }
    }),
    []
  );
  if (typeof navigator !== "object")
    return edit;
  (0, import_react.useLayoutEffect)(() => {
    state.onChange = onChange;
    if (!elementRef.current || opts.disabled)
      return;
    state.disconnected = false;
    state.observer.observe(elementRef.current, observerSettings);
    if (state.position) {
      const { position, extent } = state.position;
      setCurrentRange(
        makeRange(elementRef.current, position, position + extent)
      );
    }
    return () => {
      state.observer.disconnect();
    };
  });
  (0, import_react.useLayoutEffect)(() => {
    if (!elementRef.current || opts.disabled) {
      state.history.length = 0;
      state.historyAt = -1;
      return;
    }
    const element = elementRef.current;
    if (state.position) {
      element.focus();
      const { position, extent } = state.position;
      setCurrentRange(makeRange(element, position, position + extent));
    }
    const prevWhiteSpace = element.style.whiteSpace;
    const prevContentEditable = element.contentEditable;
    let hasPlaintextSupport = true;
    try {
      element.contentEditable = "plaintext-only";
    } catch (_error) {
      element.contentEditable = "true";
      hasPlaintextSupport = false;
    }
    if (prevWhiteSpace !== "pre")
      element.style.whiteSpace = "pre-wrap";
    if (opts.indentation) {
      element.style.tabSize = element.style.MozTabSize = "" + opts.indentation;
    }
    const indentPattern = `${" ".repeat(opts.indentation || 0)}`;
    const indentRe = new RegExp(`^(?:${indentPattern})`);
    const blanklineRe = new RegExp(`^(?:${indentPattern})*(${indentPattern})$`);
    let _trackStateTimestamp;
    const trackState = (ignoreTimestamp) => {
      if (!elementRef.current || !state.position)
        return;
      const content = toString(element);
      const position = getPosition(element);
      const timestamp = (/* @__PURE__ */ new Date()).valueOf();
      const lastEntry = state.history[state.historyAt];
      if (!ignoreTimestamp && timestamp - _trackStateTimestamp < 500 || lastEntry && lastEntry[1] === content) {
        _trackStateTimestamp = timestamp;
        return;
      }
      const at = ++state.historyAt;
      state.history[at] = [position, content];
      state.history.splice(at + 1);
      if (at > 500) {
        state.historyAt--;
        state.history.shift();
      }
    };
    const disconnect = () => {
      state.observer.disconnect();
      state.disconnected = true;
    };
    const flushChanges = () => {
      state.queue.push(...state.observer.takeRecords());
      const position = getPosition(element);
      if (state.queue.length) {
        disconnect();
        const content = toString(element);
        state.position = position;
        let mutation;
        let i = 0;
        while (mutation = state.queue.pop()) {
          if (mutation.oldValue !== null)
            mutation.target.textContent = mutation.oldValue;
          for (i = mutation.removedNodes.length - 1; i >= 0; i--)
            mutation.target.insertBefore(
              mutation.removedNodes[i],
              mutation.nextSibling
            );
          for (i = mutation.addedNodes.length - 1; i >= 0; i--)
            if (mutation.addedNodes[i].parentNode)
              mutation.target.removeChild(mutation.addedNodes[i]);
        }
        state.onChange(content, position);
      }
    };
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.target !== element) {
        return;
      } else if (state.disconnected) {
        event.preventDefault();
        return unblock([]);
      }
      if (isUndoRedoKey(event)) {
        event.preventDefault();
        let history;
        if (!event.shiftKey) {
          const at = --state.historyAt;
          history = state.history[at];
          if (!history)
            state.historyAt = 0;
        } else {
          const at = ++state.historyAt;
          history = state.history[at];
          if (!history)
            state.historyAt = state.history.length - 1;
        }
        if (history) {
          disconnect();
          state.position = history[0];
          state.onChange(history[1], history[0]);
        }
        return;
      } else {
        trackState();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const position = getPosition(element);
        const match = /\S/g.exec(position.content);
        const index = match ? match.index : position.content.length;
        const text = "\n" + position.content.slice(0, index);
        edit.insert(text);
      } else if ((!hasPlaintextSupport || opts.indentation) && event.key === "Backspace") {
        event.preventDefault();
        const range = getCurrentRange();
        if (!range.collapsed) {
          edit.insert("", 0);
        } else {
          const position = getPosition(element);
          const match = blanklineRe.exec(position.content);
          edit.insert("", match ? -match[1].length : -1);
        }
      } else if (opts.indentation && event.key === "Tab") {
        event.preventDefault();
        const position = getPosition(element);
        const start = position.position - position.content.length;
        const content = toString(element);
        const newContent = event.shiftKey ? content.slice(0, start) + position.content.replace(indentRe, "") + content.slice(start + position.content.length) : content.slice(0, start) + (opts.indentation ? " ".repeat(opts.indentation) : "	") + content.slice(start);
        edit.update(newContent);
      }
      if (event.repeat)
        flushChanges();
    };
    const onKeyUp = (event) => {
      if (event.defaultPrevented || event.isComposing)
        return;
      if (!isUndoRedoKey(event))
        trackState();
      flushChanges();
      element.focus();
    };
    const onSelect = (event) => {
      state.position = getSelection().rangeCount && event.target === element ? getPosition(element) : null;
    };
    const onPaste = (event) => {
      event.preventDefault();
      trackState(true);
      edit.insert(event.clipboardData.getData("text/plain"));
      trackState(true);
      flushChanges();
    };
    document.addEventListener("selectstart", onSelect);
    window.addEventListener("keydown", onKeyDown);
    element.addEventListener("paste", onPaste);
    element.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("selectstart", onSelect);
      window.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("paste", onPaste);
      element.removeEventListener("keyup", onKeyUp);
      element.style.whiteSpace = prevWhiteSpace;
      element.contentEditable = prevContentEditable;
    };
  }, [elementRef.current, opts.disabled, opts.indentation]);
  return edit;
};

// src/components/Editor/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var CodeEditor = (props) => {
  const { tabMode = "indentation" } = props;
  const editorRef = (0, import_react2.useRef)(null);
  const [code, setCode] = (0, import_react2.useState)(props.code || "");
  const { theme } = props;
  (0, import_react2.useEffect)(() => {
    setCode(props.code);
  }, [props.code]);
  useEditable(editorRef, (text) => setCode(text.slice(0, -1)), {
    disabled: props.disabled,
    indentation: tabMode === "indentation" ? 2 : void 0
  }, props.id);
  (0, import_react2.useEffect)(() => {
    if (props.onChange) {
      props.onChange(code);
    }
  }, [code]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: props.className, style: props.style, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_prism_react_renderer.Highlight,
    {
      code,
      theme: props.theme || import_prism_react_renderer.themes.nightOwl,
      language: props.language,
      children: ({
        className: _className,
        tokens,
        getLineProps,
        getTokenProps,
        style: _style
      }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "pre",
        {
          className: _className,
          style: __spreadValues(__spreadValues({
            margin: 0,
            outline: "none",
            padding: 10,
            fontFamily: "inherit"
          }, theme && typeof theme.plain === "object" ? theme.plain : {}), _style),
          ref: editorRef,
          spellCheck: "false",
          children: tokens.map((line, lineIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", __spreadProps(__spreadValues({}, getLineProps({ line })), { children: [
            line.filter((token) => !token.empty).map((token, tokenIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "span",
              __spreadValues({}, getTokenProps({ token })),
              `token-${tokenIndex}`
            )),
            "\n"
          ] }), `line-${lineIndex}`))
        }
      )
    }
  ) });
};
var Editor_default = CodeEditor;

// src/components/Live/LiveProvider.tsx
var import_react6 = require("react");

// src/components/Live/LiveContext.ts
var import_react3 = require("react");
var LiveContext = (0, import_react3.createContext)({});
var LiveContext_default = LiveContext;

// src/utils/transpile/index.ts
var import_react5 = __toESM(require("react"));

// src/utils/transpile/transform.ts
var import_sucrase = require("sucrase");
var defaultTransforms = ["jsx", "imports"];
function transform(opts = {}) {
  const transforms = Array.isArray(opts.transforms) ? opts.transforms.filter(Boolean) : defaultTransforms;
  return (code) => (0, import_sucrase.transform)(code, { transforms }).code;
}

// src/utils/transpile/errorBoundary.tsx
var import_react4 = __toESM(require("react"));
var import_jsx_runtime2 = require("react/jsx-runtime");
var errorBoundary = (Element, errorCallback) => {
  return class ErrorBoundary extends import_react4.Component {
    componentDidCatch(error) {
      errorCallback(error);
    }
    render() {
      return typeof Element === "function" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Element, {}) : import_react4.default.isValidElement(Element) ? Element : null;
    }
  };
};
var errorBoundary_default = errorBoundary;

// src/utils/transpile/evalCode.ts
var evalCode = (code, scope) => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map((key) => scope[key]);
  return new Function(...scopeKeys, code)(...scopeValues);
};
var evalCode_default = evalCode;

// src/utils/transpile/compose.ts
function compose(...functions) {
  return functions.reduce(
    (acc, currentFn) => (...args) => acc(currentFn(...args))
  );
}

// src/utils/transpile/index.ts
var jsxConst = 'const _jsxFileName = "";';
var trimCode = (code) => code.trim().replace(/;$/, "");
var spliceJsxConst = (code) => code.replace(jsxConst, "").trim();
var addJsxConst = (code) => jsxConst + code;
var wrapReturn = (code) => `return (${code})`;
var generateElement = ({ code = "", scope = {}, enableTypeScript = true }, errorCallback) => {
  const firstPassTransforms = ["jsx"];
  enableTypeScript && firstPassTransforms.push("typescript");
  const transformed = compose(
    addJsxConst,
    transform({ transforms: ["imports"] }),
    spliceJsxConst,
    trimCode,
    transform({ transforms: firstPassTransforms }),
    wrapReturn,
    trimCode
  )(code);
  return errorBoundary_default(
    evalCode_default(transformed, __spreadValues({ React: import_react5.default }, scope)),
    errorCallback
  );
};
var renderElementAsync = ({ code = "", scope = {}, enableTypeScript = true }, resultCallback, errorCallback) => {
  const render = (element) => {
    if (typeof element === "undefined") {
      errorCallback(new SyntaxError("`render` must be called with valid JSX."));
    } else {
      resultCallback(errorBoundary_default(element, errorCallback));
    }
  };
  if (!/render\s*\(/.test(code)) {
    return errorCallback(
      new SyntaxError("No-Inline evaluations must call `render`.")
    );
  }
  const transforms = ["jsx", "imports"];
  enableTypeScript && transforms.splice(1, 0, "typescript");
  evalCode_default(transform({ transforms })(code), __spreadProps(__spreadValues({ React: import_react5.default }, scope), { render }));
};

// src/components/Live/LiveProvider.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function LiveProvider({
  children,
  code = "",
  language = "tsx",
  theme,
  enableTypeScript = true,
  disabled = false,
  scope,
  transformCode,
  noInline = false
}) {
  const [state, setState] = (0, import_react6.useState)({
    error: void 0,
    element: void 0
  });
  function transpileAsync(newCode) {
    return __async(this, null, function* () {
      const errorCallback = (error) => {
        setState({ error: error.toString(), element: void 0 });
      };
      try {
        const transformResult = transformCode ? transformCode(newCode) : newCode;
        try {
          const transformedCode = yield Promise.resolve(transformResult);
          const renderElement = (element) => setState({ error: void 0, element });
          if (typeof transformedCode !== "string") {
            throw new Error("Code failed to transform");
          }
          const input = {
            code: transformedCode,
            scope,
            enableTypeScript
          };
          if (noInline) {
            setState({ error: void 0, element: null });
            renderElementAsync(input, renderElement, errorCallback);
          } else {
            renderElement(generateElement(input, errorCallback));
          }
        } catch (error) {
          return errorCallback(error);
        }
      } catch (e) {
        errorCallback(e);
        return Promise.resolve();
      }
    });
  }
  const onError = (error) => setState({ error: error.toString() });
  (0, import_react6.useEffect)(() => {
    transpileAsync(code).catch(onError);
  }, [code, scope, noInline, transformCode]);
  const onChange = (newCode) => {
    transpileAsync(newCode).catch(onError);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    LiveContext_default.Provider,
    {
      value: __spreadProps(__spreadValues({}, state), {
        code,
        language,
        theme,
        disabled,
        onError,
        onChange
      }),
      children
    }
  );
}
var LiveProvider_default = LiveProvider;

// src/components/Live/LiveEditor.tsx
var import_react7 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function LiveEditor(props) {
  const { code, language, theme, disabled, onChange } = (0, import_react7.useContext)(LiveContext_default);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    Editor_default,
    __spreadValues({
      theme,
      code,
      language,
      disabled,
      onChange
    }, props)
  );
}

// src/components/Live/LiveError.tsx
var import_react8 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function LiveError(props) {
  const { error } = (0, import_react8.useContext)(LiveContext_default);
  return error ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("pre", __spreadProps(__spreadValues({}, props), { children: error })) : null;
}

// src/components/Live/LivePreview.tsx
var import_react9 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function LivePreview(_a) {
  var _b = _a, { Component: Component2 = "div" } = _b, rest = __objRest(_b, ["Component"]);
  const { element: Element } = (0, import_react9.useContext)(LiveContext_default);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Component2, __spreadProps(__spreadValues({}, rest), { children: Element ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Element, {}) : null }));
}
var LivePreview_default = LivePreview;

// src/hoc/withLive.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function withLive(WrappedComponent) {
  const WithLive = (props) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(LiveContext_default.Consumer, { children: (live) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(WrappedComponent, __spreadValues({ live }, props)) });
  WithLive.displayName = "WithLive";
  return WithLive;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Editor,
  LiveContext,
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
  generateElement,
  renderElementAsync,
  withLive
});
//# sourceMappingURL=index.js.map