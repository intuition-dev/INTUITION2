# API Reference

- [API Reference](http://doc.MetaBake.org/api)

### admin.yaml

Mount is where your production app is, the real app.
Admin is your admin (for the above app).
Services are the API endpoints.

      # where the admin is
      admin_www: /root/admin/www_admin
      admin_port: 9082
      admin_watch: true #only one location should watch
      # admin services
      services_port: 9083
      secret: 321

      # app - in dev mode
      mount: /root/admin/prod
      mount_port: 9081




