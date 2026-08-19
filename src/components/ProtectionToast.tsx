type Toast = { id: number; text: string };

export default function ProtectionToast({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="protection-toast-container" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className="protection-toast">
          <span className="protection-toast-icon" aria-hidden="true">🌸</span>
          <span className="protection-toast-text">{toast.text}</span>
        </div>
      ))}
    </div>
  );
}
