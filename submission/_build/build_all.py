"""Rebuilds every deliverable. Run after editing facts.py or any document module."""

import diagrams
import docs_design
import docs_maintenance
import docs_manual
import docs_project
import docs_readme
import docs_srs

if __name__ == "__main__":
    print("Diagrams")
    for fn in diagrams.ALL:
        fn()
    print(f"  {len(diagrams.ALL)} figures\n")

    print("Documents")
    for builder in (
        docs_srs.build,
        docs_design.build,
        docs_testing_build := None,
    ):
        if builder:
            builder()

    import docs_testing
    docs_testing.build()
    docs_manual.build()
    docs_maintenance.build()
    docs_project.build()
    docs_readme.build_readme()
    docs_readme.build_links()
    print("  all documents rebuilt")
