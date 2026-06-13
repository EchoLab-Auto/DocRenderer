var Ge = Object.defineProperty;
var Qe = (n, e, t) => e in n ? Ge(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var v = (n, e, t) => Qe(n, typeof e != "symbol" ? e + "" : e, t);
import { defineComponent as Ce, ref as M, computed as Z, watch as ce, nextTick as Ve, onBeforeUnmount as Ue, openBlock as z, createElementBlock as I, normalizeClass as G, createElementVNode as T, createVNode as P, unref as L, withCtx as C, Fragment as ue, renderList as $e, withModifiers as ie, toDisplayString as Q, createCommentVNode as V, Transition as Le, createBlock as le, createTextVNode as ae } from "vue";
import { nodeToTreeData as Fe } from "@prodoc/core";
import { NeumorphismCard as J, NeumorphismBadge as We, useTheme as Ke, NeumorphismLayout as Xe, NeumorphismContainer as Je, NeumorphismTag as Re, NeumorphismDivider as Ye, NeumorphismButton as et, NeumorphismTree as tt, NeumorphismThemeToggle as nt } from "@echolab/ui-frame";
function fe() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var D = fe();
function Pe(n) {
  D = n;
}
var U = { exec: () => null };
function b(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const r = {
    replace: (s, i) => {
      let c = typeof i == "string" ? i : i.source;
      return c = c.replace(A.caret, "$1"), t = t.replace(s, c), r;
    },
    getRegex: () => new RegExp(t, e)
  };
  return r;
}
var A = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}#`),
  htmlBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)`, "i")
}, rt = /^(?:[ \t]*(?:\n|$))+/, st = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, it = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, F = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, lt = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ge = /(?:[*+-]|\d{1,9}[.)])/, Ie = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Be = b(Ie).replace(/bull/g, ge).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), at = b(Ie).replace(/bull/g, ge).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), ke = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, ot = /^[^\n]+/, me = /(?!\s*\])(?:\\.|[^\[\]\\])+/, ct = b(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", me).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ut = b(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, ge).getRegex(), ne = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", be = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, pt = b(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", be).replace("tag", ne).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ee = b(ke).replace("hr", F).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ne).getRegex(), ht = b(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ee).getRegex(), xe = {
  blockquote: ht,
  code: st,
  def: ct,
  fences: it,
  heading: lt,
  hr: F,
  html: pt,
  lheading: Be,
  list: ut,
  newline: rt,
  paragraph: Ee,
  table: U,
  text: ot
}, Se = b(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", F).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ne).getRegex(), dt = {
  ...xe,
  lheading: at,
  table: Se,
  paragraph: b(ke).replace("hr", F).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ne).getRegex()
}, ft = {
  ...xe,
  html: b(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", be).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: U,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: b(ke).replace("hr", F).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Be).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, gt = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, kt = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, qe = /^( {2,}|\\)\n(?!\s*$)/, mt = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, re = /[\p{P}\p{S}]/u, we = /[\s\p{P}\p{S}]/u, Ne = /[^\s\p{P}\p{S}]/u, bt = b(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, we).getRegex(), De = /(?!~)[\p{P}\p{S}]/u, xt = /(?!~)[\s\p{P}\p{S}]/u, wt = /(?:[^\s\p{P}\p{S}]|~)/u, vt = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Ze = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, yt = b(Ze, "u").replace(/punct/g, re).getRegex(), $t = b(Ze, "u").replace(/punct/g, De).getRegex(), Me = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Rt = b(Me, "gu").replace(/notPunctSpace/g, Ne).replace(/punctSpace/g, we).replace(/punct/g, re).getRegex(), St = b(Me, "gu").replace(/notPunctSpace/g, wt).replace(/punctSpace/g, xt).replace(/punct/g, De).getRegex(), Tt = b(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Ne).replace(/punctSpace/g, we).replace(/punct/g, re).getRegex(), _t = b(/\\(punct)/, "gu").replace(/punct/g, re).getRegex(), zt = b(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), At = b(be).replace("(?:-->|$)", "-->").getRegex(), Ct = b(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", At).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Y = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Lt = b(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Y).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), He = b(/^!?\[(label)\]\[(ref)\]/).replace("label", Y).replace("ref", me).getRegex(), Oe = b(/^!?\[(ref)\](?:\[\])?/).replace("ref", me).getRegex(), Pt = b("reflink|nolink(?!\\()", "g").replace("reflink", He).replace("nolink", Oe).getRegex(), ve = {
  _backpedal: U,
  // only used for GFM url
  anyPunctuation: _t,
  autolink: zt,
  blockSkip: vt,
  br: qe,
  code: kt,
  del: U,
  emStrongLDelim: yt,
  emStrongRDelimAst: Rt,
  emStrongRDelimUnd: Tt,
  escape: gt,
  link: Lt,
  nolink: Oe,
  punctuation: bt,
  reflink: He,
  reflinkSearch: Pt,
  tag: Ct,
  text: mt,
  url: U
}, It = {
  ...ve,
  link: b(/^!?\[(label)\]\((.*?)\)/).replace("label", Y).getRegex(),
  reflink: b(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Y).getRegex()
}, pe = {
  ...ve,
  emStrongRDelimAst: St,
  emStrongLDelim: $t,
  url: b(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Bt = {
  ...pe,
  br: b(qe).replace("{2,}", "*").getRegex(),
  text: b(pe.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, K = {
  normal: xe,
  gfm: dt,
  pedantic: ft
}, O = {
  normal: ve,
  gfm: pe,
  breaks: Bt,
  pedantic: It
}, Et = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Te = (n) => Et[n];
function B(n, e) {
  if (e) {
    if (A.escapeTest.test(n))
      return n.replace(A.escapeReplace, Te);
  } else if (A.escapeTestNoEncode.test(n))
    return n.replace(A.escapeReplaceNoEncode, Te);
  return n;
}
function _e(n) {
  try {
    n = encodeURI(n).replace(A.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function ze(n, e) {
  var i;
  const t = n.replace(A.findPipe, (c, l, u) => {
    let a = !1, o = l;
    for (; --o >= 0 && u[o] === "\\"; ) a = !a;
    return a ? "|" : " |";
  }), r = t.split(A.splitPipe);
  let s = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !((i = r.at(-1)) != null && i.trim()) && r.pop(), e)
    if (r.length > e)
      r.splice(e);
    else
      for (; r.length < e; ) r.push("");
  for (; s < r.length; s++)
    r[s] = r[s].trim().replace(A.slashPipe, "|");
  return r;
}
function j(n, e, t) {
  const r = n.length;
  if (r === 0)
    return "";
  let s = 0;
  for (; s < r && n.charAt(r - s - 1) === e; )
    s++;
  return n.slice(0, r - s);
}
function qt(n, e) {
  if (n.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++)
    if (n[r] === "\\")
      r++;
    else if (n[r] === e[0])
      t++;
    else if (n[r] === e[1] && (t--, t < 0))
      return r;
  return t > 0 ? -2 : -1;
}
function Ae(n, e, t, r, s) {
  const i = e.href, c = e.title || null, l = n[1].replace(s.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  const u = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: i,
    title: c,
    text: l,
    tokens: r.inlineTokens(l)
  };
  return r.state.inLink = !1, u;
}
function Nt(n, e, t) {
  const r = n.match(t.other.indentCodeCompensation);
  if (r === null)
    return e;
  const s = r[1];
  return e.split(`
