a = ['a', 'b', 'c', 'd', 'e'];

Rubrick = {};
Rubrick.baseURL = "http://localhost/testJS/jetpacks/rubrick/";
Rubrick.util = {};
Rubrick.util.checkObject = function(data) {
			if(typeof data != 'object') {
				return eval('(' + data + ')');
			}
			return data;

		};

Array.prototype.moveItemUp = function (item) {
		var ind = this.indexOf(item);
		if(ind != 0) {
			this.splice(ind, 1);
			this.splice(ind-1, 0, item);			
		}		
	};
Array.prototype.moveItemDown = function (item) {
		var ind = this.indexOf(item);
		if(ind != this.length-1) {
			this.splice(ind, 1);
			this.splice(ind+1, 0, item);			
		}		
	};


extend = function(child, sup) {
  for (var property in sup.prototype) {
    if (typeof child.prototype[property] == "undefined")
      child.prototype[property] = sup.prototype[property];
  }
}
Graph = function(json) {
		this.json = json ? json : {};
		this.prefixMap = {
			"sioc" : "http://rdfs.org/sioc/ns#",
			"foaf" : "http://xmlns.com/foaf/0.1/",
			"r" : "http://code.rubrick-jetpack.org/vocab/",
			"dcterms" : "http://purl.org/dc/terms/",
			"tagging" : "http://www.holygoat.co.uk/owl/redwood/0.1/tags/",
			"xsd" : "http://www.w3.org/2001/XMLSchema#",
			"rdf" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
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
			var str = JSON.stringify(this.json);
			return str.replace(',null', '');
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
			
			if( o == null ) {
				
				return;
			}
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
			sURI = this.expandPName(sURI);
			var json = {};
			if(this.json[sURI]) {
				json[sURI] = this.json[sURI];
				return new Graph(json);				
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
			sURI = this.expandPName(sURI);
			pURI = this.expandPName(pURI);
			var json = {};
			json[sURI] = {};
			json[sURI][pURI] = this.getObjectsForSubjectPred(sURI, pURI);
			return new Graph(json);
		}

		
		/**
		 * getPredObjectValueAsGraph returns a graph of the resource with the predicate and value
		 *
		 */
		 
		this.getPredObjectValueAsGraph = function(pURI, oValue) {
			pURI = this.expandPName(pURI);
			oValue = this.expandPName(oValue);
			var retGraph = new Graph();
			for(var sURI in this.json) {
				if(this.hasTriple(sURI, pURI, oValue)) {
					//retGraph.addTriple(sURI, pURI, this.getObjectByValue(oValue));
					var tmpJSON = {};
					tmpJSON[sURI] = this.json[sURI];
					var sGraph = new Graph(tmpJSON);
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
	}
	



Field = function(sURI, graph, doc) {
	this.graph = graph ? graph : false;
	this.doc = doc ? doc : document;
	
	if( (! this.sURI) && (this.graph.subjectsCount() == 1 ) ) {
		this.sURI = this.graph.getSubjectURIs()[0];
	}	
	
	containerNode : this.doc.createElement(this.containerElName);

};

Field.prototype = {
	graph : {},
	isUpdated : true, //TODO: work out the editing of new content so I don't have to assume everything is updated
	doc : {},
	
	containerNode : {},
	
	containerClass : '',
	
	sURI : false,
	
	valueDisplayPred : 'dcterms:description',
	
	valueDisplayElName : 'p',
	valueDisplayClass : 'value',
	
	labelDisplayElName : 'h2',
	labelDisplayClass : 'label',
	labelPred : 'dcterms:title',
	
	valueInputElName : 'textarea',
	
	labelInputElName : 'input',
	
	labelInputElType : 'text',
	
	containerElName : 'div',
	
	isEditable : true,
	
	isEditing : false,
	
	containerNode : {},

	
	template : function() {

		var fieldWrapper = document.createElement('div');
		
			$(fieldWrapper).addClass('field-wrapper');
			if(this.labelPred) {
				var headerText = this.graph.getFirstObjectForSubjectPred(this.sURI, this.labelPred, true);
				
				if(headerText) {
					var header = this.doc.createElement(this.labelDisplayElName);
					$(header).text(headerText);
					$(header).addClass(this.labelDisplayClass);
					$(fieldWrapper).append(header);
				}
			}
			

			var valDisplay = this.doc.createElement(this.valueDisplayElName);
			
			if(this.valueDisplayPred) {
				var displayVal = this.graph.getFirstObjectForSubjectPred(this.sURI, this.valueDisplayPred, true);
				if(displayVal) {
					$(valDisplay).text(displayVal);
				} else if(this.isEditable) {
					$(valDisplay).text('Double-click to edit');	
				}
				
				$(valDisplay).addClass(this.valueDisplayClass);
				$(fieldWrapper).append(valDisplay);	
			}
			
		
		return fieldWrapper;
	},
	show : function() {
		if(this.container) {
			$(this.container).append(this.template());
			$(this.container).show();
		} else {
			throw "No Container defined for field";
		}
		
	},
	
	buildGraph : function() {
		
	},
	
	replaceValue : function(newVal) {
		if(this.valueDisplayPred) {				
			this.graph.removeSubjectPred(this.sURI, this.valueDisplayPred);
			this.graph.addTriple(this.sURI, this.valueDisplayPred, {value: newVal, type: 'literal'});		
		} else if(this.labelPred) {
			this.graph.removeSubjectPred(this.sURI, this.labelPred);
			this.graph.addTriple(this.sURI, this.labelPred, {value: newVal, type: 'literal'});					
		}
		
	}
}

RubricLineValueField = function(sURI, graph, doc) {
	Field.apply(this, arguments);
	this.isEditable = true;
	
	};
RubricLineValueField.prototype = {
	valueDisplayPred : 'r:description',
	labelPred : 'sioc:name',
	isEditable : true,
	
	template : function() {
		var el = Field.prototype.template.apply(this);		
		$(el).data('manager', this);
		if(this.isEditable) {
			$(el).addClass('editable');
			var doneButton = this.doc.createElement('p');
			$(doneButton).addClass('done-button');
			$(doneButton).text('Done');
			$(doneButton).click(function() {
				var manager = $(this.parentNode).data('manager');
				var newVal = $('.edit-field', this.parentNode).val();
				if(newVal != '') {
					manager.replaceValue(newVal);	
				} else {
					alert('Please give a description');
					return;
				}
				
				$(this.parentNode).removeClass('editing');
				manager.isUpdated = true;
				//need a better way to decide which node to switch around
	
				$('p.value', this.parentNode).text(manager.graph.getFirstObjectForSubjectPred(manager.sURI, manager.valueDisplayPred, true) );
				$(this.parentNode).remove('textarea');
				$(doneButton).hide();
			});
			$(doneButton).hide();
			$(el).append(doneButton);
			
		} else {
			//deal with uneditable fields
		}
		
		$(el).dblclick(function(e) {
			//begin editing
			$('.done-button', this).show();
			var manager = $(this).data('manager');
			var inp = manager.doc.createElement('textarea');
			//alert(manager.sURI + "  " + manager.displayValuePred);
			var txt = manager.graph.getFirstObjectForSubjectPred(manager.sURI, manager.valueDisplayPred, true) ;
			if(txt) {
				$(inp).text();	
			} else {
				$(inp).text('(Double-click to edit)');
			}
			
			$(inp).addClass('edit-field');
			$(el).addClass('editing');
		
			$('p.value', el).text('');
			$('p.value', el).append(inp);
		});
		$(el).click(function(e) {		
			var g = $(this).data('graph');			
			e.stopPropagation();
			});
		return el;
	}
}
extend(RubricLineValueField, Field);

RubricLineMetaField = function(sURI, graph, doc) {
	RubricLineValueField.apply(this, arguments);
	this.isEditable = true;
}
RubricLineMetaField.prototype = {
	isUpdated : true,
	template : function() {
		var el = Field.prototype.template.apply(this);
		
		$(el).data('manager', this);
		if(this.isEditable) {
			$('h2', el).addClass('editable');
			$('p.value', el).addClass('editable');
			$(el).addClass('editable');
			var doneButton = this.doc.createElement('p');
			$(doneButton).addClass('done-button');
			$(doneButton).text('Done');
			$(doneButton).click(function() {
				var manager = $(this.parentNode).data('manager');
				if(manager.valueDisplayPred) {
					var txt = manager.graph.getFirstObjectForSubjectPred(manager.sURI, manager.valueDisplayPred, true);
					var sel = 'p.value';
					var pred = manager.valueDisplayPred;
				} else if(manager.labelPred) {
					var txt = manager.graph.getFirstObjectForSubjectPred(manager.sURI, manager.labelPred, true);
					var sel = 'h2';
					var pred = manager.labelPred;
				}
				
				var newVal = $('.edit-field', this.parentNode).val();
				
				if(newVal != '') {

					manager.replaceValue(newVal);

				} else {
					alert('Please give some text');
					return;
				}
				
				$(this.parentNode).removeClass('editing');
				manager.isUpdated = true;
				//need a better way to decide which node to switch around
				$(doneButton).hide();
				

				$(sel, this.parentNode).text(manager.graph.getFirstObjectForSubjectPred(manager.sURI, pred, true) );
				$(this.parentNode).remove('textarea');
				
			});
			$(el).append(doneButton);
			$(doneButton).hide();
		} else {
			//deal with uneditable fields
		}
		
		$(el).dblclick(function(e) {
			//begin editing
			
			$('.done-button', this).show();
			var manager = $(this).data('manager');
			var inp = manager.doc.createElement('textarea');
			if(manager.valueDisplayPred) {
				var txt = manager.graph.getFirstObjectForSubjectPred(manager.sURI, manager.valueDisplayPred, true);
				var sel = 'p.value';
			} else if(manager.labelPred) {
				var txt = manager.graph.getFirstObjectForSubjectPred(manager.sURI, manager.labelPred, true);
				var sel = 'h2';				
			}
			
			if(txt) {
				$(inp).text(txt);	
			} else {
				$(inp).text('(Double-click to edit)');
			}
			
			$(inp).addClass('edit-field');
			$(el).addClass('editing');
		
			$(e.target, el).text('');
			$(e.target, el).append(inp);
		});
		
		return el;
	}
}
extend(RubricLineMetaField, RubricLineValueField);

Container = function(sURI, graph, doc) {
	
	this.graph = graph ? graph : false;
	this.doc = doc ? doc : document;
	//this.containerNode = containerNode ? containerNode : {};
	if( (! this.sURI) && (this.graph.subjectsCount() == 1 ) ) {
		this.sURI = this.graph.getSubjectURIs()[0];
	} else {
		this.sURI = sURI;
	}

};
Container.prototype = {
	rels : {},
	relPred : '',
	sURI : '',
	graph : {} ,
	containerClass : '',
	containerNode  : {},
	relElName : '',
	relType : Field,
	

	reset : function () {
		this.rels = this.buildRels(this.relsGraph);
		
	} ,
	
	templateRels : function() {

	},
	showRels : function() {	},
	
	showRel : function(relURI) {
		
		
	},
	
	show : function() {
		
		
	},
	
	templateRel : function(relURI) {
		return this.rels[relURI].template();
	},

	buildGraph : function() {

	},

	buildRels : function() {
		var rels = {};		
		var relURIs = this.graph.getObjectsForSubjectPred(this.sURI, this.relPred, true);
		
		relURIs.forEach(function(relObj) {
				if(relObj.type == 'uri') {
					var relGraph = this.graph.getSubjectAsGraph(relObj.value);
					
					if(relGraph) {
						rels[relObj.value] = (new this.relType( relObj.value, relGraph) );
					}					
				}				
			}, this);
		return rels;
	},

	addRelByURI : function(relURI) {
		this.addRel(new this.relType({}, relURI))
	},
	addRel : function(rel) {

		this.rels[rel.sURI] = rel;			
	}
	
}

RubricLineContainer = function(sURI, graph, doc){
	Container.apply(this, arguments);
	
}
RubricLineContainer.prototype = {
	relElName : 'td',
	relPred : 'r:hasLineValue' ,
	labelDisplayElName : 'h3',
	valueDisplayElName : 'p' ,
	isUpdated : true,
	relType : RubricLineValueField ,
	show : function() {

	},

	template : function() {
		
		var tr = this.doc.createElement('tr');
		$(tr).addClass('rubrick-line');
		var td = this.doc.createElement('td');
		var labelField = new RubricLineMetaField(this.sURI, this.graph.getSubjectPredAsGraph(this.sURI, 'sioc:name'));
		labelField.isEditable = true;
		
		labelField.labelPred = 'sioc:name';
		labelField.valueDisplayPred = false;
		$(td).append(labelField.template());

		var descField = new RubricLineMetaField(this.sURI, this.graph.getSubjectPredAsGraph(this.sURI, 'r:description'));
		descField.isEditable = true;
		descField.valueDisplayPred = 'r:description';
		descField.labelPred = false;
		
		this.rels.label = labelField;
		this.rels.description = descField;
		
		$(td).append(descField.template());

		$(tr).append(td);

		for (var relURI in this.rels) {
			if( ! ( ( relURI == 'label') || (relURI == 'description') ) ) {
				$(tr).append(this.templateRel(relURI));				
			}

		}

		return tr;
	},
	templateRel : function(relURI) {
		
		var td = this.doc.createElement('td');
		$(td).append(this.rels[relURI].template());
		return td;
	},
	buildRels : function() {
		var rels = {};		
		
		var relURIs = this.graph.getObjectsForSubjectPred(this.sURI, this.relPred, true);
		
		relURIs.forEach(function(relURI) {				
				if(relURI) {					
					var relGraph = this.graph.getSubjectAsGraph(relURI);
					if(relGraph) {						
						rels[relURI] = new RubricLineValueField( relURI, relGraph);
					}					
				}
			}, this);
		
		return rels;
	},
	
	buildNewGraph : function() {
		var newGraph = new Graph();
		for each(var rel in this.rels) {
			if(rel.isUpdated) {
				newGraph.mergeGraph(rel.graph);				
			}
			
		}
		return newGraph;
	}



}
extend(RubricLineContainer, Container);


RubricContainer = function(sURI, graph, doc) {
	Container.apply(this, arguments);		
	this.buildRels();
	this.linesOrder = [];

}
RubricContainer.prototype = {
	relElName : 'tr' ,
	relPred : 'r:hasLine' ,
	relType : RubricLineContainer ,
	
	linesOrder : [],

	
	/**
	 * buildRels takes the graph and builds up the RubricLines and RubricLineValues. The graph needs to contain all that data
	 *
	 */
	buildRels : function() {
		
		var rubricLineURIs = this.graph.getObjectsForSubjectPred(this.sURI, 'r:hasLine', true);
		if(rubricLineURIs.forEach) {
			rubricLineURIs.forEach(function(rlURI) {
					//cheesy hack around a bug somewhere in merging the graphs.
					//sometimes uri is undefined				
					if(rlURI) {		
						//build up the graph for the new RubricLineContainer
						//test.push(rlURI);
						var rlGraph = this.graph.getSubjectAsGraph(rlURI);
						
						//get its line values as well
						rlGraph.mergeGraph(this.graph.getSubjectTypeAsGraph('r:RubricLineValue'));
						var newRLContainer = new RubricLineContainer(rlURI, rlGraph);
						
						newRLContainer.buildRels();
						this.addRel(newRLContainer);
					}	
				}, this);			
				
			}

	},	
	moveLineUp : function (lineURI) {
		this.linesOrder.moveItemUp(lineURI);
		this.updateRubricLineOrders();
		
	},
	
	moveLineDown : function (lineURI) {
		this.linesOrder.moveItemDown(lineURI);
		this.updateRubricLineOrders();
	},
	
	updateRubricLineOrders : function() {
		var rlURIs = this.graph.getSubjectURIsByType('r:RubricLine');
		rlURIs.forEach(function(rlURI) {
				this.graph.removeSubjectPred(rlURI, 'r:order');
				var orderVal = this.linesOrder.indexOf(rlURI);
				var oObj = { value : orderVal, type:'literal' , datatype:'xsd:Integer' };
				this.graph.addTriple(rlURI, 'r:order', oObj);
			}, this);
		
		
	},
/*	
	setLinesOrder : function() {
		var hash = this.relsGraph.getSubjectObjectValuesHashAroundPred('r:order');
		return hash ; 		
	},
*/	
	addRubricLine : function() {
		currRubricContainer = this;
		$.post(Rubrick.baseURL + 'createResource.php',
			   {jsonStr: ' {"type" : "r:RubricLine"}'  },
			   this.finishAddRubricLine); 		
	},
	

	finishAddRubricLine : function(data) {
		data = Rubrick.util.checkObject(data);
		
		var newRL = new RubricLineContainer(data.uri, new Graph(data.graph));
		currRubricContainer.rels[newRL.sURI] = newRL;
		currRubricContainer.graph.mergeJSON(data.graph);
		currRubricContainer.linesOrder.push(data.uri);
		currRubricContainer.buildRels();
		var table = currRubricContainer.template();		
		$('#rubric-table').replaceWith(table);
		
	},

	show : function() {
		$('#wrapper', this.doc.body).append(this.template());
		
	},	
	
	template : function(){		
		var table = this.doc.createElement('table');
		$(table).data('graph', this.graph);
		$(table).attr('id', 'rubric-table');
		var thead = this.doc.createElement('thead');
		var rName = this.doc.createElement('th');
		
		$(thead).append('<tr><th>' + this.graph.getFirstObjectForSubjectPred(this.sURI, 'sioc:name', true) + '</th>' +this.graph.getFirstObjectForSubjectPred(this.sURI, 'r:description', true) + '</tr>');
		$(thead).append('<tr><th>Rubick Line</th><th>0 Points</th><th>1 Points</th><th>2 Points</th><th>3 Points</th><th>4 Points</th></tr>');
		$(table).append(thead);
		$(table).addClass('rubric-table');

		var tbody = this.doc.createElement('tbody');
		for(var relURI in this.rels) {
			this.rels[relURI].rels = this.rels[relURI].buildRels();
			
			$(tbody).append(this.templateRel(relURI));
		}
		$(table).append(tbody);
		return table;		
	},
	buildNewGraph : function() {
		var newGraph = new Graph();
		for each(var rlineContainer in this.rels) {
			newGraph.mergeGraph(rlineContainer.buildNewGraph());
			newGraph.addTriple(this.sURI, 'r:hasLine', rlineContainer.sURI, 'uri');
			var order = this.linesOrder.indexOf(rlineContainer.sURI);
			newGraph.addTriple(rlineContainer.sURI, 'r:order', order, 'literal');
			newGraph.addTriple(rlineContainer.sURI, 'rdf:type', 'http://code.rubrick-jetpack.org/vocab/RubricLine', 'uri');
		}
		return newGraph;
	},
	
	updateGraphs: function() {
		var newGraph = this.buildNewGraph();
		if(newGraph.subjectsCount() != 0 ) {
			$.post(Rubrick.baseURL + 'rubricEditorReplaceBasics.php',
				  {new : newGraph.stringify() }
				   
				);			
			
		}

	}	

}
extend(RubricContainer, Container);