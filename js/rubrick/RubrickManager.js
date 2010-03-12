
var Rubrick = { serverBase: 'http://localhost/testJS/jetpacks/rubrick/' };
Rubrick.util = {

		checkObject :function(data) {
			if(typeof data != 'object') {
				return eval('(' + data + ')');
			}
			return data;
		},

		expandPName : function (pname) {
			
			var parts = pname.split(':');
			if ( Rubrick.manager.prefixMap[parts[0]] && (parts[0] != 'http') ) {
				return Rubrick.manager.prefixMap[parts[0]] + parts[1];
			}
			return pname;
		},


		
		getObjectLabel: function(uri, predURI, oType) {
			
			if(! oType) {
				if(! predURI ) {
					predURI = Rubrick.manager.activePredURI;
				}
				oType = Rubrick.manager.ranges[predURI];
			}
			if(Rubrick.manager.activeObjectType) {
				oType = Rubrick.manager.activeObjectType;
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
					
					var label = Rubrick.manager[oType].getFirstObjectForSubjectPred(uri, labelQName, true);
					if(label) {
						return label;
					}
					
					labelQName = 'r:permissonName';
					oType = 'allPermissions';
					var label = Rubrick.manager[oType].getFirstObjectForSubjectPred(uri, labelQName, true);
					if(label) {
						return label;
					}
					
					labelQName = 'sioc:name';
					oType = 'r:ConfirmationUserGroup';
					var label = Rubrick.manager[oType].getFirstObjectForSubjectPred(uri, labelQName, true);
					if(label) {
						return label;
					}
										

					
				default:
				
				
				break;
				
				
			}

			return Rubrick.manager[oType].getFirstObjectForSubjectPred(uri, labelQName, true);

			
		},
		objectURIArrayToGraph: function(uris, type) {
			var newGraph = new Rubrick.manager.Graph();
			uris.forEach(function(uri) {
				newGraph.mergeGraph(Rubrick.manager[type].extractSubjectAsGraph(uri));
			});
			
		}
	};
//var data = {"perms":{"http:\/\/code.rubrick-jetpack.org\/vocab\/Context1":["record","viewRecordings","getReport","addRubric","submitItems","submitItems "]},"contexts":{"http:\/\/code.rubrick-jetpack.org\/vocab\/Context1":{"name":"Demo","desc":"Just a demo","rubricURIs":["http:\/\/data.rubrick-jetpack.org\/Rubrics\/0280bce1098ee66c35f8027d3a200b9f9d6cc90a"]}},"rubrics":{"http:\/\/data.rubrick-jetpack.org\/Rubrics\/0280bce1098ee66c35f8027d3a200b9f9d6cc90a":{"name":"asdf","desc":"Rubric Description","rLines":["http:\/\/data.rubrick-jetpack.org\/RubricLines\/7669c572411a690b42540ff4ba01394d1e1e4067"]}},"recordings":{"http:\/\/data.rubrick-jetpack.org\/Recordings\/5ee4c18496fac436bd61310cc288eda573ef598d":{"recordedLineVals":["http:\/\/data.rubrick-jetpack.org\/RubricLines\/7669c572411a690b42540ff4ba01394d1e1e4067-v3"],"rubric":"http:\/\/data.rubrick-jetpack.org\/Rubrics\/0280bce1098ee66c35f8027d3a200b9f9d6cc90a","page":"http:\/\/www.google.com"},"http:\/\/data.rubrick-jetpack.org\/Recordings\/3318a350be67cbd6c3042b3bcaae7fed2ae43bf7":{"recordedLineVals":["http:\/\/data.rubrick-jetpack.org\/RubricLines\/7669c572411a690b42540ff4ba01394d1e1e4067-v4"],"rubric":"http:\/\/data.rubrick-jetpack.org\/Rubrics\/0280bce1098ee66c35f8027d3a200b9f9d6cc90a","page":"http:\/\/www.google.com"},"http:\/\/data.rubrick-jetpack.org\/Recordings\/7924e2af3980343df75afa01cd99c99adc94fdbe":{"recordedLineVals":["http:\/\/data.rubrick-jetpack.org\/RubricLines\/7669c572411a690b42540ff4ba01394d1e1e4067-v5"],"rubric":"http:\/\/data.rubrick-jetpack.org\/Rubrics\/0280bce1098ee66c35f8027d3a200b9f9d6cc90a","page":"http:\/\/localhost\/testJS\/jetpacks\/rubrick\/css\/rubricPane.css"},"http:\/\/data.rubrick-jetpack.org\/Recordings\/6399f7ad7953386f9eb6250d8a62093a0c12188b":{"recordedLineVals":["http:\/\/data.rubrick-jetpack.org\/RubricLines\/7669c572411a690b42540ff4ba01394d1e1e4067-v1"],"rubric":"http:\/\/data.rubrick-jetpack.org\/Rubrics\/0280bce1098ee66c35f8027d3a200b9f9d6cc90a","page":"http:\/\/localhost\/testJS\/jetpacks\/rubrick\/css\/rubricPane.css"},"http:\/\/data.rubrick-jetpack.org\/Recordings\/61465f63dac9935403c3de92ad40c8e89f71c94f":{"recordedLineVals":["http:\/\/data.rubrick-jetpack.org\/RubricLines\/7669c572411a690b42540ff4ba01394d1e1e4067-v2"],"rubric":"http:\/\/data.rubrick-jetpack.org\/Rubrics\/0280bce1098ee66c35f8027d3a200b9f9d6cc90a","page":"http:\/\/localhost\/testJS\/jetpacks\/rubrick\/css\/rubricPane.css"},"http:\/\/data.rubrick-jetpack.org\/Recordings\/a5f16c2a00279f6998e4fed0ed9c6ff70c08f0c9":{"recordedLineVals":["http:\/\/data.rubrick-jetpack.org\/RubricLines\/7669c572411a690b42540ff4ba01394d1e1e4067-v1"],"rubric":"http:\/\/data.rubrick-jetpack.org\/Rubrics\/0280bce1098ee66c35f8027d3a200b9f9d6cc90a","page":"http:\/\/localhost\/testJS\/jetpacks\/rubrick\/css\/rubricPane.css"}},"message":"ok"};

