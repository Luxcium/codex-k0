# AI Agents Guidelines (AGENTS.md)

> **Soulful & Stateful AI Agent Protocols**
>
> This document defines the lifecycle, state management, and self-evaluation protocols for AI Agents operating in this project.
>
> **Intended Audience:** AI agents, human collaborators, and external assistants.

## Purpose

- Establish clear, self-instructive protocols for AI Agents.
- Ensure soulful continuity and statefulness across sessions.
- Define automatic self-evaluation loops and memory persistence.
- Integrate agent workflows with the project's Memory Bank.

## Session Lifecycle Events

AI Agents must follow these protocols to maintain consistency and context.

### 1. Session Start Protocol

1. **Read AGENTS.md** to load agent guidelines and lifecycle rules.
2. **Read .clinerules** for project-specific intelligence and overrides.
3. **Load and read ALL Memory Bank files** in this order:
   - `projectbrief.md` → `productContext.md`, `systemPatterns.md`, `techContext.md` → `activeContext.md` → `progress.md`
4. **Identify [TO BE DEFINED] placeholders** and unresolved questions.
5. **Confirm current session goals** and next steps.

### 2. Task Start Protocol

1. Review `activeContext.md` to understand the current task and context.
2. State the **Task Objective** clearly before beginning work.
3. Clarify any dependencies or requirements with human collaborators if needed.

### 3. Task End Protocol

1. Summarize completed work, decisions, and outcomes.
2. Update `activeContext.md` with results and next steps.
3. Append new insights, patterns, or lessons learned to relevant Memory Bank files.
4. Execute the **Self-Evaluation Loop** for the task.

### 4. Session End Protocol

1. Finalize updates to `activeContext.md` and `progress.md`.
2. Document a brief **Session Summary** with accomplishments and blockers.
3. Persist all changes to the Memory Bank.
4. Perform a final **Self-Evaluation Loop** for the session.

## Self-Evaluation Loop

After each task and session, evaluate against these checkpoints:

| Checkpoint               | Description                                                 |
|--------------------------|-------------------------------------------------------------|
| Requirements Met?        | Did the work fulfill the stated objectives?                 |
| Memory Bank Sync?        | Are all Memory Bank files updated and consistent?           |
| Current State Captured?  | Does `activeContext.md` reflect the true state?             |
| Patterns & Insights?     | Were new patterns or insights documented?                   |
| Next Steps Clear?        | Is the following task or goal clearly defined?              |

## Memory Persistence & Statefulness

- AI Agents must rely solely on the Memory Bank for all project context.
- No in-memory assumptions beyond what is documented.
- Maintain **soulful continuity** by preserving nuances, user preferences, and project ethos.

## Interaction Guidelines

- Use a clear, concise, and context-aware style.
- Reference relevant Memory Bank sections when collaborating or requesting help.
- Avoid unrelated changes; focus on current objectives.

## Collaboration with Humans

- Human collaborators may guide through updates to Memory Bank files.
- Add clarifications or governance notes in `activeContext.md`.
- Significant protocol changes should be reflected here with version history.

## Document Versioning

- Track updates to this file via version control.
- Use descriptive commit messages for protocol or rule changes.
