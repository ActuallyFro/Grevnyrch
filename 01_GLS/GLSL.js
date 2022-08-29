// Separate Popper & JS:
/* <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script> */
/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js" integrity="sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK" crossorigin="anonymous"></script> --> */

//////////////////////////////////////
// Table of Contents
// =================
// I. Vars and Lookups
// II. OnPageLoad/Init
// III. GUI Usage Functions
// IV. Usage/Async I/O Functions
// V. Import/Export
//////////////////////////////////////

//////////////////////////////////////
// LocalStorage Plan:
// ------------------
// 0. Add in hooks to check for existing content, and load as appropriate... {#0} |< DONE >|
//   a. load Logs <import like LOG file import/load> {#a}
//   b. load targets <import like TARGET file import/load> {#b}
// 1. brackets -- N/A, since these are static/look-ups
// 2. targets -- yes (curretly are exported too)  {#2}
//   a. Needs a reset option {#a}
//   b. LocalStorage then needs to be added {#b} <WHEN a NEW target is added -- export list>
// 3. ledger -- no (these are dynamically built, treated as draft, when an entry is considered valid -- it moves to a log)
// 4. logs -- yes (curretly are exported too) {#1}
//   a. LocalStorage needs to be added to reset {#a}  <WHEN a NEW log is added -- export list>
//
// Other LocalStorage issues
// -------------------------
// i. Showing total storage percent in navigation menu
//
//////////////////////////////////////

//////////////////////////////////////
// I. Vars and Lookups

// Global var to store the propsed ledger entry, as array of strings
var isLedgerEmpty = true;
var isLogEmpty = true;
var oldLedger = [];
var Log = [];

var brackets = [
["", "=== Location Brackets ===", "GUI - Selection Title", "Disabled"],
["༺ ༻", "Realm", "Locations", ""],
["〖 〗", "City", "Locations", ""],
["《 》", "District", "Locations", ""],
["〈 〉", "Place/Building", "Locations", ""],
["⦓ ⦔", "Inner Place/Building (e.g., Room)", "Locations", ""],

["", "=== Timing Brackets ===", "GUI - Selection Title", "Disabled"],
["⟅ ⟆", "Round", "Timing", "Numbers"],
["⧼ ⧽", "Time/Duration", "Timing", "Ignore"],

["", "=== N/PC Brackets ===", "GUI - Selection Title", "Disabled"],
["[ ]", "PC or NPC", "PC or NPC Level Actions", ""],
["] [", "Hostile NPC/encounter (Single)", "PC or NPC Level Actions", ""],
["⟦ ⟧", "Grouping of PCs/NPC", "PC or NPC Level Actions", ""],
["⟧ ⟦", "Grouping of Hostile NPCs/encounter", "PC or NPC Level Actions", ""],

["", "=== Event/Action Brackets ===", "GUI - Selection Title", "Disabled"],
["⌊ ⌋", "Event/Encounter - Floor", "Event or Encounter", "Ignore"],
["⌈ ⌉", "Event/Encounter - Ceiling", "Event or Encounter", "Ignore"],
["( )", "Action", "Event or Encounter", "FilterAction"],
["< >", "Movement", "Event or Encounter", "Ignore"],
["(( ))", "Comment", "General Comment", ""],

["", "=== Object Brackets ===", "GUI - Selection Title", "Disabled"],
["{ }", "Item", "Object", "Ignore"],
["⸢ ⸣", "Right hand", "Object", "Ignore"],
["⸤ ⸥", "Left hand", "Object", "Ignore"],
["⸢ ⸥", "Both hands/two handed", "Object", "Ignore"],
["⦇ ⦈", "Armor class", "Object", "Numbers"],

["", "=== Result Brackets ===", "GUI - Selection Title", "Disabled"],
["⟮ ⟯", "Dice Roll Success (check)", "Results", "Dice"],
["⟯ ⟮", "Dice Roll Failure (check)", "Results", "Dice"],
["⧘ ⧙", "Damage Amount", "Results", "Numbers"],
["〘 〙", "Dice Roll Initiative", "Results", "Dice"]
];

var targets = [
["Grevnyrch", "Locations", "G"],
["Kla'Bbbert", "Locations", "KB"]
];

var isShowingNumbers = false;

