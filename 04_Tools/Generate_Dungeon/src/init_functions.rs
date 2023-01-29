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