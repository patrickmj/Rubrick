

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

function Rubrick.util.extend(child, sup) {
  for (var property in sup.prototype) {
    if (typeof child.prototype[property] == "undefined")
      child.prototype[property] = sup.prototype[property];
  }
}

 function Rubrick.ui.stopEvent(e) {
    if (!e) var e = window.event;

	//e.cancelBubble is supported by IE - this will kill the bubbling process.
	e.cancelBubble = true;
	e.returnValue = false;

	//e.stopPropagation works only in Firefox.
	if (e.stopPropagation) {
		e.stopPropagation();
		e.preventDefault();
	}
	return false;
}

/*
	Field
*/



function Rubrick.ui.Field(fieldName, configObj) {

	this.inputs = [];
	this.values = [];

	this.fieldName = fieldName;	
	this.container = document.createElement('div');
	this.container.setAttribute('class', 'field-container');
	this.container.setAttribute('onclick', 'this.manager.processClick(event)');


	this.displayContainer = document.createElement(this.displayContainerElement);
	this.displayContainer.setAttribute('class', 'field-display');
	this.container.appendChild(this.displayContainer);


	this.container.manager = this;
	this.processConfigObj(configObj);
	this.setJSON();

}

Rubrick.ui.Field.prototype = 	{

	recordId: null,
	container: null, 
	fieldName: null,
	displayContainerElement: 'div',
	json: null , // a string version of the json so PHP will like it.
	values: [] , 
	inputs: [], //array of elements used as inputs -- N.B.: not neccesarily <input>s
	displayContainer: null,

	setdisplayContainer: function(displayContainer) {
		this.displayContainer = displayContainer;
	},

	setJSON: function() {

		jsonStr = '{ "' + this.fieldName + '" : [ ';
		for(var i=0; i<this.values.length; i++) {
			jsonStr += '"' + encodeURIComponent(this.values[i]) +  '"  ,' ;
		}

		jsonStr = jsonStr.slice(0, jsonStr.length -1); // strip last comma
		jsonStr += '] ' ; 
		if(this.score) {
		    jsonStr += ' , "score" : "' + this.score + '"' ;
		}		
		jsonStr += ' } ';
		this.json = jsonStr;

	},

	getJSON: function() {
		this.setJSON();
		try {
			this.validate();		
			return this.json;
		} catch(e) {
			alert('Looks like something is amiss. Please check that everything is as it should be.');
			return false;
		}

	},

	updateDisplayContainer: function() {

	},

	setValues: function(values) {
		this.values = values;
	},

	addValue: function(value) {
		//TODO:  check if it already exists

		this.values[this.values.length] = value;
	},

	removeValue: function(value) {
		//this can be more efficient and clean
		for (var i=0; i<this.values.length; i++) {
			if(this.values[i] == value) {
				this.values.splice(i, 1);
			}
		}
	},

	processClick: function() {

	},

	preProcessClick: function() {

	},


	postProcessClick: function() {
		Rubrick.ui.RowsManager.setJSON();
	},


	setInputs: function(inputs) {
		this.inputs = inputs;
	},

	addInput: function(input) {
		this.inputs[this.inputs.length] = input;
	},

	removeInput: function(input) {
		if(typeof(input) != 'HTMLElement') {
			try {
				input = document.getElementById('input');
			} catch (e) {

			}
			this.displayContainer.removeChild(input);
		}
	},


	updateInputs: function() {
		this.equalizeInputsAndValues();
		for(var i=0; i< this.values.length; i++) {
			this.inputs[i].value = this.values[i];
		}
	},

	equalizeInputsAndValues: function() {
		while(this.values.length > this.inputs.length) {
			this.addInput();
		}
	},

	processInput: function(input) {

	},

	emptyDisplayContainer: function() {
		$(this.displayContainer).empty();

	},

	processInputs: function() {

		for ( var ii = 0 ; i< this.inputs.length; i++ ) {
				this.processInput(this.inputs[i]);
		}
	},

	stopPropagation: function(e) {
		//stop the event propagation
	},

	setRecordId: function(recordId) {
		this.recordId = recordId;
	},

	processConfigObj: function(configObj) {
		for(var prop in configObj) {
			this[prop] = configObj[prop];
		}
	},

	appendContainer: function(parentNode) {
		parentNode.appendChild(this.container);
	},

	insertContainerBefore: function(node) {
		node.parentNode.insertBefore(node, this.container);
	},

	validate: function(data) {

	}

}


