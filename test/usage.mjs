import 'usnam-pmb';
import eq from 'equal-pmb';

// ¦mjsUsageDemo¦+
import pp from '../';
// ¦mjsUsageDemo¦- importPkgName

// ¦mjsUsageDemo¦+
const input = '!* eve.test:80 bob.test:443=eve.test:80!decrypt';
eq(pp.parse(input), {
  '*': false,
  'eve.test:80': { host: 'eve.test', port: 80, descr: 'eve.test:80' },
  'bob.test:443': {
    host: 'eve.test',
    port: 80,
    descr: 'eve.test:80 as bob.test:443',
    origAddr: { host: 'bob.test', port: 443, descr: 'bob.test:443' },
    decrypt: true,
  },
});
// ¦mjsUsageDemo¦-








console.log('+OK usage test passed.');
