/*
*	xhr.js
*/
$log("Initializing Window XMLHttpRequest.");
// XMLHttpRequest
// Originally implemented by Yehuda Katz
$w.XMLHttpRequest = function(){
	this.headers = {};
	this.responseHeaders = {};
};

XMLHttpRequest.prototype = {
	open: function(method, url, async, user, password){ 
		this.readyState = 1;
		if (async === false ){
			this.async = false;
		}else{ this.async = true; }
		this.method = method || "GET";
		this.url = $env.location(url);
		this.onreadystatechange();
	},
	setRequestHeader: function(header, value){
		this.headers[header] = value;
	},
	getResponseHeader: function(header){ },
	send: function(data){
		var self = this;
		
		function makeRequest(){
			$env.connection(self, function(){
			  var responseXML = null;
				self.__defineGetter__("responseXML", function(){
  				if ( self.responseText.match(/^\s*</) ) {
  				  if(responseXML){return responseXML;}
  				  else{
    					try {
    					  $log("parsing response text into xml document");
    						responseXML = $domparser.parseFromString(self.responseText);
  					    return responseXML;
    					} catch(e) { return null;/*TODO: need to flag an error here*/}
  					}
  				}else{return null;}
  			});
			});
			self.onreadystatechange();
		}
		if (this.async){
		  $log("XHR sending asynch;");
			$env.runAsync(makeRequest);
		}else{
		  $log("XHR sending synch;");
			makeRequest();
		}
	},
	abort: function(){
		//TODO
	},
	onreadystatechange: function(){
		//TODO
	},
	getResponseHeader: function(header){
	  var rHeader, returnedHeaders;
		if (this.readyState < 3){
			throw new Error("INVALID_STATE_ERR");
		} else {
			returnedHeaders = [];
			for (rHeader in this.responseHeaders) {
				if (rHeader.match(new RegExp(header, "i")))
					returnedHeaders.push(this.responseHeaders[rHeader]);
			}
			if (returnedHeaders.length){ return returnedHeaders.join(", "); }
		}return null;
	},
	getAllResponseHeaders: function(){
	  var header, returnedHeaders = [];
		if (this.readyState < 3){
			throw new Error("INVALID_STATE_ERR");
		} else {
			for (header in this.responseHeaders){
				returnedHeaders.push( header + ": " + this.responseHeaders[header] );
			}
		}return returnedHeaders.join("\r\n");
	},
	async: true,
	readyState: 0,
	responseText: "",
	status: 0
};