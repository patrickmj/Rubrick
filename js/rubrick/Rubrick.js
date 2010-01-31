String.prototype.stripSlash = function() {
	if (this.charAt(this.length - 1 ) == '/') {
		return this.slice(0, -1);
	}
	return this;
}

jetpack.future.import('slideBar');

Rubrick = {
    serverBase: 'http://code.rubrick-jetpack.org/',
//	serverBase: 'http://localhost/testJS/jetpacks/rubrick/',  
    icon: 'http://code.rubrick-jetpack.org/images/rubrick.png',
    currUserURI : false , 
	currContextURI : null , 
	currRubricURI : null , 
	data : {} , //TODO: break out the individual objects
	contexts : {} , 
	rubrics : {} , 
	rLines: {},
	rLineVals: {} , 
	recordings : {} ,
	submissions : {} ,
	perms : {} , 
	users : {} , 
	blockPost : false ,
	


    initTab: function() {

        Rubrick.focusedTab = jetpack.tabs.focused;

		if(jetpack.tabs.focused.url.stripSlash() == Rubrick.serverBase + 'rubricMaker.php') {
			$('#submitButton', Rubrick.focusedTab.contentDocument).click(Rubrick.handleRubricCreate);
		}

		
    },

	handleRubricCreate : function() {
		Rubrick.notify('Submitting rubric');
	},


    handleStatusWidgetClick : function(widget) {
		//get notifications
		Rubrick.notify('notifications coming soon');

    },

	initRubric : function() {
		Rubrick.currRecording = new Rubrick.Recording() ;
		
		Rubrick.displayRubric();		
	
	},



/* Slidebar Methods */

	showRegister: function() {
		$('#loginForm', Rubrick.slideWidget.contentDocument).addClass('hidden');
		$('#register', Rubrick.slideWidget.contentDocument).removeClass('hidden');
		$('#registerLink', Rubrick.slideWidget.contentDocument).removeClass('hidden'); 
		$('#createLink', Rubrick.slideWidget.contentDocument ).addClass('focused');
		$('#loginLink', Rubrick.slideWidget.contentDocument ).removeClass('focused');
	},

	showLogin : function() {
		$('#loginForm', Rubrick.slideWidget.contentDocument).removeClass('hidden');
		$('#register', Rubrick.slideWidget.contentDocument).addClass('hidden');
		$('#createLink', Rubrick.slideWidget.contentDocument ).removeClass('focused');
		$('#loginLink', Rubrick.slideWidget.contentDocument ).addClass('focused');
	},

	
	selectContext : function(event) {
		Rubrick.getAvailableContexts();
		Rubrick.currContextURI = event.target.uri;
		$(event.target).addClass('focused');
		Rubrick.displayContextRubrics();
	},

	selectRubric : function(event) {
		Rubrick.currRubricURI = event.target.uri;
		Rubrick.getRubricByURI(event.target.uri);
	},

	maximizePane : function(event) {
		var pane = event.target.parentNode.parentNode.parentNode;
		$('.slideBarPaneBody', pane).removeClass('hidden');
	},

	minimizePane : function(event) {
		var pane = event.target.parentNode.parentNode.parentNode;
		$(pane).find('.slideBarPaneBody' ).addClass('hidden');

	},

	focusAllLines : function(event) {
		var aS = event.target.parentNode.parentNode.getElementsByTagName('a');
		for(var i=0; i<aS.length; i++) {
			$(aS[i]).removeClass('focused');
		}		
		$(event.target).addClass('focused');
		var trs = Rubrick.rDiv.getElementsByTagName('tr');
		for(var i=0; i < trs.length; i++) {
			$(trs[i]).removeClass('hidden');
		}
	},

	focusLine : function(event) {
		var aS = event.target.parentNode.parentNode.getElementsByTagName('a');
		for(var i=0; i<aS.length; i++) {
			$(aS[i]).removeClass('focused');
		}
		$(event.target).addClass('focused');
		var trs = Rubrick.rDiv.getElementsByTagName('tr');
		for(var i=0; i < trs.length; i++) {
			if(event.target.uri == trs[i].uri) {
				$(trs[i]).removeClass('hidden');
			} else {
				$(trs[i]).addClass('hidden');				
			}
		}


	},

/* Getting Server Data Methods */
    /* See if the current tab is known and relevant to the current user */
    checkURL: function(urlToCheck) {
		var focusedURL = jetpack.tabs.focused.url.stripSlash();
      $.getJSON(Rubrick.serverBase + 'checkURL.php', 
                 {url: focusedURL ,
                  context: Rubrick.currContext, 
                  user: Rubrick.currUserURI, 
                  },
                  Rubrick.initSlideWidget
		);     
    },

	getRubricByURI: function(rURI) {

		$.getJSON(Rubrick.serverBase + 'getRubric.php', 
			{ uri: rURI ,
			  by: 'byURI' , 
			},
			Rubrick.getRubrickByURICallback 
		);

	},
	
	getAvailableContexts : function() {
		$.getJSON(Rubrick.serverBase + 'getAvailableContexts.php',
			{},
			Rubrick.getAvailableContextsCB

		);

	},

	checkLoggedIn: function() {
		$.getJSON(Rubrick.serverBase + 'checkLogin.php', 
			{ returnInfo : true }, 
			Rubrick.checkLoggedInCB 
		);


	},

	getAvailableRubrics : function() {

	},

	getRecentRecordings : function() {

	}, 

	getAvailableReports : function() {

	}, 

/* POSTing data methods */
	login : function() {
		var nickval = $('#nick-login', Rubrick.slideWidget.contentDocument).val() ;
		var pwdval = $('#pwd-login', Rubrick.slideWidget.contentDocument).val() ;
		$.post(Rubrick.serverBase + "login.php", 
			{nick : nickval ,
			 pwd : pwdval
			},
		Rubrick.loginCallback
		);
	},

	logout : function() {
		$.post(Rubrick.serverBase + "logout.php" ,
		{},
		Rubrick.logoutCallback
		);
	},

	register : function() {
		var nick = Rubrick.slideWidget.contentDocument.getElementById('nick').value;
		var pwd = Rubrick.slideWidget.contentDocument.getElementById('pwd').value;
		var email = Rubrick.slideWidget.contentDocument.getElementById('email').value;
		$.post(Rubrick.serverBase + "register.php", 
			{nick : nick ,
			 pwd : pwd , 
			 email : email
			},
		Rubrick.registerCallback
		);
	},


	sendRecording: function() {
//ARC2 doesn't seem to like it if you hit send many times quickly, so block.
//doing it async led to a really bad user experience
		if(Rubrick.blockPost) {
			Rubrick.notify('Please wait until the data is saved');
			return;
		} else {
			Rubrick.blockPost = true;
			Rubrick.notify('Sending the info.');
		}

		$.post(Rubrick.serverBase + 'postRecording.php' ,
			{	creator : Rubrick.currRecording.creator , 
				context : Rubrick.currContextURI , 
				rubric : Rubrick.currRubricURI , 
				page : Rubrick.currRecording.page , 
				'lineValues[]' : Rubrick.currRecording.recordedLineValues 				
			},
			Rubrick.sendRecordingCallback
		);


	},
/* AJAX Callbacks -- GETing */

	checkLoggedInCB: function(data) {
		data = Rubrick.util.checkObject(data);

		if(data.status == 'loggedIn') {
			data.message = false;
			Rubrick.loginCallback(data);
	
		}

	},

    initSlideWidget: function(data) {

		var doc = Rubrick.slideWidget.contentDocument;
        var settingsDiv = Rubrick.slideWidget.contentDocument.getElementById('settings');
		var rubricMetaDiv = Rubrick.slideWidget.contentDocument.getElementById('rubricMeta');
		var rubricSelect = Rubrick.slideWidget.contentDocument.getElementById('rubricSelect');
		$(settingsDiv).empty();
		$(rubricMetaDiv).empty();
		$(rubricSelect).empty();

    }, 

	getRubrickByURICallback: function(data) {
		//TODO: abstract this to a collection of rubrics
		//TODO: get recordings as well, and handle as in getAvailableContextsCB
		data = Rubrick.util.checkObject(data);
		//Rubrick.currRubricURI = data.rubricURI;
		for(var uri in data.rLines) {
			Rubrick.rLines[uri] = data.rLines[uri];
		}
		for(var uri in data.rLineVals) {
			Rubrick.rLineVals[uri] = data.rLineVals[uri];
		}
//TODO: move to getAvailableRubrics
/*
	    var slidebarDoc = Rubrick.slideWidget.contentDocument;
		var rubricSel = slidebarDoc.getElementById('rubricSelect');
		var li = slidebarDoc.createElement('li');
		$(li).addClass('rubricName');
		var initRAnchor = slidebarDoc.createElement('a');
		$(initRAnchor).text(data.rObj.name);
		$(initRAnchor).addClass('selected');
		$(initRAnchor).click(Rubrick.initRubric);
		$(li).append(initRAnchor);
		$(rubricSel).append(li);
*/
		Rubrick.initRubric();
	},

	getAvailableContextsCB : function(data) {
//		var data = eval(data);

	    var slidebarDoc = Rubrick.slideWidget.contentDocument;
		Rubrick.contexts = data.contexts;
		Rubrick.perms = data.perms;
		Rubrick.rubrics = data.rubrics;
		Rubrick.recordings = data.recordings;
		Rubrick.recordings.size = function() {
				var size = 0 ; 
				for(var uri in this) {
					if( (typeof this[uri] != 'function') ) {
						size++;
					}
				}
				return size;
			};
		Rubrick.recordings.countURIsInProperty = function(prp, uri) {
				var count = 0;
				for each(var obj in this) {

					if(obj.page == jetpack.tabs.focused.url.stripSlash()) {

						if(typeof obj != 'function') {
							if( obj[prp].indexOf(uri) != -1 ) {
								count++;
							}
						}
					}
				}
				return count;
			};
		$('ul#contextSelect', slidebarDoc).empty();
		for( var context in Rubrick.contexts) {
			var li = slidebarDoc.createElement('li');
			var cAnchor = Rubrick.util.template(slidebarDoc, Rubrick.contexts[context].name, Rubrick.templates.contextNameLink);
			cAnchor.uri = context;
			$(cAnchor).click(Rubrick.selectContext);
			$(li).append(cAnchor);
			$('ul#contextSelect', slidebarDoc).append(li);
		}

	},






/* AJAX Callbacks -- POSTing */

	loginCallback : function(data) {
		data = Rubrick.util.checkObject(data);
		if(data.status == 'fail') {
			Rubrick.notify(data.message);
			return;
		}
		Rubrick.currUserURI = data.userURI;
		var slidebarDoc = Rubrick.slideWidget.contentDocument;
		$('#loginForm', slidebarDoc).addClass('hidden');
		$('#register', slidebarDoc).addClass('hidden');
		$('#loginLink', slidebarDoc).addClass('hidden');
		$('#registerLink', slidebarDoc).addClass('hidden');
		$('#createLink', slidebarDoc).addClass('hidden');
		$('#logoutLink', slidebarDoc).removeClass('hidden');
		$('#loginInfo', slidebarDoc).removeClass('hidden');
		$('#displayUserName', slidebarDoc).text(data.nick);

		Rubrick.notify(data.message);
	},



	logoutCallback : function(data) {
		data = Rubrick.util.checkObject(data);
		Rubrick.currUserURI = false;
		var slidebarDoc = Rubrick.slideWidget.contentDocument;
		$('#loginForm', slidebarDoc).removeClass('hidden');
//		$('#register', slidebarDoc).removeClass('hidden');
		$('#loginLink', slidebarDoc).removeClass('hidden');
//		$('#registerLink', slidebarDoc).removeClass('hidden');
		$('#createLink', slidebarDoc).removeClass('hidden');
		$('#logoutLink', slidebarDoc).addClass('hidden');
		$('#loginInfo', slidebarDoc).addClass('hidden');
		$('.dispalyUserName', slidebarDoc).text(data.nick);
		Rubrick.notify(data.message);
	},

	registerCallback : function(data) {
		data = Rubrick.util.checkObject(data);
		Rubrick.notify(data.message);

	},


	sendRecordingCallback: function(data) {		
		Rubrick.blockPost = false;
		data = Rubrick.util.checkObject(data);
		Rubrick.notify(data.message);
		Rubrick.getAvailableContexts();
	},

	notify: function(message, style) {
		if(message) {
			var nObj = {icon: Rubrick.icon , title : 'Rubrick Status',  body : message };
			jetpack.notifications.show(nObj);
		}
	},

/* Utility Methods */

	util : {

		checkObject :function(data) {
			if(typeof data != 'object') {
				return eval('(' + data + ')');
			}
			return data;

		},

		countRubricPageRecordings: function() {
			var count = 0;
			for each (var rec in Rubrick.recordings) {
				if(  (rec.page == jetpack.tabs.focused.url.stripSlash())  && (rec.rubric == Rubrick.currRubricURI)  ) {
					count++;
				}
			}

			return count;
		},

		hasPermission: function(perm) {
			if(Rubrick.perms[Rubrick.currContextURI].indexOf(perm) == -1) {
				return false;
			}
			return true;
		},


		resetAll: function() {
		    var doc = Rubrick.slideWidget.contentDocument;
		    var settingsDiv = Rubrick.slideWidget.contentDocument.getElementById('settings');
			var rubricMetaDiv = Rubrick.slideWidget.contentDocument.getElementById('rubricMeta');
			var rubricSelect = Rubrick.slideWidget.contentDocument.getElementById('rubricSelect');
			$(settingsDiv).empty();
			$(rubricMetaDiv).empty();
			$(rubricSelect).empty();
		},

		updateStatusBar : function(message, style) {
			Rubrick.statusBarMessage.innerHTML = message; 
			Rubrick.statusBarMessage.setAttribute('style', style);
		},

        template : function (doc, val, template, atts) {
            var el = doc.createElement(template.el);
            el.appendChild(doc.createTextNode(val));
            if(template.cssClass) {
                el.setAttribute('class', template.cssClass);
            }

            if(template.id) {
                el.setAttribute('id', template.id);
            }
            for(var att in atts) {
                el.setAttribute(att, atts[att]);
            }
            return el;
        },
    },

/* Templates */
    templates : {
        link : { el: 'a' , cssClass : 'link'  } ,
        userDisplayName : { el: 'h2', cssClass : 'username'},
        successMessage : {el: 'p', cssClass: 'success'},
		lineValDesc : {el: 'p', cssClass : 'lineValDesc'} ,		
		lineDesc : {el: 'p', cssClass : 'lineDesc'} ,
		lineName : {el: 'h4', cssClass : 'lineName'} ,
		lineNameLink : {el: 'a', cssClass : 'lineNameLink'} ,
		lineNameLI : {el: 'li', cssClass: 'rubricLineName'} , 
		rubricName : {el: 'h3', cssClass : 'rubricName'} ,
		contextNameLink : {el: 'a', cssClass : 'contextNameLink'} ,
		rubricDesc : {el: 'p', cssClass : 'rubricDesc'} , 
		rubricName : {el: 'a', cssClass : 'rubricName'} , 
		tag : {el: 'li', cssClass : 'tag'} 

    } ,

/* Pseudo-Panel display */


	displayContextRubrics : function() {
		var slidebarDoc = Rubrick.slideWidget.contentDocument;

		$('#contextRubricsContainer', slidebarDoc).empty();

		var rURIs = Rubrick.contexts[Rubrick.currContextURI].rubricURIs;

		if(rURIs) {
			rURIs.forEach(function(uri) {
				var rObj = Rubrick.rubrics[uri];
				var rLI = slidebarDoc.createElement('li');
				var rA = Rubrick.util.template(slidebarDoc, Rubrick.rubrics[uri].name, Rubrick.templates.rubricName );
				rA.uri = uri;
				$(rA).click(Rubrick.selectRubric) ;
				$(rLI).append(rA);
				$('#contextRubricsContainer', slidebarDoc).append(rLI);

			});
		}
	} , 

	displayRubric :  function () {
		var rObj = Rubrick.rubrics[Rubrick.currRubricURI];
		var rDiv;
		var slidebarDoc = Rubrick.slideWidget.contentDocument;
		var doc = jetpack.tabs.focused.contentDocument;
		rDiv = Rubrick.setupPanel();
		Rubrick.updateRubricMeta();

		var linesContainer = $('.rubricLines', rDiv);

		for(var i=0; i<rObj.rLines.length; i++) {
			var lineEl = Rubrick.templateLine(Rubrick.rLines[rObj.rLines[i]]);
			lineEl.uri = rObj.rLines[i];

			if(Rubrick.util.hasPermission('record')) {
				$(lineEl).click(function(event) {
						var node = event.target;
						while(node.nodeName != 'TD') {
							node = node.parentNode;
						}
						/* Skip the td with metadata */ 
						if(node === this.childNodes[0]) {
							return;
						}
						this.selectedValue = node.uri;
						for(var i = 1; i< this.childNodes.length; i++) {
							$(this.childNodes[i]).removeClass('selected');
							Rubrick.currRecording.removeValue(this.childNodes[i].uri);
						}
						Rubrick.currRecording.recordedLineValues.push(node.uri);
						$(node).addClass('selected');

					});
			}

			$(linesContainer).append(lineEl);

	//add the LineName to the slidebar
			var lineLI = Rubrick.util.template(slidebarDoc, '', Rubrick.templates.lineNameLI);
			var lineNameEl = Rubrick.util.template(slidebarDoc, Rubrick.rLines[rObj.rLines[i]].name, Rubrick.templates.lineNameLink  );
			lineNameEl.uri = rObj.rLines[i];
			$(lineNameEl).click(Rubrick.focusLine);
			$(lineLI).append(lineNameEl);

			var metaContainer = slidebarDoc.getElementById('rubricMetaContainer');
			$('ul.rubricLineList', metaContainer).append(lineLI);
		}
	}, 

	displayRecordedLineVals:  function() {
		var panel = Rubrick.rDiv; //this will change when panels work in jetpack
		var doc = jetpack.tabs.focused.contentDocument;
		var lineValContainers = $('.lineValContainer', panel);
		var totalRecs = Rubrick.util.countRubricPageRecordings();

		if(totalRecs == 0) {
			Rubrick.notify('No records for this page and context yet!');
		}

		$('.lineValContainer', panel).each(function() {

			var count = Rubrick.recordings.countURIsInProperty('recordedLineVals',  this.uri );
			if(count != 0 ) {
				$(this).addClass('recorded');
			}

			if(totalRecs > 1) {
				//display with visual cue to relative weights
				$('.graph', this).removeClass('hidden');
				$('.stats', this).removeClass('hidden');
				$('.graph', this).width( (count / totalRecs) * 120 + "px" );
				$('.count', this).text(count);
				$('.total', this).text(totalRecs);

			}

		});

	},



	setupPanel :  function () {
		var slidebarDoc = Rubrick.slideWidget.contentDocument;
		var doc = jetpack.tabs.focused.contentDocument;
		var styleEl = doc.createElement('link');
		styleEl.setAttribute('rel', 'stylesheet');
		styleEl.setAttribute('type', 'text/css');
	//	styleEl.setAttribute('href', 'http://localhost/testJS/jetpacks/rubrick/css/rubricPane.css');
	    styleEl.setAttribute('href', 'http://code.rubrick-jetpack.org/css/rubricPane.css');
		doc.getElementsByTagName('head')[0].appendChild(styleEl);
	

		/* Build the pseudo-panel */

		// check if the rDiv is already there
		rDiv = doc.getElementById('rubricContainer');
		if(rDiv) {
			$(rDiv).empty();
		} else {
			rDiv = doc.createElement('div');
		}
		Rubrick.rDiv = rDiv;

		rDiv.setAttribute('class', 'rubricContainer');
		rDiv.setAttribute('id', 'rubricContainer');

		rActionsDiv = doc.createElement('div');
		$(rActionsDiv).addClass('rubricActions');
		$(rDiv).append(rActionsDiv);

		/* build and add a send button, if permissions apply */

		if(Rubrick.currUserURI && Rubrick.util.hasPermission('record')) {
			var sendButton = slidebarDoc.createElement('a');
			$(sendButton).text('Send');
			$(sendButton).click(Rubrick.sendRecording);
			$(sendButton).addClass('action');
			$(rActionsDiv).append(sendButton);
		}

		if(Rubrick.util.hasPermission('viewRecordings')) {
			var viewLink = slidebarDoc.createElement('a');
			$(viewLink).addClass('action');
			$(viewLink).text('View Records');
			$(viewLink).click(Rubrick.displayRecordedLineVals);
			$(rActionsDiv).append(viewLink);
		}

		if(Rubrick.util.hasPermission('getReport')) {
			var reportLink = slidebarDoc.createElement('a');
			$(reportLink).addClass('action');
			$(reportLink).text('Get Report');
			$(reportLink).attr('href', Rubrick.serverBase + 'getReport.php?contextURI=' + Rubrick.currContextURI);
			$(reportLink).attr('target', '_blank');
			$(rActionsDiv).append(reportLink);
		}

		var closeLink = doc.createElement('a');
		$(closeLink).text('Close');
		$(closeLink).addClass('action');
		closeLink.setAttribute('onclick', 'this.parentNode.parentNode.removeChild(this.parentNode)');
		rDiv.appendChild(closeLink);


		var rTable = doc.createElement('table');
		var linesContainer = doc.createElement('tbody');
		linesContainer.setAttribute('class', 'rubricLines');
		linesContainer.setAttribute('id', 'rubricLines');	
		$(rTable).append(linesContainer);

		rDiv.appendChild(rTable);
		doc.body.insertBefore(rDiv, doc.body.firstChild);



		return rDiv;
	} ,

	updateRubricMeta :  function () {
		var slidebarDoc = Rubrick.slideWidget.contentDocument;
		var doc = jetpack.tabs.focused.contentDocument;
		var rObj= Rubrick.rubrics[Rubrick.currRubricURI];
	/* Setup and template the metadata for the rubric */
		var metaContainer = slidebarDoc.getElementById('rubricMetaContainer');

		$('div#selectedRubric h2.rubricName', slidebarDoc).text(rObj.name);
		$('div#selectedRubric h2.rubricName', slidebarDoc).addClass('rubrick');


		$('p.rubricDesc', metaContainer).empty();
		$('p.rubricDesc', metaContainer).text(rObj.desc);

		var allLinesLink = slidebarDoc.createElement('a');
		$(allLinesLink).click(Rubrick.focusAllLines);
		$(allLinesLink).text('All');
		var allLI = Rubrick.util.template(slidebarDoc, '', Rubrick.templates.lineNameLI);
		$(allLI).append(allLinesLink);
		$('ul.rubricLineList', metaContainer).empty();
		$('ul.rubricLineList', metaContainer).append(allLI);



	}, 


	templateLine :  function(lineObj) {
		var doc = jetpack.tabs.focused.contentDocument;
		var lineContainer = doc.createElement('tr');
		var metaContainer = doc.createElement('td');

		if(lineObj.name) {
			metaContainer.appendChild(Rubrick.util.template(doc, lineObj.name, Rubrick.templates.lineName));
		}

		if(lineObj.desc) {
			metaContainer.appendChild(Rubrick.util.template(doc, lineObj.desc, Rubrick.templates.lineDesc));
		}


		lineContainer.appendChild(metaContainer);
		for (var i=0; i < lineObj.rLValues.length; i++) {
			var lineValEl = Rubrick.templateLineValue(Rubrick.rLineVals[lineObj.rLValues[i]]);
			lineValEl.uri = lineObj.rLValues[i];
			lineContainer.appendChild(lineValEl);
		}
	
		return lineContainer;
	}, 

	templateLineValue :  function(lineValObj) {
		var doc = jetpack.tabs.focused.contentDocument;
		var lineValContainer = doc.createElement('td');	
		$(lineValContainer).addClass('lineValContainer');

		var infoContainer = doc.createElement('div');
		$(infoContainer).addClass('info');

	//setup state (selected or no)
		var stateContainer = doc.createElement('div');
		$(stateContainer).addClass('state');
		$(infoContainer).append(stateContainer);
	
	//setupgraph
		var graphContainer = doc.createElement('div');
		$(graphContainer).addClass('graph');
		$(graphContainer).addClass('hidden');

	//setup stats
		var statsContainer = doc.createElement('div');
		$(statsContainer).addClass('stats');
		$(statsContainer).addClass('hidden');
		var countContainer = doc.createElement('span');
		$(countContainer).addClass('count');
		$(statsContainer).append(countContainer);
		var overContainer = doc.createElement('span');	
		$(overContainer).text(' / ');
		$(statsContainer).append(overContainer);
		var totalContainer = doc.createElement('span');	
		$(totalContainer).addClass('total');
		$(statsContainer).append(totalContainer);



		$(infoContainer).append(graphContainer);
		$(infoContainer).append(statsContainer);
		$(lineValContainer).append(infoContainer);
		$(lineValContainer).append(Rubrick.util.template(doc, lineValObj.desc, Rubrick.templates.lineValDesc));

		return lineValContainer;
	}, 

/* Classes */

	Recording :  function() {
		this.creator = Rubrick.currUserURI;
		this.recordedLineValues = [];
		this.page = jetpack.tabs.focused.url.stripSlash(); 
		this.context = Rubrick.currContextURI;
		this.note = '';
	  


		this.hasRecordedValue = function(rlvURI) {
			if(this.recordedLineValues.indexOf(rlvURI) == -1) {
				return false;
			}
			return true;
		};

		this.removeValue = function(rlvURI) {
			var i = this.recordedLineValues.indexOf(rlvURI);
			if(i != -1) {
				this.recordedLineValues.splice(i, 1);
			}
		
		}

	}




};


