fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .build_server(true)
        .build_client(false)
        .compile(&["../shared/proto/simulation.proto"], &["../shared/proto/"])?;
    Ok(())
}