var LastBracketSize = 0;
var LastBracketWidth = 0; //SHOULD be (Size-1)/2 -- but I cannot say 100% ALWAYS will be...
var isInnerBracket = false;
//////////////////////////////////////

//////////////////////////////////////
// II. OnPageLoad/Init

//1. Page setup:
//============== 
window.onload = function() {
  //BAD: LocalStorageClear(true);

  //0. Determine if LocalStorage's Log[] is empty: (a) if not -- load, else -- print empty:
  var totalLSKeys = LocalStorageLoadMainKeys(true); //LocalStorageLoadMainKeys(true)
  if (totalLSKeys>0){
    console.log("[DEBUG] Found '" + totalLSKeys +"' total, localstorage keys!");

  } else {
    console.log("[DEBUG] There are NO keys (i.e., no stored data!)");
  }

  // 1. Setup Bracket Buttons
  SetupBracketButtons();

  // 2. Setup Bracket Drop Down
  SetupBracketDropDown();

  // 3. Setup Targets
  //-----------------
  SetupAllTargets();

  // 3. Add Integers to Dice Div
  //----------------------------
  for (var k = 0; k <= 9; k++) {
    document.getElementById("Dice").innerHTML += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"addStringInLedgerBracket(" + k + ")\">" + k + "</button>";
  }

  document.getElementById("Dice").innerHTML += "<button type=\"button\"  class=\"btn btn-secondary\" onclick=\"addStringInLedgerBracket('+')\"> + </button>";
  document.getElementById("Dice").innerHTML += "<button type=\"button\" class=\"btn btn-danger\" onclick=\"addStringInLedgerBracket('-')\"> - </button>";
  document.getElementById("Dice").innerHTML += "<button type=\"button\"  class=\"btn btn-secondary\" onclick=\"addStringInLedgerBracket('=')\"> = </button>";
  
  document.getElementById("ActivityButtons").innerHTML += "<button type=\"button\"  class=\"btn btn-info\" onclick=\"addStringInLedgerBracket('→')\"> → </button>";
  document.getElementById("ActivityButtons").innerHTML += "<button type=\"button\"  class=\"btn btn-info\" onclick=\"addStringInLedgerBracket(';;')\"> ;; </button>";
  // <div class="col-sm-12" id="ActivityButtons"></div>
  
  document.getElementById("BracketDropDown").addEventListener("change", function() {
    var selectedBracketTag = document.getElementById("BracketDropDown").value;
    SetupTargetsBasedOnBracketPick(selectedBracketTag);
    // Temp();
  });

}

// 1. Bracket Buttons setup:
//========================== 
function SetupBracketButtons(){
  var seletionBracketCount = 1; //due to blank --^
  for (var i = 0; i < brackets.length; i++) {
    if (brackets[i][2] == "Locations"){
      document.getElementById("BracketButtons").innerHTML += "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";
    
    } else if (brackets[i][2] == "Timing"){
      document.getElementById("BracketButtons").innerHTML += "<button type=\"button\" class=\"btn btn-success\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";
    
    } else if (brackets[i][2] == "PC or NPC Level Actions"){
      document.getElementById("BracketButtons").innerHTML += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";

    } else if (brackets[i][2] == "Event or Encounter"){
      document.getElementById("BracketButtons").innerHTML += "<button type=\"button\" class=\"btn btn-success\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";

          
    } else if (brackets[i][2] == "Object"){
      document.getElementById("BracketButtons").innerHTML += "<button type=\"button\" class=\"btn btn-warning\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";

          
    } else if (brackets[i][2] == "Results"){
      document.getElementById("BracketButtons").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";

    } else if (brackets[i][2] != "GUI - Selection Title"){
      document.getElementById("BracketButtons").innerHTML += "<button type=\"button\" class=\"btn btn-light\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";

    }

    seletionBracketCount++;
  }

  //console.log("SetupBracketButtons() -- created " + seletionBracketCount + " buttons");

  document.getElementById("BracketButtons").innerHTML += "<input type=\"button\" class=\"btn btn-danger\" value=\"Clear bracket\" onclick=\"ClearBracket()\"></input>"
}