/* Startup */ 


jetpack.statusBar.append(
    {   width: 100, 

		html:"<style> .statusbar { cursor: pointer } </style><img src='http://code.rubrick-jetpack.org/images/rubrick-tiny.png' />  <span class='statusbar' id='statusBarMessage' style='position:relative; left: -3px'>ubrick</span>",
        onReady: function(widget){ 
            //get a reference to the statusBar widget
            Rubrick.statusWidget = widget;
            jetpack.tabs.onFocus( Rubrick.initTab );
            jetpack.tabs.onReady( Rubrick.initTab );
			Rubrick.statusBarMessage = widget.getElementById('statusBarMessage');
            $(widget).click(Rubrick.handleStatusWidgetClick);
        }        
    }
);

jetpack.slideBar.append(
    {   width: 260, 
		persist: false, 
        html: ' <div class="slideBarPane" id="login"> <div class="slideBarPaneHeader"> <h2 class="user">Login/Register</h2> <div class="maxMin"> <img align="baseline" class="min" src="http://code.rubrick-jetpack.org/images/minimize.png"></img> <img align="baseline" class="max" src="http://code.rubrick-jetpack.org/images/maximize.png"></img> </div> </div> <div class="slideBarPaneBody"> <ul id="loginOps"> <li id="loginLink" class="focused"> <a>Login</a> </li> <li class="hidden" id="logoutLink"> <a>Logout</a> </li> <li id="createLink"> <a>New account</a> </li> </ul> <div class="clear"></div> <div id="loginInfo" class="hidden">Logged in as:<span id="displayUserName"></span></div> <div id="loginForm"> <p>Username: <input id="nick-login" type="text" size="15"></input></p> <p>Password: <input id="pwd-login" type="password" size="15"></input></p> <a id="loginGo">Go</a> </div> <div id="register" class="hidden"> <p>Username: <input id="nick" type="text" size="15"></input></p> <p>Email: <input id="email" type="text" size="15"></input></p> <p>Password: <input id="pwd" type="password" size="15"></input></p> <a id="registerLink">Go</a> </div> </div> </div> <div class="slideBarPane"> <div class="slideBarPaneHeader"> <h2 class="dropbox">Select Dropbox</h2> <div class="maxMin"> <img align="baseline" class="min" src="http://code.rubrick-jetpack.org/images/minimize.png"></img> <img align="baseline" class="max" src="http://code.rubrick-jetpack.org/images/maximize.png"></img> </div> </div> <div class="slideBarPaneBody"> <ul class="contextList" id="contextSelect"> </ul> <div class="contextRubrics"><h3>Rubrics</h3> <ul id="contextRubricsContainer"> </ul> </div>  </div> </div> <div class="slideBarPane" style="display:none;"> <div class="slideBarPaneHeader"> <h2 class="rubrick">Select Rubric</h2> <div class="maxMin"> <img align="baseline" class="min" src="http://code.rubrick-jetpack.org/images/minimize.png"></img> <img align="baseline" class="max" src="http://code.rubrick-jetpack.org/images/maximize.png"></img> </div> </div> <div class="slideBarPaneBody"> <ul class="rubricList" id="rubricSelect"> </ul> </div> </div> <div class="slideBarPane" id="selectedRubric"> <div class="slideBarPaneHeader"> <h2 class="rubricName"> </h2> <div class="maxMin"> <img align="baseline" class="min" src="http://code.rubrick-jetpack.org/images/minimize.png"></img> <img align="baseline" class="max" src="http://code.rubrick-jetpack.org/images/maximize.png"></img> </div> </div> <div class="slideBarPaneBody"> <div id="rubricMetaContainer"> <p class="rubricDesc"></p> <h3>Rubric Lines </h3> <ul class="rubricLineList"> </ul> </div> </div> </div> <div class="slideBarPane hidden" id="recordings"> <div class="slideBarPaneHeader"> <h2 class="rubrick"> Records </h2> <div class="maxMin"> <img align="baseline" class="min" src="http://code.rubrick-jetpack.org/images/minimize.png"></img> <img align="baseline" class="max" src="http://code.rubrick-jetpack.org/images/maximize.png"></img> </div> </div> <div class="slideBarPaneBody"> <ul class="rubricLineList"> <li class="recording"> <a>Patrick</a> </li> <li class="rubricLineName"> <a>Martha</a> </li> <li class="rubricLineName"> <a>Jerry</a> </li> <li class="rubricLineName"> <a>Andy</a> </li> </ul> </div> </div><div class="slideBarPane" id="createRubricLink"><div class="slideBarPaneHeader"><h2><a target="_blank" href="http://code.rubrick-jetpack.org/rubricMaker.php">Create Rubric</a></h2></div></div>',

        icon: Rubrick.icon,
           
        onReady: function(widget) {
            var styleEl = widget.contentDocument.createElement('link');
            styleEl.setAttribute('rel', 'stylesheet');
            styleEl.setAttribute('type', 'text/css');
            styleEl.setAttribute('href', 'http://code.rubrick-jetpack.org/css/slidebar.css');
            widget.contentDocument.getElementsByTagName('head')[0].appendChild(styleEl);        
            Rubrick.slideWidget = widget;
			$('.min', widget.contentDocument).click(Rubrick.minimizePane);
			$('.max', widget.contentDocument).click(Rubrick.maximizePane);            
			$('#createLink', widget.contentDocument).click(Rubrick.showRegister);
			$('#logoutLink', widget.contentDocument).click(Rubrick.logout);
			$('#loginLink', widget.contentDocument).click(Rubrick.showLogin);
			$('#registerLink', widget.contentDocument).click(Rubrick.register);
			$('#loginGo', widget.contentDocument).click(Rubrick.login);
			Rubrick.getAvailableContexts();
			Rubrick.checkLoggedIn();

         },
             
   }
);



