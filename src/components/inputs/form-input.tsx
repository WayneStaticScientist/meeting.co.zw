export default function FormInput(data: {
  title: string;
  name: string;
  type?: string;
  placeholder?: string;
  Icon: any;
  value?: string;
  required?: boolean;
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
        {data.title}
      </label>
      <div className="relative group">
        <data.Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors"
          size={18}
        />
        <input
          required={data.required}
          value={data.value}
          onChange={data.onchange}
          name={data.name}
          type={data.type ?? "text"}
          placeholder={`${data.placeholder}`}
          className="w-full bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500 transition-all text-zinc-900 dark:text-zinc-100"
        />
      </div>
    </div>
  );
}
