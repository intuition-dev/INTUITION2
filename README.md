# nbake web admin

F

- http://hub.docker.com/r/nbake/nbake



You should have FTP (or S3 working already)

Benfits of admin:
- The source code stays in the cloud, not laptop that admins or developers take home.
- Cool factor: you can develop from ChromBook, IOS Tablet (w/ Apple Bluetooth keyboard) or Andorid tablet.
- There is no local development enivorment, client less development added to your servless hosting.
- Team player, you set up docker for your entire team.


The Docker host should be very close to your admin team due to IDE keystroke latency, the closer the better. Also, it is recommended to have more than one Docker Host. For example in NYC and LA if you have two teams in those 2 cities; or one for sport-section and one for other parts of webapp. Also, each project, domain, subdomain should have one 'nbake Docker' instance.
It is not recommneded to run Docker locally on PC|Mac, or to have one 'Docker host' per developer: Web Admin is multi user, it supports mutiple admins. Separate, if you get stuck, you may need
someone to help you with your Docker image via remote SSH - so keep that in mind, maybe chose your DMZ or in your Cloud VPN.

### Setup docker
- http://github.com/topseed/nbake-admin/blob/master/DOCKER.md

You can later add IDE plugins from here:
- http://market.codiad.com

You can  optionally call the build via API: http://YOUR-HOST-IP:8081/api?secret=123&folder=linkBlog&cmd=i

Pending is admin editor, something more friendly for admins, who may not like the IDE.

Commercial support, hosting, training, plugins and consulting are provided by:
- http://narwhalstar.com
or
- http://wordpug.com

Note that this is Apache license, and you to could/should consider supporting it.




