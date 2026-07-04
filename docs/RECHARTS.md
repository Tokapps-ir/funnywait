# Recharts

## Overview

Recharts is a powerful and flexible charting library built on top of React and D3.js. It provides a declarative API for creating charts that easily integrate into React applications.

**Version:** ^3.7.0  
**Homepage:** [https://recharts.org/](https://recharts.org/)  
**GitHub:** [https://github.com/recharts/recharts](https://github.com/recharts/recharts)  
**License:** MIT

## Installation

```bash
npm install recharts
```

## Key Features

### 1. Component-Based Architecture

Recharts uses a component-based approach where you compose charts from smaller chart components:

```tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398 },
  { name: 'Mar', uv: 2000, pv: 980 }
];

const SimpleLineChart = ({ title, data }) => {
  return (
    <LineChart data={data} />
  );
};
```

### 2. Chart Types

#### Bar Chart
```tsx
import { BarChart, BarCartesianGrid, XAxis, YAxis } from 'recharts';

<BarChart data={data}>
  <CartesianGrid strokeDasharray="5 5" />
  <XAxis dataKey="name" />
  <YAxis />
  <Bar dataKey="uv" fill="#8884d8" />
  <Bar dataKey="pv" fill="#82ca9d" />
  <Tooltip />
</BarChart>
```

#### Line Chart
```tsx
<LineChart data={data}>
  <CartesianGrid strokeDasharray="5 5" />
  <XAxis dataKey="name" />
  <YAxis />
  <Line type="monotone" dataKey="uv" stroke="#8884d8" />
  <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
  <Tooltip />
</LineChart>
```

#### Pie Chart
```tsx
import { PieChart, Pie, Cell, Legend } from 'recharts';

const chartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
];

const COLORS = ['#0088FE', '#008080', '#008000'];

<PieChart width={400} height={400} data={chartData}>
  <Pie
    data={chartData}
    innerRadius={60}
    outerRadius={80}
    fill="#8884d8"
    dataKey="value"
    nameKey="name"
  >
    {/* Customize each cell with a color */}
    {chartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

#### Area Chart
```tsx
<AreaChart data={data}>
  <CartesianGrid strokeDasharray="5 5" />
  <XAxis dataKey="name" />
  <YAxis />
  <Area type="monotone" dataKey="uv" stackId="1" fill="#8884d8" />
  <Area type="monotone" dataKey="pv" stackId="1" fill="#82ca9d" />
  <Tooltip />
  <Legend />
</AreaChart>
```

#### Scatter Plot
```tsx
import { ScatterChart, Scatter, XAxis, YAxis } from 'recharts';

const scatterData = [
  { x: 5, y: 10, dataKey: 1 },
  { x: 4, y: 15, dataKey: 2 },
];

<ScatterChart data={scatterData}>
  <Scatter name="Group 1" fill="#fff">
    <ScatterShape fill="#000" />
  </Scatter>
  <XAxis type="number" dataKey="x" />
  <YAxis type="number" dataKey="y" />
  <Tooltip cursor={false} content={null} />
</ScatterChart>
```

#### Radial Chart
```tsx
import { RadialBarChart, RadialBar, Legend } from 'recharts';

const radialData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
];

<RadialBarChart cx={100} cy={150} innerR={100} outerR={50} data={radialData} />
<RadialBar
  dataKey="value"
  fill="#8884d8"
  cornerRadius={5}
  barSize={6}
 />
```

#### Polar Area Chart
```tsx
import { PolarAxis, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, Bar, Legend, Rectangle } from 'recharts';

const polarData = [
  { subject: 'Math', A: 25, fullMarks: 100 },
  { subject: 'English', A: 80, fullMarks: 100 },
];

<PolarAreaChart data={polarData}>
  {/* Angle axis - controls label angles */}
  <PolarAngleAxis
    dataKey="subject"
    tick={{ fill: '#ccc' }}
    stroke="none"
  />
  {/* Radius axis - controls bar width */}
  <PolarRadiusAxis angle={90} stroke="none" />
  <PolarArea dataKey="A" />
  <Legend />
</PolarAreaChart>
```

### 3. Customizing Chart Components

```tsx
// Customizing XAxis and YAxis
<XAxis
  dataKey="name"
  label={{
    value: 'Month',
    position: 'insideBottom',
    offset: -5
  }}
  tickFormatter={(tickProps) => {
    return tickProps.payload; // Customize the tick text
  }}
  stroke="var(--color-text)"
  fill="#666"
  fontSize={12}
/>

<YAxis
  label={{
    value: 'Value (M USD)',
    angle: -90,
    style: {
      fontSize: 14
    },
  }}
/>
```

### 4. Responsive Charts

```tsx
<RadioGroup
  value={chartType}
  onValueChange={onChange}
  className={cx("w-full h-[400px]", variants)}
>
  {chartTypes.map((type) => (
    <RadioCard key={type} value={type}>
      {component[chartType](chartData)}
    </RadioCard>
  ))}
</RadioGroup>
```

### 5. Custom Tooltips

```tsx
<Tooltip
  itemStyle={{
    backgroundColor: 'rgba(31, 92, 235, 0.1)',
    padding: '10px',
    borderRadius: 4,
  }}
  content={({ active, payload }) => {
    if (active && payload && payload[0]) {
      return (payload[0].value);
    }

    return ' ';
  }}
  formatter={(value, name) => [value, name]}
/>
```

### 6. Custom Legend

```tsx
const items = [
  ['Item 1', 'color #1'],
  ['Item 2', 'color #2'],
];

function ChartWithCustomLegend({ items }) {
  return (
    <React.Fragment>
      <XAxis />
      <YAxis />
      <Legend
        custom={() => {
          return items.map(([title, value]) => ({
            title,
            value,
          }));
        }}
      />
    </React.Fragment>
  );
}
```

### 7. Custom Chart Containers

```tsx
function LineWithCustomContainer({ data }) {
  const [containerWidth, setContainerWidth] = useState(null);
  const [containerHeight, setContainerHeight] = useState(null);

  const container = React.useContainer();

  useEffect(() => {
    setContainerWidth(container.width);
    setContainerHeight(container.height);
  });

  return (
    <LineChart
      data={data}
      height={containerHeight}
      width={containerWidth}
    >
      {/* Chart content */}
    </LineChart>
  );
}
```

## Chart Props

### Recharts Chart Components (RechartsChartProps)

```tsx
RechartsChartProps {
  data: RechartsData[];
  dataKey?: string;
  index?: string;
  width?: number;        // width of the chart
  height?: number;       // height of the chart
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
```

### LineChartProps

```tsx
LineChartProps {
  data: RechartsData[];
  width?: number;        // width of the chart
  height?: number;       // height of the chart
  children: ReactNode;
  barCornerRadius?: number;
  barGap?: number;
  stackOffset?: 'none' | 'expand' | 'simplify' | 'silhouette';
  stackId?: string | number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}
```

## Data Preparation

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Prepare data
const chartData = [
  { date: '2024-01-01', visitors: 1000, sales: 500 },
  { date: '2024-01-02', visitors: 1500, sales: 700 },
  { date: '2024-01-03', visitors: 2000, sales: 900 },
];

// Calculate derived metrics
const aggregatedData = chartData.reduce((acc, curr) => {
  acc[0].visitors = acc[0].visitors + curr.visitors;
  acc[0].sales = acc[0].sales + curr.sales;
  return acc;
}, [...chartData]);
```

## Best Practices

### 1. Use Memoization

```tsx
const useMemoizedData = useMemo(() => {
  return chartData;
}, [chartData]);

<LineChart data={memorizedData} />
```

### 2. Use Responsive Containers

```tsx
const ResponsiveContainer = ({ children }) => {
  const [containerWidth, setContainerWidth] = useState(null);

  return (
    <div style={{ width: 800 }} ref={container}>
      <ResizeHandler width={containerWidth} height={600}>
        {children}
      </ResizeHandler>
    </div>
  );
};
```

### 3. Optimize Large Datasets

```tsx
// Paginate large datasets
const PagedChart = ({ pagination, dataPerPage, data }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
  });

  const page = slicedData();
  return (
    <ResponsiveContainer>
      {chartComponent(data)}
    </ResponsiveContainer>
  );
};
```

### 4. Custom Theme Integration

```tsx
const ChartWithTheme = ({ theme }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        {/* Theme colors */}
        <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
        <XAxis dataKey="name" stroke={theme.axisColor} />
        <YAxis stroke={theme.axisColor} />
        <Tooltip content={({ item, payload }) =>
          payload?.[0]?.payload?.name === item.payload.name
            ? payload?.[0]?.payload[`${item.payload.name}`]
            : undefined
        } />
      </BarChart>
    </ResponsiveContainer>
  );
};
```

## Resources

- [Official Documentation](https://recharts.org/)
- [GitHub](https://github.com/recharts/recharts)
- [Recharts Examples](https://recharts.org/examples)
- [Charts Section](https://recharts.org/charts)