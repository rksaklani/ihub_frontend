// import Chart from 'react-apexcharts';


// const BarChart = ({data}:any) => {
//   // const { data: data } = useGetAdminProductsQuery(undefined, {
//   //   refetchOnMountOrArgChange: true,
//   // });

//   // Ensure data exists and is an array
//   const aggregatedData = Array.isArray(data)
//     ? data.reduce((acc: any, item: any) => {
//         if (item?.ItemName && typeof item.Quantity === 'number') {
//           acc[item.ItemName] = (acc[item.ItemName] || 0) + item.Quantity;
//         }
//         return acc;
//       }, {})
//     : {};

//   const categories = Object.keys(aggregatedData);
//   const quantities = Object.values(aggregatedData);

//   const options = {
//     chart: {
//       type: 'bar',
//     },
//     xaxis: {
//       categories: categories,
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         distributed: true, // 🔥 Ensures each bar gets a unique color
//       },
//     },
//     title: {
//       text: 'Item Quantity Chart',
//     },
//     colors: [
//       '#FF0000', '#FF7F00', '#FFFF00', '#7FFF00', '#00FF00',
//       '#00FF7F', '#00FFFF', '#007FFF', '#0000FF', '#7F00FF',
//       '#FF00FF', '#FF007F', '#FF1493', '#FF4500', '#FFD700',
//       '#ADFF2F', '#32CD32', '#00CED1', '#1E90FF', '#8A2BE2'
//     ],
    
    
//   };

//   const series = [
//     {
//       name: 'Quantity',
//       data: quantities,
//     },
//   ];

//   return (
//     <>
//       <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
//         <div className="mb-3 justify-between gap-4 sm:flex">
//           <div id="chart">
//             <Chart options={options} series={series} type="bar" height={370} width={1035} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BarChart;







import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const BarChart = ({ data }: any) => {
  // Aggregate data
  const aggregatedData: Record<string, number> = data && data?.reduce((acc:any, item:any) => {
    acc[item.ItemName] = (acc[item.ItemName] || 0) + item.Quantity;
    return acc;
  }, {} as Record<string, number>);

  const categories = aggregatedData && Object?.keys(aggregatedData);
  const quantities = aggregatedData && Object?.values(aggregatedData);

  // Chart options
  const options: ApexOptions = {
    chart: {
      type: 'bar', // Ensure the type is valid
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
  };

  // Chart series
  const series: ApexAxisChartSeries = [
    {
      name: 'Quantity',
      data: quantities,
    },
  ];

  return (
    <>
     <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <div id="chart">
            <Chart options={options} series={series} type="bar" height={380} width={1035} />
          </div>
        </div>
      </div>
    
    
    
    </>
  );
};

export default BarChart;
