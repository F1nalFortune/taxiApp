# Launching External Website inside of Cordova Application

iOS application integrated with a full-fledged Node.js runtime for Android and iOS

# Cordova Application

cordova create toads-taxi com.toadstaxi.www toadsTaxi
cordova platform add ios
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-network-information

Add the following entry after the first set of <allow-intent.../> tags (before the <platform> sections).
  <allow-navigation href="https://www.toadstaxi.com" />
  
Change the index.js file in the cordova app to the foolowing:
var app = {
    // Application Constructor
    initialize: function() {
    this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        // Here, we redirect to the web site.
        var targetUrl = "https://YOUR-HOSTED-WEB-APP-URL/";
        var bkpLink = document.getElementById("bkpLink");
        bkpLink.setAttribute("href", targetUrl);
        bkpLink.text = targetUrl;
        window.location.replace(targetUrl);
},
    // Note: This code is taken from the Cordova CLI template.
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();



Replace Body of index.html with following code:
Verifying connectivity..
<a id="bkpLink" href="https://YOUR-HOSTED-WEB-APP-URL">YOUR-HOSTED-WEB-APP-URL</a>

<div class="app">
    <h1>Apache Cordova</h1>
    <div id="deviceready" class="blink">
        <p class="event listening">Connecting to Device</p>
        <p class="event received">Device is Ready</p>
    </div>
</div>
<script type="text/javascript" src="cordova.js"></script>
<script type="text/javascript" src="scripts/index.js"></script>

Replace Meta tag of index.html head tag with following:
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://YOUR-HOSTED-WEB-APP-URL https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">


# External Website
cd taxiApp<br/>
npm install<br/>
npm start
