// A quick CLI to generate a D&D dungeon map within Grevnyrch

use std::io;
use std::io::Write;
use std::env::args;
use rand::Rng;

//single dash with any number of alpha-numeric characters
fn is_flag(arg: &String) -> bool {
  let mut flag: bool = false;
  let mut dash: bool = false;
  let mut nonalphanum: bool = false;

  let mut dashCount: i32 = 0;
  for c in arg.chars() {
    if c == '-' {
      dash = true;
      dashCount += 1;

    } else if !c.is_alphanumeric() {
      nonalphanum = true;
      break;      
    }
  }

  if dash && dashCount == 1  && !nonalphanum {
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
  world_words: i32,
  name : String,
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
  let mut debug: bool = false;

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
    world_words: 2,
    name: String::new(),
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
    let mut args_index = 0;
    let mut skip_read = false;
    for arg in args.iter().skip(1) {
      if skip_read {
        skip_read = false;
        continue;
      }

      if debug {
        println!("[DEBUG] --------------");
      }

      if is_flag(arg) {
        if arg == "-V" {
          println!("[VERBOSE] Verbose mode enabled");
          verbose = true;
        } else if arg == "-D" {
          println!("[DEBUG] Debug mode enabled");
          debug = true;

        } else {
          println!("[WARNING] Skipping unknown flag: {}", arg);
        }

      } else {
        let next_arg = args.iter().skip(args_index+2).next().unwrap(); 

        if debug {
          println!("[DEBUG] arg: {}, next_arg: {}", arg, next_arg);
        }

        if arg == "--name-dungeon" {
          dungeon.name = next_arg.to_string();
          println!("[SETTING] dungeon name: {}", dungeon.name);

        } else if arg == "--name-world" {
          multiverse_world_dungeon.name = next_arg.to_string();
          println!("[SETTING] world name: {}", multiverse_world_dungeon.name);

        } else if arg == "--existing-worlds" {
          multiverse_world_dungeon.existing_worlds = next_arg.trim().parse().unwrap();

          println!("[SETTING] existing_worlds: {}", multiverse_world_dungeon.existing_worlds);

        } else if arg == "--world-words" {
          multiverse_world_dungeon.world_words = next_arg.trim().parse().unwrap();

          println!("[SETTING] world_words: {}", multiverse_world_dungeon.world_words);

        } else {
          println!("[WARNING] Skipping unknown flag: {}", arg);
        }
        args_index += 1;
        skip_read = true;
      }
      args_index += 1;
    }
  }

  // Determine if Multiverse World Dungeon vs. Grevnyrch Dungeon
  let rng_multiverse: i32 = random_number(1, 100);
  if rng_multiverse >= 67 {
    multiverse_world_dungeon.is_world_in_multiverse = true;
  }

  if debug {
    println!("[DEBUG] is_world_in_multiverse: {} (rolled: {})", multiverse_world_dungeon.is_world_in_multiverse, rng_multiverse);
  }

  if multiverse_world_dungeon.is_world_in_multiverse {

    //Pick a world from the multiverse
    let rng_multiverse_existing: i32 = random_number(1, 100);
    if rng_multiverse_existing >= 67 {
      println!("[WORLD] == NEW Multiverse World ===");
      multiverse_world_dungeon.selected_world = random_number(1, multiverse_world_dungeon.max_worlds);

      if multiverse_world_dungeon.name == "" {
        println!("[NOTICE] Go to webpage: https://www.fantasynamegenerators.com/world-names.php");
        //create vector to block repeat words
        let mut used_words: Vec<i32> = Vec::new();
  
        while used_words.len() < multiverse_world_dungeon.world_words as usize {
          let rng_world_word: i32 = random_number(1, 20);
          
          //check if rng_world_word is in used_words
          if !used_words.contains(&rng_world_word) {
            used_words.push(rng_world_word);

            if debug {
              println!("[DEBUG] For World Name: Use word: {}", rng_world_word);
            }
          }
        }

        // convert vector to string with values inside <>
        for word in used_words.iter() {
          multiverse_world_dungeon.name.push_str("<");
          multiverse_world_dungeon.name.push_str(&word.to_string());
          multiverse_world_dungeon.name.push_str("> ");
        }
        //remove trailing space
        multiverse_world_dungeon.name.pop();
      }

    } else {
      println!("[WORLD] === Existing Multiverse World === ");

      if multiverse_world_dungeon.existing_worlds == 0 {
        println!("[Input] Enter the max range of number of existing worlds: ");
        io::stdout().flush().unwrap();
        let mut existing_worlds_str = String::new();
        io::stdin().read_line(&mut existing_worlds_str).unwrap();
        multiverse_world_dungeon.existing_worlds = existing_worlds_str.trim().parse().unwrap();
      }

      multiverse_world_dungeon.selected_world = random_number(1, multiverse_world_dungeon.existing_worlds);
      multiverse_world_dungeon.name = format!("<Look Up Name!>");

    }

    println!("[WORLD] Selected World: {}", multiverse_world_dungeon.selected_world);
    println!("[WORLD] World Name: {}", multiverse_world_dungeon.name);
  
  } else {
    println!("[WORLD] === Grevnyrch ===");
  }


  if dungeon.name.is_empty() {
    // refactor: get_user_input(&mut dungeon);?

    println!("[Input] Enter the name of the Dungeon: ");
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut dungeon.name).unwrap();
  }

  if verbose {
    if multiverse_world_dungeon.is_world_in_multiverse {
      println!("[VERBOSE] W1. existing_worlds: {}", multiverse_world_dungeon.existing_worlds);
      println!("[VERBOSE] W2. selected_world: {}", multiverse_world_dungeon.selected_world);  
      println!("[VERBOSE] W3. world name: {}", multiverse_world_dungeon.name);
    } else {
      println!("[VERBOSE] W1. In Grevnyrch");
    }

    println!("[VERBOSE] 2. dungeon name: {}", dungeon.name);
  }
}