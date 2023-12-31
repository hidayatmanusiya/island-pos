import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { IconArrowDown, IconDownload } from '@tabler/icons-react'
import { Parser } from "@json2csv/plainjs";
import { saveAs } from "file-saver"

import { CURRENCIES } from "../../config/currencies.config.js";
import Search from '../../components/Search.jsx';
import { CUSTOMER_TYPE } from '../../config/customerType.config.js';
import { Link } from 'react-router-dom';


export default function ReceiptsPage() {

  const today = new Date()
  const oneMonthFromToday = new Date(today.getFullYear(), today.getMonth()-1, today.getDate());

  const [fromDate, setFromDate] = useState(oneMonthFromToday);
  const [toDate, setToDate] = useState(today);
  const [receipts, setReceipts] = useState([]);

  const [searchValue, setSearchValue] = useState("")

  useEffect(()=>{
    _getAllReceipts();
  },[fromDate, toDate, searchValue]);

  const _getAllReceipts = async () => {
    try {

      const to = `${toDate.getFullYear()}-${(toDate.getMonth() + 1).toString().padStart(2, 0)}-${toDate.getDate().toString().padStart(2, 0)} 23:59:59`;

      const res = await window.api.getReportReciepts(fromDate, to, searchValue);
      console.log(res);
      setReceipts(res);

    } catch (error) {
      console.error(error);
    }
  }

  // get currency
 const currencyCode = window.api.getCurrency();
 const currencyFind =  CURRENCIES.find(c=>c.cc == currencyCode);
 const currencySymbol = currencyFind !== undefined ? currencyFind.symbol : '';
 // get currency

 // data table
 const columns = [
   {
     name: "#",
     selector: row => row.dataValues.id,
     sortable: true,
     width: "70px",
     cell: (row, index, column, rowid) => {
      return <Link className='border-b border-b-indigo-500 bg-transparent text-indigo-500' to={`/print-receipt/${row.dataValues.id}`}>{row.dataValues.id}</Link>
     }
   },
   {
     name: "Date",
     selector: row => new Date(row.dataValues.createdAt).toLocaleDateString(),
     sortable: true,
     width: "120px"
   },
   {
    name: "Customer",
    selector: row => row.dataValues?.Customer?.dataValues?.name || CUSTOMER_TYPE.WALKIN,
    sortable: true,
    width: "160px"
  },
  {
    name: "Payment Method",
    selector: row => row.dataValues?.PaymentType?.dataValues?.name || "",
    sortable: true
  },
  {
    name: "Cart Total",
    selector: row => row.dataValues.cartTotal,
    format: (row, index) => `${currencySymbol}${row.dataValues.cartTotal}`,
    sortable: true
  },
  {
    name: "Tax",
    selector: row => row.dataValues.taxTotal,
    format: (row, index) => `${currencySymbol}${row.dataValues.taxTotal}`,
    sortable: true
  },
  {
    name: "Discount",
    selector: row => row.dataValues.discountValue,
    format: (row, index) => `${currencySymbol}${row.dataValues.discountValue}`,
    sortable: true,
  },
  {
    name: "Total",
    selector: row => row.dataValues.payableTotal,
    format: (row, index) => `${currencySymbol}${row.dataValues.payableTotal}`,
    sortable: true,
  }
 ];
 // data table

  const btnExport = () => {
    const json = receipts.map(r=>({
      id: r.dataValues.id,
      date: new Date(r.dataValues.createdAt).toLocaleString(),
      Customer: r.dataValues?.Customer?.dataValues?.name || CUSTOMER_TYPE.WALKIN,
      PaymentMethod: r.dataValues?.PaymentType?.dataValues?.name || "",
      CartTotal: r.dataValues.cartTotal,
      tax: r.dataValues.taxTotal,
      discount: r.dataValues.discountValue,
      total: r.dataValues.payableTotal
    }));

    const parser = new Parser();
    const csv = parser.parse(json);

    var file = new File([csv], "ipos-receipts.csv", {type: "text/csv;charset=utf-8"});
    saveAs(file);
  }

 return (
   <div className='px-8 py-6 w-full'>
     <div className="flex justify-between items-center">
      <h3>Receipts</h3>
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
     </div>

     <div className="flex gap-4 mt-6 items-end">
       <div>
         <label htmlFor="fromdate" className='block'>From Date</label>
         <input value={`${fromDate.getFullYear()}-${(fromDate.getMonth() + 1).toString().padStart(2, 0)}-${fromDate.getDate().toString().padStart(2, 0)}`} onChange={e=>setFromDate(new Date(e.target.value))} type="date" name="fromdate" id="fromdate" className='block w-60 outline-none text-ipos-grey bg-ipos-grey-50 px-4 py-3 rounded-2xl mt-2' />
       </div>

       <div>
         <label htmlFor="todate" className='block'>To Date</label>
         <input value={`${toDate.getFullYear()}-${(toDate.getMonth() + 1).toString().padStart(2, 0)}-${toDate.getDate().toString().padStart(2, 0)}`} onChange={e=>setToDate(new Date(e.target.value))} type="date" name="todate" id="todate" className='block w-60 outline-none text-ipos-grey bg-ipos-grey-50 px-4 py-3 rounded-2xl mt-2' />
       </div>

       <div>
         <button onClick={btnExport} className='flex gap-2 items-center outline-none text-ipos-grey bg-ipos-grey-50 hover:bg-ipos-grey-100 px-4 py-3 rounded-2xl'>
           <IconDownload/>
           Export
         </button>
       </div>
     </div>

     <div className="mt-8">
       <div className="w-full mt-6 border rounded-2xl p-4">
         <DataTable columns={columns} data={receipts} pagination responsive sortIcon={<IconArrowDown />} />
       </div>
     </div>

   </div>
 )
}
