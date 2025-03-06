const formatDate = (date: string) => {
    if (date.length > 7) {
        return `${date.slice(5, 7)}/${date.slice(8)}`;
    } else {
        const months: Record<string, string> = { 
            '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', 
            '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' 
        };
        return `${months[date.slice(5, 7)]} ${date.slice(0, 4)}`;
    }
};

export default function LineGraph({ 
    data, 
    dataKey, 
    title, 
    formatValue = (v: number) => v.toFixed(2) 
}: { 
    data: any[]; 
    dataKey: string; 
    title: string; 
    color?: string; 
    formatValue?: (value: number) => string; 
}) { 
    // Extract values and find min/max 
    const values = data.map(item => item[dataKey]); 
    const min = Math.min(...values); 
    const max = Math.max(...values); 
    const range = max - min || 1;  

    // Graph layout
    const width = 425; // Total SVG width
    const height = 150; // Total SVG height
    const paddingLeft = 40; // Space for y-axis labels
    const paddingBottom = 30; // Space for x-axis labels
    const graphWidth = width - paddingLeft - 10; 
    const graphHeight = height - paddingBottom - 10; 

    // X-axis labels
    const xLabels = data.map((item, index) => ({
        label: item.date || `Day ${index + 1}`,
        x: paddingLeft + (index / (data.length - 1)) * graphWidth
    }));

    // Create points for the line 
    const points = data.map((item, index) => { 
        const x = paddingLeft + (index / (data.length - 1)) * graphWidth;  
        const y = (graphHeight + 10) - ((item[dataKey] - min) / range) * graphHeight;  
        return `${x},${y}`; 
    }).join(' '); 

    return ( 
        <div className="flex flex-col mb-4"> 
            <h3 className="text-sm font-medium text-gray-300 mb-1">{title}</h3> 
            <div className="bg-gray-800 rounded-lg p-3 w-[425px] h-[150px] flex justify-center items-center"> 
                <svg width={width} height={height}> 
                    {/* Grid lines */} 
                    {Array.from({ length: 5 }).map((_, i) => {
                        const yValue = min + (range * i) / 4;
                        const yPos = (graphHeight + 10) - ((yValue - min) / range) * graphHeight;
                        return (
                            <g key={i}>
                                <line x1={paddingLeft} x2={width - 10} y1={yPos} y2={yPos} className="stroke-gray-700" strokeWidth="0.5" />
                                <text x={paddingLeft - 5} y={yPos + 3} textAnchor="end" fontSize="10" className="fill-white">
                                    {formatValue(yValue)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Data Line */} 
                    <polyline 
                        points={points} 
                        fill="none" 
                        className="stroke-LvlupBlue" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    /> 

                    {/* Data points */} 
                    {data.map((item, index) => { 
                        const x = paddingLeft + (index / (data.length - 1)) * graphWidth;  
                        const y = (graphHeight + 10) - ((item[dataKey] - min) / range) * graphHeight;  
                        return ( 
                            <circle 
                                key={index} 
                                cx={x} 
                                cy={y} 
                                r="2" 
                                className="fill-white" 
                            /> 
                        ); 
                    })}

                    {/* X-axis labels */}
                    {xLabels.map(({ label, x }, idx) => (
                        <text key={idx} x={x} y={height - 10} textAnchor="middle" fontSize="10" className="fill-white">
                            {formatDate(label)}
                        </text>
                    ))}
                </svg> 
            </div> 
        </div> 
    ); 
}
