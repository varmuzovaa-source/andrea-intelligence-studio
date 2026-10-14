<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep shared workspace navigation and client/date state in the root shell so filtering survives route changes.
- Keep deterministic sample analytics in a shared browser-safe data module; never imply sample values are live integrations.
- Use shared analytics controls, charts and tables across content routes so formatting and filters stay consistent.
- Define all visual color roles in src/styles.css semantic tokens so analytics components stay themeable.
