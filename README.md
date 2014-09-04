portable.box
=========

A node-webkit app for demonstration using dropbox api. This is for demonstration purposes only

### Run Application

* Install bower dependencies
```shell
$ bower install
```

* Install node-webkit
```shell
$ npm install -g nodewebkit
```

* Modify app key in js/index.js
```javascript
var client = new Dropbox.Client({
    key : 'your_dropbox_app_key'
});
```
>Where can I get my dropbox app key?
>please refer to: https://www.dropbox.com/developers/support


* Adding a oauth2 redirect-uri to Dropbox App Console
Redirect url looks like this:
```
app://htdocs/index.html
```

* Run the application
```shell
$ nodewebkit ./
```
