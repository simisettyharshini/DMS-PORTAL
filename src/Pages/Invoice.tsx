/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  FileText,
  Eye,
  Download,
} from "lucide-react";

import { Card, CardContent } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Input } from "../Components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface InvoiceDetails{
  Id: string;
  Name:string;
  Customer__c: string;
  Customer__r: {
  Id: string;
  Name: string;
},
  CreatedDate: Date,
  Amount__c:number,
  Due_date__c: Date,
  Status__c: string
}
const StatusBadge = ({ status }: { status: string }) => {

  const styles: Record<string, string> = {
    Paid: "bg-green-500/20 text-green-400 border-green-500/40",
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    Overdue: "bg-red-500/20 text-red-400 border-red-500/40",
  };

  return (
    <Badge
      className={`px-3 py-1 rounded-full border text-xs ${styles[status]}`}
    >
      {status}
    </Badge>
  );
};

export default function Invoices() {
  const { id } = useParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceData, setInvoiceData]= useState<InvoiceDetails[] | null>(null);
  

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

    // return response.data.access_token;
  } catch (err: unknown) {
    const errorMessage = axios.isAxiosError(err)
      ? err.response?.data?.error_description || err.message
      : "Unknown error occurred";

    console.error("❌ Error fetching access token:", errorMessage);
    setError("Failed to fetch access token.");
    setLoading(false);
  }
};

const fetchInvoiceDetails= async ()=>{
  try{
    const query=`select 
    Id,
    Name,
    Customer__r.Id,
    Customer__r.Name,
    Due_date__c,
    Status__c,
    CreatedDate,
    Amount__c
    from Invoice__c
    ORDER BY CreatedDate ASC
    limit 5`;
    const encodedQuery = encodeURIComponent(query);
    const queryUrl=`https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;
    
    console.log("🔍 Fetching data for ID:", id);
      console.log("🔗 Query URL:", queryUrl);
    const response= await axios.get(queryUrl,
    {
      headers:{
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
    );
    
  const records: InvoiceDetails[] = response.data.records.map(
  (record: any) => ({
    ...record,
    Amount__c: Number(record.Amount__c) || 0,
  })
);

   if (records && records.length > 0) {
        console.log("📦 Fetched Invoices:", records);
        setInvoiceData(records);
      } else {
        console.log("ℹ️ No invoice records found.");
        setInvoiceData([]);
      }
    
  }catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";

      console.error("❌ Error fetching data:", errorMessage);
      setError("Failed to fetch data from Salesforce.");
    } finally {
      setLoading(false);
    }
}

 useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchInvoiceDetails();
    }
  }, [accessToken]);

const filteredInvoices = invoiceData?.filter((invoice) => {
  const search = searchTerm.toLowerCase();

  return (
    invoice.Name?.toLowerCase().includes(search) ||
    invoice.Status__c?.toLowerCase().includes(search) ||
    invoice.Customer__r?.Name?.toLowerCase().includes(search) ||
    invoice.Customer__r?.Id?.toLowerCase().includes(search)
  );
});

const totals = invoiceData?.reduce(
  (acc, invoice) => {
    const amount = invoice.Amount__c || 0;

    acc.total += amount;

    if (invoice.Status__c === "Paid") {
      acc.paid += amount;
    }
    if (invoice.Status__c === "Pending") {
      acc.pending += amount;
    }
    if (invoice.Status__c === "Overdue") {
      acc.overdue += amount;
    }

    return acc;
  },
  {
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
  }
);
const formatToLakhs = (amount = 0) => {
  return `₹${(amount / 100000).toFixed(1)}L`;
};




  return (
    <div className="min-h-screen bg-[#020817] p-4 sm:p-6 lg:p-8 text-white">

      {/* ===== PAGE HEADER ===== */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-cyan-400 text-start">Invoices</h1>
        <p className="text-gray-400 mt-1 text-start">
          Generate and manage invoices
        </p>
      </div>

      {/* ===== STATS SECTION ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
  {
    label: "Total Revenue",
    value: totals?.total,
    icon: DollarSign,
    color: "cyan",
  },
  {
    label: "Paid",
    value: totals?.paid,
    icon: CheckCircle,
    color: "green",
  },
  {
    label: "Pending",
    value: totals?.pending,
    icon: Clock,
    color: "yellow",
  },
  {
    label: "Overdue",
    value: totals?.overdue,
    icon: AlertCircle,
    color: "red",
  },
].map(({ label, value, icon: Icon, color }) => (

          <Card
            key={label}
            className="bg-gradient-to-br from-[#020617] to-[#0f172a] h-24 
            border border-cyan-500/20
            shadow-[0_0_30px_rgba(34,211,238,0.25)]"
          >
            <CardContent className="flex items-center gap-4 p-5 -mt-5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-500/20`}
              >
                <Icon className={`text-${color}-400`} />
              </div>
              <div>
                {/* 🔹 Salesforce value goes here */}
                <p className="text-2xl font-semibold">
  {value !== undefined ? formatToLakhs(value) : "—"}
</p>

                <p className="text-sm text-gray-400">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== SEARCH + ACTIONS ===== */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <Input
          placeholder="Search invoices..."
          className="h-13 bg-[#020617] border-cyan-500/20 text-white rounded-xl

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-cyan-400
    focus-visible:ring-offset-0
    focus-visible:border-cyan-400"
          onChange={(e) => setSearchTerm(e.target.value)}

        />

        <div className="flex gap-3">
          <Button
            variant="outline" 
            className="border-cyan-500/40 text-white-400 h-12 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] bg-[#020617]"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black h-12 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]">
            <FileText className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
     <div className="hidden md:block mt-6 rounded-2xl overflow-hidden border border-cyan-500/20
