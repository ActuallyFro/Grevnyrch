use crate::data_defs::WorldDungeon;
use crate::data_defs::GrevnyrchDungeon;
use crate::data_defs::Dungeon;
use crate::data_defs::Room;

pub fn new_room() -> Room {
    let mut room: Room = Room {
      room_type: String::new(),
      id: 0,
      shape: String::new(),
      size: 0,
      size2: 0,
      purpose: String::new(),
      contents: String::new(),
      door_roll: 0,
      door_amount: 0,
      doors: Vec::new(),
      traps_tricks_hazards: String::new(),
      monster_motivation: String::new(),
      state: String::new(),
      noises: String::new(),
      odors: String::new(),
      general_features: String::new(),
      furnishings: String::new(),
      contents_other: String::new(),
    };
  
    return room;
  }

pub fn new_multiverse_dungeon() -> WorldDungeon {
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
  
    return multiverse_world_dungeon;
  }

pub fn new_grevnyrch_dungeon() -> GrevnyrchDungeon {
    let mut grevnyrch_dungeon: GrevnyrchDungeon = GrevnyrchDungeon {
      is_outside_klabbbert: false,
      grevnyrch_x: 0,
      grevnyrch_y: 0,
      is_acceptable_xy: false,
      is_new_tear_dungeon: false,
    };
  
    return grevnyrch_dungeon;
  }

pub fn new_dungeon() -> Dungeon {
    let mut dungeon: Dungeon = Dungeon {
      name: String::new(),
      purpose: String::new(),
      creator: String::new(),
      npc_alignment: String::new(),
      npc_class: String::new(),
      history: String::new(),
    };
  
    return dungeon;
  }