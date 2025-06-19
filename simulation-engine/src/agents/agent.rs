use nalgebra::{Vector3, Quaternion};
use rapier3d::prelude::*;
use uuid::Uuid;
use std::collections::HashMap;
use serde::{Serialize, Deserialize};

use crate::objects::HouseId;

#[derive(Debug, Clone, Hash, Eq, PartialEq, Serialize, Deserialize)]
pub struct AgentId(pub Uuid);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PhysiologicalNeeds {
    pub hunger: f32,      // 0-100 (0 = starving, 100 = full)
    pub thirst: f32,      // 0-100 (0 = parched, 100 = hydrated)
    pub energy: f32,      // 0-100 (0 = exhausted, 100 = energetic)
    pub bladder: f32,     // 0-100
    pub hygiene: f32,     // 0-100
    pub shelter: bool,    // In shelter or not
}

impl PhysiologicalNeeds {
    pub fn new() -> Self {
        Self {
            hunger: 75.0,
            thirst: 75.0,
            energy: 90.0,
            bladder: 100.0,
            hygiene: 100.0,
            shelter: false,
        }
    }

    pub fn update(&mut self, delta_time: f32) {
        const HUNGER_DECAY_RATE: f32 = 1.0;  // Per minute
        const THIRST_DECAY_RATE: f32 = 1.5;  // Per minute
        const ENERGY_DECAY_RATE: f32 = 0.5;  // Per minute
        
        self.hunger = (self.hunger - delta_time * HUNGER_DECAY_RATE / 60.0).max(0.0);
        self.thirst = (self.thirst - delta_time * THIRST_DECAY_RATE / 60.0).max(0.0);
        self.energy = (self.energy - delta_time * ENERGY_DECAY_RATE / 60.0).max(0.0);
    }

    pub fn get_critical_need(&self) -> Option<Need> {
        if self.thirst < 20.0 { return Some(Need::Water); }
        if self.hunger < 20.0 { return Some(Need::Food); }
        if self.energy < 15.0 { return Some(Need::Sleep); }
        None
    }
}

#[derive(Debug, Clone)]
pub enum Need {
    Water,
    Food,
    Sleep,
}

#[derive(Debug, Clone)]
pub struct Inventory {
    pub items: HashMap<String, u32>,
}

impl Inventory {
    pub fn new() -> Self {
        Self {
            items: HashMap::new(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct Agent {
    pub id: AgentId,
    pub name: String,
    pub position: Vector3<f32>,
    pub rotation: Quaternion<f32>,
    pub rigid_body_handle: Option<RigidBodyHandle>,
    pub needs: PhysiologicalNeeds,
    pub inventory: Inventory,
    pub known_locations: HashMap<String, Vector3<f32>>, // Empty at start
}

impl Agent {
    pub fn new(id: AgentId, name: String, position: Vector3<f32>) -> Self {
        Self {
            id,
            name,
            position,
            rotation: Quaternion::identity(),
            rigid_body_handle: None,
            needs: PhysiologicalNeeds::new(),
            inventory: Inventory::new(),
            known_locations: HashMap::new(),
        }
    }

    pub fn update_needs(&mut self, delta_time: f32) {
        self.needs.update(delta_time);
    }
}