/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../assets/ts/_utils'
import {useThemeMode} from '../../layout/theme-mode/ThemeModeProvider'
import { LocationStatisticalData, StatisticData } from "./core/models";
import Swal from "sweetalert2";

type Props = {
  className: string
  statData: StatisticData[]
  loading: boolean
}

const ChartsWidgetInventory3: React.FC<Props> = ({className, statData, loading}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const {mode} = useThemeMode();
  const [inventoryData, setInventory] = useState([] as number[]);
  const [chartMonths, setChartMonths] = useState([] as string[]);
  const [calcLoading, setCalcLoading] = useState(true);

  const refreshMode = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, inventoryData, chartMonths))
    if (chart) {
      chart.render()
    }

    return chart
  }
  useEffect(() => {
    if (calcLoading) return;
    const chart = refreshMode();

    return () => {
      if (chart) {
        chart.destroy();
      }
    }
  }, [chartRef, mode, calcLoading]);

  useEffect(() => {
    if (loading) return;
    setCalcLoading(true);
    handleWeeklyEntry(statData);
  }, [loading]);

  const handleWeeklyEntry = (data: StatisticData[]) => {
    try {
      const monthsTemp = [] as string[];
      const counts = [] as number[];
      const monthName = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      for (const item of data) {
        const d = new Date(item.createdAt);
        monthsTemp.push(d.getDay() + ' ' + monthName[d.getMonth()]);
        counts.push(item.count);
      }

      setChartMonths(monthsTemp);
      setInventory(counts);
      setCalcLoading(false);
    } catch (e) {
      void Swal.fire({
        title: 'Hata Oluştu',
        text: `Günlük veriler sınıflandırılırken hata oluştu. \n Hata: ${e as string}`,
        icon: 'error',
        confirmButtonText: 'Tamam',
      });
    }
  };

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Malzeme</span>

          <span className='text-muted fw-semibold fs-7'>Malzeme istatistikleri</span>
        </h3>

      </div>
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_widget_3_chart' style={{height: '350px'}}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {ChartsWidgetInventory3}

function getChartOptions(height: number, inventoryData: number[], chartMonths: string[]): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const baseColor = getCSSVariableValue('--kt-info')
  const lightColor = getCSSVariableValue('--kt-info-light')

  return {
    series: [
      {
        name: 'Malzeme sayısı',
        data: inventoryData,
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
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: chartMonths,
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
          color: baseColor,
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
          return val + ' malzeme'
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
