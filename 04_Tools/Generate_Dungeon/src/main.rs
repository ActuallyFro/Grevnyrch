// A quick CLI to generate a D&D dungeon map within Grevnyrch

use std::io;
use std::io::Write;
use std::env::args;
use rand::Rng;

mod data_defs;
mod init_functions;

use crate::init_functions::new_room;
use crate::init_functions::new_multiverse_dungeon;
use crate::init_functions::new_grevnyrch_dungeon;
use crate::init_functions::new_dungeon;

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


// create main() with args
fn main() {
  let args: Vec<String> = args().collect();
  let mut verbose: bool = false;
  let mut debug: bool = false;
  let mut is_single_room: bool = false;

  //dungeon map config variables
  //============================
  let mut multiverse_world_dungeon: data_defs::WorldDungeon = new_multiverse_dungeon(); 
  let mut grevnyrch_dungeon: data_defs::GrevnyrchDungeon = new_grevnyrch_dungeon(); 
  let mut dungeon: data_defs::Dungeon = new_dungeon(); 

  if args.len() > 1 {
    process_args(&args, &mut verbose, &mut debug, &mut is_single_room, &mut multiverse_world_dungeon, &mut grevnyrch_dungeon, &mut dungeon);
  }

  if !is_single_room {
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

  //TODO Add logic: for EACH ROOM + "max rooms" / etc., but until then:

  //Generate Single Room
  let mut new_room: data_defs::Room = new_room();
  generate_room(&mut new_room);

  println!("[ROOM] === Room {}{} ===", new_room.room_type, new_room.id);
  println!("[ROOM] Room Clock Position: {}", new_room.clock_position);
  println!("[ROOM] Room Distance From Center: {}", new_room.distance_from_center);
  println!("[ROOM] Room Shape: {}", new_room.shape);
  println!("[ROOM] Room Size: {}", new_room.size);
  println!("[ROOM] Room Shape Type: {}", new_room.shape_type);
  println!("[ROOM] Room Shape Orientation: {}", new_room.shape_orientation);
  println!("[ROOM] Room Door Amount: {} (Roll: {})", new_room.door_amount, new_room.door_roll);
  println!("[ROOM] Room General Features: {}", new_room.general_features);
  println!("[ROOM] Room Furnishings: {}", new_room.furnishings);

  

}

fn generate_room(passed_room: &mut data_defs::Room) {
  passed_room.room_type = "S".to_string();
  passed_room.id = 1;

  //Determine Room Shape
  passed_room.shape_id = random_number(1, 8);

  //1 - Circle, 2 - Corridor, 3 - Triangle, 4 - Square, 5 - Pentagon, 6 - Hexagon, 7 - Rectangle, 8 - Octagon
  match passed_room.shape_id {
    1 => passed_room.shape = "Circle <1>".to_string(),
    2 => passed_room.shape = "Corridor <2>".to_string(),
    3 => passed_room.shape = "Triangle <3>".to_string(),
    4 => passed_room.shape = "Square <4>".to_string(),
    5 => passed_room.shape = "Pentagon <5>".to_string(),
    6 => passed_room.shape = "Hexagon <6>".to_string(),
    7 => passed_room.shape = "Rectangle <7>".to_string(),
    8 => passed_room.shape = "Octagon <8>".to_string(),
    _ => passed_room.shape = "[ERROR]".to_string(),
  }

  //Determine Room Size
  let rng_size_a: i32 = random_number(1, 4);
  let rng_size_b: i32 = random_number(1, 8);
  passed_room.size = rng_size_a * rng_size_b * 5;

  let rng_size2_a: i32 = random_number(1, 4);
  let rng_size2_b: i32 = random_number(1, 8);
  passed_room.size2 = rng_size2_a * rng_size2_b * 5;
  
  //determine room placement (clock_position and distance_from_center)
  passed_room.clock_position = random_number(1, 12);
  passed_room.distance_from_center = random_number(1, 100);

  let cooridoor_width: i32 = random_number(1, 8)*5;
  let mut pentagon_type: String = "Regular".to_string();
  let mut pentagon_roll: i32 = random_number(1, 100);
  if pentagon_roll > 50 {
    pentagon_type = "Irregular".to_string();
  }
  //append pentagon_roll to pentagon_type
  pentagon_type = format!("{} <{}>", pentagon_type, pentagon_roll);

  let mut basic_shape_type: String = "Regular".to_string();
  let mut basic_shape_type_roll: i32 = random_number(1, 100);
  if basic_shape_type_roll > 66 {
    basic_shape_type = "Irregular".to_string();
  }
  //append basic_shape_type_roll to basic_shape_type
  basic_shape_type = format!("{} <{}>", basic_shape_type, basic_shape_type_roll);

  // match passed_room.shape_id {
  //   1 | 7 => passed_room.shape_type = "<N/A>".to_string(),
  //   2 => passed_room.shape_type = cooridoor_width.to_string(),
  //   3 | 4 | 6 | 8 => passed_room.shape_type = basic_shape_type.to_string(),
  //   5 => passed_room.shape_type = pentagon_type.to_string(),
  //   _ => passed_room.shape_type = "[ERROR]".to_string(),
  // }

  let mut shape_orientation_roll: i32 = random_number(1, 100);
  if passed_room.shape_id == 1 {
    passed_room.shape_type = "<N/A>".to_string();
    passed_room.shape_orientation = "<N/A>".to_string();

  } else if passed_room.shape_id == 2 {
    passed_room.shape_type = cooridoor_width.to_string();

    if shape_orientation_roll > 50 {
      passed_room.shape_orientation = "Vertical".to_string();
    } else {
      passed_room.shape_orientation = "Horizontal".to_string();
    }

  }

}

fn process_args(args: &Vec<String>, passed_verbose: &mut bool, passed_debug: &mut bool, passed_is_single_room: &mut bool, passed_multiverse_world_dungeon: &mut data_defs::WorldDungeon, passed_greynyrch_dungeon: &mut data_defs::GrevnyrchDungeon, passed_dungeon: &mut data_defs::Dungeon) {
  let mut args_index = 0;
  let mut skip_read = false;
  for arg in args.iter().skip(1) {
    if skip_read {
      skip_read = false;
      continue;
    }

    if *passed_debug {
      println!("[*passed_debug] --------------");
    }

    if is_flag(arg) {
      if arg == "-V" {
        println!("[*passed_verbose] *passed_verbose mode enabled");
        *passed_verbose = true;

      } else if arg == "-D" {
        println!("[*passed_debug] *passed_debug mode enabled");
        *passed_debug = true;

      } else if arg == "-single" {
        println!("[NOTICE] Generating SINGLE ROOM!");
        *passed_is_single_room = true;

      } else {
        println!("[WARNING] Skipping unknown flag: {}", arg);
      }

    } else {
      let next_arg = args.iter().skip(args_index+2).next().unwrap(); 

      if *passed_debug {
        println!("[*passed_debug] arg: {}, next_arg: {}", arg, next_arg);
      }

      if arg == "--name-dungeon" {
        passed_dungeon.name = next_arg.to_string();
        println!("[SETTING] dungeon name: {}", passed_dungeon.name);

      } else if arg == "--name-world" {
        passed_multiverse_world_dungeon.name = next_arg.to_string();
        println!("[SETTING] world name: {}", passed_multiverse_world_dungeon.name);

      } else if arg == "--existing-worlds" {
        passed_multiverse_world_dungeon.existing_worlds = next_arg.trim().parse().unwrap();

        println!("[SETTING] existing_worlds: {}", passed_multiverse_world_dungeon.existing_worlds);

      } else if arg == "--world-words" {
        passed_multiverse_world_dungeon.world_words = next_arg.trim().parse().unwrap();

        println!("[SETTING] world_words: {}", passed_multiverse_world_dungeon.world_words);

      } else {
        println!("[WARNING] Skipping unknown flag: {}", arg);
      }
      args_index += 1;
      skip_read = true;
    }
    args_index += 1;
  }
}