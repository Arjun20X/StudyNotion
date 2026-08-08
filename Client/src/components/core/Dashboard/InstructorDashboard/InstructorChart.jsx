import React, { useState } from 'react'
import { Chart, registerables } from 'chart.js'
import { Pie } from 'react-chartjs-2'

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
  const [currentChart, setCurrentChart] = useState("students")

  // Curated harmonious color palette for StudyNotion theme
  const themeColors = [
    "#FFD60A", // StudyNotion Yellow
    "#05A77B", // Caribbean Green
    "#42A5F5", // Blue
    "#AB47BC", // Purple
    "#FF7043", // Coral
    "#26A69A", // Teal
    "#EC407A", // Pink
    "#FFA726", // Orange
  ]

  const getColors = (numColors) => {
    return Array.from({ length: numColors }, (_, i) => themeColors[i % themeColors.length])
  }

  // Chart data for student enrollment
  const chartDataForStudents = {
    labels: courses?.map((course) => course.courseName) || [],
    datasets: [
      {
        data: courses?.map((course) => course.totalStudentsEnrolled) || [],
        backgroundColor: getColors(courses?.length || 0),
        borderColor: "#161D29",
        borderWidth: 2,
      },
    ],
  }

  // Chart data for income generation
  const chartDataForIncome = {
    labels: courses?.map((course) => course.courseName) || [],
    datasets: [
      {
        data: courses?.map((course) => course.totalAmountGenerated) || [],
        backgroundColor: getColors(courses?.length || 0),
        borderColor: "#161D29",
        borderWidth: 2,
      },
    ],
  }

  // Responsive options
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#AFB2BF',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#2C333F',
        titleColor: '#F1F2FF',
        bodyColor: '#FFD60A',
        borderColor: '#424854',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-richblack-5 tracking-wide uppercase">Visualise Analytics</p>
        <div className="flex rounded-lg bg-richblack-900 p-1 border border-richblack-700">
          <button
            onClick={() => setCurrentChart("students")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              currentChart === "students"
                ? "bg-richblack-700 text-yellow-50 shadow-sm"
                : "text-richblack-200 hover:text-richblack-5"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setCurrentChart("income")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              currentChart === "income"
                ? "bg-richblack-700 text-yellow-50 shadow-sm"
                : "text-richblack-200 hover:text-richblack-5"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div className="relative mx-auto aspect-square h-[300px] w-full max-w-[400px]">
        <Pie
          data={currentChart === "students" ? chartDataForStudents : chartDataForIncome}
          options={options}
        />
      </div>
    </div>
  )
}

export default InstructorChart
