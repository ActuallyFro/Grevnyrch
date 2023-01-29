// A quick CLI to generate a D&D dungeon map within Grevnyrch

use std::io;
use std::io::Write;
use std::env::args;
use rand::Rng;

// determine if argument is a flag (dash and a Captial letter) vs. input argument
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

// random number, with range (min,max), generator
fn random_number(min: i32, max: i32) -> i32 {
  let mut rng = rand::thread_rng();
  let random_number = rng.gen_range(min..max);

  return random_number;
}

//Dungeon Struct
//==============
struct Dungeon {
  name: String,
  purpose: String,
  creator: String,
  npc_alignment: String,
  npc_class: String,
  history: String,
}

// create main() with args
fn main() {
  let args: Vec<String> = args().collect();

  //dungeon map config variables
  //============================

  // Multiverse World Dungeon
  // ------------------------
  let mut isWorldInMultiverse: bool = false;
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
  let mut dungeon: Dungeon = Dungeon {
    name: String::new(),
    purpose: String::new(),
    creator: String::new(),
    npc_alignment: String::new(),
    npc_class: String::new(),
    history: String::new(),
  };

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

  // Determine if Multiverse World Dungeon vs. Grevnyrch Dungeon
  let rngMultiverse: i32 = random_number(1, 100);
  if rngMultiverse >= 67 {
    isWorldInMultiverse = true;
  }
  println!("[DEBUG] 1. isWorldInMultiverse: {} (rolled: {})", isWorldInMultiverse, rngMultiverse);

  // get user input
  println!("[Input] Enter the name of the Dungeon: ");
  io::stdout().flush().unwrap();
  io::stdin().read_line(&mut dungeon.name).unwrap();
  println!("[DEBUG] 2. dungeon.name: {}", dungeon.name);
}