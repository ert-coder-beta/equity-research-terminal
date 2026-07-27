# Architecture

The first release is a modular static browser application hosted by GitHub Pages.

This avoids paid hosting and build complexity while retaining a clean migration path. A backend will only be introduced when secure API keys, scheduled refresh, authentication or multi-user storage are required.

Planned layers:
1. Presentation
2. Application state
3. Financial-domain model
4. SEC ingestion and normalisation
5. Valuation engine
6. Audit lineage
