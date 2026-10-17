# TachyHub

ECG tachyarrhythmia decision support, Holter reporting, ECG image library, learning hub, searchable knowledge base, and references.

## Development

Requires Node.js 22. Run `npm ci` then `npm run dev`.

## Validation

Run `npm run typecheck` and `npm run build`.

## Vercel deployment

Import this repository with framework **Next.js**, repository root as the root directory, Node.js **22.x**, install command `npm ci`, and build command `npm run build`. Keep the output directory at its framework default. No API keys or environment variables are required. Pushes to `main` deploy through the connected Vercel project.

The original `tachy-hub.zip` is retained as a source archive; the extracted application files at the root are the deployment source. Next.js is pinned to 15.5.28 with a committed dependency lockfile.

## Clinical content

Educational decision support only. The original archive contains historical treatment notes; deployment validation does not constitute clinical validation. Clinicians must review recommendations against current guidelines and the original ECG before use.

## Free-text rhythm interpretation

Open **Holter report → Describe a rhythm**. Enter findings or load either example, then select **Interpret description**. Answers contain reasoning, differential diagnoses, missing findings, and source links. Processing runs locally without an API key or text persistence. This is a bounded rule-based parser, not an ECG image reader or unrestricted language model. Supported patterns are absent-P-wave descriptions and regular wide-QRS runs; ambiguous findings request clarification.

Run `node tests/rhythm-reader.test.cjs` for clinical-pattern regression checks.
