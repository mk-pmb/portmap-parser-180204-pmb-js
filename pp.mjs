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


function describeHostPort(h, p) {
  const d = h + ':' + (p || '*');
  if (d === '*:*') { return '*'; }
  return d;
}


function splitHostPort(x, inval, dflt) {
  if (!x) { return orf(inval); }
  const o = Object.assign({ host: '', port: 0 }, dflt,
    (ifObj(x) || splitHostPortStr(x)));
  if (!o.descr) { o.descr = describeHostPort(o.host, o.port); }
  return o;
}


const ruleRgx = /^(!?)(?![=!])(\S+?)(?:=(\S*?)|)(!|$)/;

function parseOneRule(spec) {
  if (!spec) { return false; }
  const m = ruleRgx.exec(spec);
  if (!m) { throw new Error('Invalid portmap spec: ' + spec); }
  const modif = m[1];
  const origAddr = splitHostPort(m[2]);
  if (modif === '!') { return { origAddr, '!': true }; }
  let opt = (m[4] && qrystr.parse(spec.slice(m[0].length), { sepRx: /!/ }));
  let addr = origAddr;
  const redir = splitHostPort(m[3], false, addr);
  if (redir) {
    if (!opt) { opt = {}; }
    opt.origAddr = origAddr;
    addr = redir;
  }
  if (!opt) { return addr; }
  if (!ifObj(addr)) { return opt; }
  Object.assign(addr, opt);
  if (redir) { addr.descr += ' as ' + origAddr.descr; }
  return addr;
}


function parseRulesCatalog(specs) {
  const rules = {};
  if (!specs) { return rules; }
  function parseSpec(spec) {
    const r = parseOneRule(spec);
    if (!r) { return; }
    const addr = orf(r.origAddr || r).descr;
    if (!addr) { throw new Error('No topic address for rule: ' + spec); }
    rules[addr] = ((r['!'] === true) ? false : r);
  }
  (specs.split ? specs.split(/[\s,]/) : specs).forEach(parseSpec);
  return rules;
}




export default {
  parse: parseRulesCatalog,
  parseOneRule,
  splitHostPort,
};