Rubrick.manager = {	
	"r:ConfirmationUserGroup" : {},	
	"r:Rubric" : {} ,
	"tagging:Tag" : {},
	tagURIMap: {},				
	activeTagURIs : [],
	"r:Permission" : {} ,
	
	"r:Context" : {} ,
	activeSubjectURI : '',
	activeSubjectType : '',
	activeSubject : {},
	activePredURI : '',
	activeObjectURI : '',
	
	activeObject : {} ,
	
	triplesToCreate : {},
	triplesToDelete : {},
	predURILabelMap : {},
	labelPred : 'sioc:name',
	descPred : 'r:description', 
	classURILabelMap : {
		"sioc:User" : {sing: "User" , pl: "Users"} ,
		"r:Rubric" : { sing: "Rubric",  pl : "Rubrics" },
		"sioc:UserGroup" : { sing: "Group",  pl : "Groups" },
		"r:Network" : { sing: "Network",  pl : "Networks" },
		"r:Context" : { sing: "Dropbox",  pl : "Dropboxes"},
		"r:ConfirmationUserGroup" : { sing: "Group",  pl : "Groups" },
		"r:Permissioning" : {sing: "Permission", pl : "Permissions"},
		"r:RubricLine" : {sing: "Line", pl : "Lines"}, 
		"tagging:Tagging" : {sing: "Tag" , pl: "Tags"}
		},
	predURILabelMap : {
		"sioc:has_member" : { sing: "Member", pl:"Members" },
		"r:has_invitee" : {sing: "Invitee", pl: "Invitees" },
		"r:has_requestor" : {sing: "Request" , pl: "Requests" },
		"r:hasRubric" : {sing: "Rubric", pl: "Rubrics"},
		"r:hasPermissioning": {sing: "Permission", pl:"Permissions"},
		"r:hasLine": {sing: "Line", pl:"Lines"}		,
		"tagging:tag": {sing:"Tag" , pl:"Tags"}
		},
	predActions : {
		'r:hasRubric' : ['addExistingObject', 'createNewObject', 'unfavorite'],
		'r:hasLine' : [] , 
		'sioc:has_member' : ['addExistingObject',  'addFromNetwork', 'lookupObject'],
		'r:has_invitee' : ['addExistingObject', 'addFromNetwork' , 'lookupObject'],
		'r:has_requestor' : [] ,
		'tagging:tag' : ['addExistingObject', 'createNewObject'],
		'r:hasPermissioning' : ['addExistingGroup', 'addExistingEntity']
	},
	predBulkActionLabels : {
		'r:has_requestor' : ['deny' , 'confirm'] 
	},
	ranges : {
		"r:hasRubric" : "r:Rubric",
		"sioc:has_member" : "sioc:User",
		"r:has_invitee" : "sioc:User",
		"r:has_requestor" : "sioc:User",
		"r:hasPermissioning" :"r:Permissioning",
		"r:hasLine" : "r:RubricLine",
		"tagging:tag" :  "tagging:Tagging"
		},
	
	expectedPreds : {
		"r:Context" : ["r:hasRubric", "r:hasPermissioning", 'tagging:tag' ] ,
		"sioc:UserGroup" : ["sioc:has_member", 'tagging:tag'],
		"r:Network" : ["sioc:has_member", 'tagging:tag'],
		"r:ConfirmationUserGroup" : ["sioc:has_member", "r:has_invitee", "r:has_requestor", 'tagging:tag'],
		"r:Rubric" : ['r:hasLine', 'tagging:tag']
	},
	prefixMap : {
		"sioc" : "http://rdfs.org/sioc/ns#",
		"foaf" : "http://xmlns.com/foaf/0.1/",
		"r" : "http://code.rubrick-jetpack.org/vocab/",
		"tagging" : "http://www.holygoat.co.uk/owl/redwood/0.1/tags/"
	},

	
	/* Working with taggings/tags */
	selectTag : function(e) {
		$(e.target).addClass('active-tag');
		var index = Rubrick.manager.activeTagURIs.indexOf($(e.target).data('uri'));
		if(index == -1) {
			Rubrick.manager.activeTagURIs.push($(e.target).data('uri'));
		}		
		
		
		var sBoxEls = $('div.po-group li');
		var poBoxEls = $('ul.po-list li');
		Rubrick.manager.filterTags(sBoxEls);
		Rubrick.manager.filterTags(poBoxEls);
			
	},
	
	unselectTag : function(e) {
		$(e.target).removeClass('active-tag');
		var index = Rubrick.manager.activeTagURIs.indexOf($(e.target).data('uri'));
		if(index != -1) {
			Rubrick.manager.activeTagURIs.splice(index, 1);	
		}
				
		var sBoxEls = $('div.po-group li');
		var poBoxEls = $('ul.po-list li');
		Rubrick.manager.filterTags(sBoxEls);
		Rubrick.manager.filterTags(poBoxEls);
				
	},
	
	filterTags : function(els) {
		
		els.each(function() {
			var uri = $(this).data('uri');			
			if (Rubrick.manager.hasActiveTag(uri)) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
	},
	
	hasActiveTag : function(uri) {
		var hasTag = false;
		Rubrick.manager.activeTagURIs.forEach(function(tagURI) {
			if(Rubrick.manager.tagURIMap[tagURI].indexOf(uri) != -1) {
				hasTag = true;
			}
		});
		return hasTag;
	},
	
	getTags : function(uri) {
		var tagURIArray = [];
		for(var tURI in Rubrick.manager.tagURIMap) {
			if (Rubrick.manager.tagURIMap[tURI].indexOf(uri) != -1 ) {
				tagURIArray.push(tURI);
			}
		}
		return tagURIArray;
	},
	/* New Resources */


	
	createNew : function(type) {
		
		if(! type  || (typeof type != 'string')  ) {		
			type = Rubrick.manager.ranges[Rubrick.manager.activePredURI];
		}
		
		$('#newDialog').dialog('option', 'title', 'Create New ' + Rubrick.manager.classURILabelMap[type].sing);
		$('#newDialog').dialog('option' , 'buttons' , {
				'Create': function() {
					var postObj = { "type" : type };
					var literals = [];
					literals[literals.length] = { p : "sioc:name" , o: $('#newName').val() };
					if(type != 'tagging:Tagging') {
						literals[literals.length] = { p : "r:description" , o: $('#newDesc').val() };
					}
					postObj.literals = literals;
					if(type == 'tagging:Tagging') {
						postObj.revURI = Rubrick.manager.activeSubjectURI;
					}
                    Rubrick.manager.postNew(postObj);
				}
			});
		$('#newDialog').dialog('open');		
	},
	
	postNew : function(postObj) {
		//AJAX
		$('#newDialog').dialog('close');
		//pretend AJAX return
		$.post(Rubrick.serverBase + 'createResource.php', 
			{jsonStr : JSON.stringify(postObj)} ,
			this.postNewCB
		);
		
	},
	
	postNewCB : function(data) {
		data = Rubrick.util.checkObject(data);
		if(! Rubrick.manager[data.type]) {
			Rubrick.manager[data.type] = new Rubrick.manager.Graph();
		}
		Rubrick.manager[data.type].mergeGraph(data.graph);
		Rubrick.manager.templateTabs();
	},
	





	/* Editing basics */
	
	editBasics : function(uri, resToEdit) {
		$('#newDialog').dialog('option', 'title', 'Edit ' + resToEdit[Rubrick.util.expandPName(Rubrick.manager.labelPred)][0].value);
		$('#newDialog').dialog('option' , 'buttons' , {
				'Update': function() {
					var oldGraph = new Rubrick.manager.Graph({});
					var newGraph = new Rubrick.manager.Graph({});
					
					oldGraph.addTriple(uri, 'sioc:name', {value: resToEdit[Rubrick.util.expandPName(Rubrick.manager.labelPred)][0].value, type: 'literal' });
					oldGraph.addTriple(uri, 'r:description', {value: resToEdit[Rubrick.util.expandPName(Rubrick.manager.descPred)][0].value, type: 'literal' });
					
					newGraph.addTriple(uri, 'sioc:name', {value: $('#newName').val(), type: 'literal'});
					newGraph.addTriple(uri, 'r:description', {value: $('#newDesc').val(), type: 'literal'});
					var postObj = {old: oldGraph.stringify(), new: newGraph.stringify() };
					postObj.uri = uri;
                    Rubrick.manager.postBasicsUpdate(postObj);
				}
			});
		$('#newDialog').dialog('open');		
		$('#newName').val(resToEdit[Rubrick.util.expandPName(Rubrick.manager.labelPred)][0].value);
		$('#newDesc').val(resToEdit[Rubrick.util.expandPName(Rubrick.manager.descPred)][0].value);		
	},

	postBasicsUpdate : function(postObj) {
		$('#newDialog').dialog('close');
		//pretend AJAX return
		$.post(Rubrick.serverBase + 'updateResource.php', 
			{jsonStr : JSON.stringify(postObj) , uri: postObj.uri} ,
			this.postBasicsUpdateCB
		);		
		
	},
	
	postBasicsUpdateCB : function(data) {
		
		
	},
	/* Working with the Subject */

	subjectDone : function() {
		Rubrick.manager.updateTriplesToCreate();
		Rubrick.manager.updateTriplesToDelete();
		Rubrick.manager.postSubjectUpdates();
	},

	selectSubject : function(e) {
		Rubrick.manager.emptyAll();		
		var target = e.target;
		Rubrick.manager.activeSubjectType = $(target).data('typeURI');
		Rubrick.manager.activeSubjectURI = $(target).data('uri');				
		var s = Rubrick.manager[Rubrick.manager.activeSubjectType].getSubject($(target).data('uri'));
		Rubrick.manager.showSubjectBasics(s);		
		Rubrick.manager.showSubjectPreds();		
		
	},

	showSubjectPreds : function() {
		$('#subject-preds-overview').empty();
		var type = Rubrick.manager.activeSubjectType;
		var sURI = Rubrick.manager.activeSubjectURI;
		var expectedPreds = Rubrick.manager.expectedPreds[Rubrick.manager.activeSubjectType];

		for (var i=0; i < expectedPreds.length; i++) {
			switch(expectedPreds[i]) {
				case 'tagging:tag':
					var oArray = [];
					var tagURIArray = Rubrick.manager.getTags(sURI);
					tagURIArray.forEach(function(tagURI) {					
						oArray.push({value: tagURI});
					});										
				break;
			
				case 'r:hasPermissioning':
					

					
				break;
				default:
					var oArray = Rubrick.manager[type].getObjectsForSubjectPred(sURI, expectedPreds[i]);	
				break;
			}
			
			if(expectedPreds[i] == 'r:hasPermissioning') {
					var newDiv = document.createElement('div');
					var header = document.createElement('h3');
					$(header).addClass('header');
					$(header).text("Permissions");
					$(newDiv).append(header);
					var perms = Rubrick.manager.perms[sURI];
					perms.forEach(function(permObj) {
							var permLabel = Rubrick.manager.allPermissions.getFirstObjectForSubjectPred(permObj.perm, 'r:permissionName', true);
							var h4 = document.createElement('h4');
							$(h4).addClass('header');
							var predEdit = document.createElement('p');
							$(predEdit).text('Edit Group');
							$(predEdit).addClass('editGroup');
							$(predEdit).data('predURI', expectedPreds[i]);
							$(predEdit).data('permURI', permObj.perm);
							$(predEdit).click(Rubrick.manager.showPredGroup);							
							$(h4).text(permLabel);
							$(newDiv).append(h4);
							$(newDiv).append(predEdit);
							var permUL = document.createElement('ul');
							$(permUL).addClass('permission-list');
							permObj.allowed.forEach(function(ent) {
									var newLI = document.createElement('li');
									$(newLI).text(Rubrick.util.getObjectLabel(ent, 'r:hasPermissioning'));
									$(permUL).append(newLI);
								});
							$(newDiv).append(permUL)
							
						
						} );					
				$('#subject-preds-overview').append(newDiv);		
			} else {
				if(oArray.forEach) {
					var newDiv = this.templateSubjectPreds(expectedPreds[i], oArray);
					$('#subject-preds-overview').append(newDiv);				
	
				} else {
					var newDiv = this.templateSubjectPreds(expectedPreds[i], []);
					$('#subject-preds-overview').append(newDiv);								
				}						
				//TODO:  above inner if might be useless?					
			}

		}
				
		
	},


	templateSubjectPreds : function(pred, objects) {
		var newDiv = document.createElement('div');
		$(newDiv).addClass('po-group');
		var header = document.createElement('h3');
		$(header).addClass('header');
		$(header).text(this.predURILabelMap[pred ].pl);
		var predEdit = document.createElement('p');
		//$(predEdit).attr('href' ,'#');
		$(predEdit).text('Edit Group');
		$(predEdit).addClass('editGroup');
		$(predEdit).data('predURI', pred);
		$(predEdit).click(this.showPredGroup);
		
		$(newDiv).append(header);
		$(newDiv).append(predEdit);
		var newUL = document.createElement('ul');
		
		
		var tagURIs = [];
		
		objects.forEach(function(obj) {
			var newLI = document.createElement('li');
			$(newLI).data('uri', obj.value);
			$(newLI).data('obj', obj);			
			$(newLI).text(Rubrick.util.getObjectLabel(obj.value, pred) );
			tagURIs = tagURIs.concat(Rubrick.manager.getTags(obj.value));
			$(newLI).addClass('resource');			
			$(newUL).append(newLI);			
			
		});
		tagURIs.forEach(function(uri) {
			var newTagLI = document.createElement('li');
			$(newTagLI).addClass('tag');
			$(newTagLI).data('uri', uri);
			$(newTagLI).toggle(Rubrick.manager.selectTag, Rubrick.manager.unselectTag);
			$(newTagLI).text(Rubrick.manager['tagging:Tag'].getFirstObjectForSubjectPred(uri, 'tagging:name', true));
			$('#tags-list').append(newTagLI);
		});

		$(newDiv).append(newUL);
		return newDiv;
	},
	

	
	
	/**
	 * showBasics
	 */

	showSubjectBasics : function (s) {
		Rubrick.manager.activeSubject = s;		
		$(".tab ul:first").hide();
		$('#basicsButton').show();		
	    $('#subject-label').text(s[Rubrick.util.expandPName(Rubrick.manager.labelPred)][0].value);
		$('#subject-desc').text(s[Rubrick.util.expandPName(Rubrick.manager.descPred)][0].value);
	},



	/* Working with the Object */


	postSubjectUpdates : function() {
		Rubrick.manager.updateTriplesToCreate();
		Rubrick.manager.updateTriplesToDelete();
		var jsonObj = {new: Rubrick.manager.triplesToCreate.stringify(), old: Rubrick.manager.triplesToDelete.stringify() };
		
		$.post(Rubrick.serverBase + 'updateSubject.php',
			   {jsonStr: JSON.stringify(jsonObj) },
			    Rubrick.manager.postSubjectUpdatesCB
			   
			   );
	},
	
	postSubjectUpdatesCB :function(data) {
		
	},
	
	templateGraphAsObjectList: function(graph, heading) {
		var newDiv = document.createElement('div');
		if(heading) {
			var newH3 = document.createElement('h3');
			$(newH3).addClass('header');
			$(newH3).text(label);			
		}
		var newUL = document.createElement('ul');
		for(var sURI in graph.json) {
			var label = graph.getFirstObjectForSubjectPred(sURI, 'sioc:name', true);
			var newLI = document.createElement('li');
			$(newLI).text(label);
			$(newUL).append(newLI);
		}
		newDiv.append(newUL);
		return newDiv;
	},

	/* Working with the Predicate-Objects */

	updateTriplesToCreate : function() {		
		var addSpans = $('span.po-add');
		addSpans.each(function() {
			var li = this.parentNode;
			var obj = {value: $(li).data('uri'), type: 'uri'};			
			if( $('input', this).attr('checked') ) {
				Rubrick.manager.triplesToCreate.addTriple(Rubrick.manager.activeSubjectURI, Rubrick.manager.activePredURI, obj );
			} else {
				Rubrick.manager.triplesToCreate.removeTriple(Rubrick.manager.activeSubjectURI, Rubrick.manager.activePredURI, obj );
			}
		});
		
	},
	
	updateTriplesToDelete : function() {
		var removeSpans = $('span.po-remove');
		removeSpans.each(function() {
			var li = this.parentNode;			
			var obj = {value: $(li).data('uri'), type: 'uri'};
			if( $('input', this).attr('checked') ) {
				Rubrick.manager.triplesToDelete.addTriple(Rubrick.manager.activeSubjectURI, Rubrick.manager.activePredURI, obj );
			} else {
				Rubrick.manager.triplesToDelete.removeTriple(Rubrick.manager.activeSubjectURI, Rubrick.manager.activePredURI, obj );
			}
		});		
		
	},

	toggleAddTriple : function(e) {
		//alert($(e.target).attr('checked'));
		var li = e.target.parentNode.parentNode;
		var obj = {value: $(li).data('uri'), type: 'uri'};
		if($(e.target).attr('checked') && $('span.po-remove input', li).attr('checked') ) {
			$('span.po-remove input', li).attr('checked', '');
		}

		
	},
	
	toggleRemoveTriple : function(e) {
		//alert($(e.target).attr('checked'));
		var li = e.target.parentNode.parentNode;
		$('span.po-add input', li).attr('checked', '');
		var obj = {value: $(li).data('uri'), type: 'uri'};
		if($(e.target).attr('checked') && $('span.po-add input', li).attr('checked')  ) {
			$('span.po-add input', li).attr('checked', '');
		} 
		
	},

	showObject : function(e) {
		alert('showObject');
		var obj = $(e.target).data('obj');		
		var testDiv = Rubrick.manager.templatePO(obj[Rubrick.manager.labelPred], obj);
		$('#pos-container').append(testDiv);
	},

	updatePOHeader : function() {
		$('#predicates-container div.header p').hide();
		Rubrick.manager.predActions[Rubrick.manager.activePredURI].forEach(function(action) {
			$('#' + action).show();			
		}) ;
	
		$('.actionObjectType').text(Rubrick.manager.classURILabelMap[Rubrick.manager.ranges[Rubrick.manager.activePredURI]].sing);
		$('#group-header').show();
		if(Rubrick.manager.predBulkActionLabels[Rubrick.manager.activePredURI]) {
			$('#remove-label').text(Rubrick.manager.predBulkActionLabels[Rubrick.manager.activePredURI][0]);
			$('#add-label').text(Rubrick.manager.predBulkActionLabels[Rubrick.manager.activePredURI][1]);			
		} else {
			$('#remove-label').text('Remove');
			$('#add-label').text('Add');
		}
		
	},
	showPredGroup : function(e) {
		Rubrick.manager.updateTriplesToCreate();
		Rubrick.manager.updateTriplesToDelete();
		$('#pos-container').empty();
		$('#object-quick-add-list').empty();
		var pred = $(e.target).data('predURI');
		var permURI = $(e.target).data('permURI');
		
		switch(pred) {
			case 'tagging:tag':
				var objects = [];
				var tagURIArray = Rubrick.manager.getTags(Rubrick.manager.activeSubjectURI);
				tagURIArray.forEach(function(tagURI) {					
					objects.push({value: tagURI});
				});									
			break;
		
			case 'r:hasPermissioning':
				
				var objects = Rubrick.manager.getPermissionObjects(permURI);
				
			break;
		
			default:
				var objects = Rubrick.manager[Rubrick.manager.activeSubjectType].getObjectsForSubjectPred(Rubrick.manager.activeSubjectURI, pred);						
			break;
			
		}
		
		var newUL = document.createElement('ul');		
		Rubrick.manager.activePredURI = pred;
		Rubrick.manager.updatePOHeader();

		$(newUL).addClass('po-list');
		if(objects) {
			objects.forEach(function(obj) {
					$(newUL).append(this.templateObject(pred, obj, true ) );
				}, Rubrick.manager);
		}
		$('#pos-container').append(newUL);
		
	},
	getPermissionObjects : function(permURI) {
		
		var permsArray = Rubrick.manager.perms[Rubrick.manager.activeSubjectURI];
		var currPerms = [];
		
		permsArray.forEach(function(permObj) {			
			if(permObj.perm == permURI) {
				
				currPerms = currPerms.concat(permObj.allowed);
			}
		});
		var permObjs = [];
		
		currPerms.forEach(function(permURI) {
			permObjs.push({value: permURI , type: 'uri'});
		});
		return permObjs;
	},

	addExisting : function(e, type) {
		$('#object-quick-add-list').empty();
		if (! type) {
			type = Rubrick.manager.ranges[Rubrick.manager.activePredURI];
			
		}
		
		if(type == 'tagging:Tagging') {
			type = 'tagging:Tag';
		}

		if(Rubrick.manager[type]) {
			var uris = Rubrick.manager[type].getSubjectURIs();
			uris.forEach(function(uri) {
				if( ! (Rubrick.manager.inPOList(uri, 'ul.po-list li') || Rubrick.manager.inPOList(uri, '#object-quick-add-list li'))) {
					var newLI = document.createElement('li');
					$(newLI).text(Rubrick.util.getObjectLabel(uri, false, type) );
					
					$(newLI).data('uri', uri);					
					
					$(newLI).addClass('resource');
				    $(newLI).click(Rubrick.manager.selectObject);
					$('#object-quick-add-list').append(newLI);
				}
			});
		}		
	},
	addExistingGroup : function(e) {
		Rubrick.manager.addExisting(e, 'r:ConfirmationUserGroup');
		
	},
	addExistingEntity : function(e) {
		Rubrick.manager.addExisting(e, 'allEntities');
	},
	inPOList : function (uri, selector) {
		var inList = false
		$(selector).each(function(index) {
				if( $(this).data('uri') == uri ) {					
					inList = true;
				}			
			});
		return inList;
	},
	
	selectObject : function(e) {
		var uri = $(e.target).data('uri');
		var obj = {value : uri, type: 'uri'};		
		if(! Rubrick.manager.inPOList(uri,'ul.po-list li' )) {			
			var newLI = Rubrick.manager.templateObject(Rubrick.manager.activePredURI, obj, true);
			$('.po-add input', newLI).addClass('checked');
			$('.po-add input', newLI).attr('checked', 'checked');
			$('ul.po-list').append(newLI);
		}
		
	},


	templateObject : function(pred, obj, withAdd) {
		var newLI = document.createElement('li');
		newLI.id = obj.value;
		$(newLI).addClass('poObject');		
		$(newLI).data('triple', {s: Rubrick.manager.activeSubjectURI, p: pred, o: obj.value});
		$(newLI).data('uri', obj.value);
		var newLabel = document.createElement('label');
		//$(newLabel).text(data[Rubrick.manager.labelPred]);
		$(newLabel).text(Rubrick.util.getObjectLabel(obj.value) );
		
		$(newLabel).addClass('po-label');
		$(newLI).append(newLabel);
		var removeCheckSpan = document.createElement('span');
		var removeCheck = document.createElement('input');
		$(removeCheck).click(Rubrick.manager.toggleRemoveTriple);
		$(removeCheck).attr('type', 'checkbox');
		$(removeCheckSpan).addClass('po-remove');
		$(removeCheckSpan).append(removeCheck);
		$(newLI).append(removeCheckSpan);
		if(withAdd === true) {
			var addCheckSpan = document.createElement('span');
			var addCheck = document.createElement('input');
			$(addCheck).attr('type', 'checkbox');
			$(addCheck).click(Rubrick.manager.toggleAddTriple);
			$(addCheckSpan).addClass('po-add');
			$(addCheckSpan).append(addCheck);
			$(newLI).append(addCheckSpan);			
		}
		return newLI;
		
	},
	
	askTriples : function() {
		var triples = {};
		$('.poObject').each(function(i) {
				triples[this.id] = this.data('triple');
			});
		
		if($(els).data('triple')) {
			var data = $(el).data('triple');
			$.post(Rubrick.serverBase + "askTriple",
				  { data : JSON.stringify(triples) },
				  Rubrick.manager.askTripleCB
				  );
		}
	},
	
	askTriplesCB : function(data) {
		data = Rubrick.util.checkObject(data);
		if(data.status == 'ok') {
			data.inStore.each(function(i) {
				$('#' + i).addClass('in-store');	
			})
			
			
		}
	},





	init : function () {		
		this.getAvailableResources();
		
		var allPermissionsObj = {
					"http://code.rubrick-jetpack.org/vocab/record" : {
					  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
						{ "value" : "http://code.rubrick-jetpack.org/vocab/Permission", "type" : "uri" }
					  ],
					  "http://code.rubrick-jetpack.org/vocab/permissionName" : [
						{ "value" : "record", "type" : "literal" }
					  ]
					},
				  
					"http://code.rubrick-jetpack.org/vocab/viewRecordings" : {
					  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
						{ "value" : "http://code.rubrick-jetpack.org/vocab/Permission", "type" : "uri" }
					  ],
					  "http://code.rubrick-jetpack.org/vocab/permissionName" : [
						{ "value" : "viewRecordings", "type" : "literal" }
					  ]
					},
				  
					"http://code.rubrick-jetpack.org/vocab/getReport" : {
					  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
						{ "value" : "http://code.rubrick-jetpack.org/vocab/Permission", "type" : "uri" }
					  ],
					  "http://code.rubrick-jetpack.org/vocab/permissionName" : [
						{ "value" : "getReport", "type" : "literal" }
					  ]
					},
				  
					"http://code.rubrick-jetpack.org/vocab/addRubric" : {
					  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
						{ "value" : "http://code.rubrick-jetpack.org/vocab/Permission", "type" : "uri" }
					  ],
					  "http://code.rubrick-jetpack.org/vocab/permissionName" : [
						{ "value" : "addRubric", "type" : "literal" }
					  ]
					},
				  
					"http://code.rubrick-jetpack.org/vocab/submitItems" : {
					  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
						{ "value" : "http://code.rubrick-jetpack.org/vocab/Permission", "type" : "uri" }
					  ],
					  "http://code.rubrick-jetpack.org/vocab/permissionName" : [
						{ "value" : "submitItems", "type" : "literal" }						
					  ]
					} 
				  };
		var allEntitiesObj = {
			"http://code.rubrick-jetpack.org/vocab/creator" : {
			  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
				{ "value" : "http://code.rubrick-jetpack.org/vocab/Entity", "type" : "uri" }
			  ] ,
			  "http://rdfs.org/sioc/ns#name" : [
				{ "value" : "Creator", "type" : "literal" }
			  ]
			},		  
			"http://code.rubrick-jetpack.org/vocab/all" : {
			  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
				{ "value" : "http://code.rubrick-jetpack.org/vocab/Entity", "type" : "uri" }
			  ],
  			  "http://rdfs.org/sioc/ns#name" : [
				{ "value" : "Everyone", "type" : "literal" }
			  ]			  
			} 
		  };
		Rubrick.manager.allEntities = new Rubrick.manager.Graph(allEntitiesObj);
		Rubrick.manager.allPermissions = new Rubrick.manager.Graph(allPermissionsObj);
		
		$('#group-header').hide();
		$('.nav-items-list').hide();
		$('.tab').mouseenter(Rubrick.manager.showTab);
		$('.tab').mouseleave(Rubrick.manager.hideTab);
		this.triplesToCreate = new this.Graph({});
		this.triplesToDelete = new this.Graph({});
		
		this['tagging:Tag'] = new this.Graph();
		$('#po-add-all').change(function ()
						{
							if(!$(this).hasClass("checked"))
							{
								//do stuff if the checkbox isn't checked
								$('span.po-add input').attr('checked', 'checked');
								$(this).addClass("checked");
								return;
							}
						
							//do stuff if the checkbox isn't checked
							$('span.po-add input').attr('checked', '');
							$(this).removeClass('checked');
						});
		
		$('#po-remove-all').change(function ()
						{
							if(!$(this).hasClass("checked"))
							{
								//do stuff if the checkbox isn't checked
								$('span.po-remove input').attr('checked', 'checked');
								$(this).addClass("checked");
								return;
							}
						
							//do stuff if the checkbox isn't checked
							$('span.po-remove input').attr('checked', '');
							$(this).removeClass('checked');
						});

		$('#addExistingObject').click(Rubrick.manager.addExisting);
		$('#createNewObject').click(Rubrick.manager.createNew);
		$('#addFromNetwork').click(Rubrick.manager.addFromNetwork);
		$('#addExistingGroup').click(Rubrick.manager.addExistingGroup);
		$('#addExistingEntity').click(Rubrick.manager.addExistingEntity);
		//$('#addKnownUser').click(Rubrick.manager.addKnownUser);//TODO: same as addFromNetwork?
		$('#subject-done').click(Rubrick.manager.subjectDone);
		this.emptyAll();
		
		
	},


	/**
	 * expandPName
	 * @param pname
	 */

