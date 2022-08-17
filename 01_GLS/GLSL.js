// Separate Popper & JS:
/* <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script> */
/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js" integrity="sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK" crossorigin="anonymous"></script> --> */

//////////////////////////////////////
// I. Vars and Lookups
//////////////////////////////////////

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

["", "=== Timing Brackets ===", "GUI - Selection Title", "Disabled"],
["⟅ ⟆", "Round", "Timing", "Numbers"],
["⧼ ⧽", "Time/Duration", "Timing", "Ignore"],

["", "=== N/PC Brackets ===", "GUI - Selection Title", "Disabled"],
["[ ]", "PC or NPC", "PC or NPC Level Actions", ""],
["] [", "Hostile NPC/encounter (Single)", "PC or NPC Level Actions", ""],
["⟦ ⟧", "Grouping of PCs/NPC", "PC or NPC Level Actions", ""],
["⟧ ⟦", "Grouping of Hostile NPCs/encounter", "PC or NPC Level Actions", ""],
["( )", "Action", "PC or NPC Level Actions", "FilterAction"],
["< >", "Movement", "PC or NPC Level Actions", "Ignore"],
["⸢ ⸣", "Right hand", "PC or NPC Level Actions", "Ignore"],
["⸤ ⸥", "Left hand", "PC or NPC Level Actions", "Ignore"],
["⸢ ⸥", "Both hands/two handed", "PC or NPC Level Actions", "Ignore"],
["⦇ ⦈", "Armor class", "PC or NPC Level Actions", "Numbers"],
["⟮ ⟯", "Dice Roll Success (check)", "PC or NPC Level Actions", "Dice"],
["⟯ ⟮", "Dice Roll Failure (check)", "PC or NPC Level Actions", "Dice"],
["⧘ ⧙", "Damage Amount", "PC or NPC Level Actions", "Numbers"],
["〘 〙", "Dice Roll Initiative", "PC or NPC Level Actions", "Dice"]

];

var targets = [
["Grevnyrch", "Locations", "G"],
["Kla'Bbbert", "Locations", "KB"]
];

var isShowingNumbers = false;

//////////////////////////////////////
// II. OnPageLoad/Init

//1. Page setup:
//============== 
window.onload = function() {
  document.getElementById("Logs").innerHTML = "<div id=\"logStatus\" style=\"background-color:rgba(178, 178, 188, 0.571);\"><h2><i>{Logs are empty}</i></h2></div>";

  // 1. Setup Bracket Buttons
  SetupBracketButtons();

  // 2. Setup Bracket Drop Down
  SetupBracketDropDown();

  // 3. Setup Targets
  //-----------------
  SetupAllTargets();

  // 3. Add Integers to Dice Div
  //----------------------------
  for (var k = 0; k <= 26; k++) {
    document.getElementById("Dice").innerHTML += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"addNumToLedger(" + k + ")\">" + k + "</button>";
  }

  // document.getElementById("Dice").innerHTML += "<button type=\"button\"  class=\"btn btn-secondary\" onclick=\"addStrToLedger(\"+\")\"> + </button>";
  // document.getElementById("Dice").innerHTML += "<button type=\"button\" class=\"btn btn-danger\" onclick=\"addNumToLedger(\"-\")\"> - </button>";
  // document.getElementById("Dice").innerHTML += "<button type=\"button\"  class=\"btn btn-secondary\" onclick=\"addStrToLedger(\"=\")\"> = </button>";
  
  
  document.getElementById("BracketDropDown").addEventListener("change", function() {
    var selectedBracketTag = document.getElementById("BracketDropDown").value;
    SetupTargetsBasedOnBracketPick(selectedBracketTag);
    // Temp();
  });

}

// function Temp(){
  //TODO: UPDATE Event Selections

  //var selectedBracketTag = document.getElementById("BracketDropDown").value;
  //SetupTargetsBasedOnBracketPick(selectedBracketTag);
// }

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
    }

    seletionBracketCount++;
  }

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


