export function NewReportIntro() {
  return (
    <div className="flex flex-col space-y-8 lg:col-span-4">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-blue-700">
          Report an <br />Issue
        </h1>
        <p className="text-lg leading-relaxed text-slate-600">Help us build a better city. Provide the details below to dispatch municipal teams.</p>
      </div>
      <div className="space-y-6 pt-8">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">1</div>
          <p className="font-bold text-slate-900">Classification</p>
        </div>
        <div className="flex items-start gap-4 opacity-40">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-900">2</div>
          <p className="font-bold text-slate-900">Evidence</p>
        </div>
      </div>
    </div>
  );
}

