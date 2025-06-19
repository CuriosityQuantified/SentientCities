use tokio;
use tonic::{transport::Server, Request, Response, Status};
use tracing::{info, error};
use tracing_subscriber;

mod world;
mod agents;
mod physics;
mod objects;
mod grpc;

use grpc::simulation_server::{Simulation, SimulationServer};
use grpc::{WorldStateRequest, WorldStateResponse, AgentActionRequest, AgentActionResponse};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize logging
    tracing_subscriber::fmt::init();

    info!("Starting SentientCities Simulation Engine");

    let addr = "0.0.0.0:50051".parse()?;
    let simulation_service = SimulationService::new();

    info!("Simulation server listening on {}", addr);

    Server::builder()
        .add_service(SimulationServer::new(simulation_service))
        .serve(addr)
        .await?;

    Ok(())
}