/*
	TextField
*/



function Rubrick.ui.TextField(fieldName, configObj) {

	Rubrick.ui.Field.apply(this, arguments);

	this.container.setAttribute('onkeypress', 'this.manager.processKeyPress(event)');
	this.init();

	this.updateInputs();
	this.updateDisplayContainer();
}

Rubrick.ui.TextField.prototype = {

	editContainer: null,
	isEditing: false, 
	displayContainerElement: 'div',
	allowMultiple: false,
	inputs: [],
	values: [],


	setMultiple: function(allowMultiple) {
		this.allowMultiple = allowMultiple;

		if(allowMultiple) {

			if( ! this.addButton) {
				addButton = document.createElement('a');
				addButton.setAttribute('class', 'action-button add');		
				this.addButton = addButton;
				this.addButton.style.display = 'none';
				addButton.innerHTML = "Add";
				addButton.action = 'add';
				this.container.insertBefore(this.addButton, this.container.firstChild);
			} else {
				this.addButton = null;
			}
			
		}

	},

	toggleEditState: function() {
		this.isEditing = ! this.isEditing;
//TODO:  refactor to use jQuery
		if(this.isEditing) {
			this.editContainer.style.display = 'block';
			this.displayContainer.style.display = 'none';
			this.editButton.style.display = 'none';
			this.doneButton.style.display = 'block';
			if(this.addButton) {
				this.addButton.style.display = 'block';
			}

		} else {
			this.editContainer.style.display = 'none';
			this.displayContainer.style.display = 'block';
			this.editButton.style.display = 'block';
			this.doneButton.style.display = 'none';
			if(this.addButton) {
				this.addButton.style.display = 'none';
			}

		}
	},


	updateDisplayContainer: function() {
		this.emptyDisplayContainer();
		for(var i=0; i < this.values.length; i++ ) {
			newP = document.createElement('p');
			newP.setAttribute('class', 'field-text-display');
			newP.innerHTML = this.values[i];
			this.displayContainer.appendChild(newP);
		}
		
	},

	processKeyPress: function(event) {

		if(event.keyCode == 13) {
			stopEvent(event);
			for(var i = 0; i< this.inputs.length; i++) {
				newVal = this.inputs[i].value;
				this.values[i] = newVal;
			}
			this.updateDisplayContainer();
			this.setJSON();
			this.toggleEditState();
			this.postProcessClick();
		}
	},

	processClick: function(event) {

		if (!event) var event = window.event;

		action = event.target ? event.target.action : event.srcElement.action;

		switch ( action ) {
			case 'add':
				this.addInput();
			break;

			case 'edit':
				this.toggleEditState();
			break;

			case 'done':
				for(var i = 0; i< this.inputs.length; i++) {
					newVal = this.inputs[i].value;
					this.values[i] = newVal;
				}
				this.updateDisplayContainer();
				this.setJSON();
				this.toggleEditState();
			break;

			default:

			break;
		}
		Field.prototype.postProcessClick.call(this);
	},



	addInput: function(input) {
		Field.prototype.addInput.call(this, input);
		this.editContainer.appendChild(input);
	},

	createButtons: function() {
		editButton = document.createElement('a');
		editButton.action = 'edit';
		editButton.setAttribute('class', 'action-button edit');

		editButton.innerHTML = "Edit";

		doneButton = document.createElement('a');
		doneButton.action = 'done';
		doneButton.setAttribute('class', 'action-button done');
		doneButton.innerHTML = "Done";

		this.editButton = editButton;
		this.doneButton = doneButton;

		if(this.allowMultiple) {
			addButton = document.createElement('a');
			addButton.setAttribute('class', 'action-button add');		
			this.addButton = addButton;
			addButton.innerHTML = "Add";
			addButton.action = 'add';
			this.container.insertBefore(this.addButton, this.container.firstChild);
		}

		this.container.insertBefore(this.editButton, this.container.firstChild);
		this.container.insertBefore(this.doneButton, this.container.firstChild);
	},

	addValue: function(value) {
		Field.prototype.addValue.call(this, value);
		this.equalizeInputsAndValues();		
		this.updateInputs();
		this.updateDisplayContainer();
	},

	init: function() {		
		
		if(! this.editContainer) {
			this.editContainer = document.createElement('div');
			this.container.appendChild(this.editContainer);
			this.editContainer.setAttribute('class', 'field-text-edit');
		}

		if (this.values.length == 0 && this.defaultValue) {
			this.addValue(this.defaultValue);
		}

		this.updateInputs();		
		this.createButtons();
		this.isEditing = true;
		this.toggleEditState();		

	}

}

