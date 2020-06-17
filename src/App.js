import React, { useEffect, useState } from "react";
import { Asset } from "stellar-sdk";
import { Horizon } from "./api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);

  const tradesHandler = trade => {
    setData(data => [
      ...data,
      {
        date: trade.ledger_close_time,
        volume: Number(trade.base_amount),
        price: trade.price.n / trade.price.d
      }
    ]);
  };

  useEffect(() => {
    const disconnect = Horizon.trades()
      /**
       * @note Uncomment the following to have particular asset tracking.
       */
      // .forAssetPair(
      //   new Asset(
      //     "CENTUS",
      //     "GAKMVPHBET4T7DPN32ODVSI4AA3YEZX2GHGNNSBGFNRQ6QEVKFO4MNDZ"
      //   ),
      //   Asset.native()
      // )
      .cursor("now")
      .stream({
        onmessage: tradesHandler
      });

    return () => disconnect();
  }, []);
  return (
    <div className="container">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="volume"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#118cd8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default App;
