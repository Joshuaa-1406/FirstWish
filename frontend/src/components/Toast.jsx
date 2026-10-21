import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  return <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}><CheckCircle2 size={21} /><div><strong>{toast.title}</strong><p>{toast.message}</p></div><button onClick={onClose} aria-label="Dismiss notification"><X size={16} /></button></motion.div>}</AnimatePresence>;
}