`).map((i) => {
    const c = i.match(t.other.beginningSpace);
    if (c === null)
      return i;
    const [l] = c;
    return l.length >= s.length ? i.slice(s.length) : i;
  }).join(`
`);
}
var ee = class {
  // set by the lexer
  constructor(n) {
    v(this, "options");
    v(this, "rules");
    // set by the lexer
    v(this, "lexer");
    this.options = n || D;
  }
  space(n) {
    const e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0)
      return {
        type: "space",
        raw: e[0]
      };
  }
  code(n) {
    const e = this.rules.block.code.exec(n);
    if (e) {
      const t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: e[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? t : j(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], r = Nt(t, e[3] || "", this.rules);
      return {
        type: "code",
        raw: t,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: r
      };
    }
  }
  heading(n) {
    const e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        const r = j(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (t = r.trim());
      }
      return {
        type: "heading",
        raw: e[0],
        depth: e[1].length,
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  hr(n) {
    const e = this.rules.block.hr.exec(n);
    if (e)
      return {
        type: "hr",
        raw: j(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = j(e[0], `
`).split(`
`), r = "", s = "";
      const i = [];
      for (; t.length > 0; ) {
        let c = !1;
        const l = [];
        let u;
        for (u = 0; u < t.length; u++)
          if (this.rules.other.blockquoteStart.test(t[u]))
            l.push(t[u]), c = !0;
          else if (!c)
            l.push(t[u]);
          else
            break;
        t = t.slice(u);
        const a = l.join(`
