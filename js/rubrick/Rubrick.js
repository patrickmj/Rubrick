String.prototype.stripSlash = function() {
	if (this.charAt(this.length - 1 ) == '/') {
		return this.slice(0, -1);
	}
	return this;
}

var manifest = {
firstRunPage : "<p>Thanks for giving Rubrick a try. There is a beginner's guide to help you get started, and lots more on the project site.</p>",
settings: [

	{
	  name: "notifications",
	  type: 'group',
	  label: "Notification Settings",
	  settings: [
					{name: 'newSubmissions', type:'boolean', label: "Notify me about new submissions to my dropboxes"} ,
					{name: 'newRecordings', type:'boolean', label: "Notify me about new recordings my dropboxes"} ,
					{name: 'newGroupRequests', type:'boolean', label: "Notify me about new requests to join my groups"} ,			
					{ name: "notifyOnFFstart",
					  type: 'boolean',
					  label: "Show Notifications when you start Firefox?",
					  trueLabel: "Yes",
					  falseLabel: "No"
					}
				]
	},
]
};



jetpack.future.import("storage.settings");  
jetpack.future.import('slideBar');

Rubrick = {
//    serverBase: 'http://code.rubrick-jetpack.org/',
	serverBase: 'http://localhost/testJS/jetpacks/rubrick/',  
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
	"r:Rubric" : {},
	"r:Context" : {} ,
	"sioc:User" : {},
	"r:Submission" : {},
	"r:Recording" : {},
	"r:RubricLine" : {},
	"r:RubricLineValue" : {},
	perms : {} , 
	users : {} , 
	blockPost : false ,
	rubricMakerIsSetup : false, 
	prefixMap : {
		"sioc" : "http://rdfs.org/sioc/ns#",
		"foaf" : "http://xmlns.com/foaf/0.1/",
		"r" : "http://code.rubrick-jetpack.org/vocab/",
		"tagging" : "http://www.holygoat.co.uk/owl/redwood/0.1/tags/"
		},

	defaultLabelPred : 'sioc:name',
	defaultDescPred : 'r:description',

    initTab: function() {

        Rubrick.focusedTab = jetpack.tabs.focused;

		if( (jetpack.tabs.focused.url.stripSlash() == Rubrick.serverBase + 'rubricMaker.php') && ( ! Rubrick.rubricMakerIsSetup )   ) {
				//TODO: check if the page is fully loaded.
			Rubrick.initRubricMaker();
			Rubrick.rubricMakerIsSetup = true;
		}

    },




    handleStatusWidgetClick : function(widget) {
		//get notifications
		Rubrick.notify('notifications coming soon');

    },

	initRubric : function() {
		Rubrick.currRecording = new Rubrick.Recording() ;		
		
		Rubrick.showRubric();	
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

	
	selectContext : function(e) {
		Rubrick.getAvailableContexts();
		Rubrick.currContextURI = $(e.target).data('uri');
		$(e.target).addClass('focused');
		if(Rubrick.util.hasPermission('r:submitItems')) {
			$('#submitPane', Rubrick.slideWidget.contentDocument).show();
		} else {
			$('#submitPane', Rubrick.slideWidget.contentDocument).hide();
		}
		Rubrick.showContextRubrics();
	},

	selectRubric : function(e) {
		
		
		Rubrick.currRubricURI = $(e.target).data('uri');
		//Rubrick.initRubric();
		Rubrick.getRubricByURI($(e.target).data('uri'));
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
			  contextURI : Rubrick.currContextURI ,
			  by: 'byRubricURI' 
			},
			Rubrick.getRubricByURICB 
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
		Rubrick.loginCB
		);
	},

	logout : function() {
		$.post(Rubrick.serverBase + "logout.php" ,
		{},
		Rubrick.logoutCB
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

	postContext: function() {

        var newName = $('#newContextName', jetpack.tabs.focused.contentDocument).val();
        var newDesc = $('#newContextDesc', jetpack.tabs.focused.contentDocument).val();
		$.post(Rubrick.serverBase + "createContext.php", 
			{ "sioc:name": newName,
			  "r:description" : newDesc 
			},
			Rubrick.postContextCB 
		);

	},

	postRecording: function() {
//ARC2 doesn't seem to like it if you hit send many times quickly, so block.
//doing it async led to a really bad user experience
		if(Rubrick.blockPost) {
			Rubrick.notify('Please wait until the data is saved');
			return;
		} else {
			Rubrick.blockPost = true;
			Rubrick.notify('Sending the info.');
		}
//Rubrick.notify('rlvs ' + JSON.stringify(Rubrick.currRecording.recordedLineValues) );
//return;
		$.post(Rubrick.serverBase + 'postRecording.php' ,
			{	"dcterms:creator" : Rubrick.currUserURI , 
				context : Rubrick.currContextURI , 
				rubric : Rubrick.currRubricURI , 
				page : Rubrick.currRecording.page , 
				"r:hasLineValues[]" : Rubrick.currRecording.recordedLineValues
			},
			Rubrick.postRecordingCB
		);

	},

	postSubmission: function() {
		var noteText = $('#submissionNoteArea', Rubrick.slideWidget.contentDocument).val();
		var pageURL = jetpack.tabs.focused.url.stripSlash();

		$.post(Rubrick.serverBase + 'postSubmission.php' ,
			{creator : Rubrick.currUserURI ,
			 context : Rubrick.currContextURI,
			 page : pageURL ,
			 "r:hasNote" : noteText
			},
			Rubrick.postSubmissionCB
		);


	},

	postRubric : function() {
		Rubrick.ui.RowsManager.setJSON();
		var rowsJSON = Rubrick.ui.RowsManager.json;
		var rMeta = {};
		for(var field in Rubrick.ui.RubricMeta) {
			rMeta[field] = Rubrick.ui.RubricMeta[field].getJSON();	
		}
		var rJSON = {};
		rJSON.rubricLines = rowsJSON;
		rJSON.rubricMeta = rMeta;
		var jsonStr = JSON.stringify(rJSON);
		
		$('#debug', jetpack.tabs.focused.contentDocument).text(jsonStr);
		//$.post('http://code.rubrick-jetpack.org/createRubric.php', { rJSON : rj   } );  		
		Rubrick.notify('Submitting rubric');
	},


/* AJAX Callbacks -- GETing */

	checkLoggedInCB: function(data) {
		data = Rubrick.util.checkObject(data);

		if(data.status == 'loggedIn') {
			data.message = false;
			Rubrick.loginCB(data);	
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

	getRubricByURICB: function(data) {
		data = Rubrick.util.checkObject(data);
		for(var type in data) {
			switch(type) {
				case 'r:Recording':
					Rubrick['r:Recording'] = new Rubrick.Graph(data['r:Recording']);					
				break;
				
				default:
					if(Rubrick[type] && Rubrick[type].mergeJSON) {
						Rubrick[type].mergeJSON(data[type]);

					} else {
						
						Rubrick[type] = new Rubrick.Graph(data[type]);
					}				
				break;
			}		
		}

		Rubrick.initRubric();
	},

	getAvailableContextsCB : function(data) {
//		var data = eval(data);

	    var slidebarDoc = Rubrick.slideWidget.contentDocument;
	
		data = Rubrick.util.checkObject(data);
		for (var prop in data) {
			switch(prop) {
				case 'tagURIMap':
				case 'perms':
					Rubrick[prop] = data[prop];	
				break;
				default:
					Rubrick[prop] = new Rubrick.Graph(data[prop]);
				break;
			}
			
		}

		$('ul#contextSelect', slidebarDoc).empty();
		
		var cURIs = Rubrick['r:Context'].getSubjectURIs();
		cURIs.forEach(function(cURI) {
			var li = slidebarDoc.createElement('li');
			var label = Rubrick['r:Context'].getFirstObjectForSubjectPred(cURI, 'sioc:name', true);
			var cAnchor = Rubrick.util.template(slidebarDoc, label, Rubrick.templates.contextNameLink);
			$(cAnchor).data('uri', cURI);
			$(cAnchor).click(Rubrick.selectContext);
			$(li).append(cAnchor);
			$('ul#contextSelect', slidebarDoc).append(li);			
		});
	},






/* AJAX Callbacks -- POSTing */

	loginCB : function(data) {
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



	logoutCB : function(data) {
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

	registerCB : function(data) {
		data = Rubrick.util.checkObject(data);
		Rubrick.notify(data.message);

	},


	postRecordingCB: function(data) {		
		Rubrick.blockPost = false;
		data = Rubrick.util.checkObject(data);
		Rubrick.notify(data.message);
		Rubrick.getAvailableContexts();
	},

	postSubmissionCB: function(data) {
		data = Rubrick.util.checkObject(data);
		Rubrick.notify(data.message);
	},

	postContextCB: function(data) {
		
		var data = Rubrick.util.checkObject(data);
		if (data.status == 'success') {

			var container = $('#rubric-contexts-container', jetpack.tabs.focused.contentDocument).find('div')[0];
			//var newLI = $('li:last', container );
			//$(newLI).attr('uri', data.uri);
			//Rubrick.notify(data.uri);
			var fieldManager = $('#rubric-contexts-container', jetpack.tabs.focused.contentDocument).find('div')[0].manager;
			var newVal = decodeURIComponent(data.uri);
			//var newVal = 'wtf';
            fieldManager.valueToLabelMap[newVal] = data.label;
			
            fieldManager.addAllowedValue(newVal);            
            fieldManager.addInput(newVal);

            $('#createContextContainer', jetpack.tabs.focused.contentDocument).hide();

		}
	},

	notify: function(message, style) {
		if(message) {
			var nObj = {icon: Rubrick.icon , title : 'Rubrick Status',  body : message };
			jetpack.notifications.show(nObj);
		}
	},

/* Utility Methods */

	util : {
		getObjectLabel: function(uri, predURI, oType) {
			
			if(! oType) {
				if(! predURI ) {
					predURI = Rubrick.activePredURI;
				}
				oType = Rubrick.ranges[predURI];
			}
			if(Rubrick.activeObjectType) {
				oType = Rubrick.activeObjectType;
			}
			var labelQName = "sioc:name";

			//alert(uri + " " + oType);
			switch (oType) {
				case 'tagging:Tagging':
					oType = 'tagging:Tag';
					labelQName ="tagging:name";					
				break;
				case 'tagging:Tag':
					labelQName = "tagging:name";
				break;
				case 'r:Permissioning' :
					oType = 'allEntities';
					
					var label = Rubrick[oType].getFirstObjectForSubjectPred(uri, labelQName, true);
					if(label) {
						return label;
					}
					
					labelQName = 'r:permissonName';
					oType = 'allPermissions';
					var label = Rubrick[oType].getFirstObjectForSubjectPred(uri, labelQName, true);
					if(label) {
						return label;
					}
					
					labelQName = 'sioc:name';
					oType = 'r:ConfirmationUserGroup';
					var label = Rubrick[oType].getFirstObjectForSubjectPred(uri, labelQName, true);
					if(label) {
						return label;
					}
										

					
				default:
				
				
				break;
				
				
			}

			return Rubrick[oType].getFirstObjectForSubjectPred(uri, labelQName, true);

			
		},
		checkObject :function(data) {
			if(typeof data != 'object') {
				return eval('(' + data + ')');
			}
			return data;

		},



		hasPermission: function(perm) {
			perm = Rubrick.util.expandPName(perm);
			var hasPerm = false;			
			Rubrick.perms[Rubrick.currContextURI].forEach(function(permObj) {
				if(permObj.perm == perm) {
					hasPerm = true;
				}
			});
			return hasPerm;
		},
		expandPName : function (pname) {
			
			var parts = pname.split(':');
			if ( Rubrick.prefixMap[parts[0]] && (parts[0] != 'http') ) {
				return Rubrick.prefixMap[parts[0]] + parts[1];
			}
			return pname;
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
        }
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


	showContextRubrics : function() {
		var slidebarDoc = Rubrick.slideWidget.contentDocument;

		$('#contextRubricsContainer', slidebarDoc).empty();

		//var rURIs = Rubrick["r:Context"][Rubrick.currContextURI]["r:hasRubric"];
		var rubricObjs = Rubrick['r:Context'].getObjectsForSubjectPred(Rubrick.currContextURI, 'r:hasRubric');
		
		
		if(rubricObjs) {
			rubricObjs.forEach(function(rObj) {
				
				var rLabel = Rubrick.util.getObjectLabel(rObj.value, false, 'r:Rubric');
				var rLI = slidebarDoc.createElement('li');
				var rA = Rubrick.util.template(slidebarDoc, rLabel, Rubrick.templates.rubricName );
				$(rA).data('uri', rObj.value);				
				$(rA).click(Rubrick.selectRubric) ;
				$(rLI).append(rA);
				$('#contextRubricsContainer', slidebarDoc).append(rLI);

			});
		}
	} , 

	showRubric :  function () {
		var rubric = Rubrick['r:Rubric'].getSubjectAsGraph(Rubrick.currRubricURI);
		
		//var rObj = Rubrick["r:Rubric"][Rubrick.currRubricURI];
		//var rDiv;
		var slidebarDoc = Rubrick.slideWidget.contentDocument;
		var doc = jetpack.tabs.focused.contentDocument;
		var rDiv = Rubrick.setupPanel();
		Rubrick.updateRubricMeta();

		var linesContainer = $('.rubricLines', rDiv);


		var rubricLines = rubric.getObjectsForSubjectPred(Rubrick.currRubricURI, 'r:hasLine');
		
		for(var i=0; i<rubricLines.length; i++) {
			var lineObj = rubricLines[i];
			var lineEl = Rubrick.templateLine(Rubrick["r:RubricLine"].getSubjectAsGraph(lineObj.value));
			//var lineEl = Rubrick.templateLine(Rubrick["r:RubricLine"][rObj["r:hasLine"][i]]);
			$(lineEl).data('uri', lineObj.value);
			//lineEl.uri = lineObj.value;

			if(Rubrick.util.hasPermission('r:record')) {
				$(lineEl).click(function(e) {
						var node = e.target;
						while(node.nodeName != 'TD') {
							node = node.parentNode;
						}
						/* Skip the td with metadata */ 
						if(node === this.childNodes[0]) {
							return;
						}
						this.selectedValue = node.uri;
						$(this).data('selectedValue', $(node).data('lineValURI'));
						for(var i = 1; i< this.childNodes.length; i++) {
							$(this.childNodes[i]).removeClass('selected');
							Rubrick.currRecording.removeValue($(this.childNodes[i]).data('lineValURI'));
						}
						Rubrick.currRecording.recordedLineValues.push($(node).data('lineValURI'));
						$(node).addClass('selected');

					});
			}

			$(linesContainer).append(lineEl);

	//add the LineName to the slidebar
			var lineLI = Rubrick.util.template(slidebarDoc, '', Rubrick.templates.lineNameLI);
			//var lineNameEl = Rubrick.util.template(slidebarDoc, Rubrick.rLines[rObj.rLines[i]].name, Rubrick.templates.lineNameLink  );
			var lineNameEl = Rubrick.util.template(slidebarDoc, Rubrick.util.getObjectLabel(lineObj.value, false, 'r:RubricLine'), Rubrick.templates.lineNameLink);
//			var lineNameEl = Rubrick.util.template(slidebarDoc, Rubrick["r:RubricLine"][rObj["r:hasLine"][i]].name, Rubrick.templates.lineNameLink  );
			$(lineNameEl).data('uri', lineObj.value );
			//lineNameEl.uri = rObj["r:hasLine"][i];
			$(lineNameEl).click(Rubrick.focusLine);
			$(lineLI).append(lineNameEl);

			var metaContainer = slidebarDoc.getElementById('rubricMetaContainer');
			$('ul.rubricLineList', metaContainer).append(lineLI);
		}
	}, 

	displayRecordedLineVals:  function() {
		var panel = Rubrick.rDiv; //this will change when panels work in jetpack
		var doc = jetpack.tabs.focused.contentDocument;
		//var lineValContainers = $('.lineValContainer', panel);

		var thisPageRecsGraph = Rubrick['r:Recording'].getPredObjectValueAsGraph('r:hasPage',jetpack.tabs.focused.url.stripSlash() )
		var debug = doc.createElement('div');
		$(debug).text(thisPageRecsGraph.stringify());
		var totalRecsForPage = thisPageRecsGraph.subjectsCount();
		//var totalRecsForPage = Rubrick['r:Recording'].objectValueCount(jetpack.tabs.focused.url.stripSlash());

		
		
		$(doc.body).append(debug);
		if(totalRecsForPage == 0) {
			Rubrick.notify('No records for this page and context yet!');
		}

		$('.lineValContainer', panel).each(function() {
			var lineValURI = $(this).data('lineValURI');

			var count = thisPageRecsGraph.objectValueCount(lineValURI);
			//var count = Rubrick['r:Recording'].objectValueCount(lineValURI);
			var test = Rubrick['r:Recording'].getAllObjects();

			if(count != 0 ) {
				$(this).addClass('recorded');
			}

			if(totalRecsForPage > 1) {
				//display with visual cue to relative weights
				$('.graph', this).removeClass('hidden');
				$('.stats', this).removeClass('hidden');
				$('.graph', this).width( (count / totalRecsForPage) * 120 + "px" );
				$('.count', this).text(count);
				$('.total', this).text(totalRecsForPage);

			}

		});

	},


	setupPanel :  function () {
		var slidebarDoc = Rubrick.slideWidget.contentDocument;
		var doc = jetpack.tabs.focused.contentDocument;
		var styleEl = doc.createElement('link');
		styleEl.setAttribute('rel', 'stylesheet');
		styleEl.setAttribute('type', 'text/css');
		styleEl.setAttribute('href', 'http://localhost/testJS/jetpacks/rubrick/css/rubricPane.css');
	//    styleEl.setAttribute('href', 'http://code.rubrick-jetpack.org/css/rubricPane.css');
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
		if(Rubrick.currUserURI && Rubrick.util.hasPermission('r:record')) {
			var sendButton = slidebarDoc.createElement('a');
			$(sendButton).text('Send');
			$(sendButton).click(Rubrick.postRecording);
			$(sendButton).addClass('action');
			$(rActionsDiv).append(sendButton);
		}

		if(Rubrick.util.hasPermission('r:viewRecordings')) {
			var viewLink = slidebarDoc.createElement('a');
			$(viewLink).addClass('action');
			$(viewLink).text('View Records');
			$(viewLink).click(Rubrick.displayRecordedLineVals);
			$(rActionsDiv).append(viewLink);
		}

		if(Rubrick.util.hasPermission('r:getReport')) {
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
		var rubric = Rubrick['r:Rubric'].getSubjectAsGraph(Rubrick.currRubricURI);
		//var rObj= Rubrick["r:Rubric"][Rubrick.currRubricURI];
	/* Setup and template the metadata for the rubric */
		var metaContainer = slidebarDoc.getElementById('rubricMetaContainer');
		$('div#selectedRubric h2.rubricName', slidebarDoc).text(rubric.getLabel());
		$('div#selectedRubric h2.rubricName', slidebarDoc).addClass('rubric');


		$('p.rubricDesc', metaContainer).empty();
		$('p.rubricDesc', metaContainer).text(rubric.getDescription());

		var allLinesLink = slidebarDoc.createElement('a');
		$(allLinesLink).click(Rubrick.focusAllLines);
		$(allLinesLink).text('All');
		var allLI = Rubrick.util.template(slidebarDoc, '', Rubrick.templates.lineNameLI);
		$(allLI).append(allLinesLink);
		$('ul.rubricLineList', metaContainer).empty();
		$('ul.rubricLineList', metaContainer).append(allLI);



	}, 


	templateLine :  function(lineGraph) {
		
		var graphURI = lineGraph.getSubjectURIs()[0];
		var doc = jetpack.tabs.focused.contentDocument;
		var lineContainer = doc.createElement('tr');
		var metaContainer = doc.createElement('td');
		var label = lineGraph.getLabel();
		if(label) {
			metaContainer.appendChild(Rubrick.util.template(doc, label, Rubrick.templates.lineName));
		}
		var desc = lineGraph.getDescription();
		if(desc) {
			metaContainer.appendChild(Rubrick.util.template(doc, desc, Rubrick.templates.lineDesc));
		}

		lineContainer.appendChild(metaContainer);
		
		var lineValues = lineGraph.getObjectsForSubjectPred(graphURI, 'r:hasLineValue');

		for (var i=0; i < lineValues.length; i++) {
			var lineValEl = Rubrick.templateLineValue(lineValues[i]);
			//var lineValEl = doc.createElement('td');
			//$(lineValEl).text('woot');
			
			$(lineValEl).data('uri', '');
			//lineValEl.uri = lineObj["r:hasLineValue"][i];
			lineContainer.appendChild(lineValEl);
		}
	
		return lineContainer;
	}, 

	templateLineValue :  function(lineValObj) {
		var lineVal = Rubrick['r:RubricLineValue'].getSubjectAsGraph(lineValObj.value);
		var doc = jetpack.tabs.focused.contentDocument;
		var lineValContainer = doc.createElement('td');	
		$(lineValContainer).addClass('lineValContainer');
		$(lineValContainer).data('lineValURI', lineValObj.value);
		//$(lineValContainer).data('wtf', 'shit');
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
		$(lineValContainer).append(Rubrick.util.template(doc, lineVal.getDescription() , Rubrick.templates.lineValDesc));

		return lineValContainer;
	}, 


/* RubricMaker page */
	fieldsConfigArray : [ {
			fieldName: 'Name', type: 'ShortTextField', configObj : {
			defaultValue: "Name this rubric line"
			}
		}, {
			fieldName: 'Description', type: 'LongTextField', configObj : {
			defaultValue: "Describe the skills that this line evaluates"
			}
		}, {
			fieldName: 'Tags', type: 'ShortTextField', configObj: {
			defaultValue: "Add a tag", allowMultiple : 'true'
			}
		}, {
			fieldName: 'Public', type: 'BooleanEnumerationField', configObj: {
			defaultValue: 'true'
			}
		}, {
			fieldName: 'order', type: 'OrderedEnumerationField', configObj: {}
		}, {
			fieldName: 'v5', type: 'LongTextField', configObj : {
			defaultValue: "Describe the Rubric Value here.", score : 1
			}
		}, {
			fieldName: 'v4', type: 'LongTextField', configObj : {
			defaultValue: "Describe the Rubric Value here.", score : 2
			}
		}, {
			fieldName: 'v3', type: 'LongTextField', configObj : {
			defaultValue: "Describe the Rubric Value here.", score : 3
			}
		}, {
			fieldName: 'v2', type: 'LongTextField', configObj : {
			defaultValue: "Describe the Rubric Value here.", score : 4
			}
		}, {
			fieldName: 'v1', type: 'LongTextField', configObj : {
			defaultValue: "Describe the Rubric Value here.", score : 5
			}
		}
		
		], 

	initRubricMaker: function() {		
		var initArray = []; //TODO: this might turn into the way to build off of an existing rubric
		var contextsInit = {}; //TODO: build this from the existing info in Rubrick about contexts and the permission to add a rubrick to it. will also need to dig up the context name for the value-label map
		$('#submitButton', Rubrick.focusedTab.contentDocument).click(Rubrick.postRubric);
		$('#createContextDone', Rubrick.focusedTab.contentDocument).click(Rubrick.postContext);		
		$('#addRubrickLine', jetpack.tabs.focused.contentDocument).click(Rubrick.ui.RowsManager.addRow);
		$('#showContextCreate', jetpack.tabs.focused.contentDocument).click(function() {																			
											$('#createContextContainer', jetpack.tabs.focused.contentDocument).show();
											});
		Rubrick.ui.RowsManager.init(initArray, Rubrick.fieldsConfigArray);

		Rubrick.ui.RowsManager.addRow();

		Rubrick.ui.RubricMeta = {name : Rubrick.ui.FieldFactory.getField('ShortTextField', 'rName', { defaultValue: 'Rubric Name' } ), 
							 desc : Rubrick.ui.FieldFactory.getField('LongTextField', 'rDesc', { defaultValue: 'Rubric Description' } ), 
							 tags : Rubrick.ui.FieldFactory.getField('ShortTextField', 'rTags', {defaultValue: 'Rubric Tags' , allowMultiple: 'true' }),
							 pub : Rubrick.ui.FieldFactory.getField('BooleanEnumerationField', 'rPublic', {defaultValue: 'true'} ) ,
							 contexts: Rubrick.ui.FieldFactory.getField('EnumerationField', 'rContexts', contextsInit )
							 } ;

		rNameContainer = $('#rubric-name-container', jetpack.tabs.focused.contentDocument);
		rDescContainer =  $('#rubric-description-container', jetpack.tabs.focused.contentDocument);
		rTagsContainer =  $('#rubric-tags-container', jetpack.tabs.focused.contentDocument);
		rPublicContainer = $('#rubric-public-container', jetpack.tabs.focused.contentDocument);
		$('#rubric-contexts-container', jetpack.tabs.focused.contentDocument).append(Rubrick.ui.RubricMeta.contexts.container);		
		$(rNameContainer) .append(Rubrick.ui.RubricMeta.name.container);	
		$(rDescContainer) .append( Rubrick.ui.RubricMeta.desc.container);				
		$(rTagsContainer) .append( Rubrick.ui.RubricMeta.tags.container);		
		$(rPublicContainer).append(Rubrick.ui.RubricMeta.pub.container);		
	}, 



/* Classes */

	Graph : function(json) {
		this.json = json ? json : {};
		this.prefixMap = {
			"sioc" : "http://rdfs.org/sioc/ns#",
			"foaf" : "http://xmlns.com/foaf/0.1/",
			"r" : "http://code.rubrick-jetpack.org/vocab/",
			"dcterms" : "http://purl.org/dc/terms/",
			"tagging" : "http://www.holygoat.co.uk/owl/redwood/0.1/tags/",
			"xsd" : "http://www.w3.org/2001/XMLSchema#"
		};
		this.labelPred = 'sioc:name';
		this.descPred = 'r:description';
		this.getLabel = function() {
			if(this.subjectsCount() != 1) {
				return false;
			}
			var uris = this.getSubjectURIs();
			return this.getFirstObjectForSubjectPred(uris[0], this.labelPred, true);			
		};
		this.getDescription = function() {
			if(this.subjectsCount() != 1) {
				return false;
			}
			var uris = this.getSubjectURIs();
			return this.getFirstObjectForSubjectPred(uris[0], this.descPred, true);
		};
		this.empty = function() {
			this.json = {};	
		}
		
		this.stringify = function() {
			return JSON.stringify(this.json);
		}
		
		this.subjectsCount = function() {
			var count = 0;
			for(var s in this.json) {
				count++;
			}
			return count;
		}
		this.triplesCount = function() {
			var count = 0;
			for(var s in this.json) {
				for (var p in this.json[s]) {
					count = count + this.json[s][p].length;
				}
			}
			return count;
		}
		
		this.hasSubject = function(sURI) {
			sURI = this.expandPName(sURI);
						
			if(this.json[sURI]) {
				return true;
			}
			return false;
		}
		
		this.getSubject = function(sURI) {
			sURI = this.expandPName(sURI);
		
			if(this.hasSubject(sURI)) {
				return this.json[sURI];
			}
			return false;
			
		}
		
		this.getPredsForSubject = function(sURI) {
			sURI = this.expandPName(sURI);
						
			if(this.hasSubject(sURI)) {
				var predArray = [];
				for(var pred in this.json[sURI]) {
					predArray.push(pred);
				}
				return predArray;
			}
			return false;
		}
		
		this.getObjectsForSubjectPred = function(sURI, pURI, asValue) {
			sURI = this.expandPName(sURI);
			pURI = this.expandPName(pURI);
			
			if(this.hasSubject(sURI) && this.hasSubjectPred(sURI, pURI)) {
				var objectArray =  this.json[sURI][pURI];
				if (asValue === true) {
					var retArray = [];
					objectArray.forEach(function(obj) {
						retArray.push(obj.value);
					});
					return retArray;
				} else {
					return objectArray;
				}
				
			}
			return false;
		}
		
		this.hasSubjectPred = function(sURI, pURI) {
			sURI = this.expandPName(sURI);
			pURI = this.expandPName(pURI);			
			if(this.hasSubject(sURI)) {
				if(this.json[sURI][pURI]) {
					return true;
				}
				return false;
			}
			return false;
		}
		
		this.getFirstObjectForSubjectPred = function(sURI, pURI, asValue) {
			sURI = this.expandPName(sURI);
			pURI = this.expandPName(pURI);
			var objects = this.getObjectsForSubjectPred(sURI, pURI);
			if(! objects[0]) {
				return false;
			}
			if(asValue) {
				return objects[0].value;	
			}
			return objects[0];
		}
		
		this.hasTriple = function(sURI, pURI, o) {
			sURI = this.expandPName(sURI);
			pURI = this.expandPName(pURI);
			if(typeof o == 'string') {
				o = { value: o };
			}
			
			var hasObject = false;
			var objects = this.getObjectsForSubjectPred(sURI, pURI);			
			if(objects) {				
				objects.forEach(function(obj) {
					if(obj.value == o.value) {
						hasObject = true;
					}
				});
			} 			
			return hasObject;
		}
		this.getObjectByValue = function(oValue) {
			oValue = this.expandPName(oValue);
			var allObjects = this.getAllObjects();
			for(var i = 0; i< allObjects.length; i++) {
				if(allObjects[i].value == oValue) {
					return allObjects[i];
				}
			}
			return false;
		}
		
		this.addTriple = function(sURI, pURI, o) {
			sURI = this.expandPName(sURI);
			pURI = this.expandPName(pURI);
			

			//alert(sURI + " " + pURI + " " + o);
			if(this.hasTriple(sURI, pURI, o)) {
				return;
			}			
			if( ! this.hasSubject(sURI)) {
				this.json[sURI] = { };
				this.json[sURI][pURI] = [o];
				return;
			}
			
			if(this.hasSubject(sURI) && (! this.hasSubjectPred(sURI, pURI) ) ) {
				this.json[sURI][pURI] = [o];
				return;
			}
			
			if( this.hasSubject(sURI) &&  this.hasSubjectPred(sURI, pURI) ) {
				this.json[sURI][pURI].push(o);
			}
		}
		
		this.removeTriple = function(sURI, pURI, o) {
			sURI = this.expandPName(sURI);
			pURI = this.expandPName(pURI);			
			if(this.hasTriple(sURI, pURI, o)) {
				var oIndex=0;
				this.json[sURI][pURI].forEach(function(obj, i) {
					if (o.value == obj.value) {
						oIndex = i;
					}
				});
				this.json[sURI][pURI].splice(oIndex, 1);
				
				if(this.json[sURI][pURI].length == 0 ) {
					delete(this.json[sURI][pURI]);
				}
				//TODO: if there are no preds, kill the subject
				var killSubject = true;
				for (var pred in this.json[sURI]) {
					killSubject = false;
				}
				if(killSubject) {
					delete(this.json[sURI]);
				}
				
			}

			
		}
		this.getSubjectURIs = function() {
			var sURIs = [];
			for (var sURI in this.json) {
				sURIs.push(sURI);
			}
			return sURIs;
		}
		this.expandPName = function (pname) {
			
			var parts = pname.split(':');
			if ( this.prefixMap[parts[0]] && (parts[0] != 'http') ) {
				return this.prefixMap[parts[0]] + parts[1];
			}
			return pname;
		}	
	
		this.mergeGraph = function(graph) {
			for (var sURI in graph.json) {
				for (var pURI in graph.json[sURI]) {
					for each (o in graph.json[sURI][pURI]) {
						this.addTriple(sURI, pURI, o);
					}
				}				
			}
		}
	
		this.mergeJSON = function(json) {
			for (var sURI in json) {
				for (var pURI in json[sURI]) {
					for each (o in json[sURI][pURI]) {
						this.addTriple(sURI, pURI, o);
					}
				}				
			}			
		}
		this.getSubjectAsGraph = function(sURI) {
			var json = {};
			if(this.json[sURI]) {
				json[sURI] = this.json[sURI];
				return new Rubrick.Graph(json);				
			} else {
				return false;
			}

		}

		/**
		 * getSubjectPredAsGraph returns a subgraph with all the objects for a subject pred
		 * equiv. to CONSTRUCT { <$sURI> <$pURI> ?o } WHERE { <$sURI> <$pURI> ?o }
		 *
		 */

		this.getSubjectPredAsGraph = function(sURI, pURI) {
			var json = {};
			json[sURI] = {};
			json[sURI][pURI] = this.getObjectsForSubjectPred(sURI, pURI);
			return new Rubrick.Graph(json);
		}

		
		/**
		 * getPredObjectValueAsGraph returns a graph of the resource with the predicate and value
		 *
		 */
		 
		this.getPredObjectValueAsGraph = function(pURI, oValue) {
			pURI = this.expandPName(pURI);
			oValue = this.expandPName(oValue);
			var retGraph = new Rubrick.Graph();
			for(var sURI in this.json) {
				if(this.hasTriple(sURI, pURI, {value: oValue })) {
					//retGraph.addTriple(sURI, pURI, this.getObjectByValue(oValue));
					var tmpJSON = {};
					tmpJSON[sURI] = this.json[sURI];
					var sGraph = new Rubrick.Graph(tmpJSON);
					
					retGraph.mergeGraph(sGraph);
				}
			}
			return retGraph;
		}
		this.getSubjectTypeAsGraph = function(type) {
			return this.getPredObjectValueAsGraph('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', type);
		},
		this.getAllObjects = function() {
			var objectsArray = [];
			for(var sURI in this.json) {
				for(var pURI in this.json[sURI]) {
					objectsArray = objectsArray.concat(this.getObjectsForSubjectPred(sURI, pURI));
				}
			}
			return objectsArray;
		}
		
		this.objectValueCount = function(oValue) {
			oValue = this.expandPName(oValue);

			var count = 0;
			var allObjects = this.getAllObjects();
			allObjects.forEach(function(obj) {
				if(obj.value == oValue) {
					count++;
				}
			});
			return count;
			
		}

	
		this.removeSubjectPred = function(sURI, pURI) {
			sURI = this.expandPName(sURI);
			pURI = this.expandPName(pURI);
			delete this.json[sURI][pURI];
		}
		
		this.getSubjectObjectValuesHashAroundPred = function(pURI, firstValOnly) {
			pURI = this.expandPName(pURI);
			var retObj = {};
			for (var sURI in this.json) {
				if(this.hasSubjectPred(sURI, pURI) ) {
					if(firstValOnly) {
						retObj[sURI] = this.getFirstObjectForSubjectPred(sURI, pURI, true);	
					} else {
						retObj[sURI] = this.getObjectsForSubjectPred(sURI, pURI);						
					}
				}				
			}
			return retObj;
		}
	},
	


	Recording :  function() {
		
		this.recordedLineValues = [];
		this.page = jetpack.tabs.focused.url.stripSlash(); 
		//this.context = Rubrick.currContextURI;
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

        html: '  <div class="slideBarPane" id="login">  <div class="slideBarPaneHeader">  <h2 class="user">Login/Register</h2>  <div class="maxMin">    <img align="baseline" class="min"    src="http://code.rubrick-jetpack.org/images/minimize.png"></img>    <img align="baseline" class="max"    src="http://code.rubrick-jetpack.org/images/maximize.png"></img>  </div>  </div>  <div class="slideBarPaneBody">  <ul id="loginOps">    <li id="loginLink" class="focused">    <a>Login</a>    </li>    <li class="hidden" id="logoutLink">    <a>Logout</a>    </li>    <li id="createLink">    <a>New account</a>    </li>  </ul>  <div class="clear"></div>  <div id="loginInfo" class="hidden">Logged in as:<span id="displayUserName"></span></div>  <div id="loginForm">    <p>Username: <input id="nick-login" type="text" size="15"></input></p>    <p>Password: <input id="pwd-login" type="password" size="15"></input></p>    <a id="loginGo">Go</a>  </div>  <div id="register" class="hidden">    <p>Username: <input id="nick" type="text" size="15"></input></p>    <p>Email: <input id="email" type="text" size="15"></input></p>    <p>Password: <input id="pwd" type="password" size="15"></input></p>    <a id="registerLink">Go</a>  </div>  </div>  </div>  <div class="slideBarPane">  <div class="slideBarPaneHeader">  <h2 class="dropbox">Select Dropbox</h2>  <div class="maxMin">    <img align="baseline" class="min"    src="http://code.rubrick-jetpack.org/images/minimize.png"></img>    <img align="baseline" class="max"    src="http://code.rubrick-jetpack.org/images/maximize.png"></img>  </div>  </div>  <div class="slideBarPaneBody">  <ul class="contextList" id="contextSelect"> </ul>  <div class="contextRubrics">    <h3>Rubrics</h3>    <ul id="contextRubricsContainer"> </ul>  </div>  </div>  </div>  <div class="slideBarPane" style="display:none;">  <div class="slideBarPaneHeader">  <h2 class="rubrick">Select Rubric</h2>  <div class="maxMin">    <img align="baseline" class="min"    src="http://code.rubrick-jetpack.org/images/minimize.png"></img>    <img align="baseline" class="max"    src="http://code.rubrick-jetpack.org/images/maximize.png"></img>  </div>  </div>  <div class="slideBarPaneBody">  <ul class="rubricList" id="rubricSelect"> </ul>  </div>  </div>  <div class="slideBarPane" id="selectedRubric">  <div class="slideBarPaneHeader">  <h2 class="rubricName"> </h2>  <div class="maxMin">    <img align="baseline" class="min"    src="http://code.rubrick-jetpack.org/images/minimize.png"></img>    <img align="baseline" class="max"    src="http://code.rubrick-jetpack.org/images/maximize.png"></img>  </div>  </div>  <div class="slideBarPaneBody">  <div id="rubricMetaContainer">    <p class="rubricDesc"></p>    <h3>Rubric Lines </h3>    <ul class="rubricLineList"> </ul>  </div>  </div>  </div>  <div class="slideBarPane" id="submitPane">  <div class="slideBarPaneHeader">  <h2 class="submission">Submit</h2>  <div class="maxMin">    <img align="baseline" class="min"    src="http://code.rubrick-jetpack.org/images/minimize.png"></img>    <img align="baseline" class="max"    src="http://code.rubrick-jetpack.org/images/maximize.png"></img>  </div>  </div>  <div class="slideBarPaneBody">  <div id="submissionInfo">    <p>Add a note (optional)</p>    <textarea id="submissionNoteArea" rows="5" ></textarea><br/>    <a id="submitSubmission">Submit to <span id="submissionContextName">(Curr Context Name)</span></a>  </div>  </div>  </div>  <div class="slideBarPane hidden" id="recordings">  <div class="slideBarPaneHeader">  <h2 class="rubrick"> Records </h2>  <div class="maxMin">    <img align="baseline" class="min"    src="http://code.rubrick-jetpack.org/images/minimize.png"></img>    <img align="baseline" class="max"    src="http://code.rubrick-jetpack.org/images/maximize.png"></img>  </div>  </div>  <div class="slideBarPaneBody">  <ul class="rubricLineList">    <li class="recording">    <a>Patrick</a>    </li>    <li class="rubricLineName">    <a>Martha</a>    </li>    <li class="rubricLineName">    <a>Jerry</a>    </li>    <li class="rubricLineName">    <a>Andy</a>    </li>  </ul>  </div>  </div>  <div class="slideBarPane" id="createRubricLink">  <div class="slideBarPaneHeader">  <h2>    <a target="_blank" href="http://localhost/testJS/jetpacks/rubrick/rubricMaker.php">Create    Rubric</a>  </h2>  </div>  </div>',

        icon: Rubrick.icon,
           
        onReady: function(widget) {
            var styleEl = widget.contentDocument.createElement('link');
            styleEl.setAttribute('rel', 'stylesheet');
            styleEl.setAttribute('type', 'text/css');
            styleEl.setAttribute('href', 'http://localhost/testJS/jetpacks/rubrick/css/slidebar.css');
//            styleEl.setAttribute('href', 'http://code.rubrick-jetpack.org/css/slidebar.css');
            widget.contentDocument.getElementsByTagName('head')[0].appendChild(styleEl);        
            Rubrick.slideWidget = widget;
			$('.min', widget.contentDocument).click(Rubrick.minimizePane);
			$('.max', widget.contentDocument).click(Rubrick.maximizePane);            
			$('#createLink', widget.contentDocument).click(Rubrick.showRegister);
			$('#logoutLink', widget.contentDocument).click(Rubrick.logout);
			$('#loginLink', widget.contentDocument).click(Rubrick.showLogin);
			$('#registerLink', widget.contentDocument).click(Rubrick.register);
			$('#loginGo', widget.contentDocument).click(Rubrick.login);
			$('#submitSubmission', widget.contentDocument).click(Rubrick.postSubmission);
			$('#submitPane', Rubrick.slideWidget.contentDocument).hide();
			Rubrick.getAvailableContexts();
			Rubrick.checkLoggedIn();

         }
             
   }
);