// 2. Bracket Drop Down setup:
//============================ 
function SetupBracketDropDown(){
  document.getElementById("BracketDropDown").innerHTML = null; //reset buttons

  var optionBlank = document.createElement("option");
  optionBlank.value = "";
  optionBlank.text = "";
  document.getElementById("BracketDropDown").appendChild(optionBlank);

  //generate option tags from brackets array
  for (var i = 0; i < brackets.length; i++) {

    // Adding options to the Bracket, Tag Dropdown
    var option = document.createElement("option");
    option.value = brackets[i][0];
    option.text = brackets[i][1] + ": " + brackets[i][0];
    if (brackets[i][3] == "Disabled") {
      option.disabled = true;
    }
    
    document.getElementById("BracketDropDown").appendChild(option);

  }

}

//2. All Targets setup:
//===================== 
function SetupAllTargets() { 
  SetupTargetsBasedOnBracketPick("");
}

//3. Speciifc Class of Targets setup:
//===================================
function SetupTargetsBasedOnBracketPick(SelectedBracket){
  // console.log("Selected Bracket: '" + SelectedBracket + "'");
  document.getElementById("targets").innerHTML = null; //reset targets
  document.getElementById("TargetButtons").innerHTML = null; //reset buttons

  if (SelectedBracket == "") {
    // console.log("Generating ALL targets (no type selected)");
    for (var j = 0; j < targets.length; j++) {
      if (!targets[j][0].includes(";;")) {
        var option = document.createElement("option");
        option.text = targets[j][0];
        // console.log("Adding Target: '" + targets[j][0] + "'");
        document.getElementById("targets").appendChild(option);

        var safeStr = targets[j][0].replace(/'/g, "\\'");
        // console.log("safeStr: '" + safeStr + "'");
        
        document.getElementById("TargetButtons").innerHTML += "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"addStringInLedgerBracket('"+safeStr+ "')\">" + targets[j][0] + "</button>";
      }
    }
  
  } else {
    var SelectedBracketWords = ""

    for (var i = 0; i < brackets.length; i++) {
      var foundTargetBracket = brackets[i][0];
      // console.log("This(" + foundTargetBracket + ") vs. That(" + SelectedBracket + ")")
      if (brackets[i][0] == SelectedBracket) {
        //console.log("Found Bracket: " + foundTargetBracket);
        SelectedBracketWords = brackets[i][2];
        break;
      }
    }

    var foundTargets = 0;
    for (var j = 0; j < targets.length; j++) {
      if (targets[j][1] == SelectedBracketWords) {
        var option = document.createElement("option");
        option.text = targets[j][0];
      
        if (!targets[j][0].includes(";;")) { //;; denotes the 'full name';;'paraphrased name'
          document.getElementById("targets").appendChild(option);

          var safeStr = targets[j][0].replace(/'/g, "\\'");
          
          document.getElementById("TargetButtons").innerHTML += "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"addStringInLedgerBracket('"+safeStr+ "')\">" + targets[j][0] + "</button>";

          foundTargets++;
        }

      }
    }
    //console.log("Found " + foundTargets + " targets, based on Bracket selection");  
  }
}

//////////////////////////////////////

//////////////////////////////////////
// III. GUI Usage Functions

//1. Generate Brackets:
//=====================
function addBracket(bracketNumber) {
  var adjustedBracketNumber = bracketNumber - 1;
  if (adjustedBracketNumber >= 0 && adjustedBracketNumber < brackets.length) {

    //console.log("[DEBUG] [addBracket()] Changing selected index to: " + bracketNumber);
    document.getElementById("BracketDropDown").selectedIndex = bracketNumber; 

    if (brackets[adjustedBracketNumber][3] == "Dice" || brackets[adjustedBracketNumber][3] == "Numbers") {
      hideShowDice(true);
      // console.log("[DEBUG] [addBracket()] Toggle Dice - on");
    } else {
      // console.log("[DEBUG] [addBracket()] Toggle Dice - off");
      hideShowDice(false);
    }

  } else {
    document.getElementById("BracketDropDown").selectedIndex = 0;
    // console.log("[DEBUG] [addBracket()] Toggle Dice - off");
    hideShowDice(false);
  }

  //Passes the string for brackets
  var selectedBracketTag = document.getElementById("BracketDropDown").value;
  SetupTargetsBasedOnBracketPick(selectedBracketTag); //Adds buttons for targets, filtered on brackets[i][2]

  LedgerIt();
}

//2. Clear - Bracket
//================== 
function ClearBracket() {
  document.getElementById("BracketDropDown").value = "";
  hideShowDice(false);
}

//3. Clear - Ledger
//================
function ClearLedger() {
  isLedgerEmpty = true;
  document.getElementById("ledger").value = "";
  oldLedger = [];
}

//4. Clear - Log 
//=============
function ClearLog() {
  if (isLogEmpty){
    return;
  }

  isLogEmpty = true;
  document.getElementById("Logs").innerHTML = "<div id=\"log\" style=\"background-color:rgba(178, 178, 188, 0.571);\"><h2><i>{Logs are empty}</i></h2></div>";

  Log = [];
  LocalStorageClearLogsOnly();
}

//5. Clear - Tag
//=============
function ClearTag() {
  document.getElementById("BracketDropDown").value = "";
}

//6. Clear - Target
//================
function ClearTarget() {
  document.getElementById("target").value = "";
}

//7. Show/Hide Dice:
//================== 
function hideShowDice(showDice=false) { // https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
  var x = document.getElementById("Dice");
  if (isShowingNumbers && showDice){
    return;
  }

  if (x.style.display === "none" && showDice) {
    x.style.display = "block";
    isShowingNumbers = true;
  } else {
    x.style.display = "none";
    isShowingNumbers = false;
  }
}

//8. Undo - Ledger
//================
function UndoLedger() {
  if (oldLedger.length > 0) {
    document.getElementById("ledger").value = oldLedger[oldLedger.length-1];
    oldLedger.pop();  

  } else {
    ClearLedger();
  }
}

//////////////////////////////////////

//////////////////////////////////////
// IV. Usage/Async I/O Functions

//1. Target - Check if Exists, Add if not
//=======================================
function CheckAndAddTarget(){
  var targetToCheck = document.getElementById("target").value;

  if (targetToCheck == ""){
    return;
  }

  var newTarget = true;
  for (var i = 0; i < targets.length; i++) {
    if (targets[i][0] == targetToCheck) {
      newTarget = false; //target exists
    }
  }

  var bracketSelectedOption = document.getElementById("BracketDropDown").selectedIndex;

  var BannedOption = true;
  var bracketSetting = brackets[bracketSelectedOption][3];
  // for (var j = 0; j < brackets.length; j++) {
  if (bracketSetting != "Dice" && bracketSetting != "Ignore") {
    BannedOption = false; //target exists
  }

  var Repeat = false;
  for (var k = 0; k < targets.length; k++) {
    // console.log("[DEBUG] [CheckAndAddTarget()] Comparing " + targetToCheck + " to " + targets[k][0]);
    if (targets[k][0] == targetToCheck) {
      Repeat = true; //target exists
      // console.log("[DEBUG] [CheckAndAddTarget()] Repeating Target... skipping!");
    }
  }

  if (newTarget && !BannedOption && !Repeat) {
    // var option = document.createElement("option");
    // option.text = targetToCheck;
    // document.getElementById("targets").appendChild(option);
    
    //add to targets[]
    console.log("[DEBUG] [CheckAndAddTarget()] Adding Target: " + targetToCheck + " with category: " + brackets[bracketSelectedOption][2]);
    // var newTarget = [targetToCheck, brackets[adjustedBracketNumber][2] , ""];
    var newTarget = [targetToCheck, brackets[bracketSelectedOption][2] , ""];
    targets.push(newTarget);
  }

}

//2. LedgerIt 
//===========
function LedgerIt() {
  var obj = document.getElementById("BracketDropDown");
  oldLedger.push(document.getElementById("ledger").value);
  var tempBracket = obj.options[obj.selectedIndex].value;
  var tempTarget = document.getElementById("target").value;

  LastBracketSize = tempBracket.length;
  LastBracketWidth = (LastBracketSize - 1)/2;

  if (LastBracketWidth < 1){
    console.log("[ERROR] Provided bracket is formmatted WRONG! (len: " + LastBracketSize + ")");
    return;
  }
  // console.log("[DEBUG] Current bracket len: '" + LastBracketSize + "', adjusted: '"+LastBracketWidth+"'");

  if (isLedgerEmpty){
    document.getElementById("ledger").value = tempBracket.slice(0,LastBracketWidth) + tempTarget + tempBracket.slice(-LastBracketWidth, LastBracketSize);
    isLedgerEmpty = false;

  } else {
    document.getElementById("ledger").value += tempBracket.slice(0,LastBracketWidth) + tempTarget + tempBracket.slice(-LastBracketWidth, LastBracketSize);
  }

  CheckAndAddTarget();
}

//3. LogIt 
//===========
function LogIt() {
  if (isLedgerEmpty){
    LedgerIt(); //Auto-ledger then log it
  }

  if (isLogEmpty){
    isLogEmpty = false;
    document.getElementById("Logs").innerHTML = "<table class=\"table table-striped\"><tbody id=\"LogsTable\"></tbody></table>";
    //console.log("[DEBUG] [LogIt()] Logs table created");
  } 

  var obj = document.getElementById("ledger");
  var currentLedger = document.getElementById("ledger").value;
  Log.push(currentLedger);


  var row = document.createElement("tr");

  var cell = document.createElement("td");
  cell.innerHTML = currentLedger;
  row.appendChild(cell);
  document.getElementById("LogsTable").appendChild(row);


  CheckAndAddTarget();
  ClearLedger();
  ClearTag();
  ClearTarget();

  // //Save logs out to localstorage (due to Log.push(currentLedger))
  LocalStorageLogsSave(true);
}

//4. RemoveLastLog 
//================
function RemoveLastLog() {
  if (isLogEmpty){
    return;
  }

  Log.pop();
  if (Log.length > 0){
    var table = document.getElementById('LogsTable');
    table.removeChild(table.children[table.children.length - 1]);

  } else {
    ClearLog();
  }
}

function addStringInLedgerBracket(PassedString){
  var obj = document.getElementById("ledger");

  var tempLedger = obj.value.slice(0,obj.value.length-1);
  var tempLedgerLastChar = obj.value.slice(-1,obj.value.length);
  obj.value = tempLedger + PassedString + tempLedgerLastChar;
}
//////////////////////////////////////

//////////////////////////////////////
// V. Import/Export

//1. Prep Targets as JSON String
//=========================
function TargetArrayStringifyAsJSON(){
  return JSON.stringify(targets);
}

//2. Prep Logs as JSON String
//=========================
function LogsStringifyAsJSON(){
  return JSON.stringify(Log);
}


//3. Export - Targets (JSON)
//=========================
function ExportTargetArrayToJson() {
  var text = TargetArrayStringifyAsJSON();
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "GSL_Targets.json");
}

//4. Export - Logs (JSON)
//=========================
function ExportLogToJson() {
  var text = LogsStringifyAsJSON();
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});

  var date = new Date();
  var textIso = date.toISOString();  
  console.log("[DEBUG] [ExportLogToJson()] date str:<" + textIso+">");

  saveAs(blob, "GSL_Log_"+textIso+".json");
}

