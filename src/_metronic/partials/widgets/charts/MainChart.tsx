import React, { FC, useEffect, useRef } from "react";
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../assets/ts/_utils'
import {useThemeMode} from '../../layout/theme-mode/ThemeModeProvider'
import {ChartData} from '../../../../app/pages/dashboard/core/models';

type Props = {
  loading: boolean;
  chartData: ChartData;
};

const MainChart: FC<Props> = ({loading, chartData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const {mode} = useThemeMode();

  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }

    const height = parseInt(getCSS(chartRef.current, 'height'));

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartData.entryFormCount, chartData.exitFormCount, chartData.inventoryFormCount, chartData.patientFormCount, chartData.dates));
    if (chart) {
      chart.render();
    }

    return chart
  };

  useEffect(() => {
    if (loading) return;
    const chart = refreshChart();

    return () => {
      if (chart) {
        chart.destroy();
      }
    }
  }, [chartRef, mode, loading]);

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>İstatistikler</span>
          <span className='text-muted fw-semibold fs-7'>Son 15 gün</span>
        </h3>

      </div>
      <div className='card-body'>
        <div ref={chartRef} id='kt_charts_widget_3_chart' style={{height: '350px'}}></div>
      </div>
    </div>
  )
}

export {MainChart}

function getChartOptions(height: number, entryData: number[], exitData: number[], inventoryData: number[], patientData: number[], chartLabels: string[]): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500');
  const borderColor = getCSSVariableValue('--kt-gray-200');
  const baseColor = getCSSVariableValue('--kt-info');
  const lightColor = getCSSVariableValue('--kt-info-light');
  const entryColor = getCSSVariableValue('--kt-success');
  const exitColor = getCSSVariableValue('--kt-danger');
  const inventoryColor = getCSSVariableValue('--kt-info');
  const patientColor = getCSSVariableValue('--kt-warning');

  return {
    series: [
      {
        name: 'Giriş',
        data: entryData,
      },
      {
        name: 'Çıkış',
        data: exitData,
      },
      {
        name: 'Malzeme Formu',
        data: inventoryData,
      },
      {
        name: 'Hasta',
        data: patientData,
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 0.1,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [entryColor, exitColor, inventoryColor, patientColor],
    },
    xaxis: {
      categories: chartLabels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        position: 'front',
        stroke: {
          color: labelColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return String(val);
        },
      },
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  }
}
