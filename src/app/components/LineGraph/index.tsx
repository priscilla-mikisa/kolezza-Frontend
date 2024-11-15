import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import fetchProgressData from '@/app/utils/fetchProgressData';
import 'chart.js/auto';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

const LineChart = ({ childId }: { childId: string }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Frequency (Hz)',
        data: [],
        fill: false,
        borderColor: '#8BC34A',
        tension: 0.1,
      },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressDataForChart = async () => {
      setLoading(true); 
      try {
        const data = await fetchProgressData(childId);
        setChartData({
          labels: data.labels || [], 
          datasets: [
            {
              label: 'Frequency (Hz)',
              data: data.values || [], 
              fill: false,
              borderColor: '#8BC34A',
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressDataForChart();
  }, [childId]); 

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Frequency (Hz)',
        },
      },
    },
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full nhm:ml-[-8rem] nh:ml-[-7rem] max-w-[900px] drop-shadow-[3px_3px_6px_rgba(0,0,0,0.5)]">
      <h1 className="text-[36px] font-bold text-center nh:text-[1.5rem] pt-10 pb-10">Patient Progress Over Time</h1>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
