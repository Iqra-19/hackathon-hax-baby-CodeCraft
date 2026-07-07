# CLAUDE.md

## Stack

Language: <language and version>
Framework: <framework>
Package manager: <npm / pip / cargo / etc.>
Build: `<build command>`
Test: `<test command>`
Lint: `<lint command>`
DB migrations: `<migration command, if any>`

## Project conventions

- <e.g. API errors must use { error: string } shape>
- <e.g. no business logic in route handlers — service layer owns it>
- <add your own>

## Security notes

- <e.g. all SQL via ORM, no string interpolation>

## Performance notes

- <e.g. async endpoints for all I/O>

## Org process

Follow the spec-driven workflow: https://github.com/Tntra/ai-engineering-playbook
Agents and skills are in .claude/ — committed to this repo.
