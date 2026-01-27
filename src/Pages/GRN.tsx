/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent } from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";

import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiTruck,
  FiFilter,
  FiCalendar,
} from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface GRNRecord{
Name:string;
CreatedDate:string;
Perchase_order__c:string;
Product__r:{
    Id:string,
    Name:string   
};
Inspector__r:{
Id:string,
Name:string
};
Accepted__c:number;
Recieved__c:number;
Ordered__c:number;
Remarks__c:string;
Status__c: string;
Warehouse__c:string;
}

export default function GRN() {

  const [grnDetails, setGrnDetails] = useState<GRNRecord[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

const getAccessToken = async () => {
  const salesforceUrl="https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/oauth2/token";
  const clientId ="3MVG9HtWXcDGV.nEjGlOSARSUWdhaRh3M.MZMxCFek1KeKIjSU61s7elcUSSScL4Jfk.rh.ji7og4gPabrfSA";
  const clientSecret ="3E5E44662F5C43535B785D740B237868AA86DFC6AC4709037876F6223B419354";
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
 
  try {
    const response = await axios.post(salesforceUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    setAccessToken(response.data.access_token);
    console.log("✅ Access Token:", response.data.access_token);

    return response.data.access_token;
  } catch (err: unknown) {
    const errorMessage = axios.isAxiosError(err)
      ? err.response?.data?.error_description || err.message
      : "Unknown error occurred";

    console.error("❌ Error fetching access token:", errorMessage);
    setError("Failed to fetch access token.");
    return null;
  }
};

const fetchGRNDetails = async (token: string): Promise<GRNRecord[]> => {
  try {
    const query =
      "SELECT Id, Name,Accepted__c, Ordered__c, Recieved__c, Remarks__c,  Warehouse__c, Status__c,Perchase_order__c, CreatedDate,Product__r.Name,Inspector__r.Name " +
      "FROM Goods_Receipt_Note__c ORDER BY CreatedDate ASC LIMIT 6";

    const encodedQuery = encodeURIComponent(query);

    const queryUrl =
      `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v59.0/query?q=${encodedQuery}`;

    const response = await axios.get(queryUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ GRN DATA:", response.data.records);
    return response.data.records ?? [];
  } catch (err) {
    console.error("❌ SOQL ERROR:", err);
    return [];
  }
};


 useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
    setError(null);
      const token = await getAccessToken();
      if (token) {
        const data = await fetchGRNDetails(token);
        console.log(data);
               
        setGrnDetails(data);
        
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  const filteredGRNs = useMemo(() => {
    const q = searchTerm.toLowerCase();

    return grnDetails.filter(
      (g) =>
        g.Name?.toLowerCase().includes(q) ||
        // g.Perchase_order__c?.toLowerCase().includes(q) ||
        // g.Product__r?.Name?.toLowerCase().includes(q) ||
        // g.Warehouse__c?.toLowerCase().includes(q) ||
        g.Status__c?.toLowerCase().includes(q)
    );
  }, [grnDetails, searchTerm]);

const grnStats = useMemo(() => {
  const totalGRNs = grnDetails.length;

  const completed = grnDetails.filter(
    (g) => g.Status__c === "Completed"
  ).length;

  const pending = grnDetails.filter(
    (g) => g.Status__c === "Pending"
  ).length;

  const itemsReceived = grnDetails.reduce(
    (sum, g) => sum + (g.Recieved__c || 0),
    0
  );

  return {
    totalGRNs,
    completed,
    pending,
    itemsReceived,
  };
}, [grnDetails]);


  return (
    <div className="min-h-screen bg-[#020817] p-4 sm:p-6 lg:p-8 text-white h-full overflow-y-auto">

      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-cyan-400 text-start">
          Goods Receipt Note
        </h1>
        <p className="text-gray-400 mt-1 text-start">
          Manage goods receipt and stock entries
        </p>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total GRNs", value: grnStats.totalGRNs, icon: FiFileText, color: "cyan" },
{ label: "Completed", value: grnStats.completed, icon: FiCheckCircle, color: "green" },
{ label: "Pending", value: grnStats.pending, icon: FiClock, color: "yellow" },
{ label: "Items Received", value: grnStats.itemsReceived, icon: FiTruck, color: "purple" },

        ].map(({ label, value, icon: Icon, color }) => (
          <Card
            key={label}
            className="bg-gradient-to-br from-[#020617] to-[#0f172a] h-25
            border border-cyan-500/20
            shadow-[0_0_30px_rgba(34,211,238,0.25)]"
          >
            <CardContent className="flex items-center gap-4 ">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-500/20`}
              >
                <Icon className={`text-${color}-400 text-xl`} />
              </div>
              <div>
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== SEARCH ===== */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search GRN records..."
          className="
            bg-[#020617]
            border-cyan-500/20
            text-white
            h-13
            rounded-xl
            focus-visible:ring-2
            focus-visible:ring-cyan-400
          "
        />

        <Button
          variant="outline"
          className="
            h-12
            border-cyan-500/40
            text-white
            bg-[#020617]
            hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]
          "
        >
          <FiFilter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

        {/* ===== GRN CARDS ===== */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {filteredGRNs.map((grn) => (

    <Card
      key={grn.Name}
      className="
        bg-gradient-to-br from-[#020617] to-[#0f172a]
        border border-cyan-500/20
        shadow-[0_0_35px_rgba(34,211,238,0.25)]
        rounded-2xl text-start 
      "
    >
      <CardContent className="p-5 sm:p-6 space-y-4 -mt-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <p className="text-cyan-400 text-lg font-semibold">
              {grn.Name}
            </p>
            <p className="text-gray-400 text-sm">
              {grn.Perchase_order__c}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
           <Badge
  className={`
    mr-0 sm:mr-60 -mt-0 sm:-mt-5
    ${
      grn.Status__c === "Completed"
        ? "bg-green-500/20 text-green-400 border border-green-500/40"
        : grn.Status__c === "Pending"
        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
        : grn.Status__c === "Partial"
        ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
        : grn.Status__c === "Rejected"
        ? "bg-red-500/20 text-red-400 border border-red-500/40"
        : "bg-gray-500/20 text-gray-400 border border-gray-500/40"
    }
  `}
>
  {grn.Status__c}
</Badge>


            <div className="flex items-center text-gray-400 text-sm">
              <FiCalendar className="w-4 h-4 mr-1" />
              {new Date(grn.CreatedDate).toISOString().split("T")[0]}
            </div>
          </div>
        </div>

        {/* SUPPLIER */}
        <div className="flex items-center gap-2 text-white">
          {/* <FiTruck className="text-cyan-400" /> */}
          {/* {grn.Product__r?.Name} */}
        </div>

        {/* ITEM */}
        <div className="bg-[#02061] rounded-xl p-3
          flex flex-col sm:flex-row sm:justify-between gap-8">
          <p className="-ml-3">{grn.Product__r?.Name}</p>
          <p className="text-sm text-gray-400 -ml-3">
            Ordered: {grn.Ordered__c}{" "}
            <span className="text-cyan-400 mr-2 ml-2">
              Received: {grn.Recieved__c}
            </span>{" "}
            <span className="text-green-400">
              Accepted: {grn.Accepted__c}
            </span>
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-400">
          <span>Warehouse: {grn.Warehouse__c}</span>
          <span>Inspector: {grn.Inspector__r?.Name}</span>
        </div>

        {/* REMARKS */}
        {grn.Remarks__c && (
          <p className="italic text-gray-500 text-sm">
            "{grn.Remarks__c}"
          </p>
        )}
      </CardContent>
    </Card>
  ))}
</div>

      
    </div>
  );
}
