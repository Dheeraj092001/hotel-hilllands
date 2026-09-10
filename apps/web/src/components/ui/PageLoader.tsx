import { motion } from "framer-motion";
export default function PageLoader() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-[#F7F3EA] z-50">
      <div className="flex flex-col items-center gap-6">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-[#D9C7A3] border-t-[#183C32]" />
        <p className="text-[#78756E] font-sans text-sm tracking-widest uppercase">Hotel Newlands</p>
      </div>
    </motion.div>
  );
}
