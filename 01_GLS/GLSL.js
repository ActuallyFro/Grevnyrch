// Separate Popper & JS:
/* <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script> */
/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js" integrity="sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK" crossorigin="anonymous"></script> --> */

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
["⧘ ⧙", "Damage Amount", "PC or NPC Level Actions", "Numbers"]
];

var targets = [
["Grevnyrch", "Locations", "G"],
["Kla'Bbbert", "Locations", "KB"]
];

var isShowingNumbers = false;

// Generate default brackets
window.onload = function() {
// document.getElementById("bracket").innerHTML = "<option value=\"༺༻\">Realm: ༺ ༻</option><option value=\"〖〗\">City: 〖 〗</option><option value=\"《》\">District: 《 》</option><option value=\"〈〉\">Location: 〈 〉</option><option value=\"⟅⟆\">Round: ⟅ ⟆</option>";

var optionBlank = document.createElement("option");
document.getElementById("bracket").appendChild(optionBlank);

// 1. Setup Brackets
var seletionBracketCount = 1; //due to blank --^
//generate option tags from brackets array
for (var i = 0; i < brackets.length; i++) {

  // Adding options to the Bracket, Tag Dropdown
  var option = document.createElement("option");
  option.value = brackets[i][0];
  option.text = brackets[i][1] + ": " + brackets[i][0];
  if (brackets[i][3] == "Disabled") {
    option.disabled = true;
  }

  document.getElementById("bracket").appendChild(option);

  if (brackets[i][2] == "Locations"){
    document.getElementById("PannelButtonsLocations").innerHTML += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";
  
  } else if (brackets[i][2] == "Timing"){
    document.getElementById("PannelButtonsTiming").innerHTML += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";
  
  } else if (brackets[i][2] == "PC or NPC Level Actions"){
    document.getElementById("PannelButtonsN-PCActions").innerHTML += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"addBracket(" + seletionBracketCount + ")\">" + brackets[i][0] + "</button>";
  }

  seletionBracketCount++;
}

// 2. Setup Targets
for (var j = 0; j < targets.length; j++) {
  var option = document.createElement("option");
  option.text = targets[j][0];

  document.getElementById("targets").appendChild(option);
}

// 3. Add Integers to Dice Div
for (var k = 0; k <= 26; k++) {
  document.getElementById("Dice").innerHTML += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"addNumToLedger(" + k + ")\">" + k + "</button>";
}
document.getElementById("Dice").innerHTML += "<button type=\"button\"  class=\"btn btn-secondary\" onclick=\"addStrToLedger(\"+\")\"> + </button>";
document.getElementById("Dice").innerHTML += "<button type=\"button\" class=\"btn btn-danger\" onclick=\"addNumToLedger(\"-\")\"> - </button>";
document.getElementById("Dice").innerHTML += "<button type=\"button\"  class=\"btn btn-secondary\" onclick=\"addStrToLedger(\"=\")\"> = </button>";

document.getElementById("fileinput").addEventListener("change", function() { //https://qawithexperts.com/article/javascript/read-json-file-with-javascript/380
    var file_to_read = document.getElementById("fileinput").files[0];
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


  });


}

function addBracket(bracketNumber) {
var adjustedBracketNumber = bracketNumber - 1;
if (adjustedBracketNumber >= 0 && adjustedBracketNumber < brackets.length) {
  document.getElementById("bracket").selectedIndex = bracketNumber;
  //if bracket[bracketNumber][3] == "Dice" then toggle
  if (brackets[adjustedBracketNumber][3] == "Dice" || brackets[adjustedBracketNumber][3] == "Numbers") {
    hideShowDice(true);
    // console.log("[DEBUG] [addBracket()] Toggle Dice - on");
  } else {
    // console.log("[DEBUG] [addBracket()] Toggle Dice - off");
    hideShowDice(false);
  }

} else {
  document.getElementById("bracket").selectedIndex = 0;
  // console.log("[DEBUG] [addBracket()] Toggle Dice - off");
  hideShowDice(false);
}

}

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

function CheckAndAddTarget(){
var targetToCheck = document.getElementById("target").value;

//check if passedTargetToCheck is in targetToCheck
//iterate through targets[]
if (targetToCheck == ""){
  return;
}

var newTarget = true;
for (var i = 0; i < targets.length; i++) {
  if (targets[i][0] == targetToCheck) {
    newTarget = false; //target exists
  }
}


//get bracket optional value
var bracketSelectedOption = document.getElementById("bracket").selectedIndex;
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
  var option = document.createElement("option");
  option.text = targetToCheck;
  document.getElementById("targets").appendChild(option);
  
  //add to targets[]
  var newTarget = [targetToCheck, "TBD", ""];
  targets.push(newTarget);
}

}

function LedgerIt() {
var obj = document.getElementById("bracket");
oldLedger.push(document.getElementById("ledger").innerHTML);
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

function LogIt() {
if (isLedgerEmpty){
  // return;
  LedgerIt(); //Auto-ledger then log it
}

var obj = document.getElementById("ledger");
var currentLedger = document.getElementById("ledger").innerHTML;
Log.push(currentLedger);

if (isLogEmpty){
  document.getElementById("log").innerHTML = currentLedger + "<br>";
  isLogEmpty = false;
} else {
  document.getElementById("log").innerHTML += currentLedger + "<br>";
}
CheckAndAddTarget();
ClearLedger();
ClearTag();
ClearTarget();
}

function RemoveLastLog() {
Log.pop();
document.getElementById("log").innerHTML = "";
if (Log.length > 0){
  for (var i = 0; i < Log.length; i++) {
    document.getElementById("log").innerHTML += Log[i] + "<br>";
  }

} else {
  ClearLog();
}

}

function ClearLedger() {
isLedgerEmpty = true;
document.getElementById("ledger").innerHTML = "<h2><i>{Ledger is empty}</i></h2>";
oldLedger = [];
}

function ClearLog() {
isLogEmpty = true;
document.getElementById("log").innerHTML = "<h2><i>{Logs are empty}</i></h2>";
Log = [];
}

function UndoLedger() {
if (oldLedger.length > 0) {
  document.getElementById("ledger").innerHTML = oldLedger[oldLedger.length-1];
  oldLedger.pop();  

} else {
  ClearLedger();
}
}

function ClearTarget() {
document.getElementById("target").value = "";
}

function ClearTag() {
document.getElementById("bracket").value = "";
}