/* AJAX */

	getAvailableResources : function() {
		$.post(Rubrick.serverBase + 'getAvailableContexts.php',
			{  },
			this.getAvailableResourcesCB  
			);
	},

/* Callbacks */

	getAvailableResourcesCB : function(data) {
		data = Rubrick.util.checkObject(data);
		for (var prop in data) {
			switch(prop) {
				case 'tagURIMap':
				case 'perms':
					Rubrick.manager[prop] = data[prop];	
				break;
				default:
					Rubrick.manager[prop] = new Rubrick.manager.Graph(data[prop]);
				break;
			}
			
		}
		Rubrick.manager.templateTabs();
	},

	expandPName : function (pname) {
	    var parts = pname.split(':');
		if (Rubrick.manager.prefixMap[parts[0]]) {
			return Rubrick.manager.prefixMap[parts[0]] + parts[1];
		}
		return pname;
	},
	
	/**
	 * templateTabs	 
	 */

	rangeIsLiteral : function(pred) {
		return false;
	},

	templateTabs : function () {
		$('#rubrics-tab ul').empty();
		$('#contexts-tab ul').empty();
		$('#groups-tab ul').empty();
		$('#profile-tab ul').empty();
		templateGraph("r:Context",'#contexts-tab ul' );
		templateGraph('r:Rubric', '#rubrics-tab ul' );
		templateGraph('r:ConfirmationUserGroup', '#groups-tab ul');
		templateGraph('r:Network', '#networks-tab ul');
		
		function templateGraph(graph, selector) {
			if(Rubrick.manager[graph]) {
				 
				 var rubricURIs = Rubrick.manager[graph].getSubjectURIs();
	 
				 for each (var uri in rubricURIs) {				
					  var newLI = document.createElement('li');				 
					  $(newLI).text(Rubrick.manager[graph].getFirstObjectForSubjectPred(uri, Rubrick.manager.labelPred, true));
					 // $(newLI).text(this["r:Rubric"][uri][Rubrick.manager.labelPred]);
					  $(newLI).click(Rubrick.manager.selectSubject);			
					  $(newLI).addClass('resource');
					  $(newLI).data('uri', uri);
					  $(newLI).data('typeURI', graph);
					  $(selector).append(newLI);		
				 }
			}
		}

//TODO: profile template?
	},
		
	emptyAll : function () {
		$('#subject-preds-overview').empty();
		$('#tags-list').empty();
		$('#subject-preds-overview').empty();
		$('#pos-container').empty();
		$('#object-quick-add-list').empty();
		$('#predicates-container div.header p').hide();
		$('#group-header').hide();
		$('#addExistingObject').hide();
		$('#createNewObject').hide();
		$('#basicsButton').hide();
	},
	
	hideTab : function(e) {
		var t = e.target;		
		while( ! $(t).hasClass('tab')) {
			t = t.parentNode;			
		}
		$("ul:first", t).hide();
	},
	
	showTab : function(e) {
		$("ul:first", e.target).show();				

	},
	
	Graph : function(json) {
		this.json = json ? json : {};
	
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
		
		this.getObjectsForSubjectPred = function(sURI, pURI) {
			sURI = this.expandPName(sURI);
			pURI = this.expandPName(pURI);
			
			if(this.hasSubject(sURI) && this.hasSubjectPred(sURI, pURI)) {
				return this.json[sURI][pURI];
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
			
			
			var hasObject = false;
			var objects = this.getObjectsForSubjectPred(sURI, pURI);			
			if(objects) {
				
				objects.forEach(function(obj) {
					if(obj.value == o.value) {
						hasObject = true;
					}
				});
			} 
			
			/*
			if ( objects && (objects.indexOf(o) != -1 ) ) {
				return true;
			}
			*/
			
			return hasObject;
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
			if ( Rubrick.manager.prefixMap[parts[0]] && (parts[0] != 'http') ) {
				return Rubrick.manager.prefixMap[parts[0]] + parts[1];
			}
			return pname;
		}	
	
		this.mergeGraph = function(graph) {
			for (var s in graph) {
				for (var p in graph[s]) {
					for each (o in graph[s][p]) {
						this.addTriple(s, p, o);
					}
				}
				
			}
		}
	

		this.extractSubjectAsGraph = function(sURI) {
			var json = {};
			json[sURI] = this.json[sURI];
			return new Rubrick.manager.Graph(json);
		}
		this.extractSubjectPredAsGraph = function(sURI, pURI) {
			var json = {};
			json[sURI] = {};
			json[sURI][pURI] = this.getObjectsForSubjectPred(sURI, pURI);
			return new Rubrick.manager.Graph(json);
		}
	}
	
}

