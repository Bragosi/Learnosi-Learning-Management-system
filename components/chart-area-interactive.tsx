"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export const description = "An interactive area chart";

const chartConfig = {
  enrollment: {
    label: "Registrations",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: { date: string; enrollment: number }[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollment = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollment, 0),
    [data],
  );
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Registration</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Registration in the last 30 days : {totalEnrollment}
          </span>
          <span className="@[540px]/card:hidden">Last 30 days</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (isNaN(date.getTime())) return "Invalid";
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-37.5"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return "Invalid date";
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={"enrollment"} fill="var(--color-enrollment)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
