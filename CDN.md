1. To give your site a 'proper' domain, you will need a domain name and DNS. If you do not have a domain yet, we recommend to register a cheap domain at <a href='https://www.namecheap.com/' target='_blank'>https://www.namecheap.com</a> now and have it use the namecheap DNS. They have specials where certain domains are only $0.66 for the first year.
If you already own a domain and host a site, e.g. at `www.my.domain`, you may want to configure a CNAME to map a `'lab1b.'` subdomain, such as `lab1b.my.domain`, so you can keep using `'www.'` for your public site. See below for more detailed instructions. 

2. For scalability and caching, you will also want to use a Content Delivery Network (CDN). With a CDN, you also get SSL/HTTPS for free. No need to buy an expensive SSL certificate. SSL is important when using advanced Javascript functions in the browser, such as cross-domain data requests. We recommend <a href='https://www.cdn77.com' target='_blank'>https://www.cdn77.com</a>. For this tutorial, register for the CDN77 14-day free trial now.

3. In the CDN77 web app, go to menu item CDN and click 'ADD NEW CDN RESOURCE'. Give it a label, such as 'lab1b.my.domain' and select 'My Origin'. As domain, specify HTTP and the `AWS S3` DOMAIN. (e.g. lab1.my.domain.s3-website-us-east-1.amazonaws.com). 
Click 'CREATE CDN RESOURCE'.

4. Choose 4-step setup with CNAME. Click 'Add new CNAME', and '+ ADD CNAMES'. Enter 'lab1b.my.domain' and Click 'ADD CNAME'. Click 'Go back to Integration'. In Step 2, copy the DOMAIN NAME (AKA HOST), e.g 1234567890.rsc.cdn77.org, then follow instructions for your hosting provider. If your domain is with namecheap.com, do the following:
On the Namecheap dashbord, click 'Manage' for your domain, and 'Advanced DNS'. Click 'ADD NEW RECORD', select 'CNAME' and enter the following: Host: lab1b Value: [DOMAIN NAME from clipboard, e.g. 1234567890.rsc.cdn77.org], TTL: Automatic. Click the checkmark to save. No need to do CDN77 Step 3. One final step is to go to the CDN77 'Other Settings' tab and change Cache expiry to your liking (10 minutes may be good to start with). Also check 'HTTPS redirect' and click 'SAVE CHANGES'. 

5. After an hour after the initial setup, you should be able to reach the deployed site in your browser under e.g. <a href='https://lab1b.my.domain' target='_blank'>https://lab1b.my.domain</a>. Note the use of `'https'`. If you visit too quickly, the browser will complain that the site certificate is invalid. If this happens, try again after a while. The CDN caches static files for greater performance in multiple distributed datacenters.

11. Edit `/index.html` in the mapped drive. To make the changes appear on the CDN edge servers without your (10 minute) caching delay, use CDN77 'CDN/Purge' on /index.html.
