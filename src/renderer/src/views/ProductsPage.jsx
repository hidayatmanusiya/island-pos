import React, {Fragment, useEffect, useRef, useState} from 'react'
import Search from '../components/Search.jsx'
import { IconArrowDown, IconCategory2, IconDotsCircleHorizontal, IconDotsVertical, IconDownload, IconEye, IconFileImport, IconPencil, IconPhoto, IconPlus, IconQrcode, IconTrash, IconUpload, IconX } from '@tabler/icons-react'

import { Menu, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { CURRENCIES } from "../config/currencies.config.js";
import { toast } from 'react-hot-toast'
import { blobToBase64 } from '../utils/blobToBase64.js'
import { calculatePriceAfterTax, calculateTax } from '../utils/calculateTax.js'
import DataTable from 'react-data-table-component'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function OptionsMenu({onBtnPrintQR, onBtnExport, onBtnImport}) {
  return <Menu as="div" className="relative inline-block text-left">
  <div>
    <Menu.Button className="flex items-center gap-2 bg-ipos-grey-50 hover:bg-ipos-grey-100 transition text-ipos-grey px-4 py-3 rounded-2xl">
      <IconDotsCircleHorizontal />
      Options
    </Menu.Button>
  </div>

  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">
        <Menu.Item>
          {({ active }) => (
            <button
            onClick={onBtnPrintQR}
              className={classNames(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'flex items-center gap-2 px-4 py-2 text-sm text-left w-full'
              )}
            >
              <IconQrcode />
              <p>Print QR</p>
            </button>
          )}
        </Menu.Item>
      </div>
      {/* <div className="py-1">
        <Menu.Item>
          {({ active }) => (
            <button
            onClick={onBtnImport}
              className={classNames(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'flex items-center gap-2 px-4 py-2 text-sm text-left w-full'
              )}
            >
              <IconFileImport />
              <p>Import</p>
            </button>
          )}
        </Menu.Item>
      </div>
      <div className="py-1">
        <Menu.Item>
          {({ active }) => (
            <button
            onClick={onBtnExport}
              className={classNames(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'flex items-center gap-2 px-4 py-2 text-sm text-left w-full'
              )}
            >
              <IconDownload />
              <p>Export</p>
            </button>
          )}
        </Menu.Item>
      </div> */}
    </Menu.Items>
  </Transition>
</Menu>;
}

function ProductOptionsMenu({ onBtnDelete, onBtnUpdate, onBtnView }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center rounded-md bg-white px-3 py-2 ">
          <IconDotsVertical className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onBtnView}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm text-left w-full'
                  )}
                >
                  View
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onBtnUpdate}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm text-left w-full'
                  )}
                >
                  Update
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onBtnDelete}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm text-left w-full text-red-500'
                  )}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

function ProductOptionsMenu2({ onBtnDelete, onBtnUpdate, onBtnView }) {
  return (
    <div className='flex gap-2'>
      <button
        onClick={onBtnView}
        className='w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600'
      >
        <IconEye />
      </button>
      <button
        onClick={onBtnUpdate}
        className='w-7 h-7 rounded-full flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-400'
      >
        <IconPencil />
      </button>
      <button
        onClick={onBtnDelete}
        className='w-7 h-7 rounded-full flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-400'
      >
        <IconTrash />
      </button>
    </div>
  )
}


