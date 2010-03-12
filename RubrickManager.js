
Rubrick = {};

Rubrick.manager = {
	
	currSubjectURI : '',
	currPredURI : '', 
	currObjectURIs : [],
	poPairsToCreate : [],
	poPairsToDelete : [],
	predURILabelMap : {},
	classURILabelMap : {
		"sioc:User" : "Users",
		"r:Rubric" : "Rubrics",
		"sioc:UserGroup" : "Groups",
		"r:Contexts" : "Dropboxes"
		},
	
	subjectContainer : {},
	poContainer : {},
	objectContainer : {},
	classesContainer : {},
	
	classBasicPredsMap : {},
	prefixMap : {
		"sioc" : "http://rdfs.org/sioc/ns#",
		"foaf" : "",
		"r" : "http://code.rubrick-jetpack.org/vocab/",
		
	}

	/* Working with the Subject */

	/**
	 * addPO
	 * @param p
	 */

	addPO : function (p, o) {
	    
	},
	
	/**
	 * removePO
	 * @param p
	 */

	removePO : function (p) {
	    
	},
		
	/**
	 * updatePO
	 * @param removeP
	 */

	updatePO : function (removeP) {
	   // 
	},
			
	/**
	 * showBasics
	 */

	showSubjectBasics : function () {
	    
	},



	/* Working with the Object */

	/**
	 * showQuickEdit
	 */

	showObjectQuickEdit : function () {
	    
	},

	
	/**
	 * showObject
	 * @param oURI
	 */

	showObject : function (oURI) {
	    
	},

	/* Working with the Predicate-Objects

	/**
	 * showPOs
	 * @param pred
	 * @param object
	 */

	showPOs : function (pred, object) {
		 
	},

	
	addObject : function() {},
	
	updateObject : function() {},
	
			
	/**
	 * fetchAvailableResourcesByClass
	 * @param classURI
	 */

	fetchAvailableResourcesByClass : function (classURI) {
	    
	},

	/**
	 * init
	 */

	init : function () {
	    this.classesContainer = document.getElementById('nav-container');
		this.subjectContainer = document.getElementById('overview-container');
	},


	/**
	 * expandPName
	 * @param pname
	 */

	expandPName : function (pname) {
	    var parts = pname.split(':');
		if (Rubrick.manager.prefixMap[parts[0]]) {
			return Rubrick.manager.prefixMap[parts[0]] + parts[1];
		}
		return pname;
	},
	
	
}
