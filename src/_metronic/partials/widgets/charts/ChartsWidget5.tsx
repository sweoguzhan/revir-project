import React, { useEffect, useRef, useState } from "react";
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../assets/ts/_utils'
import {useThemeMode} from '../../layout/theme-mode/ThemeModeProvider'
import { LocationStatisticalData } from "./core/models";
import Swal from "sweetalert2";

type Props = {
  className: string
  statData: LocationStatisticalData[]
  loading: boolean
}

const ChartsWidget5: React.FC<Props> = ({className, statData, loading}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const {mode} = useThemeMode();
  const [entryData, setEntry] = useState([] as number[]);
  const [exitData, setExit] = useState([] as number[]);
  const [chartMonths, setChartMonths] = useState([] as string[]);
  const [calcLoading, setCalcLoading] = useState(true);
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, entryData, exitData, chartMonths))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    if (calcLoading) return;
    const chart = refreshChart();

    return () => {
      if (chart) {
        chart.destroy();
      }
    }
  }, [chartRef, mode, calcLoading]);

  useEffect(() => {
    if (loading) return;
    setCalcLoading(true);
    handleYearlyEntry(statData);
  }, [loading]);

  const handleYearlyEntry = (data: LocationStatisticalData[]) => {
    try {
      const result = data.reduce((r, {date, count, formType}) => {
        let dateObj = new Date(date);
        let month_year = `${dateObj.getMonth()} ${dateObj.getFullYear()}`;
        if (formType === "entry") {
          if(!r[month_year])
            r[month_year] = {dateObj, entries: parseInt(String(count))}
          else if (r[month_year].hasOwnProperty("entries"))
            r[month_year].entries += parseInt(String(count));
          else if (r[month_year].hasOwnProperty("exits"))
            r[month_year] = {...r[month_year], entries: 1}
          else r[month_year].entries += parseInt(String(count));
        } else {
          if(!r[month_year])
            r[month_year] = {dateObj, exits: 1}
          else if (r[month_year].hasOwnProperty("exits"))
            r[month_year].exits += parseInt(String(count));
          else if (r[month_year].hasOwnProperty("entries"))
            r[month_year] = {...r[month_year], exits: parseInt(String(count))}
          else r[month_year].exits += parseInt(String(count));
        }
        return r;
      }, {});

      const monthName = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      const d = new Date();
      d.setDate(1);
      const keys = Object.keys(result);
      let entries = [] as number[];
      let exits = [] as number[];
      let months = [] as string[];
      for (let i=0; i<=11; i++) {
        let entryTemp = 0;
        let exitTemp = 0;
        months.push(monthName[d.getMonth()] + ' ' + d.getFullYear());
        for (let b=0; b < keys.length; b++) {
          const resultDate = new Date(result[keys[b]].dateObj);
          if (resultDate.getMonth() === d.getMonth() && resultDate.getFullYear() === d.getFullYear()) {
            if (result[keys[b]]?.entries) {
              entryTemp += result[keys[b]]?.entries;
            }

            if (result[keys[b]]?.exits) {
              exitTemp += result[keys[b]]?.exits;
            }
          }
        }
        entries.push(entryTemp);
        exits.push(exitTemp);
        d.setMonth(d.getMonth() - 1);
      }
      months.reverse();
      entries.reverse();
      exits.reverse();
      setChartMonths(months);
      setEntry(entries);
      setExit(exits);
      setCalcLoading(false);
    } catch (e) {
      void Swal.fire({
        title: 'Hata Oluştu',
        text: `Giriş-Çıkış verileri sınıflandırılırken hata oluştu. \n Hata: ${e as string}`,
        icon: 'error',
        confirmButtonText: 'Tamam',
      });
    }
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Giriş / Çıkış</span>

          <span className='text-muted fw-semibold fs-7'>Giriş ve çıkış istatistikleri</span>
        </h3>
      </div>

      {loading && (
        <div className='loading-overlay'>
          <span className='spinner-border align-middle ms-2'></span>
        </div>
      )}

      <div className='card-body'>
        <div ref={chartRef} id='kt_charts_widget_5_chart' style={{height: '350px'}}></div>
      </div>
    </div>
  )
}

export {ChartsWidget5}

function getChartOptions(height: number, entryData: number[], exitData: number[], chartMonths: string[]): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const baseColor = getCSSVariableValue('--kt-primary')
  const secondaryColor = getCSSVariableValue('--kt-info')

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
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      stacked: true,
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '17%',
        borderRadius: 0,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
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
    },
    yaxis: {
      min: -80,
      max: 80,
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
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
          return val + ' çalışan'
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}
