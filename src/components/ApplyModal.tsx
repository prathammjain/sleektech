"use client";

import {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import MembershipForm from "./MembershipForm";

type ApplyModalContextValue = {
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
};

const ApplyModalContext = createContext<ApplyModalContextValue | null>(null);

export function ApplyModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeModal]);

  return (
    <ApplyModalContext.Provider value={{ openModal, closeModal, isOpen: open }}>
      {children}
      {open && <ApplyModalContent onClose={closeModal} />}
    </ApplyModalContext.Provider>
  );
}

function ApplyModalContent({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Join the Collective"
      onClick={onClose}
    >
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="modal-body">
          <h2 className="form-panel-heading">Join the Collective</h2>
          <p className="form-panel-sub">
            Membership is by application only. We review every submission personally.
          </p>
          <MembershipForm />
        </div>
      </div>
    </div>
  );
}

function useApplyModal() {
  const ctx = useContext(ApplyModalContext);
  if (!ctx) {
    throw new Error("ApplyModalTrigger must be used within ApplyModalProvider");
  }
  return ctx;
}

export default function ApplyModal({
  triggerClassName = "btn-primary",
  triggerLabel = "Apply for Membership →",
  style,
}: {
  triggerClassName?: string;
  triggerLabel?: string;
  style?: React.CSSProperties;
}) {
  const { openModal } = useApplyModal();

  return (
    <button
      type="button"
      className={triggerClassName}
      style={style}
      onClick={openModal}
    >
      {triggerLabel}
    </button>
  );
}
