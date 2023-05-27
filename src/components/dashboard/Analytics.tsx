import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Analytics () {
    return <>
        <Flex width={"100%"} height={"100%"} p={"0.1rem"}>
          <ChartSection />
        </Flex>
    </>
}

const ChartSection = () => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: "apexchart-example",
        height: "100%",
        width: "100%",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
  });

  return (
    <>
      <Chart
        options={state.options}
        series={state.series}
        type="area"
        width={"100%"}
        height={"100%"}
      />
    </>
  );
};