shadow-[0_0_30px_rgba(34,211,238,0.25)]">


  {/* ===== HEADER ===== */}
  <div
  className="
    grid grid-cols-[2fr_2fr_1.2fr_1.2fr_1.2fr_1.2fr]
    bg-[#020617]
    text-gray-400
    px-6 py-4
  "
>

    <div>Invoice #</div>
    <div>Customer</div>
    <div>Date</div>
    <div>Due Date</div>
    <div>Amount</div>
    <div>Status</div>
    {/* <div className="text-center">Actions</div> */}
  </div>

  {/* ===== ROWS ===== */}
  {(filteredInvoices ?? []).map((invoice) => (

    <div
  key={invoice.Id}
  className="
    grid grid-cols-[2fr_2fr_1.2fr_1.2fr_1.2fr_1.2fr]
    px-6 py-5
    border-t border-cyan-500/10
    hover:bg-white/5
  "
>

      {/* Invoice */}
      <div>
        <p className="text-cyan-400 font-semibold">
          {invoice.Name}
        </p>
        {/* Order ID intentionally skipped */}
      </div>

      {/* Customer */}
      <div>
        <p className="font-medium text-white">
          {invoice.Customer__r.Name}
          
        </p>
        {/* <p className="text-xs text-gray-400">
          {invoice.Customer__r.Id}
        </p> */}
      </div>

      {/* Date */}
      <div className="text-gray-400">
        {new Date(invoice.CreatedDate).toISOString().split("T")[0]}
      </div>

      {/* Due Date */}
      <div className="text-gray-400">
        {new Date(invoice.Due_date__c).toISOString().split("T")[0]}
      </div>

      {/* Amount */}
      <div className="font-semibold text-white">
        ₹{invoice.Amount__c.toLocaleString("en-IN")}
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={invoice.Status__c} />
      </div>

      {/* Actions */}
      {/* <div className="flex justify-center gap-4">
        <Eye className="w-4 h-4 cursor-pointer hover:text-cyan-400" />
        <Download className="w-4 h-4 cursor-pointer hover:text-cyan-400" />
      </div> */}
    </div>
  ))}
</div>
{/* ================= MOBILE VIEW ================= */}
<div className="md:hidden space-y-4 mt-6">
  {(filteredInvoices ?? []).map((invoice) => (
    <Card
      key={invoice.Id}
      className="bg-[#020617] border border-cyan-500/20 rounded-xl
      shadow-[0_0_25px_rgba(34,211,238,0.2)]"
    >
      <CardContent className="p-4 space-y-4">

        {/* Row 1: Invoice + Customer */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400">Invoice</p>
            <p className="text-cyan-400 font-semibold">
              {invoice.Name}
            </p>
          </div>

          <div className="text-right ">
            <p className="text-xs text-gray-400 mr-13">Customer</p>
            <p className="text-white font-semibold text-start ml-14">
              {invoice.Customer__r.Name}
            </p>
          </div>
        </div>

        {/* Row 2: Invoice Date + Due Date */}
        <div className="grid grid-cols-2 gap-4 text-sm ">
          <div>
            <p className="text-xs text-gray-400">Invoice Date</p>
            <p className="text-white ">
              {new Date(invoice.CreatedDate).toISOString().split("T")[0]}
            </p>
          </div>

          <div className="text-right mr-13">
            <p className="text-xs text-gray-40 ">Due Date</p>
            <p className="text-white -mr-3">
              {new Date(invoice.Due_date__c).toISOString().split("T")[0]}
            </p>
          </div>
        </div>

        {/* Row 3: Amount + Status */}
        <div className="grid grid-cols-2 items-center pt-3 border-t border-cyan-500/10">
          <div>
            <p className="text-xs text-gray-400">Amount</p>
            <p className="text-white font-semibold">
              ₹{invoice.Amount__c.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="justify-self-end mr-13">
            <p className="text-xs text-gray-400 ">Status</p>
            <p className="text-white font-semibold mt-1 text-start">
              <StatusBadge  status={invoice.Status__c} />
            </p>
            
          </div>
        </div>

      </CardContent>
    </Card>
  ))}
</div>

      
    </div>
  );
}