Rubrick.ui.extend(Rubrick.ui.TextField, Rubrick.ui.Field);




/*
	ShortTextField
*/


function ShortTextField(fieldName, configObj) {

	Rubrick.ui.TextField.apply(this, arguments);

}

Rubrick.ui.ShortTextField.prototype = { 


	inputs: [] , 
	values: [],

	addInput: function(input) {
		if(!input) {
			input = document.createElement('input');
			input.setAttribute('type', 'text');
			input.setAttribute('size', '12');
			input.setAttribute('onclick', "stopEvent(event); return false;" );

		}
		TextField.prototype.addInput.call(this, input);
	},

	parseValues: function() {

	},

	init: function() {

		TextField.prototype.init.call(this);

	}

}

Rubrick.ui.extend(Rubrick.ui.ShortTextField, Rubrick.ui.TextField);



/*
	LongTextField
*/


function Rubrick.ui.LongTextField(fieldName, configObj) {

	Rubrick.ui.TextField.apply(this, arguments);

}


Rubrick.ui.LongTextField.prototype = 	{ 

	inputs: [] , 
	values: [],


	addInput: function(input) {
		if(!input) {
			input = document.createElement('textarea');
			input.setAttribute('class', 'field-input');
			input.setAttribute('onclick', "stopEvent(event); return false;" );
		}

		Rubrick.ui.TextField.prototype.addInput.call(this, input);
	},

	parseValues: function() {
		valueNodes = this.displayContainer.getElementsByTagName('p');
		for ( var i =0; i< valueNodes.length; i++ ) {
			this.addValue(valuesNodes[i].innerHTML);
		}		
	}

}

Rubrick.ui.extend(Rubrick.ui.LongTextField, Rubrick.ui.TextField);



/*
	EnumerationField
*/

function Rubrick.ui.EnumerationField(fieldName, configObj) {
	//this.allowedValues = [];
	this.values = [] ; 

	Rubrick.ui.Field.apply(this, arguments);

	this.displayAllowedInputs();
	this.init();
	this.selectDefault();


}