/////////////////////////////////

function LoadArrayIntoLog(PassedArray){ //Passed JSON Parsed from String
  Log = [];
  for (var i = 0; i < PassedArray.length; i++) {
    Log.push(PassedArray[i]);
  }
}

function LoadLogArrayIntoTable(){
  document.getElementById("Logs").innerHTML = "<table class=\"table table-striped\"><tbody id=\"LogsTable\"></tbody></table>";
  for (var j = 0; j < Log.length; j++) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");

    cell.innerHTML = Log[j];
    row.appendChild(cell);

    document.getElementById("LogsTable").appendChild(row);      
  }
}

//////////////////////////////////////

//5. Import - Logs (JSON)
//=======================
function ImportJsonToLog(){
  //(a) Take provided file (and ONLY one file, if multiple files passed), (b) load content into Log[] array, (c) load into <table>, (d) then check if valid.
  var file_to_read = document.getElementById("fileInputLog").files[0];
  var fileread = new FileReader();

  fileread.onload = function(e) {
    var content = e.target.result;
    var parsedLog = JSON.parse(content);

    //(b) - Load content into Log[]
    LoadArrayIntoLog(parsedLog);

    //(c) - load Log[] entries into <table>
    LoadLogArrayIntoTable();

    //(d) - Check if load was valid/successful
    if (Log.length > 0) {
      isLogEmpty = false;
      alert("Successfully loaded '"+ Log.length +"' Logs!");

    } else {
      isLogEmpty = true;      
      alert("[Warning] No Logs imported, please check source file!");
    }

  };

  //(a) 
  fileread.readAsText(file_to_read);
}


