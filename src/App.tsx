import {Routes,Route} from "react-router-dom"
import Login from "./Pages/Login";
import Layout from "./Components/Layout"

import Dashboard from "./Pages/Dashboard"
import Stock from "./Pages/StockManagement"
import Leads from "./Pages/LeadGeneration"
import Warranty from "./Pages/WarrantyRegistration"

function App() {


  return (
    <div>
      <Routes>
       
       <Route path="/" element ={<Login/>} />

       <Route element={<Layout />}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/warranty" element={<Warranty />} />

        </Route>
      </Routes>
    </div>
  )
}

export default App
