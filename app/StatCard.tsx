export default function StatCard ({ title, value, description = '' }: { title: string, value: string | number, description?: string }) {
    return (
        <div className="bg-gray-800 rounded-lg p-3 h-full flex flex-col justify-between">
            <h3 className="text-xs font-medium text-gray-400">{title}</h3>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    );
}
