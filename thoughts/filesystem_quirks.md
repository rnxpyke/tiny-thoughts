# I want to know your favorite filesystem quirks!

You like symlink exploits in [gnu tar](https://www.cve.org/CVERecord?id=CVE-2002-1216)
, [busybox tar](https://www.cve.org/CVERecord?id=CVE-2011-5325)
, [node tar](https://www.cve.org/CVERecord?id=CVE-2021-32803)
, or one of the many other tar implementation?

You thought about directory traversal attacks using '..', but not about
url-encoding using ".%2e" like [Apache](https://blog.qualys.com/vulnerabilities-threat-research/2021/10/27/apache-http-server-path-traversal-remote-code-execution-cve-2021-41773-cve-2021-42013)?

You like confused deputy attacks leading to privilege escalation, using i.e. [Xorg](https://www.cve.org/CVERecord?id=CVE-2018-14665)?

I want to know your (least-) favorite filesystem bugs or exploits
as long as its related to filesystem implementations
, the POSIX or Linux (, maybe even Windows) filesystem API
, or related to tools like tar that take some kind of filesystem snapshot.


Please open an issue on [github issue tracker](https://github.com/rnxpyke/tiny-thoughts/issues)
or write me at rnxpyke (a t) gmail (d o t) com if you have something that fits these criteria.
