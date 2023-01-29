#!/bin/bash

for i in `seq 1 10000`; do 

  ./target/debug/Dungeon_Generator --name "RD005" | grep is_world | tr -d ")" | sed s/"rolled: "/"\n"/g | grep -v DEBUG

done | sort | uniq -c | sed -e 's/^ *//;s/ /,/' | awk -F, '{ print $2 "," $1 }' > 10K_run.csv
