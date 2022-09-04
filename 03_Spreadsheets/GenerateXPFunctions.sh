#!/bin/bash
XPCell="B64"

StartCheckCellLetter="E"
StartCheckCellNumber="78"

CurrentCellNumber="$StartCheckCellNumber"

MVPCellLetter="F"
BonusMVP="0.33"
BroCellLetter="G"
BonusBro="0.20"
DirtyCellLetter="H"
BonusDirty="0.15"
CowardCellLetter="I"
BonusCoward="1"

rows=10

SelectedIndicator="x"

for i in `seq 1 $rows`; do
  CurrentCell="$StartCheckCellLetter$CurrentCellNumber"

  echo "=floor(if($CurrentCell=\"$SelectedIndicator\",$XPCell+product(if($MVPCellLetter$CurrentCellNumber=\"$SelectedIndicator\",$BonusMVP,0),$XPCell)+product(if($BroCellLetter$CurrentCellNumber=\"$SelectedIndicator\",$BonusBro,0),$XPCell)+product(if($DirtyCellLetter$CurrentCellNumber=\"$SelectedIndicator\",$BonusDirty,0),$XPCell)+if($CowardCellLetter$CurrentCellNumber=\"$SelectedIndicator\",$BonusCoward,0),0))"
  CurrentCellNumber=$(( CurrentCellNumber + 1 ))

done
