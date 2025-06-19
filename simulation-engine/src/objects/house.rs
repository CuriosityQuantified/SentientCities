use nalgebra::Vector3;
use uuid::Uuid;
use serde::{Serialize, Deserialize};
use crate::agents::AgentId;

#[derive(Debug, Clone, Hash, Eq, PartialEq, Serialize, Deserialize)]
pub struct HouseId(pub Uuid);

#[derive(Debug, Clone)]
pub struct House {
    pub id: HouseId,
    pub position: Vector3<f32>,
    pub color: String,
    pub size: String,
    pub shape: String,
    pub has_door: bool,
    pub owner_id: Option<AgentId>,
    pub is_locked: bool,
    pub interior_temperature: f32,
}

impl House {
    pub fn new(position: Vector3<f32>, color: String, owner_id: Option<AgentId>) -> Self {
        Self {
            id: HouseId(Uuid::new_v4()),
            position,
            color,
            size: "large".to_string(),
            shape: "rectangular structure".to_string(),
            has_door: true,
            owner_id,
            is_locked: false,
            interior_temperature: 20.0,
        }
    }

    pub fn is_owner(&self, agent_id: &AgentId) -> bool {
        self.owner_id.as_ref() == Some(agent_id)
    }
}