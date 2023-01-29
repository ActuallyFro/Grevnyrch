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

// World Dungeon Struct
//=====================
struct WorldDungeon {
  is_world_in_multiverse: bool,
  is_new_world: bool,
  is_world_in_space: bool,
  selected_world: i32,
  max_worlds: i32,
  existing_worlds: i32,
}

// Grevnyrch Dungeon Struct
//=========================
struct GrevnyrchDungeon {
  is_outside_klabbbert: bool,
  grevnyrch_x: i32,
  grevnyrch_y: i32,
  is_acceptable_xy: bool,
  is_new_tear_dungeon: bool,
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
  let mut verbose: bool = false;

  //dungeon map config variables
  //============================

  // Multiverse World Dungeon
  // ------------------------
  let mut multiverse_world_dungeon: WorldDungeon = WorldDungeon {
    is_world_in_multiverse: false,
    is_new_world: false,
    is_world_in_space: false,
    selected_world: 0,
    max_worlds: 16,
    existing_worlds: 0,
  };

  // Grevnyrch Dungeon
  // -----------------
  let mut grevnyrch_dungeon: GrevnyrchDungeon = GrevnyrchDungeon {
    is_outside_klabbbert: false,
    grevnyrch_x: 0,
    grevnyrch_y: 0,
    is_acceptable_xy: false,
    is_new_tear_dungeon: false,
  };

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
    for arg in args.iter().skip(1) {
      if is_flag(arg) {
        if arg == "-V" {
          println!("[VERBOSE] Verbose mode enabled");
          verbose = true;
        }

      } else {
        if arg == "--name" {
          let next_arg = args.iter().skip(2).next().unwrap();
          dungeon.name = next_arg.to_string();
        }
      }
    }
  }

  // Determine if Multiverse World Dungeon vs. Grevnyrch Dungeon
  let rng_multiverse: i32 = random_number(1, 100);
  if rng_multiverse >= 67 {
    multiverse_world_dungeon.is_world_in_multiverse = true;
  }

  if verbose {
    println!("[VERBOSE] 1. is_world_in_multiverse: {} (rolled: {})", multiverse_world_dungeon.is_world_in_multiverse, rng_multiverse);
  }

  if multiverse_world_dungeon.is_world_in_multiverse {

    //Pick a world from the multiverse
    let rng_multiverse_existing: i32 = random_number(1, 100);
    if rng_multiverse_existing >= 67 {
      multiverse_world_dungeon.selected_world = random_number(1, multiverse_world_dungeon.max_worlds);
    } else {
      println!("[Input] Enter the max range of number of existing worlds: ");
      io::stdout().flush().unwrap();
      let mut existing_worlds_str = String::new();
      io::stdin().read_line(&mut existing_worlds_str).unwrap();
      multiverse_world_dungeon.existing_worlds = existing_worlds_str.trim().parse().unwrap();
      multiverse_world_dungeon.selected_world = random_number(1, multiverse_world_dungeon.existing_worlds);
    }
  
  }


  if dungeon.name.is_empty() {
    // refactor: get_user_input(&mut dungeon);?

    println!("[Input] Enter the name of the Dungeon: ");
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut dungeon.name).unwrap();
  }

  if verbose {
    println!("[VERBOSE] 2. dungeon.name: {}", dungeon.name);
    println!("[VERBOSE] 3. selected_world: {}", multiverse_world_dungeon.selected_world);
  }
}