`), o = a.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${a}` : a, s = s ? `${s}
${o}` : o;
        const k = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(o, i, !0), this.lexer.state.top = k, t.length === 0)
          break;
        const p = i.at(-1);
        if ((p == null ? void 0 : p.type) === "code")
          break;
        if ((p == null ? void 0 : p.type) === "blockquote") {
          const y = p, g = y.raw + `
` + t.join(`
`), R = this.blockquote(g);
          i[i.length - 1] = R, r = r.substring(0, r.length - y.raw.length) + R.raw, s = s.substring(0, s.length - y.text.length) + R.text;
          break;
        } else if ((p == null ? void 0 : p.type) === "list") {
          const y = p, g = y.raw + `
` + t.join(`
`), R = this.list(g);
          i[i.length - 1] = R, r = r.substring(0, r.length - p.raw.length) + R.raw, s = s.substring(0, s.length - y.raw.length) + R.raw, t = g.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: r,
        tokens: i,
        text: s
      };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let t = e[1].trim();
      const r = t.length > 1, s = {
        type: "list",
        raw: "",
        ordered: r,
        start: r ? +t.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      t = r ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = r ? t : "[*+-]");
      const i = this.rules.other.listItemRegex(t);
      let c = !1;
      for (; n; ) {
        let u = !1, a = "", o = "";
        if (!(e = i.exec(n)) || this.rules.block.hr.test(n))
          break;
        a = e[0], n = n.substring(a.length);
        let k = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (w) => " ".repeat(3 * w.length)), p = n.split(`
`, 1)[0], y = !k.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, o = k.trimStart()) : y ? g = e[1].length + 1 : (g = e[2].search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, o = k.slice(g), g += e[1].length), y && this.rules.other.blankLine.test(p) && (a += p + `
`, n = n.substring(p.length + 1), u = !0), !u) {
          const w = this.rules.other.nextBulletRegex(g), _ = this.rules.other.hrRegex(g), f = this.rules.other.fencesBeginRegex(g), d = this.rules.other.headingBeginRegex(g), h = this.rules.other.htmlBeginRegex(g);
          for (; n; ) {
            const x = n.split(`
`, 1)[0];
            let S;
            if (p = x, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), S = p) : S = p.replace(this.rules.other.tabCharGlobal, "    "), f.test(p) || d.test(p) || h.test(p) || w.test(p) || _.test(p))
              break;
            if (S.search(this.rules.other.nonSpaceChar) >= g || !p.trim())
              o += `
` + S.slice(g);
            else {
              if (y || k.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || f.test(k) || d.test(k) || _.test(k))
                break;
              o += `
` + p;
            }
            !y && !p.trim() && (y = !0), a += x + `
`, n = n.substring(x.length + 1), k = S.slice(g);
          }
        }
        s.loose || (c ? s.loose = !0 : this.rules.other.doubleBlankLine.test(a) && (c = !0));
        let R = null, $;
        this.options.gfm && (R = this.rules.other.listIsTask.exec(o), R && ($ = R[0] !== "[ ] ", o = o.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: a,
          task: !!R,
          checked: $,
          loose: !1,
          text: o,
          tokens: []
        }), s.raw += a;
      }
      const l = s.items.at(-1);
      if (l)
        l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else
        return;
      s.raw = s.raw.trimEnd();
      for (let u = 0; u < s.items.length; u++)
        if (this.lexer.state.top = !1, s.items[u].tokens = this.lexer.blockTokens(s.items[u].text, []), !s.loose) {
          const a = s.items[u].tokens.filter((k) => k.type === "space"), o = a.length > 0 && a.some((k) => this.rules.other.anyLine.test(k.raw));
          s.loose = o;
        }
      if (s.loose)
        for (let u = 0; u < s.items.length; u++)
          s.items[u].loose = !0;
      return s;
    }
  }
  html(n) {
    const e = this.rules.block.html.exec(n);
    if (e)
      return {
        type: "html",
        block: !0,
        raw: e[0],
        pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
        text: e[0]
      };
  }
  def(n) {
    const e = this.rules.block.def.exec(n);
    if (e) {
      const t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: t,
        raw: e[0],
        href: r,
        title: s
      };
    }
  }
  table(n) {
    var c;
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = ze(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (c = e[3]) != null && c.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === r.length) {
      for (const l of r)
        this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < t.length; l++)
        i.header.push({
          text: t[l],
          tokens: this.lexer.inline(t[l]),
          header: !0,
          align: i.align[l]
        });
      for (const l of s)
        i.rows.push(ze(l, i.header.length).map((u, a) => ({
          text: u,
          tokens: this.lexer.inline(u),
          header: !1,
          align: i.align[a]
        })));
      return i;
    }
  }
  lheading(n) {
    const e = this.rules.block.lheading.exec(n);
    if (e)
      return {
        type: "heading",
        raw: e[0],
        depth: e[2].charAt(0) === "=" ? 1 : 2,
        text: e[1],
        tokens: this.lexer.inline(e[1])
      };
  }
  paragraph(n) {
    const e = this.rules.block.paragraph.exec(n);
    if (e) {
      const t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return {
        type: "paragraph",
        raw: e[0],
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  text(n) {
    const e = this.rules.block.text.exec(n);
    if (e)
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        tokens: this.lexer.inline(e[0])
      };
  }
  escape(n) {
    const e = this.rules.inline.escape.exec(n);
    if (e)
      return {
        type: "escape",
        raw: e[0],
        text: e[1]
      };
  }
  tag(n) {
    const e = this.rules.inline.tag.exec(n);
    if (e)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: e[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: e[0]
      };
  }
  link(n) {
    const e = this.rules.inline.link.exec(n);
    if (e) {
      const t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t))
          return;
        const i = j(t.slice(0, -1), "\\");
        if ((t.length - i.length) % 2 === 0)
          return;
      } else {
        const i = qt(e[2], "()");
        if (i === -2)
          return;
        if (i > -1) {
          const l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let r = e[2], s = "";
      if (this.options.pedantic) {
        const i = this.rules.other.pedanticHrefTitle.exec(r);
        i && (r = i[1], s = i[3]);
      } else
        s = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? r = r.slice(1) : r = r.slice(1, -1)), Ae(e, {
        href: r && r.replace(this.rules.inline.anyPunctuation, "$1"),
        title: s && s.replace(this.rules.inline.anyPunctuation, "$1")
      }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      const r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[r.toLowerCase()];
      if (!s) {
        const i = t[0].charAt(0);
        return {
          type: "text",
          raw: i,
          text: i
        };
      }
      return Ae(t, s, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!r || r[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r[1] || r[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const i = [...r[0]].length - 1;
      let c, l, u = i, a = 0;
      const o = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (o.lastIndex = 0, e = e.slice(-1 * n.length + i); (r = o.exec(e)) != null; ) {
        if (c = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !c) continue;
        if (l = [...c].length, r[3] || r[4]) {
          u += l;
          continue;
        } else if ((r[5] || r[6]) && i % 3 && !((i + l) % 3)) {
          a += l;
          continue;
        }
        if (u -= l, u > 0) continue;
        l = Math.min(l, l + u + a);
        const k = [...r[0]][0].length, p = n.slice(0, i + r.index + k + l);
        if (Math.min(i, l) % 2) {
          const g = p.slice(1, -1);
          return {
            type: "em",
            raw: p,
            text: g,
            tokens: this.lexer.inlineTokens(g)
          };
        }
        const y = p.slice(2, -2);
        return {
          type: "strong",
          raw: p,
          text: y,
          tokens: this.lexer.inlineTokens(y)
        };
      }
    }
  }
  codespan(n) {
    const e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " ");
      const r = this.rules.other.nonSpaceChar.test(t), s = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return r && s && (t = t.substring(1, t.length - 1)), {
        type: "codespan",
        raw: e[0],
        text: t
      };
    }
  }
  br(n) {
    const e = this.rules.inline.br.exec(n);
    if (e)
      return {
        type: "br",
        raw: e[0]
      };
  }
  del(n) {
    const e = this.rules.inline.del.exec(n);
    if (e)
      return {
        type: "del",
        raw: e[0],
        text: e[2],
        tokens: this.lexer.inlineTokens(e[2])
      };
  }
  autolink(n) {
    const e = this.rules.inline.autolink.exec(n);
    if (e) {
      let t, r;
      return e[2] === "@" ? (t = e[1], r = "mailto:" + t) : (t = e[1], r = t), {
        type: "link",
        raw: e[0],
        text: t,
        href: r,
        tokens: [
          {
            type: "text",
            raw: t,
            text: t
          }
        ]
      };
    }
  }
  url(n) {
    var t;
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let r, s;
      if (e[2] === "@")
        r = e[0], s = "mailto:" + r;
      else {
        let i;
        do
          i = e[0], e[0] = ((t = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : t[0]) ?? "";
        while (i !== e[0]);
        r = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: r,
        href: s,
        tokens: [
          {
            type: "text",
            raw: r,
            text: r
          }
        ]
      };
    }
  }
  inlineText(n) {
    const e = this.rules.inline.text.exec(n);
    if (e) {
      const t = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        escaped: t
      };
    }
  }
}, E = class he {
  constructor(e) {
    v(this, "tokens");
    v(this, "options");
    v(this, "state");
    v(this, "tokenizer");
    v(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || D, this.options.tokenizer = this.options.tokenizer || new ee(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: A,
      block: K.normal,
      inline: O.normal
    };
    this.options.pedantic ? (t.block = K.pedantic, t.inline = O.pedantic) : this.options.gfm && (t.block = K.gfm, this.options.breaks ? t.inline = O.breaks : t.inline = O.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: K,
      inline: O
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new he(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new he(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(A.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    var s, i, c;
    for (this.options.pedantic && (e = e.replace(A.tabCharGlobal, "    ").replace(A.spaceLine, "")); e; ) {
      let l;
      if ((i = (s = this.options.extensions) == null ? void 0 : s.block) != null && i.some((a) => (l = a.call({ lexer: this }, e, t)) ? (e = e.substring(l.raw.length), t.push(l), !0) : !1))
        continue;
      if (l = this.tokenizer.space(e)) {
        e = e.substring(l.raw.length);
        const a = t.at(-1);
        l.raw.length === 1 && a !== void 0 ? a.raw += `
` : t.push(l);
        continue;
      }
      if (l = this.tokenizer.code(e)) {
        e = e.substring(l.raw.length);
        const a = t.at(-1);
        (a == null ? void 0 : a.type) === "paragraph" || (a == null ? void 0 : a.type) === "text" ? (a.raw += `
` + l.raw, a.text += `
` + l.text, this.inlineQueue.at(-1).src = a.text) : t.push(l);
        continue;
      }
      if (l = this.tokenizer.fences(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.heading(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.hr(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.blockquote(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.list(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.html(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.def(e)) {
        e = e.substring(l.raw.length);
        const a = t.at(-1);
        (a == null ? void 0 : a.type) === "paragraph" || (a == null ? void 0 : a.type) === "text" ? (a.raw += `
` + l.raw, a.text += `
` + l.raw, this.inlineQueue.at(-1).src = a.text) : this.tokens.links[l.tag] || (this.tokens.links[l.tag] = {
          href: l.href,
          title: l.title
        });
        continue;
      }
      if (l = this.tokenizer.table(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.lheading(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      let u = e;
      if ((c = this.options.extensions) != null && c.startBlock) {
        let a = 1 / 0;
        const o = e.slice(1);
        let k;
        this.options.extensions.startBlock.forEach((p) => {
          k = p.call({ lexer: this }, o), typeof k == "number" && k >= 0 && (a = Math.min(a, k));
        }), a < 1 / 0 && a >= 0 && (u = e.substring(0, a + 1));
      }
      if (this.state.top && (l = this.tokenizer.paragraph(u))) {
        const a = t.at(-1);
        r && (a == null ? void 0 : a.type) === "paragraph" ? (a.raw += `
` + l.raw, a.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : t.push(l), r = u.length !== e.length, e = e.substring(l.raw.length);
        continue;
      }
      if (l = this.tokenizer.text(e)) {
        e = e.substring(l.raw.length);
        const a = t.at(-1);
        (a == null ? void 0 : a.type) === "text" ? (a.raw += `
` + l.raw, a.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : t.push(l);
        continue;
      }
      if (e) {
        const a = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(a);
          break;
        } else
          throw new Error(a);
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(e, t = []) {
    var l, u, a;
    let r = e, s = null;
    if (this.tokens.links) {
      const o = Object.keys(this.tokens.links);
      if (o.length > 0)
        for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(r)) != null; )
          o.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(r)) != null; )
      r = r.slice(0, s.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; )
      r = r.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let i = !1, c = "";
    for (; e; ) {
      i || (c = ""), i = !1;
      let o;
      if ((u = (l = this.options.extensions) == null ? void 0 : l.inline) != null && u.some((p) => (o = p.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1))
        continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        const p = t.at(-1);
        o.type === "text" && (p == null ? void 0 : p.type) === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, r, c)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let k = e;
      if ((a = this.options.extensions) != null && a.startInline) {
        let p = 1 / 0;
        const y = e.slice(1);
        let g;
        this.options.extensions.startInline.forEach((R) => {
          g = R.call({ lexer: this }, y), typeof g == "number" && g >= 0 && (p = Math.min(p, g));
        }), p < 1 / 0 && p >= 0 && (k = e.substring(0, p + 1));
      }
      if (o = this.tokenizer.inlineText(k)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (c = o.raw.slice(-1)), i = !0;
        const p = t.at(-1);
        (p == null ? void 0 : p.type) === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
        continue;
      }
      if (e) {
        const p = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(p);
          break;
        } else
          throw new Error(p);
      }
    }
    return t;
  }
}, te = class {
  // set by the parser
  constructor(n) {
    v(this, "options");
    v(this, "parser");
    this.options = n || D;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    var i;
    const r = (i = (e || "").match(A.notSpaceStart)) == null ? void 0 : i[0], s = n.replace(A.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + B(r) + '">' + (t ? s : B(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : B(s, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: n }) {
    return `<blockquote>
${this.parser.parse(n)}</blockquote>
`;
  }
  html({ text: n }) {
    return n;
  }
  heading({ tokens: n, depth: e }) {
    return `<h${e}>${this.parser.parseInline(n)}</h${e}>
`;
  }
  hr(n) {
    return `<hr>
`;
  }
  list(n) {
    const e = n.ordered, t = n.start;
    let r = "";
    for (let c = 0; c < n.items.length; c++) {
      const l = n.items[c];
      r += this.listitem(l);
    }
    const s = e ? "ol" : "ul", i = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + s + i + `>
` + r + "</" + s + `>
`;
  }
  listitem(n) {
    var t;
    let e = "";
    if (n.task) {
      const r = this.checkbox({ checked: !!n.checked });
      n.loose ? ((t = n.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (n.tokens[0].text = r + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = r + " " + B(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
        type: "text",
        raw: r + " ",
        text: r + " ",
        escaped: !0
      }) : e += r + " ";
    }
    return e += this.parser.parse(n.tokens, !!n.loose), `<li>${e}</li>
`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: n }) {
    return `<p>${this.parser.parseInline(n)}</p>
`;
  }
  table(n) {
    let e = "", t = "";
    for (let s = 0; s < n.header.length; s++)
      t += this.tablecell(n.header[s]);
    e += this.tablerow({ text: t });
    let r = "";
    for (let s = 0; s < n.rows.length; s++) {
      const i = n.rows[s];
      t = "";
      for (let c = 0; c < i.length; c++)
        t += this.tablecell(i[c]);
      r += this.tablerow({ text: t });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: n }) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n) {
    const e = this.parser.parseInline(n.tokens), t = n.header ? "th" : "td";
    return (n.align ? `<${t} align="${n.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: n }) {
    return `<strong>${this.parser.parseInline(n)}</strong>`;
  }
  em({ tokens: n }) {
    return `<em>${this.parser.parseInline(n)}</em>`;
  }
  codespan({ text: n }) {
    return `<code>${B(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const r = this.parser.parseInline(t), s = _e(n);
    if (s === null)
      return r;
    n = s;
    let i = '<a href="' + n + '"';
    return e && (i += ' title="' + B(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    const s = _e(n);
    if (s === null)
      return B(t);
    n = s;
    let i = `<img src="${n}" alt="${t}"`;
    return e && (i += ` title="${B(e)}"`), i += ">", i;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : B(n.text);
  }
}, ye = class {
  // no need for block level renderers
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
}, q = class de {
  constructor(e) {
    v(this, "options");
    v(this, "renderer");
    v(this, "textRenderer");
    this.options = e || D, this.options.renderer = this.options.renderer || new te(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ye();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new de(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new de(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    var s, i;
    let r = "";
    for (let c = 0; c < e.length; c++) {
      const l = e[c];
      if ((i = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && i[l.type]) {
        const a = l, o = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(a.type)) {
          r += o || "";
          continue;
        }
      }
      const u = l;
      switch (u.type) {
        case "space": {
          r += this.renderer.space(u);
          continue;
        }
        case "hr": {
          r += this.renderer.hr(u);
          continue;
        }
        case "heading": {
          r += this.renderer.heading(u);
          continue;
        }
        case "code": {
          r += this.renderer.code(u);
          continue;
        }
        case "table": {
          r += this.renderer.table(u);
          continue;
        }
        case "blockquote": {
          r += this.renderer.blockquote(u);
          continue;
        }
        case "list": {
          r += this.renderer.list(u);
          continue;
        }
        case "html": {
          r += this.renderer.html(u);
          continue;
        }
        case "paragraph": {
          r += this.renderer.paragraph(u);
          continue;
        }
        case "text": {
          let a = u, o = this.renderer.text(a);
          for (; c + 1 < e.length && e[c + 1].type === "text"; )
            a = e[++c], o += `
` + this.renderer.text(a);
          t ? r += this.renderer.paragraph({
            type: "paragraph",
            raw: o,
            text: o,
            tokens: [{ type: "text", raw: o, text: o, escaped: !0 }]
          }) : r += o;
          continue;
        }
        default: {
          const a = 'Token with "' + u.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return r;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t = this.renderer) {
    var s, i;
    let r = "";
    for (let c = 0; c < e.length; c++) {
      const l = e[c];
      if ((i = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && i[l.type]) {
        const a = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          r += a || "";
          continue;
        }
      }
      const u = l;
      switch (u.type) {
        case "escape": {
          r += t.text(u);
          break;
        }
        case "html": {
          r += t.html(u);
          break;
        }
        case "link": {
          r += t.link(u);
          break;
        }
        case "image": {
          r += t.image(u);
          break;
        }
        case "strong": {
          r += t.strong(u);
          break;
        }
        case "em": {
          r += t.em(u);
          break;
        }
        case "codespan": {
          r += t.codespan(u);
          break;
        }
        case "br": {
          r += t.br(u);
          break;
        }
        case "del": {
          r += t.del(u);
          break;
        }
        case "text": {
          r += t.text(u);
          break;
        }
        default: {
          const a = 'Token with "' + u.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return r;
  }
}, oe, X = (oe = class {
  constructor(n) {
    v(this, "options");
    v(this, "block");
    this.options = n || D;
  }
  /**
   * Process markdown before marked
   */
  preprocess(n) {
    return n;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(n) {
    return n;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(n) {
    return n;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? E.lex : E.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? q.parse : q.parseInline;
  }
}, v(oe, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), oe), Dt = class {
  constructor(...n) {
    v(this, "defaults", fe());
    v(this, "options", this.setOptions);
    v(this, "parse", this.parseMarkdown(!0));
    v(this, "parseInline", this.parseMarkdown(!1));
    v(this, "Parser", q);
    v(this, "Renderer", te);
    v(this, "TextRenderer", ye);
    v(this, "Lexer", E);
    v(this, "Tokenizer", ee);
    v(this, "Hooks", X);
    this.use(...n);
  }
  /**
   * Run callback for every token
   */
  walkTokens(n, e) {
    var r, s;
    let t = [];
    for (const i of n)
      switch (t = t.concat(e.call(this, i)), i.type) {
        case "table": {
          const c = i;
          for (const l of c.header)
            t = t.concat(this.walkTokens(l.tokens, e));
          for (const l of c.rows)
            for (const u of l)
              t = t.concat(this.walkTokens(u.tokens, e));
          break;
        }
        case "list": {
          const c = i;
          t = t.concat(this.walkTokens(c.items, e));
          break;
        }
        default: {
          const c = i;
          (s = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && s[c.type] ? this.defaults.extensions.childTokens[c.type].forEach((l) => {
            const u = c[l].flat(1 / 0);
            t = t.concat(this.walkTokens(u, e));
          }) : c.tokens && (t = t.concat(this.walkTokens(c.tokens, e)));
        }
      }
    return t;
  }
  use(...n) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      const r = { ...t };
      if (r.async = this.defaults.async || r.async || !1, t.extensions && (t.extensions.forEach((s) => {
        if (!s.name)
          throw new Error("extension name required");
        if ("renderer" in s) {
          const i = e.renderers[s.name];
          i ? e.renderers[s.name] = function(...c) {
            let l = s.renderer.apply(this, c);
            return l === !1 && (l = i.apply(this, c)), l;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const i = e[s.level];
          i ? i.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), r.extensions = e), t.renderer) {
        const s = this.defaults.renderer || new te(this.defaults);
        for (const i in t.renderer) {
          if (!(i in s))
            throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i))
            continue;
          const c = i, l = t.renderer[c], u = s[c];
          s[c] = (...a) => {
            let o = l.apply(s, a);
            return o === !1 && (o = u.apply(s, a)), o || "";
          };
        }
        r.renderer = s;
      }
      if (t.tokenizer) {
        const s = this.defaults.tokenizer || new ee(this.defaults);
        for (const i in t.tokenizer) {
          if (!(i in s))
            throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i))
            continue;
          const c = i, l = t.tokenizer[c], u = s[c];
          s[c] = (...a) => {
            let o = l.apply(s, a);
            return o === !1 && (o = u.apply(s, a)), o;
          };
        }
        r.tokenizer = s;
      }
      if (t.hooks) {
        const s = this.defaults.hooks || new X();
        for (const i in t.hooks) {
          if (!(i in s))
            throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i))
            continue;
          const c = i, l = t.hooks[c], u = s[c];
          X.passThroughHooks.has(i) ? s[c] = (a) => {
            if (this.defaults.async)
              return Promise.resolve(l.call(s, a)).then((k) => u.call(s, k));
            const o = l.call(s, a);
            return u.call(s, o);
          } : s[c] = (...a) => {
            let o = l.apply(s, a);
            return o === !1 && (o = u.apply(s, a)), o;
          };
        }
        r.hooks = s;
      }
      if (t.walkTokens) {
        const s = this.defaults.walkTokens, i = t.walkTokens;
        r.walkTokens = function(c) {
          let l = [];
          return l.push(i.call(this, c)), s && (l = l.concat(s.call(this, c))), l;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return E.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return q.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (t, r) => {
      const s = { ...r }, i = { ...this.defaults, ...s }, c = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && s.async === !1)
        return c(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return c(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return c(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      i.hooks && (i.hooks.options = i, i.hooks.block = n);
      const l = i.hooks ? i.hooks.provideLexer() : n ? E.lex : E.lexInline, u = i.hooks ? i.hooks.provideParser() : n ? q.parse : q.parseInline;
      if (i.async)
        return Promise.resolve(i.hooks ? i.hooks.preprocess(t) : t).then((a) => l(a, i)).then((a) => i.hooks ? i.hooks.processAllTokens(a) : a).then((a) => i.walkTokens ? Promise.all(this.walkTokens(a, i.walkTokens)).then(() => a) : a).then((a) => u(a, i)).then((a) => i.hooks ? i.hooks.postprocess(a) : a).catch(c);
      try {
        i.hooks && (t = i.hooks.preprocess(t));
        let a = l(t, i);
        i.hooks && (a = i.hooks.processAllTokens(a)), i.walkTokens && this.walkTokens(a, i.walkTokens);
        let o = u(a, i);
        return i.hooks && (o = i.hooks.postprocess(o)), o;
      } catch (a) {
        return c(a);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        const r = "<p>An error occurred:</p><pre>" + B(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, N = new Dt();
function m(n, e) {
  return N.parse(n, e);
}
m.options = m.setOptions = function(n) {
  return N.setOptions(n), m.defaults = N.defaults, Pe(m.defaults), m;
};
m.getDefaults = fe;
m.defaults = D;
m.use = function(...n) {
  return N.use(...n), m.defaults = N.defaults, Pe(m.defaults), m;
};
m.walkTokens = function(n, e) {
  return N.walkTokens(n, e);
};
m.parseInline = N.parseInline;
m.Parser = q;
m.parser = q.parse;
m.Renderer = te;
m.TextRenderer = ye;
m.Lexer = E;
m.lexer = E.lex;
m.Tokenizer = ee;
m.Hooks = X;
m.parse = m;
m.options;
m.setOptions;
m.use;
m.walkTokens;
m.parseInline;
q.parse;
E.lex;
const Zt = { class: "prodoc-markdown-body" }, Mt = ["innerHTML"], Ht = {
  key: 0,
  class: "prodoc-toc",
  "aria-label": "文档目录"
}, Ot = { class: "prodoc-toc-header" }, jt = {
  class: "prodoc-toc-list",
  role: "list"
}, Gt = ["aria-current", "onClick"], Qt = { class: "prodoc-toc-mobile-header" }, Vt = {
  class: "prodoc-toc-list",
  role: "list"
}, Ut = ["aria-current", "onClick"], Ft = /* @__PURE__ */ Ce({
  __name: "MarkdownRenderer",
  props: {
    content: {},
    className: { default: "" },
    showToc: { type: Boolean, default: !0 }
  },
  emits: ["docLink"],
  setup(n, { emit: e }) {
    const t = n, r = e, s = M(null), i = M(""), c = M(!1);
    function l(f, d) {
      if (!d || d === "text" || d === "plain")
        return u(f);
      let h = u(f);
      h = h.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/|#\s+.*$|--.*$)/gm, '<span class="token-comment">$1</span>'), h = h.replace(/(&quot;.*?&quot;|\'.*?\'|`.*?`)/g, '<span class="token-string">$1</span>');
      const x = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|default|try|catch|finally|throw|new|this|typeof|instanceof|class|extends|import|export|from|async|await|yield|static|public|private|protected|interface|type|enum|namespace|module|declare|abstract|readonly|implements|void|number|string|boolean|any|never|unknown|null|undefined|true|false)\b/g;
      return h = h.replace(x, '<span class="token-keyword">$1</span>'), h = h.replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="token-function">$1</span>'), h = h.replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>'), h = h.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="token-type">$1</span>'), h;
    }
    function u(f) {
      return f.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function a(f) {
      return f.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    }
    function o(f) {
      return f.map((d) => d.text ? d.text : d.tokens ? o(d.tokens) : "").join("");
    }
    function k(f) {
      const d = [], h = f.split(`
`);
      for (const x of h) {
        const S = x.match(/^(#{1,6})\s+(.+)$/);
        S && d.push({
          level: S[1].length,
          text: S[2].trim(),
          id: a(S[2].trim())
        });
      }
      return d;
    }
    const p = Z(() => {
      const f = new m.Renderer();
      return f.heading = ({ tokens: d, depth: h }) => {
        const x = o(d), S = a(x);
        return `<h${h} id="${S}"><a href="#${S}" class="heading-anchor" aria-hidden="true">#</a>${x}</h${h}>`;
      }, f.code = ({ text: d, lang: h }) => {
        const x = h || "text", S = l(d, h), H = d.split(`
`).length, se = Array.from({ length: H }, (W, je) => je + 1).map((W) => `<span class="line-num">${W}</span>`).join("");
        return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang">${x}</span>
          <span class="code-lines">${H} lines</span>
          <button class="code-copy-btn" data-code="${u(d)}" onclick="navigator.clipboard.writeText(this.dataset.code).then(()=>{this.textContent='已复制!';setTimeout(()=>this.textContent='复制',1500)})">复制</button>
        </div>
        <div class="code-block-body">
          <div class="line-numbers">${se}</div>
          <pre><code class="language-${x}">${S}</code></pre>
        </div>
      </div>
    `;
      }, f.codespan = ({ text: d }) => `<code class="inline-code">${u(d)}</code>`, f.image = ({ href: d, title: h, text: x }) => `<img src="${d}" alt="${x}" title="${h || ""}" loading="lazy" />`, f.listitem = ({ text: d, task: h, checked: x }) => h ? `
        <li class="task-list-item">
          <label class="task-checkbox">
            <input type="checkbox" ${x ? "checked" : ""} disabled />
            <span class="checkmark"></span>
            <span class="task-text">${d.replace(/^\[[ x]\]\s*/, "")}</span>
          </label>
        </li>
      ` : `<li>${d}</li>`, m.parse(t.content, {
        async: !1,
        gfm: !0,
        breaks: !1,
        renderer: f
      });
    }), y = Z(() => k(t.content));
    function g(f) {
      var d;
      (d = document.getElementById(f)) == null || d.scrollIntoView({ behavior: "smooth" });
    }
    function R(f) {
      g(f), c.value = !1;
    }
    function $(f) {
      const h = f.target.closest("a");
      if (h) {
        const x = h.getAttribute("href");
        x && (x.startsWith("/") || x.startsWith(".") || x.endsWith(".md")) && (f.preventDefault(), r("docLink", x));
      }
    }
    function w() {
      var x, S;
      const f = (x = s.value) == null ? void 0 : x.closest(".prodoc-layout .nm-layout__content");
      if (!f) return;
      const d = (S = s.value) == null ? void 0 : S.querySelectorAll("h1, h2, h3");
      if (!d) return;
      let h = "";
      for (const H of d) {
        const se = H.getBoundingClientRect(), W = f.getBoundingClientRect();
        if (se.top - W.top <= 120)
          h = H.id;
        else
          break;
      }
      i.value = h;
    }
    let _ = null;
    return ce(s, (f) => {
      f && Ve(() => {
        _ = f.closest(".prodoc-layout .nm-layout__content"), _ == null || _.addEventListener("scroll", w);
      });
    }), Ue(() => {
      _ == null || _.removeEventListener("scroll", w);
    }), (f, d) => (z(), I("div", {
      class: G(`prodoc-markdown ${t.className}`)
    }, [
      T("div", Zt, [
        T("div", {
          ref_key: "contentRef",
          ref: s,
          class: "prodoc-markdown-content",
          innerHTML: p.value,
          onClick: $
        }, null, 8, Mt)
      ]),
      n.showToc && y.value.length > 0 ? (z(), I("nav", Ht, [
        P(L(J), {
          elevation: -2,
          "no-padding": "",
          class: "prodoc-toc-card"
        }, {
          default: C(() => [
            T("div", Ot, [
              d[3] || (d[3] = T("span", null, "📑 目录", -1)),
              P(L(We), {
                value: y.value.length
              }, null, 8, ["value"])
            ]),
            T("ul", jt, [
              (z(!0), I(ue, null, $e(y.value, (h) => (z(), I("li", {
                key: h.id,
                class: G(`prodoc-toc-item level-${h.level} ${i.value === h.id ? "active" : ""}`),
                role: "listitem"
              }, [
                T("a", {
                  href: "#",
                  role: "button",
                  "aria-current": i.value === h.id ? "location" : void 0,
                  onClick: ie((x) => g(h.id), ["prevent"])
                }, Q(h.text), 9, Gt)
              ], 2))), 128))
            ])
          ]),
          _: 1
        })
      ])) : V("", !0),
      n.showToc && y.value.length > 0 ? (z(), I("button", {
        key: 1,
        class: G(["prodoc-toc-mobile-btn", { active: c.value }]),
        "aria-label": "切换目录",
        onClick: d[0] || (d[0] = (h) => c.value = !c.value)
      }, " 📑 ", 2)) : V("", !0),
      P(Le, { name: "prodoc-toc-drawer" }, {
        default: C(() => [
          n.showToc && y.value.length > 0 && c.value ? (z(), I("div", {
            key: 0,
            class: "prodoc-toc-mobile-overlay",
            onClick: d[2] || (d[2] = ie((h) => c.value = !1, ["self"]))
          }, [
            P(L(J), {
              elevation: 0,
              class: "prodoc-toc-mobile-panel"
            }, {
              default: C(() => [
                T("div", Qt, [
                  d[4] || (d[4] = T("span", { class: "prodoc-toc-mobile-title" }, "📑 目录", -1)),
                  T("button", {
                    class: "prodoc-toc-mobile-close",
                    "aria-label": "关闭目录",
                    onClick: d[1] || (d[1] = (h) => c.value = !1)
                  }, " ✕ ")
                ]),
                T("ul", Vt, [
                  (z(!0), I(ue, null, $e(y.value, (h) => (z(), I("li", {
                    key: h.id,
                    class: G(`prodoc-toc-item level-${h.level} ${i.value === h.id ? "active" : ""}`),
                    role: "listitem"
                  }, [
                    T("a", {
                      href: "#",
                      role: "button",
                      "aria-current": i.value === h.id ? "location" : void 0,
                      onClick: ie((x) => R(h.id), ["prevent"])
                    }, Q(h.text), 9, Ut)
                  ], 2))), 128))
                ])
              ]),
              _: 1
            })
          ])) : V("", !0)
        ]),
        _: 1
      })
    ], 2));
  }
}), Wt = {
  key: 0,
  class: "prodoc-sider-content"
}, Kt = {
  key: 1,
  class: "prodoc-sider-collapsed"
}, Xt = { class: "prodoc-doc-header" }, Jt = { class: "prodoc-doc-title" }, Yt = { class: "prodoc-doc-meta" }, en = { class: "prodoc-doc-body" }, tn = {
  key: 1,
  class: "prodoc-empty-state"
}, nn = /* @__PURE__ */ Ce({
  __name: "DocViewer",
  props: {
    root: {},
    initialPath: {},
    className: { default: "" }
  },
  emits: ["docLink"],
  setup(n, { emit: e }) {
    var R;
    const t = n, r = e, s = M(t.initialPath ?? ((R = t.root.children[0]) == null ? void 0 : R.path) ?? ""), i = M([]), { theme: c, setTheme: l } = Ke(), u = Z({
      get: () => c.value,
      set: ($) => l($)
    }), a = Z(() => t.root.children.map(Fe)), o = M(s.value ? [s.value] : []);
    ce(s, ($) => {
      o.value = $ ? [$] : [];
    });
    const k = Z(() => {
      if (!s.value) return;
      function $(w) {
        if (w.path === s.value) return w;
        for (const _ of w.children) {
          const f = $(_);
          if (f) return f;
        }
      }
      return $(t.root);
    }), p = Z(() => k.value || t.root.children[0]);
    function y($) {
      s.value = $;
    }
    function g($) {
      s.value = $, r("docLink", $);
    }
    return ce(() => t.initialPath, ($) => {
      $ && (s.value = $);
    }), ($, w) => (z(), I("div", {
      class: G(`prodoc-doc-viewer ${t.className}`)
    }, [
      P(L(Xe), {
        "show-header": "",
        "show-sider": "",
        "sider-width": 280,
        collapsible: ""
      }, {
        "header-left": C(() => [...w[4] || (w[4] = [
          T("span", { class: "prodoc-header-brand" }, "📚 ProDoc", -1)
        ])]),
        "header-right": C(() => [
          P(L(nt), {
            modelValue: u.value,
            "onUpdate:modelValue": w[0] || (w[0] = (_) => u.value = _),
            size: "small"
          }, null, 8, ["modelValue"])
        ]),
        sider: C(({ collapsed: _ }) => [
          _ ? (z(), I("div", Kt, "📚")) : (z(), I("div", Wt, [
            P(L(tt), {
              data: a.value,
              "selected-keys": o.value,
              "onUpdate:selectedKeys": w[1] || (w[1] = (f) => o.value = f),
              "expanded-keys": i.value,
              "onUpdate:expandedKeys": w[2] || (w[2] = (f) => i.value = f),
              "show-search": "",
              "search-placeholder": "搜索文档...",
              onNodeSelect: y
            }, null, 8, ["data", "selected-keys", "expanded-keys"])
          ]))
        ]),
        default: C(() => [
          P(L(Je), {
            "no-padding": "",
            class: "prodoc-main-container"
          }, {
            default: C(() => [
              P(L(J), {
                elevation: -3,
                "no-padding": "",
                class: "prodoc-content-card"
              }, {
                default: C(() => [
                  p.value ? (z(), I(ue, { key: 0 }, [
                    T("div", Xt, [
                      T("h1", Jt, Q(p.value.title), 1),
                      T("div", Yt, [
                        p.value.path ? (z(), le(L(Re), {
                          key: 0,
                          variant: "primary",
                          size: "small",
                          rounded: ""
                        }, {
                          default: C(() => [
                            ae(Q(p.value.path), 1)
                          ]),
                          _: 1
                        })) : V("", !0),
                        p.value.children.length > 0 ? (z(), le(L(Re), {
                          key: 1,
                          variant: "info",
                          size: "small",
                          rounded: ""
                        }, {
                          default: C(() => [
                            ae(" 📁 " + Q(p.value.children.length) + " 个子项 ", 1)
                          ]),
                          _: 1
                        })) : V("", !0)
                      ])
                    ]),
                    P(L(Ye)),
                    T("div", en, [
                      P(Le, {
                        name: "prodoc-doc-switch",
                        mode: "out-in"
                      }, {
                        default: C(() => [
                          (z(), le(Ft, {
                            key: p.value.path,
                            content: p.value.body,
                            onDocLink: g
                          }, null, 8, ["content"]))
                        ]),
                        _: 1
                      })
                    ])
                  ], 64)) : (z(), I("div", tn, [
                    P(L(J), {
                      elevation: 2,
                      hoverable: "bulge",
                      class: "prodoc-empty-icon"
                    }, {
                      default: C(() => [...w[5] || (w[5] = [
                        T("span", { class: "prodoc-empty-emoji" }, "📂", -1)
                      ])]),
                      _: 1
                    }),
                    w[7] || (w[7] = T("p", null, "请从左侧选择一篇文档", -1)),
                    P(L(et), {
                      variant: "raised",
                      size: "small",
                      onClick: w[3] || (w[3] = (_) => {
                        var f;
                        return s.value = ((f = a.value[0]) == null ? void 0 : f.key) ?? "";
                      })
                    }, {
                      default: C(() => [...w[6] || (w[6] = [
                        ae(" 打开第一篇 ", -1)
                      ])]),
                      _: 1
                    })
                  ]))
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ], 2));
  }
}), rn = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, s] of e)
    t[r] = s;
  return t;
}, cn = /* @__PURE__ */ rn(nn, [["__scopeId", "data-v-92a2b62b"]]);
export {
  cn as DocViewer,
  Ft as MarkdownRenderer
};
//# sourceMappingURL=index.js.map
