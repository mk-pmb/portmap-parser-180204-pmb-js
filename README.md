
<!--#echo json="package.json" key="name" underline="=" -->
portmap-parser-180204-pmb
=========================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Parser for a custom notation scheme for TCP/UDP host/port ACL/flags/options.
<!--/#echo -->


Usage
-----

from [test/usage.mjs](test/usage.mjs):

<!--#include file="test/usage.mjs" transform="mjsUsageDemo1802" -->
<!--#verbatim lncnt="15" -->
```javascript
import pp from 'portmap-parser-180204-pmb';
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
```
<!--/include-->



<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
