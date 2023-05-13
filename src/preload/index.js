import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import {addPaymentType,getPaymentTypes, removePaymentType} from "./backend/controllers/paymentType.controller"
import {addTax,getTaxes, removeTax} from "./backend/controllers/taxes.controller"
import {addDiningOption,getDiningOptions,removeDiningOption} from "./backend/controllers/diningOptions.controller"
import {getReceiptSettings,saveReceiptSettings, getCurrency, setCurrency} from "./backend/controllers/receiptSetting.controller"
import {addDiscount,getDiscounts,removeDiscount} from "./backend/controllers/discount.controller"
import { addExpense, getExpenses, removeExpense, updateExpense } from './backend/controllers/expenses.controller'
import { addCustomer,getCustomer, getCustomers, removeCustomer,updateCustomer } from "./backend/controllers/customer.controller"
import { addCategory, getCategories, removeCategory, addProduct, getProduct, getProducts } from "./backend/controllers/product.controller"

// Custom APIs for renderer
const api = {

  // payment types
  addPaymentType,
  getPaymentTypes,
  removePaymentType,
  // payment types

  // taxes
  addTax, 
  getTaxes,
  removeTax,
  // taxes

  // dining options
  addDiningOption,
  getDiningOptions,
  removeDiningOption,
  // dining options

  // receipt settings
  getReceiptSettings,
  saveReceiptSettings,
  getCurrency,
  setCurrency,
  // receipt settings

  // discount
  addDiscount,
  getDiscounts,
  removeDiscount,
  // discount

  // expenses
  addExpense, 
  getExpenses, 
  removeExpense, 
  updateExpense,
  // expenses

  // customers
  addCustomer,
  getCustomer, 
  getCustomers, 
  removeCustomer,
  updateCustomer,
  // customers

  // products
  addCategory, getCategories, removeCategory,
  addProduct, getProduct, getProducts
  // products
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
