use rapier3d::prelude::*;
use std::collections::HashMap;
use dashmap::DashMap;
use nalgebra::Vector3;
use uuid::Uuid;

use crate::agents::{Agent, AgentId};
use crate::objects::{House, HouseId};
use crate::world::resources::{Resource, ResourceId};

pub struct World {
    pub physics_pipeline: PhysicsPipeline,
    pub integration_parameters: IntegrationParameters,
    pub island_manager: IslandManager,
    pub broad_phase: BroadPhase,
    pub narrow_phase: NarrowPhase,
    pub rigid_body_set: RigidBodySet,
    pub collider_set: ColliderSet,
    pub impulse_joint_set: ImpulseJointSet,
    pub multibody_joint_set: MultibodyJointSet,
    pub ccd_solver: CCDSolver,
    
    pub agents: DashMap<AgentId, Agent>,
    pub houses: DashMap<HouseId, House>,
    pub resources: DashMap<ResourceId, Resource>,
    
    pub time: f64,
    pub day_cycle: f32,
}

impl World {
    pub fn new() -> Self {
        let physics_pipeline = PhysicsPipeline::new();
        let integration_parameters = IntegrationParameters::default();
        let island_manager = IslandManager::new();
        let broad_phase = BroadPhase::new();
        let narrow_phase = NarrowPhase::new();
        let rigid_body_set = RigidBodySet::new();
        let collider_set = ColliderSet::new();
        let impulse_joint_set = ImpulseJointSet::new();
        let multibody_joint_set = MultibodyJointSet::new();
        let ccd_solver = CCDSolver::new();

        Self {
            physics_pipeline,
            integration_parameters,
            island_manager,
            broad_phase,
            narrow_phase,
            rigid_body_set,
            collider_set,
            impulse_joint_set,
            multibody_joint_set,
            ccd_solver,
            agents: DashMap::new(),
            houses: DashMap::new(),
            resources: DashMap::new(),
            time: 0.0,
            day_cycle: 0.0,
        }
    }

    pub fn create_blank_slate_world() -> Self {
        let mut world = World::new();
        
        // Add ground plane
        let ground_body = RigidBodyBuilder::fixed()
            .translation(vector![0.0, -0.1, 0.0])
            .build();
        let ground_handle = world.rigid_body_set.insert(ground_body);
        
        let ground_collider = ColliderBuilder::cuboid(50.0, 0.1, 50.0)
            .build();
        world.collider_set.insert_with_parent(
            ground_collider,
            ground_handle,
            &mut world.rigid_body_set
        );

        // Create two houses
        let house1 = House::new(
            Vector3::new(10.0, 0.0, 10.0),
            "red".to_string(),
            Some(AgentId(Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap())),
        );
        
        let house2 = House::new(
            Vector3::new(-10.0, 0.0, -10.0),
            "blue".to_string(),
            Some(AgentId(Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap())),
        );

        world.houses.insert(house1.id.clone(), house1);
        world.houses.insert(house2.id.clone(), house2);

        // Create lake
        let lake = Resource::Lake {
            id: ResourceId(Uuid::new_v4()),
            position: Vector3::new(0.0, 0.0, 0.0),
            radius: 5.0,
        };
        
        if let Resource::Lake { id, .. } = &lake {
            world.resources.insert(id.clone(), lake);
        }

        // Create plants
        for i in 0..5 {
            let angle = (i as f32) * std::f32::consts::TAU / 5.0;
            let plant = Resource::Plant {
                id: ResourceId(Uuid::new_v4()),
                position: Vector3::new(
                    angle.cos() * 15.0,
                    0.0,
                    angle.sin() * 15.0
                ),
                nutrition: 20.0,
                quantity: 5,
            };
            
            if let Resource::Plant { id, .. } = &plant {
                world.resources.insert(id.clone(), plant);
            }
        }

        // Create agents
        let agent1 = Agent::new(
            AgentId(Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap()),
            "Alice".to_string(),
            Vector3::new(5.0, 0.0, 5.0),
        );
        
        let agent2 = Agent::new(
            AgentId(Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap()),
            "Bob".to_string(),
            Vector3::new(-5.0, 0.0, -5.0),
        );

        world.agents.insert(agent1.id.clone(), agent1);
        world.agents.insert(agent2.id.clone(), agent2);

        world
    }

    pub fn step(&mut self, delta_time: f32) {
        // Update physics
        let gravity = vector![0.0, -9.81, 0.0];
        self.physics_pipeline.step(
            &gravity,
            &self.integration_parameters,
            &mut self.island_manager,
            &mut self.broad_phase,
            &mut self.narrow_phase,
            &mut self.rigid_body_set,
            &mut self.collider_set,
            &mut self.impulse_joint_set,
            &mut self.multibody_joint_set,
            &mut self.ccd_solver,
            None,
            &(),
            &(),
        );

        // Update world time
        self.time += delta_time as f64;
        self.day_cycle = ((self.time / 86400.0) % 1.0) as f32; // 24 hour cycle

        // Update agent needs
        for mut agent in self.agents.iter_mut() {
            agent.update_needs(delta_time);
        }
    }
}