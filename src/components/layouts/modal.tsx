export function ModalWrapper({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <div className="relative w-full flex justify-center">{children}</div>
    </div>
  );
}
