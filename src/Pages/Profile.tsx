/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Card, CardContent, CardHeader } from "../Components/ui/card";
import { LuPackage } from "react-icons/lu";
import { FiDollarSign } from "react-icons/fi";
import { MdTrendingUp } from "react-icons/md";
import { FaStar } from "react-icons/fa";

import { FiEdit2, FiCamera } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { RiMedalLine } from "react-icons/ri";

interface PersonAccount {
  Id: string;
  Name: string;
  Phone: string;
  PersonEmail: string;
  BillingStreet: string;
  BillingCity: string;
  BillingPostalCode: string;
}


const Profile = () => {
 
  const [personAccount, setPersonAccount] = useState<PersonAccount | null>(null);

   const [accessToken, setAccessToken] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(true);
  

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

const fetchPersonAccountSetails= async (token :string)=>{
  try{
    const query=`select 
    Id,
    Name,
    Phone,
    PersonEmail,
    BillingStreet,
    BillingCity, 
    BillingPostalCode
    from Account
    where IsPersonAccount=true and Id ='001fj00000e2iVmAAI'`;

    const encodedQuery = encodeURIComponent(query);
    const queryUrl=`https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v59.0/query?q=${encodedQuery}`;
    
   
      console.log("🔗 Query URL:", queryUrl);
    const response= await axios.get(queryUrl,
    {
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    );
    
    console.log("✅ Person Account Details:", response.data.records);
     return response.data.records[0] ?? null;
    
  }catch (error) {
    console.error("❌ Error fetching Person Account:", error);
    throw error;
  }
}

 useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
    setError(null);
      const token = await getAccessToken();
      if (token) {
        const data=await fetchPersonAccountSetails(token);
        console.log(data);
        
        setPersonAccount(data);
        
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#020817] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 h-full overflow-y-auto">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-cyan-400 text-start">Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage your account information
          </p>
        </div>

        <Button
          className="
            mt-4 sm:mt-6 h-10
            flex items-center gap-2
            bg-gradient-to-r from-cyan-400 to-purple-500
            text-black
            shadow-[0_0_25px_rgba(34,211,238,0.45)]
          "
        >
          <FiEdit2 />
          Edit Profile
        </Button>
      </div>

      {/* ================= PROFILE CARD ================= */}
    
<div className="mt-6">
  {/* OUTER GLOW BORDER */}
  <div
    className="
      rounded-2xl
      p-[1.5px]
      bg-gradient-to-r from-cyan-400/40 via-purple-500/40 to-cyan-400/40
      shadow-[0_0_60px_rgba(34,211,238,0.35)]
    "
  >
    {/* INNER CARD */}
    <div className="rounded-2xl overflow-hidden bg-[#020817]">

      {/* TOP GRADIENT STRIP */}
      <div className="h-32 bg-gradient-to-r from-[#0b4a5f] via-[#3b2c6f] to-[#0b4a5f]" />

      {/* CONTENT SECTION */}
      <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-1">


        {/* Avatar */}
        <div className="relative -mt-10 sm:-mt-14">

          <div
            className="
              w-24 h-24 sm:w-32 sm:h-32
              rounded-2xl
              border-4 border-cyan-400
              bg-[#020817]
              flex items-center justify-center
              text-cyan-400
              shadow-[0_0_25px_rgba(34,211,238,0.45)]
            "
          >
            <FaUser size={42} />
          </div>

          <div
            className="
              absolute bottom-2 right-2
              w-8 h-8
              rounded-full
              bg-cyan-400
              flex items-center justify-center
              text-black
            "
          >
            <FiCamera size={16} />
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
  <h2 className="text-2xl font-semibold text-cyan-200 text-start">
    {personAccount?.Name ??"_"}
  </h2>

  <Badge
    className="
      bg-cyan-400/20 text-cyan-300
      text-xs sm:text-sm
      px-2 py-0.5 sm:px-3 sm:py-1
      whitespace-nowrap
    "
  >
    🏆 Platinum
  </Badge>
</div>


          <p className="text-gray-400 mt-1 text-start">Distributor</p>
          <p className="text-cyan-400 font-medium mt-1 text-start">
            
          </p>
        </div>

      </div>
    </div>
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">


  {/* Total Orders */}
  <Card className="
    h-[96px] sm:h-[96px]
    rounded-2xl
    bg-gradient-to-br from-[#020617] to-[#0f172a]
     border border-cyan-400/20
    shadow-[0_0_28px_rgba(34,211,238,0.25)]

  ">
    <CardContent className="h-full px-4 sm:px-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-cyan-400 flex items-center justify-center text-white">
        <LuPackage size={22} />
      </div>
      <div>
        <p className="text-2xl sm:text-2xl font-semibold text-white leading-none text-start">
          1,247
        </p>
        <p className="text-sm text-gray-400 mt-1 text-start">
          Total Orders
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Revenue */}
  <Card className="
    h-[96px] sm:h-[96px]
    rounded-2xl
    bg-gradient-to-br from-[#020617] to-[#0f172a]
    border border-cyan-400/20
    shadow-[0_0_28px_rgba(34,211,238,0.25)]
  ">
    <CardContent className="h-full px-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-green-400 flex items-center justify-center text-white">
        <FiDollarSign  size={22}/>
      </div>
      <div>
        <p className="text-2xl sm:text-2xl font-semibold text-white leading-none text-start">
          ₹2.4 Cr
        </p>
        <p className="text-sm text-gray-400 mt-1 text-start">
          Revenue Generated
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Growth */}
  <Card className="
   h-[96px] sm:h-[96px]
    rounded-2xl
    bg-gradient-to-br from-[#020617] to-[#0f172a]
    border border-cyan-400/20
    shadow-[0_0_28px_rgba(34,211,238,0.25)]
  ">
    <CardContent className="h-full px-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white">
        <MdTrendingUp size={22} />
      </div>
      <div>
        <p className="text-2xl sm:text-2xl font-semibold text-white leading-none text-start">
          +18.5%
        </p>
        <p className="text-sm text-gray-400 mt-1 text-start">
          Growth Rate
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Rating */}
  <Card className="
    h-[96px] sm:h-[96px]
    rounded-2xl
    bg-gradient-to-br from-[#020617] to-[#0f172a]
    border border-cyan-400/20
    shadow-[0_0_28px_rgba(34,211,238,0.25)]
  ">
    <CardContent className="h-full px-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center text-white">
        <FaStar size={22} />
      </div>
      <div>
        <p className="text-2xl sm:text-2xl font-semibold text-white leading-none text-start">
          4.8/5
        </p>
        <p className="text-sm text-gray-400 mt-1 text-start">
          Customer Rating
        </p>
      </div>
    </CardContent>
  </Card>

</div>

 {/* ================= TOP GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Personal Information */}
        <Card className="bg-[#020817] border border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.15)] text-lg">
          <CardHeader className="flex flex-row items-center gap-2 text-white text-lg font-semibold">
            <FiBriefcase className="text-cyan-400" />
            Personal Information
          </CardHeader>

          <CardContent className="space-y-4 text-gray-300">

            <div className="flex gap-3 items-start bg-[#050b16] p-4 rounded-xl">
              <FiMail className="text-cyan-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Email Address</p>
                <p className="text-white">
                  {personAccount?.PersonEmail ??"_"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-[#050b16] p-4 rounded-xl">
              <FiPhone className="text-cyan-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400 text-start">Phone Number</p>
                <p className="text-white text-start">{personAccount?.Phone ??"_"}</p>
                <p className="text-sm text-gray-500">
                  {personAccount?.Phone ??"_"} (Alternate)
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-[#050b16] p-4 rounded-xl">
              <FiMapPin className="text-cyan-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400 text-start">Address</p>
                <p className="text-white text-start">
                  {personAccount?.BillingStreet ??"_"},
                </p>
                <p className="text-sm text-gray-500 text-start">
                 {personAccount?.BillingCity ??"_"},- {personAccount?.BillingPostalCode ??"_"}
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="bg-[#020817] border border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
          <CardHeader className="flex flex-row items-center gap-2 text-white text-lg font-semibold">
            <HiOutlineOfficeBuilding className="text-cyan-400" />
            Business Information
          </CardHeader>

          <CardContent className="space-y-4 text-gray-300 text-start text-medium">

            <div className="flex gap-3 items-start bg-[#050b16] p-4 rounded-xl">
              <HiOutlineOfficeBuilding className="text-cyan-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Company Name</p>
                <p className="text-white">
                  
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-[#050b16] p-4 rounded-xl">
              <Badge className="bg-cyan-400/20 text-cyan-300">
                GST
              </Badge>
              <div>
                <p className="text-sm text-gray-400">GST Number</p>
                <p className="text-white">
                  
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-[#050b16] p-4 rounded-xl">
              <FiCalendar className="text-cyan-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Partnership Since</p>
                <p className="text-white"></p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-[#050b16] p-4 rounded-xl">
              <FiMapPin className="text-cyan-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Assigned Territory</p>
                <p className="text-white">
                  
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* ================= ACHIEVEMENTS ================= */}
      <Card className="bg-[#020817] border border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.15)] mt-7">
        <CardHeader className="flex flex-row items-center gap-2 text-white text-lg font-semibold">
          <RiMedalLine className="text-cyan-400" />
          Achievements & Recognitions
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-start">

          {/* Card 1 */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] border border-yellow-400/30 rounded-xl p-5 shadow-[0_0_30px_rgba(234,179,8,0.25)]">
            <RiMedalLine className="text-yellow-400 text-3xl mb-3" />
            <h3 className="text-yellow-400 font-semibold text-lg">
              Top Performer Q4 2023
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Achieved 150% of quarterly target
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] border border-yellow-400/30 rounded-xl p-5 shadow-[0_0_30px_rgba(234,179,8,0.25)]">
            <RiMedalLine className="text-yellow-400 text-3xl mb-3" />
            <h3 className="text-yellow-400 font-semibold text-lg">
              Best Customer Service
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Highest customer satisfaction rating
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] border border-yellow-400/30 rounded-xl p-5 shadow-[0_0_30px_rgba(234,179,8,0.25)]">
            <RiMedalLine className="text-yellow-400 text-3xl mb-3" />
            <h3 className="text-yellow-400 font-semibold text-lg">
              3 Year Partnership
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Celebrating 3 years of successful partnership
            </p>
          </div>

        </CardContent>
      </Card>


    </div>
  );
};

export default Profile;
