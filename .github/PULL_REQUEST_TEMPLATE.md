## Description
Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context.

## Type of change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes, no API changes)

## Money-Safety & Ledger Checks
If this PR touches financial logic, please confirm:
- [ ] Atomicity: Wallet mutations are within a single Prisma `$transaction`.
- [ ] Idempotency: `Idempotency-Key` headers are correctly validated and handled.
- [ ] No Offline Credits: I have not introduced any offline capabilities for credit-producing actions.
- [ ] Invariant holds: The reconciliation invariant tests pass successfully.

## Testing Performed
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] End-to-end (E2E) Tests
- [ ] Manual verification

## UI / Visual Checks
If this PR alters the UI:
- [ ] Meets contrast requirements (especially for numerals/balances).
- [ ] Dark mode/Light mode checked where applicable.
- [ ] Responsive design verified (mobile/tablet/desktop).
