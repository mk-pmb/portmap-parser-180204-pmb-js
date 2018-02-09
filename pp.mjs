import qrystr from 'qrystr';  // <-- supports …&flag&… -> [flag] = true


function orf(x) { return (x || false); }
function ifObj(x, d) { return ((x && typeof x) === 'object' ? x : d); }
function isStr(x, no) { return (((typeof x) === 'string') || no); }


function splitHostPortStr(x) {
  if (!isStr(x)) { return; }
  const t = x.split(/:([1-9][0-9]*|)$/);
  const o = { descr: '' }; // prevent copying from dflt
  const h = t[0];
  if (h) { o.host = h; }
  const p = (+t[1] || 0);
  if (p) { o.port = p; }
  return o;
}


export const splitHostPort = function (x, inval, dflt) {
  if (!x) { return orf(inval); }
  const o = Object.assign({ host: '', port: 0 }, dflt,
    (ifObj(x) || splitHostPortStr(x)));
  if (!o.descr) { o.descr = o.host + ':' + o.port; }
  return o;
};



const ruleRgx = /^(!?)(?![=!])(\S+?)(?:=(\S*?)|)(!|$)/;

export const parseOneRule = function parseOneNetDestRule(spec) {
  if (!spec) { return false; }
  const m = ruleRgx.exec(spec);
  if (!m) { throw new Error('Invalid destFilter spec: ' + spec); }
  const modif = m[1];
  const origDest = m[2];
  if (modif === '!') { return { origDest, '!': true }; }
  let opt = (m[4] && qrystr.parse(spec.slice(m[0].length), { sepRx: /!/ }));
  let dest = splitHostPort(origDest);
  const redir = splitHostPort(m[3], false, dest);
  if (redir) {
    if (!opt) { opt = {}; }
    opt.origDest = dest;
    dest = redir;
  }
  if (!opt) { return dest; }
  if (!ifObj(dest)) { return opt; }
  Object.assign(dest, opt);
  if (redir) { dest.descr += ' as ' + opt.origDest.descr; }
  return dest;
};

export const parse = function parseRulesCatalog(specs) {
  const rules = {};
  if (!specs) { return rules; }
  function parseSpec(spec) {
    const r = parseOneRule(spec);
    const dest = (r.origDest || r.descr);
    if (!r) { return; }
    rules[dest] = ((r['!'] === true) ? false : r);
  }
  (specs.split ? specs.split(/[\s,]/) : specs).forEach(parseSpec);
  return rules;
};









/* -*- coding: UTF-8, tab-width: 2 -*- */
