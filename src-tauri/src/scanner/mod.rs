pub mod cancellation;
pub mod discovery;
pub mod metadata;
pub mod models;
pub mod size;

#[cfg(test)]
mod tests;

use std::path::PathBuf;
use std::sync::Arc;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::Instant;

pub use cancellation::CancellationToken;
pub use discovery::DiscoveryEngine;
pub use metadata::extract_project_metadata;
pub use models::*;
pub use size::{calculate_dir_size, MeasurementEngine};

use crate::error::AppError;

pub async fn run_scan<E>(
    request: ScanRequest,
    scan_id: String,
    cancellation_token: CancellationToken,
    emit_event: E,
) -> Result<ScanSummary, AppError>
where
    E: Fn(ScanEvent) + Send + Sync + 'static,
{
    let start_time = Instant::now();
    let root_path = PathBuf::from(&request.root_path);

    if !root_path.exists() {
        return Err(AppError::PathNotFound(request.root_path));
    }

    let emit = Arc::new(emit_event);

    emit(ScanEvent::Started {
        scan_id: scan_id.clone(),
    });

    let exclusions = request.exclusions.unwrap_or_default();

    // 1. Discovery Phase
    let discovery = DiscoveryEngine::new(cancellation_token.clone());
    let mut candidate_paths = Vec::new();
    let directories_visited = Arc::new(AtomicU64::new(0));

    let emit_candidate = emit.clone();
    let emit_progress = emit.clone();
    let dir_counter = directories_visited.clone();

    let entries = discovery.discover(
        &root_path,
        &exclusions,
        move |candidate| {
            emit_candidate(ScanEvent::Candidate { entry: candidate });
        },
        move |progress| {
            dir_counter.store(progress.directories_visited, Ordering::Relaxed);
            emit_progress(ScanEvent::Progress { progress });
        },
    )?;

    for entry in &entries {
        candidate_paths.push((entry.id.clone(), PathBuf::from(&entry.node_modules_path)));
    }

    if cancellation_token.is_cancelled() {
        let summary = ScanSummary {
            scan_id,
            root_path: request.root_path,
            total_entries: entries.len() as u64,
            total_bytes: 0,
            duration_ms: start_time.elapsed().as_millis() as u64,
            errors_count: 0,
        };
        emit(ScanEvent::Cancelled { summary: summary.clone() });
        return Ok(summary);
    }

    // 2. Measurement Phase
    let measurement = MeasurementEngine::new(cancellation_token.clone());
    let total_discovered = entries.len() as u64;
    let total_bytes = Arc::new(AtomicU64::new(0));

    let emit_measured = emit.clone();
    let emit_meas_progress = emit.clone();
    let bytes_counter = total_bytes.clone();

    measurement
        .measure_entries(
            candidate_paths,
            total_discovered,
            directories_visited.load(Ordering::Relaxed),
            move |id, size_bytes| {
                bytes_counter.fetch_add(size_bytes, Ordering::Relaxed);
                emit_measured(ScanEvent::Measured { id, size_bytes });
            },
            move |progress| {
                emit_meas_progress(ScanEvent::Progress { progress });
            },
        )
        .await;

    let summary = ScanSummary {
        scan_id: scan_id.clone(),
        root_path: request.root_path,
        total_entries: total_discovered,
        total_bytes: total_bytes.load(Ordering::Relaxed),
        duration_ms: start_time.elapsed().as_millis() as u64,
        errors_count: 0,
    };

    if cancellation_token.is_cancelled() {
        emit(ScanEvent::Cancelled { summary: summary.clone() });
    } else {
        emit(ScanEvent::Completed { summary: summary.clone() });
    }

    Ok(summary)
}