//6. Import - Targets (JSON)
//=========================
function ImportJsonToTargets(){
  // document.getElementById("fileInputTargets").addEventListener("change", function() { //https://qawithexperts.com/article/javascript/read-json-file-with-javascript/380

  var file_to_read = document.getElementById("fileInputTargets").files[0];
  var fileread = new FileReader();

  fileread.onload = function(e) {
    var content = e.target.result;
    var parsedTarget = JSON.parse(content);
    // console.log(parsedTarget);

    targets = [];
    for (var i = 0; i < parsedTarget.length; i++) {
      targets.push(parsedTarget[i]);
    }

    for (var j = 0; j < targets.length; j++) {
      var option = document.createElement("option");
      option.text = targets[j][0];

      document.getElementById("targets").appendChild(option);
    }
  };
  fileread.readAsText(file_to_read);

  // alert("Successfully loaded (" + targets.length + ") targets!");
  
  alert("Successfully loaded targets!");


// });
}

//7. Import - Targets (JSON)
//=========================
function saveAs(blob, filename) {
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(function() {
    URL.revokeObjectURL(url);
  }, 100);
}

//8. localstorage - Clear
//=======================
function LocalStorageClear(debug=false){
  localStorage.clear();  
  if (debug){
    console.log("[DEBUG][LocalStorageClear] Cleared all user/page created keys!");
  }
}

