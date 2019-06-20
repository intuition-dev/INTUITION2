This is a really simple example of using QUnit (http://qunitjs.com/) with
blanket.js (http://blanketjs.org/) to run unit tests with code coverage analysis
as described in my blog post at
http://www.simonveal.com/code-coverage-with-qunit-and-blanket-js/

If you load the tests.html file in a browser you may need to enable file access
from files. In Chrome you can do this with the option
--allow-file-access-from-files. Alternatively you can serve all these files from
a local web server and navigate to tests.html, in which case it should just
work.

The files included are as follows:
tests.html - the page that runs the tests. Load this in a browser.
tests.js - the javascript file containing the test code.
code.js - the javascript file containing the code to be tested.
qunit-1.14.0.js - the QUnit source file
qunit-1.14.0.css - style information for QUnit
blanket.min.js - the blanket source file

