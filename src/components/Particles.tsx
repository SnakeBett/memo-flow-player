export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, #6366f1, transparent 70%)",
          top: "-25%",
          right: "-30%",
          opacity: 0.08,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, #ec4899, transparent 70%)",
          bottom: "0%",
          left: "-25%",
          opacity: 0.06,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, #22d3ee, transparent 70%)",
          top: "30%",
          right: "5%",
          opacity: 0.05,
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
