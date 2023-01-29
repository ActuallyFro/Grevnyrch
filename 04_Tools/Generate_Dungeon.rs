// A quick CLI to generate a D&D dungeon map within Grevnyrch

use std::io;
use std::io::Write;
use std::env::args;

// determine if flag of a dash and a Captial letter was passed, return bool
fn is_flag(arg: &String) -> bool {
  let mut flag: bool = false;
  let mut dash: bool = false;
  let mut cap: bool = false;

  for c in arg.chars() {
    if c == '-' {
      dash = true;
    } else if c.is_uppercase() {
      cap = true;
    }
  }

  if dash && cap {
    flag = true;
  }

  return flag;
}

// create main() with args
fn main() {
  let args: Vec<String> = args().collect();

  //dungeon map config variables
  //============================

  // Multiverse World Dungeon
  // ------------------------
  let isWorldInMultiverse: bool = false;
  let isNewWorld: bool = false;
  let isWorldInSpace: bool = false;
  let selectedWorld: i32 = 0;

  // Grevnyrch Dungeon
  // -----------------
  let isOutsideKlabbbert: bool = false;
  let GrevnyrchX: i32 = 0;
  let GrevnyrchY: i32 = 0;
  let isAcceptableXY: bool = false;
  let isNewTearDungeon: bool = false;

  // General Dungeon Info
  // --------------------
  let mut dungeonName: String = String::new();
  let dungeonPurpose: String = String::new();
  let dungeonCreator: String = String::new();
  let dungeonNPCAlignment: String = String::new();
  let dungeonNPCClass: String = String::new();
  let dungeonHistory: String = String::new();

  if args.len() > 1 {
    println!("[DEBUG] a total of {} arguments were passed", args.len()-1);

    for arg in args.iter().skip(1) {
      println!("[DEBUG] Looking at: {}", arg);

      if is_flag(arg) {
        println!("[DEBUG] \t{} is a flag", arg);
      } else {
        println!("[DEBUG] \t{} is not a flag", arg);
      }
    }

  // } else {
  //     println!("[DEBUG] no arguments were passed");
  }

  // get user input
  println!("[Input] Enter the name of the Dungeon: ");
  io::stdout().flush().unwrap();
  io::stdin().read_line(&mut dungeonName).unwrap();
}