// var selectedBracketTag = document.getElementById("BracketDropDown").value; //This call is an example where the current, selected bracket is used to filter the targets.


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

  if (SelectedBracket == "") {
    // console.log("Generating ALL targets (no type selected)");
    for (var j = 0; j < targets.length; j++) {
      var option = document.createElement("option");
      option.text = targets[j][0];
      // console.log("Adding Target: '" + targets[j][0] + "'");
      document.getElementById("targets").appendChild(option);
    }
  
  } else {
    var SelectedBracketWords = ""


    //find match in brackets, save into SelectedBracketWords
    // console.log("Searching vs. Brackets: " + brackets.length);
    for (var i = 0; i < brackets.length; i++) {
      var foundTargetBracket = brackets[i][0];
      // console.log("This(" + foundTargetBracket + ") vs. That(" + SelectedBracket + ")")
      if (brackets[i][0] == SelectedBracket) {
        // console.log("Found Bracket: " + foundTargetBracket);
        SelectedBracketWords = brackets[i][2];
        break;
      }
    }

    //Brackets[i][2] need to be compared to targets[j][1]
    // console.log("Generating targets for: '" + SelectedBracketWords + "' (" + SelectedBracket + ")");
    var foundTargets = 0;
    for (var j = 0; j < targets.length; j++) {
      if (targets[j][1] == SelectedBracketWords) {
        var option = document.createElement("option");
        option.text = targets[j][0];
      
        // console.log("Adding Target: '" + targets[j][0] + "'");

        //if target string does NOT contain ';;', append
        if (!targets[j][0].includes(";;")) {
          document.getElementById("targets").appendChild(option);
          foundTargets++;
        }

      }
    }
    console.log("Found " + foundTargets + " targets, based on Bracket selection");
  
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

  var selectedBracketTag = document.getElementById("BracketDropDown").value;
  SetupTargetsBasedOnBracketPick(selectedBracketTag);
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
  // document.getElementById("ledger").innerHTML = "<h2><i>{Ledger is empty}</i></h2>";
  document.getElementById("ledger").innerText = "";
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

  // //all -- while leaving the table
  // var table = document.getElementById('LogsTable');
  // for(var i = 1; i < table.children.length; i++) {
  //   table.removeChild(table.children[i]);
  // }  

  Log = [];
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
    document.getElementById("ledger").innerText = oldLedger[oldLedger.length-1];
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
  oldLedger.push(document.getElementById("ledger").text);
  var tempBracket = obj.options[obj.selectedIndex].value;
  var tempTarget = document.getElementById("target").value;

  if (isLedgerEmpty){
    document.getElementById("ledger").innerText = tempBracket.slice(0,1) + tempTarget + tempBracket.slice(-1,tempBracket.length);
    isLedgerEmpty = false;

  } else {
    document.getElementById("ledger").innerText += tempBracket.slice(0,1) + tempTarget + tempBracket.slice(-1,tempBracket.length);
  }

  CheckAndAddTarget();
  ClearTag();
  ClearTarget();

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
    console.log("[DEBUG] [LogIt()] Logs table created");
  } 

  var obj = document.getElementById("ledger");
  var currentLedger = document.getElementById("ledger").innerHTML;
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
//////////////////////////////////////

//////////////////////////////////////
// V. Import/Export

//1. Export - Targets (JSON)
//=========================
function ExportTargetArrayToJson() {
  var text = JSON.stringify(targets);
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "GSL_Targets.json");
}

//2. Export - Logs (JSON)
//=========================
function ExportLogToJson() {
  var text = JSON.stringify(Log);
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});

  var date = new Date();
  var textIso = date.toISOString();  
  console.log("[DEBUG] [ExportLogToJson()] date str:<" + textIso+">");

  saveAs(blob, "GSL_Log_"+textIso+".json");
}

// //X. Import - Targets (JSON)
// //=========================
// function ImportTargetArrayFromJson() {
//   var file = document.getElementById("file").files[0];
//   var reader = new FileReader();
//   reader.onload = function(e) {
//     var contents = e.target.result;
//     var json = JSON.parse(contents);
//     console.log(json);
//   };
//   reader.readAsText(file);
// }

//3. Import - Logs (JSON)
//=======================
function ImportJsonToLog(){
  //Create Listener that will load file into Log[]
  var file_to_read = document.getElementById("fileInputLog").files[0];
  var fileread = new FileReader();

  fileread.onload = function(e) {
    var content = e.target.result;
    var parsedLog = JSON.parse(content);

    Log = [];
    for (var i = 0; i < parsedLog.length; i++) {
      // console.log(parsedLog[i]);
      Log.push(parsedLog[i]);
    }
    // console.log(Log);
    
    document.getElementById("Logs").innerHTML = "<table class=\"table table-striped\"><tbody id=\"LogsTable\"></tbody></table>";

    for (var j = 0; j < Log.length; j++) {
      var row = document.createElement("tr");

      var cell = document.createElement("td");
      cell.innerHTML = Log[j];
      row.appendChild(cell);
      document.getElementById("LogsTable").appendChild(row);

      // // HAX!
      // document.getElementById("log").innerHTML = "";

      // document.getElementById("LogsTable").innerHTML +="<div class=\"alert alert-primary\" role=\"alert\">" + Log[j] + "</div>";
      
    }

    if (Log.length > 0) {
      isLogEmpty = false;
      
      alert("Successfully loaded '"+ Log.length +"' Logs!");
    } else {
      isLogEmpty = true;
      
      alert("[Warning] No Logs imported, please check source file!");

    }

  };
  fileread.readAsText(file_to_read);
}


//4. Import - Targets (JSON)
//=========================
function ImportJsonToTargets(){
// //Create Listener that will load file into targets[] 
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

//5. Import - Targets (JSON)
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
//////////////////////////////////////