Rubrick.ui.EnumerationField.prototype = { 
	maxSelected : false,
	minSelected : 0,
	allowedValues: [], // TODO: figure out allowedValues on prototype
	defaultValue: null,
	displayContainerElement: 'ul',
	valueToLabelMap: false,


	addValue: function(val) {
		Rubrick.ui.Field.prototype.addValue.call(this, val);
		for(var i=0; i< this.inputs.length; i++) {
			if(this.inputs[i].val == val) {
				this.inputs[i].selected = true ;
			}
		}
		this.updateDisplayContainer();
	},

	removeValue: function(val) {
		Rubrick.ui.Field.prototype.removeValue.call(this, val);
		for(var i=0; i< this.inputs.length; i++) {
			if(this.inputs[i].val == val) this.inputs[i].selected = false ;
		}
		this.updateDisplayContainer();
	},


	setAllowedValues: function(vals) {
		for ( var i = 0; i<vals.length; i++ ) {
			this.addAllowedValue(vals[i]);
		}
		
		this.displayAllowedInputs();
	}, 

	addAllowedValue: function(val) {
		this.allowedValues[this.allowedValues.length] = val;
	},

	addInput: function(value) {
		label = this.valueToLabel(value);
	
		input = document.createElement('li');
		input.innerHTML = label;
		input.val = value;
		$(input).attr('uri', value);
		input.selected = false;
	
		Rubrick.ui.Field.prototype.addInput.call(this, input);
		this.displayContainer.appendChild(input);
	},


	displayAllowedInputs: function() {

		for ( var i = 0 ; i<this.allowedValues.length  ; i++ ) {
			this.addInput(this.allowedValues[i]);
		}
	},

	equalizeInputsAndValues: function() {
		while(this.allowedValues.length  >= this.inputs.length ) {
			this.addInput();
		}
	},



	preProcessClick: function(target) {

		if(target.selected) {
			this.removeValue(target.val);
		} else {
			this.addValue(target.val);
		}

	},

	processClick: function(e) {

		target = e.target ? e.target : e.srcElement;
		this.preProcessClick(target);

		try {
			this.validate();
			this.setJSON();
			this.messagesP.innerHTML = '';
			this.displayContainer.style.backgroundColor = 'white';
		} catch(err) {
			this.messagesP.innerHTML = err.message;
			this.displayContainer.style.backgroundColor = 'red';
		}

		this.postProcessClick();
	},

	updateDisplayContainer: function() {

		for( var i=0; i<this.inputs.length; i++) {
			if(this.inputs[i].selected) {
				this.inputs[i].setAttribute('class', 'selected');
			} else {
				this.inputs[i].removeAttribute('class');
			}			
		}
	},


	selectDefault: function() {

		if(this.defaultValue) {
			for ( var i=0; i<this.inputs.length; i++ ) {
				if(this.inputs[i].val == this.defaultValue) {
					this.addValue(this.inputs[i].val);
					this.setJSON();
				}
			}
			this.updateDisplayContainer();			
		}
	},

	validate: function() {
		if(this.maxSelected && this.values.length > this.maxSelected ) throw {message: "You can only select " + this.maxSelected  + " values"};
		if(this.values.length < this.minSelected) throw {message: "You need to select a value"};
		return true;
	},

	valueToLabel: function(value) {

		if(this.valueToLabelMap && this.valueToLabelMap[value]) {
			return this.valueToLabelMap[value];
		}

		return value;
	},

	init: function() {
		this.messagesP = document.createElement('p');
		this.container.appendChild(this.messagesP);


		for(var i=0; i< this.values.length; i++) {
			for(var j=0; j< this.inputs.length; j++) {
				if(this.inputs[j].val == this.values[i]) this.inputs[j].selected = true ;
			}
		}
		this.updateDisplayContainer();

	}

}

Rubrick.ui.extend(Rubrick.ui.EnumerationField, Rubrick.ui.Field);


/*
	SingleEnumerationField
*/


function Rubrick.ui.SingleEnumerationField(fieldName, configObj) {

	Rubrick.ui.EnumerationField.apply(this, arguments);
}


Rubrick.ui.SingleEnumerationField.prototype = { 
	maxSelected : 1,
	minSelected : 0, 

	preProcessClick: function(target) {

		for(var i = 0; i<this.inputs.length; i++) {

			if(this.inputs[i].val == target.val) {
				this.inputs[i].selected = true;
			} else {
				this.inputs[i].selected = false;
			}
		}

		if(target.selected) this.values = new Array(target.val);

	},

	postProcessClick: function() {
		this.updateDisplayContainer();
		Rubrick.ui.Field.prototype.postProcessClick.call(this);
	}
}

Rubrick.ui.extend(Rubrick.ui.SingleEnumerationField, Rubrick.ui.EnumerationField);

/*
	BooleanEnumerationField
*/

function Rubrick.ui.BooleanEnumerationField(fieldName, configObj) {

	SingleEnumerationField.apply(this, arguments);
//	this.displayAllowedInputs();
}

Rubrick.ui.BooleanEnumerationField.prototype = {

	allowedValues: [ 'true' , 'false' ] ,
	valueToLabelMap: { 'true' : 'Yes', 'false' : 'No'},



	setJSON: function() {

		jsonStr = '{ "' + this.fieldName + '" : [ ';
		for(var i=0; i<this.values.length; i++) {
			if (this.values[i] == 'true') {

				jsonStr += '"1" ,' ;
			} else {
				jsonStr += '"0" ,' ;
			}
		}
		jsonStr = jsonStr.slice(0, jsonStr.length -1); // strip last comma
		jsonStr += '] }';
		this.json = jsonStr;

	}
	
}

Rubrick.ui.extend(Rubrick.ui.BooleanEnumerationField, Rubrick.ui.SingleEnumerationField);

/*
	OrderedEnumerationField
*/

function Rubrick.ui.OrderedEnumerationField(fieldName, configObj) {

	Rubrick.ui.SingleEnumerationField.apply(this, arguments);
}

