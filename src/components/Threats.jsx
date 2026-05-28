import React from 'react'

function Threats({ logs }) {
	return (
		<div className='bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md text-slate-200 min-h-[500px] flex flex-col animate-fade-in'>
			<div className='border-b border-slate-800 pb-4 mb-4 flex justify-between items-center'>
				<div>
					<h3 className='text-lg font-bold text-white'>
						Jonli Hujumlar Xronikasi (Cyber Threat Log)
					</h3>
					<p className='text-xs text-slate-500'>
						Orqa fonda avtomatik sintez qilingan tahdidlar ro'yxati
					</p>
				</div>
				<span className='px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold font-mono rounded-md animate-pulse'>
					Live Sync Engine
				</span>
			</div>

			{/* Cyber Log Stream Oynasi */}
			<div className='flex-1 overflow-y-auto pr-2 space-y-3 max-h-[420px] custom-scrollbar'>
				{logs.map(log => (
					<div
						key={log.id}
						className={`p-4 rounded-xl border flex items-start gap-4 transition-all duration-300 transform hover:-translate-x-1 ${
							log.type === 'danger'
								? 'bg-red-500/5 border-red-500/20 text-red-200 shadow-[inset_4px_0_0_#ef4444]'
								: log.type === 'warning'
								? 'bg-amber-500/5 border-amber-500/20 text-amber-200 shadow-[inset_4px_0_0_#f59e0b]'
								: 'bg-blue-500/5 border-blue-500/20 text-blue-200 shadow-[inset_4px_0_0_#3b82f6]'
						}`}
					>
						{/* Log Soati */}
						<span className='text-xs font-mono font-bold text-slate-500 pt-0.5'>
							{log.time}
						</span>

						{/* Status Ikonkasi */}
						<div className='text-base mt-0.5'>
							{log.type === 'danger' && (
								<i className='fas fa-biohazard text-red-400'></i>
							)}
							{log.type === 'warning' && (
								<i className='fas fa-exclamation-triangle text-amber-400'></i>
							)}
							{log.type === 'system' && (
								<i className='fas fa-info-circle text-blue-400'></i>
							)}
						</div>

						{/* Kontent Tahlili */}
						<div className='flex-1 space-y-1'>
							<p className='text-sm leading-relaxed'>
								<span className='font-bold tracking-wide uppercase text-xs mr-1 opacity-90'>
									[{log.source}]
								</span>
								{log.desc}
							</p>
							<div className='flex items-center gap-2 text-xs font-semibold'>
								<span className='text-emerald-400 flex items-center gap-1'>
									<i className='fas fa-check-circle'></i> Avtomatik o'chirildi
								</span>
								<span className='text-slate-600'>•</span>
								<span className='text-slate-500 font-mono'>
									ID: {log.id.toString().slice(-5)}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Threats
