pub mod house;
pub mod resource;
pub mod interactive;

pub use house::{House, HouseId};
pub use resource::{Resource, ResourceId, ResourceType};
pub use interactive::InteractableObject;