Rubrick.ui.OrderedEnumerationField.prototype = {
	
	displayAllowedInputs: function() {},

	preProcessClick: function(target) {

		switch (target.action) {
			case 'inc' :
				if (  this.allowedValues.indexOf( this.values[0] + 1 ) != -1 ) {				
					for(var r=0; r<Rubrick.ui.RowsManager.rows.length; r++) {
						if(Rubrick.ui.RowsManager.rows[r].fields[this.fieldName].values[0] == this.values[0] + 1 ) {
							Rubrick.ui.RowsManager.rows[r].fields[this.fieldName].values[0]--;
						}
					}
					this.values[0]++;
				} else {
					for(var r=0; r<Rubrick.ui.RowsManager.rows.length; r++) {
						Rubrick.ui.RowsManager.rows[r].fields[this.fieldName].values[0]++;
						this.values[0] = 0;
					}

				}
			break;

			case 'dec' :

				if (  this.allowedValues.indexOf( this.values[0] - 1 ) != -1 ) {
					for(var r=0; r<Rubrick.ui.RowsManager.rows.length; r++) {
						if(Rubrick.ui.RowsManager.rows[r].fields[this.fieldName].values[0] == this.values[0] - 1 ) {
							Rubrick.ui.RowsManager.rows[r].fields[this.fieldName].values[0]++;
						}
					}
					this.values[0]--;
				} else {
					for(var r=0; r<Rubrick.ui.RowsManager.rows.length; r++) {
						Rubrick.ui.RowsManager.rows[r].fields[this.fieldName].values[0]--;
						this.values[0] = Rubrick.ui.RowsManager.rows.length - 1;
					}

				}
			break;

		}

		Rubrick.ui.RowsManager.reorderRows();

	},

	processClick: function(e) {

		target = e.target ? e.target : e.srcElement;
		this.preProcessClick(target);
		stopEvent(e);
		this.postProcessClick();
	},

	postProcessClick: function() {
		this.setJSON();
		Field.prototype.postProcessClick.call(this);
	},

	createIncrementButton: function() {
		btn = document.createElement('a');
		btn.appendChild(document.createTextNode('Move Up'));
		btn.setAttribute('class', 'upButton');
		btn.action = 'dec';
		return btn;
	},


	createDecrementButton: function() {
		btn = document.createElement('a');
		btn.appendChild(document.createTextNode('Move Down'));
		btn.setAttribute('class', 'downButton');
		btn.action = 'inc';
		return btn;
	},

	setAllowedValues: function() {
		avs = new Array();
		for(var i=0; i <= Rubrick.ui.RowsManager.rows.length; i++) {
			avs.push(i);
		}
		Rubrick.ui.OrderedEnumerationField.prototype.allowedValues = avs;
	},

	init: function() {

		if(! this.values || this.values.length == 0) {
			this.values = [ this.allowedValues.length ];
		}
		this.displayContainer.appendChild(this.createIncrementButton());
		this.displayContainer.appendChild(this.createDecrementButton());

		this.setAllowedValues();
		this.setJSON();
	}

}

Rubrick.ui.extend(Rubrick.ui.OrderedEnumerationField, Rubrick.ui.SingleEnumerationField);



//TODO
/*
	UniqueEnumerationField
*/

function Rubrick.ui.UniqueEnumerationField(fieldName, configObj) {

	Rubrick.ui.SingleEnumerationField.apply(this, arguments);
}

Rubrick.ui.UniqueEnumerationField.prototype = {
	

	isUnique: function() {


	}
}

Rubrick.ui.extend(Rubrick.ui.UniqueEnumerationField, Rubrick.ui.SingleEnumerationField);




Rubrick.ui.FieldFactory = {

	classes :  {
		'LongTextField' : Rubrick.ui.LongTextField , 
		'ShortTextField' : Rubrick.ui.ShortTextField, 
		'EnumerationField' : Rubrick.ui.EnumerationField,
		'SingleEnumerationField' : Rubrick.ui.SingleEnumerationField,
		'BooleanEnumerationField' : Rubrick.ui.BooleanEnumerationField, 
		'OrderedEnumerationField' : Rubrick.ui.OrderedEnumerationField
	},

	getField: function(fieldClass, fieldLabel, fieldConfigObj) {
		return new this.classes[fieldClass](fieldLabel, fieldConfigObj);
	}

}



