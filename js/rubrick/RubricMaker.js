val1Config = {
    defaultValue: "Describe the Rubric Value here.", score : 5
};
val2Config = {
    defaultValue: "Describe the Rubric Value here.", score : 4
};
val3Config = {
    defaultValue: "Describe the Rubric Value here.", score : 3
};
val4Config = {
    defaultValue: "Describe the Rubric Value here.", score : 2
};
val5Config = {
    defaultValue: "Describe the Rubric Value here.", score : 1
};

descConfig = {
    defaultValue: "Describe the skills that this line evaluates"
};
tagsConfig = {
    defaultValue: "Add a tag", allowMultiple : 'true'
};
nameConfig = {
    defaultValue: "Name this rubric line"
};

publicConfig = {
    defaultValue: 'true'
};

orderConfig = {
};

fieldsConfigArray = [ {
    fieldName: 'Name', type: 'ShortTextField', configObj : nameConfig
}, {
    fieldName: 'Description', type: 'LongTextField', configObj : descConfig
}, {
    fieldName: 'Tags', type: 'ShortTextField', configObj: tagsConfig
}, {
    fieldName: 'Public', type: 'BooleanEnumerationField', configObj: publicConfig
}, {
    fieldName: 'order', type: 'OrderedEnumerationField', configObj: orderConfig
}, {
    fieldName: 'v5', type: 'LongTextField', configObj : val5Config
}, {
    fieldName: 'v4', type: 'LongTextField', configObj : val4Config
}, {
    fieldName: 'v3', type: 'LongTextField', configObj : val3Config
}, {
    fieldName: 'v2', type: 'LongTextField', configObj : val2Config
}, {
    fieldName: 'v1', type: 'LongTextField', configObj : val1Config
}

];
newContexts = {};
/*
contextsInit = {defaultValue:'http://code.rubrick-jetpack.org/Context1', 
                allowedValues: ['http://code.rubrick-jetpack.org/Context1'], 
                valueToLabelMap: {'http://code.rubrick-jetpack.org/Context1': 'Default', }
                };
*/
            function init() {
                RowsManager.init(initArray, fieldsConfigArray);
                RowsManager.addRow();
                RubricMeta = {name : FieldFactory.getField('ShortTextField', 'rName', { defaultValue: 'Rubric Name' } ), 
                                     desc : FieldFactory.getField('LongTextField', 'rDesc', { defaultValue: 'Rubric Description' } ), 
                                     tags :FieldFactory.getField('ShortTextField', 'rTags', {defaultValue: 'Rubric Tags' , allowMultiple: 'true' }),
                                     public : FieldFactory.getField('BooleanEnumerationField', 'rPublic', {defaultValue: 'true'} ) ,
                                     contexts: FieldFactory.getField('EnumerationField', 'rContexts', contextsInit )
                                     } ;
                rNameContainer = jQuery.find('#rubric-name-container') [0];
                rDescContainer =  jQuery.find('#rubric-description-container') [0];
                rTagsContainer =  jQuery.find('#rubric-tags-container') [0];
                rPublicContainer = jQuery.find('#rubric-public-container')[0];
                $('#rubric-contexts-container').append(RubricMeta.contexts.container);
                
                $(rNameContainer) .append(RubricMeta.name.container);
                
                
                $(rDescContainer) .append( RubricMeta.desc.container);
                
                
                $(rTagsContainer) .append( RubricMeta.tags.container);
                
                $(rPublicContainer).append(RubricMeta.public.container);
            }
        
			/* buildJSON is a holdover from the original use of this code, which didn't use JSON.stringify because of cross-browser issues */
            function buildJSON() {
                RowsManager.setJSON();
                var jsonStr = ' {  "rName" : "' + RubricMeta.name.values[0]  +  '" , ' ; 
                
                
                jsonStr += '  "rubricMeta" : [ ';
                for each (var field in RubricMeta) {

                    jsonStr += field.getJSON();
                    jsonStr += ' ,' ;
                }
                jsonStr = jsonStr.slice(0, jsonStr.length -1); // strip last comma
                jsonStr += ' ] ,  ';
                
                
                jsonStr += '  "rubricLines" : ' ;
                jsonStr += RowsManager.json ;
                
                jsonStr += ' } ';
                return jsonStr;
            }
                    

            function finishContext() {
                $('#createContextContainer').hide();
                var newName = $('#newContextName').val();
                var newDesc = $('#newContextDesc').val();
                var fieldManager = $('#rubric-contexts-container').find('div')[0].manager;
                var newVal = 'new' + fieldManager.allowedValues.length;
                fieldManager.valueToLabelMap[newVal] = newName;
                fieldManager.addAllowedValue(newVal);
                fieldManager.valueToLabelMap[newVal] = newName;
                fieldManager.addInput(newVal);

                var newContext = {};
                newContext.action = 'create';
                newContext.name = newName;
                newContext.desc = newDesc;
                newContexts[newVal] = newContext;
            }


            function submitRubric() {
                rj = buildJSON() ;
				cj = JSON.stringify(newContexts);
                var button = document.getElementById('submitButton');
                button.rj = rj;
                button.cj = cj;
                button.test = 'tesssst!';
                $.post('http://localhost/testJS/jetpacks/rubrick/createRubric.php', { rJSON : rj , cJSON: cj  } );           
            }
        
        
test = 'test';
        