export default function ProductsPage() {
  // get currency
  const currencyCode = window.api.getCurrency();
  const currencyFind =  CURRENCIES.find(c=>c.cc == currencyCode);
  const currencySymbol = currencyFind !== undefined ? currencyFind.symbol : '';
  // get currency

  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [categories, setCategories] = useState([])
  const [taxes, setTaxes] = useState([])
  const [products, setProducts] = useState([])
  const [productImage, setProductImage] = useState('');

  const [searchValue, setSearchValue] = useState("");


  const navigate = useNavigate();

  const txtProductTitleRef = useRef(null)
  const txtProductPriceRef = useRef(null)
  const txtProductCostRef = useRef(null)
  const txtProductSKURef = useRef(null)
  const txtProductBarcodeRef = useRef(null)
  const txtProductSoldByRef = useRef(null)
  const txtProductCategoryRef = useRef(null)
  const txtProductTaxRef = useRef(null)


  const txtUpdateProductIDRef = useRef(null)
  const txtUpdateProductTitleRef = useRef(null)
  const txtUpdateProductPriceRef = useRef(null)
  const txtUpdateProductCostRef = useRef(null)
  const txtUpdateProductSKURef = useRef(null)
  const txtUpdateProductBarcodeRef = useRef(null)
  const txtUpdateProductSoldByRef = useRef(null)
  const txtUpdateProductCategoryRef = useRef(null)
  const txtUpdateProductTaxRef = useRef(null)

  

  useEffect(() => {
    _getAllCategories()
    _getAllProducts();
    _getAllTaxes();
  }, [])

  const _getAllCategories = async () => {
    try {
      const res = await window.api.getCategories()
      console.log(res)
      setCategories(res)
    } catch (error) {
      console.log(error)
    }
  };

  const _getAllTaxes = async () => {
    try {
      const res = await window.api.getTaxes()
      console.log(res)
      setTaxes(res)
    } catch (error) {
      console.log(error)
    }
  };

  const _getAllProducts = async () => {
    try {
      const res = await window.api.getProducts()
      console.log(res)
      setProducts(res)
    } catch (error) {
      console.log(error)
    }
  };

  const onBtnPrintQR = async () => {
    navigate('/print-product-codes')
  };

  const onBtnExport = async () => {

  };

  const onBtnImport = async () => {

  };

  const btnCategoriesTap = () => {
    navigate('/categories');
  };

  const btnAddProduct = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false)
  }

  const btnEditProductImage = async () => {
    const imageCompression = await import('browser-image-compression');
    

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.addEventListener("change", async (e)=>{
      // handle file
      const imageFile = e.target.files[0];

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 256,
        useWebWorker: true
      };

      try {
        const compressedFile = await imageCompression.default(imageFile, options);
        // const url = URL.createObjectURL(compressedFile);
        const url = await blobToBase64(compressedFile);

        setProductImage(url);
      } catch (error) {
        console.log(error);
      }

    });

    input.click();
  };

  const btnRemoveProductImage = () => {
    setProductImage(null);
  };

  const btnSaveAddModal = async () => {
    const name = txtProductTitleRef.current.value
    const price = txtProductPriceRef.current.value
    const cost = txtProductCostRef.current.value
    const category = txtProductCategoryRef.current.value;
    const sku = txtProductSKURef.current.value;
    const barcode = txtProductBarcodeRef.current.value;
    const soldBy = txtProductSoldByRef.current.value;
    const tax = txtProductTaxRef.current.value || null;

    const image = productImage;

    if (!name) {
      toast.error('Please Provide Name!')
      return
    }

    if (!price) {
      toast.error('Please Provide Price!')
      return
    }

    if(!category) {
      toast.error("Please select Category \nor Create New Category to add products!");
      return;
    }

    try {
      const res = await window.api.addProduct(name, parseFloat(price), parseFloat(cost), sku, barcode, soldBy, image, category, tax);
      await _getAllProducts()
      toast.success('Product added.')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong while saving details!')
    }

    setShowAddModal(false)
  }

  const btnDeleteProduct = async id => {
    const isConfirm = window.confirm("Are you sure? This process is not reversible ✋🛑");
    if(!isConfirm) {
      return;
    }

    try {
      const res = await window.api.removeProduct(id)
      await _getAllProducts()
      toast.success('Product Removed.')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong while deleting!')
    }
  };


  // update product
  const closeUpdateModal = () => {
    setShowUpdateModal(false)
  }

  const btnUpdateModal = async () => {
    const id = txtUpdateProductIDRef.current.value;
    const name = txtUpdateProductTitleRef.current.value
    const price = txtUpdateProductPriceRef.current.value
    const cost = txtUpdateProductCostRef.current.value
    const category = txtUpdateProductCategoryRef.current.value;
    const sku = txtUpdateProductSKURef.current.value;
    const barcode = txtUpdateProductBarcodeRef.current.value;
    const soldBy = txtUpdateProductSoldByRef.current.value;
    const tax = txtUpdateProductTaxRef.current.value || null;

    const image = productImage;

    if (!name) {
      toast.error('Please Provide Name!')
      return
    }

    if (!price) {
      toast.error('Please Provide Price!')
      return
    }

    if(!category) {
      toast.error("Please select Category \nor Create New Category to add products!");
      return;
    }

    try {
      const res = await window.api.updateProduct(id, name, parseFloat(price), parseFloat(cost), sku, barcode, soldBy, image, category, tax);
      await _getAllProducts()
      toast.success('Product Saved.')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong while saving details!')
    }

    setShowUpdateModal(false)
  };

  const btnUpdateProduct = (id, name, price, cost, categoryId, sku, barcode, soldBy, productImage, taxId) => {
    txtUpdateProductIDRef.current.value = id
    txtUpdateProductTitleRef.current.value = name
    txtUpdateProductPriceRef.current.value = price
    txtUpdateProductCostRef.current.value = cost
    txtUpdateProductSKURef.current.value = sku
    txtUpdateProductBarcodeRef.current.value = barcode
    txtUpdateProductSoldByRef.current.value = soldBy
    txtUpdateProductCategoryRef.current.value = categoryId
    txtUpdateProductTaxRef.current.value = taxId
    setProductImage(productImage);
    setShowUpdateModal(true);
  }
  // update product 


  // data table
  const columns = [
    {
      name: "#",
      selector: row => row.dataValues.id,
      width: "60px",
      sortable: true,
    },
    {
      name: "Image",
      sortable: false,
      cell: (row, index, column, rowid) => {
        const productImage = row.dataValues.image;
        const name = row.dataValues.name;

        return productImage !== undefined && productImage !== null && productImage !== "" 
          ? <img src={productImage} alt="product img" className='w-16 h-16 rounded-2xl object-cover m-2' /> 
          : <div className='w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 text-gray-400'>
            {name[0].toUpperCase()}.
          </div>;
      },
    },
    {
      name: "Product Name",
      selector: row => row.dataValues.name,
      width: "220px",
      sortable: true,
    },
    {
      name: "Price",
      sortable: true,
      selector: (row) => {
        const price = row.dataValues.price;

        // price + tax
        const taxRate = row?.Tax?.dataValues?.taxRate || 0;
        const taxType = row?.Tax?.dataValues?.type || null;

        const calculatedTax = calculateTax(price, taxRate, taxType);
        const priceAfterTax = calculatePriceAfterTax(price, taxRate, taxType);
        // price + tax

        return priceAfterTax;
      },
      cell: (row, index, column, rowid) => {

        const price = row.dataValues.price;

        // price + tax
        const taxRate = row?.Tax?.dataValues?.taxRate || 0;
        const taxType = row?.Tax?.dataValues?.type || null;

        const calculatedTax = calculateTax(price, taxRate, taxType);
        const priceAfterTax = calculatePriceAfterTax(price, taxRate, taxType);
        // price + tax

        return `${currencySymbol}${priceAfterTax}`;
      },
    },
    {
      name: "Cost",
      selector: row => row.dataValues.cost,
      format: (row, index) => `${currencySymbol}${row.dataValues.cost}`,
      sortable: true,
    },
    {
      name: "Category",
      selector: row => row.Category?.dataValues?.name,
      sortable: true,
      maxWidth: "218px"
    },
    {
      name: "SKU",
      selector: row => row.dataValues.sku,
    },
    {
      name: "Barcode",
      selector: row => row.dataValues.barcode,
    },
    {
      name: "Sold By",
      selector: row => row.dataValues.soldBy,
      sortable: true,
    },
    {
      name: "Actions",
      width: "150px",
      sortable: false,
      cell: (row, index, column, rowid) => {
        const id = row.dataValues.id;
        const name = row.dataValues.name;
        const price = row.dataValues.price;
        const cost = row.dataValues.cost;
        const category = row.Category?.dataValues?.name || "";
        const categoryId = row.Category?.dataValues?.id;
        const taxId = row.Tax?.dataValues?.id;
        const sku = row.dataValues.sku;
        const barcode = row.dataValues.barcode;
        const soldBy = row.dataValues.soldBy;

        const productImage = row.dataValues.image;

        return <ProductOptionsMenu2 
          onBtnDelete={()=>{
            btnDeleteProduct(id);
          }} 
          onBtnUpdate={()=>{
            btnUpdateProduct(id, name, price, cost, categoryId, sku, barcode, soldBy, productImage, taxId);
          }} 
          onBtnView={()=>{
            btnUpdateProduct(id, name, price, cost, categoryId, sku, barcode, soldBy, productImage, taxId);
          }}  
        />
        
      }
    }
  ];
  // data table

  const productSearchFilter = (product)=>{
    const id = product.dataValues.id;
    const name = product.dataValues.name;
    const category = product.Category?.dataValues?.name || "";
    const sku = product.dataValues.sku;
    const barcode = product.dataValues.barcode;

    if(searchValue == "") {
      return true;
    }
    if(searchValue.startsWith("#")) {
      const searchId = parseInt(searchValue.replace("#", ""));
      if(!searchId) {
        return true;
      }
      return id == searchId;
    }
    if(String(name).toLowerCase().includes(searchValue.toLowerCase()) || String(category).toLowerCase().includes(searchValue.toLowerCase()) || String(sku).toLowerCase().includes(searchValue.toLowerCase()) || String(barcode).toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }
    return false;
  };

  const productsFiltered = products.filter(productSearchFilter);

  return (
    <div className='py-6'>
      <div className="px-8 pb-2 flex flex-wrap items-center justify-end gap-4 border-b border-ipos-grey-100">
        <button onClick={btnAddProduct} className='flex items-center gap-2 bg-ipos-blue hover:bg-indigo-700 transition text-white px-4 py-3 rounded-2xl'>
          <IconPlus />
          Add Product
        </button>

        <button onClick={btnCategoriesTap} className='flex items-center gap-2 bg-ipos-grey-50 hover:bg-ipos-grey-100 transition text-ipos-grey px-4 py-3 rounded-2xl'>
          <IconCategory2 />
          Categories
        </button>

        <OptionsMenu onBtnPrintQR={onBtnPrintQR} onBtnExport={onBtnExport} onBtnImport={onBtnImport} />

        <Search searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      <div className="w-full">
        <DataTable columns={columns} data={productsFiltered} pagination responsive sortIcon={<IconArrowDown />} />
      </div>

      {/* modal */}
      <div
        className={
          showAddModal
            ? 'w-96 h-[96vh] rounded-2xl bg-white shadow-2xl fixed top-0 right-0 overflow-y-scroll px-4 py-3 mt-4 mr-4'
            : 'hidden'
        }
      >
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={closeAddModal}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-ipos-grey-50 hover:bg-ipos-grey-100 text-ipos-grey"
          >
            <IconX />
          </button>
          <h3>Add Product</h3>
        </div>

        <div className="mt-6">

          <div className=' w-full flex flex-col items-center justify-center mt-8'>
            <div className='relative w-32 h-32 bg-ipos-grey-50 rounded-2xl flex items-center justify-center'>
              
              {
                productImage !== undefined && productImage !== '' && productImage !== null ? 
                  <img src={productImage} alt="logo" className='w-32 h-32 object-cover rounded-2xl' />
                :
                <IconPhoto className='text-ipos-grey' />
              }

              {
                productImage !== undefined && productImage !== '' && productImage !== null ? 
                <button onClick={btnRemoveProductImage} className='absolute -top-4 -right-4 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 transition text-red-600  items-center justify-center flex'>
                <IconTrash />
              </button>
                :
                <button onClick={btnEditProductImage} className="transition bg-white hover:bg-ipos-grey-100 shadow-lg rounded-full absolute -bottom-4 flex items-center justify-center w-8 h-8 ">
                  <IconUpload />
                </button>
              }

              
            </div>
            <p className='mt-4'>Product Image</p>
          </div>


          <label htmlFor="name" className="mt-4 block w-full">
            Product Title
          </label>
          <input
            ref={txtProductTitleRef}
            type="text"
            id="name"
            name="name"
            placeholder="Write Product Name here..."
            className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
          />

          <label htmlFor="price" className="mt-4 block w-full">
            Price
          </label>
          <input
            ref={txtProductPriceRef}
            type="number"
            id="price"
            name="price"
            placeholder="Write Price here..."
            min="0"
            className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
          />

          <label htmlFor="cost" className="mt-4 block w-full">
            Cost
          </label>
          <input
            ref={txtProductCostRef}
            type="number"
            id="cost"
            name="cost"
            min="0"
            placeholder="Write Cost here..."
            className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
          />

          <label htmlFor="category" className="mt-4 block w-full">
            Category
          </label>
          <select
            ref={txtProductCategoryRef}
            id="category"
            name="category"
            placeholder="Select Category here..."
            className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
          >
            <option value="">Select Category</option>
            {categories.map((category, index)=>{
              const id = category.dataValues.id;
              const name = category.dataValues.name;

              return <option value={id} key={index}>{name}</option>
            })}
          </select>

          <label htmlFor="tax" className="mt-4 block w-full">
            Tax
          </label>
          <select
            ref={txtProductTaxRef}
            id="tax"
            name="tax"
            placeholder="Select Tax here..."
            className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
          >
            <option value="">Select Tax</option>
            {taxes.map((tax, index)=>{
              const id = tax.dataValues.id;
              const name = tax.dataValues.name;
              const type = tax.dataValues.type;
              const taxRate = tax.dataValues.taxRate;

              return <option value={id} key={index}>{name} - {type} ({taxRate}%)</option>
            })}
          </select>

          <label htmlFor="sku" className="mt-4 block w-full">
            SKU
          </label>
          <input
            ref={txtProductSKURef}
            type="text"
            id="sku"
            name="sku"
            placeholder="Write SKU here..."
            className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
          />

          <label htmlFor="Barcode" className="mt-4 block w-full">
            Barcode
          </label>
          <input
            ref={txtProductBarcodeRef}
            type="text"
            id="Barcode"
            name="Barcode"
            placeholder="Write Barcode here..."
            className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
          />

          <label htmlFor="soldby" className="mt-4 block w-full">
            Sold By
          </label>
          <select
            ref={txtProductSoldByRef}
            id="soldby"
            name="soldby"
            placeholder="Select Soldby here..."
            className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
          >
            <option value="each">Each</option>
            <option value="weight">Weight</option>
          </select>

        </div>

        <div className="mt-6">
          <button
            onClick={btnSaveAddModal}
            className="rounded-2xl px-4 py-3 bg-ipos-blue hover:bg-ipos-logo-color text-white"
          >
            Save
          </button>
          <button
            onClick={closeAddModal}
            className="rounded-2xl px-4 py-3 bg-ipos-grey-50 hover:bg-ipos-grey-100 text-ipos-grey ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
      {/* modal */}

      {/* update modal */}
      <div
        className={
          showUpdateModal
            ? 'w-96 md:w-[600px] rounded-2xl bg-white shadow-2xl fixed top-0 left-2/4 -translate-x-1/4 overflow-y-scroll px-4 py-3 mt-20 mr-4'
            : 'hidden'
        }
      >
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={closeUpdateModal}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-ipos-grey-50 hover:bg-ipos-grey-100 text-ipos-grey"
          >
            <IconX />
          </button>
          <h3>Update Product</h3>
        </div>

        <div className="mt-6">

          <div className="flex gap-6 w-full mt-8">
            <div className='w-full flex flex-col items-center justify-center '>
              <div className='relative w-32 h-32 bg-ipos-grey-50 rounded-2xl flex items-center justify-center'>
                
                {
                  productImage !== undefined && productImage !== '' && productImage !== null ? 
                    <img src={productImage} alt="logo" className='w-32 h-32 object-cover rounded-2xl' />
                  :
                  <IconPhoto className='text-ipos-grey' />
                }

                {
                  productImage !== undefined && productImage !== '' && productImage !== null ? 
                  <button onClick={btnRemoveProductImage} className='absolute -top-4 -right-4 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 transition text-red-600  items-center justify-center flex'>
                  <IconTrash />
                </button>
                  :
                  <button onClick={btnEditProductImage} className="transition bg-white hover:bg-ipos-grey-100 shadow-lg rounded-full absolute -bottom-4 flex items-center justify-center w-8 h-8 ">
                    <IconUpload />
                  </button>
                }

                
              </div>
              <p className='mt-4'>Product Image</p>
            </div>

            <div className=' flex-shrink-0'>
              <label htmlFor="name" className="block w-full">
                Product Title
              </label>
              <input
                ref={txtUpdateProductTitleRef}
                type="text"
                id="name"
                name="name"
                placeholder="Write Product Name here..."
                className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
              />
              <div className="flex gap-4">
                <div className='w-full'>
                  <label htmlFor="price" className="mt-4 block w-full">
                    Price
                  </label>
                  <input
                    ref={txtUpdateProductPriceRef}
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Write Price here..."
                    min="0"
                    className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
                  />
                </div>

                <div className='w-full'>
                  <label htmlFor="cost" className="mt-4 block w-full">
                    Cost
                  </label>
                  <input
                    ref={txtUpdateProductCostRef}
                    type="number"
                    id="cost"
                    name="cost"
                    min="0"
                    placeholder="Write Cost here..."
                    className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
                  />
                </div>
              </div>
            </div>
            
          </div>

          <input type="hidden" ref={txtUpdateProductIDRef} />

          <div className="flex gap-4 mt-4">
            <div className='w-full'>
              <label htmlFor="category" className="mt-4 block w-full">
                Category
              </label>
              <select
                ref={txtUpdateProductCategoryRef}
                id="category"
                name="category"
                placeholder="Select Category here..."
                className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
              >
                <option value="">Select Category</option>
                {categories.map((category, index)=>{
                  const id = category.dataValues.id;
                  const name = category.dataValues.name;

                  return <option value={id} key={index}>{name}</option>
                })}
              </select>
            </div>

            <div className='w-full'>
              <label htmlFor="soldby" className="mt-4 block w-full">
                Sold By
              </label>
              <select
                ref={txtUpdateProductSoldByRef}
                id="soldby"
                name="soldby"
                placeholder="Select Soldby here..."
                className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
              >
                <option value="each">Each</option>
                <option value="weight">Weight</option>
              </select>
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="tax" className="mt-4 block w-full">
              Tax
            </label>
            <select
              ref={txtUpdateProductTaxRef}
              id="tax"
              name="tax"
              placeholder="Select Tax here..."
              className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
            >
              <option value="">Select Tax</option>
              {taxes.map((tax, index)=>{
                const id = tax.dataValues.id;
                const name = tax.dataValues.name;
                const type = tax.dataValues.type;
                const taxRate = tax.dataValues.taxRate;

                return <option value={id} key={index}>{name} - {type} ({taxRate}%)</option>
              })}
            </select>
          </div>

          <div className="flex gap-4">
            <div className='w-full'>
              <label htmlFor="sku" className="mt-4 block w-full">
                SKU
              </label>
              <input
                ref={txtUpdateProductSKURef}
                type="text"
                id="sku"
                name="sku"
                placeholder="Write SKU here..."
                className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
              />
            </div>

            <div className='w-full'>
              <label htmlFor="Barcode" className="mt-4 block w-full">
                Barcode
              </label>
              <input
                ref={txtUpdateProductBarcodeRef}
                type="text"
                id="Barcode"
                name="Barcode"
                placeholder="Write Barcode here..."
                className="block w-full px-4 py-3 bg-ipos-grey-50 rounded-2xl mt-1 outline-ipos-blue"
              />
            </div>
          </div>

        </div>

        <div className="mt-6">
          <button
            onClick={btnUpdateModal}
            className="rounded-2xl px-4 py-3 bg-ipos-blue hover:bg-ipos-logo-color text-white"
          >
            Save
          </button>
          <button
            onClick={closeUpdateModal}
            className="rounded-2xl px-4 py-3 bg-ipos-grey-50 hover:bg-ipos-grey-100 text-ipos-grey ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
      {/* update modal */}
    </div>
  )
}
