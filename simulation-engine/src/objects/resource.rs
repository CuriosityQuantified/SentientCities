use nalgebra::Vector3;
use uuid::Uuid;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Hash, Eq, PartialEq, Serialize, Deserialize)]
pub struct ResourceId(pub Uuid);

#[derive(Debug, Clone)]
pub enum Resource {
    Lake {
        id: ResourceId,
        position: Vector3<f32>,
        radius: f32,
    },
    Plant {
        id: ResourceId,
        position: Vector3<f32>,
        nutrition: f32,
        quantity: u32,
    },
}

impl Resource {
    pub fn get_id(&self) -> &ResourceId {
        match self {
            Resource::Lake { id, .. } => id,
            Resource::Plant { id, .. } => id,
        }
    }

    pub fn get_position(&self) -> &Vector3<f32> {
        match self {
            Resource::Lake { position, .. } => position,
            Resource::Plant { position, .. } => position,
        }
    }

    pub fn get_appearance(&self) -> ResourceAppearance {
        match self {
            Resource::Lake { .. } => ResourceAppearance {
                shape: "large blue circle".to_string(),
                color: "blue".to_string(),
                size: "large".to_string(),
                surface: Some("reflective".to_string()),
                resource_type: "lake".to_string(),
            },
            Resource::Plant { .. } => ResourceAppearance {
                shape: "small green cluster".to_string(),
                color: "green".to_string(),
                size: "small".to_string(),
                surface: None,
                resource_type: "plant".to_string(),
            },
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct ResourceAppearance {
    pub shape: String,
    pub color: String,
    pub size: String,
    pub surface: Option<String>,
    pub resource_type: String,
}

#[derive(Debug, Clone, Copy)]
pub enum ResourceType {
    Lake,
    Plant,
}