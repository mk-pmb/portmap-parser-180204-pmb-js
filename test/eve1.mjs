import 'usnam-pmb';
import eq from 'equal-pmb';

import * as pp from '../pp.mjs';


const inputs = ['',
  'bob.test',
  'bob.test:80',
  'bob.test:443',
  'bob.test:443!foo!bar=qux!nice!nice=5',
  'bob.test:443=eve.test:80!decrypt',
  'bob.test:80=eve.test',
];

const common = [false,
  { host: 'bob.test', port: 0,    descr: inputs[1] + ':0' },
  { host: 'bob.test', port: 80,   descr: inputs[2] },
  { host: 'bob.test', port: 443,  descr: inputs[3] },
];


function oneArg(f) { return (x => f(x)); }

function portify(p, ass) {
  return (h => Object.assign({ host: h, port: p, descr: h + ':' + p }, ass));
}

eq.lists(inputs.map(oneArg(pp.splitHostPort)),
  common.concat(inputs.slice(4).map(portify(0))));

eq.lists(inputs.map(oneArg(pp.parseOneRule)), common.concat([
  portify(443, { foo: true, bar: 'qux', nice: [true, '5'] })('bob.test'),
  { host: 'eve.test',
    port: 80,
    descr: 'eve.test:80 as bob.test:443',
    origDest: portify(443)('bob.test'),
    decrypt: true,
  },
  { host: 'eve.test',
    port: 80,
    descr: 'eve.test:80 as bob.test:80',
    origDest: portify(80)('bob.test'),
  },
]));








console.log('+OK eve1 test passed.');
/* -*- coding: UTF-8, tab-width: 2 -*- */
