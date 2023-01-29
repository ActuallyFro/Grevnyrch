
// World Dungeon Struct
//=====================
pub struct WorldDungeon {
    pub is_world_in_multiverse: bool,
    pub is_new_world: bool,
    pub is_world_in_space: bool,
    pub selected_world: i32,
    pub max_worlds: i32,
    pub existing_worlds: i32,
    pub world_words: i32,
    pub name : String,
  }
  
  // Grevnyrch Dungeon Struct
  //=========================
  pub struct GrevnyrchDungeon {
    pub is_outside_klabbbert: bool,
    pub grevnyrch_x: i32,
    pub grevnyrch_y: i32,
    pub is_acceptable_xy: bool,
    pub is_new_tear_dungeon: bool,
  }
  
  //Dungeon Struct
  //==============
  pub struct Dungeon {
    pub name: String,
    pub purpose: String,
    pub creator: String,
    pub npc_alignment: String,
    pub npc_class: String,
    pub history: String,
  }
  
  pub struct Door {
    pub pos_clock_based: i32,
    pub door_type: String,
    pub leading_to: *const Room,
  }
  
  pub struct Room {
    pub room_type: String,
    pub id: i32,
    pub shape: String,
    pub size: i32,
    pub size2: i32,
    pub purpose: String,
    pub contents: String,
    pub door_roll: i32,
    pub door_amount: i32,
    pub doors: Vec<Door>,
    pub traps_tricks_hazards: String,
    pub monster_motivation: String,
    pub state: String,
    pub noises: String,
    pub odors: String,
    pub general_features: String,
    pub furnishings: String,
    pub contents_other: String,
  }
  