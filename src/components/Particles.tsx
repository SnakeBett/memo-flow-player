export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #6366f1, transparent 70%)",
          top: "-20%",
          right: "-25%",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #ec4899, transparent 70%)",
          bottom: "5%",
          left: "-20%",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #22d3ee, transparent 70%)",
          top: "35%",
          right: "5%",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}
