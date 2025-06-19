pub mod server;
pub mod handlers;

pub use server::SimulationServiceImpl;
pub use handlers::*;

// Re-export generated proto types
pub use proto::*;

pub mod proto {
    tonic::include_proto!("simulation");
}