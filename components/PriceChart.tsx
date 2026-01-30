import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PriceChartProps {
  data: Array<{
    date: string;
    yes: number;
    no: number;
  }>;
}

export function PriceChart({ data }: PriceChartProps) {
  const formattedData = data.map(point => ({
    ...point,
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    yesPercent: point.yes * 100,
    noPercent: point.no * 100
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
            formatter={(value: number | any) => [`${Number(value).toFixed(1)}%`, '']}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="yesPercent"
            stroke="#a855f7"
            strokeWidth={2}
            name="Yes"
            dot={false}
            activeDot={{ r: 4, fill: '#a855f7' }}
          />
          <Line
            type="monotone"
            dataKey="noPercent"
            stroke="#3b82f6"
            strokeWidth={2}
            name="No"
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
