export const Logo = ({ collapsed = false, className = "" }) => {
    return (
      <div
        className={`h-16 m-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30 ${className}`}
      >
        <div className="flex items-center space-x-1">
          <span className={`font-bold ${collapsed ? "text-lg" : "text-xl"}`}>{collapsed ? "LS" : "Liqaa"}</span>
          {!collapsed && <span className="text-white font-bold text-xl">Space</span>}
        </div>
      </div>
    )
  }
  