<?php
    include('config.php');
    include_once('checkLogin.php');
    include_once(CLASSES_DIR . 'PermissionsManager.php');
    include_once(CLASSES_DIR . 'ContextSelector.php');

?>

<!DOCTYPE html SYSTEM "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>RubrickMaker</title>
        <link rel="stylesheet" type="text/css" href="./css/rubrickmaker.css"></link>

<?php

    
    if( ! $loggedIn ):
    
?>    
    </head>
    <body>
        <p>You must be logged in to build a rubric. . . </p>    
    </body>
    </html>
    <?php exit; endif;     
    
?>


        <script type="text/javascript" src="./js/jquery/jquery.js"></script>
        <script type="text/javascript" src="./js/rubrick/RowsClasses.js"></script>
        <script type="text/javascript" src="./js/rubrick/FieldsClasses.js"></script>
        <script type="text/javascript" src="./js/rubrick/RubricMaker.js"></script>

        <script type="text/javascript">
<?php

    $contextsInitObj = new StdClass();
  //  $contextsInitObj->defaultValue = 'http://code.rubrick-jetpack.org/vocab/Context1';
    $contextsInitObj->allowedValues = array();
    $contextsInitObj->valueToLabelMap = new StdClass();

    $pm = new PermissionsManager();
    $pm->doQueries();


    $pm->perms;


    $cSelector = new ContextSelector(array('by'=>'byURI'));
    foreach($pm->perms as $contextURI=>$perms) {
        if(in_array('addRubric', $perms)) {
            $cSelector->uri = $contextURI;
            $cSelector->setQuery();
            $cSelector->doQuery();
            $cSelector->processResultSet();
            $contextsInitObj->allowedValues[] = $contextURI;
            $contextsInitObj->valueToLabelMap->$contextURI = $cSelector->preJSONObj->name;            
        }
    }
    


echo "contextsInit=" . json_encode($contextsInitObj). " ; ";
echo "initArray = []; ";

    
    //build the available contexts data here.
    
?>           

        </script>

    </head>
    <body onload="init();">
<h2>Build your rubric below</h2>
        <div id="rubric-meta">
            <div id="rubric-name-container">
                <h3>Rubric Name</h3>
            </div>
            <div id="rubric-description-container">
                <h3>Description</h3>
            </div>
            <div id="rubric-tags-container">
                <h3>Tags</h3>
            </div>
            <div id="rubric-public-container">
                <h3>Public</h3>    
            </div>
            <div id="rubric-contexts-container">
                <h3>Connect to DropBoxes</h3>
                <a onclick="$('#createContextContainer').show()">Create New Dropbox</a>

            </div>
            <div id="createContextContainer" style="display: none;">
            <p>Dropbox Name: <input id="newContextName" type="text"  ></input></p>
            <p>Dropbox Description: </p>
                <textarea id="newContextDesc" type="text"  ></textarea>
            <button onclick="finishContext()">Done</button>
            </div>
        </div>

<div style="clear:both"></div>
        <h2>Add lines to your rubric</h2>
<p>(Lower scores to the left; higher scores to the right)</p>
        <table id="rubrickTable">
            <thead>
                <tr>
                    <th>About this line</th>
                    <th colspan="5">Rubric Values</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody id="rubrickBody" valign="top"> </tbody>
        </table>


        <button id="addRubrickLine" onclick="RowsManager.addRow();">Add Line</button>

        <button id="submitButton" onclick="submitRubric();">Submit</button>
        <input type="hidden" id="input-hiddenJSON"/>
    </body>
</html>
