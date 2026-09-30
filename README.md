# Surface Water Change Detection

A geospatial application for monitoring surface water changes using satellite imagery and Google Earth Engine.

## Problem

Surface water bodies such as lakes, ponds and reservoirs change over time due to urbanization, climate variability and seasonal conditions. Monitoring these changes helps identify areas of water gain and loss.

## Solution

This project uses Sentinel-2 satellite imagery and spectral indices to detect and compare surface water across multiple years.

## Methodology

- Sentinel-2 Surface Reflectance imagery
- NDWI for water detection
- MNDWI for improved water extraction
- NDVI to reduce vegetation-related false detections
- Multi-temporal comparison
- Water gain and loss calculation
- Connected-pixel hotspot detection

## Study Years

2018, 2020, 2022, 2024 and 2026

## Outputs

- Satellite imagery
- Water extent maps
- Multi-year water statistics
- Water gain hotspots
- Water loss hotspots
- Water area change chart

## Technology

- Google Earth Engine
- JavaScript
- Sentinel-2
- NDWI
- MNDWI
- NDVI

## Live Application

https://adhikarapranavi06.users.earthengine.app/view/surface-water-change-detection

## Project Code

The complete Google Earth Engine implementation is available in this repository.

## Environmental Impact

The system can support monitoring of changing surface-water resources and help identify locations requiring further environmental investigation.
