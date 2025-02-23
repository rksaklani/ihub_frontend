import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const BarChart = ({ data }: any) => {
  // Aggregate data
  const aggregatedData: Record<string, number> = data?.reduce((acc: any, item: any) => {
    acc[item.ItemName] = (acc[item.ItemName] || 0) + item.Quantity;
    return acc;
  }, {} as Record<string, number>) || {};

  const categories = Object.keys(aggregatedData);
  const quantities = Object.values(aggregatedData);

  // Chart options
  const options: ApexOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: true,
      },
    },
    title: {
      text: 'Item Quantity Chart',
    },
    colors: [
      '#FF5733', '#33FF57', '#5733FF', '#33A1FF', '#FF33A1',
      '#33FFA1', '#FFA133', '#A133FF', '#33FFDA', '#DA33FF',
      '#33FF86', '#86FF33', '#FF8633', '#8633FF', '#FF3386',
      '#FFCC33', '#CC33FF', '#33FFCC', '#FF33CC', '#33AFFF',
    ],

    dataLabels: {
      enabled: true,
      style: {
        colors: ['#000'], // 👈 यहां पर नंबर का रंग सेट करें (Black)
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
  };

  // Chart series
  const series: ApexAxisChartSeries = [
    {
      name: 'Quantity',
      data: quantities,
    },
  ];

  return (
    <div className="w-full max-w-[1100px] mx-auto rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="overflow-x-auto">
        <div className="min-w-[600px] max-w-full">
          <Chart options={options} series={series} type="bar" height={380} width="100%" />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
