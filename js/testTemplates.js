Rubrick = {data: data ,

/* Utility Methods */
    util : {

        emptyNode: function(node) {
            while(node.childNodes.length != 0) {
                node.removeChild(node.firstChild);
            }
        }, 

        template : function (val, template, atts) {
            var el = document.createElement(template.el);
            el.appendChild(document.createTextNode(val));
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
		lineValNote : {el: 'p', cssClass : 'lineValNote'} ,
		lineDesc : {el: 'p', cssClass : 'lineDesc'} ,
		lineName : {el: 'h4', cssClass : 'lineName'} ,
		rubricName : {el: 'h3', cssClass : 'rubricName'} ,
		rubricDesc : {el: 'p', cssClass : 'rubricDesc'} , 
		tag : {el: 'li', cssClass : 'tag'} 

    }



};

Rubrick.displayRubric = function (data) {
	//data = eval("(" + data + ")");
	var doc = document;
    var slidebarDoc = document;
	var rDiv = doc.createElement('div');
	rDiv.setAttribute('class', 'rubricContainer');
	var metaContainer = slidebarDoc.createElement('div');
	metaContainer.setAttribute('class', 'rubricMeta');

	var rTable = doc.createElement('table');
	
	var linesContainer = doc.createElement('tbody');


	linesContainer.setAttribute('class', 'rubricLines');
	metaContainer.appendChild(Rubrick.util.template(data.rObj.name, Rubrick.templates.rubricName));
	metaContainer.appendChild(Rubrick.util.template(data.rObj.desc, Rubrick.templates.rubricDesc));


	for(var i=0; i<data.rObj.rLines.length; i++) {
		linesContainer.appendChild(Rubrick.templateLine(data.rLines[data.rObj.rLines[i]]));
	}

	if(data.recordedLinveVals) {
		for(var i=0; i<data.recordedLineVals.length; i++) {
			$('#' + data.recordedLinveVals[i]).addClass('recorded');
		}
	}

	rTable.appendChild(linesContainer);
	rDiv.appendChild(metaContainer);
	rDiv.appendChild(rTable);

	document.body.appendChild(rDiv);

}

Rubrick.templateLine = function(lineObj) {
	var doc = document;
	var lineContainer = doc.createElement('tr');
	var metaContainer = doc.createElement('td');

	if(lineObj.name) {
		metaContainer.appendChild(Rubrick.util.template(lineObj.name, Rubrick.templates.lineName));
	}

	if(lineObj.desc) {
		metaContainer.appendChild(Rubrick.util.template(lineObj.desc, Rubrick.templates.lineDesc));
	}


	lineContainer.appendChild(metaContainer);
	for (var i=0; i < lineObj.rLValues.length; i++) {
		lineContainer.appendChild(Rubrick.templateLineValue(Rubrick.data.rLineVals[lineObj.rLValues[i]]));
	}
	
	return lineContainer;
}


Rubrick.templateLineValue = function(lineValObj) {
	var doc = document;
	var lineValContainer = doc.createElement('td');
	lineValContainer.setAttribute('class', 'lineValContainer');
	lineValContainer.appendChild(Rubrick.util.template(lineValObj.desc, Rubrick.templates.lineValDesc));
	if(lineValObj.note) {
		lineValContainer.appendChild(Rubrick.util.template(lineValObj.note, Rubrick.templates.lineValNote));
	}
	return lineValContainer;
}