function LocalStorageClearLogsOnly(debug=false){
  localStorage.removeItem('GLSL-Logs');
  if (debug){
    console.log("[DEBUG][LocalStorageClear] Cleared all user/page created keys!");
  }
}

//9. localstorage - Get Total Keys
//=======================
function LocalStorageLoadMainKeys(debug=false){
  var totalKeys=0;

  var loadedLogs = false;

  for(var key in window.localStorage){
    if(window.localStorage.hasOwnProperty(key)){ //aka: NOT inherited; otherwise ALL defaults counted (e.g., length, clear, get, remove, set, etc.)
      totalKeys++;
      if (debug){
        console.log("[DEBUG][LocalStorageLoadMainKeys] Found key: '" + key + "'");
        console.log( key + " = " + ((window.localStorage[key].length * 16)/(8 * 1024)).toFixed(2) + ' KB' );
      }  
      if (key === "GLSL-Logs"){
        if (debug){
          console.log("[DEBUG][LocalStorageLoadMainKeys] Loading Logs saved in 'GLSL-Logs'!");
        }
        
        //Load content into Log[]
        var storedlogs = localStorage.getItem('GLSL-Logs');
        var parsedLog = JSON.parse(storedlogs);
        LoadArrayIntoLog(parsedLog);
        if (debug){
          console.log("[DEBUG][LocalStorageLoadMainKeys] Loaded string <" + storedlogs + ">");
          console.log("[DEBUG][LocalStorageLoadMainKeys] Parsed string <" + parsedLog + ">");
          console.log("[DEBUG][LocalStorageLoadMainKeys] Loaded '" + Log.length + "' Logs");
        }

        //(c) - load Log[] entries into <table>
        LoadLogArrayIntoTable();

        loadedLogs = true;
        isLogEmpty = false;

      } else if (key === "GLSL-Targets"){
        if (debug){
          console.log("[DEBUG][LocalStorageLoadMainKeys] Loading Targets saved in 'GLSL-Targets'!");
        }
      }
    }
  }

  if (!loadedLogs){
    document.getElementById("Logs").innerHTML = "<div id=\"logStatus\" style=\"background-color:rgba(178, 178, 188, 0.571);\"><h2><i>{Logs are empty}</i></h2></div>";
  }

  return totalKeys;
}

//10. localstorage - Save Logs
//=======================
function LocalStorageLogsSave(debug=false){
  var newLogsStr = LogsStringifyAsJSON();

  if (debug){
    console.log("[DEBUG][LocalStorageLogsSave] Saving Logs to localstorage...");    
    console.log("[DEBUG][LocalStorageLogsSave] NewString: " + newLogsStr);
  }

  localStorage.setItem('GLSL-Logs', newLogsStr);

}
//////////////////////////////////////








