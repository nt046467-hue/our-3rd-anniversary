export default function DevToolsOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="devtools-overlay" role="alert" aria-live="assertive">
      <div className="devtools-overlay-inner">
        <div className="devtools-icon" aria-hidden="true">🌸</div>
        <h2>Please close Developer Tools</h2>
        <p>These memories are private and meant only for us.</p>
        <small>Close the inspector to continue viewing ❤️</small>
      </div>
    </div>
  );
}
