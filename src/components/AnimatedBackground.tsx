/**
 * Animated Background with Jitter-style effects
 */

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute -top-1/2 -left-1/2 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent animate-pulse"></div>
      </div>
      
      <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96">
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-600/10 to-transparent rounded-full filter blur-3xl animate-blob"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>
    </div>
  );
}
